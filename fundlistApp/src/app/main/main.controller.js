"use strict";
angular.module('fundlistApp', ['ui.utils'])
  .controller('MainController', ['$scope', '$http', 'cfLocation',
    function ($scope, $http, cfLocation) {

      $http.get(cfLocation.encodeUrl('https://raw.githubusercontent.com/avistyx/fundlist/master/data/funds.json', {}))
        .success(function (response) {
          $scope.funds = response.funds;
        });

    }])
  .controller('chartCtrl', ['$scope', '$http', 'cfLocation',
    function ($scope, $http, cfLocation) {
      var someStartDate = new Date();
      var someEndDate = new Date();

      $scope.$watch('currentClass', function(value) {
        getData(value['ISIN Code'], someStartDate, someEndDate);
      }, true);

      var getData = function(ISIN, start, end) {
        var param = {
          ISIN: ISIN,
          from: start,
          to: end
        };

        if (!/notvalid/i.test(param.ISIN)) {
          $http.get(cfLocation.encodeUrl('https://raw.githubusercontent.com/avistyx/fundlist/master/data/chart.json', param))
            .success(function (result) {
              $scope.chartData = result.chart;
            });
        } else {
          $scope.chartData = [];
          alert('ISIN is invalid');
        }
      };
    }])
  .directive('fundWidget', function () {
    return {
      restrict: 'AE',
      templateUrl: 'templates/fundTemplate.html',
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
  })
  .directive('lineChart', function () {
    return {
      restrict: 'E',
      scope: {
        data: '=ngModel'
      },
      replace: true,
      template: '<div></div>',
      link: function (scope, element) {

        scope.$watch('data', function (dataset) {
          if (!!dataset) {
            generateChart(dataset);
          }

        });

        var generateChart = function (data) {
          if (data.length === 0){
            element.html('');
            return;
          }

          var seriesOptions = [],
            createChart = function () {

              element.highcharts('StockChart', {
                title: {
                  text: ''
                },
                rangeSelector: {
                  allButtonsEnabled: true,
                  buttons: [{
                    type: 'year',
                    count: 1,
                    text: '1 yr',
                    dataGrouping: {
                      forced: true,
                      units: [['month', [1]]]
                    }
                  }, {
                    type: 'year',
                    count: 3,
                    text: '3 yr',
                    dataGrouping: {
                      forced: true,
                      units: [['month', [1]]]
                    }
                  }, {
                    type: 'year',
                    count: 5,
                    text: '5 yr',
                    dataGrouping: {
                      forced: true,
                      units: [['month', [1]]]
                    }
                  }, {
                    type: 'all',
                    text: 'All',
                    dataGrouping: {
                      forced: true,
                      units: [['year', [1]]]
                    }
                  }],
                  buttonTheme: {
                    width: 60
                  },
                  selected: 3
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

          angular.forEach(data, function (series, index) {
            seriesOptions[index] = {
              name: series.name,
              data: series.data
            };
          });
          createChart();
        };
      }
    };
  })
  .directive('morningStarRating', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<span></span>',
      link: function (scope, element, attr) {
        var template = '';

        attr.$observe('rating', function(rating) {
          if (isNaN(rating)) {
            template = '-';
          } else {
            for (var i=0; i< parseInt(rating, 10); i++) {
              template += '<span class="glyphicon glyphicon-star"></span>';
            }
          }
          element.html(template);
        });
      }
    }
  });