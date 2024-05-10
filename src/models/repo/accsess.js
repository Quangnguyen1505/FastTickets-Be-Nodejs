const db = require('../../models');

const findByEmail = async ({ email, select = [
    "id", "email", "password", "name"
]}) => {
    return await db.User.findOne({
        where: {email: email},
        attributes: select
    });
}

const findByUserId = async ({ userId, select = [
    "id", "email", "name", "address", "avatar"
]}) => {
    return await db.User.findOne({
        where: {id: userId},
        attributes: select
    });
}

const updateUserByUserId = async ({ userId, payload }) => {
    return await db.User.update(
        payload,
        {
            where: {
                id: userId
            }
        }
    )
}


module.exports = {
    findByEmail,
    findByUserId,
    updateUserByUserId
}