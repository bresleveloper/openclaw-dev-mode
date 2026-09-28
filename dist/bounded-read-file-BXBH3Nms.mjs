//#region src/media/bounded-read-file.ts
const BOUNDED_OUTBOUND_MEDIA_READ_FILE = Symbol("boundedOutboundMediaReadFile");
/** Marks an owned reader that can reject oversized files before buffering them. */
function createBoundedOutboundMediaReadFile(readFile) {
	const wrapped = (async (filePath) => await readFile(filePath));
	Object.defineProperty(wrapped, BOUNDED_OUTBOUND_MEDIA_READ_FILE, { value: readFile });
	return wrapped;
}
/** Passes source limits only to owned readers; public callbacks keep their one-argument contract. */
async function readOutboundMediaFile(readFile, filePath, options) {
	const boundedReadFile = readFile[BOUNDED_OUTBOUND_MEDIA_READ_FILE];
	return boundedReadFile ? await boundedReadFile(filePath, options) : await readFile(filePath);
}
//#endregion
export { readOutboundMediaFile as n, createBoundedOutboundMediaReadFile as t };
