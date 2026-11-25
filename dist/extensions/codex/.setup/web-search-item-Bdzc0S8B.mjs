import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { normalizeOptionalString, normalizeTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/codex/src/app-server/web-search-item.ts
/** Discovery metadata only: a provider snippet is not an independently fetched passage. */
function readCodexWebSearchResults(item) {
	if (!Array.isArray(item.results)) return [];
	return item.results.flatMap((result) => {
		if (!isJsonObject(result) || typeof result.url !== "string") return [];
		let url;
		try {
			url = new URL(result.url);
		} catch {
			return [];
		}
		if (url.protocol !== "https:" && url.protocol !== "http:" || url.username || url.password) return [];
		const title = normalizeOptionalString(result.title);
		return [{
			url: url.href,
			...title ? { title } : {}
		}];
	});
}
function projectCodexWebSearchItem(item) {
	const action = isJsonObject(item.action) ? item.action : void 0;
	const actionType = normalizeOptionalString(action?.type);
	const queries = actionType === "search" ? normalizeTrimmedStringList(action?.queries) : [];
	const query = normalizeOptionalString(item.query) ?? (actionType === "search" ? normalizeOptionalString(action?.query) : void 0) ?? queries[0];
	const url = normalizeOptionalString(action?.url);
	const pattern = normalizeOptionalString(action?.pattern);
	const results = readCodexWebSearchResults(item);
	return {
		...results.length > 0 ? { results } : {},
		...query ? { query } : {},
		...queries.length > 0 ? { queries } : {},
		...actionType && actionType !== "search" ? { action: actionType } : {},
		...url ? { url } : {},
		...pattern ? { pattern } : {}
	};
}
export { readCodexWebSearchResults as n, projectCodexWebSearchItem as t };
