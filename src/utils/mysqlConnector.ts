import { Sequelize } from "sequelize";
import config from "../config/config";
import mysql from "mysql2/promise";
import { appError } from "./appError";
import httpStatus from "http-status";
import { ROLES } from "../config/constants";
import { message } from "./messages";
import * as fs from "fs";
import path from "path";

let database: any = {};
async function checkRoles(roleArray: any) {
    try {
        const roles = await database.Roles.findAll({
            where: {
                role: roleArray
            }
        });

        const foundNames = await roles.map((user: any) => user.role);
        const missingNames = await roleArray.filter((roleName: string) => !foundNames.includes(roleName));

        if (missingNames.length === 0) {
            return;
        } else {
            await missingNames.forEach(async (roleName: string) => {
                await database.Roles.create({ role: roleName })
            })
            return;
        }
    } catch (error: any) {
        throw new appError(httpStatus.BAD_GATEWAY, message.SERVICE_UNAVILABLE)
    }
}
async function initialize() {
    try {
        const { host, userName, password, db, port } = config.database;
        try {
            let connection = await mysql.createPool({
                host: host,
                user: userName,
                password: password,
                database: db,
                port: port,
            });
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${db}\`;`);
        } catch (err) {
            console.log("error", err);
        }
        try{                      
            const sequelize = new Sequelize(db, userName, password, {
                host: host,
                port: 3306,
                dialect: "mysql",
                dialectOptions: {
                    ssl: {
                        ca: fs.readFileSync(
                            path.join(__dirname, './../../DigiCertGlobalRootCA.crt.pem')                          
                        ), // Provide the correct path to your SSL certificate file
                    },
                },
            });
            sequelize.authenticate().then(async () => {
                // init models and add them to the exported db object
                database.Requests = require('../models/requestModel')(sequelize);
                database.Users = require('../models/userModel')(sequelize);
                database.Settings = require('../models/settingModel')(sequelize);
                database.Roles = require('../models/roleModel')(sequelize);
                database.Interest = require('../models/interestModel')(sequelize);
                database.Countries = require('../models/countryModel')(sequelize);
                database.States = require('../models/stateModel')(sequelize);
                database.Cities = require('../models/cityModel')(sequelize);
                database.Languages = require('../models/languageModel')(sequelize);
                database.Notifications = require('../models/notificationModel')(sequelize);
                database.Industries = require('../models/industryModel')(sequelize);
                database.Experiences = require('../models/experienceModel')(sequelize);
                database.Reportes = require('../models/reportModel')(sequelize);
    
                // Use the foreign key in the db
                database.Users.belongsTo(database.Settings, { foreignKey: 'settingId' });
                database.Users.belongsTo(database.Roles, { foreignKey: 'roleId' });
    
                database.Requests.belongsTo(database.Users, { foreignKey: 'from', as: 'sender' });
                database.Requests.belongsTo(database.Users, { foreignKey: 'to', as: 'receiver' });
    
                database.Users.belongsTo(database.Countries, { foreignKey: 'countryId' });
                database.Users.belongsTo(database.States, { foreignKey: 'stateId' });
                database.Users.belongsTo(database.Cities, { foreignKey: 'cityId' });
    
                database.Users.belongsTo(database.Experiences, { foreignKey: 'experienceId' });
    
                database.Countries.hasMany(database.States, { foreignKey: 'countryId' });
                database.States.belongsTo(database.Countries, { foreignkey: 'countryId' });
                database.States.hasMany(database.Cities, { foreignKey: 'stateId' });
                database.Cities.belongsTo(database.States, { foreignKey: 'stateId' });
    
                database.Reportes.belongsTo(database.Users, { foreignKey: 'reportedUserId' });
    
                await sequelize.sync({});
                const namesArray: any = Object.values(ROLES);
                await checkRoles(namesArray);
            })
        } catch (err){
            console.log("second catch", err);
        }
    } catch (error: any) {
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE)
    }
}
export {
    initialize,
    database
}