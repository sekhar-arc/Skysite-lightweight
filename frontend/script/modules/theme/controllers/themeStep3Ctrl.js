'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    'BasicsFactory',
    '$state',
    'ThemeFactory',
    function(
        $rootScope,
        $scope,
        BasicsFactory,
        $state,
        ThemeFactory
    ) {
        var vm = this;
        vm.elements = [];
        $rootScope.customTemplateStep = 2;

        $scope.dragTopControlListeners = {
            accept: function(sourceItemHandleScope, destSortableScope) {
                return boolean
            }, //override to determine drag is allowed or not. default is true.
            itemMoved: function(event) {},
            orderChanged: function(event) {},
            clone: true, //optional param for clone feature.
            allowDuplicates: false //optional param allows duplicates to be dropped.
        };

        $scope.dragLeftControlListeners = {
            accept: function(sourceItemHandleScope, destSortableScope) {
                return boolean
            }, //override to determine drag is allowed or not. default is true.
            itemMoved: function(event) {},
            orderChanged: function(event) {},
            clone: true, //optional param for clone feature.
            allowDuplicates: false //optional param allows duplicates to be dropped.
        };

        function saveState() {
            ThemeFactory.elements(vm.elements);
            ThemeFactory.topElements(vm.topElements);
            ThemeFactory.bottomElements(vm.bottomElements);
            ThemeFactory.leftElements(vm.leftElements);
            ThemeFactory.rightElements(vm.rightElements);
        }

        vm.init = function() {
            vm.elements = [{
                'name': 'Dashboard',
                'icon': './resources/dashboard-menu.png'
            }, {
                'name': 'Project',
                'icon': './resources/projects-menu.png'
            }, {
                'name': 'Contact',
                'icon': './resources/scontacts-menu.png'
            }, {
                'name': 'Messages',
                'icon': './resources/message-menu.png'
            }, {
                'name': 'Notification',
                'icon': './resources/notification-menu.png'
            }];
            vm.topElements = [];
            vm.bottomElements = [];
            vm.leftElements = [];
            vm.rightElements = [];

            if (ThemeFactory.topElements().length || ThemeFactory.bottomElements().length || ThemeFactory.leftElements().length || ThemeFactory.rightElements().length) {
                vm.elements = [];
            }
            if (ThemeFactory.elements().length) {
                vm.elements = ThemeFactory.elements();
            }
            if (ThemeFactory.topElements().length) {
                vm.topElements = ThemeFactory.topElements();
            }
            if (ThemeFactory.bottomElements().length) {
                vm.bottomElements = ThemeFactory.bottomElements();
            }
            if (ThemeFactory.leftElements().length) {
                vm.leftElements = ThemeFactory.leftElements();
            }
            if (ThemeFactory.rightElements().length) {
                vm.rightElements = ThemeFactory.rightElements();
            }
            saveState();
        }

        vm.elementDropped = function(data, to) {
            var idx;
            if (data.pos === to) {
                //Do nothing
            } else {
                if (data.pos === 'top') {
                    idx = vm.topElements.indexOf(data.data);
                    vm.topElements.splice(idx, 1);
                } else if (data.pos === 'center') {
                    idx = vm.elements.indexOf(data.data);
                    vm.elements.splice(idx, 1);
                } else if (data.pos === 'bottom') {
                    idx = vm.bottomElements.indexOf(data.data);
                    vm.bottomElements.splice(idx, 1);
                } else if (data.pos === 'right') {
                    idx = vm.rightElements.indexOf(data.data);
                    vm.rightElements.splice(idx, 1);
                } else if (data.pos === 'left') {
                    idx = vm.leftElements.indexOf(data.data);
                    vm.leftElements.splice(idx, 1);
                }
                if (to === 'top') {
                    if (vm.topElements.indexOf(data.data) === -1) {
                        vm.topElements.push(data.data);
                    }
                } else if (to === 'left') {
                    if (vm.leftElements.indexOf(data.data) === -1) {
                        vm.leftElements.push(data.data);
                    }
                } else if (to === 'center') {
                    vm.elements.push(data.data);
                } else if (to === 'right') {
                    if (vm.rightElements.indexOf(data.data) === -1) {
                        vm.rightElements.push(data.data);
                    }
                } else if (to === 'bottom') {
                    if (vm.bottomElements.indexOf(data.data) === -1) {
                        vm.bottomElements.push(data.data);
                    }
                }

            }
        }
        vm.nextstep = function() {
            saveState();
            $state.go('authenticated.theme.step4');
        }

    }
];
