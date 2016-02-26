import cwpInterceptor from './cwp/interceptor.js';

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
  'ngCookies',
  '4me.core.cwp.interceptor'
])
  // Object to map microservices URLs
  .constant('ApiUrls', {
    mapping: {
      rootPath: 'http://' + window.location.hostname + ':3100', // Root path
      // Api end points relative to the root path
      cwp: {getMine: '/cwp/getMine'},
      sectors: {getMine: '/mapping/cwp/'} // + cwpId
    },
    sectors: {
      rootPath: 'http://' + window.location.hostname + ':3100',
      tree: '/sectors/'
    },
    socket: 'http://' + window.location.hostname + ':3100'
  })
  .config(mdiToAngularMaterial)
  .config(applyThemes)
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
    .accentPalette('deep-purple', {
      'default': '400'
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

addCwpInterceptor.$inject = ['$httpProvider'];
function addCwpInterceptor($httpProvider) {
  $httpProvider.interceptors.push('cwpInterceptor');
}

setCookieDefaults.$inject = ['$cookiesProvider'];
function setCookieDefaults($cookiesProvider) {
  // See here : https://docs.angularjs.org/api/ngCookies/provider/$cookiesProvider
  // Nothing yet
  $cookiesProvider;
  return;
}
