import _ from 'lodash';

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
  'ui.router'
])
.factory('mainOrganService', mainOrganService);


mainOrganService.$inject = [];
function mainOrganService() {
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
     *    navigateTo: function() // Callback to navigate to the organ
     *    getNotificationService: function() // Callback which returns a notification service for the organ
     *    getStatusService: function() // Callback which returns the status service for the organ
     * }
     */
    if(_.findIndex(organs, { name: organ.name }) !== -1) {
      console.log('Organ ' + organ.name + ' already registered !');
      return false;
    }

    var o = {};
    o.name = organ.name;
    o.getNotificationService = organ.getNotificationService;
    o.getStatusService = organ.getStatusService;
    o.navigateTo = function() {
      console.log('Navigating to organ : ' + organ.name);
      organ.navigateTo();
    };

    organs.push(o);
    return o;

  };

  service.find = function(name) {
    return _.find(organs, { name: name });
  };



  return service;
}