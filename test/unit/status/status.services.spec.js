describe('4me.core.status.services', function() {
  beforeEach(module('4me.core.status.services'));

  describe('coreStatusService', function() {
    var coreStatusService;

    beforeEach(inject(function(_coreStatusService_) {
      coreStatusService = _coreStatusService_;
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