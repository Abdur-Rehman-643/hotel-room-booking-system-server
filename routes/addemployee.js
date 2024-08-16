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

router.post('/', upload.single('ImageURL'), function (req, res) {
    const { Name, CNIC, Contact, Email, Salary } = req.body;
    const imageURL = req.file ? req.file.filename : null;

    // Log received data and image for debugging
    console.log('Received data:', { Name, CNIC, Contact, Email, Salary });
    console.log('Received image:', imageURL);

    const employeeQuery = `
        INSERT INTO Employees (Name, CNIC, Contact, Email, Salary, ImageURL)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(employeeQuery, [Name, CNIC, Contact, Email, Salary, imageURL], function (err) {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ message: 'Error occurred while inserting employee data.', error: err.message });
        }

        console.log('Employee inserted successfully with image.');
        res.status(200).json({ message: 'Employee and image added successfully!' });
    });
});


module.exports = router;
