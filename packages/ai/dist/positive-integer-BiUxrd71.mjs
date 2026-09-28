import { o as parseStrictPositiveInteger } from "./base64-CPmadnUf.mjs";
//#region packages/ai/src/transports/positive-integer.ts
function parsePositiveInteger(value) {
	if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
	return typeof value === "string" ? parseStrictPositiveInteger(value) : void 0;
}
//#endregion
export { parsePositiveInteger as t };
