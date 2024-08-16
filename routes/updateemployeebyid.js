var express = require('express');
var router = express.Router();
const multer = require('multer');
const connection = require("../database/sql");

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// PUT or PATCH endpoint to update employee by ID
router.put('/:id', upload.single('ImageURL'), function (req, res) {
    const employeeId = req.params.id;
    const { Name, CNIC, Contact, Email, Salary } = req.body;
    const imageURL = req.file ? req.file.filename : null;

    // Log received data and image for debugging
    console.log('Received data:', { Name, CNIC, Contact, Email, Salary });
    console.log('Received image:', imageURL);

    // Build the update query
    const employeeQuery = `
        UPDATE Employees
        SET Name = ?, CNIC = ?, Contact = ?, Email = ?, Salary = ?, ImageURL = ?
        WHERE EmployeeID = ?
    `;

    // Prepare the parameters for the query
    const queryParams = [Name, CNIC, Contact, Email, Salary, imageURL, employeeId];

    connection.query(employeeQuery, queryParams, function (err) {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ message: 'Error occurred while updating employee data.', error: err.message });
        }

        console.log('Employee updated successfully.');
        res.status(200).json({ message: 'Employee updated successfully!' });
    });
});

module.exports = router;
