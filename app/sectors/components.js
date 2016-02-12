import _ from 'lodash';

/**
 * @ngdoc function
 * @name 4me.core.cwp.directives
 * @description
 * # CWP components
 * CWP Components
 */
var sectorsComponents = angular.module('4me.core.sectors.components', [
  '4me.core.sectors.services'
]);


sectorsComponents.component('mySectors', {
  restrict: 'E',
  controller: mySectorsController,
  controllerAs: 'mySectors',
  template: '{{mySectors.properties.sectors | toSector}}'
});

// See here for async filter http://stackoverflow.com/questions/19046641/angularjs-asynchronously-initialize-filter
sectorsComponents.filter('toSector', arrayToSectorString);

mySectorsController.$inject = ['mySector'];
function mySectorsController(mySectorService) {
  var mySectors = this;
  mySectors.properties = mySectorService.get();
  mySectorService.bootstrap();
}

// Transform an array of sectors into a proper sector string
arrayToSectorString.$inject = ['treeSectors'];
function arrayToSectorString(treeSectors) {
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
