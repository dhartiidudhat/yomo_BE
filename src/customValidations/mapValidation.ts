import Joi from "joi";
import { message } from "../utils/messages";

const mapValidation = {
    param: Joi.object().keys({
        userId: Joi.string().required().messages({
            'any.required': message.PROVIDE_INPUT.replace('#', 'user id'),
            'string.empty': message.VALID_INPUT.replace('#', 'user id')
        })
    }),
    body:Joi.object().keys({
        latitude: Joi.number().required().min(-90).max(90).messages({
            'number.base': message.VALID_NUMBER.replace('#', 'latitude'),
            'number.empty': message.VALID_INPUT.replace('#', 'latitude'),
            'number.min': message.MIN_NUMBER.replace('#', 'latitude').replace('$', '-90'),
            'number.max': message.MAX_NUMBER.replace('#', 'latitude').replace('$', '90'),
        }),
        longitude: Joi.number().required().min(-180).max(180).messages({
            'number.base': message.VALID_NUMBER.replace('#', 'longitude'),
            'number.empty': message.VALID_INPUT.replace('#', 'longitude'),
            'number.min': message.MIN_NUMBER.replace('#', 'longitude').replace('$', '-180'),
            'number.max': message.MAX_NUMBER.replace('#', 'longitude').replace('$', '180'),
        }),
        gender: Joi.string().messages({
            'string.empty': message.VALID_INPUT.replace('#', 'gender')
        }),
        minAge: Joi.number().messages({
            'number.base': message.VALID_INPUT.replace('#', 'minAge'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'minAge'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'minAge'),
        }),
        maxAge: Joi.number().messages({
            'number.base': message.VALID_INPUT.replace('#', 'maxAge'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'maxAge'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'maxAge'),
        }),
        dislikeId: Joi.array().items(Joi.number()).default([]),
        industryId: Joi.array().items(Joi.number()).default([]),
        distance: Joi.number().messages({
            'number.base': message.VALID_INPUT.replace('#', 'distance'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'distance'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'distance'),
        }),
        minExperience: Joi.number().messages({
            'number.base': message.VALID_INPUT.replace('#', 'minExperience'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'minExperience'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'minExperience'),
        }),
        maxExperience: Joi.number().messages({
            'number.base': message.VALID_INPUT.replace('#', 'maxExperience'),
            'number.integer': message.INTEGER_INPUT.replace('#', 'maxExperience'),
            'number.positive': message.INTEGER_INPUT.replace('#', 'maxExperience'),
        }),
        roleId : Joi.alternatives().try(
            Joi.string().empty().messages({
                'string.empty': message.VALID_INPUT.replace('#', 'role id')
            }),
            Joi.number().required().messages({
                'any.required': message.PROVIDE_INPUT.replace('#', 'role id')
            })
        )
    })
} 

export = {
    mapValidation
}