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

mySectors.$inject = ['_', '$q', 'ApiUrls', '$http', 'errors', 'status'];
function mySectors(_, $q, ApiUrls, $http, errors, status) {
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
        loadingPromise = undefined;
        return mySectors;
      })
      .catch(function(err) {
        var e = errors.add('core.sectors', 'critical', 'Could not load our sectors from backend', err);
        status.escalate('core.sectors', 'critical', 'Could not load our sector data from backend', e);
        loadingPromise = undefined;
        return $q.reject(e);
      });

      return loadingPromise;
    }
  }

  service.get = function() {
    return mySectors;
  };

  service.refresh = function() {
    return _getFromBackend();
  };

  service.bootstrap = function() {
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
  var tree = [];
  var elementary;

  var endpoints = {};

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
        loadingPromise = undefined;
        return tree;
      })
      .catch(function(err) {
        var e = errors.add('core.sectors.treeSectors', 'critical', 'Could not load tree sectors from backend', err);
        status.escalate('core.sectors.treeSectors', 'critical', 'Could not load tree sectors data from backend', e);
        loadingPromise = undefined;
        return $q.reject(err);
      });

      return loadingPromise;
    }
  }

  service.getElementary = function() {
    if(_.isEmpty(elementary)) {
      elementary = _.filter(tree, function(s) {
        return s.elementarySectors.length === 1;
      });
    }
    return elementary;
  };

  service.getFromString = function(sectorString) {
    if(!sectorString) {
      throw new Error('Argument error');
    }
    var s = sectorString.toUpperCase();
    return _.find(tree, {name: s}) || {};
  };

  service.getFromSectors = function(sectors) {
    if(!sectors) {
      throw new Error('Argument error');
    }

    if(!(_.isString(sectors) || _.isArray(sectors))) {
      throw new Error('Argument error');
    }
    var s;
    if(_.isString(sectors)) {
      s = [sectors.toUpperCase()];
    }

    if(_.isArray(sectors)) {
      s = [];
      _.each(sectors, function(a) {
        s.push(a.toUpperCase());
      });
    }

    s.sort();

    return _.find(tree, function(t) {
      return _.isEqual(t.elementarySectors, s);
    }) || {};
  };

  service.getTree = function() {
    return tree;
  };

  service.refresh = function() {
    return _getFromBackend();
  };

  service.bootstrap = function() {
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
