(function() {
'use strict';

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
  template: '{{myCwp.cwp}}'
});

myCwpController.$inject = ['myCwp'];
function myCwpController(myCwp) {
  var self = this;
  self.cwp = '';
  myCwp.get()
  .then(function(res) {
    self.cwp = res.name;
  });
}


}());
