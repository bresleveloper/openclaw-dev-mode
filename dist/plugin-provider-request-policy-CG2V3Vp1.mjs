import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
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
		...openAICompletions ? { openAICompletions } : {}
	};
	return Object.keys(providerRequest).length > 0 ? providerRequest : void 0;
}
//#endregion
export { normalizeManifestProviderRequestProvider as t };
