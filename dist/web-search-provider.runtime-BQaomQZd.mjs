import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BOG6Do5a.mjs";
import { B as isProviderAuthError } from "./loader-runtime-load-DitY2Htf.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam } from "./common-XfKigJno.mjs";
import { r as listUsableProviderAuthProfileIds } from "./provider-auth-availability-DlkWkL2p.mjs";
import { c as resolveTimeoutSeconds, i as readCache, l as writeCache, o as resolveCacheTtlMs, r as normalizeCacheKey } from "./web-shared-7z6bteLg.mjs";
import "./extension-shared-N0S3ppSB.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-BveQzsWa.mjs";
import "./provider-auth-C_UP8nFt.mjs";
import { i as resolveProviderWebSearchPluginConfig, r as mergeScopedSearchConfig, t as getScopedCredentialValue } from "./web-search-provider-config-CW8dwkHd.mjs";
import { t as resolveWebSearchProviderCredential } from "./provider-web-search-CRDOBhl4.mjs";
import { n as setPluginXSearchConfigValue, t as resolveEffectiveXSearchConfig } from "./x-search-config-Dj2uABTe.mjs";
import { c as buildXaiWebSearchPayload, d as resolveXaiWebSearchEndpoint, f as resolveXaiWebSearchModel, l as requestXaiWebSearch, p as wrapXaiWebSearchError, t as XAI_DEFAULT_X_SEARCH_MODEL, u as resolveXaiInlineCitations } from "./x-search-shared-iiIPeHwF.mjs";
//#region extensions/xai/src/web-search-provider.runtime.ts
const XAI_WEB_SEARCH_CACHE = /* @__PURE__ */ new Map();
const XAI_WEB_SEARCH_DEFAULT_TIMEOUT_SECONDS = 60;
const XAI_PROVIDER_ID = "xai";
const X_SEARCH_MODEL_OPTIONS = [{
	value: XAI_DEFAULT_X_SEARCH_MODEL,
	label: XAI_DEFAULT_X_SEARCH_MODEL,
	hint: "default · reasoning disabled"
}];
function resolveXSearchConfigRecord(config) {
	return resolveEffectiveXSearchConfig(config);
}
async function runXaiSearchProviderSetup(ctx) {
	const existingXSearch = resolveXSearchConfigRecord(ctx.config);
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
function runXaiWebSearch(params) {
	params.signal?.throwIfAborted();
	const cacheKey = normalizeCacheKey(`grok:${params.endpoint}:${params.model}:${String(params.inlineCitations)}:${params.query}`);
	const cached = readCache(XAI_WEB_SEARCH_CACHE, cacheKey, params.cacheTtlMs);
	if (cached) return Promise.resolve({
		...cached.value,
		cached: true
	});
	return (async () => {
		const startedAt = Date.now();
		const result = await requestXaiWebSearch({
			query: params.query,
			model: params.model,
			apiKey: params.apiKey,
			endpoint: params.endpoint,
			timeoutSeconds: params.timeoutSeconds,
			inlineCitations: params.inlineCitations,
			...params.signal ? { signal: params.signal } : {}
		});
		params.signal?.throwIfAborted();
		const payload = buildXaiWebSearchPayload({
			query: params.query,
			provider: "grok",
			model: params.model,
			tookMs: Date.now() - startedAt,
			content: result.content,
			citations: result.citations,
			inlineCitations: result.inlineCitations,
			truncated: result.truncated
		});
		writeCache(XAI_WEB_SEARCH_CACHE, cacheKey, payload, params.cacheTtlMs);
		return payload;
	})();
}
function resolveXaiToolSearchConfig(ctx) {
	return mergeScopedSearchConfig(ctx.searchConfig, "grok", resolveProviderWebSearchPluginConfig(ctx.config, "xai"));
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
	const usableProfiles = listUsableProviderAuthProfileIds({
		agentDir: params.agentDir,
		cfg: config,
		provider: XAI_PROVIDER_ID
	});
	if (!usableProfiles.agentDir || usableProfiles.profileIds.length === 0) return;
	const store = ensureAuthProfileStore(usableProfiles.agentDir, { allowKeychainPrompt: false });
	for (const profileId of usableProfiles.profileIds) {
		const profile = store.profiles[profileId];
		if (!profile || profile.provider !== XAI_PROVIDER_ID || profile.type === "oauth") continue;
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
function resolveXaiWebSearchTimeoutSeconds(searchConfig) {
	return resolveTimeoutSeconds(searchConfig?.timeoutSeconds, XAI_WEB_SEARCH_DEFAULT_TIMEOUT_SECONDS);
}
async function executeXaiWebSearchProviderTool(ctx, args, executionContext) {
	executionContext?.signal?.throwIfAborted();
	const searchConfig = resolveXaiToolSearchConfig(ctx);
	const timeoutSeconds = resolveXaiWebSearchTimeoutSeconds(searchConfig);
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
		const request = {
			query,
			model: resolveXaiWebSearchModel(searchConfig),
			endpoint: resolveXaiWebSearchEndpoint(searchConfig),
			timeoutSeconds,
			inlineCitations: resolveXaiInlineCitations(searchConfig),
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
