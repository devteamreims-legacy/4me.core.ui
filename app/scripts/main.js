(function() {
'use strict';
/**
 * @ngdoc overview
 * @name 4me.core.ui
 * @description
 * # 4me.core.ui
 *
 * Main module of the application.
 */
var m = angular
  .module('4me.core', [
      'ngAnimate',
      'ngCookies',
      'ngMessages',
      'ngSanitize',
      'ngMaterial',
      'ui.router',
      '4me.core.partials',
      '4me.core.bootstrap',
      '4me.core.cwp'
  ]);


angular.module('4me.core.bootstrap', [])
  // Inject Lodash dependancy
  .constant('_', window._);

}());
