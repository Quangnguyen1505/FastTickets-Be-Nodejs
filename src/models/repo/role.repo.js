const db = require('..');

const findAllRoles = async () => {
    const foundRoles = await db.Role.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    return foundRoles;
}

const findRoleById = async (roleId) => {
    const foundRole = await db.Role.findOne({
        where: { id: roleId },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    return foundRole;
}

module.exports = {
    findAllRoles,
    findRoleById
}