'use strict';

module.exports = [
    '$scope',
    '$uibModalInstance',
    'FolderListService',
    'oldName',
    'requestData',
    'toaster',
    function(
        $scope,
        $uibModalInstance,
        FolderListService,
        oldName,
        requestData,
        toaster
    ) {
        var vm = this;
        vm.folder = {
            newName: oldName
        };
        vm.ok = function() {
            vm.folder.newName = vm.folder.newName.trim();
            if (vm.folder.newName === oldName) {
                toaster.pop('Warning',
                    'No change detected.');
                return;
            }

            requestData.data.FolderName = vm.folder.newName;
            console.log("requestData ", requestData);
            FolderListService.moveFolder(requestData).then(function(response) {
                $uibModalInstance.close();
            }, function(error) {
                console.log('Folder Rename ', error);
            })

        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
];
