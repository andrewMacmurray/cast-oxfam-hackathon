// All database helper functions should take the redis client object as the first argument
var createClient = require('./client.js')
var client = createClient()
const dummyData = [{phoneNumber: '+447885727095', credit: 5}, {phoneNumber: '+447422516408', credit: 0}]

module.exports.addUser = () => {
  dummyData.forEach(user => {
    client.HMSETAsync('users', user.phoneNumber, user.credit)
  })
}

module.exports.checkUserAddCredit = (message) => {
  return client.HGETALLAsync('users').then(users => {
    const existingCredit = users[message.phoneNumber]
    console.log(existingCredit, 'existing credit');
    if (existingCredit) {
      // return promise
      const newCredit = parseInt(existingCredit) + parseInt(message.credit)
      console.log(newCredit, 'new credit')
      addCredit(message, newCredit)
      return newCredit
    } else {
      // return
      return false
    }
  });
}

const addCredit = (message, newCredit) => {
  console.log(newCredit, 'new credit')
  client.HSETAsync('users', message.phoneNumber, newCredit)
}


module.exports.setVoucher = (phoneNumber) => {
  return client.multi()
    .set(phoneNumber, generateCode())
    .expire(phoneNumber, 60*60)
    .execAsync()
    .then( data => {
      return data
    })
}

const generateCode = () => {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const n = alpha[Math.floor(Math.random()*26)]
  const m = alpha[Math.floor(Math.random()*26)]
  return Date.now().toString().slice(-3) + n + m
}
