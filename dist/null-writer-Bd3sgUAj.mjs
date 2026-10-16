import { Writable } from "node:stream";
//#region src/shared/null-writer.ts
function createNullWriter() {
	return new Writable({ write(_chunk, _encoding, callback) {
		callback();
	} });
}
//#endregion
export { createNullWriter as t };
