'use strict';

module.exports = [
    '$window',
    '$rootScope',
    '$scope',
    'BasicsFactory',
    '$state',
    'ProjectService',
    'ThemeFactory',
    function(
        $window,
        $rootScope,
        $scope,
        BasicsFactory,
        $state,
        ProjectService,
        ThemeFactory
    ) {
        var vm = this;
        var topElements,
            leftElements;

        vm.init = function() {

            // getProjectList();
            var baseData = BasicsFactory.getDetails(),
                project = {
                    PINProjectID: baseData.PINProjectID,
                    ProjectName: baseData.projectName
                };
            $scope.userName = baseData.personalDetails.FirstName + ' ' + baseData.personalDetails.LastName;

            vm.selectedProject = (project.PINProjectID) ? project : { ProjectName: "Select Project" };


            topElements = ThemeFactory.topElements();


            leftElements = ThemeFactory.leftElements();



            //side Menu Options
            // vm.sideMenuOptions = [{
            //     name: "Dashboard",
            //     badge: 0,
            //     icon: "./resources/dashboard-menu.png",
            //     // active: true,
            //     state: "authenticated.layout.dashboard"
            // }, {
            //     name: "Projects",
            //     badge: 0,
            //     icon: "./resources/projects-menu.png",
            //     state: "authenticated.layout.project.list"
            // }, {
            //     name: "Contact",
            //     badge: 0,
            //     icon: "./resources/scontacts-menu.png",
            //     state: "authenticated.layout.contact.thumbnail"
            // }, {
            //     name: "Message",
            //     badge: 1,
            //     icon: "./resources/message-menu.png",
            //     state: ""
            // }, {
            //     name: "Message Board",
            //     badge: 20,
            //     icon: "./resources/message-board-menu.png",
            //     state: ""
            // }, {
            //     name: "Notifications",
            //     badge: 99,
            //     icon: "./resources/notification-menu.png",
            //     state: ""
            // }];

            //Header Menu options
            // vm.headerMenuOption = [{
            //     name: "Notifications",
            //     badge: 99,
            //     icon: "./resources/notification2.png",
            //     state: "",
            //     class: "notification"
            // }, {
            //     name: "Message",
            //     badge: 1,
            //     icon: "./resources/meg.png",
            //     state: "",
            //     class: "message"
            // }, {
            //     name: "Dashboard",
            //     badge: 0,
            //     state: "authenticated.layout.dashboard",
            //     class: "dashboard"
            // }, {
            //     name: "Contact",
            //     badge: 0,
            //     state: "authenticated.layout.contact.thumbnail",
            //     class: "contact"
            // }];
            topElements.forEach(function(val, idx) {
                val.class = "dashboard";
                if (idx === 0) {
                    val.active = true;
                }
            })
            vm.headerMenuOption = topElements;
            vm.sideMenuOptions = leftElements;
            console.log('headerMenuOption', vm.headerMenuOption);


            // vm.changeActiveOption();
            $rootScope.$on('ActiveMenuOption', vm.changeActiveOption);
            $scope.$on('clearProjectDetails', vm.clearProjectDetails);
            $scope.$on('changeSelectedProject', changeSelectedProject);
            $scope.$on('updateProjectList', setNewProjectList);
            vm.isCollapsed = (window.innerWidth < 1140);
            vm.isVisible = !(window.innerWidth < 1080);
            $(window).on('resize', function() {
                vm.isCollapsed = (window.innerWidth < 1140);
                vm.isVisible = !(window.innerWidth < 1080);
                $scope.$apply();
            });
        }

        vm.clearProjectDetails = function() {
            console.log("clearProjectDetails ----------->");
            BasicsFactory.clearProjectDetails();
            vm.selectedProject = { ProjectName: "Select Project" };
        }

        vm.changeActiveOption = function(e, state) {
            state = (state) ? state : $state.current;
            vm.sideMenuOptions.forEach(function(each) {

                console.log("State : ", state.stateName, each.name, state.stateName === each.name);
                if (each.name === state.stateName) {
                    each.active = true;
                } else {
                    each.active = false;
                }

            });

            vm.headerMenuOption.forEach(function(each) {

                console.log("State : ", state.stateName, each.name, state.stateName === each.name);
                if (each.name === state.stateName) {
                    each.active = true;
                } else {
                    each.active = false;
                }

            })

        }

        vm.gotoState = function(option) {
            if (option.name.trim() === "Dashboard") {
                $state.go('authenticated.layout.dashboard');
            } else if (option.name.trim() === "Project") {
                $state.go('authenticated.layout.project.list');
            } else if (option.name.trim() === "Contact") {
                $state.go('authenticated.layout.contact.thumbnail.details');
            }
        }

        vm.doLogOut = function() {
            BasicsFactory.clearUserDetails();
            $state.go('public.login');
        }

        vm.selectProject = function(project) {
            console.log("Project : ", project);
            BasicsFactory.setProjectDetails({
                PINProjectID: project.PINProjectID,
                projectName: project.ProjectName
            })

            $state.go('authenticated.layout.project.upload-view', {}, { reload: true });
        }

        function changeSelectedProject(e, project) {
            console.log("changeSelectedProject ------------> ");
            vm.selectProject(project);
            vm.projects.forEach(function(each) {
                if (each.PINProjectID === project.PINProjectID) {
                    vm.selectedProject = each;
                }
            });
        }

        function setNewProjectList(e, projects) {
            vm.projects = projects;
        }

        /* function getProjectList() {
             var apiObject = vm.apiObject || {
                 params: {},
                 headers: {
                     tokenkey: BasicsFactory.getDetails().tokenKey,
                     Page: vm.pageNo || 1,
                     PerPage: 100
                 }
             };
             ProjectService.projectList(apiObject)
                 .then(function(response) {
                         response = response[0];
                         vm.projects = response;
                         // vm.selectedProject = vm.projects[0];
                          vm.projects.forEach(function(project) {
                              console.log('b4 : ', project);
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

                              console.log('ftr : ', project);
                          });
                         console.log('ProjectResponse : ', response);
                     },
                     function(err) {
                         console.log('ProjectResponse err: ', err);
                     });
         };*/
    }
];
