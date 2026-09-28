import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/config/sensitive-paths.ts
/**
* Non-sensitive field names that happen to match sensitive patterns.
* These are explicitly excluded from redaction (plugin config) and
* warnings about not being marked sensitive (base config).
*/
const SENSITIVE_KEY_WHITELIST_SUFFIXES = [
	"maxtokens",
	"maxoutputtokens",
	"maxinputtokens",
	"maxcompletiontokens",
	"contexttokens",
	"totaltokens",
	"tokencount",
	"tokenlimit",
	"tokenbudget",
	"passwordfile"
];
const SENSITIVE_PATTERNS = [
	/token$/i,
	/password/i,
	/secret/i,
	/api.?key/i,
	/encrypt.?key/i,
	/private.?key/i,
	/serviceaccount(?:ref)?$/i
];
/**
* Classifies config paths whose values should be redacted from UI/API output.
*
* This intentionally works from path labels, not schema nodes, so plugin-owned
* fields and raw local-service env vars get the same conservative treatment.
*/
function isSensitiveConfigPath(path) {
	const lowerPath = normalizeLowercaseStringOrEmpty(path);
	return lowerPath.includes("localservice.env.") || !SENSITIVE_KEY_WHITELIST_SUFFIXES.some((suffix) => lowerPath.endsWith(suffix)) && SENSITIVE_PATTERNS.some((pattern) => pattern.test(path));
}
//#endregion
export { isSensitiveConfigPath as t };
