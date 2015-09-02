"use strict";
angular.module('fundApp.widget', [])
 /**
     * @description
     * directive to generate widget
     * purpose is to make code cleaner and easier to understand
     */
  .directive('fundWidget', function () {
      return {
          restrict: 'AE',
          templateUrl: 'app/templates/fundTemplate.html',
          controller: function ($scope, $attrs, $interpolate) {
              if ($attrs.ngModel === void 0) {
                  throw "ngModel not defined";
              }

              $scope.model = {};
              var fundFn = $interpolate($attrs.ngModel)($scope);

              $scope.$watch(fundFn, function (value) {
                  $scope.fund = value;
                  if (value !== void 0 && value.shareClassesCount > 0) {
                      //default shareClass
                      $scope.model.shareClass = value.shareClasses[0]['Short Name'];
                  }
              }, true);

              $scope.$watch('model.shareClass', function (value) {
                  angular.forEach($scope.fund.shareClasses, function (cls) {
                      if (cls['Short Name'] === value) {
                          $scope.currentClass = cls;
                      }
                  });
              }, true);

          }
      };
  });