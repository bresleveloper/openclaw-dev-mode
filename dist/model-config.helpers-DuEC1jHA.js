import { a as resolveAgentModelTimeoutMsValue, i as resolveAgentModelPrimaryValue, r as resolveAgentModelFallbackValues } from "./model-input-BHKiDwaq.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-mDjiWzE5.js";
import { A as overlayRuntimeExternalOAuthProfiles, P as evaluateStoredCredentialEligibility, i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore, w as resolveExternalCliAuthProfiles } from "./store-SfOB_T2S.js";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-B4FCIC1K.js";
import "./auth-profiles-DWHvUh-t.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-DX_pyqms.js";
import { n as listProfilesForProvider } from "./profile-list-CtT2BW_g.js";
import { i as resolveAuthProfileOrder } from "./order-DO7M8GzY.js";
import { _ as resolveConfiguredModelRef } from "./model-selection-shared-CKMggJal.js";
import "./model-selection-i8V2iTdL.js";
import { t as resolveEnvApiKey } from "./model-auth-env-W5zTaRQi.js";
import { c as hasRuntimeAvailableProviderAuth, m as resolveProviderEntryApiKeyProfileReference, u as hasUsableCustomProviderApiKey } from "./model-auth-Bvz14MtI.js";
//#region src/agents/tools/model-config.helpers.ts
/**
* Tool model config and auth helpers.
*
* Model-backed tools use this module to choose provider/model refs and check
* whether candidate providers have usable auth before exposing defaults.
*/
const OPENAI_PROVIDER_ID = "openai";
const CODEX_MEDIA_PROVIDER_ID = "codex";
const OPENAI_RESPONSES_MODEL_API = "openai-responses";
/** Returns whether a tool model config contains a primary or fallback model ref. */
function hasToolModelConfig(model) {
	return Boolean(model?.primary?.trim() || (model?.fallbacks ?? []).some((entry) => entry.trim().length > 0));
}
/** Resolves the configured default model ref, falling back to OpenClaw defaults. */
function resolveDefaultModelRef(cfg) {
	if (cfg) {
		const resolved = resolveConfiguredModelRef({
			cfg,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel: DEFAULT_MODEL
		});
		return {
			provider: resolved.provider,
			model: resolved.model
		};
	}
	return {
		provider: DEFAULT_PROVIDER,
		model: DEFAULT_MODEL
	};
}
/** Returns whether a provider has env, profile, or external CLI auth available. */
function hasAuthForProvider(params) {
	if (resolveEnvApiKey(params.provider)?.apiKey) return true;
	return hasAuthProfileForProvider({
		...params,
		includeExternalCli: true
	});
}
/** Returns whether an auth profile exists for a provider, optionally filtered by type. */
function hasAuthProfileForProvider(params) {
	let store = params.authStore;
	if (!store) {
		const agentDir = params.agentDir?.trim();
		if (!agentDir) return false;
		if (!hasAnyAuthProfileStoreSource(agentDir)) return false;
		store = params.includeExternalCli ? ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForProviderAuth({ provider: params.provider }) }) : ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
	}
	const profileIds = listProfilesForProvider(store, params.provider);
	if (!params.type) return profileIds.length > 0;
	return profileIds.some((profileId) => store.profiles[profileId]?.type === params.type);
}
/** Returns whether a provider can be used by a model-backed tool. */
function hasProviderAuthForTool(params) {
	if (hasAuthForProvider({
		provider: params.provider,
		agentDir: params.agentDir,
		authStore: params.authStore
	})) return true;
	return hasUsableCustomProviderApiKey(params.cfg, params.provider);
}
function formatProviderModelRef(provider, model) {
	return `${provider}/${model}`;
}
function loadAuthStoreForProvider(params) {
	if (params.authStore) return params.authStore;
	const agentDir = params.agentDir?.trim();
	if (!agentDir) return;
	return params.includeExternalCli ? ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
		provider: params.provider,
		cfg: params.cfg
	}) }) : ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
}
function overlayExternalCliAuthStoreForProvider(params) {
	const profiles = resolveExternalCliAuthProfiles(params.authStore, {
		allowKeychainPrompt: false,
		providerIds: [params.provider]
	});
	if (profiles.length === 0) return params.authStore;
	return overlayRuntimeExternalOAuthProfiles(params.authStore, profiles);
}
function hasAuthProfileTypeInStore(params) {
	const types = Array.isArray(params.type) ? params.type : [params.type];
	return resolveAuthProfileOrder({
		cfg: params.cfg,
		store: params.store,
		provider: params.provider
	}).some((profileId) => types.includes(params.store.profiles[profileId]?.type));
}
function hasAuthProfileTypeForProvider(params) {
	const store = loadAuthStoreForProvider(params);
	if (store && hasAuthProfileTypeInStore({
		...params,
		store
	})) return true;
	if (params.includeExternalCli && params.authStore) {
		const externalStore = overlayExternalCliAuthStoreForProvider({
			provider: params.provider,
			authStore: params.authStore
		});
		return hasAuthProfileTypeInStore({
			...params,
			store: externalStore
		});
	}
	return false;
}
/** Returns whether a provider has direct API-key-capable auth for model-backed tools. */
function hasDirectProviderApiKeyAuthForTool(params) {
	const providerEntryProfileAuth = resolveDirectProviderEntryAuthFromProfileReference(params);
	if (providerEntryProfileAuth !== void 0) return providerEntryProfileAuth;
	if (hasRuntimeAvailableProviderAuth({
		provider: params.provider,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		modelApi: params.modelApi,
		allowPluginSyntheticAuth: false
	})) return true;
	return hasAuthProfileTypeForProvider({
		provider: params.provider,
		cfg: params.cfg,
		agentDir: params.agentDir,
		authStore: params.authStore,
		type: "api_key"
	});
}
function hasCanonicalOpenAiCodexAuthSignal(params) {
	return hasAuthProfileTypeForProvider({
		provider: OPENAI_PROVIDER_ID,
		cfg: params.cfg,
		agentDir: params.agentDir,
		authStore: params.authStore,
		includeExternalCli: true,
		type: ["oauth", "token"]
	});
}
function resolveDirectProviderEntryAuthFromProfileReference(params) {
	const resolveFromStore = (store) => {
		const reference = resolveProviderEntryApiKeyProfileReference({
			cfg: params.cfg,
			provider: params.provider,
			store
		});
		if (reference.kind === "profile") return reference.credential.type === "api_key" && evaluateStoredCredentialEligibility({ credential: reference.credential }).eligible;
		if (reference.kind === "profile-incompatible") return false;
	};
	const store = loadAuthStoreForProvider({
		provider: params.provider,
		cfg: params.cfg,
		agentDir: params.agentDir,
		authStore: params.authStore,
		includeExternalCli: true
	});
	const storeResult = store ? resolveFromStore(store) : void 0;
	if (storeResult !== void 0) return storeResult;
	if (params.authStore) return resolveFromStore(overlayExternalCliAuthStoreForProvider({
		provider: params.provider,
		authStore: params.authStore
	}));
}
function hasCodexSyntheticMediaRoute(params) {
	return hasRuntimeAvailableProviderAuth({
		provider: CODEX_MEDIA_PROVIDER_ID,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir
	});
}
/** Resolves the implicit OpenAI image slot without letting OAuth-only auth pick direct OpenAI. */
function resolveOpenAiImageMediaCandidate(params) {
	const openAiModel = params.openAiModel.trim();
	if (!openAiModel) return { kind: "drop" };
	if (hasDirectProviderApiKeyAuthForTool({
		provider: OPENAI_PROVIDER_ID,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		authStore: params.authStore,
		modelApi: OPENAI_RESPONSES_MODEL_API
	})) return {
		kind: "keep",
		ref: formatProviderModelRef(OPENAI_PROVIDER_ID, openAiModel)
	};
	const codexModel = params.codexModel?.trim();
	if (codexModel && hasCanonicalOpenAiCodexAuthSignal(params) && hasCodexSyntheticMediaRoute(params)) return {
		kind: "substitute",
		provider: CODEX_MEDIA_PROVIDER_ID,
		ref: formatProviderModelRef(CODEX_MEDIA_PROVIDER_ID, codexModel)
	};
	return { kind: "drop" };
}
/** Normalizes agent tool model config into a compact runtime shape. */
function coerceToolModelConfig(model) {
	const primary = resolveAgentModelPrimaryValue(model);
	const fallbacks = resolveAgentModelFallbackValues(model);
	const timeoutMs = resolveAgentModelTimeoutMsValue(model);
	return {
		...primary?.trim() ? { primary: primary.trim() } : {},
		...fallbacks.length > 0 ? { fallbacks } : {},
		...timeoutMs !== void 0 ? { timeoutMs } : {}
	};
}
/** Builds a tool model config from configured auth-aware candidate model refs. */
function buildToolModelConfigFromCandidates(params) {
	if (hasToolModelConfig(params.explicit)) return params.explicit;
	const deduped = [];
	for (const candidate of params.candidates) {
		const trimmed = candidate?.trim();
		if (!trimmed || !trimmed.includes("/")) continue;
		const provider = trimmed.slice(0, trimmed.indexOf("/")).trim();
		const providerConfigured = params.isProviderConfigured?.(provider) ?? hasProviderAuthForTool({
			provider,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			authStore: params.authStore
		});
		if (!provider || !providerConfigured) continue;
		if (!deduped.includes(trimmed)) deduped.push(trimmed);
	}
	if (deduped.length === 0) return null;
	return {
		primary: deduped[0],
		...deduped.length > 1 ? { fallbacks: deduped.slice(1) } : {},
		...params.explicit.timeoutMs !== void 0 ? { timeoutMs: params.explicit.timeoutMs } : {}
	};
}
//#endregion
export { hasProviderAuthForTool as a, resolveOpenAiImageMediaCandidate as c, hasAuthProfileForProvider as i, coerceToolModelConfig as n, hasToolModelConfig as o, hasAuthForProvider as r, resolveDefaultModelRef as s, buildToolModelConfigFromCandidates as t };
