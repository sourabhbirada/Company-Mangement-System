const Task = require('../models/task');
const { Emp } = require('../models/user');

async function Getalltaskbylabour(req, res) {
    try {
        const { loginId, email } = req.session;
        console.log('Login ID in session:', req.session.loginId);

        if (!loginId) {
            return res.status(400).json({ message: 'User is not logged in.' });
        }

        const tasks = await Task.find({ assignedTo: email });

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this labour.' });
        }

        return res.status(200).json(tasks);

    } catch (error) {
        console.error('Error retrieving tasks:', error);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
}

async function Taskstatus(req, res) {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['not started', 'in-process', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided' });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

        if (status === 'completed') {
            const employee = await Emp.findOne({ email: req.session.email });

            if (employee) {
                employee.totaltask += 1;
                await employee.save();
            }
        }
        
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'status updated successfully', task: updatedTask });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
}

module.exports = {
    Getalltaskbylabour,
    Taskstatus
};
