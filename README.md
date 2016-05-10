# Cast Oxfam Hackathon

[![Join the chat at https://gitter.im/andrewMacmurray/cast-oxfam-hackathon](https://badges.gitter.im/andrewMacmurray/cast-oxfam-hackathon.svg)](https://gitter.im/andrewMacmurray/cast-oxfam-hackathon?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Hackathon project for exchanging fruit and veg vouchers.


Using the MessageBird API which gives the user the ability to text in credit, receive bonus credit, then the users can show fruit and vegetables vendors the electronic voucher in exchange for the products.

The object being manipulated will contain the following:
```javascript
{id: 12345678,
originator: '0044123456789',
body: 50.00,
createdDatetime: '2012-04-13:30'}
```


The user sends the amount they want to be added to their account which will be contained within the body of the message, this will have bonus credit added to it and then they will receive a message confirming the credit has been added to their account and a unique voucher ID.
