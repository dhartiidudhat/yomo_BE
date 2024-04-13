import axios from "axios";
import httpStatus from "http-status";
import config from "../config/config";
import { message } from "../utils/messages";
import { createResponse } from "../utils/response";

const getSessionValid = async (req: any, res: any, next: any) => {
    try {
        const token: any = req.header('QB');
        if (!token) {
            return await createResponse(res, httpStatus.UNAUTHORIZED, message.AUTHENTICATE, {});
        }
        const headers: any = {
            'QB-Token': token
        }
        const authUser: any = await axios.get(`${config.quickblox.url}session.json`, { headers: headers });
        req.custom_user = authUser.data.session.user_id;
        await next()
    } catch (error: any) {
        return await createResponse(res, httpStatus.UNAUTHORIZED, message.AUTHENTICATE, {});
    }
}

export { getSessionValid };