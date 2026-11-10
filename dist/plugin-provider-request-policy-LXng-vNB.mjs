import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/plugins/plugin-provider-request-policy.ts
/** Manifest parsing and prepared metadata use the same provider request policy. */
function normalizeManifestProviderRequestProvider(value) {
	if (!isRecord(value)) return;
	const family = normalizeOptionalString(value.family);
	const compatibilityFamily = normalizeOptionalString(value.compatibilityFamily) === "moonshot" ? "moonshot" : void 0;
	const supportsStreamingUsage = isRecord(value.openAICompletions) ? value.openAICompletions.supportsStreamingUsage : void 0;
	const openAICompletions = typeof supportsStreamingUsage === "boolean" ? { supportsStreamingUsage } : void 0;
	const providerRequest = {
		...family ? { family } : {},
		...compatibilityFamily ? { compatibilityFamily } : {},
		...isRecord(value.modelParamsSchema) ? { modelParamsSchema: value.modelParamsSchema } : {},
		...openAICompletions ? { openAICompletions } : {}
	};
	return Object.keys(providerRequest).length > 0 ? providerRequest : void 0;
}
/** Preserve request metadata's last-declaration ownership for validation and presentation. */
function collectPluginProviderRequestOwners(plugins) {
	const owners = /* @__PURE__ */ new Map();
	for (const plugin of plugins) {
		const requests = isRecord(plugin.providerRequest?.providers) ? plugin.providerRequest.providers : {};
		for (const [rawProvider, request] of Object.entries(requests)) {
			const provider = normalizeLowercaseStringOrEmpty(rawProvider);
			if (provider && isRecord(request)) owners.set(provider, {
				plugin,
				policy: normalizeManifestProviderRequestProvider(request) ?? {}
			});
		}
	}
	return owners;
}
//#endregion
export { normalizeManifestProviderRequestProvider as n, collectPluginProviderRequestOwners as t };
