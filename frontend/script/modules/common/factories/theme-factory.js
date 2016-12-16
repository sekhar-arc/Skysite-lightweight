 'use strict';

 module.exports = [
     '$window',
     function(
         $window
     ) {
         var themeDetails = {},
             ele = [],
             topElement = [],
             bottomElement = [],
             rightElement = [],
             leftElement = [],
             backgroundDetails = {};

         function elements(item) {
             if (item) {
                 ele = item;
                 if (ele.length) {
                     $window.localStorage.setItem('elements', JSON.stringify(ele));
                 } else {
                     $window.localStorage.setItem('elements', ele);
                 }
             } else {
                 if (ele.length) {
                     return ele;
                 } else {
                     if ($window.localStorage.getItem('elements')) {
                         return JSON.parse($window.localStorage.getItem('elements'));
                     } else {
                         return [];
                     }
                 }
             }
         }

         function topElements(item) {
             console.log('inside top Elements', item);
             if (item) {
                 topElement = item;
                 if (topElement.length) {
                     $window.localStorage.setItem('topElements', JSON.stringify(topElement));
                 } else {
                     $window.localStorage.setItem('topElements', topElement);
                 }
             } else {
                 if (topElement.length) {
                     return topElement;
                 } else {
                     if ($window.localStorage.getItem('topElements')) {
                         console.log('get iTMe ', $window.localStorage.getItem('topElements'));
                         return JSON.parse($window.localStorage.getItem('topElements'));
                     } else {
                         return [];
                     }
                 }
             }
         }

         function bottomElements(item) {
             if (item) {
                 bottomElement = item;
                 if (bottomElement.length) {
                     $window.localStorage.setItem('bottomElements', JSON.stringify(bottomElement));
                 } else {
                     $window.localStorage.setItem('bottomElements', bottomElement);
                 }
             } else {
                 if (bottomElement.length) {
                     return bottomElement;
                 } else {
                     if ($window.localStorage.getItem('bottomElements')) {
                         return JSON.parse($window.localStorage.getItem('bottomElements'));
                     } else {
                         return [];
                     }
                 }
             }
         }

         function rightElements(item) {
             if (item) {
                 rightElement = item;
                 if (rightElement.length) {
                     $window.localStorage.setItem('rightElements', JSON.stringify(rightElement));
                 } else {
                     $window.localStorage.setItem('rightElements', rightElement);
                 }
             } else {
                 if (rightElement.length) {
                     return rightElement;
                 } else {
                     if ($window.localStorage.getItem('rightElements')) {
                         return JSON.parse($window.localStorage.getItem('rightElements'));
                     } else {
                         return [];
                     }
                 }
             }
         }

         function leftElements(ele) {
             if (ele) {
                 leftElement = ele;
                 if (leftElement.length) {
                     $window.localStorage.setItem('leftElements', JSON.stringify(leftElement));
                 } else {
                     $window.localStorage.setItem('leftElements', leftElement);
                 }
             } else {
                 if (leftElement.length) {
                     return leftElement;
                 } else {
                     if ($window.localStorage.getItem('leftElements')) {
                         return JSON.parse($window.localStorage.getItem('leftElements'));
                     } else {
                         return [];
                     }
                 }
             }
         }

         function background(details) {
             if (details) {
                 backgroundDetails = details;
             } else {
                 return backgroundDetails;
             }


         }

         function getDetails() {
             return {
                 background: backgroundDetails,
                 elements: {
                     center: ele,
                     top: topElement,
                     bottom: bottomElement,
                     right: rightElement,
                     left: leftElement
                 }
             }
         }




         return {
             elements: elements,
             topElements: topElements,
             bottomElements: bottomElements,
             rightElements: rightElements,
             leftElements: leftElements,
             background: background,
             getDetails: getDetails
         };
     }
 ];
