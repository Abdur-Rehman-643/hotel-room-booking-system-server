var express = require('express');
var router = express.Router();
const connection = require("../database/sql");

router.post('/:bookingID', (req, res) => {
    const { bookingID } = req.params;
    const { rating, reviewText } = req.body;

    console.log(rating);

    const query = `
        UPDATE bookings
        SET Rating = ?, ReviewText = ?
        WHERE BookingID = ?`;

    connection.query(query, [rating, reviewText, bookingID], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send('Database error');
        }

        res.send('Review submitted successfully');
    });
});


module.exports = router;
