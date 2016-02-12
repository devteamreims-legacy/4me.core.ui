import services from './services';
import components from './components';

/**
 * @ngdoc overview
 * @name 4me.core.sectors
 * @description
 * # Sectors module
 *
 * Meta module to include sectors components/services
 */
angular.module('4me.core.sectors', [
  '4me.core.sectors.services',
  '4me.core.sectors.components'
]);
