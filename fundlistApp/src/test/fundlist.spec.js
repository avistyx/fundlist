describe('Fundlist', function () {

  var funds = [];

  var $rootScope, $compile, $document, body;
  var el, $scope;

  beforeEach(module('fundlistApp'));

  beforeEach(inject(function (_$document_) {
    $document = _$document_;
    body = $document.find('body');
  }));

  describe('best case scenario with defaults', function () {

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $rootScope.funds = funds;

      elemFund = $compile('<div><fund-widget class="col-xs-12" ng-repeat="fund in funds" ng-model="fund"></fund-widget></div>')($rootScope);
      $scope = elemFund.scope();
      $rootScope.$digest();
    }));

    describe('defaults', function () {
      it('should have dataset populated', function () {
        expect($scope.funds).toEqual($rootScope.funds);
      });

      it('should have same same number of widget instance as objects in funds array', function() {

      });

    });
  })
});
