var express = require('express');
var router = express.Router();
const connection = require("../database/sql");

// Update booking status, room availability, and total amount
router.get('/:BookingID?', function (req, res) {
    const { BookingID } = req.params;
    const { BookingStatus } = req.query;

    if (!BookingStatus || !['Approved', 'Rejected'].includes(BookingStatus)) {
        return res.status(400).json({ message: "Invalid BookingStatus" });
    }

    // Determine the new total amount and room status based on BookingStatus
    const newTotalAmount = BookingStatus === 'Rejected' ? 0 : null; // Set TotalAmount to 0 if rejected, otherwise leave it unchanged
    const newAvailabilityStatus = BookingStatus === 'Approved' ? 'Occupied' : 'Available';

    // Update booking status and optionally total amount
    connection.query(
        'UPDATE bookings SET BookingStatus = ?, TotalAmount = IFNULL(?, TotalAmount) WHERE BookingID = ?',
        [BookingStatus, newTotalAmount, BookingID],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error updating booking status" });
            }

            // Fetch the room ID
            connection.query('SELECT RoomID FROM bookings WHERE BookingID = ?', [BookingID], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: "Error fetching room ID" });
                }

                if (results.length === 0) {
                    return res.status(404).json({ message: "Booking not found" });
                }

                const roomID = results[0].RoomID;

                // Update the room availability status
                connection.query(
                    'UPDATE rooms SET AvailabilityStatus = ? WHERE RoomID = ?',
                    [newAvailabilityStatus, roomID],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: "Error updating room status" });
                        }

                        res.json({ message: "Booking status, room availability, and total amount updated successfully" });
                    }
                );
            });
        }
    );
});

module.exports = router;
