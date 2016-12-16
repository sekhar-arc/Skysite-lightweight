'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'UploadService',
    'FolderListService',
    'toaster',
    'moveCount',
    'deleteData',
    function(
        $rootScope,
        $scope,
        $uibModalInstance,
        UploadService,
        FolderListService,
        toaster,
        moveCount,
        deleteData
    ) {
        var vm = this,
            folderData = {};

        vm.init = function() {
            console.log('Delete', deleteData);
            vm.fileCount = moveCount;
        }
        vm.save = function() {
            FolderListService.deleteDocument(deleteData).then(function(response) {
                $uibModalInstance.close({
                    isSucess: true
                });
            }, function(error) {
                console.log('Error', error);
                $uibModalInstance.dismiss('cancel');
            })

        };
        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
];
