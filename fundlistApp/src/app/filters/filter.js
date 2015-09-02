"use strict";
angular.module('fundApp.filter', [])
       /**
     * @description
     * custom filters
     * 1. dateFormat: date validation and formatting
     * 2. percentage: number validation and formatting to percentage
     */
  .filter('dateFormat', ['$filter',
    function (filter) {
        var dateFilter = filter('date');
        return function (dateStr, format) {
            var date = Date.parse(dateStr);
            return isNaN(date) ? '-' : dateFilter(date, format);
        };
    }])
  .filter('percentage', ['$filter', function ($filter) {
      return function (input, decimals) {
          return (isNaN(input)) ? '-' : $filter('number')(input * 100, decimals) + '%';
      };
  }]);