const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const TA = require('./TA');
const Exam = require('./Exam');

class SwapRequest extends Model {
    // Getters
    getId() {
        return this.id;
    }

    // what functions are needed?
}

SwapRequest.init(
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
        swappingTaID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: TA,
                key: 'id',
            },            
            onDelete: 'CASCADE',
        },
        swappedTaID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: TA,
                key: 'id',
            },            
            onDelete: 'CASCADE',
        }, // are there other attributes needed
    },
    {
        sequelize,
        modelName: 'SwapRequest',
        tableName: 'swaprequests', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

Exam.hasMany(SwapRequest, { foreignKey: 'examID' });
SwapRequest.belongsTo(Exam, { foreignKey: 'examID' });

TA.hasMany(SwapRequest, { foreignKey: 'swappedTaID' });
SwapRequest.belongsTo(TA, { foreignKey: 'swappedTaID' });

TA.hasMany(SwapRequest, { foreignKey: 'swappingTaID' });
SwapRequest.belongsTo(TA, { foreignKey: 'swappingTaID' });

module.exports = SwapRequest;