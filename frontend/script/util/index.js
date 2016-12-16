'use strict ';
module.exports = angular.module('util', [
        require('./dropbox-picker').name
    ])
    .constant('ErrorLib', require('./constants/error-lib'));
