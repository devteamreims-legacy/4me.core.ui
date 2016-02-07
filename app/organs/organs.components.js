(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.organs.components
 * @description
 * # Organs components
 *
 * Components related to organs
 *
 */

var template = {};
template.organNavigation = require('./navigation.tpl.html');

angular.module('4me.core.organs.components', [
  '4me.core.organs.services'
])
.component('organNavigation', {
  restrict: 'E',
  controller: organNavigationController,
  controllerAs: 'organNavigation',
  template: template.organNavigation
});

organNavigationController.$inject = ['_', 'mainOrganService'];
function organNavigationController(_, mainOrganService) {
  var organNavigation = this;
  organNavigation.organs = mainOrganService.getAll();
}



}());