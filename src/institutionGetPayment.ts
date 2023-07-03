import GetPaymentsRecord from "./getPaymentRecord";
import Tools from "./tools";

export default class InstitutionGetPayment {
  _institutionId: string;
  _sendingInstitutionId: string;
  _createDate: string;
  _paymentDate: string;
  _institutionName: string;
  _serialNumber: string;
  _payments: GetPaymentsRecord[];

  /**
   * Create a receiving payments record
   * @param {string} institutionId The institution Id ( Given by Masav )
   * @param {string} sendingInstitutionId The sending institution Id ( Given by Masav )
   * @param {string} createDate The creation date of the record ( YYMMDD )
   * @param {string} paymentDate The payment date ( YYMMDD )
   * @param {string} institutionName The institution name
   * @param {string} serialNumber Serial number of the record
   */
  constructor(
    institutionId: string,
    sendingInstitutionId: string,
    createDate: string,
    paymentDate: string,
    institutionName: string,
    serialNumber: string,
  ) {
    if (institutionId.length > 8)
      throw new Error(
        "institution Id can't be longer than 8 digits. institutionId=" +
          institutionId
      );
    if (sendingInstitutionId.length > 5)
      throw new Error(
        "institution Id can't be longer than 5 digits. sendingInstitutionId=" +
          sendingInstitutionId
      );
    if (createDate.length !== 6)
      throw new Error(
        "Create date needs to be in the following format YYMMDD. createDate=" +
          createDate
      );
    if (paymentDate.length !== 6)
      throw new Error(
        "Payment date needs to be in the following format YYMMDD. paymentDate=" +
          paymentDate
      );
    if (serialNumber.length > 3)
      throw new Error(
        "serial number can't be longer than 3 digits. serialNumber=" +
          serialNumber
      );
    this._institutionId = institutionId;
    this._sendingInstitutionId = sendingInstitutionId;
    this._createDate = createDate;
    this._paymentDate = paymentDate;
    this._institutionName = institutionName;
    this._serialNumber = serialNumber;
    this._payments = [];
  }

  toString() {
    return `MasavGetPayment Institution Id=${this._institutionId} Payments.length=${this._payments.length}`;
  }

  /**
   * Add get payment record
   * @param {GetPaymentsRecord[]} records Payment record list
   */
  addPaymentRecords(records: GetPaymentsRecord[]) {
    this._payments = [...this._payments, ...records];
  }

  /**
   * Add get payment record
   * @param {GetPaymentsRecord} record Payment record
   */
  addPaymentRecord(record: GetPaymentsRecord) {
    this._payments = [...this._payments, record];
  }

  /**
   * Get institution get payments buffer
   */
  getBuffer() {
    if (this._payments.length === 0)
      throw new Error(
        "There are no records in institution " + this._institutionName
      );

    let header = Buffer.concat([
      Tools.stringToBuffer("K", 1, "X"),
      Tools.stringToBuffer(this._institutionId, 8, "N"),
      Tools.stringToBuffer("", 2, "N"),
      Tools.stringToBuffer(this._paymentDate, 6, "N"),
      Tools.stringToBuffer("", 1, "N"),
      Tools.stringToBuffer(this._serialNumber, 3, "N"),
      Tools.stringToBuffer("", 1, "N"),
      Tools.stringToBuffer(this._createDate, 6, "N"),
      Tools.stringToBuffer(this._sendingInstitutionId, 5, "N"),
      Tools.stringToBuffer("", 6, "N"),
      Tools.stringToBuffer(this._institutionName, 30, "X"),
      Tools.stringToBuffer("", 56, "X"),
      Tools.stringToBuffer("KOT", 3, "X"),
      Tools.getEndOfRecordBuffer(),
    ]);
    let records: Buffer[] = this._payments.map((record) =>
      record.getBuffer(this._institutionId)
    );
    let sumAmount: number = this._payments
      .map((payment) => payment._amount)
      .reduce((a, b) => a + b, 0);
    
    // Same as send payment but lines 7 & 8, and 9 & 10 are switched
    let sum = Buffer.concat([
      Tools.stringToBuffer("5", 1, "X"),
      Tools.stringToBuffer(this._institutionId, 8, "N"),
      Tools.stringToBuffer("00", 2, "N"),
      Tools.stringToBuffer(this._paymentDate, 6, "N"),
      Tools.stringToBuffer("", 1, "N"),
      Tools.stringToBuffer(this._serialNumber, 3, "N"),
      Tools.stringToBuffer("", 15, "N"),
      Tools.stringToBuffer(String(Math.floor(sumAmount)), 13, "N"),
      Tools.stringToBuffer(String(Math.round(sumAmount * 100) % 100), 2, "N"),
      Tools.stringToBuffer("", 7, "N"),
      Tools.stringToBuffer(String(this._payments.length), 7, "N"),
      Tools.stringToBuffer("", 63, "X"),
      Tools.getEndOfRecordBuffer(),
    ]);
    return Buffer.concat([header, ...records, sum]);
  }
}
