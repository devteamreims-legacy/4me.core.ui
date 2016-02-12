import services from './services';
import components from './components';

/**
 * @ngdoc overview
 * @name 4me.core.organs
 * @description
 * # Organs module
 *
 * Meta module to include organs components/services
 * Organs are 4me submodules that wire into this framework
 */
angular.module('4me.core.organs', [
  '4me.core.organs.services',
  '4me.core.organs.components'
]);