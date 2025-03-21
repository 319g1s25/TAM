const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const User = require('./User'); // Import the parent class

class DeansOffice extends User {
    // "Deans office can do everything the department chair can do, but for every department" -Emre Uzun

    // what functions are to be added?
}

DeansOffice.init(
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

        // other attributes?
    },
    {
        sequelize,
        modelName: 'DeansOffice',
        tableName: 'deansoffices', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

module.exports = DeansOffice;