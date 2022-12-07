/**
 * 结合时间戳和自定义进制方案处理生成UUID
 * @param startsWord 定义起始字符，如：as
 * @param hex 指定进制，如：10 16 32
 * @returns 32位字符+4个连接号-组成的uuid，如：as187860-7f8d-82a5-2d34-618460a1ac39
 */
export function Uuid(startsWord: string = '', hex: number = 16): string {
  let starts: string = startsWord + Date.now().toString(36);
  let temp: string = '********-****-****-****-************';
  if (starts.length > 8) {
    starts = starts.substring(0, 8) + '-' + starts.substring(8);
  }
  temp = temp.substring(starts.length);
  return (
    starts +
    temp.replace(/[\*]/g, (c) => {
      if (c === '*') {
        return ((Math.random() * hex) | 0).toString(hex);
      } else {
        return c;
      }
    })
  );
}
