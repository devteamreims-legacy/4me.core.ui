(function() {
'use strict';

/**
 * @ngdoc function
 * @name 4me.core.cwp.directives
 * @description
 * # CWP components
 * CWP Components
 */
var sectorsComponents = angular.module('4me.core.sectors.components', [
  '4me.core.lodash',
  '4me.core.sectors.services'
]);


sectorsComponents.component('mySectors', {
  restrict: 'E',
  controller: mySectorsController,
  controllerAs: 'mySectors',
  template: '{{mySectors.sectors | toSector}}'
});

sectorsComponents.filter('toSector', arrayToSectorString);

mySectorsController.$inject = ['mySector'];
function mySectorsController(mySectorService) {
  var mySectors = this;
  mySectors.sectors = [];
  mySectorService.bootstrap()
  .then(function(s) {
    mySectors.sectors = s.sectors;
  });
}

arrayToSectorString.$inject = ['_', 'treeSectors'];
function arrayToSectorString(_, treeSectors) {
  return function(input) {
    if(!input || !_.isArray(input)) {
      return input;
    }
    var s = treeSectors.getFromSectors(input);
    if(!s || !s.name) {
      return input.join(',');
    }
    return s.name;
  };
}

}());
