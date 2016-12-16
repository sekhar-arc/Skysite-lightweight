'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    'BasicsFactory',
    '$state',
    'toaster',
    'ContactService',
    'ProjectService',
    'Occupation',
    'Business',
    '$timeout',
    '$stateParams',
    function(
        $rootScope,
        $scope,
        BasicsFactory,
        $state,
        toaster,
        ContactService,
        ProjectService,
        Occupation,
        Business,
        $timeout,
        $stateParams
    ) {
        var vm = this;

        vm.init = function() {
            console.log('Edit group : ', $state.current.isEdit, $stateParams);
            vm.members = [];
            $scope.$emit('active:button', 'AddGroup');
            vm.occupationList = Occupation;
            vm.occupationList["0"] = "Select Occupation";
            vm.occupation = "0";
            vm.searchKey = '';
            vm.getContactList();
        };

        vm.getContactList = function(event, searchAction) {
            ContactService.contactList({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey,
                        Page: 1,
                        PerPage: 100
                    },
                    params: {
                        start: vm.searchKey.trim(),
                        orderBy: 0
                    }
                })
                .then(function(response) {
                    vm.contacts = response[0];

                    if ($state.current.isEdit) {
                        vm.id = $stateParams.id;
                        fetchGroupDetails(vm.id);
                    }
                });
        };

        $scope.submitForm = function() {
            console.log('Members : ', vm.members);
            // return;
            var data = {
                GroupName: vm.groupName,
                Notes: vm.description
            };
            /* if (vm.country.CountryID)
                data.Country = vm.country;
            if (vm.state.StateID)
                data.State = vm.state;
            if (vm.state.StateID)
                data.Business = vm.business;
            if (vm.state.StateID)
                data.Occupation = vm.occupation;
*/
            var apiObject = {
                headers: {
                    TokenKey: BasicsFactory.getDetails().tokenKey,
                    "Content-Type": "application/json"
                },
                data: data
            };

            console.log(" apiObject : ", apiObject);
            if (vm.id) {
                updateGroup(vm.id, vm.groupName);
            } else {
                ContactService.createGroup(apiObject)
                    .then(function(response) {
                        console.log('Create Group Response', response);
                        response = response[0];
                        updateGroup(response, vm.groupName);
                        // toaster.pop("sucess", "Group Creation", vm.groupName + " has been successfully created.");
                        // vm.gotoContactList();
                    }, function() {})
                    .finally(function() {});
            }
        };

        function updateGroup(GroupId, groupName) {
            console.log("GroupId, groupName : ", GroupId, groupName);
            /*if (!vm.members.length) {
                toaster.pop("sucess", "Group Creation", vm.groupName + " has been successfully created.");
                return;
            }*/
            var data = {
                PWGroupID: GroupId,
                GroupName: groupName,
                Status: 1,
                Notes: vm.description
            };

            data.GroupMembersInfo = [];
            if (vm.members.length) {
                vm.members.forEach(function(each) {
                    data.GroupMembersInfo.push({ MemberID: each.PWContactID, "MemberType": 1 })
                });
            }

            var apiObject = {
                headers: {
                    TokenKey: BasicsFactory.getDetails().tokenKey,
                    ModuleId: 1,
                    "Content-Type": "application/json"
                },
                params: {
                    selection: 0
                },
                data: data
            };

            console.log(" apiObject : ", apiObject);

            ContactService.updateGroup(apiObject)
                .then(function(response) {
                    console.log('Update Group Response', response);
                    if (vm.id) {
                         toaster.pop("sucess", "Group Creation", vm.groupName + " has been successfully updated.");
                    } else {
                        toaster.pop("sucess", "Group Creation", vm.groupName + " has been successfully created.");
                    }
                    vm.gotoContactList();
                }, function() {})
                .finally(function() {});
        };

        vm.gotoContactList = function() {
            $state.go("authenticated.layout.contact.thumbnail.details");
        };

        function fetchGroupDetails(id) {
            ContactService.groupDetails({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey
                    },
                    params: {
                        groupId: id
                    }
                })
                .then(function(response) {
                    response = response[0];
                    vm.selectContactDetails = response;
                    getMemberList(vm.selectContactDetails);
                });
        };

        function getMemberList(each) {

            ContactService.groupMembersList({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey,
                        Page: 1,
                        PerPage: 100
                    },
                    params: {
                        groupId: each.PWGroupID
                    }
                })
                .then(function(response) {

                    response = response[0];
                    each.members = response;
                    console.log("vm.selectContactDetails : ", vm.selectContactDetails);
                    mapData();
                });
        };

        function mapData() {
            vm.groupName = vm.selectContactDetails.GroupName;
            vm.groupId = vm.selectContactDetails.PWGroupID;
            // vm.members = vm.selectContactDetails.members;
            vm.description = vm.selectContactDetails.Notes;

            var selectedContacts = [];
            vm.selectContactDetails.members.forEach(function(each) {
                vm.contacts.forEach(function(eachContact) {
                    if (each.ContactDetails.PWContactID === eachContact.PWContactID) {
                        selectedContacts.push(eachContact);
                    }
                });
            });

            vm.members = selectedContacts;
            console.log('--->', vm.selectContactDetails.members, selectedContacts, "<----->", vm.contacts);
        };

    }
];
