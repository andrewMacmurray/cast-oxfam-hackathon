require('env2')('config.env')
const Hapi = require('hapi')
var addUser = require('./redis/redisFunctions.js').addUser
const setVoucher = require('./redis/redisFunctions.js').setVoucher


const routes = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      // addUser()
      // reply()
      setVoucher('+447885727095').then(data => {
        console.log(data)
        reply(data)
      })
    }
  }
]

module.exports = () => {

  const server = new Hapi.Server()

  server.connection({ port: process.env.PORT || 4000 })
  server.route(routes)

  return server
}
