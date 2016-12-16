'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    'BasicsFactory',
    'ThemeFactory',
    '$state',
    'CustomTemplateService',
    function(
        $rootScope,
        $scope,
        BasicsFactory,
        ThemeFactory,
        $state,
        CustomTemplateService
    ) {
        var vm = this;
        $rootScope.customTemplateStep = 3;

        vm.init = function() {
            vm.themeName = "";

        }

        vm.saveDetails = function() {
            var templateConfig = ThemeFactory.getDetails(),
                templateData = {};
            vm.themeName = vm.themeName.trim();
            templateData.data = {
                PWUserId: BasicsFactory.getDetails().PWAccountID,
                templateConfig: templateConfig
            };
            if (Object.keys(templateConfig.background).length) {
                CustomTemplateService.addCustomTemplate(templateData).then(function(response) {
                    console.log('Success', response[0]);
                    $state.go('authenticated.layout.dashboard');
                }, function(error) {
                    console.log('Custom template error', error);
                })
            }
        }

    }
];
