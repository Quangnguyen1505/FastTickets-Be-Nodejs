const db = require('../models');

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            let createToken;
            const fitler = { user_id: userId }, update = {
                 publicKey, privateKey, refreshTokensUsed: [], refreshToken
            };
            createToken = await db.keyToken.findOrCreate({
                where: fitler,
                defaults: { user_id: userId, publicKey, privateKey, refreshToken }
            });

            if(!createToken[1]){
                createToken = await db.keyToken.update(update, { where: fitler });
            }
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        return await db.keyToken.findOne({
            where: {user_id: userId}
        })
    }

    static removeToken = async ( keyToken ) => {
        return await db.keyToken.destroy({
            where: { id: keyToken}
        })
    }
}

module.exports = KeyTokenServices