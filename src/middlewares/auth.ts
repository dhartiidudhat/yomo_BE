import jwt from 'jsonwebtoken';
import httpStatus from "http-status";
import { roleRights } from "../config/roles";
import {createResponse} from "../utils/response";
import {message} from "../utils/messages";
import config from '../config/config';

const auth = (...requiredRights: any) => async (req: any, res: any, next: any) => {
    try {
        const secretKey: string = config.jwt.secret;
        const token: any = req.header('Authorization');
        if (!token) {
           return await createResponse(res, httpStatus.UNAUTHORIZED, message.AUTHENTICATE, {});
        } else {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded.sub;
            if (requiredRights.length) {
                const userRights = roleRights.get(req.user?.role);
                if (userRights) {
                    const hasRequiredRights = requiredRights.every((requiredRight: any) => userRights.includes(requiredRight));
                    if (hasRequiredRights === false) {
                       return await createResponse(res, httpStatus.FORBIDDEN, message.UNAUTHORIZED_ACTION, {});
                    } else{
                        return await next()
                    }
                }
                else {
                    return await createResponse(res, httpStatus.FORBIDDEN, message.UNAUTHORIZED_ACTION, {});
                }
            } else {
                return await next()
            }
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, "your token has expired", {});
        }
        return await createResponse(res, httpStatus.UNAUTHORIZED, message.AUTHENTICATE, {});
    }
};
export {auth};