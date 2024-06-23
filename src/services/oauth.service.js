const db = require('../models');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require ('uuid');

const loginSuccess = async (userId, oauth_hash_confirm) => {
    return new Promise( async (resolve, reject) => {
        try {
            const foundUser = await db.OauthUser.findOne({
                where: { id: userId, oauth_hash_confirm },
                raw: true
            });
            if(!foundUser) reject("User not found!!");

            const publicKey = crypto.randomBytes(64).toString('hex');
            const token = await foundUser && JWT.sign( {
                id: foundUser.id, 
                oauth_email: foundUser.oauth_email,
                oauth_role: foundUser.oauth_role
            }, publicKey, {
                expiresIn: '2 days'
            });

            resolve({
                err: token ? 0 : 3,
                token
            });

            if(foundUser){
                const oauth_hash_confirm = uuidv4();
                await db.OauthUser.update({
                    oauth_hash_confirm,
                    oauth_token: token,
                    oauth_publickey: publicKey
                },{
                    where: {
                        id: foundUser.id
                    }
                })
            }

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
            const foundUser = await db.OauthUser.findOne({
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