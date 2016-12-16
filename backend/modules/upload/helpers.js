exports.authenticate = function(options, callback) {


  app.utility.request({
    url: 'https://pwservicestg1.planwellcollaborate.com/Web/api/Authentication',
    headers: {
      'cache-control': 'no-cache',
      'decrypt': 'false',
      'content-type': 'application/json',
      'password': options.password,
      'loginid': options.loginId
    },
    method: 'POST',
    json: true
  }, function(err, res, body) {
    if (err) {
      callback(err);
    } else {
      callback(null, res.headers.tokenkey);
    }
  });
}

exports.getUploadSessionId = function(options, callback) {
  app.utility.request({
    url: 'https://pwservicestg1.planwellcollaborate.com/Web/api/S3Upload/CreateSession?pinProjectId=' + options.PINProjectID + "&uploadSource=130",
    headers: {
      'cache-control': 'no-cache',
      'decrypt': 'false',
      'tokenKey': options.tokenKey
    },
    method: 'GET',
    json: true
  }, function(err, res, body) {
    if (err) {
      callback(err);
    } else {
      callback(null, body.Result);
    }
  })
}
