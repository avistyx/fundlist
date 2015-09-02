"use strict";
angular.module('fundlistApp')
   /**
     * @description
     * chart data controller
     * separate from chart for SOC and to avoid any custom validation in chart directive
     * TODO - need to move data provider to a service
     */
    .controller('chartCtrl', ['$scope', 'dataService', '$window',
    function ($scope, dataService, $window) {
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
                dataService.getChartData(ISIN, start, end)
                  .success(function (result) {
                      $scope.chartData = result.chart;
                  });
            } else {
                $scope.chartData = [];
                $window.alert('ISIN is invalid');
            }
        };
    }]);
