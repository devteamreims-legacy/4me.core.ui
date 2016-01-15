describe('4me.core.sectors.services', function() {
  beforeEach(module('4me.core.sectors.services'));

  describe('treeSectors', function() {
    var treeSectors;
    var $httpBackend;
    var $rootScope;
    var $q;
    var ApiUrls;
    var errors;
    var status;

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

    beforeEach(inject(function(_treeSectors_, _$httpBackend_, _$rootScope_, _$q_, _ApiUrls_, _errors_, _status_) {
      treeSectors = _treeSectors_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      ApiUrls = _ApiUrls_;
      errors = _errors_;
      status = _status_;
    }));

    it('should present a proper API', function() {
      treeSectors.bootstrap.should.be.a('function');
      treeSectors.getTree.should.be.a('function');
      treeSectors.getFromString.should.be.a('function');
      treeSectors.getElementary.should.be.a('function');
      treeSectors.getFromSectors.should.be.a('function');
    });

    it('should return empty stuff when not bootstrapped', function() {
      treeSectors.getTree().should.eql([]);
      treeSectors.getFromString('bla').should.eql({});
      treeSectors.getElementary().should.eql([]);
    });

    it('should be able to be bootstrapped', function(done) {
      $httpBackend
        .when('GET', ApiUrls.sectors.rootPath + ApiUrls.sectors.tree)
        .respond(resultsFromBackend.tree);

      treeSectors.bootstrap()
        .should.be.fulfilled
        .and.notify(done);

      $httpBackend.flush();
    });

    describe('without backend', function() {
      beforeEach(function() {
        $httpBackend
          .when('GET', ApiUrls.sectors.rootPath + ApiUrls.sectors.tree)
          .respond(404, '');

        status.escalate = sinon.stub();
        errors.add = sinon.stub().returns({});
      });

      it('should handle failure gracefully', function(done) {
        treeSectors.bootstrap()
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


    describe('bootstrapped', function() {
      beforeEach(function() {
        $httpBackend
          .when('GET', ApiUrls.sectors.rootPath + ApiUrls.sectors.tree)
          .respond(resultsFromBackend.tree);

        treeSectors.bootstrap()
          .should.be.fulfilled;

        $httpBackend.flush();
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should return a proper tree', function() {
        var tree = treeSectors.getTree();
        tree.should.be.a('array');
        tree.length.should.eql(resultsFromBackend.tree.length);
      });

      it('should be able to filter non-elementary sectors', function() {
        var elementary = treeSectors.getElementary();
        elementary.should.be.a('array');
        elementary.length.should.eql(2); // UR + XR
        elementary.should.contain('UR');
        elementary.should.contain('XR');
      });

      describe('getFromString', function() {
        it('should raise without argument', function() {
          treeSectors.getFromString.should.throw();
        });

        it('should get the proper sector group', function() {
          var s = treeSectors.getFromString('UXR');
          expect(s).to.be.defined;
          s.should.eql({name: 'UXR', elementarySectors: ['UR', 'XR']});
        });

        it('should be able to parse lowercase sector groups', function() {
          treeSectors.getFromString('uxr')
          .should.not.be.empty;
        });
      });

      describe('getFromSectors', function() {
        it('should raise without an argument', function() {
          treeSectors.getFromSectors.should.throw();
        });

        it('should reject invalid arguments', function() {
          var fn;
          fn = function() {
            return treeSectors.getFromSectors(2);
          };
          fn.should.throw();

          fn = function() {
            return treeSectors.getFromSectors({object: true});
          };
          fn.should.throw();
        });

        it('should accept strings as argument', function() {

          console.log(treeSectors.getFromSectors('ur'));

          treeSectors.getFromSectors('ur')
          .should.not.be.empty;

          treeSectors.getFromSectors('ur')
          .should.eql({
            name: 'UR',
            elementarySectors: ['UR']
          });
        });

        it('should accept arrays as arguments', function() {
          treeSectors.getFromSectors(['ur', 'XR'])
          .should.eql({
            name: 'UXR',
            elementarySectors: ['UR', 'XR']
          });
        });
      });
    });

  });
});
