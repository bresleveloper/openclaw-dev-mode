import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as findNormalizedProviderValue$1 } from "./provider-id-D1VImdKk.mjs";
import { o as normalizeModelRef } from "./model-ref-shared-KBg0y299.mjs";
//#region src/agents/model-selection-normalize.ts
/**
* Internal declaration anchor for parser and lookup exports consumed by the
* public Plugin SDK barrel. Provider/model normalization lives in model-ref-shared.
*/
const OPENROUTER_AUTO_COMPAT_ALIAS = "openrouter:auto";
/** Find a provider value by normalized provider ID. */
function findNormalizedProviderValue(entries, provider) {
	return findNormalizedProviderValue$1(entries, provider);
}
/** Parse `provider/model` or bare model text using a default provider. */
function parseModelRef(raw, defaultProvider, options) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (normalizeLowercaseStringOrEmpty(trimmed) === OPENROUTER_AUTO_COMPAT_ALIAS) return normalizeModelRef("openrouter", "auto", options);
	const slash = trimmed.indexOf("/");
	if (slash === -1) return normalizeModelRef(defaultProvider, trimmed, options);
	const providerRaw = trimmed.slice(0, slash).trim();
	const model = trimmed.slice(slash + 1).trim();
	if (!providerRaw || !model) return null;
	return normalizeModelRef(providerRaw, model, options);
}
//#endregion
export { parseModelRef as n, findNormalizedProviderValue as t };
