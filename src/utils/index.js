const _ = require('lodash');
const cloudinary = require('../config/cloudinary.config');

const getInfoData = ({ fileds = [], object = {} })=>{
    return _.pick( object, fileds );
}

const DestroyCloudinary = async (publicId, resource_type) => {
    const result = await cloudinary.uploader.destroy('Cinema/'+publicId, {
        invalidate: true, // Optional: if you want to invalidate the cache
        resource_type: resource_type // Optional: if you are deleting an video
    });
    if (result.result  !== 'ok') {
        console.error(`Failed to ${resource_type} video in Cloudinary:`, result);
        throw new Error(`Failed to delete ${resource_type} in Cloudinary`);
    }
    console.log("Deleted video in Cloudinary:", result);
}

module.exports = {
    getInfoData,
    DestroyCloudinary
}