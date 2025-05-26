const { SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
const UsersService = require("../services/users.service");

class UsersController{
    getUsers = async (req,res,next) => {
        new SuccessResponse({
            message: "get users success",
            metadata: await UsersService.getAllUser(req.query)
        }).send(res);
    }

    getProfile = async (req,res,next) => {
        new SuccessResponse({
            message: "get profile success",
            metadata: await UsersService.getProfile(req.userId)
        }).send(res);
    }

    updateUser = async (req,res,next) => {
        const filePath = req.file ? req.file.path : null;
        new SuccessResponse({
            message: "update User successful",
            metadata: await UsersService.updateUser({ userId: req.userId, payload: req.body, filePath})
        }).send(res);
    }

    updateAdminUser = async (req,res,next) => {
        const filePath = req.file ? req.file.path : null;
        new SuccessResponse({
            message: "update admin User successful",
            metadata: await UsersService.updateUserAdmin({ userId: req.params.id, payload: req.body, filePath})
        }).send(res);
    }

    deleteUser = async (req,res,next) => {
        new SuccessResponse({
            message: "delete user success",
            metadata: await UsersService.deleteUser(req.params.id)
        }).send(res);
    }

    changePassword = async (req,res,next) => {
        new SuccessResponse({
            message: "change password success",
            metadata: await UsersService.changePassword({ email: req.email, ...req.body})
        }).send(res);
    }

    addUser = async (req,res,next) => {
        new SuccessResponse({
            message: "add user success",
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    }

    getCountUser = async (req,res,next) => {
        new SuccessResponse({
            message: "get count user success",
            metadata: await UsersService.getCountUser()
        }).send(res);
    }
}


module.exports = new UsersController();