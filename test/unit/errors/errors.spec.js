describe('4me.core.errors', function() {
  beforeEach(module('4me.core.errors'));

  var errors;

  beforeEach(inject(function(_errors_) {
    errors = _errors_;
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

      r.should.eql(e);
      errors.get().should.eql([e]);
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
      var p = function() {
        return new Promise(function(resolve, reject) {
          reject(new Error('bla'));
        });
      };

      p()
      .then(function() {
        (true).should.eql(0); // This should never happen
      })
      .catch(errors.catch('core', 'critical', 'Promise failed'))
      .then(function() {
        errors.get().length.should.eql(1);
        errors.get()[0].message.should.eql('Promise failed');
      })
      .should.notify(done);
    });
  });

});
