const mongoose = require('mongoose');
const { handleDuplicateKeyError, createSalaryForEmployee } = require('../middleware/duplicate');

const EmpSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        
    },
    role: {
        type: String,
        default: "emp",
        enum: ["emp", "admin", "salemanger", "hr"] 
    },
    loginId: {
        type: String,
        required: true,
        unique: true,
    },
    inTime: {
        type: Date,
    },
    outTime: {
        type: Date,
    },
    totaltask: {
        type: Number,
        default: 0
    },
    location: {
        latitude: {
            type: Number,
            required: false
        },
        longitude: {
            type: Number,
            required: false
        }
    }
}, {
    timestamps: true
});


const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    role: {
        type: String,
        default: "hr",
        enum: ["emp", "admin", "salemanger" , "hr"]
    },
    loginId: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});


const salesManagerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    role: {
        type: String,
        default: "salemanger",
        enum: ["emp", "admin", "salemanger" , "hr"]
    },
    loginId: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    location: {
        latitude: {
            type: Number,
            required: false
        },
        longitude: {
            type: Number,
            required: false
        }
    }
}, {
    timestamps: true
});




EmpSchema.post('save', handleDuplicateKeyError);
AdminSchema.post('save', handleDuplicateKeyError);
salesManagerSchema.post('save', handleDuplicateKeyError);

EmpSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            await createSalaryForEmployee(this); 
        } catch (error) {
            return next(error);
        }
    }
    next(); 
});



const Emp = mongoose.model('Emp', EmpSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const SalesManager = mongoose.model('SalesManager', salesManagerSchema);

module.exports = { Emp, Admin, SalesManager };
