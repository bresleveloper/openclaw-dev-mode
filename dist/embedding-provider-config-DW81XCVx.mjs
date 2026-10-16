import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
//#region src/plugins/embedding-provider-config.ts
const OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = /* @__PURE__ */ new Set(["openai-completions", "openai-responses"]);
/** Reads a configured provider's backing API id when runtime lookup should follow an alias. */
function resolveConfiguredGenericEmbeddingProviderId(providerId, cfg) {
	const providers = cfg?.models?.providers;
	const providerConfig = providers?.[providerId] ?? findNormalizedProviderValue(providers, providerId);
	if (!providerConfig) return;
	const api = providerConfig.api?.trim();
	const normalizedApi = api ? normalizeProviderId(api) : void 0;
	const resolvedProviderId = normalizedApi ? OPENAI_COMPATIBLE_MODEL_APIS.has(normalizedApi) ? OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID : normalizedApi : providerConfig.baseUrl?.trim() ? OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID : void 0;
	return resolvedProviderId && resolvedProviderId !== normalizeProviderId(providerId) ? resolvedProviderId : void 0;
}
//#endregion
export { resolveConfiguredGenericEmbeddingProviderId as t };
