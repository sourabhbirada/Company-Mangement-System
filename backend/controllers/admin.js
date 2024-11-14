const { SalesManager, Emp } = require("../models/user");

async function Showallsalemanger(req , res) {
    try {
        const managers = await SalesManager.find();
        res.status(200).json(managers);
    } catch (error) {
        res.status(500).json({ message: "not found" });
    } 
}



async function Updatemanger(req , res) {
    const { id } = req.params; 
    const { username, email, loginId } = req.body;  

    try {
        const updatedManager = await SalesManager.findByIdAndUpdate(
            id,
            { username, email, loginId }, 
            { new: true }
        );

        if (!updatedManager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        res.status(200).json({ message: ' updated successfully', updatedManager });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update manager' });
    }
}

async function Deletemanger(req, res) {
    const { id } = req.params; 

    try {
        const deletedManager = await SalesManager.findByIdAndDelete(id);

        if (!deletedManager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        res.status(200).json({ message: ' deleted successfully', deletedManager });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete manager' });
    }
}


async function showAllEmployees(req, res) {
    try {
        const employees = await Emp.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Employees not found" });
    }
}




async function updateEmployee(req, res) {
    const { id } = req.params;
    const { username, email, password, role, loginId } = req.body;  

    try {
        const updatedEmployee = await Emp.findByIdAndUpdate(
            id,
            { username, email, password, role, loginId },  
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: ' not found' });
        }

        res.status(200).json({ message: 'Updated successfully', updatedEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update employee' });
    }
}


async function deleteEmployee(req, res) {
    const { id } = req.params;

    try {
        const deletedEmployee = await Emp.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'not found' });
        }

        res.status(200).json({ message: 'eleted successfully', deletedEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete employee' });
    }
}


async function Getlocation(req , res) {

    const { role , id} = req.params

    try {
        let user;

        if(role === "emp"){
            user = await Emp.findById(id);
        }else if(role === "salemanger"){
            user = await SalesManager.findById(id);
        }

        if(!user) {
            return res.status(404).json({message:"user not found"})

        }
         const { latitude, longitude } = user.location || {};

        if (latitude && longitude) {
            res.status(200).json({ latitude, longitude });
        } else {
            res.status(404).json({ message: "Location not available for this user" });
        }
    } catch (err) {
        console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Error fetching location' });
    }
    
}
module.exports = {
    Showallsalemanger,
    Updatemanger,
    Deletemanger,
    showAllEmployees,
    updateEmployee,
    deleteEmployee,
    Getlocation
};
