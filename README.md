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
The constructor of ```InstitutionSendPayment``` get the following arguments:
| Argument Name  | Description | Format     |
| ------------- | ------------- | ----------|
| institutionId  | The institution Id ( Given by Masav )  | String, Numbers only, Max length 8 digits|
| sendingInstitutionId  | The sending institution Id ( Given by Masav )  | String, Numbers only, Max length 5 digits|
| createDate  | The creation date of the record  | String, Date in the following format YYMMDD |
| paymentDate  | The payment date  | String, Date in the following foramt YYMMDD |
| institutionName  | The institution name  | String, Max length 30 characters|
| serialNumber  | Serial number of the record  | String, Numbers only, Max length 3 digits|

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
The constructor of ```SendPaymentsRecord``` get the following arguments:
| Argument Name  | Description | Format     |
| ------------- | ------------- | ----------|
| bankId  | The bank Id number  | String, Numbers only, Max length 2 digits|
| branchId  | The bank branch Id  | String, Numbers only, Max length 3 digits|
| accountId  | The bank account number  | String, Numbers only, Max length 9 digits|
| payeeId  | Payee id ( תעודת זהות )  | String, Numbers only, Max length 9 digits|
| payeeName  | Payee name  | String, Max length 16 characters|
| payeeNumber  | Payee number  | String, Max length 20 characters|
| amount  | Amount to pay  | Number, Bigger than 0, Up to 2 digits after decimal|
| paymentPeriod  | Payment period  | TimeSpan ( gets start and end date as string YYMM ) not required |

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
