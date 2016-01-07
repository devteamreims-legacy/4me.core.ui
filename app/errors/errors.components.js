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
errorComponents.component('fmeErrorButton', {
  restrict: 'E',
  controller: fmeErrorButtonController,
  templateUrl: 'views/errors/fmeErrorButton.tpl.html'
});
errorComponents.component('fmeErrorList', {
  restrict: 'E',
  controller: fmeErrorListController,
  templateUrl: 'views/errors/fmeErrorList.tpl.html'
});

fmeErrorListController.$inject = ['errors'];
function fmeErrorListController(errors) {
  var self = this;
  self.errors = errors.get();
}

fmeErrorButtonController.$inject = ['errors'];
function fmeErrorButtonController(errors) {
  var self = this;
  self.unreadCount = errors.getUnreadCount();
}

}());
