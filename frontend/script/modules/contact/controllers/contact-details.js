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

            $scope.$emit('active:button', 'Details');
            vm.notAvailable = "Not available";
            /*pagination*/
            vm.pageNo = 1;
            vm.perPageItemList = [{
                value: 15,
                text: "15 per page"
            }, {
                value: 25,
                text: "25 per page"
            }, {
                value: 50,
                text: "50 per page"
            }, {
                value: 100,
                text: "100 per page"
            }];
            vm.perPageItem = vm.perPageItemList[0];
            /**/

            vm.gridOptions = {
                id: 'customize-grid',
                rowHeight: 60,
                data: 'vm.selectContactDetails.members',
                enableColumnResizing: true,
                // rowTemplate: require('../templates/rowTemplate.html'),
                columnDefs: [

                    {
                        field: 'ContactDetails.ContactName',
                        displayName: 'Name',
                        minWidth: 200,
                        width: "50%",
                        maxWidth: 400,
                        pinnedLeft: true,
                        cellClass: 'name-cell custom-cell',
                        cellTemplate: require('../templates/member-name-cell.html'),
                        enableSorting: true
                    }, {
                        field: 'ContactDetails.Email',
                        displayName: 'Email',
                        width: '50%',
                        maxWidth: 500,
                        // minWidth: "15%",
                        cellClass: 'title-cell custom-cell',
                        enableSorting: false
                    },
                    // {
                    //     field: 'RevisionDate',
                    //     displayName: 'Date',
                    //     minwidth: 100,
                    //     width: 150,
                    //     maxWidth: 200,
                    //     type: 'date',
                    //     cellFilter: 'date:\'dd-MMM-yyyy\'',
                    //     cellClass: 'date-cell custom-cell',
                    //     enableSorting: false
                    // }, {
                    //     field: 'Filesize',
                    //     displayName: 'Size',
                    //     maxWidth: 150,
                    //     minWidth: 70,
                    //     cellFilter: 'bytes:this',
                    //     enableSorting: false

                    // }, {
                    //     field: 'DocumentDesc',
                    //     displayName: 'Description',
                    //     width: 300,
                    //     maxWidth: 450,
                    //     minWidth: 200,
                    //     enableSorting: false

                    // }, {
                    //     field: 'RevisionNumber',
                    //     displayName: 'Version',
                    //     maxWidth: 150,
                    //     minWidth: 70,
                    //     enableSorting: false

                    // }
                ]
            };

            $scope.$on('get:contact:info', vm.getInfo);
            vm.getInfo("", $scope.$parent.vm.selected);
        };

        vm.getInfo = function(event, contact) {

            vm.selected = contact;
            if (!vm.selected) {
                return;
            }
            if (contact.isGroup) {
                getGroupDetails(contact);
                vm.selectContactDetails = { membersCount: contact.membersCount };
                vm.isGroupSelected = true;
            } else {
                getContactDetails(contact);
                vm.isGroupSelected = false;
            }
        };

        function getContactDetails(each) {
            ContactService.contactDetails({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey
                    },
                    params: {
                        contactId: each.PWContactID
                    }
                })
                .then(function(response) {
                    response = response[0];
                    vm.selectContactDetails = response;
                });
        };

        function getGroupDetails(each) {
            ContactService.groupDetails({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey
                    },
                    params: {
                        groupId: each.PWGroupID
                    }
                })
                .then(function(response) {
                    response = response[0];
                    angular.extend(vm.selectContactDetails, response);

                    getMemberList(vm.selectContactDetails);
                });
        };

        function getMemberList(each) {

            ContactService.groupMembersList({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey,
                        Page: vm.pageNo,
                        PerPage: vm.perPageItem.value
                    },
                    params: {
                        groupId: each.PWGroupID
                    }
                })
                .then(function(response) {

                    response = response[0];
                    each.members = response;

                });
        };

        vm.pageChanged = function() {
            getMemberList(vm.selectContactDetails);
        };

        vm.changePerPageCount = function(item) {

            // if (item.value !== vm.perPageItem.value) {
            vm.pageNo = 1;
            getMemberList(vm.selectContactDetails);
            // }
        };
    }
];
