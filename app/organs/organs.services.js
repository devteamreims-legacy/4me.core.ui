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
  '4me.core.lodash',
  'ui.router'
])
.factory('mainOrganService', mainOrganService);


mainOrganService.$inject = ['_', '$state'];
function mainOrganService(_, $state) {
  var service = {};
  var organs = [];

  service.getAll = function() {
    return organs;
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
      },
      {
        name: 'STUB',
        navigateTo: function() {
          console.log('Navigating to stub');
          $state.go('stub');
        }
      }
    ];
  };

  service.register = function(organ) {
    /**
     * Expects an object with this format :
     * {
     *    name: 'OrganName',
     *    rootState: 'rootState',
     *    getNotifications: function (returns an array of notifications)
     * }
     */
    if(_.findIndex(organs, { name: organ.name }) !== -1) {
      console.log('Organ ' + organ.name + ' already registered !');
      return;
    }

    var o = {};
    o.name = organ.name;
    o.getNotifications = organ.getNotifications;
    o.navigateTo = function() {
      console.log('Navigating to state : ' + organ.rootState + ' (organ : ' + organ.name + ')');
      $state.go(organ.rootState)
    };

    organs.push(o);
    return o;

  };

  return service;
}


}());
