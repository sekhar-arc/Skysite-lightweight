 'use strict';

 module.exports = [
     '$window',
     function(
         $window
     ) {
         var userDetails = {};

         /* Old */

         function setTokenKey(key) {
             userDetails.tokenKey = key;
         }

         function setPINProjectID(key) {
             userDetails.PINProjectID = key;
         }

         function setProjectName(key) {
             userDetails.projectName = key;
         }

         function setPWAccountID(key) {
             userDetails.PWAccountID = key;
         }

         function setPersonalDetails(obj) {
             userDetails.personalDetails = obj;
         }

         /**/

         function setUserDetails(cfg) {
             userDetails.tokenKey = cfg.tokenKey;
             userDetails.PWAccountID = cfg.PWAccountID;
             userDetails.personalDetails = cfg.personalDetails;
             updateLocalUserDetails();
         }

         function setProjectDetails(cfg) {
             userDetails.PINProjectID = cfg.PINProjectID;
             userDetails.projectName = cfg.projectName;
             updateLocalUserDetails();
         }

         function updateLocalUserDetails() {
             $window.localStorage.setItem('userDetails', JSON.stringify(userDetails));
         }

         function getDetails() {
             if (userDetails === null) {
                 userDetails = {};
             } else if (!Object.keys(userDetails).length) {
                 userDetails = JSON.parse($window.localStorage.getItem('userDetails')) || {};

             }
             return userDetails;
         }

         function clearUserDetails() {
             userDetails = {};
             updateLocalUserDetails();
         }

         function clearProjectDetails() {
             (userDetails.PINProjectID) && delete userDetails.PINProjectID;
             (userDetails.projectName) && delete userDetails.projectName;
             updateLocalUserDetails();
         }

         return {
             setTokenKey: setTokenKey,
             setPINProjectID: setPINProjectID,
             setProjectName: setProjectName,
             setPWAccountID: setPWAccountID,
             setPersonalDetails: setPersonalDetails,


             getDetails: getDetails,
             setUserDetails: setUserDetails,
             setProjectDetails: setProjectDetails,
             clearUserDetails: clearUserDetails,
             clearProjectDetails: clearProjectDetails
         };
     }
 ];
