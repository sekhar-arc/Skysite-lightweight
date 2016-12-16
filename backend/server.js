'use strict';

/**
 * This is a standard callback object maintaining as commonjs pattern
 * @callback requestCallback
 * @param {Error} err  error object
 * @param {object | Boolean | Array | Number } response data
 */

//dependencies
var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mysql = require('mysql'),
    app;


/**
 * express app
 * @namespace app
 */
//create express app
app = express();

//keep reference to config
app.config = config;
//settings
app.disable('x-powered-by');
app.set('port', config.port);


//global locals
app.locals.projectName = app.config.projectName;
app.locals.copyrightYear = new Date().getFullYear();
app.locals.companyName = app.config.companyName;


/**
 * attaching the package method-override
 * @type {method-override}
 */
app.use(require('method-override')());
/**
 * attaching the package body-parser.json
 * @type {body-parser.json}
 */
app.use(bodyParser.json({
    limit: '20mb'
}));
/**
 * attaching the package body-parser.urlencoded
 * @type {body-parser.urlencoded}
 */
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '20mb'
}));


/**
 * attaching the namespace utility
 * @type {utility}
 */
app.utility = require('./app-util');

app.use(app.utility.attacheWorkflow, app.utility.addDefaultLanguage);

app.use('/', express.static(__dirname + '/public'));

app.db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'arcind@123',
    database: 'e-arc'
});

app.db.connect(function(err) {
    if (err) {
        console.log('Error connecting to Db', err);
        return;
    }
    console.log('Connection established with threadId :', app.db.threadId);
});


app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-auth-deviceid,x-auth-devicetype,x-auth-token');
    next();
});


if (0) {
    var path = require('path');
    app.utility.handleFile.fs.mkdirsSync('csv');
    var request = app.utility.request;
    var fs = require('fs');
    var Puid = require('puid');
    var puid = new Puid();
    var path = require('path');
    var Promise = require('bluebird');
    // var url = 'https://micul-programator.ro/content/images/categorii/medii/nodejs.jpg';
    // var url = 'https://dl.dropboxusercontent.com/1/view/tv250w8azljuric/Getting%20Started.pdf';
    var url = 'https://dl.dropboxusercontent.com/1/view/7t0n1c5fohv7u4x/Getting%20Started.pdf';

    var download = function(arquivo, pasta, callback) {
        var p = new Promise(function(resolve, reject) {
            var id = puid.generate();
            var dest = path.join(pasta, id);
            var writeStream = fs.createWriteStream(dest);

            // Avisando a promise que acabamos por aqui
            writeStream.on('finish', function() {
                resolve(id);
            });

            // Capturando erros da write stream
            writeStream.on('error', function(err) {
                fs.unlink(dest, reject.bind(null, err));
            });

            var readStream = request.get(arquivo);

            // Capturando erros da request stream
            readStream.on('error', function(err) {
                fs.unlink(dest, reject.bind(null, err));
            });

            // Iniciando a transferência de dados
            readStream.pipe(writeStream);
        });

        // Manter compatibilidade com callbacks
        if (!callback)
            return p;

        p.then(function(id) {
            callback(null, id);
        }).catch(function(err) {
            callback(err);
        });
    };

    download(url, './csv', function(err, id) {
        if (err)
            throw err;
        var filePath = './csv/' + id;
        console.log('downloaded file %s', id);
        console.log('downloaded FilePath %s', filePath);




        app.utility.request({
            url: 'https://pwservicestg1.planwellcollaborate.com/Web/api/Authentication',
            headers: {
                'cache-control': 'no-cache',
                'decrypt': 'false',
                'content-type': 'application/json',
                'password': 'innofied',
                'loginid': 'kanad.saha@innofied.com'
            },
            method: 'POST',
            json: true
        }, function(err, res, body) {
            var token = res.headers.tokenkey;
            console.log("token", token);
            app.utility.request({
                url: 'https://pwservicestg1.planwellcollaborate.com/Web/api/Project?mode=1',
                headers: {
                    'cache-control': 'no-cache',
                    'decrypt': 'false',
                    'content-type': 'application/json',
                    'password': 'innofied',
                    'loginid': 'kanad.saha@innofied.com',
                    'tokenKey': token,
                    'Pragma': 'no-cache',

                },
                method: 'GET',
                json: true
            }, function(err, res, body) {
                var PINProjectID = body[0].PINProjectID;
                PINProjectID = 165147;
                console.log("project fetched", PINProjectID);
                app.utility.request({
                    url: 'https://pwservicestg1.planwellcollaborate.com/Web/api/S3Upload/CreateSession?pinProjectId=' + PINProjectID + "&uploadSource=130",
                    headers: {
                        'cache-control': 'no-cache',
                        'decrypt': 'false',
                        'content-type': 'application/json',
                        // 'password': 'innofied',
                        // 'loginid': 'kanad.saha@innofied.com',
                        'tokenKey': token
                            // 'Pragma': 'no-cache',

                    },
                    method: 'GET',
                    json: true
                }, function(err, res, body) {
                    var uploadSessionId = body.Result;
                    console.log("uploadSessionId", uploadSessionId);
                    var stats = fs.statSync('./csv/aws.pdf');
                    console.log(stats['size']);
                    app.utility.request({
                        url: 'https://pwservicestg1.planwellcollaborate.com/Web/api/S3Upload/GetUploadUrls?pinProjectId=' + PINProjectID + '&sessionId=' + uploadSessionId,
                        headers: {
                            'content-type': 'application/json',
                            'tokenKey': token
                        },
                        body: [{
                            "DocumentName": 'aws.pdf',
                            "FileSize": stats['size']
                                // "DocumentTitle": " test-1.pdf",
                                // "DocumentDesc": "test world ",
                                // "SearchTag ": "test ",
                                // "DocumentUploadID ": null

                        }],
                        method: 'POST',
                        json: true
                    }, function(err, res, body) {
                        console.log(err);
                        console.log('signed url response----------------\n', body);
                        var preSignedUrl = body.Result[0].PresignedURL;
                        console.log('preSignedUrl', preSignedUrl);
                        fs.readFile('./csv/aws.pdf', function(err, data) {
                            if (err) {
                                return console.log(err);
                            }

                            app.utility.request({
                                method: "PUT",
                                url: preSignedUrl,
                                headers: {
                                    'Content-Length': stats['size']
                                },
                                body: data
                            }, function(err, res, body) {

                                console.log(err);
                                console.log("success");
                                console.log('body', body);
                            })
                        });


                    })

                })
            })
        })

    })
}


module.exports = app;
