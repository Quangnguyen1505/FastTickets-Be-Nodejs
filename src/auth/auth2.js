const passport = require('passport');
const JWT = require('jsonwebtoken');
const db = require('../models');

const authenOauth = async (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        req.user = profile
        next()
    })(req, res, next)
}

const authencationV1 = async (req, res, next) => {
    const token = req?.headers?.authencation;
    const extractedToken = token.split(' ')[1];
    if(extractedToken == "null") {
        return res.status(200).json({
            message: "Token invalid"
        })
    }
    const foundUserByToken = await db.OauthUser.findOne({
        where: {
            oauth_token: extractedToken
        }
    });
    if(foundUserByToken){
        try {
            const decodeUser = JWT.verify( extractedToken, foundUserByToken.oauth_publickey );
            console.log("decode::", decodeUser);
            
            req.current = decodeUser;
            return next();
        } catch (error) {
            console.error(error)
        }   
    }

}

module.exports = {
    authenOauth,
    authencationV1
}