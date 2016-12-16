'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'UploadService',
    'ProjectFolderID',
    'BaseData',
    'Folder',
    'FolderListService',
    'toaster',
    function(
        $rootScope,
        $scope,
        $uibModalInstance,
        UploadService,
        ProjectFolderID,
        BaseData,
        Folder,
        FolderListService,
        toaster
    ) {
        var vm = this,
            folderData = {};

        function init() {
            if (Folder.ChildFolderCount || Folder.DocumentCount) {
                vm.hasChild = true;
            } else {
                vm.hasChild = false;
            }
            folderData.headers = {
                TokenKey: BaseData.tokenKey
            }
            folderData.params = {
                pinProjectId: BaseData.PINProjectID,
                projectFolderId: Folder.ProjectFolderID,
                hierarchyDelete: 1
            }
        }
        vm.save = function() {
            FolderListService.deleteFolder(folderData).then(function(response) {
                console.log('Delete Folder success', response);
                toaster.pop('Success', 'Folder has been deleted successfully');
                $uibModalInstance.close({
                    isSucess: true
                });
            }, function(error) {
                console.log('Delete Folder Fail', error);
            })


        };
        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        init();
    }
];
