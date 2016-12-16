'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'UploadService',
    'ProjectFolderID',
    'PINProjectID',
    'breadcrumbList',
    function(
        $rootScope,
        $scope,
        $uibModalInstance,
        UploadService,
        ProjectFolderID,
        PINProjectID,
        breadcrumbList
    ) {
        var vm = this;
        vm.preventSubmit = false;
        vm.save = function() {
            console.log('vm.ok');
            vm.preventSubmit = true;
            vm.name = vm.name.trim();
            if (!vm.name) {
                return;
            }
            UploadService.createFolder({
                    PINProjectID: PINProjectID,
                    data: {
                        "PINProjectID": PINProjectID,
                        "FolderName": vm.name,
                        "ParentFolderID": ProjectFolderID
                    }
                })
                .then(function(response) {
                        vm.preventSubmit = false;
                        $rootScope.$broadcast('new-folder', {
                            "FolderName": vm.name,
                            "ParentFolderID": ProjectFolderID,
                            "breadcrumbList": breadcrumbList
                        })
                        $uibModalInstance.close({
                            isSucess: true
                        });
                    },
                    function(err) {
                        vm.preventSubmit = false;
                        vm.cancel();
                    });
        };
        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
];
