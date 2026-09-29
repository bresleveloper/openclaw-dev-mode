import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-CGngP_UC.mjs";
import { t as createMediaProviderRegistry } from "./provider-registry-D-_-99AY.mjs";
//#region src/realtime-transcription/provider-registry.ts
/** Realtime transcription uses targeted lookup to avoid broad capability discovery. */
const { listProviders: listRealtimeTranscriptionProviders, getProvider: getRealtimeTranscriptionProvider } = createMediaProviderRegistry("realtimeTranscriptionProviders", { directLookup: true });
/** Canonicalizes a configured provider id while preserving unknown ids. */
function canonicalizeRealtimeTranscriptionProviderId(providerId, cfg) {
	const normalized = normalizeCapabilityProviderId(providerId);
	return normalized ? getRealtimeTranscriptionProvider(normalized, cfg)?.id ?? normalized : void 0;
}
//#endregion
export { getRealtimeTranscriptionProvider as n, listRealtimeTranscriptionProviders as r, canonicalizeRealtimeTranscriptionProviderId as t };
