var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var app = require('../../dist/scripts/bundle.js');

var angularMocks = require('angular-mocks');
console.log('CACABOUDIN');
console.log(angularMocks);

chai.use(chaiAsPromised);
chai.use(sinonChai);

var sinon = require('sinon');
var sinonAsPromised = require('sinon-as-promised')(Promise);

global.sinon = sinon;
global.expect = chai.expect;
global.Promise = Promise;
chai.should();
