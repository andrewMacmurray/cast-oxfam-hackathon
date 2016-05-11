# Cast Oxfam Hackathon

[![Join the chat at https://gitter.im/andrewMacmurray/cast-oxfam-hackathon](https://badges.gitter.im/andrewMacmurray/cast-oxfam-hackathon.svg)](https://gitter.im/andrewMacmurray/cast-oxfam-hackathon?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Hackathon project for exchanging fruit and veg vouchers.

### Why?

This product is aimed at low-income families in moderate to medium food insecurity. This means that they are compromising on quality and variety of food, and may be reducing meal quanities, due to financial constraints.

The fruit and veg voucher scheme offers subsidised purchasing of fruit and veg to these families, e.g. providing weekly vouchers at half the cost of the value of the voucher. The vouchers will be redeemed at local markets, supporting the local economy and ensuring that the vouchers are only used for the purchase of fruit and veg.

We know from testing the user group and secondary research that low income families purchase less healthy food, such as fruit and veg, due to the higher cost per calorie. However, we also know that the user group would like to be able to increase their consumption of these food types, as much, if not more, for the benefit of their children than for themselves.

Research also tells us that these families are in a financially precarious position, greatly increasing the likelihood of the need for emergency interventions, such as visiting a food bank or taking out a payday loan, should an unexpected cost arise, e.g. the washing machine breaking down or benefit delays. The scheme helps to build financial resilience to prevent the need for these emergency interventions by filtering part of the cost of the voucher into an emergency fund that the user can claim should a crisis arise.

In order for this scheme to work effectively an electronic voucher system is required. This will encourage more take up of the scheme by users so that they can buy fruit and veg as seamlessly as possible. It is also vital that the system also works so that market vendors are encouraged to accept the vouchers, increasing the variety of products that can be purchased and ensuring a good geographical spread of the scheme.

### What?

During the hackathon we are aiming to make a part of the digital voucher service where a user can send a text message to our service, and recieve a voucher code that they can redeem for fruit and veg at their local market.


### How?

![img_2205](https://cloud.githubusercontent.com/assets/14013616/15183877/e1628c00-178a-11e6-831a-f8f56ea74bf6.JPG)

+ Using the MessageBird API we can get the user to send and receive text messages.

+ The user will send a text message with how much credit they want to add to their account. Our server will then be polling MessageBird for any changes.

+ When our server detects a change it will update the redis database with the new credit, generate a unique voucher and send the user a message via MessageBird with the voucher (the voucher will expire after a given time [currently an hour])

+ The Vendor then has a simple webapp interface where they can input the voucher code and the price to deduct.

+ This updates the DB with the new balance and destroys the voucher

+ The user will then get a text message confirming  the purchase and the vendor will get a reply from our server confirming the transaction
