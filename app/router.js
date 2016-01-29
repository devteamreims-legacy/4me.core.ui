(function() {
'use strict';
/**
 * @ngdoc overview
 * @name 4me.core.router
 * @description
 * # 4me.core.router
 *
 * Configuration module of the router
 */

angular.module('4me.core.router', [
  'ui.router',
  '4me.core.bootstrap'
])
  .config(addDefaultStates)
  .run(stateErrorCatcher);
  
addDefaultStates.$inject = ['$stateProvider', '$urlRouterProvider'];
function addDefaultStates($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  

  $stateProvider
  .state('bootstrap-error', {
    url: '/bootstrap-error',
    templateUrl: "views/bootstrap/error.html"
  });

  $stateProvider
  // See here : http://stackoverflow.com/questions/28237952/angularjs-ui-router-how-to-resolve-typical-data-globally-for-all-routes
  .state('bootstrapped', {
    abstract: true,
    template: '<div ui-view=""></div>',
    resolve: ['bootstrapper', function(bootstrapper) { return bootstrapper.bootstrap(); }]
  })
  .state('dashboard', {
    parent: 'bootstrapped',
    url: '/',
    templateUrl: "views/dashboard/index.html"
  })
  .state('errors', {
    url: '/errors',
    templateUrl: "views/errors/index.html"
  })
  .state('notifications', {
    url: '/notifications',
    templateUrl: "views/notifications/index.html"
  });
}

stateErrorCatcher.$inject = ['$log', '$rootScope', '$state'];
function stateErrorCatcher($log, $rootScope, $state) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, err) {
    $log.debug('Cannont navigate to ' + toState.url + ' : Async dependencies not resolved');
    $state.go('bootstrap-error');
  });
}

}());