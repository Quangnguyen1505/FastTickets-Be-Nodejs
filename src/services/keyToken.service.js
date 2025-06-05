const db = require('../models');

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user_id: userId };
            const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
    
            let [tokenRecord, created] = await db.keyToken.findOrCreate({
                where: filter,
                defaults: { ...update, user_id: userId }
            });
    
            if (!created) {
                await db.keyToken.update(update, { where: filter });
                tokenRecord = await db.keyToken.findOne({ where: filter }); // lấy lại bản ghi sau khi update
            }
    
            return tokenRecord; // ✅ trả object keyToken
        } catch (error) {
            throw error;
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