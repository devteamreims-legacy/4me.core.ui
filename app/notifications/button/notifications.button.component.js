(function() {
'use strict';

/**
 * @ngdoc function
 * @name 4me.core.notifications.button
 * @description
 * # Notification button
 * A set of directives to handle a notification button/icon
 */

var notificationButton = angular.module('4me.core.notifications.button', [
  '4me.core.notifications',
  'ngMaterial',
  '4me.core.organs.services'
]);



notificationButton.component('fmeNotificationButton', {
  restrict: 'E',
  bindings: {
    organName: '@',
    noDialog: '@',
  },
  controller: fmeNotificationButtonController,
  templateUrl: 'views/notifications/button/button.tpl.html'
});


fmeNotificationButtonController.$inject = ['notifications', '$mdDialog', 'mainOrganService'];
function fmeNotificationButtonController(notifications, $mdDialog, mainOrganService) {
  var fmeNotificationButton = this;

  fmeNotificationButton.getUnreadCount = function() {
    if(fmeNotificationButton.organName !== undefined) { // We have a
      var o = mainOrganService.find(fmeNotificationButton.organName);
      if(o !== undefined) {
        return o.getNotificationService().getUnreadCount();
      }
      else {
        return 0;
      }
    }
    return notifications.getUnreadCount();
  };

  fmeNotificationButton.getClass = function() {
    switch(notifications.getUnreadHighestPriority()) {
      case false:
      default:
        return '';
      case 'info':
        return 'md-primary';
      case 'warning':
        return 'md-warn';
      case 'critical':
        return 'md-accent';
    }
  };

  fmeNotificationButton.getIcon = function() {
    var c = fmeNotificationButton.getUnreadCount();
    if(c === 0) {
      // No notification
      return 'message';
    }
    if(c > 9) {
      c = '9-plus';
    }

    return 'numeric-' + c + '-box';
  };

  fmeNotificationButton.showDialog = function(ev) {
    if(fmeNotificationButton.noDialog !== undefined) {
      return;
    }
    $mdDialog.show({
      templateUrl: 'views/notifications/fmeNotificationDialog.tpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };
}

}());
