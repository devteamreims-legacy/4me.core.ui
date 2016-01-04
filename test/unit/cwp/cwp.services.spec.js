describe('4me.core.cwp.services', function() {
  beforeEach(module('4me.core.bootstrap'));
  beforeEach(module('4me.core.cwp.services'));

  describe('myCwp', function() {
    var myCwp;
    var $httpBackend;
    var $rootScope;
    var $q;

    beforeEach(inject(function(_myCwp_, _$httpBackend_, _$rootScope_, _$q_) {
      myCwp = _myCwp_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('get', function() {
      it('should return a promise', function(done) {
        myCwp.get()
          .should
          .be.fulfilled
          .and.notify(done);
        
        $rootScope.$apply(); // Flush $q defer
      });
    });

  });
});