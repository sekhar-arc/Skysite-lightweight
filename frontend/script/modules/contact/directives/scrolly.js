'use strict';

module.exports = [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var raw = element[0];
            
            scope.vm.isCall = true;
            raw = raw.getElementsByClassName("nano-content")[0];
            var rawElement = angular.element(raw);
            rawElement.bind('scroll', function() {

                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight && scope.vm.isCall) {
                    
                    scope.vm.isCall = false;
                    scope.$apply(attrs.scrolly);
                }
            });
        }
    };
}];
