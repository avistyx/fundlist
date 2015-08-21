"use strict";
angular.module('fundlistApp',['ui.utils'])
.controller('MainController',  ['$scope', '$http', 'cfLocation',
  function($scope, $http, cfLocation) {

    $http.get(cfLocation.encodeUrl('https://raw.githubusercontent.com/avistyx/fundlist/master/data/funds.json', {}))
        .success(function(response) {
          $scope.funds = response.funds;
        })

    }])

  .controller('chartCtrl', ['$scope', '$http','cfLocation',
    function($scope, $http, cfLocation) {
      $http.get(cfLocation.encodeUrl('https://raw.githubusercontent.com/avistyx/fundlist/master/data/chart.json', {}))
        .success(function(result) {
          $scope.chartData = result.chart;
        });
}])
.directive('fundWidget', function() {
    return {
      restrict: 'AE',
      templateUrl: 'templates/fundTemplate.html',
      controller: function($scope, $attrs, $interpolate) {
        if ($attrs.ngModel == void 0){
          throw "ngModel not defined";
        }

        $scope.model = {};
        var fundFn = $interpolate($attrs.ngModel)($scope);

        $scope.$watch(fundFn, function(value) {
          $scope.fund = value;
          if (value != void 0 && value.shareClassesCount > 0) {
            //default shareClass
            $scope.model.shareClass = value.shareClasses[0]['Short Name'];
          }
        }, true);

        $scope.$watch('model.shareClass', function(value) {
          angular.forEach($scope.fund.shareClasses, function(cls) {
            if(cls['Short Name'] == value) {
              $scope.currentClass = cls;
            }
          });
        }, true);

      }
    }
  })

.directive('fundChart', function() {
    return {
      restrict: 'AE',
      templateUrl: 'templates/fundChart.html',
      controller: function($scope, $attrs, $interpolate) {
        if ($attrs.ngModel == void 0){
          throw "ngModel not defined";
        }

        var fundFn = $interpolate($attrs.ngModel)($scope);

      }
    }
  })

.directive('lineChart', function() {
    return {
      restrict: 'E',
      scope: {
        data: '=ngModel'
      },
      replace: true,
      template: '<div></div>',
      link: function(scope, element, attr) {

        scope.$watch('data', function(dataset) {
          if (!!dataset) {
            generateChart(dataset);
          }

        });

        var generateChart = function(data) {
          var seriesOptions = [],

            createChart = function () {

              element.highcharts({
                chart: {
                  type: 'line'
                },
                rangeSelector: {
                  selected: 4
                },

                yAxis: {

                  plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                  }]
                },

                tooltip: {
                  pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> {point.x}<br/>',
                  valueDecimals: 0
                },

                series: seriesOptions
              });
            };

          angular.forEach(data, function(series, index) {
            seriesOptions[index] = {
              name: series.name,
              data: series.data
            };
            if (data.length === index + 1) {
              createChart();
            }
          });
    }
  }}});
