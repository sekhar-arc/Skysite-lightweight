 'use strict';
 window.name = "NG_DEFER_BOOTSTRAP!";
 /**
  * @name InnorideAdminPanel
  * @description 
  *   This is main angular app for this InnorideAdminPanel.
  *   This handles all the functionality.
  * @requires ui-router 
  * @requires ui.bootstrap
  * @requires ngAnimate
  * @requires datatables
  * @requires toastr
  * @requires Common
  * @requires Config
  * @requires Modules
  */

 var eArcApp =
     angular.module('eArcApp', [
         'ngCookies',
         'ui.router',
         'ui.bootstrap',
         'ngAnimate',
         'toaster',
         'ui.bootstrap.datetimepicker',
         'sun.scrollable',
         'ngFileUpload',
         'ngDraggable',
         'angular-loading-bar',
         'lk-google-picker',
         'dropbox-picker',
         'angularOneDrivePicker',
         'ui.select',
         'ui.bootstrap.contextMenu',
         'ui.bootstrap.showErrors',
         'ui.grid',
         'ui.grid.resizeColumns',
         'ui.grid.moveColumns',
         'ui.grid.autoResize',
         'ui.grid.pinning',
         'as.sortable',
         'ui.select',
         'ngSanitize',
         require('./util').name,
         require('./modules').name,
         require('./validation/validation').name,
     ]);

 eArcApp.run([
     '$http',
     '$cookies',
     'BasicsFactory',
     '$rootScope',
     '$state',
     '$window',
     function(
         $http,
         $cookies,
         BasicsFactory,
         $rootScope,
         $state,
         $window
     ) {
         console.log('App Starts');
         $rootScope
             .$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
                 var basicData = BasicsFactory.getDetails();
                 // console.log("basicData : ", basicData, toState.type);
                 if (toState.type === "authenticated" && basicData && !Object.keys(basicData).length) {
                     (!$rootScope.prevState) &&
                     ($rootScope.prevState = toState);
                     $state.go('public.login');
                     e.preventDefault();

                 }

                 /*else if (toState.type === "Public" && userData && Object.keys(userData).length !== 0) {
                     $state.go(fromState.name);
                 }*/

             });

         $rootScope
             .$on('$stateChangeSuccess',
                 function(event, toState, toParams, fromState, fromParams) {
                     $rootScope.$broadcast('ActiveMenuOption', toState);
                 });

     }
 ]);

 eArcApp.config([
     '$httpProvider',
     '$urlRouterProvider',
     'cfpLoadingBarProvider',
     'lkGoogleSettingsProvider',
     'DropBoxSettingsProvider',
     'angularOneDriveSettingsProvider',
     '$locationProvider',
     function(
         $httpProvider,
         $urlRouterProvider,
         cfpLoadingBarProvider,
         lkGoogleSettingsProvider,
         DropBoxSettingsProvider,
         angularOneDriveSettingsProvider,
         $locationProvider
     ) {
         $urlRouterProvider.when('', '/login');
         $urlRouterProvider.otherwise('/404');
         cfpLoadingBarProvider.includeSpinner = false;

         // $httpProvider.defaults.withCredentials = true;

         lkGoogleSettingsProvider.configure({
             apiKey: 'AIzaSyAKHqSZmHpkRE-hHq1f-50LHtWn_C0RDLk',
             clientId: '918637953416-nu5734pbs8mqvvslet02dek24juocs59.apps.googleusercontent.com',
             scopes: ['https://www.googleapis.com/auth/drive']
                 // locale: 'ja'
                 /*features: ['..', '..'],
                 views: ['..', '..']*/
         });

         DropBoxSettingsProvider.configure({
             linkType: 'direct', //dropbox link type
             multiselect: true, //dropbox multiselect
             extensions: ['.*'], //dropbox file extensions
             box_clientId: 'kh90udrdar63yor52siliw4qq4mgx5v8', // box CLient Id
             box_linkType: 'direct', //box link type
             box_multiselect: 'true' //box multiselect
         });

         angularOneDriveSettingsProvider.configure({
             client_id: 'dc8a39a6-b608-4526-9291-3703c1f8279e',
             redirect_uri: 'http://localhost/e-arc/build',
             linkType: 'downloadLink',
             multiSelect: true
         });
         // $locationProvider.html5Mode(true);
     }
 ]);

 /*eArcApp.value('GoogleApp', {
     apiKey: 'AIzaSyAKHqSZmHpkRE-hHq1f-50LHtWn_C0RDLk',
     clientId: '918637953416-nu5734pbs8mqvvslet02dek24juocs59.apps.googleusercontent.com',
     scopes: [
         // whatever scopes you need for your app, for example:
         'https://www.googleapis.com/auth/drive'
         // ...
     ]
 });*/


 /*eArcApp.directive('ngRightClick', function($parse) {
     return function(scope, element, attrs) {
         var fn = $parse(attrs.ngRightClick);
         element.bind('contextmenu', function(event) {
             scope.$apply(function() {
                 console.log('right click',attrs);
                 event.preventDefault();

             });
         });
     };
 });
*/
 bootstrapApplication();

 function bootstrapApplication() {
     angular.element(document).ready(function() {
         angular.resumeBootstrap(['eArcApp']);
     });
 }
