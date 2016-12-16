'use strict';

module.exports = [
    '$window',
    '$timeout',
    function(
        $window,
        $timeout
    ) {
        return {
            restrict: 'E',
            template: require('./../templates/folder-view.html'),
            scope: {
                folderStruct: '=folderStruct'
            },
            link: function(scope, element, attributes) {
                console.log('attributes', scope);
                scope.currentFolder = scope.folderStruct;


            },
            controller: [
                '$scope',
                '$timeout',
                function(
                    $scope,
                    $timeout
                ) {
                    $scope.changeCurrentFolder = function(current) {
                        console.log('folder : ', current);
                        $scope.currentFolder = current;
                    }
                }
            ]
        };
    }
]
