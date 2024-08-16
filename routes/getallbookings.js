var express = require('express');
var router = express.Router();
const connection = require("../database/sql");

router.get('/', function (req, res) {
    const userID = req.params.userID;

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
            Users u ON b.UserID = u.UserID`;

    connection.query(query, [userID], function (error, results) {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send('Database error');
        }

        res.json(results);
    });
});

module.exports = router;
