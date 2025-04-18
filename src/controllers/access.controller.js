const { SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController{
    signUp = async ( req, res, next ) => {
        const {shop, tokens} = await AccessService.signUp(req.body);
        res.cookie('authorization', tokens.accessToken, 
            {
                httpOnly: true, 
                secure: false,
                sameSite: 'Strict'
            }
        );
        res.cookie('x-client-id', shop.id, 
            {
                httpOnly: true, 
                secure: false,
                sameSite: 'Strict'
            }
        );

        new SuccessResponse({
            message: "SignUp successful",
            metadata: {shop, tokens}
        }).send(res);
    }

    login = async ( req, res, next ) => {
        const {shop, tokens} = await AccessService.login(req.body);
        res.cookie('authorization', tokens.accessToken, 
            {
                httpOnly: true, 
                secure: false,
                sameSite: 'Strict'
            }
        );
        res.cookie('x-client-id', shop.id, 
            {
                httpOnly: true, 
                secure: false,
                sameSite: 'Strict'
            }
        );

        new SuccessResponse({
            message: "login user success",
            metadata: {shop, tokens}
        }).send(res);
    } 

    logout = async (req,res,next) => {
        new SuccessResponse({
            message: "logout user success",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }
}


module.exports = new AccessController();