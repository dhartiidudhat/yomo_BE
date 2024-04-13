import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import { pick } from 'lodash';
import {appError} from './../utils/appError';
import { createResponse } from '../utils/response';

const validate = (schema: any) => async(req: Request, res: Response, next: NextFunction ) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const {value, error } = Joi.compile(validSchema).prefs({ errors: { label: 'key'}}).validate(object);
    
    if(error) {
        const errorMessage = error.details.map(details => details.message).join(', ');
        return await createResponse(res, httpStatus.CONFLICT, errorMessage, {})
    }
    Object.assign(req, value);
    return next();
}
export = validate;