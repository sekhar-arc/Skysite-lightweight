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
            console.log('Edit Contact : ', $state.current.isEdit, $stateParams);

            $scope.value = '1';
            $scope.$emit('active:button', 'AddContact');
            getCountryList();
            getProjectRoleList();
            vm.occupationList = Occupation;
            vm.occupationList["0"] = "Select Occupation";
            vm.occupation = "0";

            vm.businessList = Business;
            vm.businessList["0"] = "Select Business";
            vm.business = "0";
        };

        function getCountryList() {
            var apiObject = {
                headers: {
                    TokenKey: BasicsFactory.getDetails().tokenKey
                },
                params: {
                    action: 1 //country
                }
            };
            ProjectService.locationList(apiObject)
                .then(function(response) {

                    response = response[0];
                    vm.countryList = response;
                    vm.countryList = [{ 'CountryName': 'Select Country' }].concat(vm.countryList);
                    vm.country = vm.countryList[0];
                    if ($state.current.isEdit) {
                        vm.id = $stateParams.id;
                        fetchContactDetails(vm.id);
                    }
                    console.log(" vm.country : ", vm.country);
                    vm.stateList = [{ 'StateName': 'Select State' }];
                    vm.getStateList();
                }, function() {});
        };

        vm.getStateList = function() {
            console.log("getStateList : ", vm.country);
            vm.stateList = [{ 'StateName': 'Select State' }];
            if (!vm.country.CountryID) {
                vm.stateList = [{ 'StateName': 'Select State' }];
                vm.state = vm.stateList[0];
                return;
            }
            var country = vm.country;

            var apiObject = {
                headers: {
                    TokenKey: BasicsFactory.getDetails().tokenKey
                },
                params: {
                    action: 2, //state
                    countryId: country.CountryID
                }
            };
            ProjectService.locationList(apiObject)
                .then(function(response) {

                    response = response[0];
                    vm.stateList = response;
                    vm.stateList = [{ 'StateName': 'Select State' }].concat(vm.stateList);
                    vm.state = (vm.state) ?
                        findSelectedOption('State', vm.stateList, vm.state) :
                        vm.stateList[0];
                }, function() {});
        };

        function findSelectedOption(string, array, value) {
            console.log("findSelectedOption : ", string, array, value);
            var targetValue;
            if (string === "Country") {
                targetValue = array.find(function(each) {
                    return (each.CountryID === value.CountryID);
                });
            } else if (string === "State") {
                targetValue = array.find(function(each) {
                    return (each.StateID === value.StateID);
                });
            }
            return targetValue;
        };

        function getProjectRoleList() {
            var apiObject = {
                headers: {
                    TokenKey: BasicsFactory.getDetails().tokenKey
                }
            };
            ProjectService.projectRoleList(apiObject)
                .then(function(response) {

                    response = response[0];
                    vm.roleList = response;
                    vm.roleList = [{ 'CodeDesc': 'Select Project Role' }].concat(vm.roleList);
                    vm.role = vm.roleList[0];
                }, function() {});
        };

        $scope.submitForm = function() {

            var data = {
                FirstName: vm.firstName,
                LastName: vm.lastName,
                Notes: vm.title,
                CompanyName: vm.company,
                Email: vm.email,
                PhoneWork: vm.phone,
                Address1: vm.address,
                City: vm.city,
                ZipCode: vm.pin,
                PreferredNTFNMedia: 1,
                LicenseUserType: 0
            };
            if (vm.country.CountryID)
                data.Country = vm.country;
            if (vm.state.StateID)
                data.State = vm.state;
            if (vm.state.StateID)
                data.Business = vm.business;
            if (vm.state.StateID)
                data.Occupation = vm.occupation;

            var apiObject = {
                headers: {
                    TokenKey: BasicsFactory.getDetails().tokenKey,
                    "Content-Type": "application/json"
                },
                data: data
            };

            console.log(" apiObject : ", apiObject);
            if (vm.id) {
                apiObject.data.PWContactID = vm.id;
                ContactService.updateContact(apiObject)
                    .then(function(response) {
                        toaster.pop("sucess", "Contact Addition", vm.firstName + " has been successfully updated.");
                        vm.gotoContactList();
                    }, function() {})
                    .finally(function() {});
            } else {
                ContactService.createContact(apiObject)
                    .then(function(response) {
                        toaster.pop("sucess", "Contact Addition", vm.firstName + " has been successfully added to your Contact List.");
                        vm.gotoContactList();
                    }, function() {})
                    .finally(function() {});
            }
        };

        vm.gotoContactList = function() {
            $state.go("authenticated.layout.contact.thumbnail.details");
        };

        function fetchContactDetails(id) {
            ContactService.contactDetails({
                    headers: {
                        TokenKey: BasicsFactory.getDetails().tokenKey
                    },
                    params: {
                        contactId: id
                    }
                })
                .then(function(response) {
                    response = response[0];
                    vm.selectContactDetails = response;
                    mapData();
                });
        };

        function mapData() {
            vm.firstName = vm.selectContactDetails.FirstName;
            vm.lastName = vm.selectContactDetails.LastName;
            vm.title = vm.selectContactDetails.Notes;
            vm.company = vm.selectContactDetails.CompanyName;
            vm.email = vm.selectContactDetails.Email;
            vm.phone = vm.selectContactDetails.PhoneWork;
            vm.address = vm.selectContactDetails.Address1;
            vm.city = vm.selectContactDetails.City;
            vm.pin = vm.selectContactDetails.ZipCode;
            if (vm.selectContactDetails.Country) {
                vm.country = findSelectedOption('Country', vm.countryList, vm.selectContactDetails.Country);
                console.log('bf4 statelist : ', vm.country)
                vm.state = vm.selectContactDetails.State;
                vm.getStateList();
            }
            vm.occupation = vm.selectContactDetails.Occupation;
            // }, 0);
        }

    }
];
