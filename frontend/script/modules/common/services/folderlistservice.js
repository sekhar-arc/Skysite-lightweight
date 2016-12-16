 'use strict';

 module.exports = [
     '$q',
     'ApiRequestService',
     'API',
     'BasicsFactory',
     function($q, ApiRequestService, API, BasicsFactory) {
         function getFolderList(data) {
             var apiObject = {
                 method: 'GET',
                 params: data.params,
                 headers: data.headers,
                 url: API.folderList
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function getDocumentDetails(data) {
             var apiObject = {
                 method: 'GET',
                 params: data.params,
                 headers: data.headers,
                 url: API.projectDocument
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function moveFolder(data) {
             var apiObject = {
                 method: 'POST',
                 params: data.params,
                 headers: data.headers,
                 data: data.data,
                 url: API.folderList
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function moveDocument(data) {
             var deffered = $q.defer(),
                 apiObject = {
                     method: 'POST',
                     params: data.params,
                     headers: data.headers,
                     data: data.data,
                     url: API.projectDocument
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function getCustomPropertyList(data) {
             var deffered = $q.defer(),
                 apiObject = {
                     method: 'GET',
                     params: data.params,
                     headers: data.headers,
                     url: API.customProperty
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function updateDocument(data) {
             var deffered = $q.defer(),
                 apiObject = {
                     method: 'POST',
                     params: data.params,
                     headers: data.headers,
                     data: data.data,
                     url: API.projectDocument
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function getCustomPropertyAttributeList(data) {
             var deffered = $q.defer(),
                 apiObject = {
                     method: 'GET',
                     params: data.params,
                     headers: data.headers,
                     url: API.customPropertyAttribute
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function getLookup(data) {
             var deffered = $q.defer(),
                 apiObject = {
                     method: 'GET',
                     params: data.params,
                     headers: data.headers,
                     url: API.customPropertyLookup
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function deleteDocument(data) {
             var deffered = $q.defer(),
                 apiObject = {
                     method: 'POST',
                     params: data.params,
                     headers: data.headers,
                     data: data.data,
                     url: API.projectDocument
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function deleteFolder(data) {
             var apiObject = {
                 method: 'POST',
                 params: data.params,
                 headers: data.headers,
                 url: API.folderList
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         return {
             getFolderList: getFolderList,
             getDocumentDetails: getDocumentDetails,
             moveFolder: moveFolder,
             moveDocument: moveDocument,
             getCustomPropertyList: getCustomPropertyList,
             updateDocument: updateDocument,
             getCustomPropertyAttributeList: getCustomPropertyAttributeList,
             getLookup: getLookup,
             deleteDocument: deleteDocument,
             deleteFolder: deleteFolder
         };
     }
 ];
