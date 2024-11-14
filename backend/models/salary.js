const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
    empId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Emp' 
    },
    salaryAmount: {
        type: Number,
        default:20000,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'failed'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const Salary = mongoose.model('Salary', SalarySchema);
module.exports = Salary;
