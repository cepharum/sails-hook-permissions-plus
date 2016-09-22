# sails-hook-permissions-plus

Injects features still missing in sails-permissions.


## Installation

	npm install sails-hook-permissions-plus

## Usage

This hook currently adds special routes to your sailsjs application adding 
features missing in sails-permissions currently.

### POST /user/password

Updates password of selected user. 

In sails-auth a user's password isn't saved in model `User`. Instead a separate
but related model `Passport` is used to provide authentication data per user
depending on authentication protocol used. Thus `/user/password` was introduced
rather than extending blueprint route `/user/update` to keep this separation
transparent.

> This feature is injected into `/user` rather than `/auth` for the latter being
  open to the public according to default configuration of policies according to
  sails-permissions.

* Adjusting a user's password is available by POSTing string to URL
  `/user/password/<user-id>`. 
* Optionally JSON object containing property `password` might be POSTed to URL
  `/user/password/<user-id>`.
* Finally JSON object containing password in `password` and user's ID or name in
  `id` might be POSTed to URL `/user/password`.

In either case user might be selected by its numeric ID or by its name.

> This endpoint does not check password strength (as this is considered to be
  part of model defined in sails-auth) nor does it check if current user is 
  authorized to change password of selected user (as this is considered to be 
  done using policies as provided by sails-permissions). However, this endpoint
  requires some authenticated user's session to be available.
