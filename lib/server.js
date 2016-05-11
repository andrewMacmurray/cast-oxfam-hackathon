require('env2')('config.env')
const Hapi = require('hapi')
var db = require('./redis/redisFunctions.js')
const Inert = require('inert');
const messageBird = require('messagebird')(process.env.API_KEY)

const routes = [
  {
    method: 'GET',
    path: '/charge/{price}/{code}',
    handler: (request, reply) => {
       console.log(request.url.path.split('/')[2], '<<price', request.url.path.split('/')[3], '<<code')
       const price = request.url.path.split('/')[2]
       const code = request.url.path.split('/')[3]
      db.makeTransaction(price, code)
      .then(data => reply(data))
    }
  },
  {
    method: 'GET',
    path: '/addUser/{number}/{credit}',
    handler: (request, reply) => {
      console.log(request.url.path.split('/')[2], '<<number', request.url.path.split('/')[3], '<<credit')
      console.log(reply)
      const number = request.url.path.split('/')[2]
      const credit = request.url.path.split('/')[3]
      const params = {
        originator: '+447860039047',
        recipients: [
          '+' + number
        ],
        body: 'Welcome to Oxfam, your credit is ' + credit + '. message "get voucher" to get a voucher, message "buy 5" to buy £5 of credit,'
      }
      messageBird.messages.create(params, (err, response) => {
        console.log(err ? err : response)
      })
      db.addUser(number, credit)
       .then(data => reply(data))
    }
  },
  {
    method: 'GET',
    path: '/addUsers',
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
