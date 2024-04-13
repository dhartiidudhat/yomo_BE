import Joi from "joi";
import { REQUEST, ROLES } from "../config/constants";
import { message } from "../utils/messages";

const userRegister = {
    body: Joi.object().keys({
        mobile: Joi.number().min(1000000000).max(9999999999).integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.min': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.max': message.VALID_INPUT.replace('#', 'Mobile'),
            'any.required': message.PROVIDE_INPUT.replace('#', 'mobile number'),
        }),
        countryCode: Joi.string().trim().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country code'),
            'string.empty': message.VALID_INPUT.replace('#', 'country code')
        }),
        name: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'name'),
            'string.empty': message.VALID_INPUT.replace('#', 'name')
        }),
        email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'email'),
            'string.empty': message.VALID_INPUT.replace('#', 'email'),
            'string.email': message.VALID_INPUT.replace('#', 'email')
        })
    })
}

const Login = {
    body: Joi.object().keys({
        mobile: Joi.number().min(1000000000).max(9999999999).integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.min': message.MOBILE_MIN,
            'number.max': message.MOBILE_MAX,
            'any.required': message.PROVIDE_INPUT.replace('#', 'mobile number')
        }),
        countryCode: Joi.string().trim().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country code'),
            'string.empty': message.VALID_INPUT.replace('#', 'country code')
        })
    })
}

const userProfile = {
    param: Joi.object().keys({
        userId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'user id'),
            'string.empty': message.VALID_INPUT.replace('#', 'user id')
        })
    }),
    body: Joi.object().keys({
        name: Joi.string().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'name'),
            'string.empty': message.VALID_INPUT.replace('#', 'name')
        }),
        bio: Joi.string().max(300).trim().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'bio')
        }),
        education: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'education')
        }),
        dob: Joi.date().max('now').messages({
            'string.empty': message.VALID_INPUT.replace('#', 'dob')
        }),
        gender: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'gender')
        }),
        designation: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'designation')
        }),
        companyName: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'company Name')
        }),
        industry: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'industry')
        }),
        industryId: Joi.array().items(Joi.number()).default([]),
        experienceId: Joi.number().messages({
            'number.base': message.VALID_INPUT.replace('#', 'experience'),
        }),
        capability: Joi.string().max(100).messages({
            'string.empty': message.VALID_INPUT.replace('#', 'capability')
        }),
        userLanguage: Joi.any(),
        cityId: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'city')
        }),
        stateId: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'state')
        }),
        countryId: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'country')
        }),
        latitude: Joi.number().min(-90).max(90).messages({}),
        longitude: Joi.number().min(-180).max(180).messages({}),
        roleId: Joi.string().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'role id'),
            'string.empty': message.VALID_INPUT.replace('#', 'role id')
        }),
        dislikeId: Joi.array().items(Joi.number()).default([]),
    })
}

const verifyUser = {
    param: Joi.object().keys({
        id: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'user id'),
            'string.empty': message.VALID_INPUT.replace('#', 'user id')
        })
    }),
    body: Joi.object().keys({
        otp: Joi.number().max(999999).integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'Otp'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'otp'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'otp'),
            'any.required': message.PROVIDE_INPUT.replace('#', 'otp'),
        }),
    })
}

const resendOtp = {
    body: Joi.object().keys({
        mobile: Joi.number().min(1000000000).max(9999999999).integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.min': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.max': message.VALID_INPUT.replace('#', 'Mobile'),
            'any.required': message.PROVIDE_INPUT.replace('#', 'mobile number'),
        }),
        countryCode: Joi.string().trim().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country code'),
            'string.empty': message.VALID_INPUT.replace('#', 'country code')
        })
    })
}

const getUserById = {
    param: Joi.object().keys({
        userId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'user id'),
            'string.empty': message.VALID_INPUT.replace('#', 'user id')
        })
    })
}

// const refreshToken = {
//     body: Joi.object().keys({
//         userId: Joi.number().required().messages({
//             'any.required': message.PROVIDE_INPUT.replace('#', 'user id'),
//         })
//     })
// }

const getUserList = {
    query: Joi.object().keys({
        search: Joi.string(),
        sortBy: Joi.string(),
        page: Joi.string(),
        limit: Joi.string(),
        type: Joi.string()
    })
}

const connect = {
    body: Joi.object().keys({
        to: Joi.number().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'connection id'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'connection id'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'connection id'),
            'any.required': message.PROVIDE_INPUT.replace('#', 'connection id'),
        }),
    }) 
}

