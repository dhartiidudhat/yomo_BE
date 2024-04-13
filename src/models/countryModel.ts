import { DataTypes } from 'sequelize';

module.exports = countryModel;

function countryModel(sequelize: any) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        countryName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        countryCode: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    };
    return sequelize.define('country', attributes, { timestamps: false });
}