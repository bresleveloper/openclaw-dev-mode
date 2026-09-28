import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/daemon/runtime-parse.ts
/** Parses daemon runtime command output into normalized key-value maps. */
/** Parses command output key-value lines using a caller-supplied separator. */
function parseKeyValueOutput(output, separator) {
	const entries = {};
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line) continue;
		const idx = line.indexOf(separator);
		if (idx <= 0) continue;
		const key = normalizeLowercaseStringOrEmpty(line.slice(0, idx));
		if (!key) continue;
		entries[key] = line.slice(idx + separator.length).trim();
	}
	return entries;
}
//#endregion
export { parseKeyValueOutput as t };
