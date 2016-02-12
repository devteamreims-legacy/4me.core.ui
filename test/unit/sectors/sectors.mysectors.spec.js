describe('4me.core.sectors.services', function() {
  beforeEach(angular.mock.module('4me.core.sectors.services'));

  describe('mySector', function() {
    var mySector;
    var $httpBackend;
    var $rootScope;
    var $q;
    var ApiUrls;
    var errors;
    var status;
    var mainWebSocket;
    var backendResponse;
    var myCwp;
    var endpoints = {};
    var cwpInterceptor;
    var $cookies;

    var resultsFromBackend = {
      getMine: {
        cwpId: 34,
        sectors: ['UR', 'XR']
      }
    };

    var stubCwp = {
      id: 34,
      name: 'P34',
      type: 'cwp',
      disabled: false
    };

    beforeEach(inject(function(_mySector_, _$httpBackend_, _$rootScope_, _$q_, _ApiUrls_, _errors_, _cwpInterceptor_, _status_, _mainWebSocket_, _$cookies_, _myCwp_) {
      mySector = _mySector_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      ApiUrls = _ApiUrls_;
      errors = _errors_;
      cwpInterceptor = _cwpInterceptor_;
      status = _status_;
      mainWebSocket = _mainWebSocket_;
      $cookies = _$cookies_;
      myCwp = _myCwp_;

      endpoints.getMine = ApiUrls.mapping.rootPath + ApiUrls.mapping.sectors.getMine + '34';

      myCwp.bootstrap = function() { return $q.resolve(stubCwp) };
    }));

    it('should present a proper API', function() {
      mySector.bootstrap.should.be.a('function');
      mySector.get.should.be.a('function');
      mySector.refresh.should.be.a('function');
    });

    it('should return empty stuff when not bootstrapped', function() {
      mySector.get().should.eql({});
    });

    it('should be able to be bootstrapped', function(done) {
      $httpBackend
        .when('GET', endpoints.getMine)
        .respond(resultsFromBackend.getMine);

      mySector.bootstrap()
        .should.be.fulfilled
        .and.notify(done);

      // Resolve $http
      $httpBackend.flush();
    });

    it('should be able to be bootstrapped only once', function(done) {
      $httpBackend
        .expect('GET', endpoints.getMine)
        .respond(resultsFromBackend.getMine);

      mySector.bootstrap()
        .then(function(sectors) {
          mySector.bootstrap()
            .should.be.fulfilled
            .and.eventually.eql(sectors)
            .and.notify(done);
        });

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('get', function() {
      // Prepare our backend
      beforeEach(function() {
        $httpBackend
          .when('GET', endpoints.getMine)
          .respond(resultsFromBackend.getMine);

        mySector.bootstrap()
          .should.be.fulfilled;

        $httpBackend.flush();
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should return a properly formatted result', function() {
        var s = mySector.get();
        s.should.include.keys('sectors');
        s.sectors.should.be.a('array');
      });


      describe('socket', function() {
        it('should update with data from socket', function() {
          $httpBackend.expectGET(endpoints.getMine);
          mainWebSocket.receive('mapping:refresh', {
            cwpId: 34,
            sectors: ['UR']
          });
          $httpBackend.flush();
        });

        it('should emit event when getting data from socket', function() {
          var spy = sinon.spy($rootScope, '$emit');
          $httpBackend.expectGET(endpoints.getMine);
          mainWebSocket.receive('mapping:refresh', {
            cwpId: 34,
            sectors: ['UR']
          });
          $httpBackend.flush();
          spy.should.have.been.calledWith('fme:new-sectors');
        });
      });
    });

    describe('without backend', function() {
      beforeEach(function() {
        $httpBackend
          .when('GET', endpoints.getMine)
          .respond(404, '');

        status.escalate = sinon.stub();
        errors.add = sinon.stub().returns({});
      });

      it('should handle failure gracefully', function(done) {
        mySector.bootstrap()
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
