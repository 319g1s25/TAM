const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

const User = require('./User');

class Exam extends Model {
    // Getters
    getId() {
        return this.id;
    }

    // what functions are needed?    
}

Exam.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userID: {
            type: DataTypes.INTEGER, // this user can be either AuthStaff, Instructor, or DeansOffice
            // department secretary exam ekleyebilmeli mi? 
            references:{
                model: User,
                key: 'id',
            },            
            onDelete: 'CASCADE',
        },

        // add other attributes related to the exam (date, time, whatever)
    },
    {
        sequelize,
        modelName: 'Exam',
        tableName: 'exams', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

User.hasMany(Exam, { foreignKey: 'userID' });
Exam.belongsTo(User, { foreignKey: 'userID' });

module.exports = Exam;