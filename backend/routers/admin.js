const express = require('express');
const { Showallsalemanger, Addnewmanager, Updatemanger, Deletemanger, showAllEmployees, addNewEmployee, updateEmployee, deleteEmployee, Getlocation } = require('../controllers/admin');
const { createUser } = require('../controllers/user');


const router = express.Router();



router.get('/managers' , Showallsalemanger ).post('/managers' ,createUser ).put('/managers/:id' , Updatemanger).delete('/managers/:id' , Deletemanger)


router.get('/employees' , showAllEmployees ).post('/employees' ,createUser ).put('/employees/:id' , updateEmployee).delete('/employees/:id' , deleteEmployee)


router.get('/location/:role/:id' , Getlocation)



module.exports = router