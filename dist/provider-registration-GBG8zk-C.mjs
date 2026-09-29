import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as MINIMAX_OAUTH_MARKER, s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { i as normalizeModelCompat } from "./provider-model-compat-D1iLDbYW.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { a as buildProviderReplayFamilyHooks } from "./provider-model-shared-DwrT_ZjA.mjs";
import "./provider-auth-eHeoP8se.mjs";
import { n as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-Chp7QFG3.mjs";
import { t as buildOauthProviderAuthResult } from "./provider-auth-result-ByCutRUI.mjs";
import { r as buildOpenAICompatibleLiveProviderCatalog } from "./provider-catalog-live-runtime-8rOzIDOV.mjs";
import "./provider-entry-D3wDLM3X.mjs";
import { c as buildProviderStreamFamilyHooks } from "./provider-stream-DQUA16y1.mjs";
import "./provider-stream-family-YEUW6xGn.mjs";
import { a as fetchMinimaxUsage } from "./provider-usage-DhEDnd_r.mjs";
import { i as MINIMAX_TEXT_MODEL_ORDER, o as isMiniMaxModernModelId, t as MINIMAX_DEFAULT_MODEL_ID } from "./provider-models-Dbq8DYQ2.mjs";
import { l as buildMinimaxApiModelDefinition } from "./model-definitions-Byr02IeI.mjs";
import { i as resolveMinimaxCatalogBaseUrl, n as buildMinimaxPortalProvider, r as buildMinimaxProvider, t as buildMinimaxModelDiscovery } from "./provider-catalog-B79VugWP.mjs";
import { n as applyMinimaxApiConfigCn, t as applyMinimaxApiConfig } from "./onboard-D1K2S0yR.mjs";
import "./api-CkMhW90r.mjs";
import { t as resolveMinimaxThinkingProfile } from "./thinking-CImIZXQq.mjs";
//#region extensions/minimax/provider-registration.ts
const API_PROVIDER_ID = "minimax";
const PORTAL_PROVIDER_ID = "minimax-portal";
const PROVIDER_LABEL = "MiniMax";
const DEFAULT_MODEL = MINIMAX_DEFAULT_MODEL_ID;
const DEFAULT_BASE_URL_CN = "https://api.minimaxi.com/anthropic";
const DEFAULT_BASE_URL_GLOBAL = "https://api.minimax.io/anthropic";
const MINIMAX_USAGE_ENV_VAR_KEYS = [
	"MINIMAX_OAUTH_TOKEN",
	"MINIMAX_CODE_PLAN_KEY",
	"MINIMAX_CODING_API_KEY",
	"MINIMAX_API_KEY"
];
const MINIMAX_WIZARD_GROUP = {
	groupId: "minimax",
	groupLabel: "MiniMax",
	groupHint: "M3 (recommended)"
};
const MINIMAX_PROVIDER_HOOKS = {
	...buildProviderReplayFamilyHooks({
		family: "hybrid-anthropic-openai",
		anthropicModelDropThinkingBlocks: true
	}),
	...buildProviderStreamFamilyHooks("minimax-fast-mode"),
	resolveReasoningOutputMode: () => "native",
	resolveThinkingProfile: ({ modelId }) => resolveMinimaxThinkingProfile(modelId)
};
function getDefaultBaseUrl(region) {
	return region === "cn" ? DEFAULT_BASE_URL_CN : DEFAULT_BASE_URL_GLOBAL;
}
function resolveMinimaxRegionLabel(region) {
	return region === "cn" ? "CN" : "Global";
}
function resolveMinimaxEndpointHint(region) {
	return region === "cn" ? "CN endpoint - api.minimaxi.com" : "Global endpoint - api.minimax.io";
}
function apiModelRef(modelId) {
	return `${API_PROVIDER_ID}/${modelId}`;
}
function portalModelRef(modelId) {
	return `${PORTAL_PROVIDER_ID}/${modelId}`;
}
function getProviderBaseUrl(cfg, providerId) {
	return normalizeOptionalString(cfg.models?.providers?.[providerId]?.baseUrl);
}
function resolveMinimaxUsageBaseUrl(cfg) {
	return getProviderBaseUrl(cfg, PORTAL_PROVIDER_ID) ?? getProviderBaseUrl(cfg, API_PROVIDER_ID);
}
function buildPortalProviderCatalog(params) {
	return {
		...buildMinimaxPortalProvider(),
		baseUrl: params.baseUrl,
		apiKey: params.apiKey
	};
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
	const providerConfig = buildPortalProviderCatalog({
		baseUrl: normalizeOptionalString(explicitProvider?.baseUrl) || buildMinimaxPortalProvider(ctx.env).baseUrl,
		apiKey
	});
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
	const defaultBaseUrl = getDefaultBaseUrl(region);
	const regionLabel = resolveMinimaxRegionLabel(region);
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
				defaultModel: portalModelRef(DEFAULT_MODEL),
				access: result.access,
				refresh: result.refresh,
				expires: result.expires,
				credentialExtra: { authFlow: "device-code" },
				configPatch: {
					models: { providers: { [PORTAL_PROVIDER_ID]: {
						baseUrl,
						api: "anthropic-messages",
						authHeader: true,
						models: []
					} } },
					agents: { defaults: { models: {
						[portalModelRef("MiniMax-M3")]: { alias: "minimax-m3" },
						[portalModelRef("MiniMax-M2.7")]: { alias: "minimax-m2.7" },
						[portalModelRef("MiniMax-M2.7-highspeed")]: { alias: "minimax-m2.7-highspeed" }
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
	const regionLabel = resolveMinimaxRegionLabel(region);
	const endpointHint = resolveMinimaxEndpointHint(region);
	const isCn = region === "cn";
	return createProviderApiKeyAuthMethod({
		providerId: API_PROVIDER_ID,
		methodId: isCn ? "api-cn" : "api-global",
		label: `MiniMax API key (${regionLabel})`,
		hint: endpointHint,
		optionKey: "minimaxApiKey",
		flagName: "--minimax-api-key",
		envVar: "MINIMAX_API_KEY",
		promptMessage: isCn ? "Enter MiniMax CN API key (sk-api- or sk-cp-)\nhttps://platform.minimaxi.com/user-center/basic-information/interface-key" : "Enter MiniMax API key (sk-api- or sk-cp-)\nhttps://platform.minimax.io/user-center/basic-information/interface-key",
		profileId: isCn ? "minimax:cn" : "minimax:global",
		allowProfile: false,
		defaultModel: apiModelRef(DEFAULT_MODEL),
		expectedProviders: isCn ? ["minimax", "minimax-cn"] : ["minimax"],
		applyConfig: (cfg) => isCn ? applyMinimaxApiConfigCn(cfg) : applyMinimaxApiConfig(cfg),
		wizard: {
			choiceId: isCn ? "minimax-cn-api" : "minimax-global-api",
			choiceLabel: `MiniMax API key (${regionLabel})`,
			choiceHint: endpointHint,
			...MINIMAX_WIZARD_GROUP
		}
	});
}
function createMinimaxOAuthMethod(region) {
	const regionLabel = resolveMinimaxRegionLabel(region);
	const endpointHint = resolveMinimaxEndpointHint(region);
	const isCn = region === "cn";
	return {
		id: isCn ? "oauth-cn" : "oauth",
		label: `MiniMax OAuth (${regionLabel})`,
		hint: endpointHint,
		kind: "device_code",
		wizard: {
			choiceId: isCn ? "minimax-cn-oauth" : "minimax-global-oauth",
			choiceLabel: `MiniMax OAuth (${regionLabel})`,
			choiceHint: endpointHint,
			...MINIMAX_WIZARD_GROUP
		},
		run: createOAuthHandler(region)
	};
}
function buildMinimaxApiProviderPlugin() {
	return {
		id: API_PROVIDER_ID,
		label: PROVIDER_LABEL,
		hookAliases: ["minimax-cn"],
		docsPath: "/providers/minimax",
		envVars: ["MINIMAX_API_KEY"],
		auth: [createMinimaxApiKeyMethod("global"), createMinimaxApiKeyMethod("cn")],
		catalog: {
			order: "simple",
			run: async (ctx) => resolveApiCatalog(ctx)
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
function buildMinimaxPortalProviderPlugin() {
	return {
		id: PORTAL_PROVIDER_ID,
		label: PROVIDER_LABEL,
		hookAliases: ["minimax-portal-cn"],
		docsPath: "/providers/minimax",
		envVars: ["MINIMAX_OAUTH_TOKEN", "MINIMAX_API_KEY"],
		catalog: { run: async (ctx) => resolvePortalCatalog(ctx) },
		staticCatalog: { run: async (ctx) => ({ providers: { [PORTAL_PROVIDER_ID]: buildMinimaxPortalProvider(ctx.env) } }) },
		auth: [createMinimaxOAuthMethod("global"), createMinimaxOAuthMethod("cn")],
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
	api.registerProvider(buildMinimaxPortalProviderPlugin());
}
//#endregion
export { registerMinimaxProviders as t };
