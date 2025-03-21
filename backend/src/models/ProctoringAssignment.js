const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const TA = require('./TA');
const Exam = require('./Exam');

class ProctoringAssignment extends Model{
    // what functions are needed?
}

ProctoringAssignment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        taID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: TA,
                key: 'id',
            },            
            onDelete: 'CASCADE',
        },
        examID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: Exam,
                key: 'id',
            },            
            onDelete: 'CASCADE',
        } // are there other attributes needed?
    },
    {
        sequelize,
        modelName: 'ProctoringAssignment',
        tableName: 'proctoringassignments', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

Exam.hasMany(ProctoringAssignment, { foreignKey: 'examID' });
ProctoringAssignment.belongsTo(Exam, { foreignKey: 'examID' });

TA.hasMany(ProctoringAssignment, { foreignKey: 'taID' });
ProctoringAssignment.belongsTo(TA, { foreignKey: 'taID' });

module.exports = ProctoringAssignment;