describe('4me.ui.stub', function() {
  beforeEach(module('4me.ui.stub'));

  var coreNotifications;
  var coreErrors;
  var errors;
  var notifications;

  beforeEach(inject(
    ['notifications', 'errors', 'stub.notifications', 'stub.errors', 
    function(_coreNotifications_, _coreErrors_, _notifications_, _errors_) {
      coreNotifications = _coreNotifications_;
      coreErrors = _coreErrors_;
      notifications = _notifications_;
      errors = _errors_;
    }]
  ));

  it('should provide decorated namespaced errors and notifications factories', function() {
    errors.add.should.be.a('Function');
    errors.get.should.be.a('Function');
    errors.catch.should.be.a('Function');

    coreErrors.add = sinon.stub();
    errors.add();
    // Expect coreErrors to have been called with 'stub' as a sender
    coreErrors.add.should.have.been.calledWith('stub');

    notifications.add.should.be.a('Function');
    notifications.get.should.be.a('Function');
    notifications.getUnread.should.be.a('Function');
    notifications.getUnreadCount.should.be.a('Function');
    notifications.markAllAsRead.should.be.a('Function');

    coreNotifications.add = sinon.stub();
    notifications.add();
    // Expect coreNotifications to have been called with 'stub' as a sender
    coreNotifications.add.should.have.been.calledWith('stub');
  });



});