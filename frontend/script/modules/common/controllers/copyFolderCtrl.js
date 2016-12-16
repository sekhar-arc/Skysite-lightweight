'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'FolderListService',
    'oldName',
    'requestData',
    'pathList',
    '$timeout',
    'toaster',
    function(
        $rootScope,
        $scope,
        $uibModalInstance,
        FolderListService,
        oldName,
        requestData,
        pathList,
        $timeout,
        toaster
    ) {
        var vm = this;
        vm.selectedFolder = "";
        $scope.$on('changeCurrentDir', function(e, d) {
            vm.selectedFolder = d;
        });
        $scope.$broadcast('rename-folder', {
            breadcrumbList: pathList
        });
        $timeout(function() {
            $scope.$broadcast('rename-folder', {
                breadcrumbList: pathList
            });
        }, 0);



        vm.save = function() {
            console.log('Selected folder ', vm.selectedFolder);
            $uibModalInstance.close(changeCurrentDir);

        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
];
