'use strict';
var helpers = require('./helpers.js');

exports.directUpload = function(req, res, next) {

}

exports.authenticate = function(req, res, next) {


  req.app.utility.request({
    url: 'https://pwservicestg1.planwellcollaborate.com/Web/api/Authentication',
    headers: {
      'cache-control': 'no-cache',
      'decrypt': 'false',
      'content-type': 'application/json',
      'password': req.body.password,
      'loginid': req.body.loginId
    },
    method: 'POST',
    json: true
  }, function(err, res, body) {
    if (err) {
      next(err);
    } else {
      req.body.tokenKey = res.headers.tokenkey;
      next();
    }
  });
}


exports.getUploadSessionId = function(req, res, next) {
  req.app.utility.request({
    url: 'https://pwservicestg1.planwellcollaborate.com/Web/api/S3Upload/CreateSession?pinProjectId=' + req.body.PINProjectID + "&uploadSource=130",
    headers: {
      'cache-control': 'no-cache',
      'decrypt': 'false',
      'tokenKey': req.body.tokenKey
    },
    method: 'GET',
    json: true
  }, function(err, res, body) {
    if (err) {
      next(err);
    } else {
      req.body.uploadSessionId = body.Result;
      next();
    }
  })
}

function downloadFromExternalLink(app, links, downloadPath, cb) {
  var request = app.utility.request,
    fs = require('fs'),
    Puid = require('puid'),
    puid = new Puid(),
    Promise = require('bluebird'),
    async = require('async'),
    path = require('path'),
    stats;

  var download = function(arquivo, pasta, callback) {
    var p = new Promise(function(resolve, reject) {
      var id = puid.generate();
      var dest = path.join(pasta, id);
      var writeStream = fs.createWriteStream(dest);

      writeStream.on('finish', function() {
        resolve(id);
      });

      writeStream.on('error', function(err) {
        fs.unlink(dest, reject.bind(null, err));
      });

      var readStream = request.get(arquivo);

      readStream.on('error', function(err) {
        fs.unlink(dest, reject.bind(null, err));
      });

      readStream.pipe(writeStream);
    });

    if (!callback) {
      return p;
    }

    p.then(function(id) {
      callback(null, id);
    }).catch(function(err) {
      callback(err);
    });
  };

  async.map(links, function(item, eachCb) {

    download(item.link, downloadPath, function(err, id) {
      if (err) {
        throw err;
      } else {
        item.filePath = downloadPath + '/' + id;
        stats = fs.statSync(item.filePath);
        item.fileSize = stats['size'];
        eachCb(null, item);
      }
    });

  }, function(err, results) {
    if (err) {
      cb(err);
    } else {
      cb(null, results);
    }
  })
}

function getSignedUrl(app, options, extLinks, cb) {
  console.log("options", options);
  app.utility.async.map(extLinks, function(item, eachCb) {

    app.utility.request({
      url: 'https://pwservicestg1.planwellcollaborate.com/Web/api/S3Upload/GetUploadUrls?pinProjectId=' + options.PINProjectID + '&sessionId=' + options.uploadSessionId,
      headers: {
        'content-type': 'application/json',
        'tokenKey': options.tokenKey
      },
      body: [{
        "DocumentName": item.docName,
        "FileSize": item.fileSize,
        "DocumentTitle": item.docTitle,
        "DocumentDesc": item.docDesc,
        "SearchTag ": item.searchTag,
        "DocumentUploadID ": null
      }],
      method: 'POST',
      json: true
    }, function(err, res, body) {
      console.log(err);
      console.log(body);
      if (err) {
        throw err;
      } else {
        item.preSignedUrl = body.Result[0].PresignedURL;
        eachCb(null, item);
      }
    })

  }, function(err, results) {
    if (err) {
      cb(err);
    } else {
      cb(null, results);
    }
  })

}

exports.externalUpload = function(req, res, next) {

  downloadFromExternalLink(req.app, req.body.extLinks, req.app.config.downloadPath, function(err, extLinks) {
    console.log("extLinks", extLinks);
    var options = {
      PINProjectID: req.body.PINProjectID,
      uploadSessionId: req.body.uploadSessionId,
      tokenKey: req.body.tokenKey
    }
    getSignedUrl(req.app, options, extLinks, function(err, data) {
      console.log("data", data);
    })
  })
}
