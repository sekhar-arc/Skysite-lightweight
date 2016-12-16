'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'FolderListService',
    'UploadService',
    'ProjectFolderID',
    'PINProjectID',
    'getFile',
    'requestHeaders',
    'getCustomPropertyListModal',
    function(
        $rootScope,
        $scope,
        $uibModalInstance,
        FolderListService,
        UploadService,
        ProjectFolderID,
        PINProjectID,
        getFile,
        requestHeaders,
        getCustomPropertyListModal
    ) {
        var vm = this;
        /*
         * For calling custom property attribute list
         */
        function getCustomPropertyAttribute() {

            var customData = {};
            customData.params = {
                "customPropertyId": getCustomPropertyListModal[1].CustomPropertyID
            }
            customData.headers = {
                TokenKey: requestHeaders.TokenKey,
                PINProjectID: PINProjectID
            }
            FolderListService.getCustomPropertyAttributeList(customData).then(function(response) {
                console.log('Custom Property Attribute', response);
            }, function(error) {
                console.log('Error', error);
            })

        }
        /*
         * Initialization
         */
        var lookupArray = [],
            lookupCount = 0;

        function init() {

            vm.file = getFile;
            vm.customPropertyList = getCustomPropertyListModal;
            getAllLookup();
            // getCustomPropertyAttribute();
            // Date Time picker Settings
            $scope.today = function() {
                $scope.dt = new Date();
            };
            $scope.today();
            $scope.open = function(property) {
                property.opened = true;
            };
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            $scope.popup1 = {
                opened: false
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            // Date Time Picker settings
        }
        init();
        /*
         * Get Details of a document
         */
        function getDocumentDetails() {
            var documentDetailsData = {};
            documentDetailsData.params = {
                projectDocumentId: vm.file.ProjectDocumentID,
                source: 5,
                operation: 1
            }
            documentDetailsData.headers = {
                TokenKey: requestHeaders.TokenKey,
                PINProjectID: PINProjectID,
                FromAWS: true
            }
            FolderListService.getDocumentDetails(documentDetailsData).then(function(response) {
                console.log('Details success', response);
            }, function(error) {
                console.log('Details error', error);
            })
        }
        /*
         * Get Attribute Lookup
         */
        function getAllLookup() {
            vm.customPropertyList.forEach(function(val) {
                var lookupDetails = {},
                    count = 0;
                lookupDetails.headers = {
                    TokenKey: requestHeaders.TokenKey,
                    PINProjectID: PINProjectID
                }
                if (val.PropertyType === 2) {
                    count++;
                    //Set Params
                    lookupDetails.params = {
                        customPropertyId: val.Attributes[0].CustomPropertyID,
                        customAttributeId: val.Attributes[0].CustomAttributeID
                    }
                    val.lookupList = [];
                    FolderListService.getLookup(lookupDetails).then(function(response) {
                        lookupArray.push(response[0]);
                        lookupCount++;
                        if (count === lookupCount) {
                            console.log('Stop here');
                            assignLookup();
                        }
                    }, function(error) {
                        console.log('lookup error', error);
                    })
                }
            })
        }
        /*
         * Assign respective lookup data list to respective fields
         */
        function assignLookup() {
            var count = 0;
            vm.customPropertyList.forEach(function(val) {
                if (val.PropertyType == 2) {
                    val.lookupList = lookupArray[count];
                    count++;
                }
            })
        }
        vm.save = function() {
            var documentData = {};
            documentData.params = {
                checkStatus: 1
            };
            documentData.headers = requestHeaders;
            documentData.data = {
                "ProjectFolderID": ProjectFolderID,
                "PINProjectID": PINProjectID,
                "ProjectDocumentID": vm.file.ProjectDocumentID,
                "DocumentTitle": vm.file.DocumentTitle,
                "DocumentDesc": vm.file.DocumentDesc,
                "DocumentName": vm.file.DocumentName,
                "SearchTag": vm.file.SearchTag
            }
            vm.createCustomList();
            documentData.data.CustomProperties = vm.customPropertyList;
            console.log('Custom Data', documentData);
            FolderListService.moveDocument(documentData).then(function(response) {
                $uibModalInstance.close({
                    isSucess: true
                });
            }, function(error) {
                console.log('Update error ', error);
            })

        };
        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.createCustomList = function() {

            vm.customPropertyList.forEach(function(val) {
                if (val.lookupList) {
                    val.Lookups = val.selected;
                } else {
                    var value = val.LookupDataText;
                    val.Lookups = [{
                        "LookupDataID": 0,
                        "LookupData": [{
                            "CustomAttributeID": 0,
                            "LookupDataText": value
                        }]
                    }]
                }
            })
        }
    }
];
