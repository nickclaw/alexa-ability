import { Promise } from 'es6-promise';
export { Ability } from './Ability';
export * from './amazon-intents';

if (!global.Promise) global.Promise = Promise;
