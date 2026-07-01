//#region src/llm/utils/headers.ts
/** Converts a Headers object to a plain record for provider request handling. */
function headersToRecord(headers) {
	const result = {};
	for (const [key, value] of headers.entries()) result[key] = value;
	return result;
}
//#endregion
export { headersToRecord as t };
