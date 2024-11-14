const express = require('express');


const { UserLogin, LabourLogin, LabourLogout, createUser } = require('../controllers/user');


const router = express.Router();

router.post('/createuser', createUser);
router.post('/adminlogin', UserLogin);
router.post('/labourlogiin' , LabourLogin)
router.post('/labourlogout' , LabourLogout)

module.exports = router;