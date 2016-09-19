var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var v1 = require('./routes/v1');
var default_route = require('./routes/default');

var app = express();
var debug = require('debug')('tripsuppliesplanner:server:app');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * CORS fixing Allowing for anywhere
 */
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', "Content-Type");

    console.log(req.method + " " + req.originalUrl);
    next();
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'assets', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Routes
app.use('/static/', express.static(path.join(__dirname, 'public')));
app.use('/v1', v1);
app.use('*', default_route);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

app.use(function (err, req, res, next) {
    debug("err handler: %o", err);
    res.status(err.status || 500);
    res.send('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
