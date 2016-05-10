// All database helper functions should take the redis client object as the first argument

module.exports.addUser = (client, messageObject, credit) => {
  const phoneNumber = messageObject.originator
  return client.HMSET('users', phoneNumber, credit)
}
