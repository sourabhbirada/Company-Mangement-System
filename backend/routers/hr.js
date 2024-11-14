const express = require('express');
const { GetAllAttendance, Getsalary, Updatesalarysatus } = require('../controllers/hr');


const router = express.Router();


router.get('/allattendence' , GetAllAttendance)

router.get('/getsalary' , Getsalary).put('/updatesalary/:salaryId' , Updatesalarysatus )








module.exports  = router