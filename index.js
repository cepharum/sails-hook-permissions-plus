/**
 * (c) 2016 cepharum GmbH, Berlin, http://cepharum.de
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 cepharum GmbH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @author: cepharum
 */

module.exports = function( sails ) {

	return {
		routes: {
			after: {
				"POST /user/password/:id": _updateUserPassport,
				"POST /user/password": _updateUserPassport
			}
		}
	};


	function _updateUserPassport( req, res, next ) {
		var record = req.body,
		    id     = req.param( "id");

		if ( !req.session || !req.session.authenticated ) {
			sails.log.error( "unauthenticated request for changing password" );
			return res.forbidden();
		}

		switch ( typeof record ) {
			case "string" :
				if ( id ) {
					record = {
						password: record
					};

					break;
				}

				record = false; // make it fall through cases to reach default

				// falls through
			case "object" :
				if ( record ) {
					break;
				}

				// falls through
			default :
				return res.badRequest();
		}

		// validate information available for selecting user owning passport
		var query = {};
		if ( id > 0 ) {
			query.id = parseInt( id );
		} else if ( id ) {
			query.username = id;
		} else if ( record.hasOwnProperty( "id" ) ) {
			query.id = record.id;
		} else if ( record.hasOwnProperty( "username" ) ) {
			query.username = record.username;
		} else {
			return res.notFound( new Error( "request does not select user" ) );
		}

		// validate provision of password
		var password = record.password;
		if ( typeof password !== "string" || !password.trim().length ) {
			return res.badRequest();
		}


		sails.log.debug( "request for updating passport on user", query );

		// look up selected user
		sails.models.user
			.findOne( query )
			.then( function( user ) {
				sails.log.debug( "found user", user );

				// update (any) passport owned by user
				return sails.models.passport
					.update( {
						user: user.id,
						protocol: "local"
					}, {
						password: password
					} )
					.then( function() {
						sails.log.debug( "updated passport" );
						res.ok();
					} );
			} )
			.catch( function( error ) {
				res.serverError( error );
			} );

	}
};
