import { _ as normalizeXaiRealtimeProviderConfig, g as normalizeXaiRealtimeBaseUrl } from "../../realtime-voice-config-BZr_Tp5F.mjs";
import { s as assertXaiRealtimeVoiceRequestSupported } from "../../capability-provider-metadata-factory-CGFzChAW.mjs";
import { t as createXaiRealtimeVoiceProviderMetadata } from "../../capability-provider-metadata-LLP29-xk.mjs";
import { t as resolveXaiRealtimeApiKey } from "../../realtime-voice-auth.runtime-Dpt0r7xf.mjs";
import { t as XaiRealtimeVoiceBridge } from "../../realtime-voice-bridge-DO4W1xnk.mjs";
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
