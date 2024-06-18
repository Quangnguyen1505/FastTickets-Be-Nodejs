const { SuccessResponse } = require("../core/success.response");
const { loginSuccess } = require("../services/oauth.service");

class Oauth2Controller{
    oauthGoogleCallback = async ( req, res, next ) => {
        const userId = req.user?.id;
        const oauth_login = req.user?.oauth_token;
        res.redirect(`${process.env.URL_CLIENT}/login-success/${userId}/${oauth_login}`);
    }

    loginSuccess = async ( req, res, next ) => {
        const { id, tokenLogin } = req.body;
        new SuccessResponse({
            message: 'login success',
            metadata: await loginSuccess(id, tokenLogin) 
        }).send(res);
    }
}

module.exports = new Oauth2Controller();