describe('4me.core.sectors.services', function() {
  beforeEach(module('4me.core.sectors.services'));

  describe('mySectors', function() {
    var mySectors;
    var $httpBackend;
    var $rootScope;
    var $q;
    var ApiUrls;
    var errors;
    var status;

    var resultsFromBackend = {
      getMine: {
        sectors: ['UR', 'XR'],
        name: 'UXR'
      }
    };

    beforeEach(inject(function(_mySectors_, _$httpBackend_, _$rootScope_, _$q_, _ApiUrls_, _errors_, _status_) {
      mySectors = _mySectors_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      ApiUrls = _ApiUrls_;
      errors = _errors_;
      status = _status_;
    }));


    it('should present a proper API', function() {
      mySectors.bootstrap.should.be.a('function');
      mySectors.get.should.be.a('function');
      mySectors.refresh.should.be.a('function');
    });

    it('should return empty stuff when not bootstrapped', function() {
      mySectors.get().should.eql({});
    });

    it('should be able to be bootstrapped', function(done) {
      $httpBackend
        .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.sectors.getMine)
        .respond(resultsFromBackend.getMine);

      mySectors.bootstrap()
        .should.be.fulfilled
        .and.notify(done);

      $httpBackend.flush();
    });




    describe('get', function() {
      // Prepare our backend
      beforeEach(function() {
        $httpBackend
          .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.sectors.getMine)
          .respond(resultsFromBackend.getMine);

        mySectors.bootstrap()
        .should.be.fulfilled;

        $httpBackend.flush();
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should return a properly formatted result', function() {
        var c = mySectors.get();
        c.should.include.keys('sectors', 'name');
        c.sectors.should.be.a('array');
        c.name.should.be.a('string');
      });

    });

    describe('without backend', function() {
      beforeEach(function() {
        $httpBackend
          .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.sectors.getMine)
          .respond(404, '');

        status.escalate = sinon.stub();
        errors.add = sinon.stub().returns({});
      });

      it('should handle failure gracefully', function(done) {
        mySectors.bootstrap()
        .then(function(res) {
          // This should not happen
          (true).should.eql(false);
          done();
        })
        .catch(function(err) {
          errors.add.should.have.been.called;
          status.escalate.should.have.been.called;
          done();
        });

        $httpBackend.flush();
      });
    });

  });
});
