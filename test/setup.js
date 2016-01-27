import Promise from 'bluebird';
import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from "sinon-chai";

global.Promise = Promise;

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
global.expect = chai.expect;
global.sinon = sinon;
