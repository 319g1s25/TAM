const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const User = require('./User'); // Import the parent class

class Instructor extends User {

    /**
     * 
     * @param {int} taskID 
     */
    acceptTaskLog(taskID){
        // taskID holds an attribute pointing to an existing TA. find this ta by their id.
        // now increment their workload somehow
        // notify all parties, mark the task status: accepted
    }

    /**
     * 
     * @param {int} taskID 
     */
    rejectTaskLog(taskID){
        // notify all parties, mark the task status rejected.
    }

    /**
     * 
     * @param {Exam} exam 
     */
    createExam(exam){
        // create an exam object in the database with the given exam parameter's info 
    }
}

Instructor.init(
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
        } // are there other attributes needed?
    },
    {
        sequelize,
        modelName: 'Instructor',
        tableName: 'instructors', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

module.exports = Instructor;