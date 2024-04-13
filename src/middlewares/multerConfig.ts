import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { appError } from '../utils/appError';
import httpStatus from 'http-status';
import { message } from '../utils/messages';

const multerUpload = (folder: any, auth: boolean) => {
  const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      try {
        let userId: any;
        if (auth) {
          const user: any = req.user;
          userId = req.params.userId; // Get the userId from the request
          if (user?.user != userId) {
            const error: any = new appError(httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION)
            cb(error);
          }
        }
        let userUploadPath = '';
        const bodyName: any = req.body.name ? req.body.name.toLowerCase() : 'rawInterest';
        if (folder === 'profiles' || folder === 'profile') {
          userUploadPath = `uploads/${folder}/${userId}`;
        } else if (folder === 'interests' || folder === 'interest' || folder === 'industry' || folder === 'industries') {
          userUploadPath = `uploads/${folder}/${bodyName}`;
        } else {
          userUploadPath = `uploads/others`;
        }
        // Create the user-specific upload directory if it doesn't exist
        if (!fs.existsSync(userUploadPath)) {
          fs.mkdirSync(userUploadPath, { recursive: true });
        }
        cb(null, userUploadPath); // Set the user-specific upload directory
      } catch (error: any) {
        const errorCustom: any = new appError(httpStatus.NOT_ACCEPTABLE, message.UPLOAD_FILE_ERROR)
        cb(errorCustom);
      }
    },
    filename: (req: any, file: any, cb: any) => {
      try {
        let newImageName: any;
        let userImagePath: any;
        let userId: any;
        if (auth) {
          const user: any = req.user;
          userId = req.params.userId
          if (user?.user != userId) {
            const error: any = new appError(httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION)
            cb(error);
          }
        }
        const bodyName: any = req.body.name ? req.body.name.toLowerCase() : 'rawInterest';
        if (folder === 'profiles' || folder === 'profile') {
          newImageName = `newProfile-${userId}${path.extname(file.originalname)}`;
          userImagePath = `uploads/${folder}/${userId}`;
        } else if (folder === 'interests' || folder === 'interest' || folder === 'industry' || folder === 'industries') {
          newImageName = `new-${bodyName}${path.extname(file.originalname)}`;
          userImagePath = `uploads/${folder}/${bodyName}`;
        } else {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          newImageName = `${uniqueSuffix}${path.extname(file.originalname)}`;
          userImagePath = `uploads/${folder}/${bodyName}`;
        }

        if (auth) {
          const fsDirectory = fs.readdirSync(userImagePath);
          const newProfileRename = fsDirectory.filter((item) => item.toLowerCase().includes("new"));
          const oldProfileDelete = fsDirectory.filter((item) => item.toLowerCase().includes("old"));
          if (fsDirectory.length > 0) {
            if (fsDirectory.length > 2) {
              if (oldProfileDelete[0]) {
                if (fs.existsSync(`${userImagePath}/${oldProfileDelete[0]}`)) {
                  fs.unlinkSync(`${userImagePath}/${oldProfileDelete[0]}`);
                }
              }
            }
            if (newProfileRename[0]) {
              const fileNameRename = newProfileRename[0].split('.')[1];
              let oldProfile;
              if (folder === 'profiles' || folder === 'profile') {
                oldProfile = `${userImagePath}/OldProfile.${fileNameRename}`
              } else {
                oldProfile = `${userImagePath}/Old${bodyName}.${fileNameRename}`
              }
              fs.renameSync(
                `${userImagePath}/${newProfileRename[0]}`,
                oldProfile
              );
            }
          }
        }

        cb(null, newImageName);
      } catch (error: any) {
        const customError: any = new appError(httpStatus.NOT_ACCEPTABLE, message.UPLOAD_FILE_ERROR)
        cb(customError);
      }
    },
  })
  return multer({ storage: storage })
}
export default multerUpload;