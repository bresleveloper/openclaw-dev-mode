//#region extensions/file-transfer/src/shared/errors.ts
function throwFromNodePayload(operation, payload) {
	const code = typeof payload.code === "string" ? payload.code : "ERROR";
	const message = typeof payload.message === "string" ? payload.message : `${operation} failed`;
	const canonical = typeof payload.canonicalPath === "string" ? ` (canonical=${payload.canonicalPath})` : "";
	throw new Error(`${operation} ${code}: ${message}${canonical}`);
}
//#endregion
export { throwFromNodePayload as t };
