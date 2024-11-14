const { Admin, Emp, SalesManager } = require("../models/user");
const bcrypt = require('bcrypt');
const { setUser } = require("../service/authication");
const Attendance = require("../models/attendace");
const { default: axios } = require("axios");

const KEY = '8c6f5f48f4a1f0';

const getIpLocation = async (ip) => {
    try {
        if (ip === '127.0.0.1' || ip === '::1') {
            return { latitude: '26.723779', longitude: '74.873677' };
        }
        const response = await axios.get(`https://ipinfo.io/${ip}?token=${KEY}`);
        const { loc } = response.data;
        
        if (!loc) throw new Error("Location not found");
        
        const [latitude, longitude] = loc.split(',');
        return { latitude, longitude };
    } catch (error) {
        console.error("Error fetching IP location:", error.message);
        return null;
    }
};

async function createUser(req, res) {
    const { username, email, loginId, role } = req.body;
    try {
        const hashedLoginId = await bcrypt.hash(loginId, 12);
        let user;
        switch (role.toLowerCase()) {
            case "admin":
            case "hr":
                user = await Admin.create({ username, email, loginId: hashedLoginId, role });
                break;
            case "emp":
                user = await Emp.create({ username, email, loginId: hashedLoginId, role });
                break;
            case "salemanger":
                user = await SalesManager.create({ username, email, loginId: hashedLoginId, role });
                break;
            default:
                return res.status(400).json({ message: 'Invalid role specified' });
        }
        res.status(201).json({
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
            user
        });
    } catch (error) {
        console.error("Error in createUser:", error);
        if (error.name === 'MongoServerError' && error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `An account with that ${field} already exists.` });
        }
        res.status(500).json({ message: 'Server error occurred' });
    }
}

const LabourLogin = async (req, res) => {
    const { username, loginId, email } = req.body;
    try {
        const user = await Emp.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Labour not found.' });
        }

        const attendance = new Attendance({
            empId: user._id,
            inTime: new Date(),
            outTime: null,
        });
        await attendance.save();

        user.inTime = new Date();
        user.totalAttendance += 1;
        await user.save();

        const ip = req.headers['x-forwarded-for'] || req.ip;
        const location = await getIpLocation(ip);
        if (location) {
            console.log(`User's location: Latitude ${location.latitude}, Longitude ${location.longitude}`);
            user.location = location;
        }

        req.session.loginId = user.loginId;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.role = user.role;

        return res.status(200).json({ message: 'Login successful.', user });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

const LabourLogout = async (req, res) => {
    if (!req.session.loginId) {
        return res.status(401).json({ message: 'No user session found, please log in.' });
    }
    try {
        const { loginId } = req.session;
        const user = await Emp.findOne({ loginId });
        if (!user) {
            return res.status(404).json({ message: 'Labour not found.' });
        }

        const attendance = await Attendance.findOne({ empId: user._id, outTime: null });
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found for this session.' });
        }

        attendance.outTime = new Date();
        await attendance.save();

        user.outTime = new Date();
        await user.save();

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to destroy session.' });
            }
            res.status(200).json({ message: 'Logout successful', user });
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

const UserLogin = async (req, res) => {
    const { username, loginId, role, email } = req.body;
    try {
        let user;
        if (role === "admin" || role === "hr") {
            user = await Admin.findOne({ email });
        } else if (role === "emp") {
            user = await Emp.findOne({ email });
        } else if (role === "salemanger") {
            user = await SalesManager.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: 'Invalid username or login ID' });
        }

        const isMatch = await bcrypt.compare(loginId, user.loginId);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid login ID' });
        }

        const token = setUser(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
            user,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

module.exports = {
    createUser,
    UserLogin,
    LabourLogin,
    LabourLogout
};
