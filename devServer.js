var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var v1 = require('./routes/v1');
var bodyParser = require('body-parser');

var app = express();
var compiler = webpack(config);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', "Content-Type");

    console.log(req.method + " " + req.originalUrl);
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

/**
 * API ENDPOINTS
 */
app.use('/v1', v1);

/**
 * REACT
 */
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.use('/src', express.static('src'));

app.listen(3000, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:3000');
});
