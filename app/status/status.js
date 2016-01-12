(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.status
 * @description
 * # Status module
 *
 * Meta module to include status components/services
 */
angular.module('4me.core.status', [
  '4me.core.status.services',
  '4me.core.status.components'
])
.config(addRoutes);


addRoutes.$inject = ['$stateProvider'];
function addRoutes($stateProvider) {
  $stateProvider.state('status', {
    url: '/status',
    templateUrl: 'views/status/index.html',
    controller: statusController,
    controllerAs: 'statuses'
  });
};

statusController.$inject = ['_', 'status', 'mainOrganService'];
function statusController(_, status, organs) {
  var statuses = this;
  statuses.statuses = [status];
  _.each(organs.getAll(), function(o) {
    console.log(o.getStatusService());
    statuses.statuses.push(o.getStatusService());
  });
}




}());
