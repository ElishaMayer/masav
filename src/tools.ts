export type FieldType = "N" | "X";

export default class Tools {
    static getEndOfRecordBuffer() {
      let buffer: Buffer = Buffer.alloc(2);
      buffer[0] = 13;
      buffer[1] = 10;
      return buffer;
    }
    static getEndOfFileRecord() {
      let buffer: Buffer = Buffer.alloc(128);
      for (let index = 0; index < 128; index++) {
        buffer[index] = 57;
      }
      return buffer;
    }
    static stringToBuffer(
      str: string,
      length: number,
      type: FieldType,
      reverse?: boolean
    ) {
      if (str.length > length) {
        str = str.substr(0, length);
      }
      let arr: string[] = [];
      for (let index = 0; index < str.length; index++) {
        arr.push(str[index]);
      }
      if (arr.length < length && type === "N") {
        let offset = length - arr.length;
        for (let index = 0; index < offset; index++) {
          arr.unshift("0");
        }
      }
      if (arr.length < length && type === "X") {
        let offset = length - arr.length;
        for (let index = 0; index < offset; index++) {
          arr.unshift(" ");
        }
      }
      if (reverse) {
        arr = arr.reverse();
      }
      let buffer: Buffer = Buffer.alloc(length);
      for (let index = 0; index < length; index++) {
        buffer[index] = arr[index].charCodeAt(0);
      }
      return buffer;
    }
  }
  