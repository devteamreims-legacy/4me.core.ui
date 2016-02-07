(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.errors
 * @description
 * # Error management module
 *
 * Meta module to include error components/services
 */

require('./errors.components.js');
require('./errors.services.js');

angular.module('4me.core.errors', [
  '4me.core.errors.services',
  '4me.core.errors.components'
]);

}());
