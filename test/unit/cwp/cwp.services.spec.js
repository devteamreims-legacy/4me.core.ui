describe('4me.core.cwp.services', function() {
  beforeEach(module('4me.core.cwp.services'));

  describe('myCwp', function() {
    var myCwp;
    var $httpBackend;
    var $rootScope;
    var $q;
    var ApiUrls;
    var errors;

    var resultsFromBackend = {
      getMine: {
        id: 34,
        name: 'P34'
      }
    };

    beforeEach(inject(function(_myCwp_, _$httpBackend_, _$rootScope_, _$q_, _ApiUrls_, _errors_) {
      myCwp = _myCwp_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      ApiUrls = _ApiUrls_;
      errors = _errors_;
    }));

    describe('get', function() {
      // Prepare our backend
      beforeEach(function() {
        $httpBackend
          .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.cwp.getMine)
          .respond(resultsFromBackend.getMine);
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

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

    describe('without backend', function() {
      beforeEach(function() {
        errors.catch = sinon.spy();
        $httpBackend
          .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.cwp.getMine)
          .respond(404, '');
      });

      it('should handle failure gracefully', function(done) {
        Promise.all([
          myCwp.get().should.be.rejected,
          errors.catch.should.have.been.calledWith('core.cwp', sinon.match.any, sinon.match.any)
        ])
        .then(function() {
          done();
        });
        $httpBackend.flush();
      });
    });

  });
});
