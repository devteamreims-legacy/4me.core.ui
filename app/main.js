(function() {
'use strict';
/**
 * @ngdoc overview
 * @name 4me.core
 * @description
 * # 4me.core.ui
 *
 * Main module of the application.
 */
var angular = require('angular');

// Load dependencies
require('angular-animate');
require('angular-ui-router');
require('angular-cookies');
require('angular-material');
require('angular-moment');

// Material design css
require('angular-material/angular-material.css');
require('raw!./icons/mdi.svg');

require('./config.js');
require('./organs.js');
require('./router.js');

require('./bootstrap');
require('./errors');
require('./cwp');
require('./notifications');
require('./organs');
require('./sectors');
require('./socket');
require('./status');




var m = angular
  .module('4me.core', [
      'ngAnimate',
      'ngCookies',
      'ngMaterial',
      'ui.router',
      'angularMoment',
//      '4me.core.partials',
      '4me.core.config',
      '4me.core.router',
      '4me.core.errors',
      '4me.core.organs',
      '4me.core.cwp',
      '4me.core.sectors',
      '4me.core.status',
      '4me.core.notifications',
      '4me.core.loadOrgans'
  ]);




/**
 * @ngdoc overview
 * @name 4me.core.lodash
 * @description
 * # 4me.core.lodash
 *
 * Inject plain lodash lib into our application
 */
var _ = require('lodash');
angular.module('4me.core.lodash', [])
  // Inject Lodash dependancy
  .constant('_', _);

}());
