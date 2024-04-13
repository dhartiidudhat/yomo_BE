import Joi from "joi";
import { ROLES } from "../config/constants";
import { message } from "../utils/messages";

const getDialogs = {
    query: Joi.object().keys({
        search: Joi.string(),
        sortBy: Joi.string(),
        page: Joi.string(),
        limit: Joi.string(),
        type: Joi.string()
    })
}

const searchChat = {
    query: Joi.object().keys({
        search: Joi.string(),
        chat_dialog_id: Joi.string(),
        // page: Joi.string(),
        // limit: Joi.string(),
        // type: Joi.string()
    })
}


const chat = {
    body: Joi.object().keys({
        to: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'receiver'),
            'string.empty': message.VALID_INPUT.replace('#', 'receiver')
        }),
        message: Joi.string().messages({
            // 'any.required': message.PROVIDE_INPUT.replace('#', 'message'),
            'string.empty': message.VALID_INPUT.replace('#', 'message')
        }),
        status: Joi.string().valid(...Object.values(ROLES)).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'status'),
            'string.empty': message.VALID_INPUT.replace('#', 'status')
        })
    })
}

const getChats = {
    param: Joi.object().keys({
        chatId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'chat id'),
            'string.empty': message.VALID_INPUT.replace('#', 'chat id')
        })
    }),
    query: Joi.object().keys({
        search: Joi.string(),
        sortBy: Joi.string(),
        page: Joi.string(),
        limit: Joi.string(),
        type: Joi.string()
    })
}

const unreadNotification = {
    query: Joi.object().keys({
        status: Joi.string().valid(...Object.values(ROLES)).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'status'),
            'string.empty': message.VALID_INPUT.replace('#', 'status')
        }),
        search: Joi.string(),
        sortBy: Joi.string(),
        page: Joi.string(),
        limit: Joi.string(),
        type: Joi.string()
    })
}

const subscribe = {
    body: Joi.object().keys({
        identification: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'client identifier'),
            'string.empty': message.VALID_INPUT.replace('#', 'client identifier')
        }),
        platform: Joi.string().valid('ios', 'android').required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'platform'),
            'string.empty': message.VALID_INPUT.replace('#', 'platform'),
            'any.only': message.VALID_INPUT.replace('#', 'platform')
        }),
        udid: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'udid'),
            'string.empty': message.VALID_INPUT.replace('#', 'udid')
        })
    })
}

const updateNotification = {
    body: Joi.object().keys({
        id: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'notification id'),
            'string.empty': message.VALID_INPUT.replace('#', 'notification id')
        }),
        type: Joi.string().required().valid('Request', 'Message').messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'type'),
            'string.empty': message.VALID_INPUT.replace('#', 'type')
        })
    })
}

const userManage = {
    body: Joi.object().keys({
        action: Joi.string().valid('block', 'unblock', 'report').required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'action'),
            'string.empty': message.VALID_INPUT.replace('#', 'action'),
            'any.only': message.VALID_INPUT.replace('#', 'action')
        }),
        quickbloxId: Joi.number().integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'quickbloxId'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'quickbloxId'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'quickbloxId'),
        }),
        info: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'info'),
            'any.only': message.VALID_INPUT.replace('#', 'info')
        })
    })
}

const clearChat = {
    body: Joi.object().keys({
        chatIds: Joi.array().items(Joi.string()).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'chatIds'),
            'array.base': message.VALID_INPUT.replace('#', 'chatIds'),
            'string.base': message.VALID_INPUT.replace('#', 'Please provide valid chatIds')
        })        
    })
}

export = {
    getDialogs,
    chat,
    getChats,
    unreadNotification,
    subscribe,
    updateNotification,
    userManage,
    searchChat,
    clearChat
}