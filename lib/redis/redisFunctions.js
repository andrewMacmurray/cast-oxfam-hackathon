// All database helper functions should take the redis client object as the first argument
var createClient = require('./client.js')
var client = createClient()
var Bluebird = require('bluebird')

const dummyData = [
  {phoneNumber: '+447885727095', credit: 5},
  {phoneNumber: '+447422516408', credit: 0},
  {phoneNumber: '+441234567891', credit: 12}
]

const addMockUsers = () => {
  dummyData.forEach(user => {
    client.HMSET(user.phoneNumber,
      'phoneNumber', user.phoneNumber,
      'credit', user.credit
    )
    client.LPUSH('phoneNumbers', user.phoneNumber)
  })
}

const addUser = (phoneNumber, credit) => {
  return client.HMSETAsync(phoneNumber,
    'phoneNumber', phoneNumber,
    'credit', credit
  )
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

const getBalance = (phoneNumber) => {
  return getUser(phoneNumber)
    .then(user => user.credit)
}

const getNewVoucherCode = (phoneNumber) => {
  const code = generateCode()
  return addVoucherToDB(phoneNumber, code)
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
}

const addVoucherToDB = (phoneNumber, code) => {
  return client.multi()
    .set(code, phoneNumber)
    .expire(code, 60*60)
    .execAsync()
    .then( data => {
      return data
    })
}

const getPhoneNumberFromVoucher = (voucherCode) => {
  return client.GETAsync(voucherCode)
}

const generateCode = () => {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const n = alpha[Math.floor(Math.random()*26)]
  const m = alpha[Math.floor(Math.random()*26)]
  return Date.now().toString().slice(-3) + n + m
}

const checkCode = (voucherCode) => {
  return client.KEYSAsync('*')
    .then(keys => {
      if(keys.indexOf(voucherCode) >= 0) {
        return getPhoneNumberFromVoucher(voucherCode)
      } else {
        return false
      }
    })
}

const deductCredit = (phoneNumber, charge) => {
  return getBalance(phoneNumber)
    .then(balance => {
      const newBalance = parseInt(balance) - charge
      if (newBalance >= 0) {
        return client.HSETAsync(phoneNumber, 'credit', newBalance).then(() => true)
        // send recipt or new balance to user
      } else {
        return false
      }
    })
}

const deleteCode = (code) => {
  return client.DELAsync(code)
}

const makeTransaction = (charge, voucherCode) => {
  return checkCode(voucherCode)
    .then(phoneNumber => {
      if (phoneNumber) {
        deleteCode(voucherCode).then(console.log)
        return deductCredit(phoneNumber, charge)
      } else {
        return false
      }
    })
}

// check code (vendor sends code up)
// check code exists
// if it exists get phone number attached
// then check credit
// if enough deduct credit (or send back error)
// send back success message

module.exports = {
  addMockUsers,
  addUser,
  getUser,
  getUsers,
  getBalance,
  getAllPhoneNumbers,
  checkUserAddCredit,
  addCredit,
  checkCode,
  deductCredit,
  makeTransaction,
  getNewVoucherCode
}

var a = {
  id: 12345678,
  originator: '+44123456789',
  body: 50,
  createdDatetime: '2012-04-13:30'
}
