// All database helper functions should take the redis client object as the first argument
var createClient = require('./client.js')
var client = createClient()
var Bluebird = require('bluebird')
require('env2')('config.env')
const messageBird = require('messagebird')(process.env.API_KEY)

const dummyData = [
  {phoneNumber: '+447885727095', credit: 5},
  {phoneNumber: '+447422516408', credit: 0},
  {phoneNumber: '+441234567891', credit: 12}
]

const handleNull = (data) => {
  return data === null ? Promise.reject() : data
}

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
    .then(handleNull)
}

const getUsers = (phoneNumbers) => {
  const users = phoneNumbers.map(number => getUser(number))
  return Bluebird.all(users)
}

const getBalance = (phoneNumber) => {
  return getUser(phoneNumber)
    .then(user => user.credit)
    .catch(() => 'invalid user')
}

const getNewVoucherCode = (phoneNumber) => {
  const code = generateCode()
  addVoucherToDB(phoneNumber, code)
  console.log('number', phoneNumber, 'code>>', code)
  return code
}

const addCredit = (phoneNumber, creditToAdd) => {
  return getUser(phoneNumber)
    .then(user => client.HSET(phoneNumber, 'credit', parseInt(user.credit) + parseInt(creditToAdd)))
    .then(() => getUser(phoneNumber))
    .then(data => 'you now have £' + data.credit + ' credit')
    .catch(() => 'invalid user')
}

const checkUserAddCredit = (phoneNumber, creditToAdd) => {
  return getUser(phoneNumber)
    .then(() => addCredit(phoneNumber, creditToAdd))
}

const addVoucherToDB = (phoneNumber, code) => {
  console.log('inside addVoucherToDB function: number', phoneNumber, 'code>>', code)
  client.multi()
    .set(code, phoneNumber)
    .expire(code, 60*60)
    .execAsync()
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
  console.log('indeductCredit', phoneNumber, '!!!', charge)
  return getBalance(phoneNumber)
    .then(balance => {
      const newBalance = parseInt(balance) - charge
      if (newBalance >= 0) {
        // send recipt or new balance to user
        sendReciept(phoneNumber, newBalance, charge)
        return client.HSETAsync(phoneNumber, 'credit', newBalance).then(() => true)
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
      console.log('codeExists!!!>>', phoneNumber)
      if (phoneNumber) {
        deleteCode(voucherCode).then(console.log)
        return deductCredit(phoneNumber, charge)
      } else {
        return false
      }
    })
}

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

const sendReciept = (phoneNumber, newBalance, charge) => {
  var params = {
    originator: '+447860039047',
    recipients: [
      phoneNumber
    ],
    body: 'successful transaction of £' + charge + ', your new balance is ' + newBalance
  }

  messageBird.messages.create(params, (err, response) => {
    console.log(err ? err : response)
  })
}
