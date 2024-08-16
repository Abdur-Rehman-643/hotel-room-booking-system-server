var express = require('express');
var router = express.Router();
const connection = require("../database/sql");

// Route to get the total sum of all booking amounts
router.get('/', function (req, res) {
    const query = `
        SELECT SUM(TotalAmount) AS totalAmount
        FROM bookings
    `;

    connection.query(query, function (error, results) {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send('Database error');
        }

        // Send the total amount as JSON response
        res.json({ totalAmount: results[0].totalAmount });
    });
});

module.exports = router;
