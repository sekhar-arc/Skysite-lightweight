module.exports = [
    '$state',
    '$rootScope',
    '$scope',
    '$window',
    '$state',
    'LoginService',
    'BasicsFactory',
    'CustomTemplateService',
    'toaster',
    'ThemeFactory',
    function($state, $rootScope, $scope, $window, $state, LoginService, BasicsFactory, CustomTemplateService, toaster, ThemeFactory) {
        var vm = this,
            loginData = {};
        vm.user = {};
        vm.remember = false;

        function init() {
            var user = $window.localStorage.getItem('userDetailsData');
            console.log('user', user);
            if (user) { //Details is remembered
                vm.user = JSON.parse(user);
                vm.remember = true;
            } else {
                vm.user = {
                    email: '',
                    password: ''
                }
            }
            loginData.headers = {
                'Decrypt': false,
                'Content-type': 'application/json',
                'Access-Control-Expose-Headers': 'TokenKey'
            }
        }
        vm.doLogin = function() {
            if (vm.remember) {
                $window.localStorage.setItem('userDetailsData', JSON.stringify(vm.user));
            } else {
                $window.localStorage.removeItem('userDetailsData');
            }
            loginData.headers.LoginId = vm.user.email;
            loginData.headers.Password = vm.user.password;

            LoginService.doLogin(loginData).then(function(response) {
                console.log('Login response : ', response[0]);
                window.test = response[2];

                /*BasicsFactory.setTokenKey(response[2]('TokenKey'));
                BasicsFactory.setPWAccountID(response[0].PWAccountID);
                BasicsFactory.setPersonalDetails(response[0]);*/

                BasicsFactory.setUserDetails({
                    tokenKey: response[2]('TokenKey'),
                    PWAccountID: response[0].PWAccountID,
                    personalDetails: response[0]
                });
                var customData = {};
                customData.params = {
                    PWUserId: response[0].PWAccountID
                }
                CustomTemplateService.checkFirstLogin(customData).then(function(response) {

                    var firstLogin = response[0].data;
                    console.log('custom template check first login', firstLogin);
                    if ($rootScope.prevState) {
                        console.log('$rootScope.prevState : ', $rootScope.prevState);
                        $state.go($rootScope.prevState);
                        $rootScope.prevState = undefined;
                    } else {
                        // $state.go('authenticated.layout.dashboard');

                        if (firstLogin.firstTimeLogin) { //It means the user is logging in for the first time

                            $state.go('authenticated.theme.step1');
                        } else {
                            //Set Theme details
                            ThemeFactory.topElements(firstLogin.templateConfig.elements.top);
                            ThemeFactory.leftElements(firstLogin.templateConfig.elements.left);
                            ThemeFactory.elements(firstLogin.templateConfig.elements.center);
                            ThemeFactory.rightElements(firstLogin.templateConfig.elements.right);
                            ThemeFactory.bottomElements(firstLogin.templateConfig.elements.bottom);
                            $state.go('authenticated.layout.dashboard');
                        }

                    }
                }, function(error) {
                    console.log('Custom template error', error);
                    $state.go('authenticated.layout.dashboard');
                }).finally(function() {

                })

                // $state.go('authenticated.project.list');
                // $state.go('authenticated.upload');

                toaster.pop('success', 'You have been logged in successfully.');
            }, function(error) {
                console.log('Login error', error);
                toaster.pop('error', error.ErrorMessage);
            })
        }

        init();
        // vm.doLogin();
    }
]
