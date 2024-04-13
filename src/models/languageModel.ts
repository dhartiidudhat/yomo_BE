import { DataTypes } from "sequelize";

module.exports = languageModel;

function languageModel(sequelize: any) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        languageName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    };
    return sequelize.define('language', attributes, { timestamps: false });
}