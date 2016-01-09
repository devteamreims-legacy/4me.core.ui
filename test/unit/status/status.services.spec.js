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
      s.message.should.eql('');
      s.reasons.should.eql([]);
    });

    it('should be able to escalate', function() {
      coreStatusService.escalate('warn', 'User message');

      var s = coreStatusService.get();
      s.status.should.eql('warn');
      s.message.should.eql('User message');
      s.reasons.should.eql([]);
    });

    it('should be able to resume to a normal status', function() {
      coreStatusService.escalate('warn', 'User message');

      coreStatusService.recover();

      var s = coreStatusService.get();
      s.status.should.eql('normal');
      s.message.should.eql('');
      s.reasons.should.eql([]);

    });
  });

});