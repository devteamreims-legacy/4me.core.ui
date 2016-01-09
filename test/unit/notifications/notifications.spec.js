describe('4me.core.notifications', function() {
  beforeEach(module('4me.core.notifications.services'));

  var notifications;
  var $q;
  var $rootScope;

  beforeEach(inject(function(_notifications_, _$q_, _$rootScope_) {
    notifications = _notifications_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  it('should have a proper API', function() {
    notifications.add.should.be.a('Function');
    notifications.get.should.be.a('Function');
    notifications.getUnread.should.be.a('Function');
    notifications.getUnreadCount.should.be.a('Function');
    notifications.markAllAsRead.should.be.a('Function');
  });

  describe('get', function() {
    it('should return an array', function() {
      notifications.get().should.eql([]);
    });
  });

  describe('add', function() {
    it('should add a correctly formatted notification', function() {
      var e = {
        when: Date.now(),
        sender: 'core',
        priority: 'critical',
        title: 'Error in XMAN',
        message: 'A longer message',
        read: false
      };

      var r = notifications.add(e.sender, e.priority, e.title, {message: e.message});

      r.sender.should.eql(e.sender);
      r.priority.should.eql(e.priority);
      r.title.should.eql(e.title);
      r.message.should.eql(e.message);
      r.navigateTo.should.be.false;
      r.markAsRead.should.be.a('function');
      notifications.get().should.eql([r]);
    });

    it('should add notifications in the correct order', function() {
      var e1 = {
        when: Date.now(),
        sender: 'core',
        priority: 'critical',
        title: 'Error in XMAN',
        message: 'A longer message',
        read: false
      };

      var e2 = {
        when: Date.now(),
        sender: 'core2',
        priority: 'critical2',
        title: 'Error in XMAN2',
        message: 'A longer message2',
        read: false
      };


      notifications.add(e1.sender, e1.priority, e1.title, {message: e1.message});
      notifications.add(e2.sender, e2.priority, e2.title, {message: e2.message});

      notifications.get().length.should.eql(2);
      ([notifications.get()[0].message, notifications.get()[1].message])
        .should.eql([e2.message, e1.message]);

    });

    it('should set the read flag to false', function() {
      var e = {
        when: Date.now(),
        sender: 'core',
        priority: 'critical',
        title: 'Error in XMAN',
        message: 'A longer message',
        read: false
      };

      var r = notifications.add(e.sender, e.priority, e.title, {message: e.message});
      r.read.should.be.false;
    });
  });

  describe('unread block', function() {
    it('should have proper methods', function() {
      notifications.getUnread.should.be.a('function');
      notifications.markAllAsRead.should.be.a('function');
      notifications.getUnreadCount.should.be.a('function');
    });

    it('should increment unread count', function() {
      var a = notifications.getUnreadCount();
      notifications.add();
      notifications.getUnreadCount().should.eql(a+1);
    });

    it('should clear unread count', function() {
      notifications.add();
      notifications.add();
      notifications.add();
      notifications.getUnreadCount().should.eql(3);
      notifications.markAllAsRead();
      notifications.getUnreadCount().should.eql(0);
    });

    it('should get unread notifications', function() {
      notifications.getUnread().should.eql([]);
      notifications.add();
      notifications.add();
      notifications.getUnread().length.should.eql(2);
      notifications.markAllAsRead();
      notifications.getUnread().length.should.eql(0);
      notifications.add();
      notifications.get().length.should.eql(3);
      notifications.getUnread().length.should.eql(1);
    });

    it('should present a function per notification to mark as read', function() {
      notifications.add();
      notifications.add();
      var unread = notifications.getUnread();
      unread[0].markAsRead();
      notifications.getUnread().length.should.eql(1);
      notifications.getUnreadCount().should.eql(1);
    });
  });

  describe('navigateTo', function() {
    it('should expose the navigateTo callback', function() {
      var s = sinon.stub();
      notifications.add('core', 'warn', 'Title', {navigateTo: s});
      var n = notifications.get()[0];
      n.navigateTo.should.be.a('Function');
      n.navigateTo();
      s.should.have.been.called;
    });

    it('should mark as read when calling navigateTo', function() {
      var markAsRead = sinon.stub();
      var s = sinon.stub();
      notifications.add('core', 'warn', 'Title', {navigateTo: s});
      var n = notifications.get()[0];
      n.markAsRead = markAsRead;
      n.navigateTo();
      markAsRead.should.have.been.called;
    })
  });
});
