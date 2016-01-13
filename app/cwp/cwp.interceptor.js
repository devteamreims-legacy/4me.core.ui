(function() {
'use strict';

/**
 * @ngdoc function
 * @name 4me.core.cwp.interceptor
 * @description
 * # CWP http interceptor
 * This http interceptor adds a custom header containing our cwp id
 */

angular.module('4me.core.cwp.interceptor', [
  '4me.core.cwp.services'
])
  .factory('cwpInterceptor', cwpInterceptor);

function cwpInterceptor() {
  var service = {};

  var cwpId;

  service.setId = function(id) {
    cwpId = id;
  }

  service.request = function(config) {
    if(cwpId) {
      config.headers['x-4me-cwp-id'] = cwpId;
    }
    return config;
  };

  return service;
}

}());
