module.exports = [
    '$state',
    '$rootScope',
    '$scope',
    '$state',
    'LoginService',
    'BasicsFactory',
    function($state, $rootScope, $scope, $state, LoginService, BasicsFactory) {
        console.log('upload controller', $scope);
        var vm = this;

        vm.showComponent = false;

        var basics = BasicsFactory.getDetails();
        var setProjectId = function() {
            var projectData = {};
            projectData.params = {
                mode: 1
            }
            LoginService.projectList(projectData).then(function(response) {
                var data = response[0];
                console.log('Project List response: ', data);
                BasicsFactory.setPINProjectID(data[data.length - 1].PINProjectID);
                BasicsFactory.setProjectName(data[data.length - 1].ProjectName);
                vm.showComponent = true;
            }, function(error) {
                console.log('Project List Error', error);
                $state.go('authenticated.login');
            })
        }
        setProjectId();
    }
]
