describe('4me.core.status.services', function() {
  beforeEach(module('4me.core.status.services'));

  describe('statusFactory', function() {
    var statusFactory;

    beforeEach(inject(function(_statusFactory_) {
      statusFactory = _statusFactory_;
    }));

    it('should have a proper API', function() {
      statusFactory.get.should.be.a('Function');
    });

    it('should create status service', function() {
      var s = statusFactory.get('core');
      s.get.should.be.a('Function');
      s.escalate.should.be.a('Function');
      s.recover.should.be.a('Function');
    });

    it('should not recreate status services', function() {
      var s = statusFactory.get('core');
      statusFactory.get('core').should.eql(s);
    });

    it('should be able to create two different services', function() {
      var s = statusFactory.get('core');
      var s2 = statusFactory.get('stub');

      s.name.should.eql('core');
      s2.name.should.eql('stub');
      s.should.not.eql(s2);

      s.escalate('core.test', 'critical');
      s2.get().status.should.eql('normal');
      s.get().status.should.eql('critical');
    });

  });

  describe('status', function() {
    var coreStatusService;

    beforeEach(inject(function(_status_) {
      coreStatusService = _status_;
    }));

    it('should offer a proper API', function() {
      coreStatusService.get.should.be.a('Function');
      coreStatusService.escalate.should.be.a('Function');
      coreStatusService.recover.should.be.a('Function');
    });

    it('should present a normal status by default', function() {
      var s = coreStatusService.get();
      s.status.should.eql('normal');
      s.reasons.should.eql([]);
    });

    it('should be able to escalate', function() {
      coreStatusService.escalate('core.stub', 'warning', 'User message');

      var s = coreStatusService.get();
      s.status.should.eql('warning');
      s.reasons.length.should.eql(1);

      var r = s.reasons[0];
      r.sender.should.eql('core.stub');
      r.criticity.should.eql('warning');
      r.message.should.eql('User message');

    });

    it('should be able to resume to a normal status', function() {
      coreStatusService.escalate('core.stub', 'warning', 'User message');

      coreStatusService.recover('core.stub');

      var s = coreStatusService.get();
      s.status.should.eql('normal');
      s.reasons.should.eql([]);
    });

    describe('multiple escalations', function() {
      beforeEach(function() {
        coreStatusService.escalate('stub.stub', 'warning', 'User message');
      });

      it('should be able to register multiple escalations', function() {
        coreStatusService.escalate('core.stub', 'warning', 'User message');
        coreStatusService.get().reasons.length.should.eql(2);
      });

      it('should set the global status as the worst status of all the reasons', function() {
        coreStatusService.escalate('core.stub1', 'critical');
        coreStatusService.escalate('core.stub2', 'warning');
        coreStatusService.get().status.should.eql('critical');
      });

      it('should keep other reasons when recovering', function() {
        coreStatusService.escalate('core.stub', 'critical');
        coreStatusService.recover('stub.stub');
        coreStatusService.get().status.should.eql('critical');
        coreStatusService.get().reasons.length.should.eql(1);
      });
    });
  });

});
