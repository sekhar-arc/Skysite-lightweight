'use strict ';
module.exports = angular.module('modules', [
    require('./common').name,
    require('./theme').name,
    require('./upload').name,
    require('./project').name,
    require('./dashboard').name,
    require('./contact').name
]);
