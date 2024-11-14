const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: [true , 'Task name is required']
    },
    assignedTo: {
        type: String,  
        required: true,
    },
    assignedBy: {
        type: String,  
        required: true,
    },
    work: {
        type: String,  
        required: true,
    },
    area: {
        type: String,
        enum: ['Noida', 'Delhi', 'GreaterNoida'],
        required: true,
    },
    status: {
        type: String,
        enum: ['not started', 'in-process', 'completed'],
        default: 'not started',
    },
    startDate: {
        type: Date,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

labourSchema.post('save' , handleduplicatekey)

function handleduplicatekey(error , doc , next) {

    if(error.name == 'MonogServerError' && error.code === 11000){
        const field = Object.keys(error.keyPattern)[0];
        const errorMessage = "Already exists"
        next(new Error(errorMessage))
    }else{
        next();
    }
}

const Task = mongoose.models.Task || mongoose.model('Task', labourSchema);

module.exports = Task;
