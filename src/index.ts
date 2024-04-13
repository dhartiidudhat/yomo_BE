import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from '../src/routes/indexRoute';
import {logger} from '../src/config/logger';
import cors from 'cors';
import bodyParser from 'body-parser';
import {initialize} from '../src/utils/mysqlConnector';
import { message } from './utils/messages';
import { Server } from "socket.io";
import { getConnection } from './utils/socketConnection';


const router: Express = express();

// Logging
router.use(morgan('dev'));

// Parse the request
router.use(bodyParser.urlencoded({ extended: false }));

// Json Data processing
router.use(express.json());

// Multi platform
router.use(cors());

// Routing
router.use('/', routes);

//Upload Image
router.use('/uploads/', express.static('uploads'));

// Error Handling
router.use((req, res, next) => {
    return res.status(404).json({
        message: message.NOT_FOUND_URL
    });
});
// connect db
initialize().then(()=>{
    logger.info(`Connected to db at ${process.env.MY_SQL_DB_PORT}`)
}).catch((err: Error) => {
    logger.error(err.message)
})

// Server
const httpServer = http.createServer(router);

const PORT: any = process.env.PORT || 4000;
let server: any = httpServer.listen(PORT, () => {
    logger.info(`Connected to server at port ${PORT}`);
});
// Socket Implementation
const io = new Server(httpServer, {
    cors: {
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
getConnection(io);
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info("Server closed successfully");
        });
    }
    process.exit(1);
};

const unExpectedErrorHandler = (error: any) => {
    logger.error(error);
    exitHandler();
}
process.on('uncaughtException', unExpectedErrorHandler);
process.on('unhandledRejection', unExpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
export {
    io
};