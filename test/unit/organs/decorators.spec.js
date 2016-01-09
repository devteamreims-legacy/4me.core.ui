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
    notifications.getUnreadHighestPriority.should.be.a('Function');


    coreNotifications.add = sinon.stub();
    notifications.add();
    // Expect coreNotifications to have been called with 'stub' as a sender
    coreNotifications.add.should.have.been.calledWith('stub');
  });

  describe('decorated notifications', function() {
    beforeEach(function() {
      // Add a notification coming from the core
      coreNotifications.add('core');
    });

    it('should get filtered notifications', function() {
      notifications.get().should.be.empty;
      notifications.add('warning', 'Test title');
      notifications.get().length.should.eql(1);

      var n = notifications.get()[0];
      n.priority.should.eql('warning');
      n.title.should.eql('Test title');
    });

    describe('unread block', function() {
      beforeEach(function() {
        // Add a second notification
        coreNotifications.add('core', 'critical');

        // Add 2 unread namespaced notifications
        notifications.add('warning');
        notifications.add('info');
      });

      it('should count namespaced notifications only', function() {
        coreNotifications.getUnread().length.should.eql(4); // 2 from core, 2 from stub
        notifications.getUnread().length.should.eql(2);
      });

      it('should only mark as read namespaced notifications', function() {
        notifications.markAllAsRead();
        notifications.getUnread().length.should.eql(0);
        coreNotifications.getUnread().length.should.eql(2);
      });

      it('should filter highest priority', function() {
        notifications.getUnreadHighestPriority().should.eql('warning');
      });
    });



  });



});