require('env2')('config.env')
const messageBird = require('messagebird')(process.env.API_KEY)

module.exports.getMessages = () => {
  messageBird.messages.read('', (err, response) => {
    const receivedTexts = response.items.filter(text => text.direction === 'mo')
    const arrOfObj = receivedTexts.map(text => {
      const dateFormat = new Date(text.createdDatetime)
      const timeDiff= Date.now() - dateFormat.getTime()
      return {
        id: text.id,
        direction: text.direction,
        originator: text.originator,
        body: text.body,
        timeDiff
      }
    });
    console.log('messagebird running', arrOfObj);
    const reply = arrOfObj.filter(el => el.timeDiff < 3000)[0]
    if(reply) {
      var params = {
        originator: '+447860039046',
        recipients: [
          '00447985156114'
        ],
        body: 'Your credit has now been updated to ' + (+reply.body * 1.2) + ' credit'
      }
      messageBird.messages.create(params, (err, response) => {
        console.log(err ? err : response)
      })
    }
  });
}

