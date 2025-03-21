const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const User = require('./User'); // Import the parent class
const LeaveRequest = require('./LeaveRequest');

class DepartmentChair extends User {
    
    /**
     * Accepts a leave request.
     * 
     * @param {int} requestID 
     */
    acceptLeaveRequest(requestID) {
        // requestID has an attribute taID that points to some ta object in database. 
        // find that ta object with database function
        // update their absent days using updateAbsence function of ta class

        // notify all parties and set the status of the leave request accepted
    }

    /**
     * 
     * @param {int} requestID 
     */
    rejectLeaveRequest(requestID){
        // set the status of requestID rejected and notify all parties
    }

    // TODO: i think the department chair can also do other stuff. in the second meeting with Emre Uzun
    // he said that dep chair can also approve tasks (logged tasks by ta's)
    // so consider what other functions should be added (dont just assume things, ask people and customer)
}

DepartmentChair.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'DepartmentChair',
        tableName: 'departmentchairs', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

module.exports = DepartmentChair;