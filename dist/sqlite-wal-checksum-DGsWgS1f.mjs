//#region src/infra/sqlite-wal-checksum.ts
const SQLITE_WAL_MAGIC_LE = 931071618;
const SQLITE_WAL_MAGIC_BE = 931071619;
function readUint32(buffer, offset, byteOrder) {
	return byteOrder === "LE" ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
}
/** Frames chain their checksum from the previous frame (or the WAL header). */
function sqliteWalChecksum(buffer, byteOrder, seed = [0, 0]) {
	let [first, second] = seed;
	for (let offset = 0; offset < buffer.length; offset += 8) {
		first = first + readUint32(buffer, offset, byteOrder) + second >>> 0;
		second = second + readUint32(buffer, offset + 4, byteOrder) + first >>> 0;
	}
	return [first, second];
}
//#endregion
export { sqliteWalChecksum as i, SQLITE_WAL_MAGIC_LE as n, readUint32 as r, SQLITE_WAL_MAGIC_BE as t };
