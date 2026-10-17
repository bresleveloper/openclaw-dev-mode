import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as MINIMAX_OAUTH_MARKER, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import { i as normalizeModelCompat } from "./provider-model-compat-DQ2tKK7m.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as buildProviderReplayFamilyHooks } from "./provider-model-shared-CgZ78XZA.mjs";
import "./provider-auth-BGYKg9mW.mjs";
import { n as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-DHc8KFQ9.mjs";
import { t as buildOauthProviderAuthResult } from "./provider-auth-result-BIBiHM9E.mjs";
import { r as buildOpenAICompatibleLiveProviderCatalog } from "./provider-catalog-live-runtime-Ngo-Palb.mjs";
import "./provider-entry-Dw7vrvaY.mjs";
import { a as fetchMinimaxUsage } from "./provider-usage-DGQhrvJu.mjs";
import { i as resolveMinimaxThinkingProfile } from "./thinking-Dg9lPaiN.mjs";
import { i as MINIMAX_TEXT_MODEL_ORDER, o as isMiniMaxModernModelId, t as MINIMAX_DEFAULT_MODEL_ID } from "./provider-models-BanLFxIV.mjs";
import { i as MINIMAX_CN_API_BASE_URL, l as buildMinimaxApiModelDefinition, n as MINIMAX_API_BASE_URL } from "./model-definitions-CvDgIK-w.mjs";
import { i as resolveMinimaxCatalogBaseUrl, n as buildMinimaxPortalProvider, r as buildMinimaxProvider, t as buildMinimaxModelDiscovery } from "./provider-catalog-DuuhUyeC.mjs";
import { n as applyMinimaxApiConfigCn, t as applyMinimaxApiConfig } from "./onboard-BqlufC_u.mjs";
import "./api-6Q3Qiph-.mjs";
import { n as createMinimaxProvider, r as minimaxAuthMethodMetadata, t as createMinimaxPortalProvider } from "./provider-contract-api-7_d_Jw2O.mjs";
import { t as wrapMinimaxProviderStream } from "./stream-CV5S_lFP.mjs";
//#region extensions/minimax/provider-registration.ts
const API_PROVIDER_ID = "minimax";
const PORTAL_PROVIDER_ID = "minimax-portal";
const MINIMAX_USAGE_ENV_VAR_KEYS = [
	"MINIMAX_OAUTH_TOKEN",
	"MINIMAX_CODE_PLAN_KEY",
	"MINIMAX_CODING_API_KEY",
	"MINIMAX_API_KEY"
];
const MINIMAX_PROVIDER_HOOKS = {
	...buildProviderReplayFamilyHooks({
		family: "hybrid-anthropic-openai",
		anthropicModelDropThinkingBlocks: true
	}),
	wrapStreamFn: wrapMinimaxProviderStream,
	wrapSimpleCompletionStreamFn: wrapMinimaxProviderStream,
	resolveReasoningOutputMode: () => "native",
	resolveThinkingProfile: ({ modelId }) => resolveMinimaxThinkingProfile(modelId)
};
function getProviderBaseUrl(cfg, providerId) {
	return normalizeOptionalString(cfg.models?.providers?.[providerId]?.baseUrl);
}
function resolveMinimaxUsageBaseUrl(cfg) {
	return getProviderBaseUrl(cfg, PORTAL_PROVIDER_ID) ?? getProviderBaseUrl(cfg, API_PROVIDER_ID);
}
function resolveMinimaxDynamicModel(params) {
	const normalizedModelId = params.ctx.modelId.trim().toLowerCase();
	const catalogModelId = MINIMAX_TEXT_MODEL_ORDER.find((id) => id.toLowerCase() === normalizedModelId);
	if (!catalogModelId) return;
	return normalizeModelCompat({
		...buildMinimaxApiModelDefinition(catalogModelId),
		provider: params.providerId,
		api: "anthropic-messages",
		baseUrl: normalizeOptionalString(params.ctx.providerConfig?.baseUrl) ?? resolveMinimaxCatalogBaseUrl()
	});
}
async function resolveApiCatalog(ctx) {
	const auth = ctx.resolveProviderApiKey(API_PROVIDER_ID);
	if (!auth.apiKey) return null;
	const defaults = buildMinimaxProvider(ctx.env);
	const providerConfig = {
		...defaults,
		baseUrl: getProviderBaseUrl(ctx.config, API_PROVIDER_ID) ?? defaults.baseUrl,
		api: ctx.config.models?.providers?.[API_PROVIDER_ID]?.api ?? defaults.api
	};
	return await buildOpenAICompatibleLiveProviderCatalog({
		discoveryMode: "strict",
		providerId: API_PROVIDER_ID,
		providerConfig,
		apiKey: auth.apiKey,
		discoveryApiKey: auth.discoveryApiKey,
		profileId: auth.profileId,
		modelDiscovery: buildMinimaxModelDiscovery(providerConfig)
	});
}
async function resolvePortalCatalog(ctx) {
	const explicitProvider = ctx.config.models?.providers?.[PORTAL_PROVIDER_ID];
	const apiKeyAuth = ctx.resolveProviderApiKey(PORTAL_PROVIDER_ID);
	const profileAuth = ctx.resolveProviderAuth(PORTAL_PROVIDER_ID, { oauthMarker: MINIMAX_OAUTH_MARKER });
	const explicitApiKey = normalizeOptionalString(explicitProvider?.apiKey);
	let auth = apiKeyAuth.apiKey !== void 0 ? apiKeyAuth : explicitApiKey ? { apiKey: explicitApiKey } : profileAuth;
	const { apiKey } = auth;
	if (!apiKey) return null;
	if (!normalizeOptionalString(auth.discoveryApiKey) && isNonSecretApiKeyMarker(apiKey)) {
		if (auth.profileId && profileAuth.source === "profile" && auth.profileId === profileAuth.profileId && apiKey === profileAuth.apiKey && (auth.mode === void 0 || auth.mode === profileAuth.mode)) auth = profileAuth;
		if (!normalizeOptionalString(auth.discoveryApiKey)) return {
			providers: {},
			outcomes: [{
				provider: PORTAL_PROVIDER_ID,
				profileId: auth.profileId,
				status: "unavailable"
			}]
		};
	}
	const usesPortalBearerAuth = apiKeyAuth.apiKey === "MINIMAX_OAUTH_TOKEN" || (apiKeyAuth.apiKey && apiKeyAuth.mode ? apiKeyAuth.mode === "token" || apiKeyAuth.mode === "oauth" : profileAuth.mode === "token" && profileAuth.apiKey === apiKey || !apiKeyAuth.apiKey && !explicitApiKey && profileAuth.mode === "oauth");
	const explicitBaseUrl = normalizeOptionalString(explicitProvider?.baseUrl);
	const providerConfig = {
		...buildMinimaxPortalProvider(),
		baseUrl: explicitBaseUrl || buildMinimaxPortalProvider(ctx.env).baseUrl,
		apiKey
	};
	return await buildOpenAICompatibleLiveProviderCatalog({
		discoveryMode: "strict",
		providerId: PORTAL_PROVIDER_ID,
		providerConfig,
		apiKey,
		discoveryApiKey: auth.discoveryApiKey,
		profileId: auth.profileId,
		modelDiscovery: buildMinimaxModelDiscovery(providerConfig, usesPortalBearerAuth ? "oauth" : "api_key")
	});
}
function createOAuthHandler(region) {
	const defaultBaseUrl = region === "cn" ? MINIMAX_CN_API_BASE_URL : MINIMAX_API_BASE_URL;
	const regionLabel = region === "cn" ? "CN" : "Global";
	return async (ctx) => {
		const progress = ctx.prompter.progress(`Starting MiniMax OAuth (${regionLabel})…`);
		try {
			const { loginMiniMaxPortalOAuth } = await import("./extensions/minimax/oauth.runtime.js");
			const result = await loginMiniMaxPortalOAuth({
				openUrl: ctx.openUrl,
				note: (message, title) => ctx.prompter.note(message, title),
				deviceCode: ctx.prompter.deviceCode,
				progress,
				region,
				...ctx.signal ? { signal: ctx.signal } : {},
				...ctx.assertCurrent ? { assertCurrent: ctx.assertCurrent } : {}
			});
			progress.stop("MiniMax OAuth complete");
			if (result.notification_message) await ctx.prompter.note(result.notification_message, "MiniMax OAuth");
			const baseUrl = result.resourceUrl || defaultBaseUrl;
			return buildOauthProviderAuthResult({
				providerId: PORTAL_PROVIDER_ID,
				defaultModel: `${PORTAL_PROVIDER_ID}/${MINIMAX_DEFAULT_MODEL_ID}`,
				access: result.access,
				refresh: result.refresh,
				expires: result.expires,
				credentialExtra: {
					authFlow: "device-code",
					tokenEndpoint: result.tokenEndpoint
				},
				configPatch: {
					models: { providers: { [PORTAL_PROVIDER_ID]: {
						baseUrl,
						api: "anthropic-messages",
						authHeader: true,
						models: []
					} } },
					agents: { defaults: { models: {
						[`${PORTAL_PROVIDER_ID}/MiniMax-M3`]: { alias: "minimax-m3" },
						[`${PORTAL_PROVIDER_ID}/MiniMax-M2.7`]: { alias: "minimax-m2.7" },
						[`${PORTAL_PROVIDER_ID}/MiniMax-M2.7-highspeed`]: { alias: "minimax-m2.7-highspeed" }
					} } }
				},
				notes: [
					"MiniMax OAuth tokens auto-refresh. Re-run login if refresh fails or access is revoked.",
					`Base URL defaults to ${defaultBaseUrl}. Override models.providers.${PORTAL_PROVIDER_ID}.baseUrl if needed.`,
					...result.notification_message ? [result.notification_message] : []
				]
			});
		} catch (err) {
			const errorMsg = formatErrorMessage(err);
			progress.stop(`MiniMax OAuth failed: ${errorMsg}`);
			await ctx.prompter.note("If OAuth fails, verify your MiniMax account has portal access and try again.", "MiniMax OAuth");
			throw err;
		}
	};
}
function createMinimaxApiKeyMethod(region) {
	const metadata = minimaxAuthMethodMetadata(region, "api_key");
	const isCn = region === "cn";
	return createProviderApiKeyAuthMethod({
		providerId: API_PROVIDER_ID,
		methodId: metadata.id,
		label: metadata.label,
		hint: metadata.hint,
		optionKey: "minimaxApiKey",
		flagName: "--minimax-api-key",
		envVar: "MINIMAX_API_KEY",
		promptMessage: isCn ? "Enter MiniMax CN API key (sk-api- or sk-cp-)\nhttps://platform.minimaxi.com/user-center/basic-information/interface-key" : "Enter MiniMax API key (sk-api- or sk-cp-)\nhttps://platform.minimax.io/user-center/basic-information/interface-key",
		profileId: isCn ? "minimax:cn" : "minimax:global",
		allowProfile: false,
		defaultModel: `${API_PROVIDER_ID}/${MINIMAX_DEFAULT_MODEL_ID}`,
		expectedProviders: isCn ? ["minimax", "minimax-cn"] : ["minimax"],
		applyConfig: (cfg) => isCn ? applyMinimaxApiConfigCn(cfg) : applyMinimaxApiConfig(cfg),
		wizard: metadata.wizard
	});
}
function createMinimaxOAuthMethod(region) {
	return {
		...minimaxAuthMethodMetadata(region, "device_code"),
		run: createOAuthHandler(region)
	};
}
function buildMinimaxApiProviderPlugin() {
	return {
		...createMinimaxProvider(),
		auth: [createMinimaxApiKeyMethod("global"), createMinimaxApiKeyMethod("cn")],
		catalog: {
			order: "simple",
			run: resolveApiCatalog
		},
		staticCatalog: {
			order: "simple",
			run: async (ctx) => ({ providers: { [API_PROVIDER_ID]: buildMinimaxProvider(ctx.env) } })
		},
		resolveUsageAuth: async (ctx) => {
			const portalOauth = await ctx.resolveOAuthToken({ provider: PORTAL_PROVIDER_ID });
			if (portalOauth) return portalOauth;
			const apiKey = ctx.resolveApiKeyFromConfigAndStore({
				providerIds: [API_PROVIDER_ID, PORTAL_PROVIDER_ID],
				envDirect: MINIMAX_USAGE_ENV_VAR_KEYS.map((name) => ctx.env[name])
			});
			return apiKey ? { token: apiKey } : null;
		},
		...MINIMAX_PROVIDER_HOOKS,
		resolveDynamicModel: (ctx) => resolveMinimaxDynamicModel({
			providerId: API_PROVIDER_ID,
			ctx
		}),
		isModernModelRef: ({ modelId }) => isMiniMaxModernModelId(modelId),
		fetchUsageSnapshot: async (ctx) => await fetchMinimaxUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn, { baseUrl: resolveMinimaxUsageBaseUrl(ctx.config) })
	};
}
function buildMinimaxPortalProviderPlugin(readBaseUrl) {
	return {
		...createMinimaxPortalProvider(),
		catalog: { run: resolvePortalCatalog },
		staticCatalog: { run: async (ctx) => ({ providers: { [PORTAL_PROVIDER_ID]: buildMinimaxPortalProvider(ctx.env) } }) },
		auth: [createMinimaxOAuthMethod("global"), createMinimaxOAuthMethod("cn")],
		refreshOAuth: async (credential, config) => {
			const { refreshMiniMaxPortalOAuthCredential } = await import("./extensions/minimax/oauth.runtime.js");
			return await refreshMiniMaxPortalOAuthCredential(credential, config === void 0 ? readBaseUrl() : getProviderBaseUrl(config, PORTAL_PROVIDER_ID));
		},
		...MINIMAX_PROVIDER_HOOKS,
		resolveDynamicModel: (ctx) => resolveMinimaxDynamicModel({
			providerId: PORTAL_PROVIDER_ID,
			ctx
		}),
		isModernModelRef: ({ modelId }) => isMiniMaxModernModelId(modelId)
	};
}
function registerMinimaxProviders(api) {
	api.registerProvider(buildMinimaxApiProviderPlugin());
	api.registerProvider(buildMinimaxPortalProviderPlugin(() => normalizeOptionalString(api.runtime.config.current().models?.providers?.[PORTAL_PROVIDER_ID]?.baseUrl)));
}
//#endregion
export { registerMinimaxProviders as t };
