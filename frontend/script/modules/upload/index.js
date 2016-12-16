'use strict';
// Module defination as well as defination for all the directives, controllers for this moduls

module.exports = angular.module('modules.upload', [
        'ui.router',
        'ui.bootstrap'
    ])
    .controller('uploadViewCtrl', require('./controllers/uploadViewCtrl.js'))
    .config(require('./router/route'));
