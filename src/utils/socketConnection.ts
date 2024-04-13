import { logger } from '../config/logger';
// import { io } from '../index';
import { database } from './mysqlConnector';
const userSocketMap: any = []// Store user IDs and their corresponding socket IDs

const getConnection = (io:any) => {
    io.on('connection', async (socket:any) => {
        try {
            const authorizationHeader = socket.handshake.headers.authorization;
            const chatId = socket.handshake.query.connectedTo
            const user = await database.Users.findOne({ where: { token: authorizationHeader } });
            if (user) {
                const params: any = {
                    socketKey: socket.id,
                    chatId: chatId,
                    userId: user.id,
                    connectedBy: user.quickbloxId
                }
                if (userSocketMap.length > 0) {
                    const filteredData = userSocketMap.filter((item: any) =>
                        item.connectedTo === chatId && item.userId == user.id
                    );
                    const alreadySocket = filteredData[0];
                    if (alreadySocket) {
                        userSocketMap.pop(alreadySocket);
                    }
                }
                userSocketMap.push(params);
                logger.info(`Socket connected successfully for ${user.name},${socket}`)
            }

            socket.on('disconnect', () => {
                if (user && userSocketMap.length > 0) {
                    const deleteData = userSocketMap.filter((item: any) =>
                        item.socketKey === socket.id
                    );
                    if(deleteData.length > 0){
                        userSocketMap.pop(deleteData[0]);
                    }
                    logger.info(`Socket disconnected for ${user.name}`)
                }
            });
        } catch (error: any) {
            logger.error('Socket connection error')
        }
    });
}

export {
    userSocketMap,
    getConnection
}
