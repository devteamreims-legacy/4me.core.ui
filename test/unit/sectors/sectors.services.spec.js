describe('4me.core.sectors.services', function() {
  beforeEach(module('4me.core.sectors.services'));

  describe('mySectors', function() {
    var mySectors;
    var $httpBackend;
    var $rootScope;
    var $q;
    var ApiUrls;
    var errors;

    var resultsFromBackend = {
      getMine: {
        sectors: ['UR', 'XR'],
        name: 'UXR'
      }
    };

    beforeEach(inject(function(_mySectors_, _$httpBackend_, _$rootScope_, _$q_, _ApiUrls_, _errors_) {
      mySectors = _mySectors_;
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
          .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.sectors.getMine)
          .respond(resultsFromBackend.getMine);
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should return a promise', function(done) {
        mySectors.get()
          .should
          .be.fulfilled
          .and.notify(done);

        $httpBackend.flush(); // Flush $q defer
      });

      it('should return a properly formatted result', function(done) {
        Promise.all([
          mySectors.get().should.eventually
            .have.keys('sectors', 'name'),
          mySectors.get().then(function(res) {
            return [
              res.sectors.should.be.a('Array'),
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
          .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.sectors.getMine)
          .respond(404, '');
      });

      it('should handle failure gracefully', function(done) {
        Promise.all([
          mySectors.get().should.be.rejected,
          errors.catch.should.have.been.calledWith('core.sectors', sinon.match.any, sinon.match.any)
        ])
        .then(function() {
          done();
        });
        $httpBackend.flush();
      });
    });

  });
});
