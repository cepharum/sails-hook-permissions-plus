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
				"POST /auth/update/:id" : function( req, res, next ) {
					var error;

					if ( !sails.models.Passport ) {
						error = new Error( "Missing Passport model. Is sails-permissions installed?" );

						sails.log.error( error );
						res.json( { error: error.message } ).end( 500 );

						return;
					}

					var userId = parseInt( req.params.id );
					if ( !( userId > 0 ) ) {
						error = new Error( "invalid user id" );

						res.json( { error: error.message } ).end( 400 );

						return;
					}

					sails.models.Passport
						.findOne( { user: userId } )
						.then( function( passport ) {

						} );
				}
			}
		}
	};
};
