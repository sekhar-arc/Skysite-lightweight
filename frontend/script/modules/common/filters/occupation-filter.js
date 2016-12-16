'use strict';
module.exports = [
    'Occupation',
    function(Occupation) {
        return function(PropertyID) {
            console.log('Filter : ', PropertyID, Occupation[PropertyID]);
            return Occupation[PropertyID];
        }
    }
];
