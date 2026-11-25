import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-CE_cMy1x.mjs";
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
// extensions/deepseek/model-credential.ts
const DEEPSEEK_API_ORIGIN = new URL(openclaw_plugin_default.modelCatalog.providers.deepseek.baseUrl).origin;
function isDeepSeekApiUrl(value) {
	const baseUrl = value?.trim();
	if (!baseUrl) return true;
	const url = URL.parse(baseUrl);
	if (!url || url.protocol !== "https:" || url.username || url.password) return false;
	url.hostname = url.hostname.replace(/\.$/, "");
	return url.origin === DEEPSEEK_API_ORIGIN;
}
/** Raw model-provider key (SecretRefs intact) when DeepSeek search may reuse it. */
function resolveDeepSeekModelKeyFallback(config) {
	const value = config?.models?.providers?.deepseek?.apiKey;
	if (value === void 0) return;
	return Object.entries(config?.models?.providers ?? {}).filter(([id]) => normalizeProviderId(id) === "deepseek").every(([, entry]) => isDeepSeekApiUrl(entry.baseUrl) && (entry.models ?? []).every((model) => isDeepSeekApiUrl(model.baseUrl))) ? {
		path: "models.providers.deepseek.apiKey",
		value
	} : void 0;
}
export { resolveDeepSeekModelKeyFallback };
