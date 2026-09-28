import { r as asNullableRecord } from "../../record-coerce-DItp3I4t.mjs";
import "../../runtime-doctor-migrations-_pMXigSc.mjs";
import { a as OLLAMA_DEFAULT_API_KEY, i as OLLAMA_CLOUD_PROVIDER_ID, n as OLLAMA_CLOUD_BASE_URL } from "../../defaults-Dkg1KktH.mjs";
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
function isRetiredOllamaCloudBaseUrl(value) {
	if (typeof value !== "string" || !value.trim()) return false;
	try {
		return new URL(value.trim()).hostname.toLowerCase() === "ai.ollama.com";
	} catch {
		return false;
	}
}
function findRetiredOllamaCloudBaseUrl(provider) {
	const record = asNullableRecord(provider);
	if (!record) return null;
	if (isRetiredOllamaCloudBaseUrl(record.baseUrl)) return { key: "baseUrl" };
	if (isRetiredOllamaCloudBaseUrl(record.baseURL)) return { key: "baseURL" };
	return null;
}
const legacyConfigRules = [{
	path: [
		"models",
		"providers",
		OLLAMA_CLOUD_PROVIDER_ID
	],
	message: "models.providers.ollama-cloud.baseUrl=\"https://ai.ollama.com\" is retired; use \"https://ollama.com\". Run \"openclaw doctor --fix\".",
	match: (value) => findRetiredOllamaCloudBaseUrl(value) !== null
}, {
	path: [
		"models",
		"providers",
		OLLAMA_PROVIDER_ID
	],
	message: "Legacy local Ollama authentication markers must be migrated. Run \"openclaw doctor --fix\".",
	match: isLegacyOllamaLocalConfig
}];
function cloneProviderConfig(config, providerId) {
	const nextConfig = structuredClone(config);
	const nextModels = asNullableRecord(nextConfig.models) ?? {};
	nextConfig.models = nextModels;
	const nextProviders = asNullableRecord(nextModels.providers) ?? {};
	nextModels.providers = nextProviders;
	const nextProvider = asNullableRecord(nextProviders[providerId]) ?? {};
	nextProviders[providerId] = nextProvider;
	return {
		nextConfig,
		nextProvider
	};
}
function migrateLegacyOllamaLocalConfig(config) {
	const provider = config.models?.providers?.[OLLAMA_PROVIDER_ID];
	if (!isLegacyOllamaLocalConfig(provider, { ...config })) return null;
	const { nextConfig, nextProvider } = cloneProviderConfig(config, OLLAMA_PROVIDER_ID);
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
function migrateOllamaCloudRetiredBaseUrl(config) {
	const provider = config.models?.providers?.[OLLAMA_CLOUD_PROVIDER_ID];
	const retired = findRetiredOllamaCloudBaseUrl(provider);
	if (!retired) return null;
	const { nextConfig, nextProvider } = cloneProviderConfig(config, OLLAMA_CLOUD_PROVIDER_ID);
	const canonicalBaseUrl = nextProvider.baseUrl;
	if (retired.key === "baseURL" && typeof canonicalBaseUrl === "string" && canonicalBaseUrl.trim() && !isRetiredOllamaCloudBaseUrl(canonicalBaseUrl)) {
		delete nextProvider.baseURL;
		return {
			config: nextConfig,
			changes: ["Removed retired models.providers.ollama-cloud.baseURL while preserving models.providers.ollama-cloud.baseUrl."]
		};
	}
	nextProvider.baseUrl = OLLAMA_CLOUD_BASE_URL;
	if (retired.key === "baseURL") delete nextProvider.baseURL;
	return {
		config: nextConfig,
		changes: [`Updated models.providers.ollama-cloud.${retired.key} from the retired Ollama Cloud endpoint to ${OLLAMA_CLOUD_BASE_URL}.`]
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	let config = cfg;
	const changes = [];
	for (const migrate of [migrateLegacyOllamaLocalConfig, migrateOllamaCloudRetiredBaseUrl]) {
		const result = migrate(config);
		if (result) {
			config = result.config;
			changes.push(...result.changes);
		}
	}
	return {
		config,
		changes
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
