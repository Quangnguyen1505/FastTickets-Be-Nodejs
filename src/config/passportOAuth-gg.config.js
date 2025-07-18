var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const db = require('../models');
const { v4: uuidv4 } = require ('uuid');
const { getRoleByName } = require('../services/role.service');
const { BadRequestError } = require('../core/error.response');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, URL_SERVER } = process.env;
const Role = {
  USER:'User',
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${URL_SERVER}/v1/api/oauth/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log("profile", profile);
    const foundRole = await getRoleByName(Role.USER)
    if(!foundRole) throw new BadRequestError('Role not exists')

    const usr_password = uuidv4();
    profile.oauth_hash_confirm = usr_password;
    let response = await db.User.findOrCreate({ 
      where: { user_oauth_provider_id: profile.id },
      defaults: {
        id: uuidv4(),
        usr_email: profile.emails[0]?.value,
        usr_first_name: profile?.name.familyName,
        usr_last_name: profile?.name.givenName,
        usr_avatar_url: profile?.photos[0]?.value,
        usr_password,
        usr_role_id: foundRole.id,
        user_oauth_provider: 'google',
        user_oauth_provider_id: profile.id,
      } 
    });
    const userId = response[0].id;
    console.log("userId ", userId);
    profile.userId = userId;

    if(!response[1]) {
      await db.User.update(
        { usr_password }, 
        { where: { user_oauth_provider_id: profile.id } 
      });
    }

    return cb(null, profile);
  }
));