import config from './config.js';
import organsLoader from './organs.js';
import router from './router.js';

import bootstrap from './bootstrap/';
import cwp from './cwp/';
import errors from './errors/';
import notifications from './notifications/';
import organs from './organs/index.js';
import sectors from './sectors/';
import socket from './socket/';
import status from './status/';

import _ from 'lodash';

/**
 * @ngdoc overview
 * @name 4me.core
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
      'angularMoment',
      '4me.core.organs',
      '4me.core.partials',
      '4me.core.config',
      '4me.core.errors',
      '4me.core.cwp',
      '4me.core.sectors',
      '4me.core.status',
      '4me.core.notifications',
      '4me.core.loadOrgans',
      '4me.core.router'
  ]);

m.config(addSourceMapSupport);

addSourceMapSupport.$inject = ['$provide'];
function addSourceMapSupport($provide) {

  // Fix sourcemaps
  // @url https://github.com/angular/angular.js/issues/5217#issuecomment-50993513
  $provide.decorator('$exceptionHandler', sourcemap);
  
  sourcemap.$inject = ['$delegate'];
  function sourcemap($delegate) {
    return function(exception, cause) {
      $delegate(exception, cause);
      setTimeout(function() {
        console.error(exception.stack);
      });
    };
  }
}


/**
 * @ngdoc overview
 * @name 4me.core.lodash
 * @description
 * # 4me.core.lodash
 *
 * Inject plain lodash lib into our application
 */
angular.module('4me.core.lodash', [])
  // Inject Lodash dependancy
  .constant('_', _);

