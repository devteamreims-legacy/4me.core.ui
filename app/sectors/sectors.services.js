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
  '4me.core.status',
  '4me.core.errors',
  '4me.core.cwp.services'
]);

sectorsServices.factory('treeSectors', treeSectors);
sectorsServices.factory('mySector', mySector);

treeSectors.$inject = ['_', 'ApiUrls', '$http', 'errors', '$q', 'status'];
function treeSectors(_, ApiUrls, $http, errors, $q, status) {
  var service = {};
  var loadingPromise;
  var tree = [];
  var elementary = [];

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
      _.each(tree, function(s) {
        if(s.elementarySectors.length === 1) {
          elementary.push(s.name);
        }
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
      return _.isEqual(t.elementarySectors.sort(), s);
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

mySector.$inject = ['_', '$q', 'ApiUrls', '$http', 'errors', 'status', 'mainWebSocket', 'myCwp'];
function mySector(_, $q, ApiUrls, $http, errors, status, mainWebSocket, myCwp) {
  var mySectors = {};
  var loadingPromise;
  var service = {};
  var endpoints = {};

  mainWebSocket.on('mapping:refresh', function(data) {
    console.log('Got refresh signal from socket');
    _getFromBackend();
    return;
  });

  // This belongs in a separate service
  function _prepareUrl() {
    endpoints.getMine = ApiUrls.mapping.rootPath + ApiUrls.mapping.sectors.getMine;
    return endpoints;
  }

  function _setFromData(data) {
    if(_.isEmpty(data)) {
      throw new Error('Argument error');
    }
    var validData = parseInt(data.cwpId) !== 0
                    && data.sectors !== undefined;

    if(!validData) {
      throw new Error('Argument error');
    }
    // Set internal data
    mySectors.sectors = data.sectors;
    return mySectors;
  }

  function _getFromBackend() {
    // myCwp should be bootstrapped
    if(_.isEmpty(endpoints)) {
      _prepareUrl();
    }

    if(loadingPromise !== undefined) {
      // Already loading from backend, return promise
      return loadingPromise;
    } else {
      // We need to know our cwpId, bootstrap myCwp
      loadingPromise = myCwp.bootstrap()
      .then(function(cwp) {
        // If our type is not cwp, backend won't respond
        if(cwp.type !== 'cwp') {
          var res = {
            data: {
              cwpId: cwp.id,
              sectors: []
            }
          };
          // Backend won't respond with data, mock response from backend
          return $q.resolve(res);
        }
        return $http.get(endpoints.getMine + cwp.id);
      })
      .then(function(res) {
        console.log('Loaded mySector data from backend');
        loadingPromise = undefined;
        _setFromData(res.data);
        console.log(mySectors);
        return mySectors;
      })
      .catch(function(err) {
        console.log(err);
        loadingPromise = undefined;
        console.log('Catching error');
        var e = errors.add('core.sectors', 'critical', 'Could not load our sectors from backend', err);
        status.escalate('core.sectors', 'critical', 'Could not load our sectors from backend', e);
        return $q.reject(err);
      });

      return loadingPromise;
    }
  }

  service.get = function() {
    return mySectors;
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
