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
      return false;
    }

    var o = {};
    o.name = organ.name;
    o.getNotifications = organ.getNotifications;
    o.getStatus = organ.getStatus;
    o.navigateTo = function() {
      console.log('Navigating to organ : ' + organ.name);
      organ.navigateTo();
    };

    organs.push(o);
    return o;

  };

  return service;
}


}());
