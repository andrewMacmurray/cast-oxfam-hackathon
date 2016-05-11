require('env2')('config.env')
const messageBird = require('messagebird')(process.env.API_KEY)
const db = require('../redis/redisFunctions.js')
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
        body: text.body,
        timeDiff
      }
    });
    // console.log('messagebird running', arrOfObj);
    const reply = arrOfObj.filter(el => el.timeDiff < 3000)[0]
    if(reply) {
      console.log('replying', reply)
      if(reply.body.split(' ')[0].toLowerCase() === 'buy') {
        checkUserAddCredit(reply.phoneNumber, reply.body.split(' ')[1]).then(result => {
          console.log('>>>>', result, '<<<<<')
          const body = (result)
          ? 'Your credit has now been updated to ' + result + ' credit'
          : 'Your number is not recognised. Please register at www.fruitandveg.com'

          var params = {
            originator: '+447860039047',
            recipients: [
              '+' + reply.phoneNumber
            ],
            body: body
          }

          messageBird.messages.create(params, (err, response) => {
            console.log(err ? err : response)
          })
        })
      } else {
          console.log('Get voucher received');
          const result = db.getNewVoucherCode('+' + reply.phoneNumber)
          const body = (result)
          ? 'Your code is ' + result
          : 'Your number is not recognised. Please register at www.fruitandveg.com'

          var params = {
            originator: '+447860039047',
            recipients: [
              '+' + reply.phoneNumber
            ],
            body: body
          }

          messageBird.messages.create(params, (err, response) => {
            console.log(err ? err : response)
          })
      }
    }
  });
}
