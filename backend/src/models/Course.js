const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

const Instructor = require('./Instructor');

class Course extends Model {
    // Getters
    getId() {
        return this.id;
    }

    // what functions are needed? 
}

Course.init(
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
        instructorID: {
            type: DataTypes.INTEGER, // assuming one course can have one instructor
            allowNull: false,
            references:{
                model: Instructor,
                key: 'id',
            },
        }, // are there other attributes for a course? 
    },
    {
        sequelize,
        modelName: 'Course',
        tableName: 'courses', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

Instructor.hasMany(Course, { foreignKey: 'instructorID' });
Course.belongsTo(Instructor, { foreignKey: 'instructorID' });
module.exports = Course;