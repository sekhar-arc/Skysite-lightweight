'use strict';

module.exports = ['$window',
    'Upload',
    '$timeout',
    'UploadService',
    'FolderListService',
    'BasicsFactory',
    '$uibModal',
    'toaster',
    '$filter',
    '$scope',
    'GridApi',
    'Grid',
    function(
        $window,
        Upload,
        $timeout,
        UploadService,
        FolderListService,
        BasicsFactory,
        $uibModal,
        toaster,
        $filter,
        $scope,
        GridApi,
        Grid
    ) {
        var vm = this;
        var dragging = false,
            startingIndex,
            selectAll = false,
            selectedFiles = [];

        //To handle ctrl operations through keyboard

        $scope.ctrlDown = false;
        $scope.ctrlKey = 17;

        $scope.keyDownFunc = function($event) {
            if ($scope.ctrlDown && String.fromCharCode($event.which).toLowerCase() == 'x') {
                $event.preventDefault();
                $scope.moveFiles();
            } else if ($scope.ctrlDown && String.fromCharCode($event.which).toLowerCase() == 'v') {
                $event.preventDefault();
                if ($scope.moveCount > 0) {
                    $scope.dropMove()
                }
            } else if ($scope.ctrlDown && String.fromCharCode($event.which).toLowerCase() == 'a') {
                $event.preventDefault();
                $scope.selectAllFiles(1);
            }
        };

        angular.element($window).bind("keyup", function($event) {
            if ($event.keyCode == $scope.ctrlKey)
                $scope.ctrlDown = false;
            $scope.$apply();
        });

        angular.element($window).bind("keydown", function($event) {
            if ($event.keyCode == $scope.ctrlKey)
                $scope.ctrlDown = true;
            $scope.$apply();
        });

        //To handle ctrl operations through keyboard


        $scope.toggleMinimize = function(indicator) {
            $scope.minimizeFooter = !$szzcope.minimizeFooter;
        }

        $scope.toggleTreeView = function() {
            $scope.toggleTree = !$scope.toggleTree;
        }
        $scope.toggleView = function(view) {
            $scope.isGrid = !$scope.isGrid;
        }
        $scope.changeCurrentDir = function(folder) {
            $scope.$broadcast('expand-folder', {
                folder: folder,
                breadcrumbList: $scope.breadcrumbList
            });
            if (!dragging) {
                $scope.parentFolderId = folder.ProjectFolderID;
                loadData();
            }
        }
        $scope.selectBranch = function(data) {
            // 
        }

        /*
         * Method setBreadcrumb
         * Description Prepares breadcrumbList (create bradcurmb of current directory)
         * 
         */
        function setBreadcrumb(folder) {
            if ($scope.parentFolderId) {
                var pathFolderIDArray = folder.PathFolderID.split('>'),
                    pathNameArray = folder.PathName.split('>>');


                pathNameArray.unshift($scope.baseData.projectName);


                var breadcrumbList = [];
                pathNameArray.forEach(function(path, index) {
                    breadcrumbList.push({
                        pathName: path,
                        PathFolderID: pathFolderIDArray[index] || 0
                    });
                });

                $scope.breadcrumbList = breadcrumbList;
            } else {
                $scope.breadcrumbList = [{
                    pathName: $scope.baseData.projectName,
                    PathFolderID: 0
                }];
            }

            // ($scope.breadcrumbList.length > 1) && $scope.breadcrumbList.pop();

        };

        $scope.goToDir = function(item) {
            var tmpBreadcrumb = [],
                i,
                limit = $scope.breadcrumbList.indexOf(item)
            $scope.parentFolderId = item.PathFolderID;
            for (i = 0; i <= limit; i++) {
                tmpBreadcrumb[i] = $scope.breadcrumbList[i];
            }

            $scope.$broadcast('rename-folder', {
                breadcrumbList: tmpBreadcrumb
            });

            loadData();
        };

        $scope.startDrag = function(file, idx, event) {
            dragging = true;

            if (file) {
                $scope.selectedCount = 0;
                file.isSelected = true;
                $scope.currentDir.files.forEach(function(file) {
                    if (file.isSelected) {
                        $scope.selectedCount++;
                    }
                })
            }
        };

        $scope.completeDrag = function(file, idx) {
            $timeout(function() {
                dragging = false;
            }, 100)
            $scope.selectedCount = 0;

        };

        $scope.moveTo = function(data, event, to) {


            if (!data) {
                return;
            }
            if (!data.isFile) {
                var idx = $scope.currentDir.folders.indexOf(data.data);
                $scope.currentDir.folders.splice(idx, 1);


                var folderData = {};
                folderData.headers = {
                    TokenKey: $scope.baseData.tokenKey,
                    PINProjectID: BasicsFactory.getDetails().PINProjectID,
                    'Content-Type': 'application/json'
                };

                folderData.data = {
                    PINProjectID: $scope.baseData.PINProjectID,
                    ParentFolderID: to.ProjectFolderID,
                    ProjectFolderId: data.data.ProjectFolderID
                };

                folderData.params = {
                    operation: 4
                };
                FolderListService.moveFolder(folderData)
                    .then(function(response) {
                        $scope.$broadcast('move-folder', {
                            breadcrumbList: $scope.breadcrumbList,
                            folder: folderData
                        });
                    }, function(error) {

                    })
                    .finally(function() {
                        loadData();
                    });
            } else {
                var idx = $scope.currentDir.files.indexOf(data.data);
                $scope.currentDir.files.splice(idx, 1);
                var folderData = [{
                    "ProjectDocumentID": data.data.ProjectDocumentID
                }];

                moveDocumentOperation(to.ProjectFolderID, folderData);



                //Remove from current
                // var idx = $scope.currentDir.files.indexOf(data.data);
                // $scope.currentDir.files.splice(idx, 1);
                //Move to destination
                // to.files.push(data.data);
            }
        };

        $scope.init = function() {
            $scope.baseData = BasicsFactory.getDetails();
            $scope.uploadFiles = {};
            $scope.uploadFilesLength = 0;
            $scope.toggleTree = true;
            $scope.isGrid = false;
            $scope.minimizeFooter = false;
            $scope.myTree = {};
            $scope.selectedCount = 0;
            $scope.isOpen = false;
            $scope.moveCount = 0;
            $scope.currentDir = {
                files: [],
                folders: []
            };
            vm.pageNo = 1;
            vm.sortOptions = [{
                value: 0,
                text: "All"
            }, {
                value: 1,
                text: "Create Date"
            }, {
                value: 2,
                text: "Document Name"
            }];
            vm.sortOption = vm.sortOptions[0];
            vm.perPageItemList = [{
                value: 15,
                text: "15 per page"
            }, {
                value: 25,
                text: "25 per page"
            }, {
                value: 50,
                text: "50 per page"
            }, {
                value: 100,
                text: "100 per page"
            }];
            vm.perPageItem = vm.perPageItemList[0];
            vm.apiObject = {
                params: {},
                headers: {
                    tokenkey: BasicsFactory.getDetails().tokenKey,
                    Page: vm.pageNo,
                    PerPage: vm.perPageItem.value
                }
            };
            $scope.gridOptions = {
                id: 'customize-grid',
                rowHeight: 60,
                data: 'currentDir.files',
                enableColumnResizing: true,
                rowTemplate: require('../templates/rowTemplate.html'),
                columnDefs: [
                    // {
                    //     field: 'OriginalExtension',
                    //     displayName: 'File Name',
                    //     width: 100,
                    //     enableColumnResizing: false,
                    //     pinnedLeft: true,
                    //     cellClass: 'extension-cell custom-cell',
                    //     enableSorting: false,
                    //     cellTemplate: '<div class="ui-grid-cell-contents " style="color: #4a89f2"><div class="list-extension-style">{{ COL_FIELD | extensionFilter }}</div></div>'
                    // }, 
                    {
                        field: 'DocumentName',
                        displayName: 'Name',
                        minWidth: 200,
                        width: 250,
                        maxWidth: 350,
                        pinnedLeft: true,
                        cellClass: 'name-cell custom-cell',
                        cellTemplate: require('../templates/name-cell-template.html'),
                        enableSorting: true
                    }, {
                        field: 'DocumentTitle',
                        displayName: 'Title',
                        width: '30%',
                        maxWidth: 200,
                        minWidth: 100,
                        cellClass: 'title-cell custom-cell',
                        enableSorting: false
                    }, {
                        field: 'RevisionDate',
                        displayName: 'Date',
                        minwidth: 100,
                        width: 150,
                        maxWidth: 200,
                        type: 'date',
                        cellFilter: 'date:\'dd-MMM-yyyy\'',
                        cellClass: 'date-cell custom-cell',
                        enableSorting: false
                    }, {
                        field: 'Filesize',
                        displayName: 'Size',
                        maxWidth: 150,
                        minWidth: 70,
                        cellFilter: 'bytes:this',
                        enableSorting: false

                    }, {
                        field: 'DocumentDesc',
                        displayName: 'Description',
                        width: 300,
                        maxWidth: 450,
                        minWidth: 200,
                        enableSorting: false

                    }, {
                        field: 'RevisionNumber',
                        displayName: 'Version',
                        maxWidth: 150,
                        minWidth: 70,
                        enableSorting: false

                    }
                ]
            };
            $scope.copyFileList = [];
            $scope.moveFileList = [];
            // $scope.totalUploadPrecentage = 0;
            $scope.uploadedData = 0;
            $scope.showMainMenu = false;

            /**/
            $scope.page = 1;
            $scope.perPage = 100;
            $scope.PINProjectID = $scope.baseData.PINProjectID;
            $scope.parentFolderId = 0;
            $scope.customPropertyList = [];
            getCustomAttributes();
            /**/

            loadData();

            $scope.$on('changeCurrentDir', function(event, ProjectFolderID) {
                $scope.parentFolderId = ProjectFolderID;
                vm.pageNo = 1;
                loadData();
            });
            $scope.$on('moveFileFromRight', function(event, data) {
                var listOfFiles = [];
                $scope.currentDir.files.forEach(function(val) {
                    if (val.isSelected) {
                        listOfFiles.push({
                            "ProjectDocumentID": val.ProjectDocumentID
                        });
                        $scope.moveCount++;
                    }
                })

                moveDocumentOperation(data.ProjectFolderID, listOfFiles, 'Move Successfull');
            })

            $scope.fileMenuOptions = function(item) {
                if (item) {
                    $scope.selectFile(item, 0, {}, true);
                }
                var itemSelectedMenu = [
                    ['Copy', function($itemScope, $event, modelValue, text, $li) {
                        $scope.copyFile($itemScope.showFile);
                    }],
                    null, // Dividier
                    ['Cut', function($itemScope, $event, modelValue, text, $li) {
                        $scope.moveFiles();
                    }],
                    null, // Dividier
                    ['Update', function($itemScope, $event, modelValue, text, $li) {
                        $scope.updateFile($itemScope.showFile);
                    }],
                    null, // Dividier
                    ['Remove', function($itemScope, $event, modelValue, text, $li) {
                        $scope.deleteFiles();
                    }],
                    null, // Dividier
                    ['Send Link', function($itemScope, $event, modelValue, text, $li) {
                        $scope.sendLink($itemScope.showFile);
                    }]
                ];
                var pasteEnableMenu = [
                    ['Copy', function($itemScope, $event, modelValue, text, $li) {
                        $scope.copyFile($itemScope.showFile);
                    }],
                    null, // Dividier
                    ['Cut', function($itemScope, $event, modelValue, text, $li) {
                        $scope.moveFiles();
                    }],
                    null, // Dividier
                    ['Paste', function($itemScope, $event, modelValue, text, $li) {
                        $scope.dropMove();
                    }],
                    null, // Dividier
                    ['Update', function($itemScope, $event, modelValue, text, $li) {
                        $scope.updateFile($itemScope.showFile);
                    }],
                    null, // Dividier
                    ['Remove', function($itemScope, $event, modelValue, text, $li) {
                        $scope.deleteFiles();
                    }],
                    null, // Dividier
                    ['Send Link', function($itemScope, $event, modelValue, text, $li) {
                        $scope.sendLink($itemScope.showFile);
                    }]
                ];
                if ($scope.moveFileList.length) {
                    return pasteEnableMenu;
                }

                for (var i = 0; i < $scope.currentDir.files.length; i++) {
                    if ($scope.currentDir.files[i].isSelected) {

                        return itemSelectedMenu;
                    }
                }
                return [];
            }
            $scope.fileListMenuOptions = function(item) {
                $scope.selectFile(item.entity, 0, {}, true);

                return [
                    ['Copy', function($itemScope, $event, modelValue, text, $li) {
                        $scope.copyFile(item.entity);
                    }],
                    null, // Dividier
                    ['Cut', function($itemScope, $event, modelValue, text, $li) {
                        $scope.moveFiles();
                    }],
                    null, // Dividier
                    ['Update', function($itemScope, $event, modelValue, text, $li) {
                        $scope.updateFile(item.entity);
                    }],
                    null, // Dividier
                    ['Remove', function($itemScope, $event, modelValue, text, $li) {
                        $scope.deleteFiles();
                    }],
                    null, // Dividier
                    ['Send Link', function($itemScope, $event, modelValue, text, $li) {
                        $scope.sendLink(item.entity);
                    }]
                ];
            }
            $scope.folderMenuOptions = [
                ['Rename', function($itemScope, $event, modelValue, text, $li) {
                    $scope.renameFloder($itemScope.showFolders);
                }],
                null, ['Remove', function($itemScope, $event, modelValue, text, $li) {
                    $scope.deleteFolders($itemScope.showFolders);
                }]
            ];
            startingIndex = -1;

            /**/


            /**/
        };

        $scope.files = [];

        $scope.onLoaded = function() {

        }

        $scope.onPicked = function(docs) {
            angular.forEach(docs, function(file, index) {
                $scope.files.push(file);
            });

        }
        $scope.onPickedOneDrive = function(docs) {
            $scope.onPicked(docs.values);
        }

        $scope.onCancel = function() {

        }

        $scope.show = function() {

            if (!$scope.ufile.length) {
                toaster.pop('Warnning', 'Empty Folders are not allowed.');
            }

            if (!$scope.parentFolderId) {
                $scope.ufile = [];
                toaster.pop('Warnning',
                    'Upload File(s) and Folder(s) directly into a project are not allowed.');
                return;
            }
            $scope.minimizeFooter = false;
            $scope.ufile.forEach(function(file, i) {
                var date = new Date();
                file.key = date.getTime() + i;
            });

            var temp, temp1;
            $scope.tree = $scope.ufile.reduce(function(returnVal, each) {
                temp = returnVal;
                temp1 = null;
                if (each && each.path) {
                    each.path.split('/')
                        .forEach(function(eachInner, index, array) {
                            if (index + 1 !== array.length) {
                                temp1 = temp.folders.filter(function(filterEach) {
                                    return filterEach.name === eachInner;
                                })[0];
                                if (!temp1) {
                                    temp1 = {
                                        name: eachInner,
                                        folders: [],
                                        files: []
                                    };
                                    temp.folders.push(temp1);
                                }

                                temp = temp1;
                            } else {
                                temp.files.push(each);
                            }
                        });
                } else {
                    returnVal.files.push(each);
                }
                return returnVal;
            }, {
                name: $scope.currentDir.name || 'root',
                PathName: $scope.currentDir.PathName || '',
                folders: [],
                files: []
            });

            var goodToGo = !checkForConflict($scope.tree, $scope.currentDir);

            if (goodToGo) {
                $scope.ufile.forEach(function(file, i) {
                    file.percentage = 0;
                    $scope.uploadFiles[file.key] = file;
                    // $scope.uploadFiles[file.key].percentage = 0;
                    $scope.uploadFilesLength++;
                });
            } else {
                toaster.pop('Warnning',
                    'Folder Name aleady Exists, change the folder name and upload it again.');
                $scope.ufile = [];
                return;
            }


            $scope.startUpload();
        };

        function setFileKey(file, i) {

            $scope.uploadFiles[file.key] = file;
            $scope.uploadFiles[file.key].percentage = 0;
            $scope.uploadFilesLength++;
        };

        $scope.openCreateFolderModal = function() {
            var modalInstance = $uibModal
                .open({
                    template: require('../templates/create-folder.html'),
                    controller: "addFolderCtrl as vm",
                    size: "md",
                    resolve: {
                        ProjectFolderID: function() {
                            return $scope.currentDir.ProjectFolderID;
                        },
                        PINProjectID: function() {
                            return $scope.baseData.PINProjectID;
                        },
                        breadcrumbList: function() {
                            return $scope.breadcrumbList;
                        }
                    }
                });
            modalInstance.result.then(function(data) {
                loadData();
            }, function(data) {});
        };

        $scope.openEgnyteModal = function() {
            var modalInstance = $uibModal
                .open({
                    template: require('../templates/egnyte-domain.html'),
                    controller: "egnyteDomain as vm",
                    size: "md",
                    // resolve: {
                    //     ProjectFolderID: function() {
                    //         return $scope.currentDir.ProjectFolderID;
                    //     },
                    //     PINProjectID: function() {
                    //         return $scope.baseData.PINProjectID;
                    //     },
                    //     breadcrumbList: function() {
                    //         return $scope.breadcrumbList;
                    //     }
                    // }
                });
            modalInstance.result.then(function(data) {
                loadData();
            }, function(data) {});
        }

        function moveDocumentOperation(ProjectFolderID, data, msg) {
            var folderData = {};
            folderData.headers = {
                TokenKey: $scope.baseData.tokenKey,
                PINProjectID: $scope.baseData.PINProjectID,
                'Content-Type': 'application/json',
                ProjectFolderId: ProjectFolderID
            };

            folderData.data = data;

            folderData.params = {
                operation: 4
            };


            FolderListService.moveDocument(folderData)
                .then(function(response) {
                    toaster.pop('Success', 'File Moved Successfully');
                    $scope.moveCount = 0;
                }, function(error) {

                })
                .finally(function() {
                    loadData();
                });
        };

        function createFolder(folder, parent) {
            UploadService.createFolder({
                    PINProjectID: $scope.baseData.PINProjectID,
                    data: {
                        "PINProjectID": $scope.baseData.PINProjectID,
                        "FolderName": folder.name,
                        "ParentFolderID": parent.ProjectFolderID
                    }
                })
                .then(function(response) {
                        getFolderList(parent, folder);
                    },
                    function(err) {});
        };

        function uploadFiles(files, parent) {
            files.forEach(function(file) {
                file.parent = parent;
                generateUploadURL(file);
            });
        };

        function createFolders(folders, parent) {
            folders.forEach(function(folder) {
                createFolder(folder, parent);
            });
        };

        function handleChildFunctions(node, uiNode) {

            //FOR FILE UPLOAD
            if (node.files.length) {
                uploadFiles(node.files, uiNode || $scope.currentDir);
            }

            // FOR FOLDER CREATION
            if (node.folders.length) {
                createFolders(node.folders, uiNode || $scope.currentDir);
            }
        };

        $scope.startUpload = function() {

            UploadService.createSessionID({
                    params: {
                        pinProjectId: $scope.baseData.PINProjectID,
                        uploadSource: 130 || $scope.parentFolderId
                    }
                })
                .then(
                    function(response) {
                        response = response[0];
                        $scope.sessionID = response.Result;
                        handleChildFunctions($scope.tree);
                    },
                    function(err) {

                    }
                );
        };

        $scope.resumeUpload = function(file) {
            file.isAbort = false;
            generateUploadURL(file);
            $scope.upload([file]);
        };

        $scope.removeFromUploadFiles = function(file) {
            delete $scope.uploadFiles[file.key];
            $scope.uploadFilesLength--;
            $scope.uploadedData--;
            if (!$scope.uploadFilesLength) {
                $scope.uploadFiles = {};
            }
        };

        $scope.stopUpload = function(file, key, idx) {
            if (file.abort) {
                file.abort();
                file.isAbort = true;
            } else {

                delete $scope.uploadFiles[key];
            }

        };

        $scope.close = function() {
            for (var file in $scope.uploadFiles) {
                $scope.removeFromUploadFiles(file);
                file.abort &&
                    file.abort();
            }
        };

        $scope.upload = function(files, parent, URL) {

            if (files && files.length) {

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {

                        Upload.upload({
                            url: URL,
                            data: {
                                file: file
                            }
                        }).success(function(response) {
                            $timeout(function() {

                                $scope.uploadedData++;
                                if ($scope.uploadedData === $scope.uploadFilesLength) {
                                    $scope.minimizeFooter = true;
                                }
                                loadData();
                            });
                        }).progress(function(evt) {
                            var progressPercentage = parseInt(100.0 *
                                evt.loaded / evt.total);
                            $scope.uploadFiles[evt.config.data.file.key].percentage = progressPercentage;

                        }).xhr(function(xhr) {
                            file.abort = function() {
                                xhr.abort();

                                $scope.uploadFiles[file.key].percentage = 0;

                            };
                        });
                    }
                }
            }
        };


        function loadData() {

            vm.apiObj = {
                page: vm.pageNo,
                perPage: vm.perPageItem.value,
                PINProjectID: $scope.PINProjectID,
                parentFolderId: $scope.parentFolderId,
                start: vm.start || ''
            };

            (vm.orderBy !== undefined) && (vm.apiObj.orderBy = vm.orderBy);

            UploadService.getFolderDetails(vm.apiObj)
                .then(function(response) {
                    var resHeader = response[2];
                    response = response[0];
                    console.log('Loaddata response : ', response);
                    if ($scope.parentFolderId) {

                        getFolderDetails({
                            PINProjectID: $scope.PINProjectID,
                            parentFolderId: $scope.parentFolderId,
                        }, response, true);

                    } else {
                        $scope.currentDir.folders = response.Folders;

                        $scope.currentDir.files = response.Documents;
                        $scope.currentDir.ProjectFolderID = 0;
                        setChooseImage($scope.currentDir.files);
                        setBreadcrumb($scope.currentDir);
                    }
                    vm.totalCount = vm.perPageItem.value * resHeader('Max-Page');

                }, function(err) {

                });
        };

        function getFolderDetails(cfg, data, setCurrentDir) {
            UploadService.folderDetails(cfg)
                .then(function(response) {
                    // var resHeader = response[2];
                    // 
                    response = response[0];

                    console.log('getFolderDetails response : ', response);
                    if (setCurrentDir) {
                        $scope.currentDir = response;
                        $scope.currentDir.files = data.Documents;
                        $scope.currentDir.folders = data.Folders;
                        // vm.totalCount = vm.perPageItem.value * resHeader('Max-Page');
                    }
                    setBreadcrumb($scope.currentDir);

                }, function(err) {

                });
        };

        function getFolderList(parent, folder) {
            FolderListService.getFolderList({
                    params: {
                        pinProjectId: $scope.baseData.PINProjectID,
                        parentFolderId: parent.ProjectFolderID
                    },
                    headers: {
                        TokenKey: $scope.baseData.tokenKey
                    }
                })
                .then(function(response) {
                        var targetFolder;
                        response[0].forEach(function(fldr) {
                            if (fldr.FolderName === folder.name)
                                targetFolder = fldr;
                        });
                        // loadData();  // NEED TO CLEAR WHAT ITS DOING

                        handleChildFunctions(folder, targetFolder);
                    },
                    function(err) {});
        };

        function generateUploadURL(file) {
            UploadService.uploadDocument({
                    data: [{
                        "PINProjectID": $scope.baseData.PINProjectID,
                        "ProjectFolderID": file.parent.ProjectFolderID,
                        "DocumentTitle": file.name,
                        "DocumentDesc": "This is the description.",
                        "DocumentName": file.name,
                        "Filesize": file.size
                    }]
                })
                .then(function(response) {

                        response = response[0][0].UploadUrl.split('?');
                        response[0] = "https://pwdwldstg1.planwellcollaborate.com/PWCUpload/HttpUploadHandlerMultiPart.ashx";
                        response = response.join('?');
                        $scope.upload([file], file.parent, response);
                    },
                    function(err) {});
        };

        function checkForConflict(uploadDir, currentDir) {
            var conflictFlag = false;
            currentDir.folders.forEach(function(savedFolder) {
                uploadDir.folders.forEach(function(droppedFolder) {
                    if (savedFolder.FolderName === droppedFolder.name) {
                        conflictFlag = true;
                    }
                });
            });
            return conflictFlag;
        };

        function getCustomAttributes() {
            var projectData = {};
            projectData.params = {
                pwAccountId: $scope.baseData.PWAccountID,
                pinProjectId: $scope.baseData.PINProjectID,
                includeAttribute: 1,
                moduleType: 3
            };
            projectData.headers = {
                TokenKey: $scope.baseData.tokenKey
            }
            FolderListService.getCustomPropertyList(projectData).then(function(response) {

                $scope.customPropertyList = response[0];
            }, function(error) {

            })
        }

        function setChooseImage(files) {
            files.forEach(function(val) {
                if (val.OriginalExtension === ".jpg") {
                    val.chooseImage = true;
                } else {
                    val.chooseImage = false;
                }
            })
        }

        $scope.reloadData = function() {
            $scope.$broadcast('reload', $scope.breadcrumbList);
            loadData();
        };

        $scope.renameFloder = function(folder) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../templates/popupmodal.html'),
                controllerAs: 'vm',
                controller: "renameFolderCtrl as vm",
                resolve: {
                    oldName: function() {
                        return folder.FolderName;
                    },
                    requestData: function() {
                        var folderData = {};
                        folderData.headers = {
                            'TokenKey': $scope.baseData.tokenKey,
                            'PINProjectID': $scope.baseData.PINProjectID,
                            'Content-Type': 'application/json'
                        };
                        folderData.data = {
                            "ParentFolderID": folder.ParentFolderID,
                            "ProjectFolderID": folder.ProjectFolderID,
                            "PINProjectID": $scope.baseData.PINProjectID
                        };
                        folderData.params = {};
                        return folderData;
                    }
                }
            })
            modalInstance.result.then(function(data) {
                $scope.$broadcast('rename-folder', {
                    breadcrumbList: $scope.breadcrumbList
                });
                loadData();
            }, function() {

            });

        };
        $scope.copyFile = function(file) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../templates/copy-folder.html'),
                controllerAs: 'vm',
                controller: "copyFolderCtrl as vm",
                resolve: {
                    oldName: function() {
                        return "";
                    },
                    requestData: function() {
                        var fileData = {};
                        fileData.headers = {
                            'TokenKey': $scope.baseData.tokenKey,
                            'PINProjectID': $scope.baseData.PINProjectID,
                            'Content-Type': 'application/json'
                        };
                        fileData.data = {
                            "ParentFolderID": file.ParentFolderID,
                            "ProjectFolderID": file.ProjectFolderID,
                            "PINProjectID": $scope.baseData.PINProjectID
                        };
                        fileData.params = {};
                        return "";
                    },
                    pathList: function() {
                        return $scope.breadcrumbList
                    }
                }
            })
            modalInstance.result.then(function(data) {
                // loadData();
            }, function() {

            });
        }

        $scope.renameFolderFromTree = function() {

            $scope.$broadcast('renameFolderFromTree');
        };

        $scope.copyFiles = function() {
            var count = 0;
            $scope.copyFileList = [];
            $scope.currentDir.files.forEach(function(val) {
                if (val.isSelected) {
                    $scope.copyFileList.push(val.ProjectDocumentID);
                    count++;
                }
            })
            if (count > 1) {
                toaster.pop('info', count + " files are copied");
            } else if (count === 1) {
                toaster.pop('info', "1 file is copied");
            }

        }
        $scope.updateFile = function(file) {
            var modalInstance = $uibModal
                .open({
                    template: require('../templates/update-document.html'),
                    controller: "updateDocumentCtrl as vm",
                    size: "md",
                    resolve: {
                        ProjectFolderID: function() {
                            return $scope.currentDir.ProjectFolderID;
                        },
                        PINProjectID: function() {
                            return $scope.baseData.PINProjectID;
                        },
                        requestHeaders: function() {
                            return {
                                TokenKey: $scope.baseData.tokenKey,
                                PINProjectID: $scope.baseData.PINProjectID,
                                "Content-Type": "application/json"
                            }
                        },
                        getFile: function() {
                            return file;
                        },
                        getCustomPropertyListModal: function() {
                            return $scope.customPropertyList;
                        }
                    }
                });
            modalInstance.result.then(function(data) {
                loadData();
            }, function(data) {});

        }
        $scope.moveFiles = function(file, parent) {
            $scope.moveCount = 0;
            $scope.moveFileList = [];
            if (file) {
                $scope.moveFileList.push({
                    "ProjectDocumentID": file.ProjectDocumentID
                });
                $scope.moveCount = 1;
            } else {
                $scope.currentDir.files.forEach(function(val) {
                    if (val.isSelected) {
                        $scope.moveFileList.push({
                            "ProjectDocumentID": val.ProjectDocumentID
                        });
                        $scope.moveCount++;
                    }
                })
            }
            if ($scope.moveCount > 1) {
                toaster.pop('info', $scope.moveCount + " files are ready to be moved");
            } else if ($scope.moveCount === 1) {
                toaster.pop('info', "1 file is ready to be moved");
            }
        }
        $scope.dropMove = function() {


            moveDocumentOperation($scope.parentFolderId, $scope.moveFileList, "File Moved Successfully");

        }
        $scope.deleteFiles = function(file) {
            var moveCount = 0,
                deleteFileList = [],
                deleteData = {};
            if (file) {
                deleteFileList.push({
                    "ProjectDocumentID": file.ProjectDocumentID,
                    "ProjectFolderID": file.ProjectFolderID,
                    "Filesize": file.Filesize
                });
                moveCount = 1;
            } else {
                $scope.currentDir.files.forEach(function(val) {
                    if (val.isSelected) {
                        deleteFileList.push({
                            "ProjectDocumentID": val.ProjectDocumentID,
                            "ProjectFolderID": $scope.parentFolderId,
                            "Filesize": val.Filesize
                        });
                        moveCount++;
                    }
                })
            }
            deleteData.params = {
                "pinProjectId": $scope.baseData.PINProjectID
            }
            deleteData.headers = {
                "TokenKey": $scope.baseData.tokenKey,
                "Content-Type": "application/json"
            }
            deleteData.data = deleteFileList;

            var modalInstance = $uibModal
                .open({
                    template: require('../templates/delete-file-confirmation.html'),
                    controller: "deleteFileCtrl as vm",
                    size: "sm",
                    resolve: {
                        deleteData: function() {
                            return deleteData
                        },
                        moveCount: function() {
                            return moveCount
                        }
                    }
                });
            modalInstance.result.then(function(data) {
                loadData();
                $scope.$broadcast('rename-folder', {
                    breadcrumbList: $scope.breadcrumbList
                });
                if (moveCount > 1) {
                    toaster.pop('success', moveCount + " files are deleted");
                } else if (moveCount === 1) {
                    toaster.pop('success', "1 file is deleted");
                }

            }, function(data) {});

            // FolderListService.deleteDocument(deleteData).then(function(response) {
            //     
            //     if (moveCount > 1) {
            //         toaster.pop('success', moveCount + " files are deleted");
            //     } else if (moveCount === 1) {
            //         toaster.pop('success', "1 file is deleted");
            //     }
            //     loadData();
            // }, function(error) {
            //     
            // })


        }
        $scope.dropOnBreadcrumb = function(data, event, item) {

            item.ProjectFolderID = item.PathFolderID;
            if (data.data.ParentFolderID + "" === item.PathFolderID) {
                toaster.pop('info', "This move is not possible");
            } else {
                $scope.moveTo(data, event, item);
            }
        }
        $scope.deleteFolders = function(folder) {
            var modalInstance = $uibModal
                .open({
                    template: require('../templates/delete-alert-confirm.html'),
                    controller: "deleteFolderCtrl as vm",
                    size: "sm",
                    resolve: {
                        ProjectFolderID: function() {
                            return $scope.currentDir.ProjectFolderID;
                        },
                        BaseData: function() {
                            return $scope.baseData;
                        },
                        Folder: function() {
                            return folder;
                        }
                    }
                });
            modalInstance.result.then(function(data) {
                loadData();
                $scope.$broadcast('rename-folder', {
                    breadcrumbList: $scope.breadcrumbList
                });
            }, function(data) {});
        }

        vm.pageChanged = function() {
            loadData();
        }

        vm.changePerPageCount = function(item) {
            vm.pageNo = 1;
            loadData();
        }
        vm.filterProjectList = function(option) {

            if (option.value === 1) {
                vm.orderBy = 0;
            } else if (option.value === 2) {
                vm.orderBy = 2;
            } else {
                delete vm.orderBy;
            }

            loadData();
        }

        $scope.selectFile = function(file, idx, event, force) {
            var big,
                small,
                len = $scope.currentDir.files.length;
            idx = $scope.currentDir.files.indexOf(file);
            //If clicked with shift key
            if (event && event.shiftKey) {
                if (startingIndex === -1) {
                    file.isSelected = true;
                    startingIndex = idx;
                } else {
                    small = Math.min(idx, startingIndex);
                    big = Math.max(idx, startingIndex);
                    for (var i = 0; i < len; i++) {
                        if (i >= small && i <= big) {
                            $scope.currentDir.files[i].isSelected = true;
                        } else {
                            $scope.currentDir.files[i].isSelected = false;
                        }
                    }
                }
            } else { //If normal click is done
                if (file.isSelected && !force) {
                    file.isSelected = false;
                    startingIndex = -1;
                } else {
                    file.isSelected = true;
                    startingIndex = idx;
                }
            }
        }
        $scope.toggleMainMenu = function() {
            $scope.showMainMenu = !$scope.showMainMenu;
        }
        $scope.selectAllFiles = function(fromKeyboard) {
            if (!selectAll || fromKeyboard === 1) {
                $scope.currentDir.files.forEach(function(file) {
                    file.isSelected = true;
                })
                selectAll = !selectAll;
            } else {
                $scope.currentDir.files.forEach(function(file) {
                    file.isSelected = false;
                })
                selectAll = !selectAll;
            }
        }
        $scope.sendLink = function(file) {
            console.log('file', file);
            var modalInstance = $uibModal
                .open({
                    template: require('../templates/share.html'),
                    controller: "shareLink as vm",
                    size: "md",
                    resolve: {
                        HeaderText: function() {
                            return "Share Document";
                        }
                    }
                });
            modalInstance.result.then(function(data) {
                // loadData();
            }, function(data) {});
        }
    }
]
