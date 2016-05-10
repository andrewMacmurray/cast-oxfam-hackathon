require('env2')('config.env')
const messageBird = require('messagebird')(process.env.API_KEY)

module.exports.getMessages = () => {
  messageBird.messages.read('', (err, response) => {
    const receivedTexts = response.items.filter(text => text.direction === 'mo')
    const arrOfObj = receivedTexts.map(text => {
      return {
        id: text.id,
        direction: text.direction,
        originator: text.originator,
        body: text.body,
        createdDatetime: text.createdDatetime,
        timeDiff: new Date(text.createdDatetime)
      }
    });
    console.log(arrOfObj);
  });
}
