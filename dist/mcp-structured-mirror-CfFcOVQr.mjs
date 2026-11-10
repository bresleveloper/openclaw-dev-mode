import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
//#region src/agents/mcp-structured-mirror.ts
/**
* Builds a predicate for text blocks that only mirror an MCP result's structuredContent.
* Servers serialize that mirror differently (pretty, compact, other key order), and the spec
* requires structuredContent to be an object, so servers returning an array or scalar wrap it
* under one key ({"items": [...]}, FastMCP's {"result": ...}) while the text carries the bare
* value. A block counts as the mirror when it is complete JSON for structuredContent or for the
* only value of a single-key structuredContent; a plain-text block counts when it equals that
* only value when it is a string. Any other text, including JSON for a different value, is kept
* because it can carry recovery guidance.
*/
function createMcpStructuredContentMirrorMatcher(structuredContent) {
	const [onlyKey, ...otherKeys] = Object.keys(structuredContent);
	const wrapped = onlyKey !== void 0 && otherKeys.length === 0 ? structuredContent[onlyKey] : void 0;
	let canonical;
	let canonicalWrapped;
	return (text) => {
		if (typeof wrapped === "string" && text === wrapped) return true;
		try {
			const parsed = stableStringify(JSON.parse(text));
			return parsed === (canonical ??= stableStringify(structuredContent)) || wrapped !== void 0 && parsed === (canonicalWrapped ??= stableStringify(wrapped));
		} catch {
			return false;
		}
	};
}
//#endregion
export { createMcpStructuredContentMirrorMatcher as t };
