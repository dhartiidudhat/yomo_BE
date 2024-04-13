import { DataTypes } from "sequelize";

module.exports = industryModel;

function industryModel(sequelize: any) {
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
    return sequelize.define('industry', attributes, { timestamps: false });
}