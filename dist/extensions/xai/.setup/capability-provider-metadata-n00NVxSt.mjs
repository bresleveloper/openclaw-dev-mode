import { d as createXaiRealtimeVoiceProviderMetadata$1, f as createXaiVideoGenerationProviderMetadata$1 } from "./capability-provider-metadata-factory-Dd0r_YMX.mjs";
import { resolveAgentDir } from "openclaw/plugin-sdk/agent-scope-runtime";
import { isProviderApiKeyConfiguredAsync, isProviderAuthProfileConfigured, isProviderAuthProfileConfiguredAsync } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/xai/capability-provider-metadata.ts
function createXaiVideoGenerationProviderMetadata() {
	return createXaiVideoGenerationProviderMetadata$1({ isProviderApiKeyConfiguredAsync });
}
function createXaiRealtimeVoiceProviderMetadata() {
	return createXaiRealtimeVoiceProviderMetadata$1({
		isProviderAuthProfileConfigured,
		isProviderAuthProfileConfiguredAsync,
		resolveAgentDir
	});
}
//#endregion
export { createXaiVideoGenerationProviderMetadata as n, createXaiRealtimeVoiceProviderMetadata as t };
