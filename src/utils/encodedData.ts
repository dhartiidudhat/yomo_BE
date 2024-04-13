import bcrypt, { hash }  from "bcryptjs";
import httpStatus from "http-status";
import { appError } from "./appError";
import crypto from 'crypto';
import config from "../config/config";
import { message } from "./messages";
const hashedData = async (dataToHash: any) => {
    try {
        const hashed: any = await dataToHash.map((singleData: any) => {
            return bcrypt.hashSync(String(singleData), 8)
        })
        return hashed
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}

const unHashedData = async (hashedData: any, dataInput: any) => {
    try {
        const unHashed: any = await hashedData.map((singleData: any, index: number) => {
            return bcrypt.compareSync(String(dataInput[index]), singleData);
        })
        return unHashed 
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}
// const encrypt = async (dataToEncrypt: any) => {
//     try {
//         const hasedValues: any = dataToEncrypt.map((singleData: any) => {
//             const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(config.crypto), Buffer.from(config.cryptoPrivate, 'hex'));
//             let encryptedData = cipher.update(String(singleData), 'utf8', 'hex');
//             encryptedData += cipher.final('hex');
//             return {
//                 encryptedData: encryptedData,
//             };
//         });
//         return hasedValues
//     } catch (error: any) {
//         throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
//     }
// }

// const decrypt = async (dataToEncrypt: any) => {
//     try {
//         const hasedValues: any = await dataToEncrypt.map((singleData: any) => {
//             const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.crypto), Buffer.from(config.cryptoPrivate, 'hex'));
//             let decryptedData = decipher.update(String(singleData), 'hex', 'utf8');
//             decryptedData += decipher.final('utf8');
//             return decryptedData;
//         })
//         return hasedValues
//     } catch (error: any) {
//         throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
//     }
// }

const signCreate = (data: string) => {
    try {
        const hmac = crypto.createHmac('sha1', config.quickblox.authSecret);
        hmac.update(data);
        const signature = hmac.digest('hex');
        return signature;
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}
export = {
    hashedData,
    unHashedData,
    // encrypt,
    // decrypt,
    signCreate
}