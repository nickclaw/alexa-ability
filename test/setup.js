import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import { Promise } from 'es6-promise';

if (!global.Promise) { // shim Promise
    global.Promise = Promise;
}

chai.should();
chai.use(chaiAsPromised);
global.expect = chai.expect;
global.sinon = sinon;
