var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config.json');
var expressJWT = require('express-jwt');

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

    next();
});
app.use(logger('combined'));

var secretCallback = function (req, payload, done) {
    // This will change to an Consul call or storage check.
    var issuer = payload.iss;
    switch (issuer) {
        case config.security.issuer:
            done(null, config.security.secret);
            break;
        default:
            done(new Error('missing_secret'));
    }
};

app.use(expressJWT({
    secret: secretCallback,
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'jwt') {
            req.userToken = req.headers.Authorization.split(' ')[1];
        }
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'jwt') {
            req.userToken = req.headers.authorization.split(' ')[1];
        }
        return req.userToken;
    }
}).unless({
    path: [
        '/health',
        /^\/static\/.*/,
        /^\/public\/.*/,
        /^\/$/,                         // Allow Home directly
        /^\/login\/.*/,                 // Allow Login pages
        /^\/v1\/authentication$/,       // Allow Login Requests
        /^\/v1\/.*/                     // TEMPORARILY ALLOW ALL API CALLS
    ]
}));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'assets', 'images', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Routes
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});
app.use('/static/', express.static(path.join(__dirname, 'public')));
app.use('/public/', express.static(path.join(__dirname, 'public')));
app.use('/v1', v1);
app.use('', default_route);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

app.use(function (err, req, res, next) {
    debug('next called: %o', err);
    console.log(err);
    var status = (typeof err.status === 'undefined') ? 500 : err.status;
    var unspecifiedErrorMessage = "The server experienced an error, see logs";
    if (typeof err.showMessage === 'undefined') {
        err.showMessage = (typeof err.defaultMessage === 'undefined') ? unspecifiedErrorMessage : err.defaultMessage;
    } else if (err.name == 'UnauthorizedError') {
        err.showMessage = err.name;
    }
    var response = {
        error: err.errors || true,
        message: err.showMessage,
        status: status
    };
    res.status(status)
        .send(response);

    debug('Error: %o', response);
});

module.exports = app;
