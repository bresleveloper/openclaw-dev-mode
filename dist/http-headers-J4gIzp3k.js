import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BiZzULo_.js";
//#region extensions/voice-call/src/http-headers.ts
/** Return the first value for a header name regardless of caller casing. */
function getHeader(headers, name) {
	const target = normalizeLowercaseStringOrEmpty(name);
	const value = headers[target] ?? Object.entries(headers).find(([key]) => normalizeLowercaseStringOrEmpty(key) === target)?.[1];
	if (Array.isArray(value)) return value[0];
	return value;
}
//#endregion
export { getHeader as t };
