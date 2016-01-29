(function() {
'use strict';
/**
 * @ngdoc overview
 * @name 4me.core.config
 * @description
 * # 4me.core.config
 *
 * Configuration module of the application
 */

angular.module('4me.core.config', [
  'ngMaterial',
  '4me.core.cwp.interceptor',
  'ui.router',
  '4me.core.bootstrap'
])
  // Object to map microservices URLs
  .constant('ApiUrls', {
    mapping: {
      rootPath: 'http://localhost:3000', // Root path
      // Api end points relative to the root path
      cwp: {getMine: '/cwp/getMine'},
      sectors: {getMine: '/mapping/cwp/'} // + cwpId
    },
    sectors: {
      rootPath: 'http://localhost:3000',
      tree: '/sectors/'
    },
    socket: 'http://localhost:3000'
  })
  .config(mdiToAngularMaterial)
  .config(applyThemes)
  .config(addDefaultStates)
  .config(addCwpInterceptor)
  .config(setCookieDefaults)
  .run(stateErrorCatcher);




mdiToAngularMaterial.$inject = ['$mdIconProvider'];
function mdiToAngularMaterial($mdIconProvider) {
  $mdIconProvider.defaultIconSet('fonts/mdi.svg');
}

applyThemes.$inject = ['$mdThemingProvider'];
function applyThemes($mdThemingProvider) {
  // We should define a dark theme here, but this is not working consistently with ngMaterial
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('green', {
      'default': '600'
    })
    .warnPalette('deep-orange', {
      'default': '500'
    })
    .dark()
    ;
  $mdThemingProvider.theme('success-warning')
    .primaryPalette('green', {
      'default': '600'
    })
    .warnPalette('orange', {
      'default': '800'
    })
    .accentPalette('red')
    .dark()
    ;
  $mdThemingProvider.theme('info-warn-crit')
    .primaryPalette('blue')
    .accentPalette('red')
    .warnPalette('orange')
    .dark()
    ;
}

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

addCwpInterceptor.$inject = ['$httpProvider'];
function addCwpInterceptor($httpProvider) {
  $httpProvider.interceptors.push('cwpInterceptor');
}

setCookieDefaults.$inject = ['$cookiesProvider'];
function setCookieDefaults($cookiesProvider) {
  return;
}

}());
