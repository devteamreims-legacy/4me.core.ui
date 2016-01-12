(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.notifications.services
 * @description
 * # notifications Services
 *
 * notifications Services
 */

angular.module('4me.core.notifications.services', [
  '4me.core.config',
  '4me.core.lodash'
])
.factory('notifications', notifications);

notifications.$inject = ['_', '$q'];
function notifications(_, $q) {
  /** Notification object prototype :
   * {
   *   when: Date.now() // Timestamp of the notification
   *   sender: 'core' // String to hold our sender module
   *   priority: 'critical' // String to hold our notification priority (critical, warning, info)
   *   title: 'Invalid info from backend' // String to hold our notification title
   *   message: 'A longer message' // String to hold our notification text content
   *   navigateTo: function || undefined // A function to respond to click ($state.go('somewhere'))
   *   read: false // A boolean indicating wether this notification has been read or not
   *   markAsRead: function // A function to mark this notification read
   * }
   */

  var notifications = [];
  var service = {};
  var unreadCount = 0;

  // Add an error
  service.add = function(sender, priority, title, props) {
    var n = {
      when: Date.now(),
      sender: sender || 'Unknown',
      priority: priority || 'info',
      title: title || 'Unknown title',
      message: '',
      read: false,
      markAsRead: function() {
        console.log('Marking as read ' + this.title);
        this.read = true;
        return this;
      },
      navigateTo: false
    };


    if(props && props.message) {
      n.message = props.message;
    }
    if(props && props.navigateTo) {
      n.navigateTo = function() {
        n.markAsRead();
        props.navigateTo();
      };
    }
    notifications.unshift(n);
    return n;
  };

  // Get all notifications
  service.get = function() {
    return notifications;
  };

  service.getUnreadCount = function() {
    var s = this;
    return s.getUnread().length;
  };

  service.getUnread = function() {
    var s = this;
    return _.filter(s.get(), function(n) {
      return n.read === false;
    }) || [];
  };

  service.markAllAsRead = function() {
    var s = this;
    _.each(s.getUnread(), function(n) {
      n.markAsRead();
    });
  };

  service.getUnreadHighestPriority = function() {
    var s = this;
    var ret = false;
    _.each(s.getUnread(), function(n) {
      if(n.priority === 'critical') {
        ret = 'critical';
      }
      if(n.priority === 'warning' && (ret === false || ret === 'info')) {
        ret = 'warning';
      }
      if(n.priority === 'info' && ret === false) {
        ret = 'info';
      }
    });
    return ret;
  };

  return service;

}

}());
