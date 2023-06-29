import Tools from "./tools";

export default class SendPaymentsRecord {
  _bankDetails: BankAccount;
  _payeeId: string;
  _payeeName: string;
  _payeeNumber: string;
  _amount: number;
  _paymentPeriod: TimeSpan;

  /**
   *
   * @param {string} bankId Payee bank account id ( 2 numbers only, for example '01' )
   * @param {string} branchId Payee bank account branch id ( 3 numbers only, for example '610' )
   * @param {string} accountId Payee bank account number ( numbers only, for example '123456' )
   * @param {string} payeeId Payee id ( תעודת זהות - number only )
   * @param {string} payeeName Payee name
   * @param {string} payeeNumber Payee number ( numbers only, for example '123456' )
   * @param {number} amount Amount to pay ( >0 )
   * @param {TimeSpan} paymentPeriod Payment period
   */
  constructor(
    bankId: string,
    branchId: string,
    accountId: string,
    payeeId: string,
    payeeName: string,
    payeeNumber: string,
    amount: number,
    paymentPeriodStart?: string,
    paymentPeriodEnd?: string
  ) {
    if (amount <= 0) throw new Error("Amount needs to be bigger than 0");
    if (bankId.length > 2) throw new Error("Invalid Bank Id: " + bankId);
    if (branchId.length > 3)
      throw new Error("Invalid Bank branch Id: " + branchId);
    if (accountId.length > 9)
      throw new Error("Invalid Bank account number : " + accountId);
    if (payeeId.length > 9) throw new Error("Invalid payee Id : " + payeeId);

    this._bankDetails = new BankAccount(bankId, branchId, accountId);
    this._payeeId = payeeId;
    this._payeeName = payeeName;
    this._payeeNumber = payeeNumber;
    this._amount = amount;
    this._paymentPeriod = new TimeSpan(paymentPeriodStart, paymentPeriodEnd);
  }

  getBuffer(institutionId: string) {
    return Buffer.concat([
      Tools.stringToBuffer("1", 1, "X"),
      Tools.stringToBuffer(institutionId, 8, "N"),
      Tools.stringToBuffer("", 2, "N"),
      Tools.stringToBuffer("", 6, "N"),
      this._bankDetails.getBuffer(),
      Tools.stringToBuffer("", 1, "N"),
      Tools.stringToBuffer(this._payeeId, 9, "N"),
      Tools.stringToBuffer(this._payeeName, 16, "X", true),
      Tools.stringToBuffer(String(Math.floor(this._amount)), 11, "N"),
      Tools.stringToBuffer(
        String(Math.round(this._amount * 100) % 100),
        2,
        "N"
      ),
      Tools.stringToBuffer(this._payeeNumber, 20, "N"),
      this._paymentPeriod.getBuffer(),
      Tools.stringToBuffer("", 3, "N"),
      Tools.stringToBuffer("006", 3, "N"),
      Tools.stringToBuffer("", 18, "N"),
      Tools.stringToBuffer("  ", 2, "X"),
      Tools.getEndOfRecordBuffer(),
    ]);
  }

  toString() {
    return `SendPaymentsRecord Payee Name=${this._payeeName} Amount=${this._amount}`;
  }
}

export class BankAccount {
  _bankId: string;
  _branchId: string;
  _accountId: string;

  /**
   * Israely bank account
   * @param {string} bankId Bank Id ( for example '01' )
   * @param {string} branchId Branch Id ( for example '123' )
   * @param {string} accountId Account number ( for example '123456' )
   */
  constructor(bankId: string, branchId: string, accountId: string) {
    this._bankId = bankId;
    this._branchId = branchId;
    this._accountId = accountId;
  }

  /**
   * Get Bank details buffer
   */
  getBuffer() {
    return Buffer.concat([
      Tools.stringToBuffer(this._bankId, 2, "N"),
      Tools.stringToBuffer(this._branchId, 3, "N"),
      Tools.stringToBuffer("", 4, "N"),
      Tools.stringToBuffer(this._accountId, 9, "N"),
    ]);
  }
}

export class TimeSpan {
  _start?: string;
  _end?: string;

  /**
   * time period
   * @param start Start time in format YYMM
   * @param end End time in format YYMM
   */
  constructor(start?: string, end?: string) {
    if (start && start.length > 4)
      throw new Error("Invalid start date (needs to be YYMM): " + start);
    if (end && end.length > 4)
      throw new Error("Invalid end date (needs to be YYMM): " + end);

    this._start = start;
    this._end = end;
  }

  /**
   * Get time period buffer
   */
  getBuffer() {
    let startStr = this._start || "0000";
    let endStr = this._end || "0000";
    return Tools.stringToBuffer(startStr + endStr, 8, "N");
  }
}
