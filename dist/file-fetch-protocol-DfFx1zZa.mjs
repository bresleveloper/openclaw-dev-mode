//#region extensions/file-transfer/src/shared/file-fetch-protocol.ts
const FILE_FETCH_DEFAULT_MAX_BYTES = 8388608;
const FILE_FETCH_HARD_MAX_BYTES = 16777216;
const FILE_FETCH_CHUNK_BYTES = 1048576;
/** Binary fetches require an explicit total budget; unary limits stay unchanged. */
function readFileFetchBinaryMaxBytes(params) {
	if (params.transport === void 0) return;
	if (params.transport !== "binary") throw new Error("file.fetch transport must be \"binary\" when supplied");
	if (typeof params.maxBytes !== "number" || !Number.isSafeInteger(params.maxBytes) || params.maxBytes <= 0) throw new Error("binary file.fetch maxBytes must be a positive safe integer");
	return params.maxBytes;
}
//#endregion
export { readFileFetchBinaryMaxBytes as i, FILE_FETCH_DEFAULT_MAX_BYTES as n, FILE_FETCH_HARD_MAX_BYTES as r, FILE_FETCH_CHUNK_BYTES as t };
