import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./provider-auth-JCvgbsWg.mjs";
import { h as runLiveProviderCatalog } from "./provider-catalog-live-runtime-BILEsjga.mjs";
import { E as resolveLmstudioInferenceBase, H as LMSTUDIO_PROVIDER_ID, M as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, c as resolveLmstudioConfiguredApiKey, h as resolvePersistedLmstudioApiKey, m as resolveLmstudioProviderAuthMode, n as discoverLmstudioModels, o as LmstudioConfigResolutionError, p as hasLmstudioAuthorizationHeader, u as resolveLmstudioProviderHeaders } from "./models.fetch-B9hVA3qO.mjs";
//#region extensions/lmstudio/src/catalog.ts
async function discoverLmstudioProvider(ctx, options) {
	if (ctx.providerIds && !ctx.providerIds.includes("lmstudio")) return null;
	const explicit = ctx.config.models?.providers?.[LMSTUDIO_PROVIDER_ID];
	const { headers: _headers, auth: explicitAuth, apiKey: _apiKey, ...explicitWithoutHeaders } = explicit ?? {};
	const { apiKey, discoveryApiKey, profileId } = ctx.resolveProviderApiKey(LMSTUDIO_PROVIDER_ID);
	let resolvedHeaders;
	let hasAuthorizationHeader;
	let configuredDiscoveryApiKey;
	try {
		resolvedHeaders = await resolveLmstudioProviderHeaders({
			config: ctx.config,
			env: ctx.env,
			headers: explicit?.headers
		});
		hasAuthorizationHeader = hasLmstudioAuthorizationHeader(resolvedHeaders);
		configuredDiscoveryApiKey = await resolveLmstudioConfiguredApiKey({
			config: ctx.config,
			env: ctx.env,
			allowUnresolved: hasAuthorizationHeader || Boolean(discoveryApiKey)
		});
	} catch (error) {
		if (error instanceof LmstudioConfigResolutionError) return null;
		throw error;
	}
	const resolvedDiscoveryApiKey = hasAuthorizationHeader ? void 0 : discoveryApiKey ?? configuredDiscoveryApiKey;
	const resolvedApiKey = apiKey ?? explicit?.apiKey;
	const baseUrl = resolveLmstudioInferenceBase(explicit?.baseUrl);
	const quiet = !apiKey && !explicit && !resolvedDiscoveryApiKey;
	const catalogProfileId = !hasAuthorizationHeader && discoveryApiKey && !isNonSecretApiKeyMarker(discoveryApiKey) ? profileId : void 0;
	const run = async () => {
		let modelIdCatalog;
		const models = !options && explicit?.models?.length ? explicit.models : await discoverLmstudioModels({
			onListedModels: (rows) => {
				modelIdCatalog = {
					baseUrl,
					modelIds: normalizeUniqueTrimmedStringList(rows.flatMap((row) => [row.key, ...row.loaded_instances?.map((instance) => instance?.id) ?? []])),
					aliases: normalizeUniqueTrimmedStringList(rows.flatMap((row) => row.key?.trim() ? [row.selected_variant, ...normalizeUniqueTrimmedStringList(row.variants)] : []))
				};
			},
			baseUrl,
			apiKey: resolvedDiscoveryApiKey ?? "",
			headers: resolvedHeaders,
			quiet,
			...!quiet && options ? options : {}
		});
		const outcomes = modelIdCatalog ? [{
			provider: LMSTUDIO_PROVIDER_ID,
			profileId: catalogProfileId,
			status: "ready",
			modelIdCatalog
		}] : void 0;
		if (models.length === 0 && (options ? quiet : !apiKey && !explicit?.apiKey)) return options && outcomes ? {
			providers: {},
			outcomes
		} : null;
		const persistedApiKey = resolvePersistedLmstudioApiKey({
			currentApiKey: resolvedApiKey,
			explicitAuth,
			fallbackApiKey: LMSTUDIO_DEFAULT_API_KEY_ENV_VAR,
			hasModels: models.length > 0,
			hasAuthorizationHeader
		});
		const persistedAuth = resolveLmstudioProviderAuthMode(persistedApiKey);
		return {
			...outcomes ? { outcomes } : {},
			provider: {
				...explicitWithoutHeaders,
				baseUrl,
				api: explicit?.api ?? "openai-completions",
				...resolvedHeaders ? { headers: resolvedHeaders } : {},
				...persistedApiKey ? { apiKey: persistedApiKey } : {},
				...persistedAuth ? { auth: persistedAuth } : {},
				models
			}
		};
	};
	return options ? await runLiveProviderCatalog({
		providerId: LMSTUDIO_PROVIDER_ID,
		profileId: catalogProfileId,
		run
	}) : await run();
}
//#endregion
export { discoverLmstudioProvider as t };
