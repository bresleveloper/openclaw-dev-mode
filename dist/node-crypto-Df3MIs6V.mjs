import { n as writeStableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { Buffer } from "node:buffer";
import { createHash, hash } from "node:crypto";
//#region packages/normalization-core/src/node-crypto.ts
function sha256Hex(input) {
	return hash("sha256", input, "hex");
}
function sha256StableValue(value) {
	let digest;
	let chunks = [];
	let characterCount = 0;
	let byteWeight = 0;
	writeStableStringify(value, (chunk) => {
		if (chunk.length === 0) return;
		chunks.push(chunk);
		characterCount += chunk.length;
		if (characterCount >= 16384) {
			const text = chunks.join("");
			digest ??= createHash("sha256");
			digest.update(text);
			byteWeight += Buffer.byteLength(text);
			chunks = [];
			characterCount = 0;
		}
	});
	const text = chunks.join("");
	byteWeight += Buffer.byteLength(text);
	return {
		digest: digest ? digest.update(text).digest("hex") : sha256Hex(text),
		byteWeight
	};
}
function sha256HexPrefixCore(input, length) {
	return sha256Hex(input).slice(0, length);
}
/** Redacts an identifier to a stable hash label, or "-" for missing values. */
function redactIdentifier(value, opts) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return "-";
	const len = opts?.len ?? 12;
	return `sha256:${sha256HexPrefixCore(trimmed, Number.isFinite(len) ? Math.max(1, Math.floor(len)) : 12)}`;
}
//#endregion
export { sha256StableValue as i, sha256Hex as n, sha256HexPrefixCore as r, redactIdentifier as t };
