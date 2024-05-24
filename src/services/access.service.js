const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError, AuthFailureError, NotFoundError } = require("../core/error.response");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenServices = require("./keyToken.service");
const { getInfoData } = require("../utils");
const db = require('../models');
const { findByEmail, findByUserId, updateUserByUserId } = require("../models/repo/accsess.repo");
const userValidate = require("../helper/validation");

RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
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

       const match = await bcrypt.compare( password, foundUser.password );
       if(!match) throw new AuthFailureError('Authencation error');


       const privateKey = crypto.randomBytes(64).toString('hex');
       const publicKey = crypto.randomBytes(64).toString('hex');

    
       const { id: userId } = foundUser;
       const tokens = await createTokenPair({ userId, email }, publicKey, privateKey );
       
       await KeyTokenServices.createKeyToken({
           refreshToken: tokens.refreshToken,
           userId,
           publicKey,
           privateKey,
       })

       return {
           shop: getInfoData({ fileds:['id', 'name', 'email'], object:foundUser }),
           tokens
       }
   }

   static signUp = async ({ name, email, password, address})=>{
            const { error } = userValidate({ email, password });
            if( error ) throw new NotFoundError(error.details[0].message);
            
            const foundUser= await db.User.findOne({
                where: {email: email},
            })
            if(foundUser){
                throw new BadRequestError('Error: Shop already registered!');
            }
    
            const salt = 10;
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = await db.User.create({ name, email, password: passwordHash, address });

           if(newUser){

               const privateKey = crypto.randomBytes(64).toString('hex');
               const publicKey = crypto.randomBytes(64).toString('hex');
               console.log({privateKey,publicKey});

               const keyUser = await KeyTokenServices.createKeyToken({
                   userId:newUser.id,
                   publicKey,
                   privateKey
               });
               if(!keyUser){
                   throw new BadRequestError('Error: keyUser error!');
               }

               const tokens = await createTokenPair({ userId:newUser.id, email }, publicKey, privateKey );
               console.log("tokens create successfully!", tokens);

               return {
                   code: 201,
                   metadata: {
                       shop: getInfoData({ fileds:['_id', 'name', 'email'], object:newUser }),
                       tokens
                   }
               }
           }
           return null;
   }

   static logout = async ( keyStore ) => {
        const delKey = await KeyTokenServices.removeToken(keyStore.id);
        console.log("delKey", delKey);
        return delKey;
   }

   static getProfile = async ( userId )=>{
        const foundUser = await findByUserId({userId});
        if(!foundUser) throw new BadRequestError('User is not registered');
        return foundUser;
   }

   static updateUser = async ({ userId, payload }) => {
        const foundUser = await findByUserId({userId}); 
        if(!foundUser) throw new BadRequestError('User is not registered');

        const updateUser = await updateUserByUserId({userId, payload});
        return updateUser;
   }

}

module.exports = AccessService