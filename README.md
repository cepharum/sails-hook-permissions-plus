# sails-hook-permissions-plus

Injects features still missing in sails-permissions.


## Installation

	npm install sails-hook-permissions-plus

## Usage

This hook currently adds special routes to your sailsjs application adding 
features missing in sails-permissions currently.

### POST /user/password

In sails-auth a user's password isn't saved in model `User`. Instead a separate
but related model `Passport` is used to provide authentication data per user
depending on authentication protocol used. Thus `/user/password` was introduced
rather than extending blueprint rout `/user/update` to keep this separation
transparent.

* Adjusting a user's password is available by POSTing string to URL
  `/user/password/<user-id>`. 
* Optionally JSON object containing property `password` might be POSTed to URL
  `/user/password/<user-id>`.
* Finally JSON object containing password in `password` and user's ID or name in
  `id` might be POSTed to URL `/user/password`.

In either case user might be selected by its numeric ID or by its name.
