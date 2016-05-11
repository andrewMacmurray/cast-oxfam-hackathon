require('env2')('config.env')
const Hapi = require('hapi')
var db = require('./redis/redisFunctions.js')
const dummyMessage = {phoneNumber: '+447885727095', credit: 5}
const Inert = require('inert');

const routes = [
  {
    method: 'GET',
    path: '/addUser/{number}/{credit}',
    handler: (request, reply) => {
      console.log(request, "working request")
      reply("working")
    }
  },
  {
    method: 'GET',
    path: '/addUsers',
    handler: (request, reply) => {
      db.addMockUsers()
      reply('adding mock users')
      db.getUser('+447885727095')
        .then(reply)
      db.getAllPhoneNumbers()
        .then(numbers => db.getUsers(numbers))
        .then(reply)
      db.addCredit('+447885727095', 10)
        .then(reply)
      db.getBalance('+447885727095')
        .then(reply)
      db.checkUserAddCredit('+447885727095', 5)
        .then(reply)
    }
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: { path: 'public'}
    }
  }
]

module.exports = () => {

  const server = new Hapi.Server()

  server.connection({ port: process.env.PORT || 4000 })
  server.register([Inert], (err) => {
    if (err) {
      console.log('plugins error: ', err)
      throw err
    }
  });
  server.route(routes)

  return server
}
