describe('4me.core.cwp.interceptor', function() {

  var $httpProvider;
  beforeEach(angular.mock.module('4me.core.cwp.interceptor',
    ['$httpProvider', function(_$httpProvider_) {
      $httpProvider = _$httpProvider_;
    }])
  );

  beforeEach(angular.mock.module('4me.core.config'));

  var cwpInterceptor;
  var $httpBackend;
  var $http;



  beforeEach(inject(function(_$httpBackend_, _cwpInterceptor_, _$http_) {
    $httpBackend = _$httpBackend_;
    cwpInterceptor = _cwpInterceptor_;
    $http = _$http_;
  }));

  it('should be registered in $httpProvider ', function() {
    $httpProvider.interceptors.should.contain('cwpInterceptor');
  });

  it('should not add a header without an input', function(done) {
    $httpBackend.when('GET', 'http://test', null, function(headers) {
      headers.should.not.include.keys('x-4me-cwp-id');
      return true;
    }).respond(200, {});

    $http.get('http://test')
    .then(function() {
      done();
    });

    $httpBackend.flush();
  });

  it('should add a header after configuring the interceptor', function(done) {
    var testId = 4;
    $httpBackend.when('GET', 'http://test', null, function(headers) {
      headers.should.include.keys('x-4me-cwp-id');
      headers['x-4me-cwp-id'].should.eql(testId);
      return true;
    }).respond(200, {});

    cwpInterceptor.setId(testId);

    $http.get('http://test')
    .then(function() {
      done();
    });

    $httpBackend.flush();
  });

});
