import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import crypto from "node:crypto";
//#region src/logging/redact-identifier.ts
/** Returns a stable sha256 hex prefix for non-secret identifier correlation. */
function sha256HexPrefix(value, len = 12) {
	const safeLen = Number.isFinite(len) ? Math.max(1, Math.floor(len)) : 12;
	return crypto.createHash("sha256").update(value).digest("hex").slice(0, safeLen);
}
/** Redacts an identifier to a stable hash label, or "-" for missing values. */
function redactIdentifier(value, opts) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return "-";
	return `sha256:${sha256HexPrefix(trimmed, opts?.len ?? 12)}`;
}
//#endregion
export { sha256HexPrefix as n, redactIdentifier as t };
