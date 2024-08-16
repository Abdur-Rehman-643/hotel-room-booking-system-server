var express = require('express');
var router = express.Router();
const connection = require("../database/sql");

// Route to get room details by ID
router.get('/:id', function (req, res, next) {
    const roomId = req.params.id;

    // SQL query to get room details by ID
    const query = 'SELECT * FROM rooms WHERE RoomID = ?';

    connection.query(query, [roomId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(results[0]);
    });
});

module.exports = router;
