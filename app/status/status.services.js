(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.status.services
 * @description
 * # Status Services
 * Status Services
 */

var statusServices = angular.module('4me.core.status.services', [
  '4me.core.lodash',
  '4me.core.config',
  '4me.core.notifications.services',
  '4me.core.organs',
  '4me.core.errors'
]);

statusServices.factory('coreStatusService', coreStatusService);

coreStatusService.$inject = [];
function coreStatusService() {
  var service = {};

  service.get = function() {
    return {
      status: 'normal',
      message: '',
      reasons: []
    };
  };

  return service;
}

}());