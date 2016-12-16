module.exports = ['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('public', {
                url: '/public',
                abstract: true,
                type: 'public',
                template: require('../templates/common-panel.html')
                    // controller: 'commonPanelCtrl as vm'
            })
            .state('authenticated', {
                url: '/auth',
                abstract: true,
                type: 'authenticated',
                template: require('../templates/common-panel.html')
            })
            .state('public.login', {
                url: '^/login',
                template: require('../templates/login.html'),
                type: 'public',
                controller: 'loginCtrl as vm'
            })
            .state('authenticated.upload', {
                url: '^/upload',
                stateName: 'Upload',
                type: 'authenticated',
                template: require('../templates/upload-ui.html'),
                controller: 'uploadCtrl as vm'
            });
    }
];
