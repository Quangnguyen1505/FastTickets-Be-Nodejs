const db = require('..');

const getAllUsers = async ({ limit, sort, page, unselect = [] }) => {
    const offset = (page - 1) * limit;
    const orderBy = sort === 'ctime' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];

    const foundUsers = await db.User.findAll({
        attributes: { exclude: unselect },
        limit,
        offset,
        order: orderBy,
        include: [{
            model: db.Role,
            as: 'Role', 
            attributes: ['role_name']
        }],
    });

    return foundUsers;
}


const deleteUserByUserId = async (userId) => {
    const deleted = await db.User.destroy({
        where: { id: userId }
    });

    return deleted; 
}


module.exports = {
    getAllUsers,
    deleteUserByUserId
}