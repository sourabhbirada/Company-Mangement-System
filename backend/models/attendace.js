const mongoose = require('mongoose');


const AttendanceSchema = new mongoose.Schema({
    empId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emp', 
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    inTime: {
        type: Date, 
        required: true,
    },
    outTime: {
        type: Date,
        required: false,
    },
    totalAttendance: {
        type: Number,
        default: 0,  
    },
}, {
    timestamps: true,  
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;
