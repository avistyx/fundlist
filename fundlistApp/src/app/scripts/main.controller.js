"use strict";
angular.module('fundlistApp', ['ui.utils'])
     /**
     * @description
     * top level controller for entire SPA
     * Fetch meta data
     * TODO - move data provider to service
     */
    .controller('MainController', ['$scope', '$http', 'cfLocation',
    function ($scope, $http, cfLocation) {
      //can be bound to some ng-model on the page or add watch eventually
      $scope.someParam = {
        param: 'un',
        param2: 'deux',
        param3: 'trois'
      };

      $http.get(cfLocation.encodeUrl('https://raw.githubusercontent.com/mihaly-alberti-kurtosys/fundlist/master/data/funds.json', $scope.someParam))
        .success(function (response) {
          $scope.funds = response.funds;
        });

    }])

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
  })
     /**
     * @description
     * chart data controller
     * separate from chart for SOC and to avoid any custom validation in chart directive
     * TODO - need to move data provider to a service
     */
    .controller('chartCtrl', ['$scope', '$http', 'cfLocation', '$window',
    function ($scope, $http, cfLocation, $window) {
        var someStartDate = new Date();
        var someEndDate = new Date();

        $scope.$watch('currentClass', function (value) {
            getData(value['ISIN Code'], someStartDate, someEndDate);
        }, true);

        var getData = function (ISIN, start, end) {
            var param = {
                ISIN: ISIN,
                from: start,
                to: end
            };

            if (!/notvalid/i.test(param.ISIN)) {
                $http.get(cfLocation.encodeUrl('https://raw.githubusercontent.com/mihaly-alberti-kurtosys/fundlist/master/data/chart.json', param))
                  .success(function (result) {
                      $scope.chartData = result.chart;
                  });
            } else {
                $scope.chartData = [];
                $window.alert('ISIN is invalid');
            }
        };
    }])
    /**
     * @description
     * directive to generate the linechart. minimal validation so that component can be reused
     * creates an isolated scope and therefore can exist on own provided the correct data provided
     * data source should consist of an array of object containing { name } (string) and { data } (array of data objects)
     * TODO - extend to allow custom source data
     * 
     * attr required: ng-model  - points to data source
     */
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
                      units: [['month', [1]]]
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
 /**
     * @description
     * simple directive to generate star rating
     * requires  `rating` attr
     * NOTE: not using $interpolate so as not to overcomplicate things
     * TODO - extend to allow custom glyphicons
     */
  .directive('morningStarRating', function () {
      return {
          restrict: 'E',
          replace: true,
          template: '<span></span>',
          link: function (scope, element, attr) {
              if (attr.rating === void 0) {
                  throw 'rating attr not defined';
              }
              var template = '';

              attr.$observe('rating', function (rating) {
                  if (isNaN(rating)) {
                      template = '-';
                  } else {
                      for (var i = 0; i < parseInt(rating, 10) ; i++) {
                          template += '<span class="glyphicon glyphicon-star"></span>';
                      }
                  }
                  element.html(template);
              });
          }
      };
  });
