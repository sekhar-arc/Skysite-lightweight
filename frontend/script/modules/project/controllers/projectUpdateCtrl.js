'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    'BasicsFactory',
    '$state',
    'ProjectService',
    'toaster',
    '$timeout',
    '$uibModalInstance',
    'Project',
    'CountryList',
    'getStateList',
    'StateList',
    function(
        $rootScope,
        $scope,
        BasicsFactory,
        $state,
        ProjectService,
        toaster,
        $timeout,
        $uibModalInstance,
        Project,
        CountryList,
        getStateList,
        StateList
    ) {
        var vm = this;

        vm.init = function() {
            //Date options
            $scope.today = function() {
                $scope.dt = new Date();
            };
            $scope.property = {
                opened: false
            };
            $scope.today();
            $scope.open = function(property) {
                console.log('property.opened', property);
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
            //Date options

            vm.project = Project.details;
            vm.countryList = CountryList;
            vm.stateList = StateList;
            vm.getStateList = getStateList;
            vm.country = vm.countryList[0];
            vm.state = vm.stateList[0];
            console.log('vm.project', vm.project);
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.editProject = function() {
            var projectDetails = angular.copy(vm.project);
            //insert country and state
            projectDetails.CountryName = vm.country.CountryName;
            projectDetails.StateName = vm.state.StateName;
            projectDetails.StateID = vm.state.StateID;
            //insert city and zip
            projectDetails.city = projectDetails.City;
            projectDetails.zip = projectDetails.Zip;
            delete projectDetails.ProjectOwner;

            ProjectService.editProject({
                data: projectDetails
            }).then(function(response) {
                console.log('Success', response);
                console.log('Project Details', projectDetails);
                $uibModalInstance.close({
                    project: projectDetails,
                    country: vm.country,
                    state: vm.state
                });
            }, function(error) {
                console.log('Error', error);
            })


        }

    }
];
