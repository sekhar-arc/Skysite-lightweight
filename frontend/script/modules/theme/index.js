'use strict';
// Module defination as well as defination for all the directives, controllers for this moduls

module.exports = angular.module('modules.theme', [
        'ui.router',
        'ui.bootstrap'
    ])
    .controller('themeStepCtrl', require('./controllers/themeStepCtrl.js'))
    .controller('themeStep1Ctrl', require('./controllers/themeStep1Ctrl.js'))
    .controller('themeStep2Ctrl', require('./controllers/themeStep2Ctrl.js'))
    .controller('themeStep3Ctrl', require('./controllers/themeStep3Ctrl.js'))
    .controller('themeStep4Ctrl', require('./controllers/themeStep4Ctrl.js'))
    .controller('layoutCtrl', require('./controllers/layoutCtrl.js'))
    .config(require('./router/route'));
