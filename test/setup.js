import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from "sinon-chai";
import { Promise } from 'es6-promise';

if (!global.Promise) { // shim Promise
    global.Promise = Promise;
}

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
global.expect = chai.expect;
global.sinon = sinon;
