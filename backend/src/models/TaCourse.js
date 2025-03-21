const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const TA = require('./TA');
const Course = require('./Course');

class TaCourse extends Model {
    // Getters
    getId() {
        return this.id;
    }
}

TaCourse.init(
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
        },
    },
    {
        sequelize,
        modelName: 'TaCourse',
        tableName: 'tacourses', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

TA.hasMany(TaCourse, { foreignKey: 'taID' }); 
TaCourse.belongsTo(TA, { foreignKey: 'taID' }); 

Course.hasMany(TaCourse, { foreignKey: 'courseID' }); // TA → multiple Tasks
TaCourse.belongsTo(Course, { foreignKey: 'courseID' }); // Task → belongs to one TA

module.exports = TaCourse;