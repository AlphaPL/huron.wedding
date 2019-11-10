/**
 * Copyright (c) 2016, Lee Byron
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { Pool } = require('pg')
const { parse: urlParse } = require('url')

let _pool

function pool() {
  if (!_pool) {
    _pool = new Pool({
      user: 'wuwhqznnkmralr',
      password: '4fe4fdd8baa38c5658777ac826f2cb9a2ca3f1188cdb3070536709e2d5801adc',
      host: 'ec2-46-137-91-216.eu-west-1.compute.amazonaws.com',
      port: 5432,
      database: 'dek4gonrblmfv3',
      ssl: true
    })
  }
  console.log(_pool)
  return _pool
}


function pgQuery(str, args) {
  return pool().connect().then(client =>
    client.query(str, args).then(
      result => {
        client.release()
        return result
      },
      error => {
        client.release()
        throw error
      }
    )
  )
}

module.exports = pgQuery
