(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.sectors.services
 * @description
 * # Sectors Services
 * Sectors Services
 */
var sectorsServices = angular.module('4me.core.sectors.services', [
  '4me.core.lodash'
]);

sectorsServices.factory('mySectors', mySectors);

mySectors.$inject = ['_', '$q'];
function mySectors(_, $q) {
  var mySectors = {};
  var loadingPromise;
  var service = {};

  function _getFromBackend() {
    if(loadingPromise !== undefined) {
      // Already loading from backend, return promise
      return loadingPromise;
    } else {
      // TODO : load from backend
      var def = $q.defer();

      loadingPromise = def.promise
      .then(function(res) {
        mySectors = res;
        return mySectors;
      });

      def.resolve({
        sectors: ['UR', 'XR'],
        name: 'UXR'
      });

      return loadingPromise;
    }
  }

  service.get = function() {
    if(_.isEmpty(mySectors)) {
      return _getFromBackend();
    } else {
      var def = $q.defer();
      def.resolve(mySectors);
      return def.promise;
    }
  };

  return service;
}


}());