(function() {
'use strict';

/**
 * @ngdoc function
 * @name 4me.core.errors.components
 * @description
 * # Errors components
 * Errors components
 */
var errorComponents = angular.module('4me.core.errors.components', [
  '4me.core.lodash',
  '4me.core.errors'
]);

errorComponents.component('fmeErrorList', {
  restrict: 'E',
  controller: fmeErrorController,
  templateUrl: 'views/errors/errorList.html'
});

fmeErrorController.$inject = ['errors'];
function fmeErrorController(errors) {
  var self = this;
  self.errors = [];
  self.errors = errors.get();
}

}());
