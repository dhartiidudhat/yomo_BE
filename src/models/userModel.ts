import { DataTypes } from "sequelize";
import { STATUS } from "../config/constants";

module.exports = userModel;

function userModel(sequelize: any) {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        mobileNumber: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
            validate: { len: 10 }
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        otp: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: { len: [0, 6] }
        },
        quickbloxId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        connectedChats: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        // requestId: {
        //     type: DataTypes.JSON,
        //     allowNull: true,
        //     defaultValue: []
        // },
        isVerify : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Others'),
            allowNull: true
        },
        education: {
            type: DataTypes.STRING,
            allowNull: true
        },
        designation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        industryId: {
            type: DataTypes.JSON,
            allowNull: true
        },
        experienceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'experiences',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        },
        capability: {
            type: DataTypes.STRING,
            allowNull: true
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "uploads/default/shield.png"
        },
        userLanguage: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        cityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'cities',
                key: 'id',
                onDelete: 'SET NULL',
                onUpdate: 'SET NULL'
            }
        },
        stateId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'states',
                key: 'id',
                onDelete: 'SET NULL',
                onUpdate: 'SET NULL'
            }
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'countries',
                key: 'id',
                onDelete: 'SET NULL',
                onUpdate: 'SET NULL'
            }
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },
        linkedin: {
            type: DataTypes.STRING,
            allowNull: true
        },
        instagram: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userStatus: {
            type: DataTypes.ENUM(...Object.values(STATUS)),
            defaultValue: STATUS.INACTIVE,
            allowNull: true
        },
        isLoggedIn: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        settingId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'settings',
                key: 'id',
                onDelete: 'SET NULL',
                onUpdate: 'SET NULL'
            }
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'roles',
                key: 'id',
                onDelete: 'SET NULL',
                onUpdate: 'SET NULL'
            }
        },
        dislikeId: {
            type: DataTypes.JSON,
            allowNull: true
        },
        reportedUser : {
            type: DataTypes.JSON,
            allowNull: true
        },
        blockUser : {
            type: DataTypes.JSON,
            allowNull: true
        },
        entryAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    };
    return sequelize.define('user', attributes, { timestamps: false });
}