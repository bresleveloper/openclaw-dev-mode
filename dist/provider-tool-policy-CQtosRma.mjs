import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
//#region src/agents/provider-tool-policy.ts
function normalizeToolProviderPolicyKey(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	const slashIndex = normalized.indexOf("/");
	if (slashIndex <= 0) return normalizeProviderId(normalized);
	const provider = normalizeProviderId(normalized.slice(0, slashIndex));
	const modelId = normalized.slice(slashIndex + 1);
	return modelId ? `${provider}/${modelId}` : provider;
}
function resolveProviderToolPolicyEntry(params) {
	const provider = params.modelProvider?.trim();
	if (!provider || !params.byProvider) return;
	const lookup = /* @__PURE__ */ new Map();
	for (const [key, value] of Object.entries(params.byProvider)) {
		if (!isRecord(value)) continue;
		const normalized = normalizeToolProviderPolicyKey(key);
		if (!normalized) continue;
		const canonical = normalizeLowercaseStringOrEmpty(key) === normalized;
		const existing = lookup.get(normalized);
		if (!existing || canonical && !existing.canonical) lookup.set(normalized, {
			key,
			policy: value,
			canonical
		});
	}
	const normalizedProvider = normalizeToolProviderPolicyKey(provider);
	const rawModelId = normalizeOptionalLowercaseString(params.modelId);
	const match = (rawModelId ? lookup.get(`${normalizedProvider}/${rawModelId}`) : void 0) ?? lookup.get(normalizedProvider);
	return match ? {
		key: match.key,
		policy: match.policy
	} : void 0;
}
function resolveProviderToolPolicy(params) {
	return resolveProviderToolPolicyEntry(params)?.policy;
}
//#endregion
export { resolveProviderToolPolicy as n, resolveProviderToolPolicyEntry as r, normalizeToolProviderPolicyKey as t };
