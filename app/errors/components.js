/**
 * @ngdoc function
 * @name 4me.core.errors.components
 * @description
 * # Errors components
 * Errors components
 */
var errorComponents = angular.module('4me.core.errors.components', [
  '4me.core.errors'
]);
errorComponents.component('fmeErrorButton', {
  restrict: 'E',
  controller: fmeErrorButtonController,
  controllerAs: 'fmeErrorButton',
  templateUrl: 'views/errors/fmeErrorButton.tpl.html'
});
errorComponents.component('fmeErrorList', {
  restrict: 'E',
  controller: fmeErrorListController,
  controllerAs: 'fmeErrorList',
  templateUrl: 'views/errors/fmeErrorList.tpl.html'
});

fmeErrorListController.$inject = ['errors'];
function fmeErrorListController(errors) {
  var fmeErrorList = this;
  fmeErrorList.errors = errors.get();

  fmeErrorList.getIcon = function(error) {
    if(error.type === 'critical') {
      return 'close-circle';
    } else if(error.type === 'warning') {
      return 'alert';
    } else {
      return 'information';
    }
  };

  fmeErrorList.getClass = function(error) {
    if(error.type === 'critical') {
      return 'md-accent';
    } else if(error.type === 'warning') {
      return 'md-warn';
    } else {
      return 'md-primary';
    }
  };
}

fmeErrorButtonController.$inject = ['errors', '$mdDialog'];
function fmeErrorButtonController(errors, $mdDialog) {
  var fmeErrorButton = this;
  
  fmeErrorButton.getUnreadCount = function() {
    return errors.getUnreadCount();
  };

  fmeErrorButton.showDialog = function(ev) {
    $mdDialog.show({
      templateUrl: 'views/errors/fmeErrorDialog.tpl.html',
      parent: angular.element(document).find('body'),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }
}
