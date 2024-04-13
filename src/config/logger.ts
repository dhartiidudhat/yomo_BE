import config from "./config";
import winston from "winston";

const enumerateErrorFormat = winston.format((info: any) => {
    if(info instanceof Error){
        Object.assign(info, {messase: info.stack});
    }
    return info;
});

const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({level, message}) => `${level}: ${message}`)
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error']
        })
    ]
});
export {
    logger
}