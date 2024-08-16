var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addRoomRouter = require('./routes/addRoom');
var addEmployeeRouter = require('./routes/addemployee');
var getRoomRouter = require('./routes/getRoom');
var getEmployeeRouter = require('./routes/getallemployee');
var getRoombyIdRouter = require('./routes/getroombyid');
var getEmployeebyIdRouter = require('./routes/getemployeebyid');
var deleteEmployeebyIdRouter = require('./routes/deleteemployeebyid');
var updateEmployeebyIdRouter = require('./routes/updateemployeebyid');
var getOccupiedRoomRouter = require('./routes/getOccupiedRoom');
var getAvailableRoomRouter = require('./routes/getAvailableRoom');
var getSingleRoomRouter = require('./routes/getSingleAvailableRoom');
var getDoubleRoomRouter = require('./routes/getDoubleAvailableRoom');
var addBookingRouter = require('./routes/doneBooking');
var getBookingRouter = require('./routes/getalluserbookings');
var getAllBookingRouter = require('./routes/getallbookings');
var getStatusBookingRouter = require('./routes/getbookingbystatus');
var addBookingReviewRouter = require('./routes/PostBookingReview');
var getgeneratedRevenueRouter = require('./routes/getgeneratedrevenue');
var getroomHistoryRouter = require('./routes/getRoomHistory');
var changebookingstatusRouter = require('./routes/changebookingstatus');
var addUserRouter = require('./routes/Signup');
var getUserRouter = require('./routes/Login');
var database = require('./database/sql');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Types');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/addroom', addRoomRouter);
app.use('/api/addemployee', addEmployeeRouter);
app.use('/api/getroom', getRoomRouter);
app.use('/api/getemployee', getEmployeeRouter);
app.use('/api/getoccupiedroom', getOccupiedRoomRouter);
app.use('/api/getavaibleroom', getAvailableRoomRouter);
app.use('/api/getsingleavailableroom', getSingleRoomRouter);
app.use('/api/getdoubleavailableroom', getDoubleRoomRouter);
app.use('/api/getroombyid', getRoombyIdRouter);
app.use('/api/getemployeebyid', getEmployeebyIdRouter);
app.use('/api/deleteemployeebyid', deleteEmployeebyIdRouter);
app.use('/api/updateemployeebyid', updateEmployeebyIdRouter);
app.use('/api/adduser', addUserRouter);
app.use('/api/getuser', getUserRouter);
app.use('/api/bookroom', addBookingRouter);
app.use('/api/getuserbookings', getBookingRouter);
app.use('/api/getallbookings', getAllBookingRouter);
app.use('/api/getbookings', getStatusBookingRouter);
app.use('/api/review', addBookingReviewRouter);
app.use('/api/totalamount', getgeneratedRevenueRouter);
app.use('/api/getroomhistory', getroomHistoryRouter);
app.use('/api/changebookingstatus', changebookingstatusRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
