// Environment variables
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');

const db = require('./mongodb');

require('./middleware/auth');

const adminRouter = require('./routes/admin');
const courierRouter = require('./routes/courier');
const customerRouter = require('./routes/customer');
const indexRouter = require('./routes/index');
const superAdminRouter = require('./routes/superAdmin');

const app = express();

// view engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(flash());

// global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg');
	next();
});

app.use('/admin', adminRouter);
app.use('/courier', courierRouter);
app.use('/customer', customerRouter);
app.use('/', indexRouter);
app.use('/superAdmin', superAdminRouter);

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
