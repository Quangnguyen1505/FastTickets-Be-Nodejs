const { BadRequestError, AuthFailureError } = require("../core/error.response");
const bcrypt = require('bcrypt');
const { findByEmail, findByUserId, updateUserByUserId, getCountUser } = require("../models/repo/accsess.repo");
const UploadService = require("./upload.service");
const { getAllUsers, deleteUserByUserId, searchUsers } = require("../models/repo/users.repo");
const { DestroyCloudinary } = require("../utils");
const { getRoleByName } = require("./role.service");

class UsersService {
   static getProfile = async ( userId )=>{
        const foundUser = await findByUserId({
          userId, 
          select: [
               'id',
               'usr_first_name', 
               'usr_last_name', 
               'usr_email', 
               'usr_phone', 
               'usr_avatar_url', 
               'usr_date_of_birth', 
               'usr_address',
               'usr_point',
               'usr_sex'
          ]
        });
        if(!foundUser) throw new BadRequestError('User is not registered');
        return foundUser;
   }

   static changePassword = async ({ email, old_password, new_password }) => {
        const foundUser = await findByEmail({ email, select: ["usr_password", "id"] });
        if(!foundUser) throw new BadRequestError('Shop is not registered');

        const match = await bcrypt.compare( old_password, foundUser.usr_password );
        if(!match) throw new AuthFailureError('Authencation error');
        
        const password = await bcrypt.hash(new_password, foundUser.usr_salf);
    
        const updateNewPassword = await updateUserByUserId({userId: foundUser.id, payload: {usr_password: password}});
        return updateNewPassword;
   }

   static updateUser = async ({ userId, payload, filePath }) => {
        const foundUser = await findByUserId({userId}); 
        if(!foundUser) throw new BadRequestError('User is not registered');

        let avt_url
        if(filePath) {
            const uploadAvatar = await UploadService.uploadImageFromLocal({path: filePath})
            avt_url = uploadAvatar.image_url
            payload.usr_avatar_url = avt_url
        }

        const updateUser = await updateUserByUserId({userId, payload});
        return updateUser;
   }

   static updateUserAdmin = async ({ userId, payload, filePath }) => {
     const {
       role_name,
       usr_address,
       usr_date_of_birth,
       usr_first_name,
       usr_last_name,
       usr_phone,
       usr_sex,
       usr_status,
     } = payload;
     console.log("usr_date_of_birth ", usr_date_of_birth)
   
     const foundUser = await findByUserId({ userId });
     if (!foundUser) throw new BadRequestError("User is not registered");
   
     const finalPayload = {};
   
     if (filePath) {
       const { image_url } = await UploadService.uploadImageFromLocal({ path: filePath });
       finalPayload.usr_avatar_url = image_url;
     }
   
     if (role_name) {
       const foundRole = await getRoleByName(role_name);
       if (!foundRole) throw new BadRequestError("Role not exists");
       finalPayload.usr_role_id = foundRole.id;
     }
   
     const allowedFields = [
       "usr_address",
       "usr_date_of_birth",
       "usr_first_name",
       "usr_last_name",
       "usr_phone",
       "usr_sex",
       "usr_status",
     ];
   
     for (const key of allowedFields) {
       const value = payload[key];
       if (value !== undefined && value !== null && value !== "") {
         finalPayload[key] = value;
       }
     }
   
     const updateUser = await updateUserByUserId({ userId, payload: finalPayload });
     return updateUser;
   };
   

     static getAllUser = async ({ limit = 30, sort = 'ctime', page = 1 }) => { 
          const {foundUsers, countUser} = await getAllUsers(
               { 
                    limit, 
                    sort, 
                    page, 
                    unselect: ['usr_password']
               }
          );
          
          return {
              users: foundUsers,
              totalCount: countUser
          };
     }
 
     static deleteUser = async (userId) => {
          const foundUser = await findByUserId({ userId });
          if (!foundUser) throw new BadRequestError('User is not registered');
     
          const result = await deleteUserByUserId(userId);
          if(result) {
               const deleteFromCloudinary = async (fileUrl, resourceType) => {
               if (fileUrl) {
                    const publicId = fileUrl.split('/').slice(-2).join('/').split('.')[0];
                    await DestroyCloudinary(publicId, resourceType);
               }
               };
               await deleteFromCloudinary(foundUser.usr_avatar_url, 'image');
          }
          return result;
     } 

     static getCountUser = async () => {
          const countUser = await getCountUser();
          return countUser;
     }

     static searchUsers = async ({ search, limit = 30, page = 1, sort = 'ctime' }) => {
          if (!search) throw new BadRequestError('Keyword is required');

          const { foundUsers, countUser } = await searchUsers({
               search,
               limit,
               page,
               sort,
               unselect: ['usr_password']
          });

          return {
              users: foundUsers,
              totalCount: countUser
          };
     }
}

module.exports = UsersService