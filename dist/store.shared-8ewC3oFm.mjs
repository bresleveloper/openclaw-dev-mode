import "./src-CZ2wJvNB.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
//#region src/media/store.shared.ts
function formatMediaSize(bytes) {
	return formatByteSize(bytes, {
		style: "legacy-binary",
		maxUnit: "mega",
		separator: "",
		fractionDigits: (value) => Number.isInteger(value) ? 0 : 2
	});
}
/** Media persistence failure with a stable category for callers. */
var SaveMediaSourceError = class SaveMediaSourceError extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "SaveMediaSourceError";
	}
	static tooLarge(maxBytes, options) {
		const limit = formatMediaSize(maxBytes);
		return new SaveMediaSourceError("too-large", `Media exceeds ${limit} limit`, options);
	}
};
//#endregion
export { formatMediaSize as n, SaveMediaSourceError as t };
