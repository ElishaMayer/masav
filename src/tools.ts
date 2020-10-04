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
  ["א", 128],
  ["ב", 129],
  ["ג", 130],
  ["ד", 131],
  ["ה", 132],
  ["ו", 133],
  ["ז", 134],
  ["ח", 135],
  ["ט", 136],
  ["י", 137],
  ["ך", 138],
  ["כ", 139],
  ["ל", 140],
  ["ם", 141],
  ["מ", 142],
  ["ן", 143],
  ["נ", 144],
  ["ס", 145],
  ["ע", 146],
  ["ף", 147],
  ["פ", 148],
  ["ץ", 149],
  ["צ", 150],
  ["ק", 151],
  ["ר", 152],
  ["ש", 153],
  ["ת", 154],
]);
