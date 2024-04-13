import { DataTypes } from "sequelize";

module.exports = settingModel;

function settingModel(sequelize: any) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        setting: {
            type: DataTypes.JSON,
            allowNull: false,
            length: 50
        },
        entryAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    };
    return sequelize.define('setting', attributes, { timestamps: false });
}