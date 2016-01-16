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
  '4me.core.cwp.interceptor',
  '4me.core.errors',
  '4me.core.status'
]);

cwpServices.factory('myCwp', myCwp);

myCwp.$inject = ['_', '$q', 'ApiUrls', '$http', 'errors', 'cwpInterceptor', 'status'];
function myCwp(_, $q, ApiUrls, $http, errors, cwpInterceptor, status) {
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
        url: endpoints.getMine
      })
      .then(function(res) {
        console.log('Got CWP data from backend');
        console.log(myCwp);
        myCwp.id = res.data.id;
        myCwp.name = res.data.name;
        myCwp.sectors = res.data.sectors;
        myCwp.sectorName = res.data.sectorName;
        // Set our cwp Id for future requests
        cwpInterceptor.setId(res.data.id);
        loadingPromise = undefined;
        return myCwp;
      })
      .catch(function(err) {
        loadingPromise = undefined;
        console.log('Catching error');
        var e = errors.add('core.cwp', 'critical', 'Could not load our CWP from backend', err);
        status.escalate('core.cwp', 'critical', 'Could not load our CWP from backend', e);
        return $q.reject(err);
      });

      return loadingPromise;
    }
  }

  service.get = function() {
    return myCwp;
  };

  service.bootstrap = function() {
    return _getFromBackend();
  };

  service.refresh = function() {
    return _getFromBackend();
  };

  return service;
}


}());
