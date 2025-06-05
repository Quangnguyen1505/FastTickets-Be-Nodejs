const db = require('../../models');

const findByEmail = async ({ email, select = [
    "id", "usr_email", "usr_password", "usr_first_name", "usr_last_name", "usr_role_id"
]}) => {
    return await db.User.findOne({
        where: {usr_email: email},
        attributes: select
    });
}

const findByUserId = async ({ userId, select = [
    "id", "usr_email", "usr_password", "usr_first_name", "usr_last_name", "usr_phone", "usr_address", "usr_avatar_url", "usr_point", "usr_sex", "usr_date_of_birth"
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
            },
            returning: true,
        }
    )
}

const getCountUser = async () => {
    return await db.User.count();
}


module.exports = {
    findByEmail,
    findByUserId,
    updateUserByUserId,
    getCountUser
}