const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenServices = require("./keyToken.service");
const { getInfoData } = require("../utils");
const db = require('../models');

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
       //1.
       const foundShop = await findByEmail({ email });
       if(!foundShop) throw new BadRequestError('Shop is not registered');

       //2.
       const match = await bcrypt.compare( password, foundShop.password );
       if(!match) throw new AuthFailureError('Authencation error');

       //3.
       const privateKey = crypto.randomBytes(64).toString('hex');
       const publicKey = crypto.randomBytes(64).toString('hex');

       //4.
       const { _id: userId } = foundShop;
       const tokens = await createTokenPair({ userId, email }, publicKey, privateKey );
       
       await KeyTokenServices.createKeyToken({
           refreshToken: tokens.refreshToken,
           userId,
           publicKey,
           privateKey,
       })

       return {
           shop: getInfoData({ fileds:['_id', 'name', 'email'], object:foundShop }),
           tokens
       }
   }

   static signUp = async ({ name, email, password, address})=>{
       // try {
           
           // step1: check email exists??
        //    const user = await db.User.findOrCreate({
        //         where: {email: email},
        //         defaults: { name, email, password, address }
        //    })
            const foundUser= await db.User.findOne({
                where: {email: email},
            })
            if(foundUser){
                throw new BadRequestError('Error: Shop already registered!');
            }
            // step2: hash password
            const passwordHash = await bcrypt.hash(password, 10);

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
               // create token pair
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

}

module.exports = AccessService