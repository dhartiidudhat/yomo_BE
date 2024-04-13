import { DataTypes } from "sequelize";

module.exports = reportModel;

function reportModel(sequelize: any) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reportedUserId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };
    return sequelize.define('reportUser', attributes, { timestamps: false });
}
