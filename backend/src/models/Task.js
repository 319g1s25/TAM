const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const TA = require('./TA');
const Course = require('./Course');

class Task extends Model {
    // Getters
    getId() {
        return this.id;
    }

    // what functions are needed?
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        taID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: TA,
                key: 'id'
            },
            onDelete: 'CASCADE',  
        },
        courseID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Course,
                key: 'id'
            },
            onDelete: 'CASCADE',
        }, // add other attributes (date, time spent etc.)
    },
    {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

TA.hasMany(Task, { foreignKey: 'taID' }); 
Task.belongsTo(TA, { foreignKey: 'taID' }); 

Course.hasMany(Task, { foreignKey: 'courseID' }); 
Task.belongsTo(Course, { foreignKey: 'courseID' }); 

module.exports = Task;