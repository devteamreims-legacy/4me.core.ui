describe('4me.core.errors', function() {
  beforeEach(module('4me.core.errors.services'));

  var errors;
  var $q;

  beforeEach(inject(function(_errors_, _$q_, _$rootScope_) {
    errors = _errors_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  it('should have a proper API', function() {
    errors.add.should.be.a('Function');
    errors.get.should.be.a('Function');
    errors.catch.should.be.a('Function');
  });

  describe('get', function() {
    it('should return an array', function() {
      errors.get().should.eql([]);
    });
  });

  describe('add', function() {
    it('should add a correctly formatted error', function() {
      var e = {
        when: Date.now(),
        sender: 'core',
        type: 'critical',
        message: 'Error',
        reason: {message: 'test error'}
      };

      var r = errors.add('core', 'critical', 'Error', {message: 'test error'});

      r.sender.should.eql(e.sender);
      r.type.should.eql(e.type);
      r.message.should.eql(e.message);
      r.reason.should.eql(e.reason);
      errors.get().should.eql([r]);
    });

    it('should add errors in the correct order', function() {
      var e1 = {
        when: Date.now(),
        sender: 'core',
        type: 'critical',
        message: 'Error',
        reason: {message: 'test error'}
      };

      var e2 = {
        when: Date.now(),
        sender: 'core',
        type: 'critical',
        message: 'Error2',
        reason: {message: 'test error2'}
      };

      errors.add(e1.sender, e1.type, e1.message, e1.reason);
      errors.add(e2.sender, e2.type, e2.message, e2.reason);

      errors.get().length.should.eql(2);
      ([errors.get()[0].message, errors.get()[1].message])
        .should.eql([e2.message, e1.message]);

    });
  });

  describe('catch', function() {
    it('should add a correctly formatted error via a promise chain', function(done) {
      // Setup a failing promise
      var p = $q.reject('root error');

      Promise.all([
        p.catch(errors.catch('core', 'critical', 'Promise failed'))
        .should.be.rejected
      ])
      .then(function() {
        errors.get().length.should.eql(1);
        errors.get()[0].message.should.eql('Promise failed');
        done();
      });

      $rootScope.$digest(); // Flush $q promises
    });
  });

  describe('unread count', function() {
    it('should have proper methods', function() {
      errors.getUnreadCount.should.be.a('function');
      errors.clearUnreadCount.should.be.a('function');
    });

    it('should increment unread count', function() {
      var a = errors.getUnreadCount();
      errors.add();
      errors.getUnreadCount().should.eql(a+1);
    });

    it('should clear unread count', function() {
      var a = errors.getUnreadCount();
      errors.add();
      errors.add();
      errors.add();
      errors.getUnreadCount().should.eql(3);
      errors.clearUnreadCount();
      errors.getUnreadCount().should.eql(0);
    })
  });
});
