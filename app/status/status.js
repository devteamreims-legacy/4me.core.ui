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
  statuses.statuses = [];
  statuses.statuses.push({
    name: 'Core',
    status: status.get()
  });
  _.each(organs.getAll(), function(o) {
    statuses.statuses.push({
      name: o.name,
      status: o.getStatusService().get()
    });
  });

  statuses.escalateCore = function() {
    status.escalate('core', 'critical');
  };

  statuses.escalateStub = function() {
    organs.find('stub').getStatusService().escalate('stub', 'warning');
  };

  statuses.recoverAll = function() {
    status.recover('core');
    _.each(organs.getAll(), function(o) {
      o.getStatusService().recover(o.name);
    });
  };
}




}());
