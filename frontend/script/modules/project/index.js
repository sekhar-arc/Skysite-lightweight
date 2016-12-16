'use strict';
// Module defination as well as defination for all the directives, controllers for this moduls

module.exports = angular.module('modules.project', [
        'ui.router',
        'ui.bootstrap'
    ])
    .controller('projectCtrl', require('./controllers/project'))
    .controller('projectUpdateCtrl', require('./controllers/projectUpdateCtrl'))
    .service('ProjectService', require('./services/project-service'))
    .config(require('./router/route'));
