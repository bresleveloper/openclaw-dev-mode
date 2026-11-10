//#region extensions/codex/src/app-server/service-tier-normalization.ts
function normalizeCodexServiceTier(value) {
	const trimmed = typeof value === "string" ? value.trim() : "";
	if (!trimmed) return;
	const normalized = trimmed.toLowerCase();
	return normalized === "fast" || normalized === "priority" ? "priority" : normalized === "flex" ? "flex" : trimmed;
}
//#endregion
export { normalizeCodexServiceTier as t };
