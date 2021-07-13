export const useBluetoothPipe = () => {
  // 补零
  const fillZero = (string, length) => {
    return (Array(length).join(0) + string).slice(-length);
  };

  // 16 进制截取部分
  const subHex = (hex, first, last) => {
    return hex
      .split(" ")
      .filter((item, index) => index >= first && index <= last)
      .join(" ");
  };

  // 16 进制转有符号 10 进制
  // 参考：https://www.cnblogs.com/BlackFungus/p/9473008.html
  const hexToDecimal = (hex) => {
    let binary = parseInt(hex, 16).toString(2);

    const binaryLength = hex.length * 4;

    if (binary.length < binaryLength) {
      while (binary.length < binaryLength) {
        binary = "0" + binary;
      }
    }

    if (binary.substring(0, 1) === "0") {
      return parseInt(binary, 2);
    } else {
      let unsignedBinary = "";

      binary = parseInt(binary, 2) - 1;
      binary = binary.toString(2);

      unsignedBinary = binary.substring(1, binaryLength);
      unsignedBinary = unsignedBinary.replace(/0/g, "z");
      unsignedBinary = unsignedBinary.replace(/1/g, "0");
      unsignedBinary = unsignedBinary.replace(/z/g, "1");

      return parseInt(-unsignedBinary, 2);
    }
  };

  // 16 进制转 2 进制
  const hexToBinary = (hex) => {
    return hexToDecimal(hex).toString(2);
  };

  // 16 进制转 10 进制数组
  const hexToDecimalArray = (hex) => {
    return hex.split(" ").map((item) => hexToDecimal(item));
  };

  // 16 进制转 10 进制
  const decimalToHex = (decimal, length) => {
    const string = fillZero(parseInt(decimal).toString(16), length);
    const ret = [];

    for (let i = 0; i < string.length / 2; i++) {
      ret.push(string.substr(i * 2, 2));
    }

    return ret.join(" ");
  };

  // 16 进制求和
  const sumHex = (hex) => {
    return hexToDecimalArray(hex).reduce((prev, current) => prev + current);
  };

  // 校验位
  const cs = (hex) => {
    return fillZero(parseInt(sumHex(hex) % 256).toString(16), 2);
  };

  // 拼接上校验位
  const joinWithCs = (hex) => {
    return hex + " " + cs(hex);
  };

  // 校验 16 进制数据是否合法
  const isAvailableHex = (hex) => {
    return (
      hex.substr(-2).toLowerCase() ===
      cs(hex.substr(0, hex.length - 3)).toLowerCase()
    );
  };

  return {
    subHex,
    hexToDecimal,
    hexToDecimalArray,
    decimalToHex,
    hexToBinary,
    sumHex,
    cs,
    joinWithCs,
    isAvailableHex,
  };
};
