import { CommunicationError } from "../errors/index.js";
export function readRegion(memory, ptr, maxLength) {
    const region = getRegion(memory, ptr);
    if (region.length > maxLength) {
        throw CommunicationError.regionLengthTooBig(region.length, maxLength);
    }
    return Buffer.from(new Uint8Array(memory.buffer.slice(region.offset, region.offset + region.length)));
}
export function writeRegion(memory, ptr, data) {
    const region = getRegion(memory, ptr);
    new Uint8Array(memory.buffer)
        .subarray(region.offset, region.offset + data.length)
        .set(data);
    region.length = data.length;
    setRegion(memory, ptr, region);
}
export function getRegion(memory, ptr) {
    const cells = new Uint8Array(memory.buffer).subarray(ptr, ptr + 12);
    return {
        offset: new Uint32Array(cells.slice(0, 4).buffer)[0],
        capacity: new Uint32Array(cells.slice(4, 8).buffer)[0],
        length: new Uint32Array(cells.slice(8, 12).buffer)[0],
    };
}
export function setRegion(memory, ptr, data) {
    const offset = Buffer.allocUnsafe(4);
    offset.writeUInt32LE(data.offset, 0);
    const capacity = Buffer.allocUnsafe(4);
    capacity.writeUInt32LE(data.capacity, 0);
    const length = Buffer.allocUnsafe(4);
    length.writeUInt32LE(data.length, 0);
    new Uint8Array(memory.buffer)
        .subarray(ptr, ptr + 12)
        .set(Buffer.concat([offset, capacity, length]));
}
//# sourceMappingURL=memory.js.map