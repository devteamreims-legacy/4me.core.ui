describe('4me.ui.stub.status', function() {
  beforeEach(angular.mock.module('4me.ui.stub'));

  var coreStatus;
  var status;

  beforeEach(inject(
    ['status', 'stub.status',
    function(_coreStatus_, _status_) {
      coreStatus = _coreStatus_;
      status = _status_;
    }]
  ));

  it('should provide a namespaced status service', function() {
    status.get.should.be.a('Function');
    status.escalate.should.be.a('Function');
    status.recover.should.be.a('Function');

    coreStatus.escalate = sinon.stub();
    status.escalate();
    coreStatus.escalate.should.not.have.been.called;

    coreStatus.get = sinon.stub();
    status.get();
    coreStatus.get.should.not.have.been.called;

    coreStatus.recover = sinon.stub();
    status.recover();
    coreStatus.recover.should.not.have.been.called;
  });

  describe('namespacing', function() {
    beforeEach(function() {
      // Add a status error coming from the core
      coreStatus.escalate('core', 'warning');
    });

    it('should get filtered status', function() {
      status.get().reasons.should.be.empty;
      status.get().status.should.eql('normal');
      status.escalate('stub', 'critical', 'Test title');
      status.get().status.should.eql('critical');
      coreStatus.get().status.should.eql('warning');
    });

  });



});
