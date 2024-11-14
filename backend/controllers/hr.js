const Attendance = require("../models/attendace");
const Salary = require("../models/salary");

async function GetAllAttendance(req, res) {
    try {
        const attendanceRecords = await Attendance.find()
            .populate('empId', 'email username loginId totaltask')
            .sort({ date: -1 });

        if (!attendanceRecords.length) {
            return res.status(404).json({ message: 'No attendance records found.' });
        }

        const formattedAttendance = attendanceRecords
            .filter(({ empId }) => empId && empId.username)
            .map(({ empId, inTime, outTime, date, totalAttendance }) => ({
                username: empId.username,
                email: empId.email,
                inTime,
                outTime,
                date,
                Attendance: totalAttendance,
                totaltask: empId.totaltask
            }));

        return res.status(200).json({
            message: 'Attendance records retrieved successfully.',
            attendanceRecords: formattedAttendance
        });
    } catch (error) {
        console.error(error);
        return res.json({ message: 'Server error, please try again later.' });
    }
}

async function Getsalary(req, res) {
    try {
        const salary = await Salary.find().populate("empId", 'email username');

        if (!salary.length) {
            return res.status(404).json({ message: 'No salary records found.' });
        }

        const salaryByEmp = salary
            .filter(({ empId }) => empId && empId.username)
            .map(({ _id, empId, salaryAmount, paymentStatus }) => ({
                _id,
                username: empId.username,
                email: empId.email,
                salaryAmount,
                paymentStatus
            }));

        return res.status(200).json({
            message: 'records retrieved successfully',
            salary: salaryByEmp
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
}

async function Updatesalarysatus(req, res) {
    const { salaryId } = req.params;
    const { status } = req.body;

    console.log("Received salaryId:", salaryId);
    try {
        const updatedSalary = await Salary.findByIdAndUpdate(
            salaryId,
            { paymentStatus: status },
            { new: true }
        );

        if (!updatedSalary) {
            return res.status(404).json({ message: " not found." });
        }
        console.log(updatedSalary);
        return res.status(200).json({ message: " updated successfully", updatedSalary });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'error updating salary status' });
    }
}

module.exports = {
    GetAllAttendance,
    Getsalary,
    Updatesalarysatus
};
