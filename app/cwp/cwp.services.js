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
  'ngCookies',
  '4me.core.lodash',
  '4me.core.config',
  '4me.core.cwp.interceptor',
  '4me.core.errors',
  '4me.core.status',
  '4me.core.socket'
]);

cwpServices.factory('myCwp', myCwp);

// Pull our CWP from the backend
myCwp.$inject = ['_', '$q', '$log', 'ApiUrls', '$http', 'errors', 'cwpInterceptor', 'status', 'mainWebSocket', '$cookies'];
function myCwp(_, $q, $log, ApiUrls, $http, errors, cwpInterceptor, status, mainWebSocket, $cookies) {
  var myCwp = {};
  var loadingPromise;
  var service = {};
  var endpoints = {};
  var bootstrapped = false;

  // This belongs in a separate service
  function _prepareUrl() {
    endpoints.getMine = ApiUrls.mapping.rootPath + ApiUrls.mapping.cwp.getMine;
    return endpoints;
  }

  function _setFromData(myCwp, data) {
    if(_.isEmpty(data)) {
      throw new Error('CWP: Invalid data from backend');
    }
    var validData = (data.id !== undefined
                  && data.name !== undefined
                  && data.type !== undefined);
    if(!validData) {
      throw new Error('CWP: Invalid data from backend');
    }
    // Set internal data
    myCwp.id = data.id;
    myCwp.name = data.name;
    myCwp.type = data.type;
    myCwp.disabled = !!data.disabled;

    // Refresh cwpInterceptor
    cwpInterceptor.setId(myCwp.id);

    // Set a cookie for socket.io requests
    //$cookies.remove('my-cwp-id');
    $cookies.put('my-cwp-id', myCwp.id);
    return myCwp;
  }

  function _getFromBackend() {
    if(_.isEmpty(endpoints)) {
      _prepareUrl();
    }
    if(loadingPromise !== undefined) {
      // Already loading from backend, return promise
      return loadingPromise;
    } else {
      $log.debug('myCwp: Getting data from backend');
      loadingPromise = $http({
        method: 'GET',
        url: endpoints.getMine
      })
      .then(function(res) {
        $log.debug('myCwp: Loaded CWP data from backend');
        loadingPromise = undefined;
        bootstrapped = true;
        _setFromData(myCwp, res.data);
        status.recover('core.cwp');
        return myCwp;
      })
      .catch(function(err) {
        console.log(err);
        loadingPromise = undefined;
        $log.debug('myCwp: Error loading data from backend');
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
    if(bootstrapped === true) {
      return $q.resolve(myCwp);
    } else {
      $log.debug('myCwp: Bootstrapping');
      return _getFromBackend();
    }
  };

  service.refresh = function() {
    return _getFromBackend();
  };

  return service;
}


}());
