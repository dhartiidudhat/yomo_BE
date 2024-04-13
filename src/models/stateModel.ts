import { DataTypes } from "sequelize";

module.exports = stateModel;

function stateModel(sequelize: any) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        stateName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'countries',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        }
    };
    return sequelize.define('state', attributes, { timestamps: false });
}