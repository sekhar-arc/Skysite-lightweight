module.exports = ['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        console.log('Project router');
        $stateProvider
            .state('authenticated.layout.dashboard', {
                url: '^/dashboard',
                type: 'authenticated',
                stateName: 'Dashboard',
                template: require('../templates/dashboard.html'),
                controller: 'dashboardCtrl as vm'
            });

        // $urlRouterProvider.when('/project/', '/project/list');
        // $urlRouterProvider.when('/project', '/project/list');
    }
];
