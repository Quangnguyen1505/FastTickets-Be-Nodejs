const { NotFoundError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const uploadService = require("../services/upload.service");

class UploadController{
    uploadImage = async ( req, res, next ) => {
        const filePath = req.file.path;
        if(!filePath) throw new NotFoundError("No file found");
        new SuccessResponse({
            message: "upload one image success",
            metadata: await uploadService.uploadImageFromLocal({path: filePath})
        }).send(res);
    }

    uploadManyImage = async ( req, res, next ) => {
        const files = req.files;
        if(!files.length) throw new NotFoundError("No file found");
        new SuccessResponse({
            message: "upload many image success",
            metadata: await uploadService.uploadManyImageFromLocal({ files: files })
        }).send(res);
    }

    uploadVideoTrailer = async ( req, res, next ) => {
        const file = req.file.path;
        if(!file) throw new NotFoundError("No file found");
        new SuccessResponse({
            message: "upload video success",
            metadata: await uploadService.uploadTrailer({ path: file })
        }).send(res);
    }
}


module.exports = new UploadController();