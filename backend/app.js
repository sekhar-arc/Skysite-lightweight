#!/usr/bin/env node

'use strict';
var app = require('./server');


process.on('uncaughtException', function(err) {
  console.log(err.stack);
});

app.use(app.utility.attacheWorkflow, app.utility.addDefaultLanguage);
app.use('/api/v1', require('./modules/template')(app));

app.server = app.listen(app.config.port, function() {
  app.utility.printData('Server listening on : ', app.config.port);
});
app.server.timeout = app.config.timeout;
