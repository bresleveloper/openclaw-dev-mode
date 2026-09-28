import { a as probePathCaseInsensitiveSync } from "./fs-safe-advanced-CJC-NYf3.mjs";
//#region src/infra/path-case.ts
function swapAsciiCase(value) {
	return value.replace(/[A-Za-z]/g, (char) => {
		const lower = char.toLowerCase();
		return char === lower ? char.toUpperCase() : lower;
	});
}
function sameFsObject(a, b) {
	return a.dev === b.dev && a.ino === b.ino;
}
/** Returns whether the target path's filesystem matches names case-insensitively. */
function isPathCaseInsensitive(value) {
	return probePathCaseInsensitiveSync(value) ?? (process.platform === "darwin" || process.platform === "win32");
}
//#endregion
export { sameFsObject as n, swapAsciiCase as r, isPathCaseInsensitive as t };
