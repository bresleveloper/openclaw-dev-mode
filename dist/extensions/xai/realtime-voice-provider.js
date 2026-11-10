import { _ as normalizeXaiRealtimeProviderConfig, g as normalizeXaiRealtimeBaseUrl } from "../../realtime-voice-config-ZrZsQBkX.mjs";
import { s as assertXaiRealtimeVoiceRequestSupported } from "../../capability-provider-metadata-factory-Cs1Hgti5.mjs";
import { t as createXaiRealtimeVoiceProviderMetadata } from "../../capability-provider-metadata-D94p50HJ.mjs";
import { t as resolveXaiRealtimeApiKey } from "../../realtime-voice-auth.runtime-B5wAvx_C.mjs";
import { t as XaiRealtimeVoiceBridge } from "../../realtime-voice-bridge-C4CGeSkM.mjs";
//#region extensions/xai/realtime-voice-provider.ts
function buildXaiRealtimeVoiceProvider() {
	return {
		...createXaiRealtimeVoiceProviderMetadata(),
		createBridge: (req) => {
			const config = normalizeXaiRealtimeProviderConfig(req.providerConfig);
			assertXaiRealtimeVoiceRequestSupported(req);
			return new XaiRealtimeVoiceBridge({
				...req,
				apiKey: config.apiKey,
				baseUrl: normalizeXaiRealtimeBaseUrl(config.baseUrl),
				model: config.model,
				voice: config.voice,
				vadThreshold: config.vadThreshold,
				silenceDurationMs: config.silenceDurationMs,
				prefixPaddingMs: config.prefixPaddingMs,
				reasoningEffort: config.reasoningEffort,
				sessionResumption: config.sessionResumption,
				resolveApiKey: () => resolveXaiRealtimeApiKey(config.apiKey, req.cfg, req.agentId)
			});
		}
	};
}
//#endregion
export { buildXaiRealtimeVoiceProvider };
