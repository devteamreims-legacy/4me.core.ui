(function() {
'use strict';
/**
 * @ngdoc overview
 * @name 4me.ui.stub
 * @description
 * # 4me.ui.stub
 *
 * Stub organ, using 4me.core.ui hooks
 * Register our organ into the main app here
 */
var m = angular
  .module('4me.ui.stub', [
      'ui.router',
      '4me.core.config',
      '4me.core.errors',
      '4me.core.organs.services'
  ]);

/**
 * @ngdoc overview
 * @name 4me.ui.stub
 * @description
 * # 4me.ui.stub register states
 *
 * Register organ states here
 */

m.config(stubConfig);
m.run(stubRegistration);

stubConfig.$inject = ['$stateProvider'];
function stubConfig($stateProvider) {
  $stateProvider.state('stub', {
    url: '/stub',
    templateUrl: 'views/stub/index.tpl.html',
    controller: stubController,
    controllerAs: 'stub'
  });
};

stubRegistration = ['mainOrganService'];
function stubRegistration(mainOrganService) {

  var getNotifications = function() {
    return [];
  };

  mainOrganService.register({
    name: 'stub',
    rootState: 'stub',
    getNotifications: getNotifications
  });
}

/**
 * @ngdoc overview
 * @name 4me.ui.stub
 * @description
 * # Decorator for core functions
 *
 * Provides decorated services for core functions :
 * * Error management
 * * Notifications
 *
 */

m.factory('stub.errors', stubErrors);

stubErrors.$inject = ['_', 'errors'];
function stubErrors(_, errors) {
  var service = {};
  service.add = function(type, message, reason) {
    return errors.add('stub', type, message, reason);
  };

  service.catch = function(type, message) {
    return errors.catch('stub', type, message);
  };

  return _.defaults(service, errors);
}


stubController.$inject = ['stub.errors'];
function stubController(errors) {
  var stub = this;

  stub.addError = function() {
    errors.add('warning', 'info', 'test');
  };
}
}());
