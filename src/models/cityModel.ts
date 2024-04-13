import { DataTypes } from "sequelize";

module.exports = cityModel;

function cityModel(sequelize: any) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cityName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'states',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        }
    };
    return sequelize.define('city', attributes, { timestamps: false });
}