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
  'ui.router'
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
  .config(setCookieDefaults);




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
  // See here : http://stackoverflow.com/questions/28237952/angularjs-ui-router-how-to-resolve-typical-data-globally-for-all-routes

  $stateProvider
  .state('bootstrap-error', {
    url: '/',
    templateUrl: "views/bootstrap/error.html"
  })
  .state('dashboard', {
    url: '/dashboard',
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

addCwpInterceptor.$inject = ['$httpProvider'];
function addCwpInterceptor($httpProvider) {
  $httpProvider.interceptors.push('cwpInterceptor');
}

setCookieDefaults.$inject = ['$cookiesProvider'];
function setCookieDefaults($cookiesProvider) {
  return;
}

}());
