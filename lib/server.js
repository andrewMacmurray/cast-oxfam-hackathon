require('env2')('config.env')
const Hapi = require('hapi')
var addUser = require('./redis/redisFunctions.js').addUser
var checkUserAddCredit = require('./redis/redisFunctions.js').checkUserAddCredit
const dummyMessage = {phoneNumber: '+447885727095', credit: 5}


const routes = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      // addUser()
      // reply()
      checkUserAddCredit(dummyMessage).then(result => reply(result))
    }
  }
]

module.exports = () => {

  const server = new Hapi.Server()

  server.connection({ port: process.env.PORT || 4000 })
  server.route(routes)

  return server
}
