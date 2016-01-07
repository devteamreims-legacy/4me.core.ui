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
  '4me.core.lodash',
  '4me.core.config',
  '4me.core.errors'
]);

sectorsServices.factory('mySectors', mySectors);

mySectors.$inject = ['_', '$q', 'ApiUrls', '$http', 'errors'];
function mySectors(_, $q, ApiUrls, $http, errors) {
  var mySectors = {};
  var loadingPromise;
  var service = {};
  var endpoints = {};

  // This belongs in a separate service
  function _prepareUrl() {
    endpoints.getMine = ApiUrls.mapping.rootPath + ApiUrls.mapping.sectors.getMine;
    return endpoints;
  }

  function _getFromBackend() {
    if(_.isEmpty(endpoints)) {
      _prepareUrl();
    }
    if(loadingPromise !== undefined) {
      // Already loading from backend, return promise
      return loadingPromise;
    } else {
      loadingPromise = $http({
        method: 'GET',
        url: endpoints.getMine,
        timeout: 200
      })
      .then(function(res) {
        mySectors = res.data;
        return mySectors;
      })
      .catch(errors.catch('core.sectors', 'critical', 'Could not load our sectors from backend'));

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
