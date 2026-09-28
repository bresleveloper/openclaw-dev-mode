import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/plugins/provider-plugin-choice.ts
const PROVIDER_PLUGIN_CHOICE_PREFIX = "provider-plugin:";
function buildProviderPluginMethodChoice(providerId, methodId) {
	return `${PROVIDER_PLUGIN_CHOICE_PREFIX}${normalizeOptionalString(providerId) ?? ""}:${normalizeOptionalString(methodId) ?? ""}`;
}
/** Parse explicit dispatch identity before consulting user-facing manifest choice IDs. */
function parseProviderPluginMethodChoice(choice) {
	const normalized = choice.trim();
	if (!normalized.startsWith("provider-plugin:")) return;
	const payload = normalized.slice(16);
	const separator = payload.indexOf(":");
	return {
		providerId: (separator >= 0 ? payload.slice(0, separator) : payload).trim(),
		...separator >= 0 ? { methodId: payload.slice(separator + 1).trim() } : {}
	};
}
//#endregion
export { buildProviderPluginMethodChoice as n, parseProviderPluginMethodChoice as r, PROVIDER_PLUGIN_CHOICE_PREFIX as t };
