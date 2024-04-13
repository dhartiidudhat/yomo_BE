import Joi from "joi";
import { message } from "../utils/messages";

const Country = {
    body: Joi.object().keys({
        countryName: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country name'),
            'string.empty': message.VALID_INPUT.replace('#', 'country name'),
        }),
        countryCode: Joi.string().trim().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country code'),
            'string.empty': message.VALID_INPUT.replace('#', 'country code')
        })
    })
}

const updateCountry = {
    param: Joi.object().keys({
        countryId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country id'),
            'string.empty': message.VALID_INPUT.replace('#', 'country id')
        })
    }),
    body: Joi.object().keys({
        countryName: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country name'),
            'string.empty': message.VALID_INPUT.replace('#', 'country name')
        }),
        countryCode: Joi.string().trim().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country code'),
            'string.empty': message.VALID_INPUT.replace('#', 'country code')
        })
    })
}

const deleteCountry = {
    param: Joi.object().keys({
        countryId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country id'),
            'string.empty': message.VALID_INPUT.replace('#', 'country id')
        })
    })
}

//State

const State = {
    body: Joi.object().keys({
        stateName: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'state name'),
            'string.empty': message.VALID_INPUT.replace('#', 'state name'),
        }),
        countryId: Joi.number().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country id'),
            'string.empty': message.VALID_INPUT.replace('#', 'country id')
        })
    })
}

const stateById = {
    param: Joi.object().keys({
        stateId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'state id'),
            'string.empty': message.VALID_INPUT.replace('#', 'state id')
        })
    })
}

const StateByCountry = {
    param: Joi.object().keys({
        countryId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'country id'),
            'string.empty': message.VALID_INPUT.replace('#', 'country id')
        })
    })
}

const updateState = {
    param: Joi.object().keys({
        stateId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'state id'),
            'string.empty': message.VALID_INPUT.replace('#', 'state id')
        })
    }),
    body: Joi.object().keys({
        stateName: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'state name'),
            'string.empty': message.VALID_INPUT.replace('#', 'state name')
        })
    })
}

//City

const City = {
    body: Joi.object().keys({
        cityName: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'city name'),
            'string.empty': message.VALID_INPUT.replace('#', 'city name'),
        }),
        stateId: Joi.number().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'state id'),
            'string.empty': message.VALID_INPUT.replace('#', 'state id')
        })
    })
}

const cityById = {
    param: Joi.object().keys({
        cityId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'city id'),
            'string.empty': message.VALID_INPUT.replace('#', 'city id')
        })
    })
}

const cityByState = {
    param: Joi.object().keys({
        stateId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'state id'),
            'string.empty': message.VALID_INPUT.replace('#', 'state id')
        })
    })
}

//User Language
const language = {
    body: Joi.object().keys({
        languageName: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'language name'),
            'string.empty': message.VALID_INPUT.replace('#', 'language name'),
        })
    })
}

//Interest
const interest = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'interest name'),
            'string.empty': message.VALID_INPUT.replace('#', 'interest name'),
        }),
        image: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'interest')
        })
    })
}

//Industry
const industry = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'industry name'),
            'string.empty': message.VALID_INPUT.replace('#', 'industry name'),
        }),
        image: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'industry')
        })
    })
}

//Experience

const Experience = {
    body: Joi.object().keys({
        lower: Joi.number().integer().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'lower'),
            'number.base': message.VALID_INPUT.replace('#', 'lower'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'lower'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'lower'),
        }),
        upper: Joi.number().integer().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'upper'),
            'number.base': message.VALID_INPUT.replace('#', 'upper'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'upper'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'upper'),
        })
    })
}

export = {
    Country,
    updateCountry,
    deleteCountry,
    State,
    stateById,
    language,
    StateByCountry,
    City,
    cityById,
    cityByState,
    updateState,
    interest,
    Experience,
    industry
}