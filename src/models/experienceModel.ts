import { DataTypes } from 'sequelize';

module.exports = experienceModel;

function experienceModel(sequelize: any) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        experience: {
            type: DataTypes.JSON,
            allowNull: false
        }
    };
    return sequelize.define('experience', attributes, { timestamps: false });
}