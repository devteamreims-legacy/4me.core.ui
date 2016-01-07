(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.errors.services
 * @description
 * # Errors Services
 *
 * Errors Services
 */

angular.module('4me.core.errors.services', [
  '4me.core.config',
  '4me.core.lodash'
])
.factory('errors', errors);

errors.$inject = ['$q'];
function errors($q) {
  // Array to hold our errors
  /** Error object prototype :
   * {
   *   when: Date.now() // Timestamp of the error
   *   sender: 'core' // String to hold our sender module
   *   type: 'error' // String to hold our error type (critical, warning, info)
   *   message: 'Invalid info from backend' // String to hold our user friendly info
   *   reason: {} // Object with more detailed stuff
   * }
   */

  var errors = [];
  var service = {};
  var unreadCount = 0;

  // Promise version of our error catcher
  service.catch = function(sender, type, message) {
    return function(reason) {
      var e = service.add(sender, type, message, reason);
      return $q.reject(new Error(e));
    };
  };

  // Add an error
  service.add = function(sender, type, message, reason) {
    var e = {
      when: Date.now(),
      sender: sender || 'Unknown',
      type: type || 'warning',
      message: message || 'Unknown message',
      reason: reason || {}
    };
    errors.unshift(e);
    unreadCount++;
    return e;
  };

  // Get all errors
  service.get = function() {
    return errors;
  };

  service.getUnreadCount = function() {
    return unreadCount;
  };

  service.clearUnreadCount = function() {
    unreadCount = 0;
  };

  return service;

}

}());
