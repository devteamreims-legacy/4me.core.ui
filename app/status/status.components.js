(function() {
'use strict';

/**
 * @ngdoc function
 * @name 4me.core.status.components
 * @description
 * # Status components
 * Status components
 */
var statusComponents = angular.module('4me.core.status.components', [
  '4me.core.lodash',
  '4me.core.status'
]);

statusComponents.component('fmeStatusButton', {
  restrict: 'E',
  controller: fmeStatusButtonController,
  templateUrl: 'views/status/fmeStatusButton.tpl.html'
});

fmeStatusButtonController.$inject = ['status', '$state'];
function fmeStatusButtonController(status, $state) {
  var fmeStatusButton = this;

  fmeStatusButton.getStatus = function() {
    return status.get();
  };

  fmeStatusButton.click = function() {
    $state.go('status');
    return;
  }

  fmeStatusButton.disableClick = function() {
    return true;
    return fmeStatusButton.getStatus().status === 'normal';
  };

  fmeStatusButton.getIcon = function() {
    switch (fmeStatusButton.getStatus().status) {
      case 'normal':
        return 'check';
        break;
      case 'warning':
        return 'alert';
        break;
      default:
      case 'critical':
        return 'close-circle';
        break;
    }
  };

  fmeStatusButton.getClass = function() {
    switch (fmeStatusButton.getStatus().status) {
      case 'normal':
        return '';
      case 'warning':
        return 'md-warn';
      default:
      case 'critical':
        return 'md-accent';
    }
  };
}

}());
