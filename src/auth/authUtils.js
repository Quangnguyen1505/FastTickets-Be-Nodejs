const JWT = require('jsonwebtoken');
const { handlerError:asyncHandler } = require('../helper/asyncHandler')
const { findByUserId } = require('../services/keyToken.service');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const logger = require('../loggers/winston.log');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}
const createTokenPair = async ( payload, publicKey, privateKey )=>{
    try {
        const accessToken = JWT.sign( payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = JWT.sign( payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        });

        JWT.verify( accessToken, publicKey, ( err, decode )=>{
            if(err){
                console.log("accessToken verify error",err);
            }else{
                console.log("accessToken verify successfully! ",decode);
            }
        });

        return {accessToken,refreshToken};

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
    
    // const userId = req.cookies[HEADER.CLIENT_ID];
    // if( !userId ) throw new AuthFailureError('Invalid Request');
    if( !userId ) return;
    
    const keyStore = await findByUserId(userId);
    // console.log("keyStore::", keyStore);
    if(!keyStore) throw new NotFoundError('Not Found keyStore');
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    // const refreshToken = req.cookies[HEADER.REFRESHTOKEN];
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

    const headerToken = req.headers[HEADER.AUTHORIZATION];
    // const accessToken = req.cookies[HEADER.AUTHORIZATION];
    if( !headerToken ) throw new AuthFailureError('Invalid Request');
    const accessToken = headerToken.split(' ')[1];
    try {

        const decodeUser = JWT.verify( accessToken, keyStore.publicKey );
        console.log("decode::", decodeUser);
        
        if( userId != decodeUser.sub ) throw new AuthFailureError('Invalid UserId');
        
        req.keyStore = keyStore;
        req.userId = decodeUser.sub;
        req.user = decodeUser;
        req.email = decodeUser.email;
        return next();
        
    } catch (error) {
        throw error;
    }
});

module.exports = {
    createTokenPair,
    authencationV2
}