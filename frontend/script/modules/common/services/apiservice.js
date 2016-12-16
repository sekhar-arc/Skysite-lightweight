'use strict';

module.exports = [
    '$q',
    '$http',
    '$state',
    'toaster',
    'BasicsFactory',
    '$rootScope',
    function(
        $q,
        $http,
        $state,
        toaster,
        BasicsFactory,
        $rootScope
    ) {
        return {
            apiRequest: function apiRequest(ApiObj) {
                var deffered = $q.defer();
                $http({
                        method: ApiObj.method || 'GET',
                        url: ApiObj.url || '',
                        headers: ApiObj.headers || {},
                        params: ApiObj.params || {},
                        data: ApiObj.data || {}
                    })
                    .success(function(data, status) {
                        // console.log('RESPONSE : ', response);
                        if (arguments[1] === 200) {
                            deffered.resolve(arguments);
                        } else {
                            deffered.reject(arguments);
                        }
                    })
                    .error(function(error) {
                        console.log('Error : ', error);
                        if (error && error.ErrorCode && (error.ErrorCode === 1 || error.ErrorCode === 2)) {
                            BasicsFactory.clearUserDetails();
                            (!$rootScope.prevState) &&
                            ($rootScope.prevState = $state.current);
                            $state.go('public.login');
                        } else {
                            deffered.reject(error);
                            toaster.pop("error", error.ErrorMessage);
                        }
                    });
                return deffered.promise;
            }
        };
    }
];
