//#region src/gateway/worker-environments/node-worker-response.ts
/** Decode the private node response envelope before its operation validates the payload. */
function parseNodeWorkerResponse(value, operation) {
	if (!value) throw new Error(operation + " omitted its result");
	try {
		return JSON.parse(value);
	} catch {
		throw new Error(operation + " returned malformed JSON");
	}
}
//#endregion
export { parseNodeWorkerResponse as t };
