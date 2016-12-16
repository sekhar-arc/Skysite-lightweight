'use strict';
// Module defination as well as defination for all the directives, controllers for this moduls

module.exports = angular.module('modules.contact', [
        'ui.router',
        'ui.bootstrap'
    ])
    .directive('scrolly', require('./directives/scrolly.js'))
    .directive('contactList', require('./directives/contact-group-list.js'))
    .controller('contactCtrl', require('./controllers/contact'))
    .controller('contactListCtrl', require('./controllers/contact-list'))
    .controller('contactDetailsCtrl', require('./controllers/contact-details'))
    .controller('contactAddCtrl', require('./controllers/contact-add'))
    .controller('groupAddCtrl', require('./controllers/group-add'))
    .service('ContactService', require('./services/contact-service'))
    .config(require('./router/route'));
