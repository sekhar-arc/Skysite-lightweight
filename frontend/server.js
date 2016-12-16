'use strict';

var express = require('express');
var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('ssl/apache.key'),
    cert: fs.readFileSync('ssl/apache.crt')
};
var app = express();
https.createServer(options, app).listen(8000);
app.use('/', express.static('www'));

