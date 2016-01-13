describe('4me.core.sectors.services', function() {
  beforeEach(module('4me.core.sectors.services'));

  describe('treeSectors', function() {
    var treeSectors;
    var $httpBackend;
    var $rootScope;
    var $q;
    var ApiUrls;
    var errors;

    var resultsFromBackend = {
      tree: [
        {
          name: 'UXR',
          elementarySectors: ['UR', 'XR']
        },{
          name: 'UR',
          elementarySectors: ['UR']
        },{
          name: 'XR',
          elementarySectors: ['XR']
        }
      ]
    };

    beforeEach(inject(function(_treeSectors_, _$httpBackend_, _$rootScope_, _$q_, _ApiUrls_, _errors_) {
      treeSectors = _treeSectors_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      ApiUrls = _ApiUrls_;
      errors = _errors_;
    }));

    it('should present a proper API', function() {
      treeSectors.getTree.should.be.a('function');
      treeSectors.getFromString.should.be.a('function');
      treeSectors.getElementary.should.be.a('function');
    });

  });
});