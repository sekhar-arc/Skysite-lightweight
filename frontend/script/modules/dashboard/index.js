'use strict';
// Module defination as well as defination for all the directives, controllers for this moduls

module.exports = angular.module('modules.dashboard', [
        'ui.router',
        'ui.bootstrap'
    ])
    .controller('dashboardCtrl', require('./controllers/dashboard'))
    // .service('ProjectService',require('./services/project-service'))
    .config(require('./router/route'));
