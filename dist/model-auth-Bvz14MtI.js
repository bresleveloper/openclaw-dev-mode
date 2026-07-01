import { a as normalizeLowercaseStringOrEmpty, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import { s as coerceSecretRef } from "./types.secrets-lIZQEgMF.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-BWYV5Pqz.js";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import { n as getShellEnvAppliedKeys } from "./shell-env-DU1VTcPn.js";
import { _ as selectApplicableRuntimeConfig, i as getRuntimeConfigSnapshot, s as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-D93_HOsR.js";
import "./config-A41fTHlt.js";
import { u as resolveAuthStorePathForDisplay } from "./runtime-snapshots-BrKHRFr0.js";
import { n as ensureAuthProfileStore, z as readCodexCliCredentialsCached } from "./store-SfOB_T2S.js";
import { f as resolveOwningPluginIdsForProviderRef } from "./providers-B4CBCfED.js";
import { A as resolveProviderSyntheticAuthWithPlugin, B as shouldDeferProviderSyntheticProfileAuthWithPlugin, o as buildProviderMissingAuthMessageWithPlugin } from "./provider-runtime-D4NEMgBr.js";
import "./auth-profiles-DWHvUh-t.js";
import { n as resolveApiKeyForProfile } from "./oauth-De-NOeYf.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-DX_pyqms.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-JuG5HlWn.js";
import { n as listProfilesForProvider } from "./profile-list-CtT2BW_g.js";
import { i as resolveAuthProfileOrder, n as isStoredCredentialCompatibleWithAuthProvider, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-DO7M8GzY.js";
import { o as normalizeProviderId } from "./model-selection-normalize-Df7baLev.js";
import { a as NON_ENV_SECRETREF_MARKER, b as resolveProviderEnvAuthLookupMaps, d as isNonSecretApiKeyMarker, n as CUSTOM_LOCAL_AUTH_MARKER, u as isKnownEnvApiKeyMarker } from "./model-auth-markers-C4s6SbvA.js";
import "./model-selection-i8V2iTdL.js";
import { t as resolveEnvApiKey } from "./model-auth-env-W5zTaRQi.js";
import { n as ProviderAuthError } from "./model-auth-runtime-shared-D8fFlbsz.js";
import { n as resolveRuntimeSyntheticAuthProviderRefState } from "./synthetic-auth.runtime.js";
import path from "node:path";
//#region src/agents/model-auth.ts
/**
* Resolves model-provider credentials from config, env, auth profiles, and
* provider synthetic auth hooks. This module is the shared auth boundary for
* runtime dispatch, setup checks, and model metadata reporting.
*/
const log = createSubsystemLogger("model-auth");
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function directOpenAIPlatformModelRequiresApiKey(params) {
	return normalizeProviderId(params.provider) === OPENAI_PROVIDER_ID && params.modelApi !== void 0 && normalizeLowercaseStringOrEmpty(params.modelApi) !== OPENAI_CODEX_RESPONSES_API;
}
function isAuthModeAllowedForModel(params) {
	return !directOpenAIPlatformModelRequiresApiKey(params) || params.mode === "api-key";
}
function assertAuthModeAllowedForModel(params) {
	if (isAuthModeAllowedForModel(params)) return;
	throw new Error(`Auth profile "${params.profileId}" uses ${params.mode} auth, but ${params.provider}/${params.modelApi} requires an OpenAI API key profile.`);
}
function resolveConfigAwareEnvApiKey(cfg, provider, workspaceDir) {
	return resolveEnvApiKey(provider, process.env, {
		config: cfg,
		workspaceDir
	});
}
function resolveProviderConfig(cfg, provider) {
	const providers = cfg?.models?.providers ?? {};
	const direct = providers[provider];
	if (direct) return direct;
	const normalized = normalizeProviderId(provider);
	if (normalized === provider) return Object.entries(providers).find(([key]) => normalizeProviderId(key) === normalized)?.[1];
	return providers[normalized] ?? Object.entries(providers).find(([key]) => normalizeProviderId(key) === normalized)?.[1];
}
/** Builds stable env/synthetic auth lookup data for repeated provider checks. */
function createRuntimeProviderAuthLookup(params) {
	const env = params.env ?? process.env;
	const lookupParams = {
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env
	};
	const syntheticAuthProviderRefs = params.includePluginSyntheticAuth === false ? void 0 : resolveRuntimeSyntheticAuthProviderRefState(lookupParams);
	const authLookupMaps = resolveProviderEnvAuthLookupMaps(lookupParams);
	return {
		envApiKey: {
			aliasMap: authLookupMaps.aliasMap,
			candidateMap: authLookupMaps.envCandidateMap,
			authEvidenceMap: authLookupMaps.authEvidenceMap,
			skipSetupProviderFallback: true
		},
		setupProviderFallbackRefs: authLookupMaps.setupProviderFallbackRefs,
		syntheticAuthProviderRefs: syntheticAuthProviderRefs?.complete ? syntheticAuthProviderRefs.refs : void 0,
		syntheticAuthProviderRefsComplete: syntheticAuthProviderRefs?.complete
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
/** Reads a literal or env-secret marker for a custom provider entry. */
function getCustomProviderApiKey(cfg, provider) {
	const entry = resolveProviderConfig(cfg, provider);
	const literal = normalizeOptionalSecretInput(entry?.apiKey);
	if (literal) return literal;
	const ref = coerceSecretRef(entry?.apiKey);
	if (!ref) return;
	if (ref.source === "env") return ref.id.trim() || "secretref-managed";
	return NON_ENV_SECRETREF_MARKER;
}
function canResolveEnvSecretRefInReadOnlyPath(params) {
	const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
	if (!providerConfig) return params.provider === resolveDefaultSecretProviderAlias(params.cfg ?? {}, "env");
	if (providerConfig.source !== "env") return false;
	const allowlist = providerConfig.allowlist;
	return !allowlist || allowlist.includes(params.id);
}
/** Resolves custom provider API keys that are usable without mutating secret stores. */
function resolveUsableCustomProviderApiKey(params) {
	const customProviderConfig = resolveProviderConfig(params.cfg, params.provider);
	const apiKeyRef = coerceSecretRef(customProviderConfig?.apiKey);
	if (apiKeyRef) {
		if (apiKeyRef.source !== "env") return null;
		const envVarName = apiKeyRef.id.trim();
		if (!envVarName) return null;
		if (!canResolveEnvSecretRefInReadOnlyPath({
			cfg: params.cfg,
			provider: apiKeyRef.provider,
			id: envVarName
		})) return null;
		const envValue = normalizeOptionalSecretInput((params.env ?? process.env)[envVarName]);
		if (!envValue) return null;
		return {
			apiKey: envValue,
			source: resolveEnvSourceLabel({
				applied: new Set(getShellEnvAppliedKeys()),
				envVars: [envVarName],
				label: `${envVarName} (models.json secretref)`
			})
		};
	}
	const customKey = getCustomProviderApiKey(params.cfg, params.provider);
	if (!customKey) return null;
	if (!isNonSecretApiKeyMarker(customKey)) return {
		apiKey: customKey,
		source: "models.json"
	};
	if (isKnownEnvApiKeyMarker(customKey)) {
		const envValue = normalizeOptionalSecretInput((params.env ?? process.env)[customKey]);
		if (!envValue) return null;
		return {
			apiKey: envValue,
			source: resolveEnvSourceLabel({
				applied: new Set(getShellEnvAppliedKeys()),
				envVars: [customKey],
				label: `${customKey} (models.json marker)`
			})
		};
	}
	if (customProviderConfig && isCustomLocalProviderConfig(customProviderConfig) && (customProviderConfig.api === "openai-completions" || customProviderConfig.api === "ollama") && customProviderConfig.baseUrl && isLocalBaseUrl(customProviderConfig.baseUrl)) return {
		apiKey: customProviderConfig.api === "ollama" ? customKey : CUSTOM_LOCAL_AUTH_MARKER,
		source: "models.json (local marker)"
	};
	return null;
}
/** True when a custom provider has a literal/env/local key available now. */
function hasUsableCustomProviderApiKey(cfg, provider, env) {
	return Boolean(resolveUsableCustomProviderApiKey({
		cfg,
		provider,
		env
	}));
}
/** True when explicit provider config should outrank profile/environment auth. */
function shouldPreferExplicitConfigApiKeyAuth(cfg, provider) {
	const providerConfig = resolveProviderConfig(cfg, provider);
	return resolveProviderAuthOverride(cfg, provider) === "api-key" && providerConfig !== void 0 && hasExplicitProviderApiKeyConfig(providerConfig);
}
function resolveProviderAuthOverride(cfg, provider) {
	const auth = resolveProviderConfig(cfg, provider)?.auth;
	if (auth === "api-key" || auth === "aws-sdk" || auth === "oauth" || auth === "token") return auth;
}
function shouldUseImplicitAwsSdkAuth(params) {
	if (params.modelApi !== "bedrock-converse-stream") return false;
	if (normalizeProviderId(params.provider) !== "amazon-bedrock") return false;
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	return resolveProviderAuthOverride(params.cfg, params.provider) === void 0 && (providerConfig === void 0 || !hasExplicitProviderApiKeyConfig(providerConfig));
}
function profileTypeToAuthMode(type) {
	return type === "oauth" ? "oauth" : type === "token" ? "token" : "api-key";
}
function normalizeProviderEntryBaseUrlForBinding(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		parsed.hash = "";
		parsed.search = "";
		parsed.pathname = parsed.pathname.replace(/\/+$/, "");
		return parsed.toString().replace(/\/+$/, "");
	} catch {
		return trimmed.toLowerCase().replace(/\/+$/, "");
	}
}
function providerEntriesShareBaseUrl(params) {
	const providerBaseUrl = normalizeProviderEntryBaseUrlForBinding(resolveProviderConfig(params.cfg, params.provider)?.baseUrl);
	const credentialProviderBaseUrl = normalizeProviderEntryBaseUrlForBinding(resolveProviderConfig(params.cfg, params.credentialProvider)?.baseUrl);
	return Boolean(providerBaseUrl && credentialProviderBaseUrl && providerBaseUrl === credentialProviderBaseUrl);
}
function isBearerProfileCredential(credential) {
	return credential.type === "api_key" || credential.type === "token";
}
/** True when a bearer auth profile can safely satisfy a provider-entry apiKey reference. */
function canUseProfileAsProviderEntryApiKey(params) {
	if (!isBearerProfileCredential(params.credential)) return false;
	if (isStoredCredentialCompatibleWithAuthProvider({
		cfg: params.cfg,
		provider: params.provider,
		credential: params.credential
	})) return true;
	return providerEntriesShareBaseUrl({
		cfg: params.cfg,
		provider: params.provider,
		credentialProvider: params.credential.provider
	});
}
/** Classifies a provider entry apiKey as literal/profile/marker before resolving secrets. */
function resolveProviderEntryApiKeyProfileReference(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	if (coerceSecretRef(providerConfig?.apiKey)) return { kind: "none" };
	const perEntryRawKey = normalizeOptionalSecretInput(providerConfig?.apiKey);
	if (!perEntryRawKey) return { kind: "none" };
	if (isNonSecretApiKeyMarker(perEntryRawKey)) return { kind: "marker" };
	const credential = params.store.profiles[perEntryRawKey];
	if (!credential) return {
		kind: "literal",
		apiKey: perEntryRawKey,
		source: "models.json"
	};
	if (!isBearerProfileCredential(credential)) return {
		kind: "profile-incompatible",
		profileId: perEntryRawKey,
		credentialProvider: credential.provider,
		credentialType: credential.type,
		reason: "credential-class"
	};
	if (!canUseProfileAsProviderEntryApiKey({
		cfg: params.cfg,
		provider: params.provider,
		credential
	})) return {
		kind: "profile-incompatible",
		profileId: perEntryRawKey,
		credentialProvider: credential.provider,
		credentialType: credential.type,
		reason: "provider-binding"
	};
	return {
		kind: "profile",
		profileId: perEntryRawKey,
		credential,
		mode: profileTypeToAuthMode(credential.type)
	};
}
/** Resolves a provider-entry apiKey profile reference into runtime auth when possible. */
async function resolveProviderEntryApiKeyBinding(params) {
	const reference = resolveProviderEntryApiKeyProfileReference(params);
	if (reference.kind === "none" || reference.kind === "marker") return { kind: "none" };
	if (reference.kind === "literal") return reference;
	if (reference.kind === "profile-incompatible") return reference;
	try {
		const resolved = await resolveApiKeyForProfile({
			cfg: params.cfg,
			store: params.store,
			profileId: reference.profileId,
			agentDir: params.agentDir
		});
		if (!resolved) return {
			kind: "profile-unresolved",
			profileId: reference.profileId
		};
		const resolvedProfileId = resolved.profileId ?? reference.profileId;
		return {
			kind: "profile-resolved",
			auth: {
				apiKey: resolved.apiKey,
				profileId: resolvedProfileId,
				source: `profile:${resolvedProfileId}`,
				mode: resolved.profileType ? profileTypeToAuthMode(resolved.profileType) : reference.mode
			}
		};
	} catch (err) {
		return {
			kind: "profile-unresolved",
			profileId: reference.profileId,
			error: err
		};
	}
}
function resolveConfiguredAwsSdkProfileAuth(params) {
	if (!isConfiguredAwsSdkAuthProfileForProvider(params)) return null;
	return {
		...resolveAwsSdkAuthInfo(),
		profileId: params.profileId,
		source: `profile:${params.profileId}`
	};
}
function isLocalBaseUrl(baseUrl) {
	try {
		let host = normalizeLowercaseStringOrEmpty(new URL(baseUrl).hostname);
		if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
		return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host === "::1" || host === "::ffff:7f00:1" || host === "::ffff:127.0.0.1" || host === "docker.orb.internal" || host === "host.docker.internal" || host === "host.orb.internal" || host.endsWith(".local") || isPrivateIpv4Host(host);
	} catch {
		return false;
	}
}
function isPrivateIpv4Host(host) {
	if (!/^\d+\.\d+\.\d+\.\d+$/.test(host)) return false;
	const octets = host.split(".").map((part) => Number.parseInt(part, 10));
	if (octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
	const [a, b] = octets;
	return a === 10 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168;
}
function hasExplicitProviderApiKeyConfig(providerConfig) {
	return normalizeOptionalSecretInput(providerConfig.apiKey) !== void 0 || coerceSecretRef(providerConfig.apiKey) !== null;
}
function isCustomLocalProviderConfig(providerConfig) {
	return typeof providerConfig.baseUrl === "string" && providerConfig.baseUrl.trim().length > 0 && typeof providerConfig.api === "string" && providerConfig.api.trim().length > 0 && Array.isArray(providerConfig.models) && providerConfig.models.length > 0;
}
function isManagedSecretRefApiKeyMarker(apiKey) {
	return apiKey?.trim() === NON_ENV_SECRETREF_MARKER;
}
function hasManagedSecretRefProviderApiKey(cfg, provider) {
	const apiKey = resolveProviderConfig(cfg, provider)?.apiKey;
	const ref = coerceSecretRef(apiKey);
	if (ref) return ref.source !== "env";
	return typeof apiKey === "string" && isManagedSecretRefApiKeyMarker(apiKey);
}
function resolveLiteralProviderConfigApiKeyAuth(params) {
	const apiKey = normalizeOptionalSecretInput(resolveProviderConfig(params.cfg, params.provider)?.apiKey);
	if (!apiKey || isNonSecretApiKeyMarker(apiKey)) return;
	return {
		apiKey,
		source: `models.providers.${params.provider}`,
		mode: "api-key"
	};
}
function resolveManagedSecretRefRuntimeProviderAuth(params) {
	if (!hasManagedSecretRefProviderApiKey(params.cfg, params.provider)) return;
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (params.cfg && params.cfg !== runtimeConfig && !runtimeSourceConfig) return;
	const applicableConfig = selectApplicableRuntimeConfig({
		inputConfig: params.cfg,
		runtimeConfig,
		runtimeSourceConfig
	});
	if (!runtimeConfig || applicableConfig !== runtimeConfig) return;
	return resolveLiteralProviderConfigApiKeyAuth({
		cfg: runtimeConfig,
		provider: params.provider
	});
}
/** True when a custom local provider can use a synthetic no-auth placeholder. */
function hasSyntheticLocalProviderAuthConfig(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	if (!providerConfig) return false;
	if (!(Boolean(providerConfig.api?.trim()) || Boolean(providerConfig.baseUrl?.trim()) || Array.isArray(providerConfig.models) && providerConfig.models.length > 0)) return false;
	const authOverride = resolveProviderAuthOverride(params.cfg, params.provider);
	if (authOverride && authOverride !== "api-key") return false;
	if (!isCustomLocalProviderConfig(providerConfig)) return false;
	if (hasExplicitProviderApiKeyConfig(providerConfig)) return false;
	return Boolean(providerConfig.baseUrl && isLocalBaseUrl(providerConfig.baseUrl));
}
function listProviderSyntheticAuthRefs(params) {
	const refs = [params.provider];
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
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
/** Fast auth-availability check for runtime provider/model selection. */
function hasRuntimeAvailableProviderAuth(params) {
	const provider = normalizeProviderId(params.provider);
	if (resolveProviderAuthOverride(params.cfg, provider) === "aws-sdk") return true;
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
		mode: envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
	})) return true;
	if (resolveUsableCustomProviderApiKey({
		cfg: params.cfg,
		provider,
		env: params.env
	})) return true;
	if (resolveManagedSecretRefRuntimeProviderAuth({
		cfg: params.cfg,
		provider
	})) return true;
	if (hasSyntheticLocalProviderAuthConfig({
		cfg: params.cfg,
		provider
	})) return true;
	if (params.allowPluginSyntheticAuth !== false && shouldResolvePluginSyntheticAuth({
		cfg: params.cfg,
		provider,
		runtimeLookup: params.runtimeLookup
	}) && resolveSyntheticLocalProviderAuth({
		cfg: params.cfg,
		provider
	})) return true;
	return false;
}
function resolveProviderSyntheticRuntimeAuth(params) {
	const runtimeAuth = resolveManagedSecretRefRuntimeProviderAuth(params);
	if (runtimeAuth) return { auth: runtimeAuth };
	if (hasManagedSecretRefProviderApiKey(params.cfg, params.provider)) return { blockedOnManagedSecretRef: true };
	const resolveFromConfig = (config) => {
		const providerConfig = resolveProviderConfig(config, params.provider);
		return resolveProviderSyntheticAuthWithPlugin({
			provider: params.provider,
			config,
			context: {
				config,
				provider: params.provider,
				providerConfig
			},
			modelApi: params.modelApi
		}) ?? void 0;
	};
	const directAuth = resolveFromConfig(params.cfg);
	if (!directAuth) return {};
	if (!isManagedSecretRefApiKeyMarker(directAuth.apiKey)) return { auth: directAuth };
	const runtimeConfig = getRuntimeConfigSnapshot();
	if (!runtimeConfig || runtimeConfig === params.cfg) return { blockedOnManagedSecretRef: true };
	const runtimePluginAuth = resolveFromConfig(runtimeConfig);
	const runtimeApiKey = runtimePluginAuth?.apiKey;
	if (!runtimePluginAuth || !runtimeApiKey || isNonSecretApiKeyMarker(runtimeApiKey)) return { blockedOnManagedSecretRef: true };
	return { auth: runtimePluginAuth };
}
function resolveSyntheticLocalProviderAuth(params) {
	const syntheticProviderAuth = resolveProviderSyntheticRuntimeAuth(params);
	if (syntheticProviderAuth.auth) return syntheticProviderAuth.auth;
	if (syntheticProviderAuth.blockedOnManagedSecretRef) return null;
	if (!resolveProviderConfig(params.cfg, params.provider)) return null;
	if (hasSyntheticLocalProviderAuthConfig(params)) return {
		apiKey: CUSTOM_LOCAL_AUTH_MARKER,
		source: `models.providers.${params.provider} (synthetic local key)`,
		mode: "api-key"
	};
	return null;
}
function resolveEnvSourceLabel(params) {
	return `${params.envVars.some((envVar) => params.applied.has(envVar)) ? "shell env: " : "env: "}${params.label}`;
}
function resolveAwsSdkAuthInfo() {
	const applied = new Set(getShellEnvAppliedKeys());
	if (process.env.AWS_BEARER_TOKEN_BEDROCK?.trim()) return {
		mode: "aws-sdk",
		source: resolveEnvSourceLabel({
			applied,
			envVars: ["AWS_BEARER_TOKEN_BEDROCK"],
			label: "AWS_BEARER_TOKEN_BEDROCK"
		})
	};
	if (process.env.AWS_ACCESS_KEY_ID?.trim() && process.env.AWS_SECRET_ACCESS_KEY?.trim()) return {
		mode: "aws-sdk",
		source: resolveEnvSourceLabel({
			applied,
			envVars: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"],
			label: "AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY"
		})
	};
	if (process.env.AWS_PROFILE?.trim()) return {
		mode: "aws-sdk",
		source: resolveEnvSourceLabel({
			applied,
			envVars: ["AWS_PROFILE"],
			label: "AWS_PROFILE"
		})
	};
	return {
		mode: "aws-sdk",
		source: "aws-sdk default chain"
	};
}
function shouldDeferSyntheticProfileAuth(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	return shouldDeferProviderSyntheticProfileAuthWithPlugin({
		provider: params.provider,
		config: params.cfg,
		modelApi: params.modelApi,
		context: {
			config: params.cfg,
			provider: params.provider,
			providerConfig,
			resolvedApiKey: params.resolvedApiKey
		}
	}) === true;
}
function resolveScopedAuthProfileStore(params) {
	return ensureAuthProfileStore(params.agentDir, { externalCli: externalCliDiscoveryForProviderAuth(params) });
}
/** Resolves the credential that should be used for one provider request. */
async function resolveApiKeyForProvider(params) {
	const { provider, cfg, profileId, preferredProfile } = params;
	const agentDir = params.agentDir?.trim() || (cfg ? resolveDefaultAgentDir(cfg) : void 0);
	let scopedStore = params.store;
	if (profileId) {
		const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
			cfg,
			provider,
			profileId
		});
		if (awsSdkProfileAuth) return awsSdkProfileAuth;
		const store = params.store ?? resolveScopedAuthProfileStore({
			agentDir,
			cfg,
			provider,
			profileId,
			preferredProfile
		});
		const resolved = await resolveApiKeyForProfile({
			cfg,
			store,
			profileId,
			agentDir,
			forceRefresh: params.forceRefresh
		});
		if (!resolved) throw new Error(`No credentials found for profile "${profileId}".`);
		const resolvedProfileId = resolved.profileId ?? profileId;
		const mode = resolved.profileType ?? store.profiles[resolvedProfileId]?.type;
		const result = {
			apiKey: resolved.apiKey,
			profileId: resolvedProfileId,
			source: `profile:${resolvedProfileId}`,
			mode: mode ? profileTypeToAuthMode(mode) : "api-key"
		};
		assertAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			profileId: resolvedProfileId,
			mode: result.mode
		});
		if (!params.lockedProfile && shouldDeferSyntheticProfileAuth({
			cfg,
			provider,
			resolvedApiKey: resolved.apiKey,
			modelApi: params.modelApi
		})) return resolveApiKeyForProvider({
			...params,
			store,
			profileId: void 0,
			lockedProfile: true
		}).catch(() => result);
		return result;
	}
	if (cfg?.auth?.profiles || cfg?.auth?.order) {
		scopedStore ??= resolveScopedAuthProfileStore({
			agentDir,
			cfg,
			provider,
			preferredProfile
		});
		const configuredProfileOrder = resolveAuthProfileOrder({
			cfg,
			store: scopedStore,
			provider,
			preferredProfile
		});
		for (const candidate of configuredProfileOrder) {
			const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
				cfg,
				provider,
				profileId: candidate
			});
			if (awsSdkProfileAuth) return awsSdkProfileAuth;
		}
	}
	if (resolveProviderAuthOverride(cfg, provider) === "aws-sdk") return resolveAwsSdkAuthInfo();
	if (shouldUseImplicitAwsSdkAuth({
		cfg,
		provider,
		modelApi: params.modelApi
	})) return resolveAwsSdkAuthInfo();
	if (params.credentialPrecedence === "env-first") {
		const envResolved = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir);
		if (envResolved) {
			const resolvedMode = envResolved.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key";
			if (!isAuthModeAllowedForModel({
				provider,
				modelApi: params.modelApi,
				mode: resolvedMode
			})) return resolveApiKeyForProvider({
				...params,
				credentialPrecedence: "profile-first"
			});
			return {
				apiKey: envResolved.apiKey,
				source: envResolved.source,
				mode: resolvedMode
			};
		}
	}
	scopedStore ??= resolveScopedAuthProfileStore({
		agentDir,
		cfg,
		provider,
		preferredProfile
	});
	const providerEntryBinding = await resolveProviderEntryApiKeyBinding({
		cfg,
		provider,
		store: scopedStore,
		agentDir
	});
	if (providerEntryBinding.kind === "profile-resolved") {
		assertAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			profileId: providerEntryBinding.auth.profileId ?? provider,
			mode: providerEntryBinding.auth.mode
		});
		return providerEntryBinding.auth;
	}
	if (providerEntryBinding.kind === "profile-incompatible") {
		const reason = providerEntryBinding.reason === "credential-class" ? "which is not a bearer-style auth class" : "which is not compatible with this provider entry's auth binding";
		const action = providerEntryBinding.reason === "credential-class" ? "Use an api-key or token profile, or set apiKey to a literal bearer token." : "Use a compatible provider auth alias, configure the referenced provider entry with the same baseUrl, or set apiKey to a literal bearer token.";
		throw new Error(`Per-entry apiKey "${providerEntryBinding.profileId}" for provider "${provider}" references a "${providerEntryBinding.credentialType}" credential for provider "${providerEntryBinding.credentialProvider}", ${reason}. ${action}`);
	}
	if (providerEntryBinding.kind === "profile-unresolved") {
		const cause = providerEntryBinding.error ? formatErrorMessage(providerEntryBinding.error) : "credential resolution returned no key";
		throw new Error(`Per-entry apiKey "${providerEntryBinding.profileId}" for provider "${provider}" matched a stored profile but failed to resolve: ${cause}. Fix the referenced profile or set apiKey to a literal bearer token.`);
	}
	if (shouldPreferExplicitConfigApiKeyAuth(cfg, provider)) {
		const runtimeCustomKey = resolveManagedSecretRefRuntimeProviderAuth({
			cfg,
			provider
		});
		if (runtimeCustomKey) return runtimeCustomKey;
		const customKey = resolveUsableCustomProviderApiKey({
			cfg,
			provider
		});
		if (customKey) return {
			apiKey: customKey.apiKey,
			source: customKey.source,
			mode: "api-key"
		};
	}
	const providerConfig = resolveProviderConfig(cfg, provider);
	const configuredLocalKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider
	});
	if (configuredLocalKey && isNonSecretApiKeyMarker(configuredLocalKey.apiKey)) return {
		apiKey: configuredLocalKey.apiKey,
		source: configuredLocalKey.source,
		mode: "api-key"
	};
	const localMarkerEnv = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir);
	if (localMarkerEnv && isNonSecretApiKeyMarker(localMarkerEnv.apiKey)) return {
		apiKey: localMarkerEnv.apiKey,
		source: localMarkerEnv.source,
		mode: "api-key"
	};
	const store = scopedStore ?? resolveScopedAuthProfileStore({
		agentDir,
		cfg,
		provider,
		preferredProfile
	});
	const order = resolveAuthProfileOrder({
		cfg,
		store,
		provider,
		preferredProfile
	});
	let deferredAuthProfileResult = null;
	for (const candidate of order) try {
		const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
			cfg,
			provider,
			profileId: candidate
		});
		if (awsSdkProfileAuth) return awsSdkProfileAuth;
		const resolved = await resolveApiKeyForProfile({
			cfg,
			store,
			profileId: candidate,
			agentDir,
			forceRefresh: params.forceRefresh
		});
		if (resolved) {
			const resolvedProfileId = resolved.profileId ?? candidate;
			const mode = resolved.profileType ?? store.profiles[resolvedProfileId]?.type;
			const resolvedMode = mode ? profileTypeToAuthMode(mode) : "api-key";
			const result = {
				apiKey: resolved.apiKey,
				profileId: resolvedProfileId,
				source: `profile:${resolvedProfileId}`,
				mode: resolvedMode
			};
			if (!isAuthModeAllowedForModel({
				provider,
				modelApi: params.modelApi,
				mode: result.mode
			})) continue;
			if (shouldDeferSyntheticProfileAuth({
				cfg,
				provider,
				resolvedApiKey: resolved.apiKey,
				modelApi: params.modelApi
			})) {
				deferredAuthProfileResult ??= result;
				continue;
			}
			return result;
		}
	} catch (err) {
		log.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
	}
	const envResolved = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir);
	if (envResolved) {
		const resolvedMode = envResolved.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key";
		if (isAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			mode: resolvedMode
		})) return {
			apiKey: envResolved.apiKey,
			source: envResolved.source,
			mode: resolvedMode
		};
	}
	const customKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider
	});
	if (customKey) return {
		apiKey: customKey.apiKey,
		source: customKey.source,
		mode: "api-key"
	};
	if (deferredAuthProfileResult) return deferredAuthProfileResult;
	const syntheticLocalAuth = resolveSyntheticLocalProviderAuth({
		cfg,
		provider,
		modelApi: params.modelApi
	});
	if (syntheticLocalAuth) return syntheticLocalAuth;
	if ((!(Array.isArray(providerConfig?.models) && providerConfig.models.length > 0) ? resolveOwningPluginIdsForProviderRef({
		provider,
		config: cfg
	}) : void 0)?.length) {
		const pluginMissingAuthMessage = buildProviderMissingAuthMessageWithPlugin({
			provider,
			config: cfg,
			context: {
				config: cfg,
				agentDir,
				env: process.env,
				provider,
				listProfileIds: (providerId) => listProfilesForProvider(store, providerId)
			}
		});
		if (pluginMissingAuthMessage) throw new ProviderAuthError("missing-provider-auth", provider, pluginMissingAuthMessage);
	}
	const authStorePath = resolveAuthStorePathForDisplay(agentDir);
	const resolvedAgentDir = path.dirname(authStorePath);
	throw new ProviderAuthError("missing-provider-auth", provider, [
		`No API key found for provider "${provider}".`,
		`Auth store: ${authStorePath} (agentDir: ${resolvedAgentDir}).`,
		`Configure auth for this agent (${formatCliCommand("openclaw agents add <id>")}) or copy only portable static auth profiles from the main agentDir.`
	].join(" "));
}
/** Reports the strongest configured auth mode for provider-list UI and diagnostics. */
function resolveModelAuthMode(provider, cfg, store, options) {
	const resolved = provider?.trim();
	if (!resolved) return;
	if (resolveProviderAuthOverride(cfg, resolved) === "aws-sdk") return "aws-sdk";
	const authStore = store ?? resolveScopedAuthProfileStore({
		cfg,
		provider: resolved
	});
	const profiles = listProfilesForProvider(authStore, resolved);
	if (profiles.length > 0) {
		const modes = new Set(profiles.map((id) => authStore.profiles[id]?.type).filter((mode) => Boolean(mode)));
		if ([
			"oauth",
			"token",
			"api_key"
		].filter((k) => modes.has(k)).length >= 2) return "mixed";
		if (modes.has("oauth")) return "oauth";
		if (modes.has("token")) return "token";
		if (modes.has("api_key")) return "api-key";
	}
	const envKey = resolveConfigAwareEnvApiKey(cfg, resolved, options?.workspaceDir);
	if (envKey?.apiKey) return envKey.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key";
	if (normalizeProviderId(resolved) === "codex" && readCodexCliCredentialsCached({
		ttlMs: 5e3,
		allowKeychainPrompt: false
	})) return "oauth";
	if (hasUsableCustomProviderApiKey(cfg, resolved)) return "api-key";
	return "unknown";
}
/** Checks provider auth availability, including profile fallback order. */
async function hasAvailableAuthForProvider(params) {
	const { provider, cfg, preferredProfile } = params;
	if (resolveProviderAuthOverride(cfg, provider) === "aws-sdk") return true;
	const envAuth = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir);
	if (envAuth && isAuthModeAllowedForModel({
		provider,
		modelApi: params.modelApi,
		mode: envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
	})) return true;
	if (resolveUsableCustomProviderApiKey({
		cfg,
		provider
	})) return true;
	if (resolveSyntheticLocalProviderAuth({
		cfg,
		provider
	})) return true;
	const store = params.store ?? resolveScopedAuthProfileStore({
		agentDir: params.agentDir,
		cfg,
		provider,
		preferredProfile
	});
	const order = resolveAuthProfileOrder({
		cfg,
		store,
		provider,
		preferredProfile
	});
	for (const candidate of order) try {
		if (resolveConfiguredAwsSdkProfileAuth({
			cfg,
			provider,
			profileId: candidate
		})) return true;
		const resolved = await resolveApiKeyForProfile({
			cfg,
			store,
			profileId: candidate,
			agentDir: params.agentDir
		});
		const mode = resolved?.profileType ?? store.profiles[candidate]?.type;
		if (resolved && isAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			mode: mode ? profileTypeToAuthMode(mode) : "api-key"
		})) return true;
	} catch (err) {
		log.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
	}
	return false;
}
/** Resolves request credentials from the provider attached to a model descriptor. */
async function getApiKeyForModel(params) {
	return resolveApiKeyForProvider({
		provider: params.model.provider,
		cfg: params.cfg,
		profileId: params.profileId,
		preferredProfile: params.preferredProfile,
		store: params.store,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		lockedProfile: params.lockedProfile,
		credentialPrecedence: params.credentialPrecedence,
		modelApi: params.model.api
	});
}
/** Clears auth for local OpenAI-compatible servers that explicitly use no auth. */
function applyLocalNoAuthHeaderOverride(model, auth) {
	if (auth?.apiKey !== "custom-local" || model.api !== "openai-completions") return model;
	const headers = {
		...model.headers,
		Authorization: null
	};
	return {
		...model,
		headers
	};
}
/**
* When the provider config sets `authHeader: true`, inject an explicit
* `Authorization: Bearer <apiKey>` header into the model so downstream SDKs
* (e.g. `@google/genai`) send credentials via the standard HTTP Authorization
* header instead of vendor-specific headers like `x-goog-api-key`.
*
* This is a no-op when `authHeader` is not `true`, when no API key is
* available, or when the API key is a synthetic marker (e.g. local-server
* placeholders) rather than a real credential.
*/
function applyAuthHeaderOverride(model, auth, cfg) {
	if (!auth?.apiKey) return model;
	if (isNonSecretApiKeyMarker(auth.apiKey)) return model;
	if (!resolveProviderConfig(cfg, model.provider)?.authHeader) return model;
	const headers = {};
	if (model.headers) {
		for (const [key, value] of Object.entries(model.headers)) if (normalizeOptionalLowercaseString(key) !== "authorization") headers[key] = value;
	}
	headers.Authorization = `Bearer ${auth.apiKey}`;
	return {
		...model,
		headers
	};
}
//#endregion
export { getApiKeyForModel as a, hasRuntimeAvailableProviderAuth as c, resolveApiKeyForProvider as d, resolveModelAuthMode as f, shouldPreferExplicitConfigApiKeyAuth as g, resolveUsableCustomProviderApiKey as h, createRuntimeProviderAuthLookup as i, hasSyntheticLocalProviderAuthConfig as l, resolveProviderEntryApiKeyProfileReference as m, applyLocalNoAuthHeaderOverride as n, getCustomProviderApiKey as o, resolveProviderEntryApiKeyBinding as p, canUseProfileAsProviderEntryApiKey as r, hasAvailableAuthForProvider as s, applyAuthHeaderOverride as t, hasUsableCustomProviderApiKey as u };
