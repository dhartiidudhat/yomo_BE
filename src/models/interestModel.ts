import { DataTypes } from "sequelize";

module.exports = interestModel;

function interestModel(sequelize: any) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "uploads/default/shield.png"
        },
        entryAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    };
    return sequelize.define('interest', attributes, { timestamps: false });
}