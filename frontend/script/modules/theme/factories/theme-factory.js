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
             } else {
                 return ele;
             }
         }

         function topElements(item) {
             if (item) {
                 topElement = item;
             } else {
                 return topElement;
             }
         }

         function bottomElements(item) {
             if (item) {
                 bottomElement = item;
             } else {
                 return bottomElement;
             }
         }

         function rightElements(item) {
             if (item) {
                 rightElement = item;
             } else {
                 return rightElement;
             }
         }

         function leftElements(ele) {
             if (ele) {
                 leftElement = ele;
             } else {
                 return leftElement;
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
