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
sectorsServices.factory('treeSectors', treeSectors);

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

treeSectors.$inject = ['_', 'ApiUrls', '$http', 'errors', '$q'];
function treeSectors(_, ApiUrls, $http, errors, $q) {
  var service = {};
  var loadingPromise;
  var tree;

  // This belongs in a separate service
  function _prepareUrl() {
    endpoints.getTree = ApiUrls.sectors.rootPath + ApiUrls.sectors.tree;
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
        url: endpoints.getTree,
        timeout: 200
      })
      .then(function(res) {
        tree = res.data;
        return tree;
      })
      .catch(errors.catch('core.sectors.treeSectors', 'critical', 'Could not load tree sectors data from backend'));

      return loadingPromise;
    }
  }

  service.getElementary = function() {
    return ['UR', 'XR'];
  };

  service.getFromString = function(sectorString) {

  };

  service.getTree = function() {
    if(_.isEmpty(tree)) {
      return _getFromBackend();
    } else {
      var def = $q.defer();
      def.resolve(tree);
      return def.promise;
    }
  };

  return service;
}

}());
