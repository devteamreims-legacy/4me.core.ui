(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.core.socket
 * @description
 * # Socket module
 *
 * Meta module to include socket.io communication
 */
angular.module('4me.core.socket', [
  '4me.core.lodash',
  '4me.core.config',
  '4me.core.errors',
  '4me.core.status',
  'btford.socket-io'
])
.factory('mainWebSocket', mainWebSocket);

mainWebSocket.$inject = ['_', 'socketFactory', 'ApiUrls', 'errors', 'status'];
function mainWebSocket(_, socketFactory, ApiUrls, errors, status) {
  var myIoSocket = io.connect(ApiUrls.socketPath);

  var mySocket = socketFactory({ioSocket: myIoSocket});

  return mySocket;
}

}());