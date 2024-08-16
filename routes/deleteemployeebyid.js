var express = require('express');
var router = express.Router();
const connection = require("../database/sql");

// DELETE employee by ID
router.delete('/:id', function (req, res, next) {
    const employeeId = req.params.id;

    const query = 'DELETE FROM Employees WHERE EmployeeID = ?';

    connection.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    });
});

module.exports = router;
