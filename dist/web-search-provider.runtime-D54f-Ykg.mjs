import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as coerceSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { m as readToolStringParam, u as readPositiveIntegerParam } from "./common-BofcG96e.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-AfCp6rSy.mjs";
import { k as isProviderAuthError } from "./model-auth-provider-config-C_EL9CxV.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { o as listUsableProviderAuthProfileIdsAsync } from "./provider-auth-availability-CfYdMNuk.mjs";
import { c as resolveTimeoutSeconds, i as readCache, l as writeCache, o as resolveCacheTtlMs, r as normalizeCacheKey } from "./web-shared-DT676edC.mjs";
import "./extension-shared-Bp_Ziw8S.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CMRSW7VK.mjs";
import "./provider-auth-JCvgbsWg.mjs";
import { r as mergeScopedSearchConfig, s as resolvePluginWebSearchConfig, t as getScopedCredentialValue } from "./web-search-provider-config-CL-WXKpm.mjs";
import { t as resolveWebSearchProviderCredential } from "./provider-web-search-Buc2BYyP.mjs";
import { a as XAI_DEFAULT_MODEL_ID } from "./model-definitions-Bv0caRc4.mjs";
import { n as setPluginXSearchConfigValue, t as resolveEffectiveXSearchConfig } from "./x-search-config-CjIUNZXa.mjs";
import { s as resolveXaiResponsesEndpoint, t as resolveNormalizedXaiToolModel } from "./tool-config-shared-D54mUMFo.mjs";
import { c as buildXaiWebSearchPayload, l as requestXaiWebSearch, t as XAI_DEFAULT_X_SEARCH_MODEL, u as wrapXaiWebSearchError } from "./x-search-shared-zMrPNpDH.mjs";
//#region extensions/xai/src/web-search-provider.runtime.ts
const XAI_WEB_SEARCH_CACHE = /* @__PURE__ */ new Map();
const XAI_WEB_SEARCH_DEFAULT_TIMEOUT_SECONDS = 60;
const XAI_PROVIDER_ID = "xai";
const X_SEARCH_MODEL_OPTIONS = [{
	value: XAI_DEFAULT_X_SEARCH_MODEL,
	label: XAI_DEFAULT_X_SEARCH_MODEL,
	hint: "default · reasoning disabled"
}];
async function runXaiSearchProviderSetup(ctx) {
	const existingXSearch = resolveEffectiveXSearchConfig(ctx.config);
	if (existingXSearch?.enabled === false) return ctx.config;
	await ctx.prompter.note([
		"x_search lets your agent search X (formerly Twitter) posts via xAI.",
		"It reuses the same xAI credential you configured for Grok web search.",
		`You can change this later with ${formatCliCommand("openclaw configure --section web")}.`
	].join("\n"), "X search");
	if (await ctx.prompter.select({
		message: "Enable x_search too?",
		options: [{
			value: "yes",
			label: "Yes, enable x_search",
			hint: "Search X posts with the same xAI credential"
		}, {
			value: "skip",
			label: "Skip for now",
			hint: "Keep Grok web_search only"
		}],
		initialValue: existingXSearch?.enabled === true || ctx.quickstartDefaults ? "yes" : "skip"
	}) === "skip") return ctx.config;
	const existingModel = typeof existingXSearch?.model === "string" && existingXSearch.model.trim() ? existingXSearch.model.trim() : "";
	const knownModel = X_SEARCH_MODEL_OPTIONS.find((entry) => entry.value === existingModel)?.value;
	const modelPick = await ctx.prompter.select({
		message: "Grok model for x_search",
		options: [...X_SEARCH_MODEL_OPTIONS, {
			value: "__custom__",
			label: "Enter custom model name",
			hint: ""
		}],
		initialValue: knownModel ?? XAI_DEFAULT_X_SEARCH_MODEL
	});
	let model = modelPick;
	if (modelPick === "__custom__") model = (await ctx.prompter.text({
		message: "Custom Grok model name",
		initialValue: existingModel || XAI_DEFAULT_X_SEARCH_MODEL,
		placeholder: XAI_DEFAULT_X_SEARCH_MODEL
	})).trim() || XAI_DEFAULT_X_SEARCH_MODEL;
	const next = structuredClone(ctx.config);
	setPluginXSearchConfigValue(next, "enabled", true);
	setPluginXSearchConfigValue(next, "model", model || XAI_DEFAULT_X_SEARCH_MODEL);
	return next;
}
async function runXaiWebSearch(params) {
	params.signal?.throwIfAborted();
	const cacheKey = normalizeCacheKey(`grok:${params.endpoint}:${params.model}:${String(params.inlineCitations)}:${params.query}`);
	const cached = readCache(XAI_WEB_SEARCH_CACHE, cacheKey, params.cacheTtlMs);
	if (cached) return {
		...cached.value,
		cached: true
	};
	const startedAt = Date.now();
	const result = await requestXaiWebSearch(params);
	params.signal?.throwIfAborted();
	const payload = buildXaiWebSearchPayload({
		query: params.query,
		provider: "grok",
		model: params.model,
		tookMs: Date.now() - startedAt,
		...result
	});
	writeCache(XAI_WEB_SEARCH_CACHE, cacheKey, payload, params.cacheTtlMs);
	return payload;
}
function resolveXaiToolSearchConfig(ctx) {
	return mergeScopedSearchConfig(ctx.searchConfig, "grok", resolvePluginWebSearchConfig(ctx.config, "xai"));
}
function resolveConfiguredXaiWebSearchCredential(searchConfig) {
	return resolveWebSearchProviderCredential({
		credentialValue: getScopedCredentialValue(searchConfig, "grok"),
		path: "plugins.entries.xai.config.webSearch.apiKey",
		envVars: []
	});
}
function hasConfiguredXaiWebSearchCredentialRef(searchConfig) {
	return coerceSecretRef(getScopedCredentialValue(searchConfig, "grok")) !== null;
}
async function resolveXaiProviderAuthCredential(params) {
	params.signal?.throwIfAborted();
	try {
		const config = params.config;
		const resolved = await resolveApiKeyForProvider({
			provider: XAI_PROVIDER_ID,
			cfg: config,
			agentDir: params.agentDir,
			signal: params.signal,
			...params.profileId ? {
				profileId: params.profileId,
				lockedProfile: true
			} : {},
			...params.forceRefresh ? { forceRefresh: true } : {},
			...params.credentialPrecedence ? { credentialPrecedence: params.credentialPrecedence } : {}
		});
		params.signal?.throwIfAborted();
		const apiKey = typeof resolved.apiKey === "string" ? resolved.apiKey.trim() : "";
		if (!apiKey) return;
		return {
			apiKey,
			mode: resolved.mode,
			...resolved.profileId ? { profileId: resolved.profileId } : {}
		};
	} catch (error) {
		params.signal?.throwIfAborted();
		if (!isProviderAuthError(error)) throw error;
		return;
	}
}
async function resolveXaiProviderApiKeyProfileFallback(params) {
	params.signal?.throwIfAborted();
	const config = params.config;
	const usableProfiles = await listUsableProviderAuthProfileIdsAsync({
		agentDir: params.agentDir,
		cfg: config,
		provider: XAI_PROVIDER_ID,
		profileTypes: ["api_key", "token"]
	});
	if (!usableProfiles.agentDir || usableProfiles.profileIds.length === 0) return;
	for (const profileId of usableProfiles.profileIds) {
		const resolved = await resolveXaiProviderAuthCredential({
			agentDir: usableProfiles.agentDir,
			config: params.config,
			profileId,
			signal: params.signal
		}).catch(() => {
			params.signal?.throwIfAborted();
		});
		if (resolved?.apiKey && resolved.mode !== "oauth") return resolved;
	}
}
async function resolveXaiWebSearchAuth(ctx, searchConfig, options) {
	let providerAuth;
	try {
		providerAuth = await resolveXaiProviderAuthCredential({
			agentDir: ctx.agentDir,
			config: ctx.config,
			forceRefresh: options?.forceRefresh,
			profileId: options?.profileId,
			signal: ctx.signal
		});
	} catch (error) {
		ctx.signal?.throwIfAborted();
		const configured = resolveConfiguredXaiWebSearchCredential(searchConfig);
		if (configured) return {
			apiKey: configured,
			mode: "api-key"
		};
		throw error;
	}
	if (providerAuth?.mode === "oauth") return providerAuth;
	const configured = resolveConfiguredXaiWebSearchCredential(searchConfig);
	if (configured) return {
		apiKey: configured,
		mode: "api-key"
	};
	if (hasConfiguredXaiWebSearchCredentialRef(searchConfig)) return;
	return providerAuth;
}
async function resolveXaiWebSearchApiKeyFallback(ctx, searchConfig) {
	ctx.signal?.throwIfAborted();
	const configured = resolveConfiguredXaiWebSearchCredential(searchConfig);
	if (configured) return {
		apiKey: configured,
		mode: "api-key"
	};
	if (hasConfiguredXaiWebSearchCredentialRef(searchConfig)) return;
	const providerAuth = await resolveXaiProviderAuthCredential({
		agentDir: ctx.agentDir,
		config: ctx.config,
		credentialPrecedence: "env-first",
		signal: ctx.signal
	}).catch(() => {
		ctx.signal?.throwIfAborted();
	});
	if (providerAuth?.apiKey && providerAuth.mode !== "oauth") return providerAuth;
	return await resolveXaiProviderApiKeyProfileFallback({
		agentDir: ctx.agentDir,
		config: ctx.config,
		signal: ctx.signal
	});
}
function isXaiUnauthorizedError(error) {
	return error instanceof Error && error.message.includes("xAI API error (401)");
}
async function executeXaiWebSearchProviderTool(ctx, args, executionContext) {
	executionContext?.signal?.throwIfAborted();
	const searchConfig = resolveXaiToolSearchConfig(ctx);
	const timeoutSeconds = resolveTimeoutSeconds(searchConfig?.timeoutSeconds, XAI_WEB_SEARCH_DEFAULT_TIMEOUT_SECONDS);
	const { signal, cleanup } = buildTimeoutAbortSignal({
		timeoutMs: timeoutSeconds * 1e3,
		signal: executionContext?.signal,
		operation: "xAI web search"
	});
	const authContext = {
		...ctx,
		signal
	};
	try {
		const auth = await resolveXaiWebSearchAuth(authContext, searchConfig);
		signal?.throwIfAborted();
		if (!auth) return {
			error: "missing_xai_api_key",
			message: "web_search (grok) needs xAI credentials. Run `openclaw onboard --auth-choice xai-oauth` to sign in with Grok, run `openclaw onboard --auth-choice xai-api-key`, set `XAI_API_KEY` in the Gateway environment, or configure `plugins.entries.xai.config.webSearch.apiKey`. If you do not want to configure search credentials, use web_fetch for a specific URL or the browser tool for interactive pages.",
			docs: "https://docs.openclaw.ai/tools/web"
		};
		const query = readToolStringParam(args, "query", { required: true });
		readPositiveIntegerParam(args, "count", {
			max: 10,
			message: "count must be an integer from 1 to 10."
		});
		const grok = asNonArrayRecord(searchConfig?.grok);
		const request = {
			query,
			model: resolveNormalizedXaiToolModel({
				config: grok,
				defaultModel: XAI_DEFAULT_MODEL_ID
			}),
			endpoint: resolveXaiResponsesEndpoint(grok.baseUrl),
			timeoutSeconds,
			inlineCitations: grok.inlineCitations === true,
			cacheTtlMs: resolveCacheTtlMs(searchConfig?.cacheTtlMinutes, 15),
			signal
		};
		try {
			return await runXaiWebSearch({
				...request,
				apiKey: auth.apiKey
			});
		} catch (error) {
			signal?.throwIfAborted();
			if (!isXaiUnauthorizedError(error) || !auth.profileId) throw error;
			let authError = error;
			if (auth.mode === "oauth") {
				const refreshed = await resolveXaiWebSearchAuth(authContext, searchConfig, {
					forceRefresh: true,
					profileId: auth.profileId
				}).catch((refreshError) => {
					signal?.throwIfAborted();
					authError = refreshError;
				});
				if (refreshed?.apiKey && refreshed.apiKey !== auth.apiKey) return await runXaiWebSearch({
					...request,
					apiKey: refreshed.apiKey
				});
			}
			const fallback = await resolveXaiWebSearchApiKeyFallback(authContext, searchConfig);
			if (!fallback?.apiKey || fallback.apiKey === auth.apiKey) throw authError;
			return await runXaiWebSearch({
				...request,
				apiKey: fallback.apiKey
			});
		}
	} catch (error) {
		executionContext?.signal?.throwIfAborted();
		return wrapXaiWebSearchError(signal?.aborted ? signal.reason : error, timeoutSeconds);
	} finally {
		cleanup();
	}
}
//#endregion
export { executeXaiWebSearchProviderTool, runXaiSearchProviderSetup };
