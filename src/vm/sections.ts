export function decodeSections(data: Buffer): Buffer[] {
  const result: Buffer[] = new Array<Buffer>();
  let remainingLen = data.length;
  while (remainingLen >= 4) {
    const tailLen = data
      .subarray(remainingLen - 4, remainingLen)
      .readUInt32BE();
    result.push(data.subarray(remainingLen - 4 - tailLen, remainingLen - 4));
    remainingLen -= 4 + tailLen;
  }
  result.reverse();
  return result;
}
