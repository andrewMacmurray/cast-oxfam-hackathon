const Hapi = require('hapi')
const routes = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('hello server')
    }
  }
]

module.exports = (client) => {

  const server = new Hapi.Server()

  server.connection({ port: process.env.PORT || 4000 })
  server.route(routes)

  return server
}
