(function() {
'use strict';
/**
 * @ngdoc overview
 * @name 4me.ui.stub
 * @description
 * # 4me.ui.stub
 *
 * Stub organ, using 4me.core.ui hooks
 * Register our organ into the main app here
 */
var m = angular
  .module('4me.ui.stub', [
      'ui.router',
      '4me.core.partials',
      '4me.core.config',
      '4me.core.errors',
      '4me.core.organs',
      '4me.core.organs.services',
      '4me.core.cwp',
      '4me.core.sectors'
  ]);

/**
 * @ngdoc overview
 * @name 4me.ui.stub
 * @description
 * # 4me.ui.stub register states
 *
 * Register organ states here
 */

m.config(stubConfig);
m.run(stubRegistration);

stubConfig.$inject = ['$stateProvider'];
function stubConfig($stateProvider) {
  $stateProvider.state('stub', {
    url: '/stub',
    templateUrl: 'views/stub/index.tpl.html'
  });
};

stubRegistration = ['mainOrganService'];
function stubRegistration(mainOrganService) {

  var getNotifications = function() {
    return [
    {type: 'info', message: 'Info notification'},
    {type: 'warn', message: 'Warn notification'}
    ];
  };

  mainOrganService.register({
    name: 'stub',
    rootState: 'stub',
    getNotifications: getNotifications
  });
}


}());
