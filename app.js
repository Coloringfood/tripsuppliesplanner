var express = require('express');
var reactViews = require('express-react-views');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var v1 = require('./routes/v1');
var webpages = require('./routes/webpages');

var app = express();
var debug = require('debug')('tripsuppliesplanner:server:app');

// view engine setup
app.set('view engine', 'js');
app.engine('js', reactViews.createEngine());

app.use(express.static(path.join(__dirname, 'public')));

// API Setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/v1', v1);


// React Setup
app.get('/', webpages);

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
    res.send({
        message: err.message,
        error: {}
    });
});

module.exports = app;
