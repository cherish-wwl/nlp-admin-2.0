'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.181.145:8089"',
  // BASE_API: '"http://192.168.16.151:8089"',
})
