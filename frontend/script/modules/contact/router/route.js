module.exports = ['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        console.log('Project router');
        $stateProvider
            .state('authenticated.layout.contact', {
                url: '^/contact',
                type: 'authenticated',
                stateName: 'Contact',
                abstract: true,
                template: require('../templates/contact.html'),
                controller: 'contactCtrl as vm'
            })
            .state('authenticated.layout.contact.thumbnail', {
                url: '/thumbnail',
                stateName: 'Contact',
                type: 'authenticated',
                abstract: true,
                template: require('../templates/contact-thumbnail.html'),
                controller: 'contactListCtrl as vm'
            })
            .state('authenticated.layout.contact.thumbnail.details', {
                url: '/details',
                stateName: 'Contact',
                type: 'authenticated',
                // abstract: true,
                template: require('../templates/contact-details.html'),
                controller: 'contactDetailsCtrl as vm'
            })
            .state('authenticated.layout.contact.thumbnail.addContact', {
                url: '/add-contact',
                stateName: 'Contact',
                type: 'authenticated',
                // abstract: true,
                template: require('../templates/contact-add.html'),
                controller: 'contactAddCtrl as vm'
            })
            .state('authenticated.layout.contact.thumbnail.addGroup', {
                url: '/add-group',
                stateName: 'Contact',
                type: 'authenticated',
                // abstract: true,
                template: require('../templates/group-add.html'),
                controller: 'groupAddCtrl as vm'
            })
            .state('authenticated.layout.contact.thumbnail.editContact', {
                url: '/edit-contact/:id',
                stateName: 'Contact',
                type: 'authenticated',
                isEdit: true,
                // abstract: true,
                template: require('../templates/contact-add.html'),
                controller: 'contactAddCtrl as vm'
            })
            .state('authenticated.layout.contact.thumbnail.editGroup', {
                url: '/add-group/:id',
                stateName: 'Contact',
                type: 'authenticated',
                isEdit: true,
                // abstract: true,
                template: require('../templates/group-add.html'),
                controller: 'groupAddCtrl as vm'
            });

        $urlRouterProvider.when('/contact/', '/contact/thumbnail/details')
            .when('/contact', '/contact/thumbnail/details')
            .when('/contact/thumbnail', '/contact/thumbnail/details')
            .when('/contact/thumbnail/', '/contact/thumbnail/details');
    }
];
