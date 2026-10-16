import { readFileWindowFully } from "@openclaw/fs-safe/advanced";
//#region src/config/sessions/file-range.ts
async function readFileRangeAsync(fileHandle, position, length) {
	const buffer = Buffer.alloc(length);
	const bytesRead = await readFileWindowFully(fileHandle, buffer, position);
	return bytesRead === length ? buffer : buffer.subarray(0, bytesRead);
}
//#endregion
export { readFileRangeAsync as t };
