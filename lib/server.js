require('env2')('config.env')
const Hapi = require('hapi')
var db = require('./redis/redisFunctions.js')
const dummyMessage = {phoneNumber: '+447885727095', credit: 5}


const routes = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      // db.makeTransaction(0, '461TV').then(reply)
      db.makeTransaction(2, '959XV').then(reply)
      // reply('ok')
    }
  }, {
    method: 'GET',
    path: '/addMockUsers',
    handler: (request, reply) => {
      db.addMockUsers()
      db.getAllPhoneNumbers()
        .then(numbers => {
          numbers.forEach(number => { db.getNewVoucherCode(number) })
          reply('vouchers set')
        }
      )
    }
  }, {
    method: 'GET',
    path: '/set-vouchers',
    handler: (request, reply) => {

    }
  }
]

module.exports = () => {

  const server = new Hapi.Server()

  server.connection({ port: process.env.PORT || 4000 })
  server.route(routes)

  return server
}
