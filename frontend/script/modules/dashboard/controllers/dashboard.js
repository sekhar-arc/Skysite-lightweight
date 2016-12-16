'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    'BasicsFactory',
    '$state',
    'toaster',
    function(
        $rootScope,
        $scope,
        BasicsFactory,
        $state,
        toaster
    ) {
        var vm = this;

        vm.init = function() {
            console.log('Dashboard init');
            $scope.$emit('clearProjectDetails');
        };
        vm.goToProjects = function() {
            $state.go('authenticated.layout.project.list');
        }
        vm.goToContacts = function() {
                $state.go('authenticated.layout.contact.thumbnail.details');
            }
            // vm.goToState = function() {
            //      $state.go('authenticated.layout.project.list');
            // }

    }
];
