const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError, AuthFailureError, NotFoundError } = require("../core/error.response");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenServices = require("./keyToken.service");
const { getInfoData } = require("../utils");
const db = require('../models');
const { findByEmail } = require("../models/repo/accsess.repo");
const userValidate = require("../helper/validation");
const { development } = require("../config/config");
const { getRoleByName } = require("./role.service");
const { CACHE_USER } = require("../config/constant");
const { setHashValue, deleteHashField } = require("../models/repo/cache/cache.redis");

const Role = {
    USER:'User',
}

class AccessService {
    static login = async ({ email, password, refreshToken = null })=>{
        /*
           1. Check email in dbs
           2. match password
           3. create AT vs RT and save
           4. generate token
           5. get data return login
       */

       const foundUser = await findByEmail({ email });
       if(!foundUser) throw new BadRequestError('Shop is not registered');

       console.log("foundShop::", foundUser);

       const match = await bcrypt.compare( password, foundUser.usr_password );
       if(!match) throw new AuthFailureError('Authencation error');


       const privateKey = crypto.randomBytes(64).toString('hex');
       const publicKey = crypto.randomBytes(64).toString('hex');

    
       const { id: userId } = foundUser;
       const payload = {
            sub: userId,
            email,
       } 
       const tokens = await createTokenPair(payload, publicKey, privateKey );
       const keyUser = `${CACHE_USER.user}${userId}`
       if(tokens) {
        await KeyTokenServices.createKeyToken({
            refreshToken: tokens.refreshToken,
            userId,
            publicKey,
            privateKey,
        })
        await setHashValue(
            keyUser, 
            'accessToken', 
            tokens.accessToken, 
            'refreshToken', 
            tokens.refreshToken,
            'publicKey',
            publicKey
        )
       }

       return {
           shop: getInfoData({ fileds:['id', 'email'], object:foundUser }),
           tokens
       }
   }

   static signUp = async ({ email, password })=>{
    const { error } = userValidate({ email, password });
    if( error ) throw new NotFoundError(error.details[0].message);
    
    const foundUser= await db.User.findOne({
        where: {usr_email: email},
    })
    if(foundUser){
        throw new BadRequestError('Error: Shop already registered!');
    }

    const foundRole = await getRoleByName(Role.USER)
    if(!foundRole) throw new BadRequestError('Role not exists')

    const salt = 10;
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.User.create({ 
        usr_email: email, 
        usr_password: passwordHash, 
        usr_salf: salt,
        usr_role_id: foundRole.id
    });

    if(newUser){

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        console.log({privateKey,publicKey});

        const newTokens = await KeyTokenServices.createKeyToken({
            userId:newUser.id,
            publicKey,
            privateKey
        });
        if(!newTokens){
            throw new BadRequestError('Error: newTokens save error!');
        }
        const payload = {
            sub: newUser.id,
            email,
       } 
        const tokens = await createTokenPair(payload, publicKey, privateKey );
        console.log("tokens create successfully!", tokens);
        if(!tokens) {
            throw new BadRequestError("token create failed!");
        }

        const keyUser = `${CACHE_USER.user}${newUser.id}`
        await setHashValue(
            keyUser, 
            'accessToken', 
            tokens.accessToken, 
            'refreshToken', 
            tokens.refreshToken, 
            'publicKey',
            newTokens.publicKey
        )

        return {
            shop: getInfoData({ fileds:['id', 'usr_email'], object:newUser }),
            tokens
        }
    }
    return null;
   }

   static logout = async ( keyStore ) => {
        const delKey = await KeyTokenServices.removeToken(keyStore.id);
        if(delKey) {
            await deleteHashField(`${CACHE_USER.user}${keyStore.id}`, 'accessToken');
            await deleteHashField(`${CACHE_USER.user}${keyStore.id}`, 'refreshToken');
            await deleteHashField(`${CACHE_USER.user}${keyStore.id}`, 'publicKey');
        }
        return delKey;
   }

}

module.exports = AccessService