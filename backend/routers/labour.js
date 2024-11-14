const express = require('express');
const { Getalltaskbylabour, Taskstatus } = require('../controllers/labour');
const { ensureLaborAuth } = require('../middleware/labourauth');


const router = express.Router();


router.get('/labourTasks' ,ensureLaborAuth, Getalltaskbylabour).put('/labourTasks/:taskId' , ensureLaborAuth,Taskstatus)






module.exports = router