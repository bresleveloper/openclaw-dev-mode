import { c as isRecord } from "./utils-BApvfmPs.js";
import "./shared-CmNZQXEK.js";
import { n as collectSecretInputAssignment } from "./runtime-shared-DoAXKQzg.js";
//#region src/secrets/runtime-config-collectors-tts.ts
/** Collects text-to-speech secret refs from runtime config. */
function collectProviderApiKeyAssignment(params) {
	collectSecretInputAssignment({
		value: params.providerConfig.apiKey,
		path: `${params.pathPrefix}.providers.${params.providerId}.apiKey`,
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: params.active,
		inactiveReason: params.inactiveReason,
		apply: (value) => {
			params.providerConfig.apiKey = value;
		}
	});
}
/** Collects provider API key SecretRefs from a TTS config block. */
function collectTtsApiKeyAssignments(params) {
	const providers = params.tts.providers;
	if (isRecord(providers)) for (const [providerId, providerConfig] of Object.entries(providers)) {
		if (!isRecord(providerConfig)) continue;
		collectProviderApiKeyAssignment({
			providerId,
			providerConfig,
			pathPrefix: params.pathPrefix,
			defaults: params.defaults,
			context: params.context,
			active: params.active,
			inactiveReason: params.inactiveReason
		});
	}
}
//#endregion
export { collectTtsApiKeyAssignments as t };
