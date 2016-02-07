(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.sectors
 * @description
 * # Sectors module
 *
 * Meta module to include sectors components/services
 */

require('./sectors.components.js');
require('./sectors.services.js');

angular.module('4me.core.sectors', [
  '4me.core.sectors.services',
  '4me.core.sectors.components'
]);

}());
