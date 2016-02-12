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
      '4me.core.notifications',
      '4me.core.errors',
      '4me.core.organs.services',
      '4me.core.status'
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
    templateUrl: 'views/stub/app/index.tpl.html',
    controller: stubController,
    controllerAs: 'stub'
  });
};

stubRegistration.$inject = ['mainOrganService', '$state', '$injector', 'stub.notifications'];
function stubRegistration(mainOrganService, $state, $injector, notifications) {

  console.log('Notifications');
  console.log(notifications);
  var r = mainOrganService.register({
    name: 'stub',
    navigateTo: function() {
      $state.go('stub');
      this.getNotificationService().markAllAsRead();
    },
    getNotificationService: function() {
      return $injector.get('stub.notifications');
    },
    getStatusService: function() {
      return $injector.get('stub.status');
    }
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

  return _.defaults(service, errors);
}

m.factory('stub.notifications', stubNotifications);

stubNotifications.$inject = ['_', 'notifications'];
function stubNotifications(_, notifications) {
  var service = {};

  service.add = function(priority, title, props) {
    return notifications.add('stub', priority, title, props);
  };

  service.get = function() {
    return _.filter(notifications.get(), function(n) {
      return n.sender === 'stub';
    })
  };

  return _.defaults(service, _.clone(notifications));
}


// We need another full service here, not some proxy status service
m.factory('stub.status', stubStatus);

stubStatus.$inject = ['statusFactory'];
function stubStatus(statusFactory) {
  var service = statusFactory.get('stub');
  return service;
}


stubController.$inject = ['stub.errors', 'stub.notifications', '$state'];
function stubController(errors, notifications, $state) {
  var stub = this;

  stub.addError = function() {
    errors.add('warning', 'info', 'test');
  };

  stub.addNotification = function(priority) {
    var navigateTo = function() {
      console.log('Going to stub via notification');
      $state.go('stub');
    }
    var randomString = Math.random().toString(36).substring(7);
    notifications.add(priority || 'info', 'Test notification ' + randomString, {message: 'Test message', navigateTo: navigateTo});
  };
}
