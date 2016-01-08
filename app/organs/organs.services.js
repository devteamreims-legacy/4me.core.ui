(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.organs.services
 * @description
 * # Organs services
 *
 * Services related to organs
 *
 */
angular.module('4me.core.organs.services', [
  'ui.router',
])
.factory('mainOrganService', mainOrganService);


mainOrganService.$inject = ['$state'];
function mainOrganService($state) {
  var service = {};

  service.getAll = function() {
    return [
      {
        name: 'XMAN',
        navigateTo: function() {
          console.log('Navigating to xman');
          $state.go('xman');
        }
      },
      {
        name: 'ARCID',
        navigateTo: function() {
          console.log('Navigating to arcid');
          $state.go('arcid');
        }
      }
    ];
  };

  return service;
}


}());
