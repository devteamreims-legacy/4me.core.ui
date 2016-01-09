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

fmeStatusButtonController.$inject = ['coreStatusService'];
function fmeStatusButtonController(coreStatusService) {
  var fmeStatusButton = this;

  fmeStatusButton.getStatus = function() {
    return coreStatusService.get();
  };

  fmeStatusButton.disableClick = function() {
    return true;
    return fmeStatusButton.getStatus().status === 'normal';
  };

  fmeStatusButton.getIcon = function() {
    switch (fmeStatusButton.getStatus().status) {
      case 'normal':
        return 'check';
      case 'warn':
        return 'alert';
      default:
      case 'critical':
        return 'close-circle';
    }
    return 'check';
  };

  fmeStatusButton.getClass = function() {
    switch (fmeStatusButton.getStatus().status) {
      case 'normal':
        return '';
      case 'warn':
        return 'md-warn';
      default:
      case 'critical':
        return 'md-accent';
    }
  };
}

}());