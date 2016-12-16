module.exports = ['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        console.log('Project router');
        $stateProvider
            .state('authenticated.layout.project', {
                url: '^/project',
                type: 'authenticated',
                stateName: 'Projects',
                abstract: true,
                template: require('../templates/project-main.html')
            })
            .state('authenticated.layout.project.list', {
                url: '/list',
                type: 'authenticated',
                stateName: 'Projects',
                template: require('../templates/project.html'),
                controller: 'projectCtrl as vm'
            });

        $urlRouterProvider.when('/project/', '/project/list');
        $urlRouterProvider.when('/project', '/project/list');
    }
];
