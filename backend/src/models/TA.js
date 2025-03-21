const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection
const User = require('./User'); // Import the parent class
const LeaveRequest = require('./LeaveRequest');

class TA extends User {
    
    /**
     * Assigns the TA to a proctoring task.
     * 
     * Preconditions: 
     * - Ensures that all necessary constraints are met before assignment.
     * 
     * Postconditions:
     * - If the assignment is successful:
     *   - Updates the TA's workload accordingly.
     *   - Notifies relevant parties.
     * - If the assignment fails:
     *   - Displays an appropriate message explaining the reason for failure.
     * 
     * @param {int} examID Foreign key for the Exam object
     * @returns {boolean} true if the assignment was successful, false otherwise.
     */
    assignProctoring(examID){

        if(this.isOnLeave()){
            // can not assign the proctoring, return false 
        }

        if(this.isTakingTheCourse()){
            // can not assign the proctoring, return false 
        }

        if(!this.isFree()){
            // can not assign the proctoring, return false 
        }

        // TODO: one more constraint to check here which i did not add: "Only PHD students can be assigned to
        // MS/PHD level courses."

        // if all the constraints are checked, assign the ta with the proctoring assignment
        // this means you will create a new proctoringassignment object with this ta's id and parameter
        // exam id
    }

    /**
     * Checks if the TA is on leave.
     * @returns {boolean} true if the TA is on annual leave (absent), false if the TA is available (present).
    */
    isOnLeave(){

    }

    /**
     * Checks if the TA is taking the course 
     * @param courseId The id of the course 
     * @returns {boolean} true if the TA is enrolled in the course with given id, false if not.
     * 
     * Note: I am not sure about whether this is the correct header structure for this function,
     * it can change. 
     */
    isTakingTheCourse(courseId){

    }

    /**
     * Checks if the TA has an exam of another course at the time of the proctoring task.
     * @returns {boolean} true if the TA has another exam at the proctoring hour, false if not.
     */
    isFree(){

    }

    /**
     * Submits an absence request for approval.
     * 
     * @param {LeaveRequest} leaveReq 
     */
    requestAbsence(leaveReq) {
        // first check if the TA has a proctoring assignment on those dates
        // if s/he does, it is not possible to request an absence for those days. S/he should
        // first swap with some other ta and make those days free. Than can request an absence
        
        // so todo is check if the TA has a proctoring assignment, if not create a 
        // leaverequest object on database, if yes warn the ta "can not ask absence request for
        // the days you have proc assignment, swap with someone first"
        
        // should there be a return type
    }

    updateAbsence(){
        // this function will be called after an authority accepts the leave request of the ta
        // somehow store absence data in some attribute
        // maybe the parameter can be the start date and number of absent days ?
    }

    /**
     * 
     * @param {int} procAssignmentID 
     * @param {int} taID The TA which the current TA will send the swap request to.
     */
    swapProctoring(procAssignmentID, taID){
        // find the procAssignment object from the id
        // from procAssignment you should be able to get the exam id.
        // create a swaprequest object with examid, taID, and current taID. add it to the database
        // i am not sure if the swaprequest object need more attributes, so if it does, add so
    }

    /**
     * 
     * @param {SwapRequest} swapRequest 
     */
    acceptProctoringSwap(swapRequest){
        // using the exam id and prev ta id, delete the other proctoring assignment
        // or just change the id of the ta with the new ta id
    }

    /**
     * 
     * @param {SwapRequest} swapRequest 
     */
    rejectProctoringSwap(swapRequest){
        // delete the swaprequest object and notify all parties i guess?
    }
}

TA.init(
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
    },
    {
        sequelize,
        modelName: 'TA',
        tableName: 'tas', // Define the table name
        freezeTableName: true,
        timestamps: false, // Disable createdAt/updatedAt fields
    }
);

module.exports = TA;