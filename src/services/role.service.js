const db = require('../models');
class RoleService {
    static async createRole(payload) {
        const {
            role_name,
            role_slug,
            role_status,
            role_description 
        } = payload;
        
        const newRole = await db.Role.create({
            role_name,
            role_slug,
            role_status,
            role_description
        });

        if (!newRole) throw new BadRequestError("create Role error");

        return newRole;
    }

    static async getRoleById(roleId) {
        return await db.Role.findOne({
            where: {
                id: roleId
            }
        });
    }
}

module.exports = RoleService