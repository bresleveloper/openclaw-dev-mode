import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/config/legacy-codex-provider.ts
/** Provider spellings accepted only by legacy migration boundaries. */
const LEGACY_CODEX_PROVIDER_IDS = /* @__PURE__ */ new Set(["codex", "openai-codex"]);
function isLegacyCodexProviderId(provider) {
	const normalized = normalizeOptionalLowercaseString(provider);
	return normalized ? LEGACY_CODEX_PROVIDER_IDS.has(normalized) : false;
}
//#endregion
export { isLegacyCodexProviderId as t };
