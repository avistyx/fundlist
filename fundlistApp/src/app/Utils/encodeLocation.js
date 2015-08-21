"use strict";
angular.module("ui.utils", [])
  .service('cfLocation', ['$window', '$document',
    function ($window, $document) {
      var encodeParam = function (prop, value) {
        var key = encodeURIComponent(prop);
        if (angular.isUndefined(value) || value === null || angular.isArray(value)) {
          return null;
        }

        if (angular.isDate(value)) {
          return key + "=" + angular.toJson(value).replace(/\"/g, "");
        } else {
          return key + "=" + encodeURIComponent(value);
        }
      };

      var cleanPath = function (path) {
        if (!angular.isString(path)) {
          throw new Error("Path must be a string.");
        }

        if (/(MSIE [6-9].0)|(Trident)/.test($window.navigator.userAgent) && path.indexOf('://') === -1) {
          //Ie fix, it really doesn't like the base path.
          //Turns out even newer versions of IE don't respect the base tag.
          path = angular.element($document.querySelector('base')).attr('href') + path;
        }

        if (path.indexOf('?') === -1) {
          path += '?';
        }

        return path;
      };

      this.encodeUrl = function (path, params) {
        path = cleanPath(path);

        if (angular.isUndefined(params)) {
          return path;
        }

        if (!angular.isObject(params)) {
          throw new Error("params has to be an object.");
        }

        angular.forEach(params, function (value, prop) {
          //Skip if it's an object or undefined.
          if (angular.isArray(value)) {
            angular.forEach(value, function (arrVal) {
              var output = encodeParam(prop, arrVal);
              if (!output) {
                return;
              }
              path += output + "&";
            });
          } else {
            var output = encodeParam(prop, value);
            if (!output) {
              return;
            }
            path += output + "&";
          }
        });
        return path.replace(/&$/, "");
      };

      return this;
    }])
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