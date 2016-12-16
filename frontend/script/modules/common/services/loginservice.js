 'use strict';

 module.exports = [
     '$q',
     'ApiRequestService',
     'API',
     'BasicsFactory',
     '$window',
     function($q, ApiRequestService, API, BasicsFactory, $window) {
         function doLogin(data) {
             var apiObject = {
                 method: 'POST',
                 headers: data.headers,
                 url: API.authenticate
             };

             return ApiRequestService
                 .apiRequest(apiObject);

         }

         function projectList(data) {
             var headers = {
                     tokenKey: BasicsFactory.getDetails().tokenKey
                 },
                 apiObject = {
                     method: 'GET',
                     headers: headers,
                     params: data.params,
                     url: API.projectList
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         }
         return {
             doLogin: doLogin,
             projectList: projectList
         };
     }
 ];
