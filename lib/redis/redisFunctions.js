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


var a = {
  id: 12345678,
  originator: '+44123456789',
  body: 50,
  createdDatetime: '2012-04-13:30'
}
