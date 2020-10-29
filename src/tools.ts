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
    return Buffer.concat([buffer, Tools.getEndOfRecordBuffer()]);
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
      buffer[index] = this.getASCIIValue(arr[index]) || 32;
    }
    return buffer;
  }
  static getASCIIValue(char: string) {
    if (typeof ASCII_HEBREW.get(char) === "number") {
      return ASCII_HEBREW.get(char);
    } else {
      return char.charCodeAt(0);
    }
  }
}

const ASCII_HEBREW = new Map([
  ["א", 38],
  ["ב", 65],
  ["ג", 66],
  ["ד", 67],
  ["ה", 68],
  ["ו", 69],
  ["ז", 70],
  ["ח", 71],
  ["ט", 72],
  ["י", 73],
  ["ך", 74],
  ["כ", 75],
  ["ל", 76],
  ["ם", 77],
  ["מ", 78],
  ["ן", 79],
  ["נ", 80],
  ["ס", 81],
  ["ע", 82],
  ["ף", 83],
  ["פ", 84],
  ["ץ", 85],
  ["צ", 86],
  ["ק", 87],
  ["ר", 88],
  ["ש", 89],
  ["ת", 90],
]);
