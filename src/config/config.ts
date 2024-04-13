import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, './../../.env') });

const envVarSchemas = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(3000),
        // MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access token expires'),
        // JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which access refresh token expires'),
        // SMTP_HOST: Joi.string().description('server to send the emails'),
        // SMTP_PORT: Joi.number().description('port of email server'),
        // SMTP_USERNAME: Joi.string().description('username for email server'),
        // SMTP_PASSWORD: Joi.string().description('password for email server'),
        // EMAIL_FROM: Joi.string().description('sender email address email server'),
        TWILIO_SSID: Joi.string().required().description('Twilio ssid'),
        TWILIO_TOKEN: Joi.string().required().description('Twilio token'),
        TWILIO_FROM: Joi.string().description('Twilio from'),
        MY_SQL_DB_HOST: Joi.string().required().description('db host'),
        MY_SQL_DB_USER: Joi.string().required().description('db username'),
        MY_SQL_DB_PASSWORD: Joi.string().required().description('db password'),
        MY_SQL_DB_PORT: Joi.number().required().description('db port').default(3306),
        APP_ID_QUICKBLOX: Joi.number().required().description('Quickblox id'),
        QUICKBLOX_AUTH_KEY: Joi.string().required().description('Quickblox auth key'),
        QUICKBLOX_AUTH_SECRET: Joi.string().required().description('Quickblox auth secret'),
        ACCOUNT_KEY: Joi.string().required().description('Quickblox account key'),
        API_KEY: Joi.string().required().description('Quickblox api key'),
        QB_API_ENDPOINT: Joi.string().required().description('Quickblox link'),
        FIREBASE_TOKEN: Joi.string().required().description('Firebase token')
    })
    .unknown();
    
const { value: envVars, error } = envVarSchemas.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}
export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_EXPIRATION_MINUTES,
        verifyPasswordExpirationMinutes: envVars.JWT_VERIFY_EXPIRATION_MINUTES, // expire token after 1 year
    },
    database: {
        host: envVars.MY_SQL_DB_HOST,
        userName: envVars.MY_SQL_DB_USER,
        password: envVars.MY_SQL_DB_PASSWORD,
        port: envVars.MY_SQL_DB_PORT,
        db: envVars.MY_SQL_DB_DATABASE
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
        default_reply_to : envVars.DEFAULT_REPLY_TO
    },
    message: {
        twilioId: envVars.TWILIO_SSID,
        twilioToken: envVars.TWILIO_TOKEN,
        twilioFrom: envVars.TWILIO_FROM
    },
    quickblox: {
        appId: envVars.APP_ID_QUICKBLOX,
        authKey: envVars.QUICKBLOX_AUTH_KEY,
        authSecret: envVars.QUICKBLOX_AUTH_SECRET,
        accountKey: envVars.ACCOUNT_KEY,
        apiKey: envVars.API_KEY,
        url: envVars.QB_API_ENDPOINT
    },
    FIREBASE_TOKEN: envVars.FIREBASE_TOKEN
};
