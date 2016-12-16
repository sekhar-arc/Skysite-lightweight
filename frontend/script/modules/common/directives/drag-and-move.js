'use strict';

module.exports = [
    '$window',
    '$timeout',
    function(
        $window,
        $timeout
    ) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                $timeout(function() {
                    element.bind('click', function() {
                        console.log('clicked on row', scope);
                    })
                }, 0)


            },
            controller: [
                '$scope',
                '$timeout',
                function(
                    $scope,
                    $timeout
                ) {

                }
            ]
        };
    }
]
