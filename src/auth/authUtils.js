const JWT = require('jsonwebtoken');
const asyncHandler = require('../helper/asyncHandler')
const db = require('../models');
const { findByUserId } = require('../services/keyToken.service');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}
const createTokenPair = async ( payload, publicKey, privateKey )=>{
    try {
        const asscessToken = JWT.sign( payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = JWT.sign( payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        });

        JWT.verify( asscessToken, publicKey, ( err, decode )=>{
            if(err){
                console.log("asscessToken verify error",err);
            }else{
                console.log("asscessToken verify successfully! ",decode);
            }
        });

        return {asscessToken,refreshToken};

    } catch (error) {
        return error
    }
}

const authencationV2 = asyncHandler ( async ( req, res, next)=>{
    /*
      1. Check userId missing ?
      2. get asscessToken
      3. Verify Token
      4. Check user in dbs
      5. Check key Store with this userId
      6. OK all => return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if( !userId ) throw new AuthFailureError('Invalid Request');

    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Not Found keyStore');
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    if(refreshToken){
        try {

            const decodeUser = JWT.verify( refreshToken, keyStore.privateKey );
    
            if( userId !== decodeUser.userId ) throw new AuthFailureError('Invalid UserId');
    
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
            
        } catch (error) {
            throw error;
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if( !accessToken ) throw new AuthFailureError('Invalid Request');
    const extractedToken = accessToken.split(' ')[1];
    try {

        const decodeUser = JWT.verify( extractedToken, keyStore.publicKey );
        console.log("decode::", decodeUser);

        if( userId !== decodeUser.userId ) throw new AuthFailureError('Invalid UserId');

        req.keyStore = keyStore;
        req.userId = decodeUser.userId;
        req.user = decodeUser;
        return next();
        
    } catch (error) {
        throw error;
    }
});

module.exports = {
    createTokenPair,
    authencationV2
}