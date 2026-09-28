//#region src/config/redact-sentinel.ts
/** Display markers are never credential material. Match whole values, not substrings. */
const REDACTED_SENTINEL = "__OPENCLAW_REDACTED__";
const REDACTED_SECRET_VALUES = /* @__PURE__ */ new Set([
	REDACTED_SENTINEL,
	"REDACTED",
	"xoxb-REDACTED",
	"xapp-REDACTED",
	"***",
	"[redacted]",
	"[REDACTED]",
	"<redacted>",
	"[REDACTED_PRIVATE_KEY]",
	"[REDACTED CREDENTIAL]"
]);
function isRedactedSecretValue(value) {
	return typeof value === "string" && REDACTED_SECRET_VALUES.has(value.trim());
}
//#endregion
export { isRedactedSecretValue as n, REDACTED_SENTINEL as t };
