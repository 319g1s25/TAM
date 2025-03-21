const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

const TA = require('./TA');
const User = require('./User');

class LeaveRequest extends Model {
    // Getters
    getId() {
        return this.id;
    }

    // what functions should be added?
}

LeaveRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        taID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: TA,
                key: 'id',
            },            
            onDelete: 'CASCADE',
        },
        userID: { // this userID should match with either with dep chair or authorized staff (not sure if this is the correct way of implementing)
            type: DataTypes.STRING,
            allowNull: false,
            references:{
                model: User,
                key: 'id',
            },            
            onDelete: 'CASCADE',
        }, // add other info (start end date and whatever)
    },
    {
        sequelize,
        modelName: 'LeaveRequest',
        tableName: 'leaverequests', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

User.hasMany(LeaveRequest, { foreignKey: 'userID' });
LeaveRequest.belongsTo(User, { foreignKey: 'userID' });

TA.hasMany(LeaveRequest, { foreignKey: 'taID' });
LeaveRequest.belongsTo(TA, { foreignKey: 'taID' });

module.exports = LeaveRequest;