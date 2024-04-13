import httpStatus from "http-status";
import { appError } from "../utils/appError";
import axios from "axios";
import config from "../config/config";
import { message } from "../utils/messages";
import encodedData from "../utils/encodedData";
import { getQueryOptions } from "../utils/getQueryParams";
import { getOppRequest, getRequest, getUser, getUserId, getUserQuickBlox } from "./userService";
import { database } from "../utils/mysqlConnector";
import { Op, Sequelize } from "sequelize";
import { ROLES } from "../config/constants";
import { userSocketMap } from "../utils/socketConnection";
import { io } from "../index";

const checkedUser: any = async (userLogged: number, quickBlox: number) => {
    const userGet: any = await getUserId(userLogged);
    return await userGet.quickbloxId == quickBlox;
}

const getCurrentUserDetails: any = async (userLogged: number, quickBlox: number) => {
    const user = await database.Users.findByPk(userLogged, {
        attributes: ['id', 'quickbloxId', 'blockUser', 'reportedUser'],
    });
    if (user.quickbloxId == quickBlox) {
        return user;
    } else {
        return false;
    }
}

const updateProfileChat: any = async (id: number, body: any) => {
    try {
        const headers = {
            'Authorization': `ApiKey ${config.quickblox.apiKey}`,
            'Content-Type': 'application/json'
        };
        const updateUser: any = await axios.put(`${config.quickblox.url}users/${id}.json`, body, { headers: headers });
        return updateUser?.data?.user
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE);
    }
}

const checkConnection: any = async (presentUser: number, connectId: number,) => {
    const getUser: any = await database.Users.findOne({
        attributes: ['id'],
        where: {
            id: presentUser,
            [Op.and]: Sequelize.literal(`connectedChats LIKE '%${connectId}%'`)
        }
    })
    return getUser
}

const createUser = async (body: any) => {
    try {
        const params: any = {
            "user": {
                "login": body.email,
                "password": String(body.mobile),
                "email": body.email,
                "full_name": body.name ? body.name : 'User',
                "phone": body.mobile ? `+${body.countryCode}${body.mobile}` : '',
                "custom_data": body.custom_data
            }
        }
        const headers = {
            'Authorization': `ApiKey ${config.quickblox.apiKey}`,
            'Content-Type': 'application/json'
        };
        const createUser: any = await axios.post(`${config.quickblox.url}users.json`, params, { headers: headers });
        return createUser?.data?.user
    } catch (error: any) {
        throw new appError(error.response.status, message.PROVIDE_USER_PASS)
    }
}

const getUserById = async (id: number, token: string) => {
    try {
        const headers = {
            'QB-Token': token,
            'Content-Type': 'application/json',
            'On-Behalf-Of': id
        };
        const userExist: any = await axios.get(`${config.quickblox.url}users/${id}.json`, { headers: headers });
        return userExist?.data?.user;
    } catch (error: any) {
        throw new appError(httpStatus.NOT_FOUND, message.RECEIVER_NOT_FOUND);
    }
}

const checkExistingDialog = async (token: any, body: any) => {
    try {
        const headers = {
            'QB-Token': token,
            'Content-Type': 'application/json'
        };
        const existingDialog: any = await axios.get(`${config.quickblox.url}chat/Dialog.json?occupants_ids[all]=${body.to},${body.from}&type=3`, { headers: headers });
        return await existingDialog.data.total_entries
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE);
    }
}

const createDialog = async (token: any, body: any) => {
    try {
        const headers = {
            'QB-Token': token,
            'Content-Type': 'application/json'
        };
        const params = {
            type: 3,
            occupants_ids: body.to,
            photo: body.img,
            data: {
                "class_name": "role",
                "userRole": body.userType
            }
        }
        const createDialog: any = await axios.post(`${config.quickblox.url}chat/Dialog.json`, params, { headers: headers });
        return createDialog
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE);
    }
}
const getGroupById = async (id: number, token: string) => {
    try {
        const headers = {
            'QB-Token': token,
            'Content-Type': 'application/json'
        };
        const groupExist: any = await axios.get(`${config.quickblox.url}chat/Dialog?_id=${id}`, { headers: headers });
        return groupExist;
    } catch (error: any) {
        throw new appError(httpStatus.NOT_FOUND, message.RECEIVER_GROUP_NOT_FOUND);
    }
}

