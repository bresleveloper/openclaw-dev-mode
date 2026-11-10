import { g as readStringValue, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { b as uniqueValues } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./defaults-Bg930vxE.mjs";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-D0GOHaAj.mjs";
import { i as resolveOpenAICodexAuthIdentity } from "./provider-openai-chatgpt-auth-DrXK_39U.mjs";
import "./provider-oauth-runtime-CGs7wjl8.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { r as buildFirstTemplateModel, t as matchesExactOrPrefix } from "./provider-model-id-match-B5Dy1dOR.mjs";
import "./provider-model-metadata-DkObn07R.mjs";
import { a as isOpenAIApiBaseUrl, n as OPENAI_CODEX_RESPONSES_BASE_URL, o as isOpenAICodexBaseUrl } from "./base-url-Baro1bPi.mjs";
import { t as OPENAI_CODEX_DEFAULT_MODEL } from "./default-models-CU9j2AqC.mjs";
import { d as OPENAI_GPT_55_PRO_MODEL_ID, g as OPENAI_GPT_56_VARIANT_MODEL_IDS, i as OPENAI_GPT_53_CODEX_SPARK_MODEL_ID, l as OPENAI_GPT_54_PRO_MODEL_ID, o as OPENAI_GPT_54_MINI_MODEL_ID, s as OPENAI_GPT_54_MODEL_ID, t as OPENAI_CHATGPT_MODERN_MODEL_IDS, u as OPENAI_GPT_55_MODEL_ID, y as OPENAI_GPT_6_MODEL_IDS } from "./model-route-contract-Fecaqw2C.mjs";
import { t as modelCatalog } from "./openclaw.plugin-_vm__Dty.mjs";
import { n as OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS, t as OPENAI_CODEX_GPT_61_SOL_CONTEXT_TOKENS } from "./shared-Dzn7GLPX.mjs";
import { n as resolveOpenAIUsageAuth, t as fetchOpenAIUsage } from "./usage-nbKhPSRf.mjs";
//#region extensions/openai/openai-chatgpt-provider.ts
const PROVIDER_ID = "openai";
const OPENAI_MANIFEST_MODELS = buildManifestModelProviderConfig({
	providerId: PROVIDER_ID,
	catalog: modelCatalog.providers.openai
}).models;
const OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP = {
	off: null,
	xhigh: "xhigh",
	max: "max"
};
const OPENAI_CODEX_GPT_56_NATIVE_CONTEXT_TOKENS = 372e3;
const OPENAI_CODEX_GPT_55_CODEX_CONTEXT_TOKENS = 4e5;
const OPENAI_CODEX_GPT_54_MAX_TOKENS = 128e3;
const OPENAI_CODEX_GPT_54_MINI_COST = {
	input: .75,
	output: 4.5,
	cacheRead: .075,
	cacheWrite: 0
};
const OPENAI_CODEX_FORWARD_COMPAT_PATCHES = /* @__PURE__ */ new Map([
	[OPENAI_GPT_55_PRO_MODEL_ID, {
		contextWindow: 1e6,
		cost: {
			input: 30,
			output: 180,
			cacheRead: 0,
			cacheWrite: 0
		}
	}],
	[OPENAI_GPT_54_MODEL_ID, {
		contextWindow: 105e4,
		cost: {
			input: 2.5,
			output: 15,
			cacheRead: .25,
			cacheWrite: 0
		}
	}],
	[OPENAI_GPT_54_PRO_MODEL_ID, {
		contextWindow: 105e4,
		cost: {
			input: 30,
			output: 180,
			cacheRead: 0,
			cacheWrite: 0
		}
	}],
	[OPENAI_GPT_54_MINI_MODEL_ID, {
		contextWindow: 4e5,
		cost: OPENAI_CODEX_GPT_54_MINI_COST
	}],
	[OPENAI_GPT_53_CODEX_SPARK_MODEL_ID, {
		input: ["text"],
		contextWindow: 128e3,
		contextTokens: 128e3,
		cost: OPENAI_CODEX_GPT_54_MINI_COST
	}]
]);
const OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS = ["gpt-5.3-codex"];
/** Legacy codex rows first; fall back to catalog `gpt-5.4` when the API omits 5.3/5.2. */
const OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS = [...OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS, OPENAI_GPT_54_MODEL_ID];
const OPENAI_CODEX_GPT_55_PRO_TEMPLATE_MODEL_IDS = [
	OPENAI_GPT_54_MODEL_ID,
	OPENAI_GPT_54_PRO_MODEL_ID,
	...OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS
];
const OPENAI_CODEX_IMAGE_CAPABLE_MODEL_IDS = [
	...OPENAI_GPT_6_MODEL_IDS,
	...OPENAI_GPT_56_VARIANT_MODEL_IDS,
	OPENAI_GPT_55_MODEL_ID,
	OPENAI_GPT_55_PRO_MODEL_ID,
	OPENAI_GPT_54_MODEL_ID,
	OPENAI_GPT_54_PRO_MODEL_ID,
	OPENAI_GPT_54_MINI_MODEL_ID
];
function isOpenAIProvider(provider) {
	return normalizeProviderId(provider ?? "") === PROVIDER_ID;
}
function normalizeCodexTransportFields(params) {
	const useCodexTransport = !params.baseUrl || isOpenAIApiBaseUrl(params.baseUrl) || isOpenAICodexBaseUrl(params.baseUrl);
	const api = useCodexTransport && (!params.api || params.api === "openai-responses" || params.api === "openai-completions") ? "openai-chatgpt-responses" : params.api ?? void 0;
	return {
		api,
		baseUrl: api === "openai-chatgpt-responses" && useCodexTransport ? OPENAI_CODEX_RESPONSES_BASE_URL : params.baseUrl
	};
}
function normalizeCodexTransport(model) {
	const canonicalModelId = normalizeLowercaseStringOrEmpty(model.id) === "gpt-5.4-codex" ? OPENAI_GPT_54_MODEL_ID : model.id;
	const canonicalName = normalizeLowercaseStringOrEmpty(model.name) === "gpt-5.4-codex" ? OPENAI_GPT_54_MODEL_ID : model.name;
	const normalizedTransport = normalizeCodexTransportFields({
		api: model.api,
		baseUrl: model.baseUrl
	});
	const api = normalizedTransport.api ?? model.api;
	const baseUrl = normalizedTransport.baseUrl ?? model.baseUrl;
	if (api === model.api && baseUrl === model.baseUrl && canonicalModelId === model.id && canonicalName === model.name) return model;
	return {
		...model,
		id: canonicalModelId,
		name: canonicalName,
		api,
		baseUrl
	};
}
function resolveCodexForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	const synthBaseUrl = ctx.providerConfig?.baseUrl ?? "https://chatgpt.com/backend-api/codex";
	if (OPENAI_GPT_6_MODEL_IDS.some((modelId) => modelId === lower)) {
		const catalogModel = OPENAI_MANIFEST_MODELS.find((model) => model.id === lower);
		if (!catalogModel || catalogModel.contextWindow === void 0) return;
		const registeredModel = ctx.modelRegistry.find(PROVIDER_ID, trimmedModelId);
		return {
			...catalogModel,
			contextWindow: catalogModel.contextWindow,
			input: catalogModel.input.filter((item) => item === "text" || item === "image"),
			...registeredModel,
			...lower === "gpt-6.1-sol" ? { contextTokens: registeredModel && (registeredModel.api === "openai-chatgpt-responses" || isOpenAICodexBaseUrl(registeredModel.baseUrl)) ? registeredModel.contextTokens ?? 5e5 : OPENAI_CODEX_GPT_61_SOL_CONTEXT_TOKENS } : {},
			id: trimmedModelId,
			provider: PROVIDER_ID,
			api: "openai-chatgpt-responses",
			baseUrl: synthBaseUrl
		};
	}
	const isGpt56 = OPENAI_GPT_56_VARIANT_MODEL_IDS.some((modelId) => modelId === lower);
	if (isGpt56 || lower === "gpt-5.5") {
		const contextWindow = isGpt56 ? OPENAI_CODEX_GPT_56_NATIVE_CONTEXT_TOKENS : OPENAI_CODEX_GPT_55_CODEX_CONTEXT_TOKENS;
		const registeredModel = withDefaultCodexContextMetadata({
			model: ctx.modelRegistry.find(PROVIDER_ID, trimmedModelId),
			baseUrl: synthBaseUrl,
			contextWindow,
			contextTokens: OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS
		});
		const model = registeredModel ?? {
			id: trimmedModelId,
			name: trimmedModelId,
			api: "openai-chatgpt-responses",
			provider: PROVIDER_ID,
			baseUrl: synthBaseUrl,
			reasoning: true,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow,
			contextTokens: 272e3,
			maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS
		};
		return isGpt56 ? {
			...model,
			thinkingLevelMap: registeredModel ? {
				...OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP,
				...registeredModel.thinkingLevelMap
			} : OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP
		} : model;
	}
	let templateIds;
	let patch;
	const knownPatch = OPENAI_CODEX_FORWARD_COMPAT_PATCHES.get(lower === "gpt-5.4-codex" ? OPENAI_GPT_54_MODEL_ID : lower);
	if (knownPatch) {
		templateIds = lower === "gpt-5.5-pro" ? OPENAI_CODEX_GPT_55_PRO_TEMPLATE_MODEL_IDS : OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS;
		patch = {
			contextTokens: OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS,
			maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
			...knownPatch,
			...knownPatch.input ? { input: [...knownPatch.input] } : {}
		};
	} else if (ctx.agentRuntimeId === "codex" && ctx.authProfileId === void 0 && ctx.authProfileMode === void 0 && ctx.providerConfig?.auth === void 0) {
		templateIds = OPENAI_GPT_56_VARIANT_MODEL_IDS;
		patch = {
			reasoning: true,
			input: ["text", "image"],
			thinkingLevelMap: OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP,
			compat: {
				supportsReasoningEffort: true,
				supportedReasoningEfforts: [
					"low",
					"medium",
					"high",
					"xhigh",
					"max"
				]
			}
		};
	} else return;
	patch = {
		...patch,
		api: "openai-chatgpt-responses",
		baseUrl: synthBaseUrl
	};
	const canonicalModelId = lower === "gpt-5.4-codex" ? OPENAI_GPT_54_MODEL_ID : trimmedModelId;
	return buildFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId: canonicalModelId,
		templateIds,
		ctx,
		patch
	}) ?? {
		id: canonicalModelId,
		name: canonicalModelId,
		api: "openai-chatgpt-responses",
		provider: PROVIDER_ID,
		baseUrl: synthBaseUrl,
		reasoning: true,
		input: patch?.input ?? ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: patch?.contextWindow ?? 2e5,
		contextTokens: patch?.contextTokens,
		maxTokens: patch?.maxTokens ?? 2e5,
		...patch?.thinkingLevelMap ? { thinkingLevelMap: patch.thinkingLevelMap } : {},
		...patch?.compat ? { compat: patch.compat } : {}
	};
}
function withDefaultCodexContextMetadata(params) {
	if (!params.model) return;
	const contextTokens = typeof params.model.contextTokens === "number" ? params.model.contextTokens : typeof params.model.contextWindow === "number" && params.model.contextWindow > 0 ? Math.min(params.contextTokens, params.model.contextWindow) : params.contextTokens;
	const input = params.model.input?.includes("image") ? params.model.input : uniqueValues([...params.model.input ?? ["text"], "image"]);
	return {
		...params.model,
		api: "openai-chatgpt-responses",
		baseUrl: params.baseUrl,
		input,
		contextWindow: params.contextWindow,
		contextTokens
	};
}
function buildCodexCredentialExtra(identity) {
	const extra = {
		...identity.accountId ? { accountId: identity.accountId } : {},
		...identity.chatgptPlanType ? { chatgptPlanType: identity.chatgptPlanType } : {}
	};
	return Object.keys(extra).length > 0 ? extra : void 0;
}
async function refreshOpenAICodexOAuthCredential(cred) {
	try {
		const { refreshOpenAICodexToken } = await import("./extensions/openai/openai-chatgpt-provider.runtime.js");
		const refreshed = await refreshOpenAICodexToken(cred.refresh);
		const identity = resolveOpenAICodexAuthIdentity({
			access: refreshed.access,
			email: cred.email
		});
		return {
			...cred,
			...refreshed,
			type: "oauth",
			provider: PROVIDER_ID,
			email: identity.email ?? cred.email,
			displayName: cred.displayName,
			...buildCodexCredentialExtra(identity)
		};
	} catch (error) {
		const message = formatErrorMessage(error);
		if (/extract\s+accountid\s+from\s+token/i.test(message) && typeof cred.access === "string" && cred.access.trim().length > 0) return cred;
		throw error;
	}
}
function buildOpenAICodexAuthResult(buildResult, creds) {
	const identity = resolveOpenAICodexAuthIdentity({
		access: creds.access,
		email: readStringValue(creds.email)
	});
	return buildResult({
		providerId: PROVIDER_ID,
		defaultModel: OPENAI_CODEX_DEFAULT_MODEL,
		configPatch: { agents: { defaults: { models: { [OPENAI_CODEX_DEFAULT_MODEL]: {} } } } },
		access: creds.access,
		refresh: creds.refresh,
		expires: creds.expires,
		email: identity.email,
		profileName: identity.profileName,
		credentialExtra: buildCodexCredentialExtra(identity)
	});
}
async function runOpenAICodexOAuth(ctx) {
	const [{ loginOpenAICodexOAuth }, { buildOauthProviderAuthResult }] = await Promise.all([import("./extensions/openai/openai-chatgpt-oauth.runtime.js"), import("./plugin-sdk/provider-auth-result.js")]);
	const creds = await loginOpenAICodexOAuth({
		prompter: ctx.prompter,
		runtime: ctx.runtime,
		oauth: ctx.oauth,
		isRemote: ctx.isRemote,
		openUrl: ctx.openUrl,
		signal: ctx.signal,
		assertCurrent: ctx.assertCurrent,
		onManualCodeInput: ctx.onManualCodeInput,
		localBrowserMessage: "Complete sign-in in browser…"
	});
	if (!creds) return { profiles: [] };
	return buildOpenAICodexAuthResult(buildOauthProviderAuthResult, creds);
}
async function runOpenAICodexDeviceCode(ctx) {
	const spin = ctx.prompter.progress("Starting device code flow…");
	try {
		const [{ loginOpenAICodexDeviceCode }, { buildOauthProviderAuthResult }] = await Promise.all([import("./extensions/openai/openai-chatgpt-device-code.js"), import("./plugin-sdk/provider-auth-result.js")]);
		const creds = await loginOpenAICodexDeviceCode({
			...ctx.signal ? { signal: ctx.signal } : {},
			assertCurrent: ctx.assertCurrent,
			onProgress: (message) => spin.update(message),
			onVerification: async ({ verificationUrl, userCode, expiresInMs }) => {
				const expiresInMinutes = Math.max(1, Math.round(expiresInMs / 6e4));
				const deviceCodeMessage = [ctx.isRemote ? "Open this URL in your LOCAL browser and enter the code below." : "Open this URL in your browser and enter the code below.", `URL: <${verificationUrl}>`].join("\n");
				if (ctx.isRemote) await ctx.openUrl(verificationUrl);
				if (ctx.prompter.deviceCode) await ctx.prompter.deviceCode({
					title: "OpenAI Codex device code",
					code: userCode,
					expiresInMinutes,
					message: "Enter this one-time code on the sign-in page."
				});
				else await ctx.prompter.note([
					deviceCodeMessage,
					`Code: ${userCode}`,
					`Code expires in ${expiresInMinutes} minutes. Never share it.`
				].join("\n"), "OpenAI Codex device code");
				if (ctx.isRemote) {
					ctx.runtime.log(`\nOpen this URL in your LOCAL browser:\n\n${verificationUrl}\n`);
					return;
				}
				try {
					await ctx.openUrl(verificationUrl);
					ctx.runtime.log(`Open: ${verificationUrl}`);
				} catch {
					ctx.runtime.log(`Open manually: ${verificationUrl}`);
				}
			}
		});
		spin.stop("OpenAI device code complete");
		return buildOpenAICodexAuthResult(buildOauthProviderAuthResult, creds);
	} catch (error) {
		spin.stop("OpenAI device code failed");
		ctx.runtime.error(formatErrorMessage(error));
		await ctx.prompter.note("Trouble with device code login? See https://docs.openclaw.ai/start/faq", "OAuth help");
		throw error;
	}
}
function buildOpenAIChatGPTAuthMethodRuns() {
	return {
		oauth: runOpenAICodexOAuth,
		"device-code": runOpenAICodexDeviceCode
	};
}
function buildOpenAICodexProviderHooks() {
	return {
		resolveDynamicModel: resolveCodexForwardCompatModel,
		preferRuntimeResolvedModel: (ctx) => {
			if (!isOpenAIProvider(ctx.provider)) return false;
			const id = ctx.modelId.trim().toLowerCase();
			return OPENAI_CHATGPT_MODERN_MODEL_IDS.some((modelId) => modelId === id);
		},
		normalizeResolvedModel: (ctx) => {
			if (!isOpenAIProvider(ctx.provider)) return;
			let model = normalizeCodexTransport(ctx.model);
			if (!(Array.isArray(model.input) && model.input.includes("image")) && [ctx.modelId, model.name].some((candidate) => typeof candidate === "string" && matchesExactOrPrefix(candidate, OPENAI_CODEX_IMAGE_CAPABLE_MODEL_IDS))) model = {
				...model,
				input: ["text", "image"]
			};
			return model === ctx.model ? void 0 : model;
		},
		normalizeTransport: ({ provider, api, baseUrl }) => {
			if (!isOpenAIProvider(provider)) return;
			const normalized = normalizeCodexTransportFields({
				api,
				baseUrl
			});
			if (normalized.api === api && normalized.baseUrl === baseUrl) return;
			return normalized;
		},
		resolveUsageAuth: resolveOpenAIUsageAuth,
		fetchUsageSnapshot: fetchOpenAIUsage,
		refreshOAuth: refreshOpenAICodexOAuthCredential
	};
}
//#endregion
export { buildOpenAICodexProviderHooks as n, buildOpenAIChatGPTAuthMethodRuns as t };
