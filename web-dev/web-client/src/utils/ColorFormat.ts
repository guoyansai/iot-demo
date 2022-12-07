export function getHex(num: number) {
  let val = num.toString(16);
  val = val.length === 1 ? '0' + val : val;
  return val;
}
export function rgbaToHexa(red, green, blue, alpha) {
  red = getHex(red);
  green = getHex(green);
  blue = getHex(blue);
  alpha = Math.round(alpha * 255);
  alpha = getHex(alpha);
  return '#' + red + green + blue + alpha;
}

export function hexaToRgba(color) {
  const value = color.slice(color.indexOf('#') + 1);
  const isShort = value.length === 3 || value.length === 4;
  const hasAlpha = value.length === 4 || value.length === 8;
  const r = isShort ? value.charAt(0) + value.charAt(0) : value.substring(0, 2);
  const g = isShort ? value.charAt(1) + value.charAt(1) : value.substring(2, 4);
  const b = isShort ? value.charAt(2) + value.charAt(2) : value.substring(4, 6);
  let a = hasAlpha
    ? isShort
      ? value.charAt(3) + value.charAt(3)
      : value.substring(6, 8)
    : 'FF';
  a = parseFloat((parseInt(a, 16) / 255).toFixed(2));
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), a];
}
