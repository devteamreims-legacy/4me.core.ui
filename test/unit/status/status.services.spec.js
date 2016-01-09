describe('4me.core.status.services', function() {
  beforeEach(module('4me.core.status.services'));

  describe('coreStatusService', function() {
    var coreStatusService;

    beforeEach(inject(function(_coreStatusService_) {
      coreStatusService = _coreStatusService_;
    }));

    it('should offer a proper API', function() {
      coreStatusService.get.should.be.a('Function');
    });
  });

});