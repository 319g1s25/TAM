const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

class User extends Model {
    // Getters
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getSurname() {
        return this.surname;
    }

    // Setters
    setId(id) {
        this.id = id;
    }

    setName(name) {
        this.name = name;
    }

    setSurname(surname) {
        this.surname = surname;
    }
}

User.init(
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
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

module.exports = User;