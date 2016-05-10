require('env2')('config.env')
const messageBird = require('messagebird')(process.env.API_KEY)

const Hapi = require('hapi')
const server = new Hapi.Server()

server.connection({ port: process.env.PORT || 4000 })

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('hello server')
    }
  }
]

const getMessages = () => {
  messageBird.messages.read('', (err, response) => {
    const receivedTexts = response.items.filter(text => text.direction === 'mo')
    const arrOfObj = receivedTexts.map(text => {
      return {
        id: text.id,
        direction: text.direction,
        originator: text.originator,
        body: text.body,
        createdDatetime: text.createdDatetime
      }
    });
    console.log(arrOfObj);
  });
}

server.route(routes)

server.start((err) => {
  if (err) throw err
  else {
    setInterval(getMessages, 3000)
    console.log('server is listening on port: ' + server.info.port)
  }
});

