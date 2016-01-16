describe('4me.core.socket', function() {
  beforeEach(module('4me.core.socket'));

  describe('mainWebSocket', function() {
    var mainWebSocket;
    var $httpBackend;
    var $rootScope;
    var $q;
    var ApiUrls;
    var errors;
    var status;

    beforeEach(inject(function(_mainWebSocket_, _$httpBackend_, _$rootScope_, _$q_, _ApiUrls_, _errors_, _status_) {
      mainWebSocket = _mainWebSocket_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      ApiUrls = _ApiUrls_;
      errors = _errors_;
      status = _status_;
    }));

    it('should fail', function() {
      (true).should.eql(false);
    });
  });
});