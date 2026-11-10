import fs from "node:fs";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/positional-read.js
const MAX_READ_BYTES = 2147483647;
function validateWindow(buffer, position) {
	if (!Number.isSafeInteger(position) || position < 0 || !Number.isSafeInteger(position + buffer.length)) throw new RangeError("read position and window end must be non-negative safe integers");
}
/** Fills a caller-owned buffer from an explicit position, stopping at EOF. */
async function readFileWindowFully(handle, buffer, position, { signal } = {}) {
	validateWindow(buffer, position);
	signal?.throwIfAborted();
	let total = 0;
	while (total < buffer.length) {
		const { bytesRead } = await handle.read(buffer, total, Math.min(buffer.length - total, MAX_READ_BYTES), position + total);
		signal?.throwIfAborted();
		if (bytesRead === 0) break;
		total += bytesRead;
	}
	return total;
}
/** Synchronous positional read; neither variant advances or closes its descriptor. */
function readFileWindowFullySync(fd, buffer, position) {
	validateWindow(buffer, position);
	let total = 0;
	while (total < buffer.length) {
		const bytesRead = fs.readSync(fd, buffer, total, Math.min(buffer.length - total, MAX_READ_BYTES), position + total);
		if (bytesRead === 0) break;
		total += bytesRead;
	}
	return total;
}
//#endregion
export { readFileWindowFullySync as n, readFileWindowFully as t };
