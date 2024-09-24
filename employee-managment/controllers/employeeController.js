const Employee = require('../models/Employee');
const employeeValidationSchema = require('../validation/employeeValidation');
const yup = require('yup');
// Add new employee
exports.addEmployee = async (req, res) => {
  try {
    // Validate the request body against the Yup schema
    await employeeValidationSchema.validate(req.body, { abortEarly: false });

    const { name, email, mobile, designation, salary, joiningDate } = req.body;

    // Check if the employee with the same email or mobile number exists
    const isEmployeeExists = await Employee.findOne({
      $or: [{ email: email }, { mobile: mobile }]
    });
    console.log('isEmployeeExists', isEmployeeExists);

    if (isEmployeeExists) {
      return res.status(400).json({
        message: 'This email or mobile number belongs to another employee'
      });
    }

    // Create a new employee
    const employee = new Employee({
      name,
      email,
      mobile,
      designation,
      salary,
      joiningDate
    });

    // Save the employee to the database
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    // Handle validation errors
    if (error instanceof yup.ValidationError) {
      const formattedErrors = error.inner.reduce((acc, err) => {
        if (!acc[err.path]) {
          acc[err.path] = [];
        }
        acc[err.path].push(err.message); // Push the specific error message for each field
        return acc;
      }, {});

      return res.status(400).json({
        message: 'Validation error',
        errors: formattedErrors
      });
    }
    // adaptability, learning attitude, hard work.
    // Handle other errors
    res.status(500).json({ message: error.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Employee API
exports.editEmployee = async (req, res) => {
  try {
    await employeeValidationSchema.validate(req.body, { abortEarly: false });
    const { id } = req.params; // Employee ID from the route parameter
    const { name, email, mobile, designation, salary, joiningDate } = req.body; // Data to be updated
    console.log('id is', id);
    console.log(mobile, email);
    // Find the employee by ID and update the details
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        email,
        mobile,
        designation,
        salary,
        joiningDate
      },
      { new: true, runValidators: true } // Returns the updated document and applies schema validators
    );
    console.log('updatedEmployee', updatedEmployee);
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee details updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof yup.ValidationError) {
      const formattedErrors = error.inner.reduce((acc, err) => {
        if (!acc[err.path]) {
          acc[err.path] = [];
        }
        acc[err.path].push(err.message); // Push the specific error message for each field
        return acc;
      }, {});

      return res.status(400).json({
        message: 'Validation error',
        errors: formattedErrors
      });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployee = async (req, res) => {
  const { email, phone, name } = req.query;

  // Build a query object based on provided parameters
  const query = {};
  if (email) query.email = email;
  if (phone) query.mobile = phone;
  if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive search

  try {
    const employees = await Employee.find(query);
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the employee by ID
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee deleted successfully',
      employee: deletedEmployee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
