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
}

module.exports = new RoleController();