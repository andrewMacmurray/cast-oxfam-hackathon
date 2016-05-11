require('env2')('config.env')
const messageBird = require('messagebird')(process.env.API_KEY)
const checkUserAddCredit = require('../redis/redisFunctions.js').checkUserAddCredit

module.exports.getMessages = () => {
  messageBird.messages.read('', (err, response) => {
    console.log('running')
    const receivedTexts = response.items.filter(text => text.direction === 'mo')
    const arrOfObj = receivedTexts.map(text => {
      const dateFormat = new Date(text.createdDatetime)
      const timeDiff= Date.now() - dateFormat.getTime()
      return {
        id: text.id,
        direction: text.direction,
        phoneNumber: text.originator,
        credit: text.body,
        timeDiff
      }
    });
    // console.log('messagebird running', arrOfObj);
    const reply = arrOfObj.filter(el => el.timeDiff < 5000)[0]
    if(reply) {
      checkUserAddCredit(reply.phoneNumber, reply.credit).then(result => {
        const body = (result)
        ? 'Your credit has now been updated to ' + result + ' credit'
        : 'Your number is not recognised. Please register at www.fruitandveg.com'

        var params = {
          originator: '+447860039047',
          recipients: [
            '00447985156114'
          ],
          body: body
        }

        messageBird.messages.create(params, (err, response) => {
          console.log(err ? err : response)
        })
      })
    }
  });
}
