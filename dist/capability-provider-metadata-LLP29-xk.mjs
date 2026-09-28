import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import { n as isProviderAuthProfileConfigured, t as isProviderApiKeyConfigured } from "./provider-auth-availability-DlkWkL2p.mjs";
import "./provider-auth-C_UP8nFt.mjs";
import { d as createXaiRealtimeVoiceProviderMetadata$1, f as createXaiVideoGenerationProviderMetadata$1 } from "./capability-provider-metadata-factory-CGFzChAW.mjs";
//#region extensions/xai/capability-provider-metadata.ts
function createXaiVideoGenerationProviderMetadata() {
	return createXaiVideoGenerationProviderMetadata$1({ isProviderApiKeyConfigured });
}
function createXaiRealtimeVoiceProviderMetadata() {
	return createXaiRealtimeVoiceProviderMetadata$1({
		isProviderAuthProfileConfigured,
		resolveAgentDir
	});
}
//#endregion
export { createXaiVideoGenerationProviderMetadata as n, createXaiRealtimeVoiceProviderMetadata as t };
