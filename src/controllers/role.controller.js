const { SuccessResponse } = require("../core/success.response");
const roleService = require("../services/role.service");

class RoleController {
    newRole = async (req, res, next) => {
        new SuccessResponse({
            message: "create role success",
            metadata: await roleService.createRole(req.body)
        }).send(res);
    }

    getRoleById = async (req, res, next) => {
        new SuccessResponse({
            message: "get role by Id success",
            metadata: await roleService.getRoleById(req.params.id)
        }).send(res);
    }

    getAllRole = async (req, res, next) => {
        new SuccessResponse({
            message: "get all role success",
            metadata: await roleService.getAllRole()
        }).send(res);
    }
    updateRole = async (req, res, next) => {
        new SuccessResponse({
            message: "update role success",
            metadata: await roleService.updateRole(req.params.id, req.body)
        }).send(res);
    }
    deleteRole = async (req, res, next) => {
        new SuccessResponse({
            message: "delete role success",
            metadata: await roleService.deleteRole(req.params.id)
        }).send(res);
    }
}

module.exports = new RoleController();