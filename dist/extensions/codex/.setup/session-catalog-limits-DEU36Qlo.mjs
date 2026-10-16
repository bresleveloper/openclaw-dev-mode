import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
//#region extensions/codex/src/session-catalog-limits.ts
var session_catalog_limits_exports = /* @__PURE__ */ __exportAll({
	CODEX_CATALOG_MAX_ROWS: () => CODEX_CATALOG_MAX_ROWS,
	CODEX_CATALOG_MAX_STATE_KEY_BYTES: () => 512,
	detachCodexCatalogString: () => detachCodexCatalogString
});
const CODEX_CATALOG_MAX_ROWS = 2e4;
/** Preserve UTF-16 code units without retaining an oversized source string. */
function detachCodexCatalogString(value) {
	return Buffer.from(value, "utf16le").toString("utf16le");
}
//#endregion
export { detachCodexCatalogString as n, session_catalog_limits_exports as r, CODEX_CATALOG_MAX_ROWS as t };
