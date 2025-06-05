var FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const db = require('../models');
const { v4: uuidv4 } = require ('uuid');
const { getRoleByName } = require('../services/role.service');
const { BadRequestError } = require('../core/error.response');

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;
const Role = {
  USER:'User',
}

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/v1/api/oauth/facebook/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log("profile fb ", profile);
    const foundRole = await getRoleByName(Role.USER)
    if(!foundRole) throw new BadRequestError('Role not exists')

    const usr_password = uuidv4();
    profile.oauth_hash_confirm = usr_password;
    let response = await db.User.findOrCreate({ 
      where: { user_oauth_provider_id: profile.id },
      defaults: {
        id: uuidv4(),
        // usr_email: profile.emails[0]?.value,
        // usr_first_name: profile?.name.familyName,
        usr_last_name: profile?.displayName,
        // usr_avatar_url: profile?.photos[0]?.value,
        usr_password,
        usr_role_id: foundRole.id,
        user_oauth_provider: profile.provider,
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