(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.notifications
 * @description
 * # Notification management module
 *
 * Meta module to include notification components/services
 */

require('./notifications.components.js');
require('./notifications.services.js');

angular.module('4me.core.notifications', [
  '4me.core.notifications.services',
  '4me.core.notifications.components'
]);

}());
