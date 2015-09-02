"use strict";
angular.module('fundApp.Charting', [])
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
                  if (data.length === 0) {
                      element.html('');
                      return;
                  }

                  var seriesOptions = [],
                    createChart = function () {

                        new Highcharts.StockChart({
                            chart: {
                                renderTo: element[0]
                            },
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
  });