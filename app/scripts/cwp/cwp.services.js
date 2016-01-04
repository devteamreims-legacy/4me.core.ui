(function() {
'use strict';

/**
 * @ngdoc function
 * @name 4me.core.cwp
 * @description
 * # CWP Services
 * CWP Services
 */
var cwpServices = angular.module('4me.core.cwp.services', [
  '4me.core.lodash'
]);

cwpServices.factory('myCwp', myCwp);

myCwp.$inject = ['_', '$q'];
function myCwp(_, $q) {
  var myCwp = {};
  var loadingPromise;
  var service = {};

  function _getFromBackend() {
    if(loadingPromise !== undefined) {
      // Already loading from backend, return promise
      return loadingPromise;
    } else {
      // TODO : load from backend
      var def = $q.defer();
      loadingPromise = def.promise;
      /*.then(function(res) {
        myCwp = res;
        return myCwp;
      });
*/
      def.resolve({
        id: 34,
        name: 'CDS'
      });

      console.log('Returning :');
      console.log(loadingPromise);
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