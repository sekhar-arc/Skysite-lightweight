'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    'BasicsFactory',
    '$state',
    'CustomTemplateService',
    function(
        $rootScope,
        $scope,
        BasicsFactory,
        $state,
        CustomTemplateService
    ) {
        var vm = this,
            selectedIndex;
        vm.templates = [];
        vm.test = "abc";
        vm.firstName = BasicsFactory.getDetails().personalDetails.FirstName;
        $rootScope.customTemplateStep = 0;

        vm.init = function() {
            console.log('Inside init');
            selectedIndex = 0;
            CustomTemplateService.getMasterTemplate({}).then(function(response) {
                console.log('Response master template', response);
                vm.templates = response[0].data.masterTemplates;
                vm.templates.forEach(function(val, idx) {
                    val.imgSrc = 'resources/theme/template' + (idx + 1) + '.png';
                })
                vm.selectedTemplate = vm.templates[selectedIndex];
            }, function(error) {
                console.log('Master template error', error);
            })
        }


        vm.selectTemplate = function(idx) {
            vm.templates[selectedIndex].isSelected = false;
            vm.templates[idx].isSelected = true;
            selectedIndex = idx;
            vm.selectedTemplate = vm.templates[selectedIndex];
        }
        vm.createTheme = function() {
            $state.go('authenticated.theme.step2');
        }
        vm.goToDashboard = function() {
            var templateData = {};

            templateData.data = {
                copyMaster: true,
                PWUserId: BasicsFactory.getDetails().PWAccountID,
                defaultTemplateId: vm.selectedTemplate.TemplateId
            }

            CustomTemplateService.addCustomTemplate(templateData).then(function(response) {
                console.log('Success', response[0]);
                $state.go('authenticated.layout.dashboard');
            }, function(error) {
                console.log('Custom template error', error);
            })
        }

    }
];
