var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51PnkpvLOyQIFYFK95xgmpgeepohAEiPcgdAXLOhJuOPpnX1682kgirCPvLJoWvKLfrYJHQJ0NfghMofz2bLV2cBw00K2JhutiP');
const connection = require("../database/sql");

router.post('/', async function (req, res) {
    const {
        UserID,
        RoomID,
        ArrivalDateTime,
        DepartureDateTime,
        NumberOfChildren,
        NumberOfAdults,
        TotalDays,
        TotalAmount
    } = req.body;

    // Debugging: Log the request body
    console.log('Request Body:', req.body);

    try {
        // Create a Stripe session for payment
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'pkr',
                        product_data: {
                            name: 'Room Booking',
                        },
                        unit_amount: TotalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/guestdashboard`,
            cancel_url: `${req.headers.origin}/guestdashboard`,
        });

        // Debugging: Log the Stripe session
        console.log('Stripe Session:', session);

        // Proceed with the booking and room history insertion
        connection.query(
            `INSERT INTO bookings (UserID, RoomID, ArrivalDateTime, DepartureDateTime, NumberOfChildren, NumberOfAdults, TotalDays, TotalAmount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [UserID, RoomID, ArrivalDateTime, DepartureDateTime, NumberOfChildren, NumberOfAdults, TotalDays, TotalAmount],
            function (error, results) {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).send('Database error');
                }

                // Debugging: Log the result of the bookings insertion
                console.log('Bookings Inserted:', results);

                // Insert into RoomHistory
                const BookingID = results.insertId;
                connection.query(
                    `INSERT INTO RoomHistory (RoomID, BookingID, UserID, ArrivalDateTime, DepartureDateTime)
                    VALUES (?, ?, ?, ?, ?)`,
                    [RoomID, BookingID, UserID, ArrivalDateTime, DepartureDateTime],
                    function (historyError) {
                        if (historyError) {
                            console.error('Room history insertion error:', historyError);
                            return res.status(500).send('Room history insertion error');
                        }

                        // Debugging: Log success message
                        console.log('Room history inserted successfully');

                        // Update room status to Occupied
                        connection.query(
                            `UPDATE rooms SET AvailabilityStatus = 'Occupied' WHERE RoomID = ?`,
                            [RoomID],
                            function (statusError) {
                                if (statusError) {
                                    console.error('Room status update error:', statusError);
                                    return res.status(500).send('Room status update error');
                                }

                                // Debugging: Log success message for status update
                                console.log('Room status updated to Occupied');

                                // Return the payment URL
                                res.json({ url: session.url });
                            }
                        );
                    }
                );
            }
        );

    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).send('Payment error');
    }
});

module.exports = router;
