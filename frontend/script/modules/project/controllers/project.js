'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    'BasicsFactory',
    '$state',
    'ProjectService',
    'toaster',
    '$timeout',
    '$uibModal',
    function(
        $rootScope,
        $scope,
        BasicsFactory,
        $state,
        ProjectService,
        toaster,
        $timeout,
        $uibModal
    ) {
        var vm = this;

        vm.init = function() {
            console.log('Inside init');
            $scope.$emit('clearProjectDetails');
            vm.pageNo = 1;
            vm.sortOptions = [{
                value: 0,
                text: "Most Recent"
            }, {
                value: 1,
                text: "Marked Favoutite"
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
            getProjectList();
            getCountryList();

            $scope.projectMenuOptions = function(item, idx) {
                var itemSelectedMenu = [
                    ['Edit', function($itemScope, $event, modelValue, text, $li) {
                        vm.editProject(item, idx);
                    }]
                ];

                return itemSelectedMenu;


            }
        };

        function getCountryList() {
            var apiObject = {
                headers: {
                    TokenKey: BasicsFactory.getDetails().tokenKey
                },
                params: {
                    action: 1//country
                }
            };
            ProjectService.locationList(apiObject)
                .then(function(response) {
                    console.log('response : ', response);
                    response = response[0];
                    vm.countryList = response;
                    vm.country = vm.countryList[0];
                    vm.getStateList(vm.country);
                }, function() {});
        }

        vm.getStateList = function(country, modal) {
            console.log('getStateList : ', country);
            var apiObject = {
                headers: {
                    TokenKey: BasicsFactory.getDetails().tokenKey
                },
                params: {
                    action: 2,//state
                    countryId: country.CountryID
                }
            };
            ProjectService.locationList(apiObject)
                .then(function(response) {
                    console.log('response : ', response);
                    response = response[0];
                    vm.stateList = response;
                    vm.state = vm.stateList[0];
                    if (modal) {
                        modal.stateList = response;
                        modal.state = vm.stateList[0];
                    }
                    console.log('vm = ', vm);
                }, function() {});
        }

        function getProjectList(isEmit) {
            var apiObject = vm.apiObject || {
                params: {},
                headers: {
                    tokenkey: BasicsFactory.getDetails().tokenKey,
                    Page: vm.pageNo,
                    PerPage: vm.perPageItem.value
                }
            };
            ProjectService.projectList(apiObject)
                .then(function(response) {
                        var resHeader = response[2];
                        // console.log(resHeader('Max-Page'));
                        vm.totalCount = vm.perPageItem.value * resHeader('Max-Page');
                        response = response[0];
                        vm.projects = response;
                        (isEmit) && ($scope.$emit('updateProjectList', vm.projects));
                        vm.projects.forEach(function(project) {
                            // console.log('b4 : ', project);
                            var apiObj = {
                                headers: {
                                    TokenKey: BasicsFactory.getDetails().tokenKey
                                },
                                params: {
                                    pinProjectId: project.PINProjectID
                                }
                            };
                            ProjectService.projectDetails(apiObj)
                                .then(function(response) {
                                    console.log('res ', response);
                                    project.details = response[0];
                                });

                            // console.log('ftr : ', project);
                        });
                        // console.log('ProjectResponse : ', response);
                    },
                    function(err) {
                        console.log('ProjectResponse err: ', err);
                    });
        };

        vm.createNewProject = function() {
            vm.projectName = (vm.projectName) ? vm.projectName.trim() : '';
            if (vm.projectName === '') {
                return;
            }
            var cfg = {
                data: {
                    "ProjectName": vm.projectName,
                    "ProjectNumber": ""
                }
            };
            (vm.country) && (cfg.data.CountryName = vm.country.CountryName);
            (vm.state) && (cfg.data.StateName = vm.state.StateName);
            (vm.state) && (cfg.data.StateID = vm.state.StateID);
            ProjectService.createNewProject(cfg)
                .then(
                    function(response) {
                        toaster.pop('success', vm.projectName + ' is successfully created');
                        getProjectList(true);
                        vm.projectName = '';
                    },
                    function(err) {

                    });
        }

        vm.makeItFavourite = function(project) {

            var cfg = {
                params: {
                    pinProjectId: project.PINProjectID,
                    isFavorite: project.IsFavorite
                }
            };
            console.log('Project : ', project, cfg);
            ProjectService.makeItFavourite(cfg)
                .then(
                    function(response) {
                        console.log('Response : ', response);
                    },
                    function(err) {
                        console.log('err : ', err);
                    }
                );
        }

        vm.filterProjectList = function(option) {
            if (option.value === 0) {
                vm.apiObject.params.isFavorite = 0;
            }
            if (option.value === 1) {
                vm.apiObject.params.isFavorite = 1;
            }
            getProjectList();
        }

        vm.searchProject = function() {
            /*if (vm.searchKey.length < 3) {
                return;
            }*/

            vm.searchTimer && clearTimeout(vm.searchTimer);
            vm.searchTimer = setTimeout(function() {
                vm.pageNo = 1;
                vm.apiObject.params.start = vm.searchKey;
                getProjectList();
            }, 1000);
        }

        vm.changePerPageCount = function(item) {
            vm.apiObject.headers.PerPage = item.value;
            vm.pageNo = 1;
            vm.apiObject.headers.Page = 1;
            getProjectList();
        }

        vm.pageChanged = function() {
            vm.apiObject.headers.Page = vm.pageNo;
            getProjectList();
        }

        vm.selectProject = function(project) {

            BasicsFactory.setProjectDetails({
                PINProjectID: project.PINProjectID,
                projectName: project.ProjectName
            })
            $scope.$emit('changeSelectedProject', project);
            $state.go('authenticated.layout.project.upload-view');
        }

        vm.editProject = function(project, idx) {
            var modalInstance = $uibModal
                .open({
                    template: require('../templates/update-project.html'),
                    controller: "projectUpdateCtrl as vm",
                    size: "lg",
                    resolve: {
                        Project: function() {
                            return project;
                        },
                        CountryList: function() {
                            return vm.countryList;
                        },
                        getStateList: function() {
                            return vm.getStateList;
                        },
                        StateList: function() {
                            return vm.stateList;
                        }
                    }
                });
            modalInstance.result.then(function(data) {
                console.log('success', data, idx);
                vm.projects[idx].details = data.project;
                console.log('vm.projects', vm.projects);
                vm.country = data.country;
                vm.state = data.state;
            }, function(data) {});


        }

    }
];
