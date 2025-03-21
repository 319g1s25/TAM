/**
 * Authorized staff can do add/edit/delete functions for everything (TA/Student/Offerings/Instructor)
 * 
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const User = require('./User'); // Import the parent class

class AuthStaff extends User {

    /**
     * You should implement this function by updating the database. You should add 
     * required parameters for the TA (current parameters are not enough). At the end
     * of this function you should see a new TA object on your database 
     * @param {string} name 
     * @param {string} surname 
     */
    addTA(name, surname){

    }
    /**
     * You should implement this function by updating the database. You will find the TA
     * by their id and delete him/her using database functions. At the end
     * of this function you shouldn't see the TA in the database. 
     * @param {int} taID 
     */
    deleteTA(taID){

    }

    /**
     * You will find the ta by their id and replace their info with the new TA in the parameters list
     * @param {int} taID 
     * @param {TA} ta 
     */
    editTA(taID, ta){

    }


    // DO THE SAME FOR EVERY OBJECT IN THIS SYSTEM (USERS, LEAVE REQUESTS, PROC ASSIGNMENTS AND SO ON)
}

AuthStaff.init(
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

        // DETERMINE IF THE AUTH STAFF HAVE OTHER INFO THAN THESE
    },
    {
        sequelize,
        modelName: 'AuthStaff',
        tableName: 'authstaffs', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

module.exports = AuthStaff;