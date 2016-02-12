import _ from 'lodash';

/**
 * @ngdoc overview
 * @name 4me.core.status.services
 * @description
 * # Status Services
 * Status Services
 */

var statusServices = angular.module('4me.core.status.services', [
  '4me.core.config',
  '4me.core.notifications.services',
  '4me.core.organs',
  '4me.core.errors',
  '4me.core.status'
]);

statusServices.factory('statusFactory', statusFactoryFactory);
statusServices.factory('status', coreStatusFactory);

statusFactoryFactory.$inject = [];
function statusFactoryFactory() {
  var statuses = [];
  var service = {};


  // Service constructor
  function factory(namespace) {
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

    function _globToRegExp(glob) {
      var regExp = glob || '*';
      regExp = regExp.replace('.', '\\.');
      regExp = regExp.replace('*', '.*');
      return new RegExp(regExp);
    }

    service.name = namespace;

    service.get = function() {
      return status;
    };

    service.getReasons = function(filter) {
      if(!filter) {
        return status.reasons;
      }
      return _.filter(status.reasons, function(r) {
        return r.sender.match(_globToRegExp(filter)) !== null;
      });
    };

    service.recover = function(senderGlob) {
      _.remove(status.reasons, function(r) {
        return r.sender.match(_globToRegExp(senderGlob)) !== null;
      });
      _reevaluateGlobalStatus();
      return this.get();
    };

    service.escalate = function(sender, criticity, message, reasons) {
      var reason = {};
      reason.when = Date.now();
      reason.sender = sender || 'core';
      reason.criticity = criticity || 'warning';
      reason.message = message || 'Unknown reason !';

      status.reasons.unshift(reason);
      _reevaluateGlobalStatus();

      return this.get();
    };

    return service;
  }

  service.get = function(namespace) {
    if(namespace === undefined) {
      throw new Error('argument error');
    }
    var s = _.find(statuses, {name: namespace});
    if(s === undefined) {
      s = factory(namespace);
      statuses.push(s);
    }
    return s;
  };

  return service;
}

coreStatusFactory.$inject = ['statusFactory'];
function coreStatusFactory(statusFactory) {
  return statusFactory.get('core');
}
