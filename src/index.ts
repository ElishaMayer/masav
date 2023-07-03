"use strict";

import InstitutionSendPayment from "./institutionSendPayment";
import InstitutionGetPayment from "./institutionGetPayment";
import { writeFileSync } from "fs";
import Tools from "./tools";
import SendPaymentsRecord from "./sendPaymentRecord";
import GetPaymentsRecord from "./getPaymentRecord";

class MasaVSendPayments {
  _institutions: InstitutionSendPayment[] = [];

  addInstitution(institution: InstitutionSendPayment) {
    this._institutions = [...this._institutions, institution];
  }

  addInstitutions(institutions: InstitutionSendPayment[]) {
    this._institutions = [...this._institutions, ...institutions];
  }

  toBuffer() {
    if (this._institutions.length === 0)
      throw new Error("There are no institutions");
    let buffer: Buffer = Buffer.concat([
      ...this._institutions.map((institution) => institution.getBuffer()),
      Tools.getEndOfFileRecord(),
    ]);
    return buffer;
  }

  saveFile(path: string) {
    writeFileSync(path, this.toBuffer());
  }
}

class MasaVGetPayments {
  _institutions: InstitutionGetPayment[] = [];

  addInstitution(institution: InstitutionGetPayment) {
    this._institutions = [...this._institutions, institution];
  }

  addInstitutions(institutions: InstitutionGetPayment[]) {
    this._institutions = [...this._institutions, ...institutions];
  }

  toBuffer() {
    if (this._institutions.length === 0)
      throw new Error("There are no institutions");
    let buffer: Buffer = Buffer.concat([
      ...this._institutions.map((institution) => institution.getBuffer()),
      Tools.getEndOfFileRecord(),
    ]);
    return buffer;
  }

  saveFile(path: string) {
    writeFileSync(path, this.toBuffer());
  }
}

export {
  InstitutionSendPayment,
  InstitutionGetPayment,
  MasaVSendPayments,
  MasaVGetPayments,
  Tools,
  SendPaymentsRecord,
  GetPaymentsRecord,
};
