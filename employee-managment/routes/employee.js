const express = require('express');
const {
  addEmployee,
  getEmployees,
  editEmployee,
  getEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/add', auth, addEmployee);
router.put('/edit/:id', auth, editEmployee);
router.get('/', getEmployees);
router.get('/:id');
router.get('/search', auth, getEmployee);
router.delete('/delete/:id', auth, deleteEmployee);

module.exports = router;
