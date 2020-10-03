# Masav
A JavaScript library for building "Masav" files - Israeli sending payments file.
>Warning! This library is new and is not supported by "Masav"
## Installation
```bash
npm i masav
```
## Importing
```javascript
const { InstitutionSendPayment, SendPaymentsRecord, MasaVSendPayments } = require("masav");
```
## Building Masav File
To build a file you will need the institution details that you got from "Masav", and details about the transactions.
You will need to create an instance of ```MasaVSendPayments```.
```javascript
let masavFile = new MasaVSendPayments();
```
And an instance of ```InstitutionSendPayment```.
```javascript
let institution = new InstitutionSendPayment(
  "12345678",
  "12345",
  "201005",
  "201005",
  "<Company-Name>",
  "001"
);
```
Then add the transactions to the institution
```javascript
institution.addPaymentRecords([
  new SendPaymentsRecord(
    "01",
    "123",
    "123456789",
    "000000018",
    "Receiver Name",
    "000001234",
    12
  ),
  new SendPaymentsRecord(
    "09",
    "222",
    "654321",
    "000000018",
    "Receiver Name",
    "000001234",
    100.12
  ),
]);
```
Add the institution to the file
```javascript
masavFile.addInstitution(institution);
```
Save the file ( Works only on Nodejs )
```javascript
masavFile.saveFile('test.bin');
```
Or get Buffer
```javascript
let buffer = masavFile.toBuffer();
```
## Full Example
```javascript
const { InstitutionSendPayment, SendPaymentsRecord, MasaVSendPayments } = require("masav");

let masavFile = new MasaVSendPayments();
let institution = new InstitutionSendPayment(
  "12345678",
  "12345",
  "201005",
  "201005",
  "<Company-Name>",
  "001"
);
institution.addPaymentRecords([
  new SendPaymentsRecord(
    "01",
    "123",
    "123456789",
    "000000018",
    "Receiver Name",
    "000001234",
    12
  ),
  new SendPaymentsRecord(
    "09",
    "222",
    "654321",
    "000000018",
    "Receiver Name",
    "000001234",
    100.12
  ),
]);
masavFile.addInstitution(institution);
masavFile.saveFile('test.bin');
```
