import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/cli/parse-bytes.ts
const UNIT_MULTIPLIERS = {
	b: 1,
	kb: 1024,
	k: 1024,
	mb: 1024 ** 2,
	m: 1024 ** 2,
	gb: 1024 ** 3,
	g: 1024 ** 3,
	tb: 1024 ** 4,
	t: 1024 ** 4
};
function invalidByteSize(raw, reason) {
	const value = raw.trim() ? `"${raw}"` : "empty value";
	const prefix = reason ? `Invalid byte size (${reason}): ${value}.` : `Invalid byte size: ${value}.`;
	return /* @__PURE__ */ new Error(`${prefix} Use values like 512kb, 10mb, 1gb, or 500.`);
}
/** Parse a non-negative byte size with optional binary units like kb, mb, gb, or tb. */
function parseByteSize(raw, opts) {
	const trimmed = normalizeLowercaseStringOrEmpty(normalizeOptionalString(raw) ?? "");
	if (!trimmed) throw invalidByteSize(raw, "empty");
	const m = /^(\d+(?:\.\d+)?)([a-z]+)?$/.exec(trimmed);
	if (!m) throw invalidByteSize(raw);
	const value = Number(m[1]);
	if (!Number.isFinite(value) || value < 0) throw invalidByteSize(raw);
	const unit = normalizeLowercaseStringOrEmpty(m[2] ?? opts?.defaultUnit ?? "b");
	const multiplier = UNIT_MULTIPLIERS[unit];
	if (!multiplier) throw invalidByteSize(raw, `unknown unit "${unit}"`);
	const bytes = Math.round(value * multiplier);
	if (!Number.isFinite(bytes)) throw invalidByteSize(raw);
	return bytes;
}
//#endregion
export { parseByteSize as t };
