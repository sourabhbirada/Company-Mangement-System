const Salary = require("../models/salary");

function handleDuplicateKeyError(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const errorMessage = `An account with that ${field} already exists.`;
        next(new Error(errorMessage));
    } else {
        next();
    }
}

async function createSalaryForEmployee(employee) {
    try {
        const salary = new Salary({
            empId: employee._id, 
            salaryAmount: 20000, 
        });
        await salary.save(); 
    } catch (error) {
        console.error('Error creating salary:', error);
    }
}





module.exports = {
    handleDuplicateKeyError,
    createSalaryForEmployee
}