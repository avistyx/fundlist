"use strict";
angular.module('fundApp.data', ['fundApp.utils'])
.service('dataService', ['$http', 'cfLocation',
    function ($http, cfLocation) {
        return {
            getData: function (params) {
                return $http.get(cfLocation.encodeUrl('https://raw.githubusercontent.com/mihaly-alberti-kurtosys/fundlist/master/data/funds.json', params));
            },
            getChartData: function (ISIN, start, end) {
                var param = {
                    ISIN: ISIN,
                    from: start,
                    to: end
                };
                return $http.get(cfLocation.encodeUrl('https://raw.githubusercontent.com/mihaly-alberti-kurtosys/fundlist/master/data/chart.json', param));
            }
        };
    }]);