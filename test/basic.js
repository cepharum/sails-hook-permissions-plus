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

var SAILS  = require( "sails" ).Sails;
var EXPECT = require( "expect.js" );

describe( "permissions-plus hook", function() {

	var sails;

	before( "lift sails", function( done ) {
		this.timeout( 11000 );

		// Try lifting sails
		SAILS().lift( {
			hooks: {
				"sails-hook-permissions-plus": require( "../" ),
				"grunt": false
			},
			log:   { level: "error" },
			models: {
				migrate: "drop"
			}
		}, function( err, _sails ) {
			if ( err ) {
				return done( err );
			}

			sails = _sails;

			return done();
		} );
	} );

	after( "lower sails", function( done ) {
		if ( sails ) {
			sails.lower( done );
		} else {
			done();
		}
	} );


	it( "properly integrates with sails", function() {
	} );

	it( "assures to reject unauthenticated POST requests at endpoint /user/password", function( done ) {
		sails.request( {
			method: "POST",
			url: "/user/update/1",
			data: "secret"
		}, function( err, res, body ) {
			EXPECT( err ).to.be.ok();
			EXPECT( err.status ).to.equal( 403 );

			done();
		} );
	} );

	// FIXME Test does not work due to sails-permissions requiring manual configuration of policies for AuthController granted access to Passport's req.login().
	it.skip( "assures to process authenticated POST requests at endpoint /user/password", function( done ) {
		sails.request( {
			method: "POST",
			url: "/auth/local",
			data: {
				identifier: "admin",
				password: "admin1234"
			}
		}, function( err, res, body ) {
			EXPECT( err ).not.to.be.ok();
			EXPECT( res ).to.be.ok();
			EXPECT( body ).to.be.ok();
			EXPECT( body.id ).to.be.above( 0);

			sails.request( {
				method: "POST",
				url: "/user/update/" + body.id,
				data: "secret"
			}, function( err, res, body ) {
				EXPECT( err ).not.to.be.ok();
				EXPECT( res ).to.be.ok();

				done();
			} );
		} );
	} );

} );
