const db = require('../models');
const crypto = require('crypto');
const KeyTokenServices = require('./keyToken.service');
const { setHashValue } = require('../models/repo/cache/cache.redis');
const { getInfoData } = require('../utils');
const { createTokenPair } = require('../auth/authUtils');
const { BadRequestError } = require('../core/error.response');
const { getRoleByName } = require('./role.service');
const { CACHE_USER } = require('../config/constant');

const Role = {
    USER:'User',
}
const loginSuccess = async (userId, oauth_hash_confirm) => {
    return new Promise( async (resolve, reject) => {
        try {
            const foundUser = await db.User.findOne({
                where: { id: userId, usr_password: oauth_hash_confirm },
                raw: true
            });

            console.log("foundUser", foundUser);
            if(!foundUser) reject("User not found!!");

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            console.log({privateKey,publicKey});

            const newTokens = await KeyTokenServices.createKeyToken({
                userId: foundUser.id,
                publicKey,
                privateKey
            });
            if(!newTokens){
                throw new BadRequestError('Error: newTokens save error!');
            }
            console.log("newTokens", newTokens);
            const payload = {
                sub: foundUser.id,
                email: foundUser.usr_email,
                roleId: foundUser.usr_role_id
            }

            console.log("payload ", payload);

            const tokens = await createTokenPair(payload, publicKey, privateKey );
            console.log("tokens create successfully!", tokens);
            if(!tokens) {
                throw new BadRequestError("token create failed!");
            }

            const keyUser = `${CACHE_USER.user}${foundUser.id}`
            await setHashValue(
                keyUser, 
                'accessToken', 
                tokens.accessToken, 
                'refreshToken', 
                tokens.refreshToken, 
                'publicKey',
                newTokens.publicKey,
                'roleId',
                foundUser.usr_role_id,
            )

            resolve({
                err: tokens ? 0 : 3,
                shop: getInfoData({ fileds:['id', 'usr_email'], object:foundUser }),
                tokens
            });

        } catch (error) {
            reject({
                err: 2,
                message: 'fail at auth server'+ error
            });
        }
    });
}

const getUserById = async (userId) => {
    return new Promise( async (resolve, reject) => {
        try {
            const foundUser = await db.User.findOne({
                where: { id: userId },
                raw: true
            });
            if(!foundUser) reject("User not found!!");

            resolve({
                err: foundUser ? 0 : 3,
                foundUser
            });
        } catch (error) {
            reject({
                err: 2,
                message: 'fail at auth server'+ error
            });
        }
    });
}

module.exports = {
    loginSuccess,
    getUserById
}