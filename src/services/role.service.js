const { default: slugify } = require('slugify');
const db = require('../models');
class RoleService {
    static async createRole(payload) {
        const {
            role_name,
            role_status,
            role_description 
        } = payload;

        const role_slug = slugify(role_name);
        
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

    static async getRoleByName(role_name) {
        return await db.Role.findOne({
            where: {
                role_name: role_name
            }
        });
    }

    static async getAllRole() {
        return await db.Role.findAll();
    }

    static async updateRole(roleId, payload) {
        const foundRole = await db.Role.findOne({ where: { id: roleId } });
        if (!foundRole) throw new BadRequestError("Role not found");

        const updatedRole = await foundRole.update(payload);
        return updatedRole;
    }

    static async deleteRole(roleId) {
        const foundRole = await db.Role.findOne({ where: { id: roleId } });
        if (!foundRole) throw new BadRequestError("Role not found");

        await foundRole.destroy();
        return foundRole;
    }
}

module.exports = RoleService