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
  controllerAs: 'fmeNotificationButton',
  templateUrl: 'views/notifications/button/button.tpl.html'
});

notificationButton.component('fmeNotificationIcon', {
  restrict: 'E',
  bindings: {
    organName: '@',
    hideEmpty: '@'
  },
  controller: fmeNotificationIconController,
  controllerAs: 'fmeNotificationIcon',
  templateUrl: 'views/notifications/button/icon.tpl.html'
});


fmeNotificationIconController.$inject = ['notifications', 'mainOrganService'];
function fmeNotificationIconController(notifications, mainOrganService) {
  var fmeNotificationIcon = this;

  function getNotificationService() {
    if(
      fmeNotificationIcon.organName !== undefined
      && fmeNotificationIcon.organName !== ''
    ) { // We have a supplied organName
      var o = mainOrganService.find(fmeNotificationIcon.organName);
      if(o !== undefined) {
        return o.getNotificationService();
      }
    }
    return notifications;
  }

  fmeNotificationIcon.showIcon = function() {
    return fmeNotificationIcon.getUnreadCount() !== 0 || !fmeNotificationIcon.hideEmpty;
  };

  fmeNotificationIcon.getUnreadCount = function() {
    var s = getNotificationService();
    return s.getUnreadCount();
  };

  fmeNotificationIcon.getClass = function() {
    var s = getNotificationService();
    switch(s.getUnreadHighestPriority()) {
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

  fmeNotificationIcon.getIcon = function() {
    var c = fmeNotificationIcon.getUnreadCount();
    if(c === 0) {
      // No notification
      return 'message';
    }
    if(c > 9) {
      c = '9-plus';
    }

    return 'numeric-' + c + '-box';
  };
}

fmeNotificationButtonController.$inject = ['$mdDialog'];
function fmeNotificationButtonController($mdDialog) {
  var fmeNotificationButton = this;

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
