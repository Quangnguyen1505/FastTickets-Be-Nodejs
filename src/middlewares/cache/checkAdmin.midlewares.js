const { CACHE_USER } = require("../../config/constant");
const { ForBiddenError, NotFoundError } = require("../../core/error.response");
const { getHashValue, setHashValue, getValueCache, setValueCache } = require("../../models/repo/cache/cache.redis");
const { findRoleById } = require("../../models/repo/role.repo");
const { handlerError:asyncHandler } = require('../../helper/asyncHandler');

const checkAdmin = asyncHandler ( async ( req, res, next)=>{
    /*
      1. Check roles in cache if missing => get from db =>  if have setcache
      2. OK all => return next()
    */
    try {
        const roleId = req.roleId;
        // const userId = req.userId;
        const keyRoleAdmin = `${CACHE_USER.role}:${roleId}`;
        let roleData = await getValueCache(keyRoleAdmin);
        console.log("roleData", roleData);
        if (roleData) {
            roleData = JSON.parse(roleData); // parse từ string về object
            console.log("roleData", roleData);
        } else {
            roleData = await findRoleById(roleId);
            if (!roleData) throw new NotFoundError('Not Found Role');
            await setValueCache(keyRoleAdmin, JSON.stringify(roleData)); 
        }

        if (roleData.role_name !== "admin") throw new ForBiddenError('Forbidden');

        return next();
        
    } catch (error) {
        throw error;
    }
});

module.exports = {
    checkAdmin
}