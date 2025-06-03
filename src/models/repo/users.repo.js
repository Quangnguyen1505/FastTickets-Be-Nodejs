const db = require('..');

const getAllUsers = async ({ limit, sort, page, unselect = [] }) => {
    const offset = (page - 1) * limit;
    const orderBy = sort === 'ctime' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];

    const foundUsers = await db.User.findAndCountAll({
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

    return {
        foundUsers: foundUsers.rows, 
        countUser: foundUsers.count
    };
}


const deleteUserByUserId = async (userId) => {
    const deleted = await db.User.destroy({
        where: { id: userId }
    });

    return deleted; 
}

const searchUsers = async (query) => {
    const { limit, sort, page, unselect = [], search } = query;
    const offset = (page - 1) * limit;
    const orderBy = sort === 'ctime' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];

    const foundUsers = await db.User.findAndCountAll({
        attributes: { exclude: unselect },
        where: {
            [db.Sequelize.Op.or]: [
                { usr_first_name: { [db.Sequelize.Op.like]: `%${search}%` } },
                { usr_last_name: { [db.Sequelize.Op.like]: `%${search}%` } },
                { usr_email: { [db.Sequelize.Op.like]: `%${search}%` } }
            ]
        },
        limit,
        offset,
        order: orderBy,
        include: [{
            model: db.Role,
            as: 'Role', 
            attributes: ['role_name']
        }],
    });

    return {
        foundUsers: foundUsers.rows, 
        countUser: foundUsers.count
    };
}


module.exports = {
    getAllUsers,
    deleteUserByUserId,
    searchUsers
}