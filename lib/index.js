require('env2')('./config.env')
const createServer = require('./server.js')
const createClient = require('./redis/client.js')
const getMessages = require('./messageBird/getMessages.js').getMessages

const client = createClient()
const server = createServer(client)

server.start((err) => {
  if (err) throw err
  else {
    setInterval(getMessages, 3000)
    console.log('server is listening on port: ' + server.info.port)
  }
});
