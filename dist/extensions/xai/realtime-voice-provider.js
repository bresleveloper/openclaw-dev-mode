import { _ as normalizeXaiRealtimeProviderConfig, g as normalizeXaiRealtimeBaseUrl } from "../../realtime-voice-config-CSKz551Y.mjs";
import { s as assertXaiRealtimeVoiceRequestSupported } from "../../capability-provider-metadata-factory-C2QQ6-HN.mjs";
import { t as createXaiRealtimeVoiceProviderMetadata } from "../../capability-provider-metadata-DnlCiTAP.mjs";
import { t as resolveXaiRealtimeApiKey } from "../../realtime-voice-auth.runtime-Cnrlf26m.mjs";
import { t as XaiRealtimeVoiceBridge } from "../../realtime-voice-bridge-B9XjNJUp.mjs";
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
