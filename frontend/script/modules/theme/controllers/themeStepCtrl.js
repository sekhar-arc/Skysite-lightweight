'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    'BasicsFactory',
    '$state',
    function(
        $rootScope,
        $scope,
        BasicsFactory,
        $state
    ) {
        var vm = this;
        $scope.customTemplateBreadcrumb = [{
            title: 'Theme Color',
            link: 'authenticated.theme.step2'
        }, {
            title: 'Arrange Panels',
            link: 'authenticated.theme.step3'
        }, {
            title: 'Save',
            link: 'authenticated.theme.step4'
        }]

        function init() {}

        vm.goToStep = function(breadcrumb) {
            $state.go(breadcrumb.link);
        }

    }
];
