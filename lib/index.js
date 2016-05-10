require('env2')('config.env')

const Hapi = require('hapi')
const server = new Hapi.Server()

server.connection({ port: process.env.PORT || 4000 })

const routes = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('hello server')
    }
  }
]

server.route(routes)

server.start((err) => {
  if (err) throw err
  else {
    console.log('server is listening on port: ' + server.info.port)
  }
})
