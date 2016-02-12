/**
 * @ngdoc overview
 * @name 4me.core.organs.components
 * @description
 * # Organs components
 *
 * Components related to organs
 *
 */
angular.module('4me.core.organs.components', [
  '4me.core.organs.services'
])
.component('organNavigation', {
  restrict: 'E',
  controller: organNavigationController,
  controllerAs: 'organNavigation',
  templateUrl: 'views/organs/navigation.tpl.html'
});

organNavigationController.$inject = ['_', 'mainOrganService'];
function organNavigationController(_, mainOrganService) {
  var organNavigation = this;
  organNavigation.organs = mainOrganService.getAll();
}