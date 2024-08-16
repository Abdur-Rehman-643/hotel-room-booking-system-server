var express = require('express');
var router = express.Router();
const connection = require("../database/sql");

router.get('/:id', function (req, res, next) {
    const roomId = req.params.id;

    const query = 'SELECT * FROM Employees WHERE EmployeeID = ?';

    connection.query(query, [roomId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(results[0]);
    });
});

module.exports = router;
