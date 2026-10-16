//#region extensions/codex/src/app-server/config-contracts.shared.ts
const CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
//#endregion
//#region extensions/codex/src/app-server/service-tier-normalization.ts
function normalizeCodexServiceTier(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed) return;
	const normalized = trimmed.toLowerCase();
	if (normalized === "fast" || normalized === "priority") return "priority";
	if (normalized === "flex") return "flex";
	return trimmed;
}
//#endregion
export { CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN as n, normalizeCodexServiceTier as t };
