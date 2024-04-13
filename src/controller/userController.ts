import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { userCreate, verifyUser, otpResend, updateProfile, getUser, allUser, userLogin, updateProfileImage, refreshToken, getMessageConnection, updateRequest, getRequest, getSendRequest, logoutUser, updateEmail, updateMobile, verifyOtpNumber, verifyEmail } from '../services/userService';
import { createResponse } from './../utils/response';
import { message } from './../utils/messages';

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCreated: any = await userCreate(req.body);
        return await createResponse(res, httpStatus.CREATED, message.USER_CREATED, userCreated)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Login: any = await userLogin(req.body);
        return await createResponse(res, httpStatus.CREATED, message.USER_LOGIN.replace('#', 'user'), Login)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const userVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userVerified: any = await verifyUser(Number(req.params.id), req.body.otp);
        return await createResponse(res, httpStatus.OK, message.USER_VERIFIED, userVerified)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const userRefreshToken = async (req: any, res: Response, next: NextFunction) => {
    try {
        const newToken: any = await refreshToken(req.body);
        return await createResponse(res, httpStatus.OK, message.USER_VERIFIED, newToken)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const otpResendData: any = await otpResend(req.body);
        return await createResponse(res, httpStatus.OK, message.OTP_RESENT, otpResendData)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const updateUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const profileUpdate: any = await updateProfile(Number(req.params.userId), req.body, user);
        return await createResponse(res, httpStatus.OK, message.UPDATE_USER, {})
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const profileUpdate = async (req: any, res: Response, next: NextFunction) => {
    try {
        let filename: any = null;
        if (req.file) {
            filename = req.file.filename;
        }
        const profile: any = await updateProfileImage(Number(req.params.userId), filename);
        return await createResponse(res, httpStatus.OK, message.UPDATE_USER, profile)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getUserById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const users: any = await getUser(Number(req.params.userId));   
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'User'), users);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getAllUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const users: any = await allUser();       
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'User'), users);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const createConnection = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const connectionData: any = await getMessageConnection(req.user, req.body);
        return await createResponse(res, httpStatus.OK, message.REQUEST_ADD, connectionData);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const respondRequest = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        req.body.requestId = Number(req.params.requestId);
        const headerToken: any = req.header('QB');
        req.body.QB = headerToken;
        req.body.userRoleData = req.query.status
        const connectionData: any = await updateRequest(user.user, req.body);                
        return await createResponse(res, httpStatus.OK, message.UPDATE_DATA.replace('#', 'Request'), {});
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getRequestSend = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const getSend: any = await getSendRequest(user.user);      
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Request send'), getSend);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getRequestReceive = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;                
        const getSend: any = await getRequest(user.user,req.query.role);      
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Request receive'), getSend);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const userLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logout: any = await logoutUser(Number(req.params.userId));
        return await createResponse(res, httpStatus.OK, message.LOGOUT, logout);
    } catch (error: any) {
        createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {});
    }
};


const EmailUpdate = async (req: any, res: Response, next: NextFunction) => {
    try {        
        const userId: any = req.params.userId;
        const email: any = await updateEmail(req.body, userId);
        return await createResponse(res, httpStatus.CREATED, message.EMAIL_UPDATE, email);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const mobileUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: any = req.params.userId;
        const mobile: any = await updateMobile(req.body, userId);
        return await createResponse(res, httpStatus.CREATED, message.NEW_OTP_SENT, mobile);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const verifyNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: any = req.params.userId;
        await verifyOtpNumber(userId, req.body);
        return await createResponse(res, httpStatus.CREATED, message.MOBILE_UPDATE, {});
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const verifyEmailOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: any = req.params.userId;
        await verifyEmail(req.body, userId);
        return await createResponse(res, httpStatus.CREATED, message.EMAIL_UPDATE, {});
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

export = {
    registerUser,
    userVerification,
    userRefreshToken,
    resendOtp,
    updateUser,
    getUserById,
    getAllUser,
    loginUser,
    profileUpdate,
    createConnection,
    respondRequest,
    getRequestSend,
    getRequestReceive,
    userLogout,
    EmailUpdate,
    mobileUpdate,
    verifyNumber,
    verifyEmailOtp
}