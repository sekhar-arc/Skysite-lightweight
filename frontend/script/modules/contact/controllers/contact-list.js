'use strict';

module.exports = [
    '$rootScope',
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
        $timeout
    ) {
        var vm = this;

        vm.init = function() {
            $scope.$emit('clearProjectDetails');
            vm.doFirstCall = true;
            vm.alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            vm.formattedList = [];

            vm.getContactList();
            $scope.$on('refresh:contact-group-list:searchKey', vm.getContactList);
        };

        vm.getContactList = function(event, searchAction) {
            (searchAction) &&
            (($scope.$parent.vm.searchIsInProgress = true) &&
                (vm.doFirstCall = true));

            ContactService.contactList({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey,
                        Page: 1,
                        PerPage: 100
                    },
                    params: {
                        start: $scope.$parent.vm.searchKey.trim(),
                        orderBy: 0
                    }
                })
                .then(function(response) {
                    if (searchAction &&
                        ($scope.$parent.vm.searchKey.trim().length)) {
                        vm.Page = 1;
                        vm.contacts = response[0];
                    } else {
                        vm.originalContacts = response[0];
                        vm.maxContactPage = Math.ceil(vm.originalContacts.length / vm.perPageCount);
                        vm.contacts = vm.originalContacts.slice(((vm.Page - 1) * vm.perPageCount), (vm.Page * vm.perPageCount));

                    }
                    getGroupList(searchAction);
                });
        };

        function getGroupList(searchAction) {
            ContactService.groupList({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey,
                        Page: 1,
                        PerPage: 100
                    },
                    params: {
                        start: $scope.$parent.vm.searchKey.trim()
                    }
                })
                .then(function(response) {
                    if (searchAction &&
                        ($scope.$parent.vm.searchKey.trim().length)) {
                        vm.Page = 1;
                        vm.groups = response[0];
                        vm.groups.forEach(function(each) {
                            each.isGroup = true;
                            getMemberList(each, true);
                        });
                    } else {
                        vm.originalGroups = response[0];
                        vm.maxGroupPage = Math.ceil(vm.originalGroups.length / vm.perPageCount);
                        vm.groups = vm.originalGroups.slice(((vm.Page - 1) * vm.perPageCount), (vm.Page * vm.perPageCount));
                        vm.originalGroups.forEach(function(each) {
                            each.isGroup = true;
                            getMemberList(each, true);
                        });
                    }


                    vm.populateFormateArray(searchAction);

                })
                .finally(function() {

                });
        };

        vm.populateFormateArray = function(searchAction) {

            if (searchAction || !vm.mergedList) {
                vm.mergedList = [];
            }


            vm.mergedList = vm.mergedList.concat(sortAlphabetically(vm.contacts.concat(vm.groups)));

            vm.formattedList = formateArray(vm.mergedList);


            // if (vm.formattedList.length) {
            //     vm.formattedList.forEach(function(contactGroup) {
            //         if (contactGroup.contacts.length && vm.doFirstCall) {
            //             
            //             vm.doFirstCall = false;
            //             vm.getInfo(contactGroup.contacts[0]);
            //         }
            //     });
            // }


            (searchAction) &&
            ($scope.$parent.vm.searchIsInProgress = false);

            $scope.$parent.vm.searchedList = (searchAction &&
                ($scope.$parent.vm.searchKey.trim().length));
            vm.isCall = true;
            // $scope.$apply();


        };

        function getMemberList(each, allMember) {

            ContactService.groupMembersList({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey,
                        Page: (allMember) ? 1 : vm.pageNo,
                        PerPage: (allMember) ? 100 : vm.perPageItem.value
                    },
                    params: {
                        groupId: each.PWGroupID
                    }
                })
                .then(function(response) {

                    response = response[0];
                    (allMember) &&
                    (each.membersCount = response.length) ||
                    (each.members = response);

                    if (vm.doFirstCall) {
                        vm.getInfo(each);
                        vm.doFirstCall = false;
                    }
                });
        };

        vm.getInfo = function(contact) {
            if ($state.current.name === "authenticated.layout.contact.thumbnail.details") {
                $state.go("authenticated.layout.contact.thumbnail.details");
                $scope.$broadcast('get:contact:info', contact);
            }
            vm.selected = contact;
        };

        function sortAlphabetically(array) {
            return array.sort(function(a, b) {
                var aProp = a.ContactName || a.GroupName,
                    bProp = b.ContactName || b.GroupName;
                if (aProp < bProp) return -1;
                if (aProp > bProp) return 1;
                return 0;
            })
        };

        function formateArray(array) {
            // 
            var formattedArray = vm.alphabets.map(function(each) {
                return {
                    alphabet: each
                }
            });

            formattedArray.forEach(function(each) {
                var regEx = "^" + each.alphabet + "(.)*";
                regEx = new RegExp(regEx, "i");
                each.contacts = array.filter(function(element) {
                    // 
                    return regEx.test(element.ContactName || element.GroupName);
                });
            });
            return formattedArray;
        };

        vm.scrollAlphabetList = function(alphabet, index) {
            if ($("." + alphabet).position()) {
                $('.list .nano-content').animate({
                        scrollTop: Math.abs($(".A").position().top) + $("." + alphabet).position().top
                    },
                    'slow');
            }

        };
    }
];