const respond = {
    param: Joi.object().keys({
        requestId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'request id'),
            'string.empty': message.VALID_INPUT.replace('#', 'request id')
        })
    }),
    query: Joi.object().keys({
        status: Joi.string().valid(...Object.values(ROLES)).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'status'),
            'string.empty': message.VALID_INPUT.replace('#', 'status')
        })
    }),
    body: Joi.object().keys({
        status: Joi.string().valid(...Object.values(REQUEST)).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'status'),
            'string.empty': message.VALID_INPUT.replace('#', 'status'),
            'any.only': message.VALID_INPUT.replace('#', 'status')
        })
    }) 
}

const getConnect = {
    query: Joi.object().keys({
        search: Joi.string(),
        sortBy: Joi.string(),
        page: Joi.string(),
        limit: Joi.string(),
        type: Joi.string()
    })
}


const updateEmail = {
    param: Joi.object().keys({
        userId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'user id'),
            'string.empty': message.VALID_INPUT.replace('#', 'user id')
        })
    }),
    body: Joi.object().keys({
        existEmail: Joi.string().email({ minDomainSegments: 2 }).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'email'),
            'string.empty': message.VALID_INPUT.replace('#', 'email'),
            'string.email': message.VALID_INPUT.replace('#', 'email')
        }),
        newEmail: Joi.string().email({ minDomainSegments: 2 }).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'email'),
            'string.empty': message.VALID_INPUT.replace('#', 'email'),
            'string.email': message.VALID_INPUT.replace('#', 'email')
        })
    })
}

const updateMobile = {
    param: Joi.object().keys({
        userId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'user id'),
            'string.empty': message.VALID_INPUT.replace('#', 'user id')
        })
    }),
    body: Joi.object().keys({
        existMobile: Joi.number().min(1000000000).max(9999999999).integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.min': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.max': message.VALID_INPUT.replace('#', 'Mobile'),
            'any.required': message.PROVIDE_INPUT.replace('#', 'mobile number'),
        }),
        newMobile: Joi.number().min(1000000000).max(9999999999).integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.min': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.max': message.VALID_INPUT.replace('#', 'Mobile'),
            'any.required': message.PROVIDE_INPUT.replace('#', 'mobile number'),
        }),
        existCountryCode: Joi.string().trim().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country code'),
            'string.empty': message.VALID_INPUT.replace('#', 'country code')
        }),
        newCountryCode: Joi.string().trim().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country code'),
            'string.empty': message.VALID_INPUT.replace('#', 'country code')
        })
    })
}

const verifyOtpNumber = {
    param: Joi.object().keys({
        userId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'user id'),
            'string.empty': message.VALID_INPUT.replace('#', 'user id')
        })
    }),
    body: Joi.object().keys({      
        newMobile: Joi.number().min(1000000000).max(9999999999).integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'mobile number'),
            'number.min': message.VALID_INPUT.replace('#', 'Mobile'),
            'number.max': message.VALID_INPUT.replace('#', 'Mobile'),
            'any.required': message.PROVIDE_INPUT.replace('#', 'mobile number'),
        }),     
        newCountryCode: Joi.string().trim().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country code'),
            'string.empty': message.VALID_INPUT.replace('#', 'country code')
        }),
        otp: Joi.number().max(999999).integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'Otp'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'otp'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'otp'),
            'any.required': message.PROVIDE_INPUT.replace('#', 'otp'),
        }),
    })
}

const verifyOtpMail = {
    param: Joi.object().keys({
        userId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'user id'),
            'string.empty': message.VALID_INPUT.replace('#', 'user id')
        })
    }),
    body: Joi.object().keys({              
        newEmail: Joi.string().email({ minDomainSegments: 2 }).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'email'),
            'string.empty': message.VALID_INPUT.replace('#', 'email'),
            'string.email': message.VALID_INPUT.replace('#', 'email')
        }),          
        emailOtp: Joi.number().max(999999).integer().positive().required().messages({
            'number.base': message.VALID_INPUT.replace('#', 'Otp'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'otp'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'otp'),
            'any.required': message.PROVIDE_INPUT.replace('#', 'otp'),
        }),
    })
}


const getRequest = {
    param: Joi.object().keys({
        role: Joi.string().valid(...Object.values(ROLES)).required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'role'),
            'string.empty': message.VALID_INPUT.replace('#', 'role')
        })
    })  
}

export = {
    userRegister,
    verifyUser,
    resendOtp,
    getUserList,
    userProfile,
    getUserById,
    Login,
    connect,
    respond,
    getConnect,
    updateEmail,
    updateMobile,
    verifyOtpNumber,
    verifyOtpMail,
    getRequest
}