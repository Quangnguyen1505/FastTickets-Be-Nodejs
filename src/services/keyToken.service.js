const db = require('../models');

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            let tokens;
            const fitler = { id: userId }, update = {
                 publicKey, privateKey, refreshTokensUsed: [], refreshToken
            };
            const foundToken = await db.keyToken.findOne({ where: fitler });
            if(foundToken){
                tokens = await db.keyToken.update(update, { where: fitler });
            }else{
                tokens = await db.keyToken.create({ ...update, user_id: userId });
            }
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        return await keyTokenModel.findOne({ user: new ObjectId(userId) })
    }
}

module.exports = KeyTokenServices