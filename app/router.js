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

require('./bootstrap/');

angular.module('4me.core.router', [
  'ui.router',
  '4me.core.bootstrap'
])
  .config(addDefaultStates)
  .run(stateErrorCatcher);
  
addDefaultStates.$inject = ['$stateProvider', '$urlRouterProvider'];
function addDefaultStates($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  
  var templates = {};
  templates.bootstrapError = require('./bootstrap/error.html');
  templates.dashboard = require('./dashboard/index.html');
  templates.errors = require('./errors/index.html');
  templates.notifications = require('./notifications/index.html');
  
  $stateProvider
  .state('bootstrap-error', {
    url: '/bootstrap-error',
    template: templates.bootstrapError
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
    template: templates.dashboard
  })
  .state('errors', {
    url: '/errors',
    template: templates.errors
  })
  .state('notifications', {
    url: '/notifications',
    templates: templates.notifications
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