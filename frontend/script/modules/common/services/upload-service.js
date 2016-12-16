 'use strict';

 module.exports = [
     'ApiRequestService',
     'API',
     'BasicsFactory',
     function(ApiRequestService, API, BasicsFactory) {
         function getFolderDetails(cfg) {

             var baseData = BasicsFactory.getDetails();
             var apiObject = {
                 headers: {
                     TokenKey: baseData.tokenKey,
                     Page: cfg.page || 1,
                     PerPage: cfg.perPage || 15
                 },
                 params: {
                     pinProjectId: cfg.PINProjectID || baseData.PINProjectID,
                     parentFolderId: cfg.parentFolderId || 0,
                     source: cfg.source || 5,
                     start: cfg.start
                     //searchBy: 3 ///
                 },
                 url: API.folderDetails
             };
             (cfg.orderBy !== undefined) && (apiObject.params.orderBy = cfg.orderBy);
             console.log('apiObject ', apiObject, "cfg ", cfg);
             return ApiRequestService
                 .apiRequest(apiObject);

         };

         function createFolder(cfg) {
             var baseData = BasicsFactory.getDetails();
             var headers = {
                     tokenKey: baseData.tokenKey,
                     PINProjectID: cfg.PINProjectID || baseData.PINProjectID,
                     "Content-Type": "application/json"
                 },
                 params = {
                     hierarchyCreate: 1,
                     continuous: 1
                 },
                 apiObject = {
                     method: 'POST',
                     headers: headers,
                     url: API.folder,
                     // params: params,
                     data: cfg.data
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function folderDetails(cfg) {
             var baseData = BasicsFactory.getDetails();
             var headers = {
                     tokenKey: baseData.tokenKey,
                     PINProjectID: cfg.PINProjectID || baseData.PINProjectID
                 },
                 params = {
                     projectFolderId: cfg.parentFolderId
                 },
                 apiObject = {
                     method: 'GET',
                     headers: headers,
                     url: API.folder,
                     params: params,
                     data: cfg.data
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         };


         function uploadDocument(cfg) {
             var baseData = BasicsFactory.getDetails();
             var headers = {
                     TokenKey: baseData.tokenKey,
                     PINProjectID: cfg.PINProjectID || baseData.PINProjectID,
                     "Content-Type": "application/json"
                 },
                 params = {
                     duplicate: 1,
                     source: 5
                 },
                 apiObject = {
                     method: 'POST',
                     headers: headers,
                     url: API.projectDocument,
                     params: params,
                     data: cfg.data
                 };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function createSessionID(cfg) {
             var baseData = BasicsFactory.getDetails();
             var apiObject = {
                 method: 'GET',
                 headers: { TokenKey: baseData.tokenKey, },
                 url: API.createSession,
                 params: cfg.params
                     // data: cfg.data
             };
             return ApiRequestService
                 .apiRequest(apiObject);
         };

         return {
             getFolderDetails: getFolderDetails,
             createFolder: createFolder,
             folderDetails: folderDetails,
             uploadDocument: uploadDocument,
             createSessionID: createSessionID
         };
     }
 ];
