'use strict';
// Module defination as well as defination for all the directives, controllers for this moduls

module.exports = angular.module('modules.common', [
        'ui.router',
        'ui.bootstrap'
    ])
    .directive('fileUpload', require('./directives/file-upload.js'))
    .directive('folderView', require('./directives/folder-structure.js'))
    .directive('abnTree', require('./directives/abntree.js'))
    .directive('dragAndMove', require('./directives/drag-and-move.js'))
    .controller('uploadCtrl', require('./controllers/uploadCtrl.js'))
    .controller('loginCtrl', require('./controllers/loginCtrl.js'))
    .controller('addFolderCtrl', require('./controllers/create-new-folder'))
    .controller('renameFolderCtrl', require('./controllers/rename-folder'))
    .controller('copyFolderCtrl', require('./controllers/copyFolderCtrl'))
    .controller('egnyteDomain', require('./controllers/egnyte-domain'))
    .controller('updateDocumentCtrl', require('./controllers/updateDocumentCtrl'))
    .controller('deleteFolderCtrl', require('./controllers/delete-folder'))
    .controller('deleteFileCtrl', require('./controllers/deleteFileCtrl'))
    .controller('fileUploadCtrl', require('./controllers/upload-ctrl'))
    .controller('shareLink', require('./controllers/share-link-ctrl'))
    .service('ApiRequestService', require('./services/apiservice'))
    .constant('API', require('./constants/api'))
    .constant('Occupation', require('./constants/occupation'))
    .constant('Business', require('./constants/business'))
    .service('LoginService', require('./services/loginservice'))
    .service('UploadService', require('./services/upload-service'))
    .service('FolderListService', require('./services/folderlistservice'))
    .service('CustomTemplateService', require('./services/customtemplateservice'))
    .factory('BasicsFactory', require('./factories/basics'))
    .factory('ThemeFactory', require('./factories/theme-factory.js'))
    .filter('bytes', require('./filters/bytes'))
    .filter('lookupSearchFilter', require('./filters/lookupSearchFilter'))
    .filter('extensionFilter', require('./filters/fileExtension'))
    .filter('occupationFilter', require('./filters/occupation-filter'))
    .config(require('./router/route'));