const createSignature = async (id: number, email: string, mobile: number) => {
    try {
        const stringMobile: string = String(mobile);
        const timestamp = Math.floor(Date.now() / 1000);
        const dataStr: string = `application_id=${config.quickblox.appId}&auth_key=${config.quickblox.authKey}&nonce=${id}&timestamp=${timestamp}&user[login]=${email}&user[password]=${stringMobile}`
        const createSign = await encodedData.signCreate(dataStr);                
        return { sign: createSign, timestamp: timestamp, nonce: id, mobile: stringMobile, email: email }
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}

const createSession = async (body: any) => {
    try {
        const params = {
            application_id: config.quickblox.appId,
            auth_key: config.quickblox.authKey,
            nonce: body.nonce,
            timestamp: body.timestamp,
            signature: body.sign,
            user: {
                login: body.email,
                password: body.mobile
            }
        }        
        const sessionData: any = await axios.post(`${config.quickblox.url}session.json`, params);                
        return {
            id: sessionData.data.session.user_id,
            token: sessionData.data.session.token,
            nonce: sessionData.data.session.nonce
        }
    } catch (error: any) {                
        throw new appError(error.statusCode, error.message)
    }
}

const getToken = async (userId: number) => {
    try {
        const getPresentUser: any = await getUserId(userId);                
        const sign: any = await createSignature(getPresentUser.quickbloxId, getPresentUser.email, getPresentUser.mobileNumber);                
        return await createSession(sign)               
    } catch (error: any) {                
        throw new appError(error.statusCode, error.message)
    }
}

const getUsers = async (header: any, query: any) => {
    try {
        const headers = {
            'QB-Token': header,
            'Content-Type': 'application/json'
        };
        const { page, limit, sort, skip } = getQueryOptions(query);
        const params: any = {
            page: page,
            per_page: limit,
            skip: skip,
            order: 'desc+date+last_request_at'
        }
        params.sort_desc = 'created_at'
        const usersList: any = await axios.get(`${config.quickblox.url}users.json`, { headers: headers, params: params });
        if (usersList.data.items.length > 0) {
            return {
                total: usersList.data.total_entries,
                data: usersList.data.items
            }
        } else {
            throw new appError(httpStatus.NO_CONTENT, message.NOT_FOUND.replace('#', 'User'));
        }

    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const getDialogs = async (header: any, body: any, query: any, userSame: any) => {
    try {
        const headers = {
            'QB-Token': header,
            'Content-Type': 'application/json',
            'On-Behalf-Of': body.quickbloxId
        };
        const { page, limit, sort, skip } = getQueryOptions(query);
        const params: any = {
            'occupants_ids[all]': body.quickBloxId,
            'data[class_name]': 'role',
            'data[userRole]': body.role,
            page: page,
            limit: limit,
            skip: skip,
            sort_desc: 'updated_at'
        }
        const dialogList: any = await axios.get(`${config.quickblox.url}chat/Dialog.json`, { headers: headers, params: params });
        if (dialogList.data.items.length > 0) {
            let userBlockReportArr: any = [];
            if (userSame && userSame.blockUser && userSame.blockUser.length > 0) {
                userSame.blockUser.forEach((element: number) => {
                    userBlockReportArr.push(element)
                });
            }
            if (userSame.reportedUser && userSame.reportedUser.length > 0) {
                const reportedUser = await database.Reportes.findAll({
                    where: {
                        id: {
                            [Op.in]: userSame.reportedUser
                        }
                    },
                    include: [
                        {
                            model: database.Users,
                            attributes: ['id', 'email', 'quickbloxId' /* Add other user attributes you need */],
                        },
                    ],
                });
                if (reportedUser && reportedUser.length > 0) {
                    reportedUser.forEach((element: any) => {
                        if (element.user && element.user.quickbloxId) {
                            userBlockReportArr.push(element.user.quickbloxId);
                        }
                    });
                }
                userBlockReportArr = Array.from(new Set(userBlockReportArr));
            }
            dialogList.data.items = dialogList.data.items.filter((item: any) => {
                const hasBlockedOccupant = item.occupants_ids.some((occupantId: any) =>
                    userBlockReportArr.includes(occupantId)
                );

                return !hasBlockedOccupant;
            });
            const quickbloxId = dialogList?.data?.items?.flatMap((item: any) => item?.occupants_ids);
            const userLoggedInId = dialogList.data.items?.map((item: any) => item?.user_id);
            const occupantsId = quickbloxId.filter((filter: any) => !userLoggedInId.includes(filter));
            const users = await database.Users.findAll({
                where: {
                    quickbloxId: { [Op.in]: [userLoggedInId, ...occupantsId] }
                },
                attributes: ['quickbloxId', 'profileImage', 'dob']
            });
            const profileImagesMap: any = {};
            users.forEach((user: any) => {
                profileImagesMap[user.quickbloxId] = user.profileImage;
            });

            const itemsWithProfileImages = dialogList.data.items.map((item: any) => {
                const profileImages = item.occupants_ids
                    .filter((occupantId: any) => occupantId !== userLoggedInId[0])
                    .map((occupantId: any) => ({
                        occupantId: occupantId,
                        profileImage: profileImagesMap[occupantId] || null,
                    }));
                return {
                    ...item,
                    profileImages: profileImages[0].profileImage,
                };
            });
            return {
                total: itemsWithProfileImages && itemsWithProfileImages.length > 0 ? itemsWithProfileImages.length : 0, //dialogList.data.total_entries,
                data: itemsWithProfileImages,
            };
        } else {
            throw new appError(httpStatus.NO_CONTENT, message.NOT_FOUND.replace('#', 'Dialogs'));
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const userLogin = async (header: any, userId: number) => {
    try {
        const getPresentUser: any = await getUserId(userId);
        const headers = {
            'QB-Token': header,
            'Content-Type': 'application/json'
        };
        const params: any = {
            login: getPresentUser.email,
            password: String(getPresentUser.mobileNumber)
        }
        const userLogged: any = await axios.post(`${config.quickblox.url}login.json`, params, { headers: headers });
        return userLogged.data.user
    } catch (error: any) {
        throw new appError(httpStatus.CONFLICT, message.PROVIDE_USER_PASS);
    }
}

const userChatStart = async (header: any, body: any) => {
    try {
        const headers = {
            'QB-Token': header,
            'Content-Type': 'application/json'
        };
        const getUserTo: any = await getUserById(body.to, header);
        body.img = getUserTo.custom_data
        let params: any;
        if (body.filename) {
            params = {
                message: body.message,
                recipient_id: body.to,
                type: 3,
                attachments: {
                    "0": {
                        "type": "link",
                        "url": body.filename
                    }
                },
                userRole: body.userType
            }
        } else {
            params = {
                message: body.message,
                recipient_id: body.to,
                type: 3,
                userRole: body.userType
            }
        }
        const userChat: any = await axios.post(`${config.quickblox.url}chat/Message.json`, params, { headers: headers });
        if (userSocketMap.length > 0) {
            const filteredData = userSocketMap.filter((item: any) =>
                item.userId != body.currentUser && item.chatId == userChat.data.chat_dialog_id
            );

            const presentUser = userSocketMap.filter((item: any) =>
                item.userId == body.currentUser && item.chatId == userChat.data.chat_dialog_id
            );
            if (filteredData.length > 0) {
                // const chatId = filteredData[0];
                filteredData.forEach((element: { socketKey: string | string[]; }) => {
                    io.to(element.socketKey).emit('receive_msg', userChat.data);
                });

                presentUser.forEach((element: { socketKey: string | string[]; }) => {
                    io.to(element.socketKey).emit('receive_msg', userChat.data);
                });

                // io.to(presentUser.socketKey).emit('receive_msg', userChat.data);
            } else {
                const dataEntry: any = {
                    dialogId: userChat.data.chat_dialog_id,
                    message: body.message ? body.message : "",
                    messageId: userChat.data._id,
                    entryAt: userChat.data.created_at,
                    recipient_id: userChat.data.recipient_id,
                    roleId: body.userType.toLowerCase() == 'social' ? 2 : 3
                }
                database.Notifications.create(dataEntry);
            }
        }
        return userChat.data
    } catch (error: any) {
        throw new appError(error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.statusCode ? error.message : message.SERVICE_UNAVILABLE);
    }
}

const userGroupChat = async (header: any, body: any) => {
    try {
        const headers = {
            'QB-Token': header,
            'Content-Type': 'application/json'
        };
        await getGroupById(body.to, header);
        let params: any;
        if (body.filename) {
            params = {
                message: body.message,
                chat_dialog_id: body.to,
                "send_to_chat": 1,
                "markable": 1,
                attachments: {
                    "0": {
                        "type": "link",
                        "url": body.filename
                    }
                },
                userRole: body.userType
            }
        } else {
            params = {
                message: body.message,
                chat_dialog_id: body.to,
                "send_to_chat": 1,
                "markable": 1,
                userRole: body.userType
            }
        }
        const userChat: any = await axios.post(`${config.quickblox.url}chat/Message.json`, params, { headers: headers });
        return userChat.data
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const userDialogChat = async (header: any, chatId: any, query: any) => {
    try {
        const headers = {
            'QB-Token': header,
            'Content-Type': 'application/json'
        };
        const { page, limit, sort, skip } = getQueryOptions(query);
        const params: any = {
            'chat_dialog_id': chatId,
            page: page,
            limit: limit,
            skip: skip,
            sort_desc: 'date_sent'
        }
        const userChat: any = await axios.get(`${config.quickblox.url}chat/Message.json`, { headers: headers, params: params });
        if (userChat.data.items.length <= 0) {
            throw new appError(httpStatus.NO_CONTENT, message.NOT_FOUND.replace('#', 'Message'))
        }
        return userChat.data.items
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const getUnreadMessage = async (header: any) => {
    try {
        const headers = {
            'QB-Token': header,
            'Content-Type': 'application/json'
        };
        const userChat: any = await axios.get(`${config.quickblox.url}chat/Message/unread.json`, { headers: headers });
        return userChat.data
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const getNotify = async (token: any, body: any) => {
    try {
        let userMessages: number = 0;
        const headers = {
            'QB-Token': token,
            'Content-Type': 'application/json'
        };
        const statusBody: any = body.status
        statusBody == ROLES.SOCIAL ? body.status = ROLES.PROFESSIONAL : body.status = ROLES.SOCIAL;
        const dialogList: any = await axios.get(`${config.quickblox.url}chat/Dialog.json?occupants_ids[all]=${body.custom_user}&data[class_name]=role&data[userRole]=${body.status}`, { headers: headers })
        if (!dialogList) {
            userMessages = 0
        } else {
            const totalUnreadMessages = dialogList.data.items.reduce((total: number, dialog: any) => {
                return total + (dialog.unread_messages_count || 0);
            }, 0);
            userMessages = totalUnreadMessages
        }
        statusBody == ROLES.SOCIAL ? body.status = 3 : body.status = 2;
        const getRequestOpp: any = await getOppRequest({ to: body.user, role: body.status })
        return { requestCount: getRequestOpp.length, messageCount: userMessages }
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}

const createNofication = async (token: string, body: any) => {
    try {
        const configHeader = {
            headers: {
                'QB-Token': token,
                'Content-Type': 'application/json',
            },
        };
        const notificationData: any = {
            event: {
                notification_type: "push",
                environment: config.env,
                user: {
                    ids: body.to
                },
                push_type: "gcm",
                message: body.message
            }
        }
        const notificationSent: any = await axios.post(`${config.quickblox.url}events.json`, notificationData, { headers: configHeader.headers });
        return notificationSent.data.event
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}

const createSubscription = async (token: string, body: any) => {
    try {
        const configHeader = {
            headers: {
                'QB-Token': token,
                'Content-Type': 'application/json',
            },
        };
        const subscriptionData: any = {
            notification_channel: 'gcm',
            push_token: {
                environment: config.env,
                client_identification_sequence: token
            },
            device: {
                platform: body.platform,
                udid: body.udid
            }
        }
        const subscribed: any = await axios.post(`${config.quickblox.url}subscriptions.json`, subscriptionData, { headers: configHeader.headers });
        return await subscribed.data;
    } catch (error: any) {
        console.error('Subscription error:', error.response.data);
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}

const getSubscribers = async (header: string) => {
    try {
        const headers = {
            'QB-Token': header,
            'Content-Type': 'application/json'
        };
        const subList: any = await axios.get(`${config.quickblox.url}subscriptions.json`, { headers: headers });
        if (subList.data) {
            return subList.data
        } else {
            throw new appError(httpStatus.NO_CONTENT, message.NOT_FOUND.replace('#', 'Subscribers list'));
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const getEventsData = async (header: string, query: any) => {
    try {
        const headers = {
            'QB-Token': header,
            'Content-Type': 'application/json'
        };
        const { page, limit, sort, skip } = getQueryOptions(query)
        const eventList: any = await axios.get(`${config.quickblox.url}events.json?per_page=${limit}&page=${page}`, { headers: headers });
        if (eventList.data.items.length > 0) {
            return {
                total: eventList.data.total_entries,
                data: eventList.data.items
            }
        } else {
            throw new appError(httpStatus.NO_CONTENT, message.NOT_FOUND.replace('#', 'Event list'));
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const getNotifyData = async (body: any) => {
    try {
        const status: any = body.status.toLowerCase() == 'social' ? 2 : 3
        const currentUser: any = await getUser(body.user);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const getRequestReceive = await database.Requests.findAll({
            where: {
                to: body.user,
                entryAt: {
                    [Op.gte]: sevenDaysAgo
                },
                roleId: status,
                isRead: false
            },
            include: [
                {
                    model: database.Users,
                    as: 'sender',
                    attributes: ['id', 'name', 'email', 'quickbloxId', 'bio', 'gender', 'profileImage'] // Specify the columns you want from the User table
                }
            ],
            order: [['entryAt', 'Desc']]
        });
        const notificationData: any = await database.Notifications.findAll({
            where: {
                recipient_id: currentUser.quickbloxId,
                entryAt: {
                    [Op.gte]: sevenDaysAgo
                },
                roleId: status,
                isRead: false
            }
        })
        const allData: any = [...notificationData, ...getRequestReceive];
        const sortedData = await allData.sort((a: any, b: any) => new Date(b.entryAt).getTime() - new Date(a.entryAt).getTime());
        const startIndex = (body.page - 1) * body.limit;
        const endIndex = startIndex + body.limit;
        const currentPageItems = sortedData.slice(startIndex, endIndex);
        return currentPageItems
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}

const updateNotifyData = async (body: any) => {
    try {
        let requestData: any
        if (body.type.toLowerCase() == 'request') {
            requestData = await database.Requests.findByPk(body.id);
        } else {
            requestData = await database.Notifications.findByPk(body.id);
        }
        requestData.isRead = true;
        return await requestData.save();
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}

const manageUser = async (userId: number, body: any) => {
    try {
        const user = await getUserId(userId);

        const { action, quickbloxId, info } = body;
        if (user == null) {
            throw new appError(httpStatus.BAD_REQUEST, message.NOT_FOUND.replace('#', 'user'));
        }
        user.blockUser = user.blockUser || [];
        user.reportedUser = user.reportedUser || [];

        if (action === 'block') {
            if (!user.blockUser.includes(quickbloxId)) {
                user.blockUser.push(quickbloxId);
            }

            if (user.connectedChats && user.connectedChats.includes(quickbloxId)) {
                user.connectedChats = user.connectedChats.filter((id: any) => id !== quickbloxId);
            }
        }
        else if (action === 'unblock') {
            user.blockUser = user.blockUser.filter((id: any) => id !== quickbloxId);
        }
        else if (action === 'report') {
            if (!user.reportedUser.includes(quickbloxId)) {
                const getReportedUser: any = await getUserQuickBlox(quickbloxId);
                const existingReport = await database.Reportes.findOne({
                    where: {
                        userId: userId,
                        reportedUserId: getReportedUser.id
                    }
                });
                if (existingReport) {
                    throw new appError(httpStatus.BAD_REQUEST, message.ALREADY_REPORT);
                }
                if (info) {
                    const reportEntry = await database.Reportes.create({
                        userId: userId,
                        reportedUserId: getReportedUser.id,
                        message: info
                    });
                    user.reportedUser.push(reportEntry.id);
                } else {
                    throw new appError(httpStatus.BAD_REQUEST, message.REQUIRED_MSG);
                }
            } else {
                throw new appError(httpStatus.BAD_REQUEST, message.ALREADY_REPORT);
            }
        }
        else {
            throw new appError(httpStatus.BAD_REQUEST, message.INVALID_ACTION);
        }

        const updatedRows = await database.Users.update(
            { blockUser: user.blockUser, reportedUser: user.reportedUser, connectedChats: user.connectedChats },
            { where: { id: userId } }
        );
        if (updatedRows[0] === 1) {
            const actionText = action === 'block' ? 'blocked' : action === 'report' ? 'reported' : 'unblocked';
            return actionText;
        } else {
            throw new appError(httpStatus.INTERNAL_SERVER_ERROR, message.FAILED_UPDATE);
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const fetchBlockedUserDetails = async (quickbloxIds: number[]) => {
    try {
        const blockedUserDetails = await database.Users.findAll({
            where: {
                quickbloxId: quickbloxIds
            },
            attributes: ['id', 'name', 'profileImage', 'quickbloxId']
        })
        return blockedUserDetails;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const fetchReportedUserDetails = async (reportedUserIds: string[]) => {
    try {
        const reportedUserDetails = await database.Reportes.findAll({
            where: {
                id: reportedUserIds
            },
            attributes: ['id', 'reportedUserId', 'message'],
            include: [
                {
                    model: database.Users,
                    attributes: ['id', 'name', 'profileImage']
                }
            ]
        });
        return reportedUserDetails;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getmanageUser = async (userId: number) => {
    try {
        const user: any = await database.Users.findByPk(userId, {
            attributes: ['id', 'name', 'reportedUser', 'blockUser']
        });
        const blockedUsers: any[] = user.blockUser || [];
        const blockedUserDetails = await fetchBlockedUserDetails(blockedUsers);
        user.blockUser = blockedUserDetails;

        const reportedUsers: any[] = user.reportedUser || [];
        const reportedUserDetails = await fetchReportedUserDetails(reportedUsers);
        user.reportedUser = reportedUserDetails;

        return user;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const updateMobileQuickblox: any = async (id: number, body: any) => {
    try {
        const headers = {
            'Authorization': `ApiKey ${config.quickblox.apiKey}`,
            'Content-Type': 'application/json'
        };
        const updateMobile: any = await axios.put(`${config.quickblox.url}users/${id}.json`, body, { headers: headers });
        return updateMobile?.data?.user
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE);
    }
}

const updateEmailQuickblox: any = async (id: number, body: any) => {
    try {
        const headers = {
            'Authorization': `ApiKey ${config.quickblox.apiKey}`,
            'Content-Type': 'application/json'
        };
        const updateEmail: any = await axios.put(`${config.quickblox.url}users/${id}.json`, body, { headers: headers });
        return updateEmail?.data?.user
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE);
    }
}


const getSearchChat = async (search: any) => {
    try {
        const headers = {
            'Authorization': `ApiKey ${config.quickblox.apiKey}`,
            'Content-Type': 'application/json'
        };
        const ans = await axios.get(`${config.quickblox.url}chat/Message.json?chat_dialog_id=${search.chat_dialog_id}&message[ctn]=${search.search}`, { headers: headers });        
        return ans.data;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const clearChats = async (search: any) => {
    try {            
        const headers = {
            'Authorization': `ApiKey ${config.quickblox.apiKey}`,
            'Content-Type': 'application/json'
        };
        const ans = await axios.delete(`${config.quickblox.url}chat/Message/${search.chatIds}.json`, { headers: headers });               
        return ans.data;
    } catch (error: any) {               
        throw new appError(error.statusCode, error.message)
    }
}

export {
    getToken,
    getUsers,
    getDialogs,
    userLogin,
    userChatStart,
    userGroupChat,
    userDialogChat,
    createUser,
    getUnreadMessage,
    checkedUser,
    checkConnection,
    updateProfileChat,
    getNotify,
    createNofication,
    createSubscription,
    getSubscribers,
    getEventsData,
    getNotifyData,
    createDialog,
    updateNotifyData,
    getmanageUser,
    manageUser,
    updateEmailQuickblox,
    updateMobileQuickblox,
    getCurrentUserDetails,
    getSearchChat,
    clearChats
}
