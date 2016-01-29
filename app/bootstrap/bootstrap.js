(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.bootstrap
 * @description
 * # Bootstrap management module
 *
 * Meta module to include bootstrap
 */
var bootstrapModule = angular.module('4me.core.bootstrap', [
  'ui.router',
  '4me.core.sectors.services',
  '4me.core.cwp.services'
]);

bootstrapModule.factory('bootstrapper', bootstrapper);


bootstrapper.$inject = ['$q', '$log', 'treeSectors', 'myCwp', 'mySector'];
function bootstrapper($q, $log, treeSectors, myCwp, mySector) {
  var service = {};

  function bootstrap() {
    $log.debug('bootstrapper: Bootstrapping application');
    return $q.all([
      treeSectors.bootstrap(),
      myCwp.bootstrap(),
      mySector.bootstrap()
    ]);
  }


  service.bootstrap = bootstrap;
  return service;
}


}());
