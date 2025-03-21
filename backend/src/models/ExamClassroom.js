const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

const Classroom = require('./Classroom');
const Exam = require('./Exam');

class ExamClassroom extends Model {
    // Getters
    getId() {
        return this.id;
    }

    // do we need any functions?
}

ExamClassroom.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        examID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: Exam,
                key: 'id',
            },            
            onDelete: 'CASCADE',
        },
        classroomID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: Classroom,
                key: 'id',
            },            
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'ExamClassroom',
        tableName: 'examclassrooms', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

Exam.hasMany(ExamClassroom, { foreignKey: 'examID' });
ExamClassroom.belongsTo(Exam, { foreignKey: 'examID' });

Classroom.hasMany(ExamClassroom, { foreignKey: 'classroomID' });
ExamClassroom.belongsTo(Classroom, { foreignKey: 'classroomID' });


module.exports = ExamClassroom;