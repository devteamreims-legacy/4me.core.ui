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

mainWebSocket.$inject = ['_', 'socketFactory', 'ApiUrls', 'errors', 'status', '$timeout'];
function mainWebSocket(_, socketFactory, ApiUrls, errors, status, $timeout) {
  var reconnectTimeout = 5000;
  var maxReconnectTimeout = 300000;
  var connected = false;
  var connectedPromise;

  var myIoSocket = io.connect(ApiUrls.socket, {
    reconnection: true,
    reconnectionDelay: 10000,
    timeout: 5000
  });

  var mySocket = socketFactory({ioSocket: myIoSocket});

  mySocket.on('disconnect', function(err) {
    console.log(err);
    status.escalate('socket', 'critical', 'Disconnected from mapping backend, retrying in ' + reconnectTimeout/1000 + 's');
    if(connectedPromise !== undefined) {
      $timeout.cancel(connectedPromise);
    } 
    $timeout(function() {
      reconnectTimeout = reconnectTimeout * 2;
      if(reconnectTimeout > maxReconnectTimeout) {
        reconnectTimeout = maxReconnectTimeout;
      }
      myIoSocket.connect();
    }, reconnectTimeout);
    return true;
  });

  mySocket.on('connect', function() {
    console.log('connecting ...');
    // Wait 1 second before claiming victory
    connectedPromise = $timeout(function() {
      console.log('mainWebSocket: Connected !');
      // Recover status
      status.recover('socket');
      // Set flag to 'connected'
      connected = true;
      // Reset $timeout promise
      connectedPromise = undefined;
      // Reset reconnectTimeout
      reconnectTimeout = 5000;
    }, 1000);
    return true;
  });

  mySocket.on('connection', function() {
    //status.recover('socket');
    console.log('Socket to mapping backend connected !');
    return true;
  });

  mySocket.on('connect_error', function(err) {
    if(_.isEmpty(status.getReasons('socket'))) {
      status.escalate('socket', 'critical', 'Could not connect to mapping backend');
    }
    return true;
  });

  return mySocket;
}