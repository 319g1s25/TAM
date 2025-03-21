const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

class Classroom extends Model {
    // Getters
    getId() {
        return this.id;
    }

}

Classroom.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }, 
        room: {
            type: DataTypes.STRING, // assuming room is string 
            allowNull: false,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        examCapacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }, // are there other attributes needed?
    },
    {
        sequelize,
        modelName: 'Classroom',
        tableName: 'classrooms', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

module.exports = Classroom;