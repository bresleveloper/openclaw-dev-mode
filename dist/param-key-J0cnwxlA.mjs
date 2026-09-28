import { r as lowercasePreservingWhitespace } from "./string-coerce-CIXf7egm.mjs";
//#region src/param-key.ts
function toSnakeCaseKey(key) {
	const snakeKey = key.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z0-9])([A-Z])/g, "$1_$2");
	return lowercasePreservingWhitespace(snakeKey);
}
function resolveSnakeCaseParamKey(params, key) {
	if (Object.hasOwn(params, key)) return key;
	const snakeKey = toSnakeCaseKey(key);
	if (snakeKey !== key && Object.hasOwn(params, snakeKey)) return snakeKey;
}
function readSnakeCaseParamRaw(params, key) {
	const resolvedKey = resolveSnakeCaseParamKey(params, key);
	if (resolvedKey) return params[resolvedKey];
}
//#endregion
export { resolveSnakeCaseParamKey as n, readSnakeCaseParamRaw as t };
