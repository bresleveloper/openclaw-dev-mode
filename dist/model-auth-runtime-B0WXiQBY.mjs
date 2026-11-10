import { h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { s as resolveProviderAuthLookupMaps } from "./provider-env-vars-D43Pu6eG.mjs";
import { a as isAuthModeAllowedForModel } from "./model-runtime-policy-DSkspt0X.mjs";
import "./config-B3oiWDlr.mjs";
import { l as isSecretRefHeaderValueMarker, n as CUSTOM_LOCAL_AUTH_MARKER, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { c as mintSecretSentinel } from "./sentinel-DZP_CK2t.mjs";
import { p as resolveManagedSecretRefRuntimeProviderAuth } from "./loader-runtime-load-DzFljQbT.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CPdn6zH8.mjs";
import { b as resolveUsableCustomProviderApiKey, h as resolveProviderAuthOverride, i as hasSyntheticLocalProviderAuthConfig, m as resolveInlineProviderApiKeyCooldownUntil, o as isConfigBackedInlineProviderApiKey, r as hasSecretRefProviderApiKey, s as isManagedSecretRefApiKeyMarker } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { C as resolveProviderSyntheticAuthWithPlugin, g as prepareProviderSyntheticAuthWithPlugin } from "./provider-runtime-DZ8luukj.mjs";
import { r as resolveRuntimeSyntheticAuthProviderRefState } from "./synthetic-auth.runtime.js";
//#region src/agents/model-auth-runtime.ts
function createRuntimeProviderAuthLookup(params) {
	const env = params.env ?? process.env;
	const lookupParams = {
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env
	};
	const syntheticAuthProviderRefs = params.includePluginSyntheticAuth === false ? void 0 : resolveRuntimeSyntheticAuthProviderRefState(lookupParams);
	const authLookupMaps = resolveProviderAuthLookupMaps(lookupParams);
	return {
		envApiKey: {
			aliasMap: authLookupMaps.aliasMap,
			candidateMap: authLookupMaps.envCandidateMap,
			authEvidenceMap: authLookupMaps.authEvidenceMap,
			skipSetupProviderFallback: true
		},
		setupProviderFallbackRefs: authLookupMaps.setupProviderFallbackRefs,
		syntheticAuthProviderRefs: syntheticAuthProviderRefs?.complete ? syntheticAuthProviderRefs.refs : void 0
	};
}
function runtimeLookupAllowsSetupProviderFallback(params) {
	const refs = params.runtimeLookup?.setupProviderFallbackRefs;
	if (!refs?.length) return false;
	const normalizedProvider = normalizeProviderId(params.provider);
	const aliasTarget = params.runtimeLookup?.envApiKey.aliasMap?.[normalizedProvider];
	return refs.includes(normalizedProvider) || (aliasTarget ? refs.includes(aliasTarget) : false);
}
function resolveRuntimeEnvApiKeyLookupOptions(params) {
	const envApiKey = params.runtimeLookup?.envApiKey;
	if (!envApiKey) return;
	const skipSetupProviderFallback = envApiKey.skipSetupProviderFallback === true ? !runtimeLookupAllowsSetupProviderFallback(params) : envApiKey.skipSetupProviderFallback;
	return {
		...envApiKey,
		...skipSetupProviderFallback !== void 0 ? { skipSetupProviderFallback } : {}
	};
}
function listProviderSyntheticAuthRefs(params) {
	const refs = [params.provider];
	const providerConfig = resolveMergedModelProviderConfig(params.cfg, params.provider);
	if (params.modelApi) refs.push(params.modelApi);
	if (providerConfig?.api) refs.push(providerConfig.api);
	return normalizeUniqueStringEntries(refs.map((ref) => normalizeProviderId(ref)));
}
function shouldResolvePluginSyntheticAuth(params) {
	const syntheticAuthProviderRefs = params.runtimeLookup?.syntheticAuthProviderRefs;
	if (!syntheticAuthProviderRefs) return true;
	const eligibleRefs = new Set(normalizeUniqueStringEntries(syntheticAuthProviderRefs.map((ref) => normalizeProviderId(ref))));
	if (eligibleRefs.size === 0) return false;
	return listProviderSyntheticAuthRefs(params).some((ref) => eligibleRefs.has(ref));
}
function resolveRuntimeAvailableProviderAuth(params, resolveSyntheticAuth) {
	const provider = normalizeProviderId(params.provider);
	if (resolveProviderAuthOverride(params.cfg, provider) === "aws-sdk") return true;
	const unusableUntil = params.store ? resolveInlineProviderApiKeyCooldownUntil(params.store, provider) : null;
	const inlineProviderApiKeyUsable = unusableUntil === null || unusableUntil <= Date.now();
	const isUsableSource = (source) => !isConfigBackedInlineProviderApiKey({
		cfg: params.cfg,
		provider,
		source,
		store: params.store
	}) || inlineProviderApiKeyUsable;
	const envAuth = resolveEnvApiKey(provider, params.env, {
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		...resolveRuntimeEnvApiKeyLookupOptions({
			provider,
			runtimeLookup: params.runtimeLookup
		})
	});
	if (envAuth && isAuthModeAllowedForModel({
		provider,
		modelApi: params.modelApi,
		capability: params.capability,
		mode: envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
	}) && isUsableSource(envAuth.source)) return true;
	if (resolveUsableCustomProviderApiKey({
		cfg: params.cfg,
		provider,
		env: params.env
	}) && inlineProviderApiKeyUsable && (!params.capability || isAuthModeAllowedForModel({
		provider,
		capability: params.capability,
		mode: "api-key"
	}))) return true;
	const managedRuntimeAuth = resolveManagedSecretRefRuntimeProviderAuth({
		cfg: params.cfg,
		provider
	});
	if (managedRuntimeAuth && (!params.capability || isAuthModeAllowedForModel({
		provider,
		capability: params.capability,
		mode: managedRuntimeAuth.mode,
		authFlow: managedRuntimeAuth.authFlow
	})) && isUsableSource(managedRuntimeAuth.source)) return true;
	if (hasSyntheticLocalProviderAuthConfig({
		cfg: params.cfg,
		provider
	})) return true;
	if (params.allowPluginSyntheticAuth !== false && shouldResolvePluginSyntheticAuth({
		cfg: params.cfg,
		provider,
		runtimeLookup: params.runtimeLookup
	})) return resolveSyntheticAuth(provider);
	return false;
}
function hasRuntimeAvailableProviderAuth(params) {
	return resolveRuntimeAvailableProviderAuth(params, (provider) => Boolean(resolveSyntheticLocalProviderAuth({
		cfg: params.cfg,
		provider,
		workspaceDir: params.workspaceDir,
		env: params.env
	})));
}
/** Prepare external auth only after immediate credentials and discovery scope permit it. */
async function prepareRuntimeAvailableProviderAuth(params) {
	params.signal?.throwIfAborted();
	return resolveRuntimeAvailableProviderAuth(params, async (provider) => Boolean(await prepareSyntheticLocalProviderAuth({
		...params,
		cfg: params.cfg,
		provider
	})));
}
function syntheticAuthLookup(params, config) {
	return {
		provider: params.provider,
		config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		modelApi: params.modelApi,
		context: {
			config,
			provider: params.provider,
			providerConfig: resolveMergedModelProviderConfig(config, params.provider)
		}
	};
}
/** A managed process owns auth only when its provider supplies a non-secret credential. */
function resolveManagedLocalProviderAuth(params, resolveFromConfig = (config) => resolveProviderSyntheticAuthWithPlugin(syntheticAuthLookup(params, config))) {
	if (!resolveMergedModelProviderConfig(params.cfg, params.provider)?.localService) return;
	const auth = resolveFromConfig(params.cfg);
	return auth?.mode === "api-key" && !auth.nativeAuth && isNonSecretApiKeyMarker(auth.apiKey, { includeEnvVarName: false }) && !isSecretRefHeaderValueMarker(auth.apiKey) ? auth : void 0;
}
function resolveProviderSyntheticRuntimeAuth(params, resolveFromConfig = (config) => resolveProviderSyntheticAuthWithPlugin(syntheticAuthLookup(params, config))) {
	const managedLocalAuth = resolveManagedLocalProviderAuth(params, resolveFromConfig);
	if (managedLocalAuth) return { auth: managedLocalAuth };
	const runtimeAuth = resolveManagedSecretRefRuntimeProviderAuth(params);
	if (runtimeAuth) return { auth: runtimeAuth };
	if (hasSecretRefProviderApiKey(params.cfg, params.provider)) return { blockedOnManagedSecretRef: true };
	const directAuth = resolveFromConfig(params.cfg);
	if (!directAuth) return {};
	if (!isManagedSecretRefApiKeyMarker(directAuth.apiKey)) return { auth: directAuth };
	const runtimeConfig = getRuntimeConfigSnapshot();
	if (!runtimeConfig || runtimeConfig === params.cfg) return { blockedOnManagedSecretRef: true };
	const runtimePluginAuth = resolveFromConfig(runtimeConfig);
	const runtimeApiKey = runtimePluginAuth?.apiKey;
	if (!runtimePluginAuth || !runtimeApiKey || isNonSecretApiKeyMarker(runtimeApiKey)) return { blockedOnManagedSecretRef: true };
	return { auth: {
		...runtimePluginAuth,
		apiKey: params.secretSentinels ? mintSecretSentinel(runtimeApiKey, { label: `model-auth:${params.provider}` }) : runtimeApiKey
	} };
}
/** Prepare native readiness without widening explicit managed-credential authority. */
async function prepareSyntheticLocalProviderAuth(params) {
	if (params.allowPluginSyntheticAuth === false || hasSecretRefProviderApiKey(params.cfg, params.provider)) return resolveSyntheticLocalProviderAuth(params);
	const prepare = (config) => prepareProviderSyntheticAuthWithPlugin({
		...syntheticAuthLookup(params, config),
		signal: params.signal
	});
	const direct = await prepare(params.cfg);
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeAuth = direct && isManagedSecretRefApiKeyMarker(direct.apiKey) && runtimeConfig && runtimeConfig !== params.cfg ? await prepare(runtimeConfig) : void 0;
	return resolveSyntheticLocalProviderAuth(params, (config) => config === params.cfg ? direct : config === runtimeConfig ? runtimeAuth : void 0);
}
function resolveSyntheticLocalProviderAuth(params, resolveFromConfig) {
	const syntheticProviderAuth = params.allowPluginSyntheticAuth === false ? {} : resolveProviderSyntheticRuntimeAuth(params, resolveFromConfig);
	if (syntheticProviderAuth.auth) return syntheticProviderAuth.auth;
	if (syntheticProviderAuth.blockedOnManagedSecretRef) return null;
	if (hasSyntheticLocalProviderAuthConfig(params)) return {
		apiKey: CUSTOM_LOCAL_AUTH_MARKER,
		source: `models.providers.${params.provider} (synthetic local key)`,
		mode: "api-key"
	};
	return null;
}
//#endregion
export { resolveManagedLocalProviderAuth as a, prepareSyntheticLocalProviderAuth as i, hasRuntimeAvailableProviderAuth as n, prepareRuntimeAvailableProviderAuth as r, createRuntimeProviderAuthLookup as t };
