module.exports = ['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('authenticated.theme', {
                url: '^/theme',
                type: 'authenticated',
                stateName: 'Theme',
                template: require('../templates/theme-home.html'),
                abstract: true,
                controller: 'themeStepCtrl as vm'
            })
            .state('authenticated.theme.step1', {
                url: '/step1',
                type: 'authenticated',
                stateName: 'ThemeStep1',
                template: require('../templates/theme-step1.html'),
                controller: 'themeStep1Ctrl as vm'
            })
            .state('authenticated.theme.step2', {
                url: '/step2',
                type: 'authenticated',
                stateName: 'ThemeStep2',
                template: require('../templates/theme-step2.html'),
                controller: 'themeStep2Ctrl as vm'
            })
            .state('authenticated.theme.step3', {
                url: '/step3',
                type: 'authenticated',
                stateName: 'ThemeStep3',
                template: require('../templates/theme-step3.html'),
                controller: 'themeStep3Ctrl as vm'
            })
            .state('authenticated.theme.step4', {
                url: '/step4',
                type: 'authenticated',
                stateName: 'ThemeStep4',
                template: require('../templates/theme-step4.html'),
                controller: 'themeStep4Ctrl as vm'
            })
            .state('authenticated.layout', {
                url: '^/layout',
                abstract: true,
                type: "authenticated",
                template: require('../templates/theme1-layout.html'),
                controller: "layoutCtrl as vm"
            });

        $urlRouterProvider.when('/theme', '/step1');
    }
];
