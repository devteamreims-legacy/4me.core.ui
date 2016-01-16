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
  '4me.core.status',
  '4me.core.socket'
]);

cwpServices.factory('myCwp', myCwp);

myCwp.$inject = ['_', '$q', 'ApiUrls', '$http', 'errors', 'cwpInterceptor', 'status', 'mainWebSocket'];
function myCwp(_, $q, ApiUrls, $http, errors, cwpInterceptor, status, mainWebSocket) {
  var myCwp = {};
  var loadingPromise;
  var service = {};
  var endpoints = {};

  mainWebSocket.on('cwp:refresh', function(data) {
    console.log('Got refresh signal from socket');
    _getFromBackend();
    return;
  });

  // This belongs in a separate service
  function _prepareUrl() {
    endpoints.getMine = ApiUrls.mapping.rootPath + ApiUrls.mapping.cwp.getMine;
    return endpoints;
  }

  function _setFromData(myCwp, data) {
    if(_.isEmpty(data)) {
      throw new Error('Argument error');
    }
    var validData = (data.id !== undefined 
                  && data.name !== undefined 
                  && data.sectors !== undefined
                  && data.sectorName !== undefined);
    if(!validData) {
      throw new Error('Argument error');
    }
    // Set internal data
    myCwp.id = data.id;
    myCwp.name = data.name;
    myCwp.sectors = data.sectors;
    myCwp.sectorName = data.sectorName;

    // Refresh cwpInterceptor
    cwpInterceptor.setId(myCwp.id);
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
      loadingPromise = $http({
        method: 'GET',
        url: endpoints.getMine
      })
      .then(function(res) {
        console.log('Loaded CWP data from backend');
        loadingPromise = undefined;
        _setFromData(myCwp, res.data);
        console.log(myCwp);
        return myCwp;
      })
      .catch(function(err) {
        console.log(err);
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
