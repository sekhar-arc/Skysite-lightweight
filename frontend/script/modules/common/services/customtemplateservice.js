 'use strict';

 module.exports = [
     '$q',
     'ApiRequestService',
     'API',
     'BasicsFactory',
     function($q, ApiRequestService, API, BasicsFactory) {
         function checkFirstLogin(data) {
             var apiObject = {
                 method: 'GET',
                 params: data.params,
                 headers: data.headers,
                 url: API.checkFirstLogin + '/' + data.params.PWUserId
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function getMasterTemplate(data) {
             var apiObject = {
                 method: 'GET',
                 params: data.params,
                 headers: data.headers,
                 url: API.getMasterTemplate
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function addCustomTemplate(data) {
             var apiObject = {
                 method: 'POST',
                 params: data.params,
                 headers: data.headers,
                 data: data.data,
                 url: API.addCustomTemplate
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         return {
             checkFirstLogin: checkFirstLogin,
             getMasterTemplate: getMasterTemplate,
             addCustomTemplate: addCustomTemplate
         };
     }
 ];
