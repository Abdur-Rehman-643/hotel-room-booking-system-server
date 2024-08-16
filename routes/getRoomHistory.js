var express = require('express');
var router = express.Router();
const connection = require("../database/sql");

router.get('/:roomid', function (req, res) {
    const roomid = req.params.roomid;

    if (!roomid) {
        return res.status(400).json({ error: "RoomID is required" });
    }

    const query = `
    SELECT rh.HistoryID, rh.RoomID, rh.BookingID, rh.UserID, rh.ArrivalDateTime, rh.DepartureDateTime,
           b.NumberOfChildren, b.NumberOfAdults, b.BookingStatus, b.TotalDays, b.TotalAmount,
           u.Name as UserName, u.Contact as UserContact
    FROM RoomHistory rh
    JOIN bookings b ON rh.BookingID = b.BookingID
    JOIN Users u ON rh.UserID = u.UserID
    WHERE rh.RoomID = ?
  `;

    connection.query(query, [roomid], (error, results) => {
        if (error) {
            console.error('Error fetching room history:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(results);
    });
});

module.exports = router;
