import { Promise } from 'es6-promise';
export { Ability } from './Ability';
export * as intent from './amazon-intents';

if (!global.Promise) global.Promise = Promise;
