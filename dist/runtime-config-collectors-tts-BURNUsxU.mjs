import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import "./shared-CvirZ99o.mjs";
import { n as collectCanonicalSecretInputAssignment } from "./runtime-shared-7qI1DEx4.mjs";
//#region src/secrets/runtime-config-collectors-tts.ts
/** Collects text-to-speech secret refs from runtime config. */
/** Collects provider API key SecretRefs from a TTS-compatible provider config block. */
function collectTtsApiKeyAssignments(params) {
	const collectProviders = (tts, pathPrefix) => {
		if (!isRecord(tts.providers)) return;
		for (const [providerId, providerConfig] of Object.entries(tts.providers)) {
			if (!isRecord(providerConfig)) continue;
			collectCanonicalSecretInputAssignment({
				value: providerConfig.apiKey,
				path: `${appendConfigPathSegment(`${pathPrefix}.providers`, providerId)}.apiKey`,
				expected: "string",
				defaults: params.defaults,
				context: params.context,
				active: params.active,
				inactiveReason: params.inactiveReason,
				owner: {
					ownerKind: "capability",
					ownerId: typeof params.ownerId === "function" ? params.ownerId(providerId) : params.ownerId ?? "tts",
					requiredForGateway: false,
					disposition: "isolate",
					contract: params.tts
				},
				apply: (value) => {
					providerConfig.apiKey = value;
				}
			});
		}
	};
	collectProviders(params.tts, params.pathPrefix);
	if (isRecord(params.tts.personas)) {
		for (const [personaId, persona] of Object.entries(params.tts.personas)) if (isRecord(persona)) collectProviders(persona, appendConfigPathSegment(`${params.pathPrefix}.personas`, personaId));
	}
}
//#endregion
export { collectTtsApiKeyAssignments as t };
