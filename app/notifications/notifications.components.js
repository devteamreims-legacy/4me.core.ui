(function() {
'use strict';

/**
 * @ngdoc function
 * @name 4me.core.notifications.components
 * @description
 * # Notification components
 * Notification components
 */
var notificationComponents = angular.module('4me.core.notifications.components', [
  '4me.core.lodash',
  '4me.core.notifications'
]);

notificationComponents.component('fmeNotificationButton', {
  restrict: 'E',
  controller: fmeNotificationButtonController,
  templateUrl: 'views/notifications/fmeNotificationButton.tpl.html'
});
notificationComponents.component('fmeNotificationList', {
  restrict: 'E',
  controller: fmeNotificationListController,
  templateUrl: 'views/notifications/fmeNotificationList.tpl.html'
})


fmeNotificationListController.$inject = ['notifications', '$mdDialog'];
function fmeNotificationListController(notifications, $mdDialog) {
  var fmeNotificationList = this;
  fmeNotificationList.notifications = notifications.get();
  fmeNotificationList.unreadCount = notifications.getUnreadCount();

  fmeNotificationList.getIcon = function(n) {
    if(n.priority === 'critical') {
      return 'close-circle';
    } else if(n.priority.type === 'warning') {
      return 'alert';
    } else {
      return 'information';
    }
  };

  fmeNotificationList.getClass = function(n) {
    if(n.priority === 'critical') {
      return 'md-accent';
    } else if(n.priority === 'warning') {
      return 'md-warn';
    } else {
      return 'md-primary';
    }
  };

  fmeNotificationList.click = function(callback) {
    $mdDialog.hide();
    callback();
  };
}

fmeNotificationButtonController.$inject = ['notifications', '$mdDialog'];
function fmeNotificationButtonController(notifications, $mdDialog) {
  var fmeNotificationButton = this;
  
  fmeNotificationButton.getUnreadCount = function() {
    return notifications.getUnreadCount();
  };

  fmeNotificationButton.showDialog = function(ev) {
    $mdDialog.show({
      templateUrl: 'views/notifications/fmeNotificationDialog.tpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };
}

}());