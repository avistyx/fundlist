"use strict";
angular.module('fundlistApp')
     /**
     * @description
     * top level controller for entire SPA
     * Fetch meta data
     * TODO - move data provider to service
     */
    .controller('MainController', ['$scope', 'dataService',
    function ($scope, dataService) {
        //can be bound to some ng-model on the page or add watch eventually ==> not using var
        $scope.someParam = {
            param: 'un',
            param2: 'deux',
            param3: 'trois'
        };

        dataService.getData($scope.someParam)
        .success(function (response) {
            $scope.funds = response.funds;
        });

    }]);

   
  
 
 
