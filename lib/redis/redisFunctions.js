// All database helper functions should take the redis client object as the first argument
var createClient = require('./client.js')
var client = createClient()
var Bluebird = require('bluebird')

const dummyData = [
  {phoneNumber: '+447885727095', credit: 5, voucher: 'AB345TY'},
  {phoneNumber: '+447422516408', credit: 0, voucher: 'KB9H5TP'},
  {phoneNumber: '+441234567891', credit: 12, voucher: 'NB345EK'}
]

const addMockUsers = () => {
  dummyData.forEach(user => {
    client.HMSET(user.phoneNumber,
      'phoneNumber', user.phoneNumber,
      'credit', user.credit,
      'voucher', user.voucher
    )
    client.LPUSH('phoneNumbers', user.phoneNumber)
  })
}

const getAllPhoneNumbers = () => {
  return client.LRANGEAsync('phoneNumbers', 0, -1)
}

const getUser = (phoneNumber) => {
  return client.HGETALLAsync(phoneNumber)
}

const getUsers = (phoneNumbers) => {
  const users = phoneNumbers.map(number => getUser(number))
  return Bluebird.all(users)
}

const getVoucherCode = (phoneNumber) => {
  return getUser(phoneNumber)
    .then(user => user.voucher)
}

const getBalance = (phoneNumber) => {
  return getUser(phoneNumber)
    .then(user => user.credit)
}

const addCredit = (phoneNumber, creditToAdd) => {
  const validUser = client.EXISTSAsync(phoneNumber)
  if (validUser) {
    return getUser(phoneNumber)
    .then(user => client.HSET(phoneNumber, 'credit', parseInt(user.credit) + parseInt(creditToAdd)))
    .then(() => getUser(phoneNumber))
    .then(data => 'you now have £' + data.credit + ' credit')
  } else {
    return 'invalid user'
  }
}

const checkUserAddCredit = (phoneNumber, creditToAdd) => {
  return getUser(phoneNumber)
    .then(() => addCredit(phoneNumber, creditToAdd))
    .catch(err => 'invalid user')
}

module.exports = {
  addMockUsers,
  getUser,
  getUsers,
  getVoucherCode,
  getBalance,
  getAllPhoneNumbers,
  checkUserAddCredit,
  addCredit,
}

// var a = {
//   id: 12345678,
//   originator: '+44123456789',
//   body: 50,
//   createdDatetime: '2012-04-13:30'
// }
