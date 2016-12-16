'use strict';

module.exports = [
    '$scope',
    '$uibModalInstance',
    'toaster',
    'HeaderText',
    function(
        $scope,
        $uibModalInstance,
        toaster,
        HeaderText
    ) {
        var vm = this;
        vm.init = function() {
            vm.headerText = HeaderText;
        }
        vm.send = function() {
            $uibModalInstance.close();

        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
];
