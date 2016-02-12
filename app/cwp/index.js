import services from './services';
import components from './components';
import interceptor from './interceptor';

/**
 * @ngdoc overview
 * @name 4me.core.cwp
 * @description
 * # CWP module
 *
 * Meta module to include cwp components
 */
angular.module('4me.core.cwp', [
  '4me.core.cwp.services',
  '4me.core.cwp.components',
  '4me.core.cwp.interceptor'
]);

