import { DataTypes } from "sequelize";
import { ROLES } from "../config/constants";

module.exports = roleModel;

function roleModel(sequelize: any) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role: {
            type: DataTypes.ENUM(...Object.values(ROLES)),
            defaultValue: ROLES.PROFESSIONAL,
            default: ROLES.PROFESSIONAL
        },
        entryAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    };
    return sequelize.define('role', attributes, { timestamps: false });
}