describe('4me.core.cwp.services', function() {
  beforeEach(module('4me.core.cwp.services'));

  describe('myCwp', function() {
    var myCwp;
    var $httpBackend;
    var $rootScope;
    var $q;
    var ApiUrls;

    var resultsFromBackend = {
      getMine: {
        id: 34,
        name: 'P34'
      }
    };

    beforeEach(inject(function(_myCwp_, _$httpBackend_, _$rootScope_, _$q_, _ApiUrls_) {
      myCwp = _myCwp_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      ApiUrls = _ApiUrls_;

      $httpBackend
        .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.cwp.getMine)
        .respond(resultsFromBackend.getMine);
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
        
        $httpBackend.flush(); // Flush $q defer
      });

      it('should return a properly formatted result', function(done) {
        Promise.all([
          myCwp.get().should.eventually
            .have.keys('id', 'name'),
          myCwp.get().then(function(res) {
            return [
              res.id.should.be.a('number'),
              res.name.should.be.a('string')
            ]
          })
        ])
        .then(function() {
          done();
        });
        $httpBackend.flush();
      });
    });


  });
});