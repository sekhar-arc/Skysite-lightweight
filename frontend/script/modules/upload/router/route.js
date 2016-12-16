module.exports = ['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('authenticated.layout.project.upload-view', {
                url: '/upload-view',
                type: 'authenticated',
                stateName: 'Projects',
                template: require('../templates/upload-view.html'),
                // abstract: true,
                controller: 'uploadViewCtrl as vm'
            });

        // $urlRouterProvider.when('/theme', '/step1');
    }
];
