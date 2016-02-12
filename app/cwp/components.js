/**
 * @ngdoc function
 * @name 4me.core.cwp.directives
 * @description
 * # CWP components
 * CWP Components
 */
var cwpComponents = angular.module('4me.core.cwp.components', [
  '4me.core.lodash',
  '4me.core.cwp.services'
]);

cwpComponents.component('myCwp', {
  restrict: 'E',
  controller: myCwpController,
  controllerAs: 'myCwp',
  template: '{{myCwp.getCwpName()}}'
});

myCwpController.$inject = ['_', 'myCwp'];
function myCwpController(_, myCwpService) {
  var myCwp = this;
  myCwp.cwp = myCwpService.get();
  
  myCwpService.bootstrap();

  myCwp.getCwpName = function() {
    return myCwp.cwp.name;
  }
}
