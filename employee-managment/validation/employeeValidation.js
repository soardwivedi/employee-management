const yup = require('yup');

// Define the employee validation schema
const employeeValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Name is required'),

  email: yup
    .string()
    .email('Please provide a valid email')
    .required('Email is required'),

  mobile: yup
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number cannot exceed 15 digits')
    .required('Mobile number is required'),

  designation: yup.string().required('Designation is required'),

  salary: yup
    .number()
    .min(10000, 'Salary must be at least 10,000')
    .max(10000000, 'Salary cannot exceed 1,000,0000')
    .required('Salary is required'),

  joiningDate: yup
    .date()
    .max(new Date(), 'Joining date cannot be in the future')
    .required('Joining date is required')
});

module.exports = employeeValidationSchema;
