export const useBluetoothDataParser = () => {
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

  // 16 进制转 10 进制
  const hexToDecimal = (hex) => {
    return parseInt(hex.split(" ").join(""), 16);
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

  // 校验 16 进制数据是否合法
  const isAvailableHex = (hex) => {
    return (
      hex.substr(-2).toUpperCase() ===
      cs(hex.substr(0, hex.length - 3)).toUpperCase()
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
    isAvailableHex,
  };
};
