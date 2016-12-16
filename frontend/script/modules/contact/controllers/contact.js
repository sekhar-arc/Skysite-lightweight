'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    'BasicsFactory',
    '$state',
    'toaster',
    '$timeout',
    function(
        $rootScope,
        $scope,
        BasicsFactory,
        $state,
        toaster,
        $timeout
    ) {
        var vm = this;

        vm.init = function() {
            vm.searchKey = '';
            $scope.$on('active:button', changeActioveBtn);
        };

        function changeActioveBtn(event, data) {
            vm.activeBtn = data;
        };

        vm.refreshContactList = function() {
            vm.searchTimer && clearTimeout(vm.searchTimer);
            vm.searchTimer = setTimeout(function() {
                $scope.$broadcast('refresh:contact-group-list:searchKey', true);
            }, 1000);

        };

        vm.clearSearch = function() {
            if (!vm.searchIsInProgress) {
                vm.searchKey = '';
                $scope.$broadcast('refresh:contact-group-list:searchKey', true);
            }
        };

        vm.gotoState = function(state) {
            $state.go(state);
        }

    }
];
