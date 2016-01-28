describe('4me.core.cwp.services', function() {
  beforeEach(module('4me.core.cwp.services'));

  describe('myCwp', function() {
    var myCwp;
    var $httpBackend;
    var $rootScope;
    var $q;
    var ApiUrls;
    var errors;
    var status;
    var cwpInterceptor;
    var mainWebSocket;
    var backendResponse;

    var resultsFromBackend = {
      getMine: {
        id: 34,
        name: 'P34',
        type: 'cwp',
        disabled: false
      }
    };

    beforeEach(inject(function(_myCwp_, _$httpBackend_, _$rootScope_, _$q_, _ApiUrls_, _errors_, _cwpInterceptor_, _status_, _$cookies_) {
      myCwp = _myCwp_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      ApiUrls = _ApiUrls_;
      errors = _errors_;
      cwpInterceptor = _cwpInterceptor_;
      status = _status_;
      $cookies = _$cookies_;
    }));

    it('should present a proper API', function() {
      myCwp.bootstrap.should.be.a('function');
      myCwp.get.should.be.a('function');
      myCwp.refresh.should.be.a('function');
    });

    it('should return empty stuff when not bootstrapped', function() {
      myCwp.get().should.eql({});
    });

    it('should be able to be bootstrapped', function(done) {
      backendResponse = $httpBackend
        .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.cwp.getMine)
        .respond(resultsFromBackend.getMine);

      myCwp.bootstrap()
        .should.be.fulfilled
        .and.notify(done);

      $httpBackend.flush();
    });

    describe('get', function() {
      // Prepare our backend
      beforeEach(function() {
        cwpInterceptor.setId = sinon.stub();
        $cookies.put = sinon.stub();
        $httpBackend
          .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.cwp.getMine)
          .respond(resultsFromBackend.getMine);

        myCwp.bootstrap()
        .should.be.fulfilled;

        $httpBackend.flush();
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should return a properly formatted result', function() {
        var c = myCwp.get();
        c.should.include.keys('id', 'name', 'type', 'disabled');
        c.id.should.be.a('number');
        c.name.should.be.a('string');
        ['cwp', 'supervisor', 'flow-manager'].should.include(c.type);
        c.disabled.should.be.a('boolean');
      });

      it('should set a proper id in cwpInterceptor', function() {
        cwpInterceptor.setId
        .should.have.been
        .calledWith(resultsFromBackend.getMine.id);
      });

      it('should set a proper my-cwp-id cookie', function() {
        $cookies.put.should.have.been.calledWith('my-cwp-id', resultsFromBackend.getMine.id);
      });
    });

    describe('without backend', function() {
      beforeEach(function() {
        $httpBackend
          .when('GET', ApiUrls.mapping.rootPath + ApiUrls.mapping.cwp.getMine)
          .respond(404, '');

        status.escalate = sinon.stub();
        errors.add = sinon.stub().returns({});
      });

      it('should handle failure gracefully', function(done) {
        myCwp.bootstrap()
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
