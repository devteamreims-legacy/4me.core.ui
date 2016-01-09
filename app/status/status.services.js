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

coreStatusService.$inject = ['_'];
/**
 * This has the power to block the whole app
 */
function coreStatusService(_) {
  var service = {};

  var _normalStatus = {
    status: 'normal', // normal, warn, critical
    message: '',
    reasons: []
  };

  var status = _.clone(_normalStatus);

  service.get = function() {
    return status;
  };

  service.recover = function() {
    status = _.clone(_normalStatus);
    return this.get();
  };

  service.escalate = function(newStatus, message, reasons) {
    status.status = newStatus || 'warn';
    status.message = message || 'Unknown reason !';
    status.reasons = reasons || [];
    return this.get();
  };

  return service;
}

}());