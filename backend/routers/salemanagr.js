const express = require('express');
const {Getalltask, Addnewtask, Deletetask, Updatetask, Shoallusertime} = require('../controllers/salemanager')

const {  showAllEmployees, updateEmployee, deleteEmployee } = require('../controllers/admin');
const { createUser } = require('../controllers/user');



const router = express.Router();


router.get('/alltasks' ,Getalltask ).post('/alltasks' ,Addnewtask ).put('/alltasks/:id' , Updatetask).delete('/alltasks/:id' , Deletetask)

router.post('/addnewlabour', createUser)
      .get('/alllabour', showAllEmployees)
      .put('/labour/:id', updateEmployee)   
      .delete('/labour/:id', deleteEmployee);

router.get('/labourtimes' , Shoallusertime)




module.exports = router