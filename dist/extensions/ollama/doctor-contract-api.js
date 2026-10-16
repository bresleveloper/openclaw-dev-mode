import { r as asNullableRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../runtime-doctor-migrations-4UZBewWQ.mjs";
import { a as OLLAMA_DEFAULT_API_KEY } from "../../defaults-Dkg1KktH.mjs";
//#region extensions/ollama/src/config-compat.ts
const OLLAMA_PROVIDER_ID = "ollama";
const LEGACY_OLLAMA_API_KEY_MARKER = "OLLAMA_API_KEY";
const LEGACY_OLLAMA_PROFILE_ID = "ollama:default";
function isLegacyOllamaLocalConfig(provider, root) {
	const providerRecord = asNullableRecord(provider);
	const auth = asNullableRecord(root?.auth);
	const profiles = asNullableRecord(auth?.profiles);
	const profile = asNullableRecord(profiles?.[LEGACY_OLLAMA_PROFILE_ID]);
	return providerRecord?.api === "ollama" && providerRecord.apiKey === LEGACY_OLLAMA_API_KEY_MARKER && profile?.provider === OLLAMA_PROVIDER_ID && profile.mode === "api_key" && Object.keys(profile).length === 2;
}
const legacyConfigRules = [{
	path: [
		"models",
		"providers",
		OLLAMA_PROVIDER_ID
	],
	message: "Legacy local Ollama authentication markers must be migrated. Run \"openclaw doctor --fix\".",
	match: isLegacyOllamaLocalConfig
}];
function migrateLegacyOllamaLocalConfig(config) {
	const provider = config.models?.providers?.[OLLAMA_PROVIDER_ID];
	if (!isLegacyOllamaLocalConfig(provider, { ...config })) return null;
	const nextConfig = structuredClone(config);
	const nextModels = asNullableRecord(nextConfig.models) ?? {};
	nextConfig.models = nextModels;
	const nextProviders = asNullableRecord(nextModels.providers) ?? {};
	nextModels.providers = nextProviders;
	const nextProvider = asNullableRecord(nextProviders[OLLAMA_PROVIDER_ID]) ?? {};
	nextProviders[OLLAMA_PROVIDER_ID] = nextProvider;
	nextProvider.apiKey = OLLAMA_DEFAULT_API_KEY;
	const nextAuth = asNullableRecord(nextConfig.auth);
	const nextProfiles = asNullableRecord(nextAuth?.profiles);
	if (nextAuth && nextProfiles) {
		delete nextProfiles[LEGACY_OLLAMA_PROFILE_ID];
		if (Object.keys(nextProfiles).length === 0) delete nextAuth.profiles;
		if (Object.keys(nextAuth).length === 0) delete nextConfig.auth;
	}
	return {
		config: nextConfig,
		changes: [`Migrated models.providers.${OLLAMA_PROVIDER_ID}.apiKey to ${OLLAMA_DEFAULT_API_KEY} and removed the obsolete ${LEGACY_OLLAMA_PROFILE_ID} auth profile marker.`]
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	return migrateLegacyOllamaLocalConfig(cfg) ?? {
		config: cfg,
		changes: []
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
