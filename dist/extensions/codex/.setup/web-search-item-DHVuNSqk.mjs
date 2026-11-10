import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { normalizeOptionalString, normalizeTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/web-search-item.ts
function projectCodexWebSearchItem(item) {
	const action = isJsonObject(item.action) ? item.action : void 0;
	const actionType = normalizeOptionalString(action?.type);
	const queries = actionType === "search" ? normalizeTrimmedStringList(action?.queries) : [];
	const query = normalizeOptionalString(item.query) ?? (actionType === "search" ? normalizeOptionalString(action?.query) : void 0) ?? queries[0];
	const url = normalizeOptionalString(action?.url);
	const pattern = normalizeOptionalString(action?.pattern);
	return {
		...query ? { query } : {},
		...queries.length > 0 ? { queries } : {},
		...actionType && actionType !== "search" ? { action: actionType } : {},
		...url ? { url } : {},
		...pattern ? { pattern } : {}
	};
}
//#endregion
export { projectCodexWebSearchItem as t };
