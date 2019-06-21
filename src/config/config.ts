const _ = require('lodash');

// module variables

const config = require(__dirname + '/env.json');
const defaultConfig = config.development;
const env = process.env.NODE_ENV || 'development';
const environmentConfig = config[env];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
export const environment = finalConfig;