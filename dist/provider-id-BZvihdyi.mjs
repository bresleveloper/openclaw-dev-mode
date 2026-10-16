//#region packages/media-understanding-common/src/provider-id.ts
const MEDIA_PROVIDER_ALIASES = /* @__PURE__ */ new Map([
	["gemini", "google"],
	["minimax-cn", "minimax"],
	["minimax-portal-cn", "minimax-portal"]
]);
/** Normalize provider aliases to canonical config provider ids. */
function normalizeMediaProviderId(id) {
	const normalized = id.trim().toLowerCase();
	return MEDIA_PROVIDER_ALIASES.get(normalized) ?? normalized;
}
/** Normalize provider ids while preserving execution-specific regional aliases. */
function normalizeMediaExecutionProviderId(id) {
	const normalized = id.trim().toLowerCase();
	return normalized === "gemini" ? "google" : normalized;
}
//#endregion
export { normalizeMediaProviderId as n, normalizeMediaExecutionProviderId as t };
