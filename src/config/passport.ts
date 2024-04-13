import { Strategy, ExtractJwt } from "passport-jwt";
import config from './config';
import {database} from "../utils/mysqlConnector";

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

const jwtVerify = async (payload: { sub: { user: any; }; }, done: (arg0: unknown, arg1: string | boolean) => void) => {
    try {
        let user: any;
        user = '';
        user = await database.Users.findByPk(payload.sub.user);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
export = jwtStrategy;