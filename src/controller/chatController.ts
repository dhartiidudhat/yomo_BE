import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { checkedUser, checkConnection, updateNotifyData, getNotifyData, getEventsData, getToken, createSubscription, getSubscribers, createNofication, getNotify, getUsers, getDialogs, userLogin, userChatStart, userDialogChat, userGroupChat, getUnreadMessage, getmanageUser, manageUser, getCurrentUserDetails, getSearchChat, clearChats } from '../services/chatService';
import { createResponse } from './../utils/response';
import { message } from './../utils/messages';

const getSession = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const getSessionToken: any = await getToken(user.user);                
        return await createResponse(res, httpStatus.OK, message.SESSION, getSessionToken)
    } catch (error: any) {                        
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const listUsers = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if (!userSame) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');
        const listUsers: any = await getUsers(headerToken, req.query);
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Users'), listUsers);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const listDialogs = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;                
        const userSame: any = await getCurrentUserDetails(user.user, req.custom_user);                
        if (!userSame) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');
        const params: any = {
            userId: user.user,
            role: req.query.status,
            quickBloxId: req.custom_user
        }                
        const listUsers: any = await getDialogs(headerToken, params, req.query,userSame);
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Dialogs'), listUsers);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const login = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if (!userSame) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');
        const getUser: any = await userLogin(headerToken, user.user);
        return await createResponse(res, httpStatus.OK, message.USER_CREATED, getUser)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const chatStart = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if (!userSame) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const getConnection: any = await checkConnection(user.user, req.body.to);
        if (!getConnection) {
            return await createResponse(res, httpStatus.NOT_ACCEPTABLE, message.USER_NOTCONNECTED, {})
        }
        const headerToken: any = req.header('QB');
        if (req.file) {
            req.body.filename = `${req.headers.host}/${req.file.destination}/${req.file.filename}`;
        }
        req.body.from = req.custom_user
        req.body.userType = req.body.status;
        req.body.currentUser = user.user;

        const getUser: any = await userChatStart(headerToken, req.body);
        return await createResponse(res, httpStatus.OK, message.MESSAGE_SENT, getUser)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const chatGroup = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if (!userSame) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const getConnection: any = await checkConnection(user.user, req.body.to);
        if (!getConnection) {
            return await createResponse(res, httpStatus.NOT_ACCEPTABLE, message.USER_NOTCONNECTED, {})
        }
        const headerToken: any = req.header('QB');
        if (req.file) {
            req.body.filename = `${req.headers.host}/${req.file.destination}/${req.file.filename}`;
        }
        req.body.userType = req.body.status;
        const getUser: any = await userGroupChat(headerToken, req.body);
        return await createResponse(res, httpStatus.OK, message.MESSAGE_SENT, getUser)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const chatById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if (!userSame) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');
        const getChatById: any = await userDialogChat(headerToken, req.params.chatId, req.query);
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'User chat'), getChatById)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getTotalUnread = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if (!userSame) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');
        const getChatById: any = await getUnreadMessage(headerToken);
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'User chat'), getChatById)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getNotification = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if (!userSame) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');
        const body: any = {
            custom_user: req.custom_user,
            status: req.query.status,
            user: user.user
        }
        const getChatById: any = await getNotify(headerToken, body);
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'User chat'), getChatById)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const createNotificationData = async (req: any, res: Response, next: NextFunction) => {
    try {                
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if(!userSame){
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');
        req.body.from = req.custom_user
        req.body.userType = req.body.status;

        const createNotification: any = await createNofication(headerToken, req.body);
        return await createResponse(res, httpStatus.OK, message.NOTIFICATION_SENT, createNotification)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const createSubscribe = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if(!userSame){
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');

        const createSubscribed: any = await createSubscription(headerToken, req.body);
        return await createResponse(res, httpStatus.CREATED, message.SUBSCRIBE_CREATE, createSubscribed)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getSubscribeList = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if(!userSame){
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');
        const subscribed: any = await getSubscribers(headerToken);
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'subscribers list'), subscribed)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getEventList = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userSame: any = await checkedUser(user.user, req.custom_user);
        if(!userSame){
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION, {})
        }
        const headerToken: any = req.header('QB');
        const subscribed: any = await getEventsData(headerToken, req.query);
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'event list'), subscribed)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getNotificationData = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const body: any = {
            status: req.query.status,
            user: user.user,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 100,
        }
        const getNotified: any = await getNotifyData(body);
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'User notifications'), getNotified)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const updateNotificationData = async (req: any, res: Response, next: NextFunction) => {
    try {
        const getNotified: any = await updateNotifyData(req.body);
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'User notifications'), getNotified)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const userManage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const data: any = await manageUser(user.user, req.body)
        return await createResponse(res, httpStatus.OK, message.USER_MANAGE, data);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getuserManage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const users: any = await getmanageUser(user.user);       
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'User'), users);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const seachChat = async (req: any, res: Response, next: NextFunction) => {
    try {
        const search: any = req.query;        
        const users: any = await getSearchChat(search);                       
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'User'), users);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const clearChat = async (req: any, res: Response, next: NextFunction) => {
    try {                  
        const data: any = await clearChats(req.body);           
        return await createResponse(res, httpStatus.OK, message.CLEAR_CHAT, data);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

export = {
    getSession,
    listUsers,
    listDialogs,
    login,
    chatStart,
    chatGroup,
    chatById,
    getTotalUnread,
    getNotification,
    createNotificationData,
    createSubscribe,
    getSubscribeList,
    getEventList,
    getNotificationData,
    updateNotificationData,
    getuserManage,
    userManage,
    seachChat,
    clearChat
}