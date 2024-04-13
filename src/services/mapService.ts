import { database } from "../utils/mysqlConnector";
import { appError } from '../utils/appError';
import { sendMessage } from '../utils/smsService';
import { message } from '../utils/messages';
import { allUserFilter, getUserId } from "./userService";

const mapCreate = async (userId: number, body: any) => {
    try {
        const alreadyUser: any = await getUserId(userId);
        if (alreadyUser) {
            const location: any = {
                latitude: body.latitude,
                longitude: body.longitude,
            }
            await database.Users.update(location, {
                where: { id: alreadyUser.id }
            });
            const userLatitude = body.latitude;
            const userLongitude = body.longitude;
            const maxDistance = 50000; // Maximum or default distance in kilometers

            const filteredUsers: any[] = await allUserFilter(userLatitude, userLongitude, maxDistance, userId,body.gender,body.minAge, body.maxAge,body.dislikeId,body.industryId,body.distance,body.roleId, body.minExperience, body.maxExperience);
            return filteredUsers;
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

export {
    mapCreate
}