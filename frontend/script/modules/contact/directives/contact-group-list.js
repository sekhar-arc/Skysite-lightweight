'use strict';

module.exports = [
    'BasicsFactory',
    '$state',
    'toaster',
    'ContactService',
    '$timeout',
    function(
        BasicsFactory,
        $state,
        toaster,
        ContactService,
        $timeout
    ) {
        return {
            restrict: 'EA',
            template: require('./../templates/contact-group-list.html'),
            scope: false,
            link: function(scope, element) {
                scope.showMore = function() {

                    if (scope.$parent.vm.searchKey) {
                        scope.vm.isCall = true;
                        return;
                    }
                    // if (scope.vm.Page < scope.vm.maxContactPage || scope.vm.Page < scope.vm.maxGroupPage) {
                    scope.vm.Page++;
                    // }

                    // scope.vm.getContactList();
                    if (scope.vm.Page <= scope.vm.maxContactPage) {
                        scope.vm.contacts = scope.vm.originalContacts.slice(((scope.vm.Page - 1) * scope.vm.perPageCount), (scope.vm.Page * scope.vm.perPageCount));
                    } else {
                        scope.vm.contacts = [];
                    }
                    if (scope.vm.Page <= scope.vm.maxGroupPage) {
                        scope.vm.groups = scope.vm.originalGroups.slice(((scope.vm.Page - 1) * scope.vm.perPageCount), (scope.vm.Page * scope.vm.perPageCount));
                    } else {
                        scope.vm.groups = [];
                    }
                    if (scope.vm.Page <= scope.vm.maxContactPage || scope.vm.Page <= scope.vm.maxGroupPage) {
                        $timeout(function() {
                            scope.vm.populateFormateArray();
                        }, 3000);
                    } else {
                        scope.vm.isCall = true;
                    }
                };
            },

            controller: ['$rootScope',
                '$scope',
                'BasicsFactory',
                '$state',
                'toaster',
                'ContactService',
                '$timeout',
                function(
                    $rootScope,
                    $scope,
                    BasicsFactory,
                    $state,
                    toaster,
                    ContactService,
                    $timeout) {

                    var vm = $scope.vm;
                    

                    vm.init = function() {
                        

                        vm.Page = 1;
                        vm.perPageCount = 5;
                    }

                }
            ]
        };
    }
];
