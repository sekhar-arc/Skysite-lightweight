'use strict';

module.exports = [
    '$window',
    'Upload',
    '$timeout',
    'UploadService',
    'FolderListService',
    'BasicsFactory',
    '$uibModal',
    'toaster',
    '$filter',
    // 'GAPI',
    // 'Drive',
    function(
        $window,
        Upload,
        $timeout,
        UploadService,
        FolderListService,
        BasicsFactory,
        $uibModal,
        toaster,
        $filter
        // GAPI,
        // Drive
    ) {
        return {
            restrict: 'EA',
            template: require('./../templates/uploader.html'),
            scope: {
                // pathImage: '='
            },
            link: function(scope, element) {

            },
            controller: "fileUploadCtrl as vm"
        };
    }
]
