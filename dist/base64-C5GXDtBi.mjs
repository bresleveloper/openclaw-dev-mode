//#region extensions/file-transfer/src/shared/base64.ts
/** Validates base64 structure and returns its decoded size without allocating a decode buffer. */
function inspectStrictBase64(value) {
	const match = /^[A-Za-z0-9+/_-]*={0,2}$/u.exec(value);
	if (!match || match[0].length !== value.length) return;
	const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
	const dataChars = value.length - padding;
	const remainder = dataChars % 4;
	if (padding === 0) return remainder === 1 ? void 0 : Math.floor(dataChars * 3 / 4);
	if (padding === 1 && remainder !== 3 || padding === 2 && remainder !== 2) return;
	return Math.floor(dataChars * 3 / 4);
}
//#endregion
export { inspectStrictBase64 as t };
