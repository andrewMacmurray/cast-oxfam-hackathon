require('env2')('./config.env')
const createServer = require('./server.js')
const getMessages = require('./messageBird/getMessages.js').getMessages

const server = createServer()

server.start((err) => {
  if (err) throw err
  else {
    // setInterval(getMessages, 3000);
    console.log('server is listening on port: ' + server.info.port)
  }
});
