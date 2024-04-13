import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { createResponse } from './../utils/response';
import { message } from './../utils/messages';
import { mapCreate } from '../services/mapService';
import { allUserFilter } from '../services/userService';

const createMap = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        req.body.userType = user.role;
        const map: any = await mapCreate(Number(req.params.userId), req.body);
        return await createResponse(res, httpStatus.OK, message.UPDATE_USER,map);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

export = {
    createMap
}