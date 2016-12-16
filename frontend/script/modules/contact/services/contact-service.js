 'use strict';

 module.exports = [
     'ApiRequestService',
     'API',
     'BasicsFactory',
     function(ApiRequestService, API, BasicsFactory) {

         function contactList(cfg) {
             var params = { mode: 1 };
             if (cfg.params) {
                 angular.extend(params, cfg.params);
             }
             var apiObject = {
                 method: 'GET',
                 headers: cfg.headers || {},
                 params: params,
                 url: API.contactList
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function contactDetails(cfg) {
             var apiObject = {
                 method: 'GET',
                 headers: cfg.headers || {},
                 params: cfg.params || {},
                 url: API.contactList
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         };

         function groupList(cfg) {
             /* var params = { mode: 1 };
              if (cfg.params) {
                  angular.extend(params, cfg.params);
              }*/
             var apiObject = {
                 method: 'GET',
                 headers: cfg.headers || {},
                 params: cfg.params || {},
                 url: API.groupList
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function groupDetails(cfg) {
             var apiObject = {
                 method: 'GET',
                 headers: cfg.headers || {},
                 params: cfg.params || {},
                 url: API.groupList
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function groupMembersList(cfg) {
             var apiObject = {
                 method: 'GET',
                 headers: cfg.headers || {},
                 params: cfg.params || {},
                 url: API.groupMember
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function createContact(cfg) {
             var apiObject = {
                 method: 'POST',
                 headers: cfg.headers || {},
                 params: cfg.params || {},
                 url: API.createContact,
                 data: cfg.data || {}
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function createGroup(cfg) {
             var apiObject = {
                 method: 'POST',
                 headers: cfg.headers || {},
                 params: cfg.params || {},
                 url: API.createGroup,
                 data: cfg.data || {}
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function updateGroup(cfg) {
             var apiObject = {
                 method: 'POST',
                 headers: cfg.headers || {},
                 params: cfg.params || {},
                 url: API.updateGroup,
                 data: cfg.data || {}
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         function updateContact(cfg){
            var apiObject = {
                 method: 'POST',
                 headers: cfg.headers || {},
                 params: cfg.params || {},
                 url: API.updateContact,
                 data: cfg.data || {}
             };

             return ApiRequestService
                 .apiRequest(apiObject);
         }

         return {
             contactList: contactList,
             groupList: groupList,
             groupDetails: groupDetails,
             groupMembersList: groupMembersList,
             contactDetails: contactDetails,
             createContact: createContact,
             createGroup: createGroup,
             updateGroup: updateGroup,
             updateContact: updateContact

         }
     }
 ];
