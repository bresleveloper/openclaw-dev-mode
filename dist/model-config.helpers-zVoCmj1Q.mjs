import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { c as resolveAgentModelTimeoutMsValue, o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { h as resolveConfiguredModelRef } from "./model-selection-shared-0uvJbX1M.mjs";
import { n as evaluateStoredCredentialEligibility } from "./credential-state-CWZ_V0ds.mjs";
import { c as overlayRuntimeExternalOAuthProfiles } from "./oauth-shared-CVbJLd-k.mjs";
import { D as resolveExternalCliAuthProfiles } from "./store-CTvq6MSF.mjs";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-BkR4BMBU.mjs";
import { j as resolveProviderEntryApiKeyProfileReference } from "./loader-runtime-load-DitY2Htf.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BbOBKQM3.mjs";
import { a as resolveAuthProfileOrder, p as listProfilesForProvider } from "./order-BQhYF772.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import { a as hasRuntimeAvailableProviderAuth } from "./model-auth-provider-BSynTdAu.mjs";
import "./model-auth-D3hh0-wa.mjs";
import "./model-selection-CFnUi6iD.mjs";
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
function applyAgentDefaultModelConfig(cfg, key, modelConfig) {
	if (!cfg) return;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				...key === "imageModel" ? { imageModel: modelConfig } : { mediaModels: {
					...cfg.agents?.defaults?.mediaModels,
					[key]: modelConfig
				} }
			}
		}
	};
}
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
	if (!params.runtimeLookup && resolveEnvApiKey(params.provider, void 0, {
		config: params.cfg,
		workspaceDir: params.workspaceDir
	})?.apiKey) return true;
	return hasAuthProfileForProvider({
		provider: params.provider,
		agentDir: params.agentDir,
		authStore: params.authStore,
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
	if (hasRuntimeAvailableProviderAuth({
		provider: params.provider,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		allowPluginSyntheticAuth: false,
		runtimeLookup: params.runtimeLookup,
		store: loadAuthStoreForProvider({
			provider: params.provider,
			cfg: params.cfg,
			agentDir: params.agentDir,
			authStore: params.authStore
		})
	})) return true;
	return hasAuthForProvider({
		provider: params.provider,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		authStore: params.authStore,
		runtimeLookup: params.runtimeLookup
	});
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
		allowPluginSyntheticAuth: false,
		store: loadAuthStoreForProvider({
			provider: params.provider,
			cfg: params.cfg,
			agentDir: params.agentDir,
			authStore: params.authStore
		})
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
	if (!hasCanonicalOpenAiCodexAuthSignal(params)) return { kind: "drop" };
	const codexModel = params.resolveCodexMediaRoute?.()?.model.trim();
	if (codexModel) return {
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
export { hasAuthProfileForProvider as a, resolveDefaultModelRef as c, hasAuthForProvider as i, resolveOpenAiImageMediaCandidate as l, buildToolModelConfigFromCandidates as n, hasProviderAuthForTool as o, coerceToolModelConfig as r, hasToolModelConfig as s, applyAgentDefaultModelConfig as t };
