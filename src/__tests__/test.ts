import { readFileSync } from "fs";
import {
    MasaVSendPayments,
    InstitutionSendPayment,
    SendPaymentsRecord,
    Tools, MasaVGetPayments,
} from "../index";
import InstitutionGetPayment from "../institutionGetPayment";
import GetPaymentsRecord from "../getPaymentRecord";

test('Tools.stringToBuffer("123", 6, "N")', () => {
  expect(Tools.stringToBuffer("123", 6, "N")).toStrictEqual(
    Buffer.from([48, 48, 48, 49, 50, 51])
  );
});

test('Tools.stringToBuffer("123", 6, "X")', () => {
  expect(Tools.stringToBuffer("123", 6, "X")).toStrictEqual(
    Buffer.from([32, 32, 32, 49, 50, 51])
  );
});

test('Tools.stringToBuffer("123", 3, "X")', () => {
  expect(Tools.stringToBuffer("123", 3, "X")).toStrictEqual(
    Buffer.from([49, 50, 51])
  );
});

test('Tools.stringToBuffer("123", 3, "N")', () => {
  expect(Tools.stringToBuffer("123", 3, "N")).toStrictEqual(
    Buffer.from([49, 50, 51])
  );
});

test('Tools.stringToBuffer("123", 2, "N")', () => {
  expect(Tools.stringToBuffer("123", 2, "N")).toStrictEqual(
    Buffer.from([49, 50])
  );
});

test('Tools.stringToBuffer("123", 2, "X")', () => {
  expect(Tools.stringToBuffer("123", 2, "X")).toStrictEqual(
    Buffer.from([49, 50])
  );
});

test('Tools.getASCIIValue("א")', () => {
  expect(Tools.getASCIIValue("א")).toStrictEqual(38);
});

test('Tools.getASCIIValue("ת")', () => {
  expect(Tools.getASCIIValue("ת")).toStrictEqual(90);
});

test("Test the full send file", () => {
  expect(
    (() => {
      let masavFile = new MasaVSendPayments();
      let institution = new InstitutionSendPayment(
        "12345678",
        "12345",
        "200507",
        "200507",
        "Company ISRAEL LTD.",
        "404"
      );
      institution.addPaymentRecords([
        new SendPaymentsRecord(
          "11",
          "303",
          "007008629",
          "123123127",
          "Leto II Atreides",
          "00000000000001313131",
          85
        ),
        new SendPaymentsRecord(
          "31",
          "051",
          "000283487",
          "123456782",
          "Thorin Oakenshield",
          "00000000000001122233",
          1346.37
        ),
      ]);
      masavFile.addInstitution(institution);
      return masavFile.toBuffer();
    })()
  ).toEqual(
    (() => {
      let file: Buffer = readFileSync("send_example.bin");
      return file;
    })()
  );
});

test("Test the full get file", () => {
  expect(
    (() => {
      let masavFile = new MasaVGetPayments();
      let institution = new InstitutionGetPayment(
        "12345678",
        "12345",
        "200507",
        "200507",
        "Company ISRAEL LTD.",
        "404"
      );
      institution.addPaymentRecords([
        new GetPaymentsRecord(
          "11",
          "303",
          "007008629",
          "123123127",
          "Leto II Atreides",
          "00000000000001313131",
          85
        ),
        new GetPaymentsRecord(
          "31",
          "051",
          "000283487",
          "123456782",
          "Thorin Oakenshield",
          "00000000000001122233",
          1346.37
        ),
      ]);
      masavFile.addInstitution(institution);
      return masavFile.toBuffer();
    })()
  ).toEqual(
    (() => {
      let file: Buffer = readFileSync("get_example.bin");
      return file;
    })()
  );
});
