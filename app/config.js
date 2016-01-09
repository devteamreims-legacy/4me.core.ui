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
  'ngMaterial'
])
  // Object to map microservices URLs
  .constant('ApiUrls', {
    mapping: {
      rootPath: 'http://mapping.4me', // Root path our this micro service
      // Api end points relative to the root path
      cwp: {getMine: '/cwp/getMine'},
      sectors: {getMine: '/sectors/getMine'}
    }
  })
  .config(mdiToAngularMaterial)
  .config(applyTheme)
  .config(addDefaultStates);




mdiToAngularMaterial.$inject = ['$mdIconProvider'];
function mdiToAngularMaterial($mdIconProvider) {
  $mdIconProvider.defaultIconSet('fonts/mdi.svg');
}

applyTheme.$inject = ['$mdThemingProvider'];
function applyTheme($mdThemingProvider) {
  // We should define a dark theme here, but this is not working consistently with ngMaterial
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('green', {
      'default': '600'
    })
    .warnPalette('deep-orange', {
      'default': '500'
    })
    ;
  $mdThemingProvider.theme('success-warning')
    .primaryPalette('green', {
      'default': '600'
    })
    .accentPalette('orange', {
      'default': '800'
    })
    .warnPalette('red')
    ;
  $mdThemingProvider.theme('info-warn-crit')
    .primaryPalette('blue')
    .accentPalette('red')
    .warnPalette('orange');
}

addDefaultStates.$inject = ['$stateProvider', '$urlRouterProvider'];
function addDefaultStates($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
  .state('dashboard', {
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
}());