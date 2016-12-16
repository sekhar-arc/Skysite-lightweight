 'use strict';

 module.exports = [
     'ApiRequestService',
     'API',
     'BasicsFactory',
     function(ApiRequestService, API, BasicsFactory) {
         function projectList(cfg) {
             var apiObject = {
                 method: 'GET',
                 headers: cfg.headers || {},
                 params: cfg.params || {},
                 url: API.projectList
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function createNewProject(cfg) {
             var headers = {
                     tokenKey: BasicsFactory.getDetails().tokenKey
                 },
                 apiObject = {
                     method: 'POST',
                     headers: headers,
                     params: cfg.params || {},
                     data: cfg.data,
                     url: API.createProject
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function editProject(cfg) {
             var headers = {
                     "tokenKey": BasicsFactory.getDetails().tokenKey,
                     "Content-Type": "application/json"
                 },
                 apiObject = {
                     method: 'POST',
                     headers: headers,
                     params: cfg.params || {},
                     data: cfg.data,
                     url: API.editProject
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function makeItFavourite(cfg) {
             var headers = {
                     tokenkey: BasicsFactory.getDetails().tokenKey
                 },
                 apiObject = {
                     method: 'POST',
                     headers: headers,
                     params: cfg.params || {},
                     data: cfg.data || {},
                     url: API.projectList
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function locationList(cfg) {
             var headers = {
                     tokenkey: BasicsFactory.getDetails().tokenKey
                 },
                 apiObject = {
                     method: 'GET',
                     headers: headers,
                     params: cfg.params || {},
                     data: cfg.data || {},
                     url: API.location
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function projectDetails(cfg) {
             var apiObject = {
                 method: 'GET',
                 headers: cfg.headers,
                 params: cfg.params || {},
                 data: cfg.data || {},
                 url: API.projectList
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function projectRoleList(cfg) {
             var headers = {
                     tokenkey: BasicsFactory.getDetails().tokenKey
                 },
                 apiObject = {
                     method: 'GET',
                     headers: headers,
                     params: cfg.params || {},
                     data: cfg.data || {},
                     url: API.projectRole
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         return {
             projectList: projectList,
             createNewProject: createNewProject,
             editProject: editProject,
             makeItFavourite: makeItFavourite,
             locationList: locationList,
             projectDetails: projectDetails,
             projectRoleList: projectRoleList
         };
     }
 ];
