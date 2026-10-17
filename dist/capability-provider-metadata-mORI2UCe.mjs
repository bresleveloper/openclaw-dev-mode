import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-runtime-DMJYuX7c.mjs";
import { n as isProviderAuthProfileConfigured, t as isProviderApiKeyConfigured } from "./provider-auth-availability-Xx9etrds.mjs";
import "./provider-auth-BGYKg9mW.mjs";
import { d as createXaiRealtimeVoiceProviderMetadata$1, f as createXaiVideoGenerationProviderMetadata$1 } from "./capability-provider-metadata-factory-C2QQ6-HN.mjs";
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
