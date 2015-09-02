"use strict";
angular.module('fundApp.ratings', [])
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