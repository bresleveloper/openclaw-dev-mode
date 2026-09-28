import { t as modelCatalog } from "./.setup/openclaw.plugin-BRaVociw.mjs";
import { asObjectRecord } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/deepinfra/doctor-contract-api.ts
const PROVIDER_PATH = "models.providers.deepinfra";
const NATIVE_INFERENCE_PATH = "/v1/inference";
const OPENAI_COMPAT_PATH = "/v1/openai";
const CANONICAL_BASE_URL = modelCatalog.providers.deepinfra.baseUrl;
const FIX_HINT = `Run "openclaw doctor --fix" (api.deepinfra.com endpoints migrate automatically; custom hosts must set ${PROVIDER_PATH}.baseUrl to an OpenAI-compatible videos endpoint manually).`;
const legacyConfigRules = [{
	path: [
		"models",
		"providers",
		"deepinfra",
		"nativeBaseUrl"
	],
	message: `${PROVIDER_PATH}.nativeBaseUrl is legacy; video generation uses the OpenAI-compatible ${PROVIDER_PATH}.baseUrl. ${FIX_HINT}`
}, {
	path: [
		"models",
		"providers",
		"deepinfra",
		"baseUrl"
	],
	message: `${PROVIDER_PATH}.baseUrl targets the retired native ${NATIVE_INFERENCE_PATH} surface; use an ${OPENAI_COMPAT_PATH} base. ${FIX_HINT}`,
	match: (value) => typeof value === "string" && value.includes(NATIVE_INFERENCE_PATH)
}];
function isDeepInfraApiHost(value) {
	try {
		return new URL(value).host === "api.deepinfra.com";
	} catch {
		return false;
	}
}
function normalizeBaseUrlValue(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim().replace(/\/+$/u, "");
	return trimmed ? trimmed : void 0;
}
function normalizeCompatibilityConfig({ cfg }) {
	const models = cfg.models;
	const providers = models?.providers;
	const provider = providers?.deepinfra;
	if (!provider) return {
		config: cfg,
		changes: []
	};
	const changes = [];
	const providerRecord = asObjectRecord(provider) ?? {};
	const { nativeBaseUrl, ...providerWithoutLegacyNativeBaseUrl } = providerRecord;
	const next = {
		...providerWithoutLegacyNativeBaseUrl,
		baseUrl: provider.baseUrl,
		models: provider.models
	};
	if (Object.hasOwn(providerRecord, "nativeBaseUrl")) {
		const legacyNative = normalizeBaseUrlValue(nativeBaseUrl);
		if (normalizeBaseUrlValue(next.baseUrl)) changes.push(`${PROVIDER_PATH}.nativeBaseUrl: removed (baseUrl is already configured)`);
		else if (legacyNative && !isDeepInfraApiHost(legacyNative)) {
			next.baseUrl = CANONICAL_BASE_URL;
			changes.push(`${PROVIDER_PATH}.nativeBaseUrl: removed retired custom native endpoint; using ${CANONICAL_BASE_URL} - set ${PROVIDER_PATH}.baseUrl manually if your host serves an OpenAI-compatible videos API`);
		} else {
			next.baseUrl = legacyNative?.includes(NATIVE_INFERENCE_PATH) ? legacyNative.replace(NATIVE_INFERENCE_PATH, OPENAI_COMPAT_PATH) : CANONICAL_BASE_URL;
			changes.push(`${PROVIDER_PATH}.nativeBaseUrl -> ${PROVIDER_PATH}.baseUrl (OpenAI-compatible ${OPENAI_COMPAT_PATH} endpoint)`);
		}
	}
	if (typeof next.baseUrl === "string" && next.baseUrl.includes(NATIVE_INFERENCE_PATH) && isDeepInfraApiHost(next.baseUrl)) {
		next.baseUrl = next.baseUrl.replace(NATIVE_INFERENCE_PATH, OPENAI_COMPAT_PATH);
		changes.push(`${PROVIDER_PATH}.baseUrl: ${NATIVE_INFERENCE_PATH} -> ${OPENAI_COMPAT_PATH}`);
	}
	if (changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: {
			...cfg,
			models: {
				...models,
				providers: {
					...providers,
					deepinfra: next
				}
			}
		},
		changes
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
