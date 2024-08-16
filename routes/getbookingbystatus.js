var express = require('express');
var router = express.Router();
const connection = require("../database/sql");

// Route to get bookings by status
router.get('/:status', function (req, res) {
    const status = req.params.status;

    const query = `
        SELECT 
            b.BookingID,
            b.UserID,
            b.RoomID,
            b.ArrivalDateTime,
            b.DepartureDateTime,
            b.NumberOfChildren,
            b.NumberOfAdults,
            b.BookingStatus,
            b.TotalDays,
            b.TotalAmount,
            b.Rating,
            b.ReviewText,
            r.RoomNo,
            r.RoomType,
            r.RoomServantName,
            r.ServantContact,
            r.PricePerDay,
            r.RoomDescription,
            r.CoverImageURL,
            u.Name as UserName
        FROM 
            bookings b
        JOIN 
            rooms r ON b.RoomID = r.RoomID
        JOIN 
            Users u ON b.UserID = u.UserID
        WHERE 
            b.BookingStatus = ?`;

    connection.query(query, [status], function (error, results) {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send('Database error');
        }

        res.json(results);
    });
});

module.exports = router;
