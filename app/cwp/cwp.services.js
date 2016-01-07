(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.cwp.services
 * @description
 * # CWP Services
 * CWP Services
 */
var cwpServices = angular.module('4me.core.cwp.services', [
  '4me.core.lodash',
  '4me.core.config',
  '4me.core.errors'
]);

cwpServices.factory('myCwp', myCwp);

myCwp.$inject = ['_', '$q', 'ApiUrls', '$http', 'errors'];
function myCwp(_, $q, ApiUrls, $http, errors) {
  var myCwp = {};
  var loadingPromise;
  var service = {};
  var endpoints = {};

  // This belongs in a separate service
  function _prepareUrl() {
    endpoints.getMine = ApiUrls.mapping.rootPath + ApiUrls.mapping.cwp.getMine;
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
        myCwp = res.data;
        return myCwp;
      })
      .catch(errors.catch('core.cwp', 'critical', 'Could not load our CWP from backend'));

      return loadingPromise;
    }
  }

  service.get = function() {
    if(_.isEmpty(myCwp)) {
      return _getFromBackend();
    } else {
      var def = $q.defer();
      def.resolve(myCwp);
      return def.promise;
    }
  };

  return service;
}


}());
