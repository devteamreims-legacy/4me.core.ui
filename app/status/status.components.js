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
  '4me.core.status',
  'angularMoment'
]);

statusComponents.component('fmeStatusButton', {
  restrict: 'E',
  controller: fmeStatusButtonController,
  controllerAs: 'fmeStatusButton',
  templateUrl: 'views/status/fmeStatusButton.tpl.html'
});

statusComponents.component('fmeStatusIcon', {
  restrict: 'E',
  bindings: {
    props: '='
  },
  controller: fmeStatusIconController,
  controllerAs: 'fmeStatusIcon',
  templateUrl: 'views/status/fmeStatusIcon.tpl.html'
});

fmeStatusButtonController.$inject = ['status', '$state'];
function fmeStatusButtonController(status, $state) {
  var fmeStatusButton = this;
  var currentStatus = status.get();

  fmeStatusButton.getStatus = function() {
    currentStatus = status.get();
    return currentStatus;
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

fmeStatusIconController.$inject = [];
function fmeStatusIconController() {
  var fmeStatusIcon = this;

  fmeStatusIcon.getIconName = function() {
    switch (fmeStatusIcon.props.status) {
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

  fmeStatusIcon.getClass = function() {
    var r = '';
    if(fmeStatusIcon.props.mdAvatar && fmeStatusIcon.props.mdAvatar === true) {
      r = 'md-avatar-icon ';
    }
    switch (fmeStatusIcon.props.status) {
      case 'normal':
        r += 'md-primary';
        break;
      case 'warning':
        r += 'md-warn';
        break;
      default:
      case 'critical':
        r += 'md-accent';
        break;
    }
    return r;
  };
}

}());
