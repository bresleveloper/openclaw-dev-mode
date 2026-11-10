import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-runtime-Dld1eD8B.mjs";
import { i as isProviderAuthProfileConfiguredAsync, n as isProviderApiKeyConfiguredAsync, r as isProviderAuthProfileConfigured } from "./provider-auth-availability-CfYdMNuk.mjs";
import "./provider-auth-JCvgbsWg.mjs";
import { d as createXaiRealtimeVoiceProviderMetadata$1, f as createXaiVideoGenerationProviderMetadata$1 } from "./capability-provider-metadata-factory-Cs1Hgti5.mjs";
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
