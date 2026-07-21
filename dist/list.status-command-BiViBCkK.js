import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-10KxeiYV.js";
import { _ as parseStrictFiniteNumber, b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { r as theme, t as colorize } from "./theme-vjDs9tao.js";
import { _ as shortenHomePath, m as resolveUserPath } from "./utils-CRO4LGEB.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import { a as normalizeProviderIdForAuth, n as findNormalizedProviderValue } from "./provider-id-Dq06Bcx6.js";
import { i as resolveAgentModelPrimaryValue, r as resolveAgentModelFallbackValues } from "./model-input-B5RmygIK.js";
import { c as resolveAgentExplicitModelPrimary, d as resolveAgentModelFallbacksOverride } from "./agent-scope-B2Pk_xhT.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-ClCi3unQ.js";
import { a as restoreCurrentPluginMetadataSnapshotState, o as setCurrentPluginMetadataSnapshot, r as getCurrentPluginMetadataSnapshot, t as captureCurrentPluginMetadataSnapshotState } from "./current-plugin-metadata-snapshot-CT4JjmjS.js";
import { r as createConfigIO } from "./io-DxnOT4sF.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-BMy8GnRz.js";
import { c as shouldEnableShellEnvFallback, n as getShellEnvAppliedKeys } from "./shell-env-DaE9Xx3-.js";
import { n as OPENAI_PROVIDER_ID, o as openAIProviderUsesCodexRuntimeByDefault, t as OPENAI_CODEX_PROVIDER_ID } from "./openai-routing-DXJmS9CT.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-mDjiWzE5.js";
import "./config-Cc93keN1.js";
import { u as resolveAuthStorePathForDisplay } from "./runtime-snapshots-CsKLV87K.js";
import { c as loadPersistedAuthProfileStore } from "./source-check-CsikPIZO.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-C77NT24K.js";
import { j as resolveProviderSyntheticAuthWithPlugin } from "./provider-runtime-CIKTXkgy.js";
import { n as evaluateStoredCredentialEligibility } from "./credential-state-BY-oz-QV.js";
import { i as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-9jfx-1KO.js";
import { i as resolveAuthProfileDisplayLabel } from "./auth-profiles-aoLBSIs2.js";
import "./profiles-Bs4Dh6yw.js";
import { n as listProfilesForProvider } from "./profile-list-DcdGY7PM.js";
import { i as resolveAuthProfileOrder, r as resolveAuthProfileEligibility } from "./order-DjOYyPH4.js";
import { o as resolveProfileUnusableUntilForDisplay } from "./usage-CJb2EUW2.js";
import { _ as resolveConfiguredModelRef, b as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-DwnYeyqq.js";
import { i as modelKey, o as normalizeProviderId } from "./model-selection-normalize-Cj03z3tC.js";
import { b as resolveProviderEnvAuthLookupMaps, d as isNonSecretApiKeyMarker, f as isOAuthApiKeyMarker, y as listProviderEnvAuthLookupKeys } from "./model-auth-markers-BMRrT_lG.js";
import { t as isCliProvider } from "./model-selection-cli-DB4l0L04.js";
import "./model-selection-CFL1kjzt.js";
import { t as resolveEnvApiKey } from "./model-auth-env-CPrCZe_2.js";
import { r as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { g as resolveUsableCustomProviderApiKey, s as getCustomProviderApiKey } from "./model-auth-Cg-0So6j.js";
import "./workspace-BJm9kqLw.js";
import { a as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-B1-PRucg.js";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-DdMGi0bf.js";
import { n as ensureFlagCompatibility, s as resolveKnownAgentId } from "./shared-BPNNLkzQ.js";
import { n as buildAuthHealthSummary, r as formatRemainingShort, t as DEFAULT_OAUTH_WARN_MS } from "./auth-health-DVoqBBjt.js";
import { t as maskApiKey } from "./secret-mask-nHYqNjGp.js";
import { t as loadModelsConfig } from "./load-config-Dc5gZ4TS.js";
import { n as isRich } from "./list.format-Dm4sqBw2.js";
import path from "node:path";
//#region src/commands/models/list.auth-overview.ts
/** Builds provider auth summaries for model-list/status output. */
function formatMarkerOrSecret(value) {
	return isNonSecretApiKeyMarker(value, { includeEnvVarName: false }) ? `marker(${value.trim()})` : maskApiKey(value);
}
function formatProfileSecretLabel(params) {
	const value = normalizeOptionalString(params.value) ?? "";
	if (value) {
		const display = formatMarkerOrSecret(value);
		return params.kind === "token" ? `token:${display}` : display;
	}
	if (params.ref) {
		const refLabel = `ref(${params.ref.source}:${params.ref.id})`;
		return params.kind === "token" ? `token:${refLabel}` : refLabel;
	}
	return params.kind === "token" ? "token:missing" : "missing";
}
function resolveProfileSourceAgentDir(params) {
	if (!params.agentDir || params.profileIds.length === 0) return params.agentDir;
	const localStore = loadPersistedAuthProfileStore(params.agentDir);
	if (params.profileIds.some((profileId) => Boolean(localStore?.profiles[profileId]))) return params.agentDir;
	const mainStore = loadPersistedAuthProfileStore(void 0);
	return params.profileIds.every((profileId) => Boolean(mainStore?.profiles[profileId])) ? void 0 : params.agentDir;
}
/** Resolves the effective auth source and profile counts for a provider. */
function resolveProviderAuthOverview(params) {
	const { provider, cfg, store } = params;
	const now = Date.now();
	const profiles = listProfilesForProvider(store, provider);
	const withUnusableSuffix = (base, profileId) => {
		const unusableUntil = resolveProfileUnusableUntilForDisplay(store, profileId);
		if (!unusableUntil || now >= unusableUntil) return base;
		const stats = store.usageStats?.[profileId];
		return `${base} [${typeof stats?.disabledUntil === "number" && now < stats.disabledUntil ? `disabled${stats.disabledReason ? `:${stats.disabledReason}` : ""}` : "cooldown"} ${formatRemainingShort(unusableUntil - now)}]`;
	};
	const labels = profiles.map((profileId) => {
		const profile = store.profiles[profileId];
		if (!profile) return `${profileId}=missing`;
		if (profile.type === "api_key") return withUnusableSuffix(`${profileId}=${formatProfileSecretLabel({
			value: profile.key,
			ref: profile.keyRef,
			kind: "api-key"
		})}`, profileId);
		if (profile.type === "token") return withUnusableSuffix(`${profileId}=${formatProfileSecretLabel({
			value: profile.token,
			ref: profile.tokenRef,
			kind: "token"
		})}`, profileId);
		const display = resolveAuthProfileDisplayLabel({
			cfg,
			store,
			profileId
		});
		const suffix = display === profileId ? "" : display.startsWith(profileId) ? display.slice(profileId.length).trim() : `(${display})`;
		const base = `${profileId}=OAuth${suffix ? ` ${suffix}` : ""}`;
		return withUnusableSuffix(base, profileId);
	});
	const oauthCount = profiles.filter((id) => store.profiles[id]?.type === "oauth").length;
	const tokenCount = profiles.filter((id) => store.profiles[id]?.type === "token").length;
	const apiKeyCount = profiles.filter((id) => store.profiles[id]?.type === "api_key").length;
	const normalizedProvider = normalizeProviderIdForAuth(provider);
	const authLookupProvider = params.aliasMap?.[normalizedProvider] ?? normalizedProvider;
	const hasPrecomputedCandidates = params.envCandidateMap !== void 0 && Object.hasOwn(params.envCandidateMap, authLookupProvider);
	const hasPrecomputedEvidence = params.authEvidenceMap !== void 0 && Object.hasOwn(params.authEvidenceMap, authLookupProvider);
	const envKey = resolveEnvApiKey(provider, process.env, {
		config: cfg,
		workspaceDir: params.workspaceDir,
		aliasMap: params.aliasMap,
		candidateMap: params.envCandidateMap,
		authEvidenceMap: params.authEvidenceMap,
		skipSetupProviderFallback: hasPrecomputedCandidates || hasPrecomputedEvidence
	});
	const customKey = getCustomProviderApiKey(cfg, provider);
	const usableCustomKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider
	});
	return {
		provider,
		effective: (() => {
			if (profiles.length > 0) return {
				kind: "profiles",
				detail: shortenHomePath(resolveAuthStorePathForDisplay(resolveProfileSourceAgentDir({
					agentDir: params.agentDir,
					profileIds: profiles
				})))
			};
			if (envKey) {
				const normalizedSource = normalizeLowercaseStringOrEmpty(envKey.source);
				return {
					kind: "env",
					detail: envKey.source.includes("OAUTH_TOKEN") || normalizedSource.includes("oauth") ? "OAuth (env)" : maskApiKey(envKey.apiKey)
				};
			}
			if (usableCustomKey) return {
				kind: "models.json",
				detail: formatMarkerOrSecret(usableCustomKey.apiKey)
			};
			if (params.syntheticAuth) return {
				kind: "synthetic",
				detail: params.syntheticAuth.source
			};
			if (customKey && isOAuthApiKeyMarker(customKey)) return {
				kind: "models.json",
				detail: formatMarkerOrSecret(customKey)
			};
			return {
				kind: "missing",
				detail: "missing"
			};
		})(),
		profiles: {
			count: profiles.length,
			oauth: oauthCount,
			token: tokenCount,
			apiKey: apiKeyCount,
			labels
		},
		...envKey ? { env: {
			value: (() => {
				const normalizedSource = normalizeLowercaseStringOrEmpty(envKey.source);
				return envKey.source.includes("OAUTH_TOKEN") || normalizedSource.includes("oauth") ? "OAuth (env)" : maskApiKey(envKey.apiKey);
			})(),
			source: envKey.source
		} } : {},
		...customKey ? { modelsJson: {
			value: formatMarkerOrSecret(customKey),
			source: `models.json: ${shortenHomePath(params.modelsPath)}`
		} } : {},
		...params.syntheticAuth ? { syntheticAuth: params.syntheticAuth } : {}
	};
}
//#endregion
//#region src/commands/models/list.status-command.ts
/** Implementation of `openclaw models status`. */
function resolveEnvAgentDirOverride(env = process.env) {
	const override = env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim();
	return override ? resolveUserPath(override, env) : void 0;
}
const providerUsageRuntimeLoader = createLazyImportLoader(() => import("./provider-usage-BaBJfBvO.js"));
const progressRuntimeLoader = createLazyImportLoader(() => import("./progress-_D0rc7TD.js"));
const terminalTableRuntimeLoader = createLazyImportLoader(() => import("./terminal-core/table.js"));
const listProbeRuntimeLoader = createLazyImportLoader(() => import("./list.probe-DoUleQF1.js"));
const DISPLAY_MODEL_PARSE_OPTIONS = { allowPluginNormalization: false };
function loadProviderUsageRuntime() {
	return providerUsageRuntimeLoader.load();
}
function loadProgressRuntime() {
	return progressRuntimeLoader.load();
}
function loadTerminalTableRuntime() {
	return terminalTableRuntimeLoader.load();
}
function loadListProbeRuntime() {
	return listProbeRuntimeLoader.load();
}
function parseOptionalPositiveFiniteOption(raw, label, fallback) {
	if (raw === void 0 || raw === null || raw === "") return fallback;
	const parsed = parseStrictFiniteNumber(raw);
	if (parsed === void 0 || parsed <= 0) throw new Error(`${label} must be a positive number.`);
	return parsed;
}
function parseOptionalPositiveIntegerOption(raw, label, fallback) {
	if (raw === void 0 || raw === null || raw === "") return fallback;
	const parsed = parseStrictPositiveInteger(raw);
	if (parsed === void 0) throw new Error(`${label} must be a positive integer.`);
	return parsed;
}
function isCompletePluginMetadataSnapshot(value) {
	if (!value || typeof value !== "object") return false;
	const snapshot = value;
	return typeof snapshot.policyHash === "string" && snapshot.index !== void 0 && snapshot.manifestRegistry !== void 0;
}
function installCommandPluginMetadataSnapshot(params) {
	if (!isCompletePluginMetadataSnapshot(params.snapshot)) return () => {};
	if (getCurrentPluginMetadataSnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	})) return () => {};
	const previousState = captureCurrentPluginMetadataSnapshotState();
	setCurrentPluginMetadataSnapshot(params.snapshot, {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	return () => {
		restoreCurrentPluginMetadataSnapshotState(previousState);
	};
}
function resolveProviderConfigForStatus(cfg, provider) {
	const providers = cfg.models?.providers ?? {};
	const direct = providers[provider];
	if (direct) return direct;
	const normalized = normalizeProviderId(provider);
	return providers[normalized] ?? Object.entries(providers).find(([key]) => normalizeProviderId(key) === normalized)?.[1];
}
function syntheticAuthCredential(provider, auth) {
	if (!auth.mode) return;
	if (auth.mode === "api-key") return {
		type: "api_key",
		provider,
		key: auth.credential
	};
	if (auth.mode === "token") return {
		type: "token",
		provider,
		token: auth.credential,
		expires: auth.expiresAt
	};
	if (auth.expiresAt === void 0) return;
	return {
		type: "oauth",
		provider,
		access: auth.credential ?? "",
		refresh: "",
		expires: auth.expiresAt
	};
}
function finishModelsStatusOutput(runtime, check, checkStatus) {
	if (check) {
		if (!requestExitAfterOneShotOutput(runtime, checkStatus)) runtime.exit(checkStatus);
		return;
	}
	requestExitAfterOneShotOutput(runtime);
}
/** Prints model default, auth, provider, and optional probe status. */
async function modelsStatusCommand(opts, runtime) {
	ensureFlagCompatibility(opts);
	if (opts.plain && opts.probe) throw new Error("--probe cannot be used with --plain output.");
	const configPath = createConfigIO().configPath;
	const cfg = await loadModelsConfig({
		commandName: "models status",
		runtime
	});
	const agentId = resolveKnownAgentId({
		cfg,
		rawAgentId: opts.agent
	});
	const workspaceAgentId = agentId ?? resolveDefaultAgentId(cfg);
	const agentDir = agentId ? resolveAgentDir(cfg, agentId) : resolveEnvAgentDirOverride() ?? resolveAgentDir(cfg, workspaceAgentId);
	const workspaceDir = resolveAgentWorkspaceDir(cfg, workspaceAgentId) ?? resolveDefaultAgentWorkspaceDir();
	const agentModelPrimary = agentId ? resolveAgentExplicitModelPrimary(cfg, agentId) : void 0;
	const agentFallbacksOverride = agentId ? resolveAgentModelFallbacksOverride(cfg, agentId) : void 0;
	const resolvedConfig = agentModelPrimary && agentModelPrimary.length > 0 ? {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				model: {
					...typeof cfg.agents?.defaults?.model === "object" ? cfg.agents.defaults.model : {},
					primary: agentModelPrimary
				}
			}
		}
	} : cfg;
	const metadataSnapshot = loadManifestMetadataSnapshot({
		config: cfg,
		workspaceDir,
		env: process.env
	});
	const cleanupPluginMetadataSnapshot = installCommandPluginMetadataSnapshot({
		snapshot: metadataSnapshot,
		config: cfg,
		workspaceDir,
		env: process.env
	});
	try {
		const resolved = resolveConfiguredModelRef({
			cfg: resolvedConfig,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel: DEFAULT_MODEL,
			...DISPLAY_MODEL_PARSE_OPTIONS
		});
		const rawDefaultsModel = resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "";
		const rawModel = agentModelPrimary ?? rawDefaultsModel;
		const resolvedLabel = modelKey(resolved.provider, resolved.model);
		const defaultLabel = rawModel || resolvedLabel;
		const defaultsFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
		const fallbacks = agentFallbacksOverride ?? defaultsFallbacks;
		const imageModel = resolveAgentModelPrimaryValue(cfg.agents?.defaults?.imageModel) ?? "";
		const imageFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.imageModel);
		const aliases = Object.entries(cfg.agents?.defaults?.models ?? {}).reduce((acc, [key, entry]) => {
			const alias = normalizeOptionalString(entry?.alias);
			if (alias) acc[alias] = key;
			return acc;
		}, {});
		const allowed = Object.keys(cfg.agents?.defaults?.models ?? {});
		const store = ensureAuthProfileStoreWithoutExternalProfiles(agentDir);
		const modelsPath = path.join(agentDir, "models.json");
		const providersFromStore = new Set(Object.values(store.profiles).map((profile) => normalizeProviderId(profile.provider)).filter((p) => Boolean(p)));
		const providersFromConfig = new Set(Object.keys(cfg.models?.providers ?? {}).map((p) => typeof p === "string" ? normalizeProviderId(p) : "").filter(Boolean));
		const aliasIndex = buildModelAliasIndex({
			cfg,
			defaultProvider: DEFAULT_PROVIDER,
			...DISPLAY_MODEL_PARSE_OPTIONS
		});
		const resolveStatusModelRef = (raw) => {
			const modelRef = raw?.trim();
			if (!modelRef) return;
			return resolveModelRefFromString({
				cfg,
				raw: modelRef,
				defaultProvider: DEFAULT_PROVIDER,
				aliasIndex,
				...DISPLAY_MODEL_PARSE_OPTIONS
			})?.ref;
		};
		const providersFromModels = /* @__PURE__ */ new Set();
		const providerUses = [];
		const addProviderUse = (raw, allowCodexRuntimeFallback) => {
			const ref = resolveStatusModelRef(raw);
			if (ref?.provider) providerUses.push({
				provider: normalizeProviderId(ref.provider),
				model: ref.model,
				allowCodexRuntimeFallback
			});
		};
		for (const raw of [
			defaultLabel,
			...fallbacks,
			imageModel,
			...imageFallbacks,
			...allowed
		]) {
			const ref = resolveStatusModelRef(raw);
			if (ref?.provider) providersFromModels.add(normalizeProviderId(ref.provider));
		}
		for (const raw of [defaultLabel, ...fallbacks]) addProviderUse(raw, true);
		for (const raw of [imageModel, ...imageFallbacks]) addProviderUse(raw, false);
		const providersFromEnv = /* @__PURE__ */ new Set();
		const envLookupParams = {
			config: cfg,
			workspaceDir,
			env: process.env,
			metadataSnapshot
		};
		const { aliasMap, envCandidateMap, authEvidenceMap } = resolveProviderEnvAuthLookupMaps(envLookupParams);
		for (const provider of listProviderEnvAuthLookupKeys({
			envCandidateMap,
			authEvidenceMap
		})) if (resolveEnvApiKey(provider, process.env, {
			config: cfg,
			workspaceDir,
			aliasMap,
			candidateMap: envCandidateMap,
			authEvidenceMap,
			skipSetupProviderFallback: true
		})) providersFromEnv.add(provider);
		const syntheticAuthProviderRefs = new Set(resolveRuntimeSyntheticAuthProviderRefs({
			index: metadataSnapshot.index,
			registryDiagnostics: metadataSnapshot.registryDiagnostics
		}).map((provider) => normalizeProviderId(provider)));
		const syntheticAuthByProvider = /* @__PURE__ */ new Map();
		const cliRuntimeAuthUsages = providerUses.filter((usage) => usage.allowCodexRuntimeFallback).map((usage) => {
			const runtimeProvider = resolveCliRuntimeExecutionProvider({
				provider: usage.provider,
				modelId: usage.model,
				cfg,
				agentId: workspaceAgentId
			});
			const normalizedRuntime = runtimeProvider ? normalizeProviderId(runtimeProvider) : void 0;
			return normalizedRuntime && normalizedRuntime !== usage.provider ? {
				provider: usage.provider,
				model: usage.model,
				allowCodexRuntimeFallback: usage.allowCodexRuntimeFallback,
				runtime: normalizedRuntime
			} : void 0;
		}).filter((usage) => Boolean(usage));
		const providers = Array.from(/* @__PURE__ */ new Set([
			...providersFromStore,
			...providersFromConfig,
			...providersFromModels,
			...providersFromEnv,
			...cliRuntimeAuthUsages.map((usage) => usage.runtime)
		])).map((p) => normalizeOptionalString(p) ?? "").filter(Boolean).toSorted((a, b) => a.localeCompare(b));
		const syntheticProvidersToProbe = new Set(providers.map((provider) => normalizeProviderId(provider)));
		const codexProvider = normalizeProviderId(OPENAI_PROVIDER_ID);
		const codexProviderAlias = aliasMap[codexProvider] ?? codexProvider;
		const codexRuntimeAuthUsages = providerUses.filter((usage) => usage.allowCodexRuntimeFallback && openAIProviderUsesCodexRuntimeByDefault({
			provider: usage.provider,
			config: cfg
		}));
		if (codexRuntimeAuthUsages.length > 0) {
			syntheticProvidersToProbe.add(codexProvider);
			syntheticProvidersToProbe.add(codexProviderAlias);
			syntheticProvidersToProbe.add("codex");
		}
		for (const provider of syntheticProvidersToProbe) {
			const normalized = normalizeProviderId(provider);
			if (!syntheticAuthProviderRefs.has(normalized)) continue;
			const resolvedLocal = resolveProviderSyntheticAuthWithPlugin({
				provider: normalized,
				config: cfg,
				context: {
					config: cfg,
					provider: normalized,
					providerConfig: resolveProviderConfigForStatus(cfg, normalized)
				}
			});
			if (!resolvedLocal) continue;
			const syntheticAuth = {
				value: "plugin-owned",
				source: resolvedLocal.source,
				credential: resolvedLocal.apiKey,
				mode: resolvedLocal.mode,
				expiresAt: resolvedLocal.expiresAt
			};
			syntheticAuthByProvider.set(normalized, syntheticAuth);
			if (normalized === "codex" || normalized === codexProviderAlias) syntheticAuthByProvider.set(codexProvider, syntheticAuth);
		}
		const runtimeCredentialsByProvider = new Map(Array.from(syntheticAuthByProvider.entries()).map(([provider, auth]) => [provider, syntheticAuthCredential(provider, auth)]).filter((entry) => Boolean(entry[1])));
		const applied = getShellEnvAppliedKeys();
		const shellFallbackEnabled = shouldEnableShellEnvFallback(process.env) || cfg.env?.shellEnv?.enabled === true;
		const providerAuth = Array.from(/* @__PURE__ */ new Set([...providers, ...codexRuntimeAuthUsages.length > 0 && syntheticAuthByProvider.has(codexProvider) ? [codexProvider] : []])).toSorted((a, b) => a.localeCompare(b)).map((provider) => resolveProviderAuthOverview({
			provider,
			cfg,
			store,
			modelsPath,
			agentDir,
			workspaceDir,
			syntheticAuth: syntheticAuthByProvider.get(provider),
			aliasMap,
			envCandidateMap,
			authEvidenceMap
		})).filter((entry) => {
			return entry.profiles.count > 0 || Boolean(entry.env) || Boolean(entry.modelsJson) || Boolean(entry.syntheticAuth);
		});
		const providerAuthMap = new Map(providerAuth.map((entry) => [entry.provider, entry]));
		const missingProviderAuthEffective = {
			kind: "missing",
			detail: "missing"
		};
		const authHealth = buildAuthHealthSummary({
			store,
			cfg,
			warnAfterMs: DEFAULT_OAUTH_WARN_MS,
			runtimeCredentialsByProvider,
			allowKeychainPrompt: false
		});
		const authProfileHealthById = new Map(authHealth.profiles.map((profile) => [profile.profileId, profile]));
		const hasUsableAuthProfile = (profileId, credential) => {
			if (credential.type === "api_key") return evaluateStoredCredentialEligibility({ credential }).eligible;
			const health = authProfileHealthById.get(profileId);
			if (health) return health.status === "ok" || health.status === "expiring" || health.status === "static";
			return evaluateStoredCredentialEligibility({ credential }).eligible;
		};
		const resolveProviderAuthHealthId = (provider) => resolveProviderIdForAuth(provider, envLookupParams);
		const listRuntimeAuthProviderCandidates = (provider, options) => {
			const normalizedProvider = normalizeProviderId(provider);
			const candidates = [normalizedProvider, resolveProviderAuthHealthId(normalizedProvider)];
			if (options?.includeLegacyOpenAICodex === true && openAIProviderUsesCodexRuntimeByDefault({
				provider: normalizedProvider,
				config: cfg
			})) candidates.push(OPENAI_PROVIDER_ID, OPENAI_CODEX_PROVIDER_ID);
			return Array.from(new Set(candidates));
		};
		const listProviderProfileCandidates = (provider) => {
			const orderedProfiles = resolveAuthProfileOrder({
				cfg,
				store,
				provider
			});
			const providerKey = normalizeProviderId(provider);
			const providerAuthKey = resolveProviderAuthHealthId(providerKey);
			const explicitOrder = findNormalizedProviderValue(store.order, providerAuthKey) ?? findNormalizedProviderValue(store.order, providerKey) ?? findNormalizedProviderValue(cfg.auth?.order, providerAuthKey) ?? findNormalizedProviderValue(cfg.auth?.order, providerKey);
			const isEligibleOrHealthRescued = (profileId) => {
				const credential = store.profiles[profileId];
				if (!credential) return false;
				const eligibility = resolveAuthProfileEligibility({
					cfg,
					store,
					provider,
					profileId
				});
				if (eligibility.eligible) return true;
				return eligibility.reasonCode === "missing_credential" && credential.type !== "api_key" && hasUsableAuthProfile(profileId, credential);
			};
			if (explicitOrder !== void 0) return Array.from(/* @__PURE__ */ new Set([...orderedProfiles, ...explicitOrder.filter(isEligibleOrHealthRescued)]));
			const configuredProfiles = Object.entries(cfg.auth?.profiles ?? {}).filter(([, profile]) => {
				const profileProvider = normalizeProviderId(profile.provider);
				return profileProvider === providerKey || resolveProviderAuthHealthId(profileProvider) === providerAuthKey;
			}).map(([profileId]) => profileId);
			if (configuredProfiles.length > 0) return Array.from(/* @__PURE__ */ new Set([...orderedProfiles, ...configuredProfiles.filter(isEligibleOrHealthRescued)]));
			const sameProviderProfiles = Object.entries(store.profiles).filter(([, credential]) => {
				const credentialProvider = normalizeProviderId(credential.provider);
				return credentialProvider === providerKey || resolveProviderAuthHealthId(credentialProvider) === providerAuthKey;
			}).map(([profileId]) => profileId).filter(isEligibleOrHealthRescued);
			return Array.from(/* @__PURE__ */ new Set([...orderedProfiles, ...sameProviderProfiles]));
		};
		const resolveRuntimeAuthRouteEffective = (provider) => {
			const candidates = listRuntimeAuthProviderCandidates(provider, { includeLegacyOpenAICodex: true });
			for (const candidate of candidates) {
				const direct = providerAuthMap.get(candidate)?.effective;
				if (direct && direct.kind !== "missing" && (direct.kind !== "profiles" || hasUsableProviderAuth(candidate))) return direct;
			}
			for (const candidate of candidates) {
				const profileId = listProviderProfileCandidates(candidate).find((candidateProfileId) => {
					const candidateCredential = store.profiles[candidateProfileId];
					return candidateCredential ? hasUsableAuthProfile(candidateProfileId, candidateCredential) : false;
				});
				const credential = profileId ? store.profiles[profileId] : void 0;
				if (profileId && credential) {
					const sourceProvider = resolveProviderAuthHealthId(credential.provider);
					const source = providerAuthMap.get(sourceProvider)?.effective;
					return source && source.kind !== "missing" ? source : {
						kind: "profiles",
						detail: `${profileId} (${credential.provider})`
					};
				}
			}
			const direct = providerAuthMap.get(provider)?.effective;
			return direct?.kind === "profiles" ? missingProviderAuthEffective : direct ?? missingProviderAuthEffective;
		};
		const hasUsableNonProfileAuth = (provider, options) => {
			for (const candidate of listRuntimeAuthProviderCandidates(provider, options)) {
				const auth = providerAuthMap.get(candidate);
				if (auth?.env || auth?.syntheticAuth || syntheticAuthByProvider.has(candidate) || resolveUsableCustomProviderApiKey({
					cfg,
					provider: candidate
				})) return true;
			}
			return false;
		};
		const hasUsableDirectProviderAuth = (provider) => {
			const normalized = normalizeProviderId(provider);
			return listProviderProfileCandidates(normalized).some((profileId) => {
				const credential = store.profiles[profileId];
				return credential ? hasUsableAuthProfile(profileId, credential) : false;
			}) || hasUsableNonProfileAuth(normalized);
		};
		const hasUsableProviderAuth = (provider, options) => {
			for (const candidate of listRuntimeAuthProviderCandidates(provider, options)) if (hasUsableDirectProviderAuth(candidate)) return true;
			return false;
		};
		const resolveCliRuntimeAuthProvider = (usage) => cliRuntimeAuthUsages.find((candidate) => candidate.provider === usage.provider && candidate.model === usage.model && candidate.allowCodexRuntimeFallback === usage.allowCodexRuntimeFallback)?.runtime;
		const hasUsableAuthForProviderInUse = (usage, options) => {
			const cliRuntimeAuthProvider = resolveCliRuntimeAuthProvider(usage);
			if (cliRuntimeAuthProvider) return hasUsableDirectProviderAuth(cliRuntimeAuthProvider);
			const { provider } = usage;
			if (hasUsableProviderAuth(provider)) return true;
			if (!options.allowCodexRuntimeFallback) return false;
			return openAIProviderUsesCodexRuntimeByDefault({
				provider,
				config: cfg
			}) && hasUsableProviderAuth("openai", { includeLegacyOpenAICodex: true });
		};
		const runtimeAuthRoutes = Array.from(new Map([...codexRuntimeAuthUsages.map((usage) => {
			const effective = resolveRuntimeAuthRouteEffective(codexProvider);
			return [`${usage.provider}:codex:${codexProvider}`, {
				provider: usage.provider,
				runtime: "codex",
				authProvider: codexProvider,
				status: hasUsableProviderAuth(codexProvider, { includeLegacyOpenAICodex: true }) ? "usable" : "missing",
				effective
			}];
		}), ...cliRuntimeAuthUsages.map((usage) => {
			const effective = resolveRuntimeAuthRouteEffective(usage.runtime);
			return [`${usage.provider}:${usage.runtime}:${usage.runtime}`, {
				provider: usage.provider,
				runtime: usage.runtime,
				authProvider: usage.runtime,
				status: hasUsableDirectProviderAuth(usage.runtime) ? "usable" : "missing",
				effective
			}];
		})]).values()).toSorted((a, b) => a.provider.localeCompare(b.provider));
		const missingProvidersInUse = Array.from(new Set(providerUses.filter((usage) => !hasUsableAuthForProviderInUse(usage, { allowCodexRuntimeFallback: usage.allowCodexRuntimeFallback })).map((usage) => resolveCliRuntimeAuthProvider(usage) ?? usage.provider))).filter((provider) => !isCliProvider(provider, cfg) || cliRuntimeAuthUsages.some((usage) => usage.runtime === provider)).toSorted((a, b) => a.localeCompare(b));
		const probeProfileIds = (() => {
			if (!opts.probeProfile) return [];
			return (Array.isArray(opts.probeProfile) ? opts.probeProfile : [opts.probeProfile]).flatMap((value) => (value ?? "").split(",")).map((value) => value.trim()).filter(Boolean);
		})();
		const probeTimeoutMs = parseOptionalPositiveFiniteOption(opts.probeTimeout, "--probe-timeout", 8e3);
		const probeConcurrency = parseOptionalPositiveIntegerOption(opts.probeConcurrency, "--probe-concurrency", 2);
		const probeMaxTokens = parseOptionalPositiveIntegerOption(opts.probeMaxTokens, "--probe-max-tokens", 8);
		const modelCandidates = [
			rawModel || resolvedLabel,
			...fallbacks,
			imageModel,
			...imageFallbacks,
			...allowed
		].filter(Boolean).map((raw) => resolveModelRefFromString({
			raw: raw ?? "",
			defaultProvider: DEFAULT_PROVIDER,
			aliasIndex,
			...DISPLAY_MODEL_PARSE_OPTIONS
		})?.ref).filter((ref) => Boolean(ref)).map((ref) => `${ref.provider}/${ref.model}`);
		let probeSummary;
		if (opts.probe) {
			const [{ withProgressTotals }, { runAuthProbes }] = await Promise.all([loadProgressRuntime(), loadListProbeRuntime()]);
			probeSummary = await withProgressTotals({
				label: "Probing auth profiles…",
				total: 1
			}, async (update) => {
				return await runAuthProbes({
					cfg,
					agentId: workspaceAgentId,
					agentDir,
					workspaceDir,
					providers,
					modelCandidates,
					options: {
						provider: opts.probeProvider,
						profileIds: probeProfileIds,
						timeoutMs: probeTimeoutMs,
						concurrency: probeConcurrency,
						maxTokens: probeMaxTokens
					},
					onProgress: update
				});
			});
		}
		const providersWithOauth = providerAuth.filter((entry) => entry.profiles.oauth > 0 || entry.profiles.token > 0 || entry.env?.value === "OAuth (env)").map((entry) => {
			const count = entry.profiles.oauth + entry.profiles.token + (entry.env?.value === "OAuth (env)" ? 1 : 0);
			return `${entry.provider} (${count})`;
		});
		const oauthProfiles = authHealth.profiles.filter((profile) => profile.type === "oauth" || profile.type === "token");
		const unusableProfiles = (() => {
			const now = Date.now();
			const out = [];
			for (const profileId of Object.keys(store.usageStats ?? {})) {
				const unusableUntil = resolveProfileUnusableUntilForDisplay(store, profileId);
				if (!unusableUntil || now >= unusableUntil) continue;
				const stats = store.usageStats?.[profileId];
				const kind = typeof stats?.disabledUntil === "number" && now < stats.disabledUntil ? "disabled" : "cooldown";
				out.push({
					profileId,
					provider: store.profiles[profileId]?.provider,
					kind,
					reason: stats?.disabledReason,
					until: unusableUntil,
					remainingMs: unusableUntil - now
				});
			}
			return out.toSorted((a, b) => a.remainingMs - b.remainingMs);
		})();
		const checkStatus = (() => {
			const providersInUse = /* @__PURE__ */ new Set();
			for (const usage of providerUses) {
				const cliRuntimeAuthProvider = resolveCliRuntimeAuthProvider(usage);
				if (cliRuntimeAuthProvider) {
					providersInUse.add(cliRuntimeAuthProvider);
					providersInUse.add(resolveProviderAuthHealthId(cliRuntimeAuthProvider));
					continue;
				}
				providersInUse.add(usage.provider);
				providersInUse.add(resolveProviderAuthHealthId(usage.provider));
				if (usage.allowCodexRuntimeFallback && openAIProviderUsesCodexRuntimeByDefault({
					provider: usage.provider,
					config: cfg
				}) && hasUsableProviderAuth("openai", { includeLegacyOpenAICodex: true })) for (const candidate of listRuntimeAuthProviderCandidates(OPENAI_PROVIDER_ID, { includeLegacyOpenAICodex: true })) providersInUse.add(candidate);
			}
			const hasExpiredOrMissing = authHealth.providers.some((provider) => providersInUse.has(provider.provider) && ["expired", "missing"].includes(provider.status) && !hasUsableNonProfileAuth(provider.provider)) || missingProvidersInUse.length > 0;
			const hasExpiring = authHealth.providers.some((provider) => providersInUse.has(provider.provider) && provider.status === "expiring" && !hasUsableNonProfileAuth(provider.provider));
			if (hasExpiredOrMissing) return 1;
			if (hasExpiring) return 2;
			return 0;
		})();
		if (opts.json) {
			writeRuntimeJson(runtime, {
				configPath,
				...agentId ? { agentId } : {},
				agentDir,
				defaultModel: defaultLabel,
				resolvedDefault: resolvedLabel,
				fallbacks,
				imageModel: imageModel || null,
				imageFallbacks,
				...agentId ? { modelConfig: {
					defaultSource: agentModelPrimary ? "agent" : "defaults",
					fallbacksSource: agentFallbacksOverride !== void 0 ? "agent" : "defaults"
				} } : {},
				aliases,
				allowed,
				auth: {
					storePath: resolveAuthStorePathForDisplay(agentDir),
					shellEnvFallback: {
						enabled: shellFallbackEnabled,
						appliedKeys: applied
					},
					providersWithOAuth: providersWithOauth,
					missingProvidersInUse,
					runtimeAuthRoutes,
					providers: providerAuth,
					unusableProfiles,
					oauth: {
						warnAfterMs: authHealth.warnAfterMs,
						profiles: authHealth.profiles,
						providers: authHealth.providers
					},
					probes: probeSummary
				}
			});
			finishModelsStatusOutput(runtime, opts.check, checkStatus);
			return;
		}
		if (opts.plain) {
			runtime.log(resolvedLabel);
			finishModelsStatusOutput(runtime, opts.check, checkStatus);
			return;
		}
		const rich = isRich(opts);
		const label = (value) => colorize(rich, theme.accent, value.padEnd(14));
		const labelWithSource = (value, source) => label(source ? `${value} (${source})` : value);
		const displayDefault = rawModel && rawModel !== resolvedLabel ? `${resolvedLabel} (from ${rawModel})` : resolvedLabel;
		runtime.log(`${label("Config")}${colorize(rich, theme.muted, ":")} ${colorize(rich, theme.info, shortenHomePath(configPath))}`);
		runtime.log(`${label("Agent dir")}${colorize(rich, theme.muted, ":")} ${colorize(rich, theme.info, shortenHomePath(agentDir))}`);
		runtime.log(`${labelWithSource("Default", agentId ? agentModelPrimary ? "agent" : "defaults" : void 0)}${colorize(rich, theme.muted, ":")} ${colorize(rich, theme.success, displayDefault)}`);
		runtime.log(`${labelWithSource(`Fallbacks (${fallbacks.length || 0})`, agentId ? agentFallbacksOverride !== void 0 ? "agent" : "defaults" : void 0)}${colorize(rich, theme.muted, ":")} ${colorize(rich, fallbacks.length ? theme.warn : theme.muted, fallbacks.length ? fallbacks.join(", ") : "-")}`);
		runtime.log(`${labelWithSource("Image model", agentId ? "defaults" : void 0)}${colorize(rich, theme.muted, ":")} ${colorize(rich, imageModel ? theme.accentBright : theme.muted, imageModel || "-")}`);
		runtime.log(`${labelWithSource(`Image fallbacks (${imageFallbacks.length || 0})`, agentId ? "defaults" : void 0)}${colorize(rich, theme.muted, ":")} ${colorize(rich, imageFallbacks.length ? theme.accentBright : theme.muted, imageFallbacks.length ? imageFallbacks.join(", ") : "-")}`);
		runtime.log(`${label(`Aliases (${Object.keys(aliases).length || 0})`)}${colorize(rich, theme.muted, ":")} ${colorize(rich, Object.keys(aliases).length ? theme.accent : theme.muted, Object.keys(aliases).length ? Object.entries(aliases).map(([alias, target]) => rich ? `${theme.accentDim(alias)} ${theme.muted("->")} ${theme.info(target)}` : `${alias} -> ${target}`).join(", ") : "-")}`);
		runtime.log(`${label(`Configured models (${allowed.length || 0})`)}${colorize(rich, theme.muted, ":")} ${colorize(rich, allowed.length ? theme.info : theme.muted, allowed.length ? allowed.join(", ") : "all")}`);
		runtime.log("");
		runtime.log(colorize(rich, theme.heading, "Auth overview"));
		runtime.log(`${label("Auth store")}${colorize(rich, theme.muted, ":")} ${colorize(rich, theme.info, shortenHomePath(resolveAuthStorePathForDisplay(agentDir)))}`);
		runtime.log(`${label("Shell env")}${colorize(rich, theme.muted, ":")} ${colorize(rich, shellFallbackEnabled ? theme.success : theme.muted, shellFallbackEnabled ? "on" : "off")}${applied.length ? colorize(rich, theme.muted, ` (applied: ${applied.join(", ")})`) : ""}`);
		runtime.log(`${label(`Providers w/ OAuth/tokens (${providersWithOauth.length || 0})`)}${colorize(rich, theme.muted, ":")} ${colorize(rich, providersWithOauth.length ? theme.info : theme.muted, providersWithOauth.length ? providersWithOauth.join(", ") : "-")}`);
		const formatKey = (key) => colorize(rich, theme.warn, key);
		const formatKeyValue = (key, value) => `${formatKey(key)}=${colorize(rich, theme.info, value)}`;
		const formatSeparator = () => colorize(rich, theme.muted, " | ");
		for (const entry of providerAuth) {
			const separator = formatSeparator();
			const bits = [];
			bits.push(formatKeyValue("effective", `${colorize(rich, theme.accentBright, entry.effective.kind)}:${colorize(rich, theme.muted, entry.effective.detail)}`));
			if (entry.profiles.count > 0) {
				bits.push(formatKeyValue("profiles", `${entry.profiles.count} (oauth=${entry.profiles.oauth}, token=${entry.profiles.token}, api_key=${entry.profiles.apiKey})`));
				if (entry.profiles.labels.length > 0) bits.push(colorize(rich, theme.info, entry.profiles.labels.join(", ")));
			}
			if (entry.env) bits.push(formatKeyValue("env", `${entry.env.value}${separator}${formatKeyValue("source", entry.env.source)}`));
			if (entry.modelsJson) bits.push(formatKeyValue("models.json", `${entry.modelsJson.value}${separator}${formatKeyValue("source", entry.modelsJson.source)}`));
			if (entry.syntheticAuth) bits.push(formatKeyValue("synthetic", `${entry.syntheticAuth.value}${separator}${formatKeyValue("source", entry.syntheticAuth.source)}`));
			runtime.log(`- ${theme.heading(entry.provider)} ${bits.join(separator)}`);
		}
		if (runtimeAuthRoutes.length > 0) {
			runtime.log("");
			runtime.log(colorize(rich, theme.heading, "Runtime auth"));
			for (const route of runtimeAuthRoutes) runtime.log(`- ${theme.heading(route.provider)} via ${colorize(rich, theme.accentBright, route.runtime)} uses ${theme.heading(route.authProvider)} ${formatKeyValue("effective", `${colorize(rich, theme.accentBright, route.effective.kind)}:${colorize(rich, theme.muted, route.effective.detail)}`)}${formatSeparator()}${formatKeyValue("status", route.status)}`);
		}
		if (missingProvidersInUse.length > 0) {
			const { buildProviderAuthRecoveryHint } = await import("./provider-auth-recovery-hint-D1lN3k7y.js");
			runtime.log("");
			runtime.log(colorize(rich, theme.heading, "Missing auth"));
			for (const provider of missingProvidersInUse) {
				const hint = buildProviderAuthRecoveryHint({
					provider,
					config: cfg,
					includeEnvVar: true
				});
				runtime.log(`- ${theme.heading(provider)} ${hint}`);
			}
		}
		runtime.log("");
		runtime.log(colorize(rich, theme.heading, "OAuth/token status"));
		if (oauthProfiles.length === 0) runtime.log(colorize(rich, theme.muted, "- none"));
		else {
			const { formatUsageWindowSummary, loadProviderUsageSummary, resolveUsageProviderId } = await loadProviderUsageRuntime();
			const usageByProvider = /* @__PURE__ */ new Map();
			const usageProviders = Array.from(new Set(oauthProfiles.map((profile) => resolveUsageProviderId(profile.provider, { credentialType: profile.type })).filter((provider) => Boolean(provider))));
			if (usageProviders.length > 0) try {
				const usageSummary = await loadProviderUsageSummary({
					providers: usageProviders,
					agentDir,
					timeoutMs: 3500
				});
				for (const snapshot of usageSummary.providers) {
					const formatted = formatUsageWindowSummary(snapshot, {
						now: Date.now(),
						maxWindows: 2,
						includeResets: true
					});
					if (formatted) usageByProvider.set(snapshot.provider, formatted);
				}
			} catch {}
			const formatStatus = (status) => {
				if (status === "ok") return colorize(rich, theme.success, "ok");
				if (status === "static") return colorize(rich, theme.muted, "static");
				if (status === "expiring") return colorize(rich, theme.warn, "expiring");
				if (status === "missing") return colorize(rich, theme.warn, "unknown");
				return colorize(rich, theme.error, "expired");
			};
			const profilesByProvider = /* @__PURE__ */ new Map();
			for (const profile of oauthProfiles) {
				const current = profilesByProvider.get(profile.provider);
				if (current) current.push(profile);
				else profilesByProvider.set(profile.provider, [profile]);
			}
			for (const [provider, profiles] of profilesByProvider) {
				const usageKey = resolveUsageProviderId(provider, { credentialType: profiles.find((profile) => profile.type === "oauth" || profile.type === "token")?.type });
				const usage = usageKey ? usageByProvider.get(usageKey) : void 0;
				const usageSuffix = usage ? colorize(rich, theme.muted, ` usage: ${usage}`) : "";
				runtime.log(`- ${colorize(rich, theme.heading, provider)}${usageSuffix}`);
				for (const profile of profiles) {
					const labelText = profile.label || profile.profileId;
					const labelLocal = colorize(rich, theme.accent, labelText);
					const status = formatStatus(profile.status);
					const expiry = profile.status === "static" ? "" : profile.expiresAt ? ` expires in ${formatRemainingShort(profile.remainingMs)}` : " expires unknown";
					runtime.log(`  - ${labelLocal} ${status}${expiry}`);
				}
			}
		}
		if (probeSummary) {
			const [{ getTerminalTableWidth, renderTable }, { describeProbeSummary, formatProbeLatency, sortProbeResults }] = await Promise.all([loadTerminalTableRuntime(), loadListProbeRuntime()]);
			runtime.log("");
			runtime.log(colorize(rich, theme.heading, "Auth probes"));
			if (probeSummary.results.length === 0) runtime.log(colorize(rich, theme.muted, "- none"));
			else {
				const tableWidth = getTerminalTableWidth();
				const sorted = sortProbeResults(probeSummary.results);
				const statusColor = (status) => {
					if (status === "ok") return theme.success;
					if (status === "rate_limit") return theme.warn;
					if (status === "timeout" || status === "billing") return theme.warn;
					if (status === "auth" || status === "format") return theme.error;
					if (status === "no_model") return theme.muted;
					return theme.muted;
				};
				const rows = sorted.map((result) => {
					const status = colorize(rich, statusColor(result.status), result.status);
					const latency = formatProbeLatency(result.latencyMs);
					const modelLabel = result.model ?? `${result.provider}/-`;
					const modeLabel = result.mode ? ` ${colorize(rich, theme.muted, `(${result.mode})`)}` : "";
					const profile = `${colorize(rich, theme.accent, result.label)}${modeLabel}`;
					const detail = result.error?.trim();
					const detailLabel = detail ? `\n${colorize(rich, theme.muted, `↳ ${detail}`)}` : "";
					const statusLabel = `${status}${colorize(rich, theme.muted, ` · ${latency}`)}${detailLabel}`;
					return {
						Model: colorize(rich, theme.heading, modelLabel),
						Profile: profile,
						Status: statusLabel
					};
				});
				runtime.log(renderTable({
					width: tableWidth,
					columns: [
						{
							key: "Model",
							header: "Model",
							minWidth: 18
						},
						{
							key: "Profile",
							header: "Profile",
							minWidth: 24
						},
						{
							key: "Status",
							header: "Status",
							minWidth: 12
						}
					],
					rows
				}).trimEnd());
				runtime.log(colorize(rich, theme.muted, describeProbeSummary(probeSummary)));
			}
		}
		finishModelsStatusOutput(runtime, opts.check, checkStatus);
	} finally {
		cleanupPluginMetadataSnapshot();
	}
}
//#endregion
export { modelsStatusCommand };
