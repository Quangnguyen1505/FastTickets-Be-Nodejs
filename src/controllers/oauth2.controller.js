const { SuccessResponse } = require("../core/success.response");
const { loginSuccess, getUserById } = require("../services/oauth.service");
const passport = require('passport');

class Oauth2Controller{
    oauth2Login = async ( req, res, next ) => {
        const { provider } = req.params;
        let scopes 
        if (provider === 'google') {
            scopes = ['profile', 'email'];
        } else {
            scopes = ['public_profile', 'email'];
        }
        passport.authenticate(provider, { scope: scopes, session: false })(req, res, next);
    }

    oauth2Callback = async ( req, res, next ) => {
        const userId = req.userId;
        const oauth_login = req.user?.oauth_hash_confirm;
        res.redirect(`${process.env.URL_CLIENT}/login-success/${userId}/${oauth_login}`);
    }

    loginSuccess = async ( req, res, next ) => {
        const { id, oauth_hash_confirm } = req.body;
        console.log("id and hash", {id, oauth_hash_confirm});
        
        new SuccessResponse({
            message: 'login success',
            metadata: await loginSuccess(id, oauth_hash_confirm) 
        }).send(res);
    }

    getcurrentUser = async ( req, res, next ) => {
        const { id } = req?.userId;
        new SuccessResponse({
            message: 'login success',
            metadata: await getUserById(id) 
        }).send(res);
    }
}

module.exports = new Oauth2Controller();