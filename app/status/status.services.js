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
    reasons: []
  };

  // Initialize with normal status
  var status = _.clone(_normalStatus);

  function _reevaluateGlobalStatus() {
    var newStatus = 'normal';
    _.each(status.reasons, function(r) {
      if(r.criticity === 'warning') {
        if(newStatus === 'critical') {
          return;
        }
        newStatus = 'warning';
      }
      if(r.criticity === 'critical') {
        newStatus = 'critical';
      }
    });

    status.status = newStatus;
  }

  service.get = function() {
    return status;
  };

  service.recover = function(sender) {
    _.remove(status.reasons, function(r) {
      return r.sender === sender;
    });
    _reevaluateGlobalStatus();
    return this.get();
  };

  service.escalate = function(sender, criticity, message, reasons) {
    var reason = {};
    reason.when = Date.now();
    reason.sender = sender;
    reason.criticity = criticity || 'warning';
    reason.message = message || 'Unknown reason !';

    status.reasons.unshift(reason);
    _reevaluateGlobalStatus();

    return this.get();
  };

  return service;
}

}());