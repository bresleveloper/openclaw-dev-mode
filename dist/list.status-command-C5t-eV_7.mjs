import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { o as writeRuntimeJson, s as writeRuntimeStdout } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { i as normalizeProviderIdForAuth, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { s as stripSelfProviderModelPrefix } from "./provider-model-id-normalization-C-mafmHb.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { s as parseModelPolicyWildcardRef } from "./model-policy-allowlist-migration-BErDvsnV.mjs";
import { c as resolveAgentNativeModelPrimary, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { N as resolveProfileUnusableUntilForDisplay } from "./user-model-account-authority-DFFjC5J5.mjs";
import { n as loadPersistedAuthProfileStore } from "./persisted-DbIYEoQ3.mjs";
import { l as shouldEnableShellEnvFallback, n as getShellEnvAppliedKeys } from "./shell-env-DzVIOYTd.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-DXrnO3F4.mjs";
import { s as resolveProviderAuthLookupMaps } from "./provider-env-vars-D43Pu6eG.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { b as readUtilityModelSetting, h as resolveConfiguredModelRef, i as buildModelAliasIndex, m as resolveConfiguredModelPolicyAllow, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { a as resolveModelCatalogIdentityKey } from "./openai-model-routes-BJEokkWC.mjs";
import { n as OPENAI_PROVIDER_ID } from "./openai-routing-Bm7d8DH8.mjs";
import { i as buildAuthProfileUnusableHint } from "./oauth-refresh-failure-H1_-S915.mjs";
import "./config-B3oiWDlr.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-pIK04Peo.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as isCliProvider } from "./model-selection-cli-CxV7VRIV.mjs";
import { f as listProfilesForProvider } from "./order-CElLtwMu.mjs";
import { c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { t as NON_ENV_SECRETREF_MARKER } from "./provider-credential-values-Cf7LMsFg.mjs";
import { c as isOAuthApiKeyMarker, f as listProviderEnvAuthLookupKeys, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { o as getRuntimeAuthProfileStoreSnapshot } from "./store-BPXZsh12.mjs";
import { r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { p as resolveManagedSecretRefRuntimeProviderAuth } from "./loader-runtime-load-DzFljQbT.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CPdn6zH8.mjs";
import { b as resolveUsableCustomProviderApiKey, g as resolveProviderConfigSecretInput, n as getCustomProviderApiKey } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { r as ensureAuthProfileStore, s as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-CwqGD12G.mjs";
import { a as resolveUtilityModelRefForAgent } from "./utility-model-nsnbR10X.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import { c as resolveAuthStorePathForDisplay } from "./oauth-refresh-fence-eL04wGfj.mjs";
import "./profiles-Df1OQ7iN.mjs";
import "./usage-CRucybdr.mjs";
import { g as prepareProviderSyntheticAuthWithPlugin } from "./provider-runtime-DZ8luukj.mjs";
import { i as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { t as resolveAuthProfileDisplayLabel } from "./display-D4lohsyV.mjs";
import { r as resolveAgentHarnessOwnerPluginIds } from "./runtime-plugin-load-plan-Cjd4Pbax.mjs";
import { r as maskApiKey } from "./model-catalog-auth-labels-BDvpEt70.mjs";
import { n as buildAuthHealthSummary, r as formatRemainingShort, t as DEFAULT_OAUTH_WARN_MS } from "./auth-health-DSeUDpNd.mjs";
import { a as loadPreparedModelCatalogSnapshot } from "./prepared-model-catalog-B9Dr8wIV.mjs";
import "./model-auth-CMoPmop7.mjs";
import { n as resolveAgentHarnessRuntimeAvailability } from "./runtime-plugin-Cq540iGR.mjs";
import { g as isRich, h as groupByProvider, l as resolveModelsTargetAgent, n as ensureFlagCompatibility, r as formatMs } from "./shared-Ck_WZImY.mjs";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-BPF9Xw78.mjs";
import { t as listUnavailableAuthProfiles } from "./auth-unavailability-BgFAFVNU.mjs";
import { t as loadModelsConfig } from "./load-config-DvAs1Afc.mjs";
import { n as readModelCatalogWarnings } from "./catalog-warnings-CCdCgm4g.mjs";
import path from "node:path";
//#region src/commands/models/list.auth-overview.ts
/**
* Count-first wording on purpose: `token=1`/`api_key=0` would match the console
* secret redactor's key=value patterns and get masked into garbled output.
*/
function formatProviderAuthProfileCounts(profiles) {
	return `${profiles.count} (${profiles.oauth} oauth, ${profiles.token} token, ${profiles.apiKey} api-key)`;
}
function formatMarkerOrSecret(value) {
	return isNonSecretApiKeyMarker(value, { includeEnvVarName: false }) ? `marker(${value.trim()})` : maskApiKey(value);
}
function formatProfileSecretLabel(params) {
	const value = normalizeOptionalString(params.value) ?? "";
	const display = value ? formatMarkerOrSecret(value) : params.ref ? `ref(${params.ref.source}:${params.ref.id})` : "missing";
	return params.kind === "token" ? `token:${display}` : display;
}
function resolveProfileSourceAgentDir(params) {
	if (!params.agentDir || params.profileIds.length === 0) return params.agentDir;
	const localStore = loadPersistedAuthProfileStore(params.agentDir);
	if (params.profileIds.some((profileId) => Boolean(localStore?.profiles[profileId]))) return params.agentDir;
	const mainStore = loadPersistedAuthProfileStore(void 0);
	return params.profileIds.every((profileId) => Boolean(mainStore?.profiles[profileId])) ? void 0 : params.agentDir;
}
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
		if (profile.type === "api_key" || profile.type === "token") return withUnusableSuffix(`${profileId}=${formatProfileSecretLabel({
			value: profile.type === "api_key" ? profile.key : profile.token,
			ref: profile.type === "api_key" ? profile.keyRef : profile.tokenRef,
			kind: profile.type === "api_key" ? "api-key" : "token"
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
	const env = envKey ? {
		value: envKey.source.includes("OAUTH_TOKEN") || normalizeLowercaseStringOrEmpty(envKey.source).includes("oauth") ? "OAuth (env)" : maskApiKey(envKey.apiKey),
		source: envKey.source
	} : void 0;
	const customKey = getCustomProviderApiKey(cfg, provider);
	const usableCustomKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider
	});
	const providerApiKeyRef = resolveProviderConfigSecretInput(cfg, provider).ref;
	return {
		provider,
		effective: (() => {
			if (providerApiKeyRef) {
				if (providerApiKeyRef.source !== "env" && resolveManagedSecretRefRuntimeProviderAuth({
					cfg,
					provider
				})) return {
					kind: "models.json",
					detail: formatMarkerOrSecret(NON_ENV_SECRETREF_MARKER)
				};
				if (!usableCustomKey) return {
					kind: "missing",
					detail: "missing"
				};
				return providerApiKeyRef.source === "env" ? {
					kind: "env",
					detail: maskApiKey(usableCustomKey.apiKey)
				} : {
					kind: "models.json",
					detail: formatMarkerOrSecret(usableCustomKey.apiKey)
				};
			}
			if (profiles.length > 0) return {
				kind: "profiles",
				detail: shortenHomePath(resolveAuthStorePathForDisplay(resolveProfileSourceAgentDir({
					agentDir: params.agentDir,
					profileIds: profiles
				})))
			};
			if (env) return {
				kind: "env",
				detail: env.value
			};
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
		...env ? { env } : {},
		...customKey ? { modelsJson: {
			value: formatMarkerOrSecret(customKey),
			source: `models.json: ${shortenHomePath(params.modelsPath)}`
		} } : {},
		...params.syntheticAuth ? { syntheticAuth: {
			value: params.syntheticAuth.value,
			source: params.syntheticAuth.source
		} } : {}
	};
}
//#endregion
//#region src/commands/models/list.status-command.ts
const listProbeRuntimeLoader = createLazyImportLoader(() => import("./list.probe-DPjkx48C.mjs"));
const DISPLAY_MODEL_PARSE_OPTIONS = { allowPluginNormalization: false };
function resolveStatusProviderUseIncompatibility(usage) {
	const routeResolution = usage.evaluation.routeResolution;
	return routeResolution?.kind === "incompatible" ? routeResolution : usage.runtimeIncompatibility;
}
function parseProbeOption(raw, label, fallback, kind = "number") {
	if (raw === void 0 || raw === null) return fallback;
	const parsed = kind === "integer" ? parseStrictPositiveInteger(raw) : parseStrictFiniteNumber(raw);
	if (parsed === void 0 || parsed <= 0) throw new Error(`${label} must be a positive ${kind}.`);
	return parsed;
}
function syntheticAuthCredential(provider, auth) {
	if (!auth.mode) return;
	if (auth.mode === "api-key") return {
		type: "api_key",
		provider,
		key: auth.credential
	};
	if (auth.mode === "token" || auth.mode === "oauth") return {
		type: "token",
		provider,
		token: auth.credential,
		expires: auth.expiresAt
	};
}
function finishModelsStatusOutput(runtime, check, checkStatus) {
	if (!requestExitAfterOneShotOutput(runtime, check ? checkStatus : void 0) && check) runtime.exit(checkStatus);
}
async function modelsStatusCommand(opts, runtime) {
	ensureFlagCompatibility(opts);
	if (opts.plain && opts.probe) throw new Error("--probe cannot be used with --plain output.");
	const configPath = createConfigIO().configPath;
	const cfg = await loadModelsConfig({
		commandName: "models status",
		runtime,
		skipPluginValidation: opts.probe !== true
	});
	for (const warning of await readModelCatalogWarnings(cfg, opts.agent?.trim())) runtime.error(`${warning.message} ${warning.fixHint}`);
	const explicitAgentId = opts.agent?.trim();
	const envAgentDir = process.env.OPENCLAW_AGENT_DIR?.trim() || process.env.PI_CODING_AGENT_DIR?.trim();
	const { agentId: workspaceAgentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent, {
		agentDirOverride: !explicitAgentId && envAgentDir ? resolveUserPath(envAgentDir) : void 0,
		kind: "read"
	});
	const agentId = explicitAgentId ? workspaceAgentId : void 0;
	const workspaceDir = resolveAgentWorkspaceDir(cfg, workspaceAgentId);
	const agentModelPrimary = agentId ? resolveAgentNativeModelPrimary(cfg, agentId) : void 0;
	const agentFallbacksOverride = agentId ? resolveAgentModelFallbacksOverride(cfg, agentId) : void 0;
	const metadataSnapshot = loadManifestMetadataSnapshot({
		config: cfg,
		workspaceDir,
		env: process.env
	});
	const selectedPluginRootDirs = new Map([...metadataSnapshot.byPluginId].map(([pluginId, plugin]) => [pluginId, plugin.rootDir]));
	const codexRuntimeAvailabilityByProvider = /* @__PURE__ */ new Map();
	const resolveCodexRuntimeAvailability = (provider) => {
		const cached = codexRuntimeAvailabilityByProvider.get(provider);
		if (cached) return cached;
		const pending = (async () => {
			const { runPluginPayloadSmokeCheckForManifestRecords } = await import("./payload-verification-WdGbtzK6.mjs");
			const pluginPayloadSmoke = await runPluginPayloadSmokeCheckForManifestRecords({
				plugins: resolveAgentHarnessOwnerPluginIds({
					runtime: "codex",
					provider,
					config: cfg,
					workspaceDir
				}).flatMap((pluginId) => {
					const plugin = metadataSnapshot.byPluginId.get(pluginId);
					return plugin ? [plugin] : [];
				}),
				env: process.env
			});
			return resolveAgentHarnessRuntimeAvailability({
				runtime: "codex",
				provider,
				config: cfg,
				workspaceDir,
				payloadFailures: pluginPayloadSmoke.failures,
				payloadCheckedPluginIds: pluginPayloadSmoke.checked,
				selectedPluginRootDirs
			});
		})();
		codexRuntimeAvailabilityByProvider.set(provider, pending);
		return pending;
	};
	return withPluginMetadataSnapshotScope(metadataSnapshot, async () => {
		const resolved = resolveConfiguredModelRef({
			cfg,
			agentId,
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
		const utilitySetting = readUtilityModelSetting(cfg, workspaceAgentId);
		const utilityModelRef = resolveUtilityModelRefForAgent({
			cfg,
			agentId: workspaceAgentId
		});
		const utilityModelSource = utilitySetting.kind === "explicit" ? "config" : utilitySetting.kind === "disabled" ? "disabled" : utilityModelRef ? "provider-default" : "none";
		const configuredAllowRefs = [...resolveConfiguredModelPolicyAllow({
			cfg,
			agentId: workspaceAgentId
		}).refs];
		const modelsPath = path.join(agentDir, "models.json");
		const aliasIndex = buildModelAliasIndex({
			cfg,
			agentId,
			defaultProvider: DEFAULT_PROVIDER,
			...DISPLAY_MODEL_PARSE_OPTIONS
		});
		const aliases = Object.fromEntries([...aliasIndex.byAlias.values()].map((match) => [match.alias, modelKey(match.ref.provider, match.ref.model)]));
		const resolveStatusModelRef = (raw) => {
			const modelRef = raw?.trim();
			if (!modelRef) return;
			return resolveModelRefFromString({
				cfg,
				agentId,
				raw: modelRef,
				defaultProvider: DEFAULT_PROVIDER,
				aliasIndex,
				...DISPLAY_MODEL_PARSE_OPTIONS
			})?.ref;
		};
		const store = [defaultLabel, ...fallbacks].some((raw) => normalizeProviderId(resolveStatusModelRef(raw)?.provider ?? "") === "openai") ? ensureAuthProfileStore(agentDir, {
			allowKeychainPrompt: false,
			config: cfg,
			externalCliProviderIds: [OPENAI_PROVIDER_ID],
			readOnly: true
		}) : ensureAuthProfileStoreWithoutExternalProfiles(agentDir);
		const providersFromStore = new Set(Object.values(store.profiles).map((profile) => normalizeProviderId(profile.provider)).filter((p) => Boolean(p)));
		const providersFromConfig = new Set(Object.keys(cfg.models?.providers ?? {}).map(normalizeProviderId).filter(Boolean));
		const providersFromModels = /* @__PURE__ */ new Set();
		const modelCandidates = [];
		const providerUseRefs = [];
		for (const [refs, routeScope, allowCodexRuntimeFallback] of [
			[
				[defaultLabel, ...fallbacks],
				"text",
				true
			],
			[
				[imageModel, ...imageFallbacks],
				"image",
				false
			],
			[
				[utilityModelRef],
				"text",
				false
			],
			[
				configuredAllowRefs,
				void 0,
				false
			]
		]) for (const raw of refs) {
			const ref = resolveStatusModelRef(raw);
			if (!ref) continue;
			modelCandidates.push(`${ref.provider}/${ref.model}`);
			if (ref.provider) {
				const provider = normalizeProviderId(ref.provider);
				providersFromModels.add(provider);
				if (routeScope) providerUseRefs.push({
					provider,
					model: ref.model,
					allowCodexRuntimeFallback,
					routeScope
				});
			}
		}
		const resolvedUtilityRef = utilityModelRef ? resolveStatusModelRef(utilityModelRef) : void 0;
		const utilityModelDisplayRef = resolvedUtilityRef ? modelKey(normalizeProviderId(resolvedUtilityRef.provider), resolvedUtilityRef.model) : utilityModelRef ?? null;
		const providersFromEnv = /* @__PURE__ */ new Set();
		const envLookupParams = {
			config: cfg,
			workspaceDir,
			env: process.env,
			metadataSnapshot
		};
		const { aliasMap, envCandidateMap, authEvidenceMap } = resolveProviderAuthLookupMaps(envLookupParams);
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
		const createStatusAuthResolver = (authStore, nativeMode) => createModelAuthAvailabilityResolver({
			cfg,
			agentId: workspaceAgentId,
			authStore,
			agentDir,
			workspaceDir,
			env: process.env,
			syntheticAuthProviderRefs: [...syntheticAuthProviderRefs],
			preparedRuntimeAuthModes: nativeMode ? { codex: {
				source: "native",
				mode: nativeMode
			} } : {},
			metadataSnapshot
		});
		let authResolver = createStatusAuthResolver(store);
		const probedProvider = normalizeOptionalString(opts.probeProvider);
		const providerDiscoveryProviderIds = [.../* @__PURE__ */ new Set([
			...authResolver.providerDiscoveryProviderIds,
			...providersFromConfig,
			...providersFromModels,
			...probedProvider ? [normalizeProviderId(probedProvider)] : []
		])].toSorted((left, right) => left.localeCompare(right));
		const catalog = await loadPreparedModelCatalogSnapshot({
			config: cfg,
			agentId: workspaceAgentId,
			providerDiscoveryProviderIds,
			readOnly: true
		});
		const visibilityPolicy = createModelVisibilityPolicy({
			cfg,
			catalog: catalog.entries,
			defaultProvider: resolved.provider,
			defaultModel: resolved,
			agentId: workspaceAgentId,
			...DISPLAY_MODEL_PARSE_OPTIONS
		});
		const allowed = visibilityPolicy.allowAny ? [] : [.../* @__PURE__ */ new Set([...visibilityPolicy.allowedCatalog.map((entry) => modelKey(entry.provider, entry.id)), ...configuredAllowRefs.flatMap((raw) => {
			const wildcard = parseModelPolicyWildcardRef(raw);
			if (!wildcard) return [];
			const prefix = wildcard.key.slice(0, -1);
			return catalog.entries.some((entry) => modelKey(entry.provider, entry.id).startsWith(prefix)) ? [] : [wildcard.key];
		})])].toSorted();
		const routeSourcesByModel = /* @__PURE__ */ new Map();
		const resolveStatusRouteIdentityKey = (entry) => {
			const provider = normalizeProviderId(entry.provider);
			return resolveModelCatalogIdentityKey({
				provider,
				id: stripSelfProviderModelPrefix(provider, modelKey(provider, entry.id))
			});
		};
		for (const entry of catalog.routeVariants) {
			if (entry.api === void 0 && entry.baseUrl === void 0) continue;
			const key = resolveStatusRouteIdentityKey(entry);
			const sources = routeSourcesByModel.get(key) ?? [];
			sources.push({
				api: entry.api,
				baseUrl: entry.baseUrl
			});
			routeSourcesByModel.set(key, sources);
		}
		const resolveProviderUses = async (resolver) => await Promise.all(providerUseRefs.map(async (usage) => {
			const observedRoutes = routeSourcesByModel.get(resolveStatusRouteIdentityKey({
				provider: usage.provider,
				id: usage.model
			}));
			const ref = {
				modelId: usage.model,
				...observedRoutes ? { observedRoutes } : {}
			};
			const rawEvaluation = usage.routeScope === "text" ? usage.allowCodexRuntimeFallback ? resolver.evaluateRuntimeModelAuth(usage.provider, ref) : resolver.evaluateModelAuth(usage.provider, ref) : {
				availability: resolver.resolveProviderAuthAvailability(usage.provider, ref),
				routeResolution: null
			};
			const requestedCodexRuntimeAuth = !(rawEvaluation.routeResolution?.kind === "incompatible") && usage.allowCodexRuntimeFallback && resolveAgentHarnessPolicy({
				provider: usage.provider,
				modelId: usage.model,
				...rawEvaluation.selectedRoute ? {
					modelApi: rawEvaluation.selectedRoute.api,
					modelBaseUrl: rawEvaluation.selectedRoute.baseUrl
				} : {},
				config: cfg,
				agentId: workspaceAgentId
			}).runtime === "codex";
			const runtimeIncompatibility = requestedCodexRuntimeAuth && usage.provider !== "openai" && usage.provider !== "codex" ? {
				code: "unsupported-codex-runtime-provider",
				message: `The Codex runtime does not support provider ${usage.provider}.`
			} : void 0;
			const usesCodexRuntimeAuth = requestedCodexRuntimeAuth && runtimeIncompatibility === void 0;
			const runtimeAvailability = usesCodexRuntimeAuth ? await resolveCodexRuntimeAvailability(usage.provider) : void 0;
			return {
				provider: usage.provider,
				model: usage.model,
				allowCodexRuntimeFallback: usage.allowCodexRuntimeFallback,
				evaluation: rawEvaluation,
				usesCodexRuntimeAuth,
				runtimeAvailability,
				runtimeIncompatibility
			};
		}));
		let providerUses = await resolveProviderUses(authResolver);
		const syntheticAuthByProvider = /* @__PURE__ */ new Map();
		const runtimeSyntheticAuthByProvider = /* @__PURE__ */ new Map();
		const cliRuntimeAuthUsages = providerUses.filter((usage) => usage.allowCodexRuntimeFallback && !usage.usesCodexRuntimeAuth).map((usage) => {
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
		let codexRuntimeAuthUsages = providerUses.filter((usage) => usage.usesCodexRuntimeAuth);
		if (codexRuntimeAuthUsages.length > 0) {
			syntheticProvidersToProbe.add(codexProvider);
			syntheticProvidersToProbe.add(codexProviderAlias);
			syntheticProvidersToProbe.add("codex");
		}
		for (const provider of syntheticProvidersToProbe) {
			const normalized = normalizeProviderId(provider);
			if (!syntheticAuthProviderRefs.has(normalized)) continue;
			const resolvedLocal = await prepareProviderSyntheticAuthWithPlugin({
				provider: normalized,
				config: cfg,
				workspaceDir,
				context: {
					config: cfg,
					provider: normalized,
					providerConfig: resolveMergedModelProviderConfig(cfg, normalized)
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
			if (normalized !== "codex") runtimeSyntheticAuthByProvider.set(normalized, syntheticAuth);
			if (normalized !== "codex" && normalized === codexProviderAlias) syntheticAuthByProvider.set(codexProvider, syntheticAuth);
		}
		const runtimeCredentialsByProvider = new Map(Array.from(runtimeSyntheticAuthByProvider.entries()).map(([provider, auth]) => [provider, syntheticAuthCredential(provider, auth)]).filter((entry) => Boolean(entry[1])));
		const nativeCodexMode = syntheticAuthByProvider.get("codex")?.mode;
		if (runtimeCredentialsByProvider.size > 0 || nativeCodexMode) {
			const syntheticProfiles = Object.fromEntries(Array.from(runtimeCredentialsByProvider.entries()).map(([provider, credential]) => [`${provider}:runtime-synthetic`, credential]));
			authResolver = createStatusAuthResolver({
				...store,
				profiles: {
					...store.profiles,
					...syntheticProfiles
				}
			}, nativeCodexMode === "api-key" ? "api_key" : nativeCodexMode);
			providerUses = await resolveProviderUses(authResolver);
			codexRuntimeAuthUsages = providerUses.filter((usage) => usage.usesCodexRuntimeAuth);
		}
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
		})).filter((entry) => entry.profiles.count > 0 || Boolean(entry.env) || Boolean(entry.modelsJson) || Boolean(entry.syntheticAuth));
		const providerAuthMap = new Map(providerAuth.map((entry) => [entry.provider, entry]));
		const missingProviderAuthEffective = {
			kind: "missing",
			detail: "missing"
		};
		const runtimeAuthStore = getRuntimeAuthProfileStoreSnapshot(agentDir);
		const healthStore = runtimeAuthStore ? {
			...store,
			profiles: {
				...store.profiles,
				...runtimeAuthStore.profiles
			}
		} : store;
		const authHealth = buildAuthHealthSummary({
			store: healthStore,
			cfg,
			warnAfterMs: DEFAULT_OAUTH_WARN_MS,
			runtimeCredentialsByProvider
		});
		const authProfileHealthById = new Map(authHealth.profiles.map((profile) => [profile.profileId, profile]));
		const resolveRuntimeAuthRouteEffective = (provider, evaluation) => {
			if (!evaluation) return providerAuthMap.get(provider)?.effective ?? missingProviderAuthEffective;
			if (evaluation?.availability === false) return missingProviderAuthEffective;
			if (evaluation.runtimeAuth?.source === "native") return {
				kind: "synthetic",
				detail: syntheticAuthByProvider.get(evaluation.runtimeAuth.id)?.source ?? "native login"
			};
			const candidates = Array.from(/* @__PURE__ */ new Set([normalizeProviderId(provider), resolveProviderIdForAuth(provider, envLookupParams)]));
			const profileId = evaluation.selectedProfileId;
			if (profileId) {
				const credentialProvider = store.profiles[profileId]?.provider ?? provider;
				const source = providerAuthMap.get(resolveProviderIdForAuth(credentialProvider, envLookupParams))?.effective;
				return source && source.kind !== "missing" ? source : {
					kind: "profiles",
					detail: profileId
				};
			}
			for (const candidate of candidates) {
				const auth = providerAuthMap.get(candidate);
				if (evaluation.evidence === "environment" && auth?.env) return {
					kind: "env",
					detail: auth.env.value
				};
				if ((evaluation.evidence === "provider-config" || evaluation.evidence === "runtime") && auth?.modelsJson) return {
					kind: "models.json",
					detail: auth.modelsJson.value
				};
				if (evaluation.evidence === "synthetic" && syntheticAuthByProvider.has(candidate)) return {
					kind: "synthetic",
					detail: syntheticAuthByProvider.get(candidate)?.source ?? "plugin-owned"
				};
			}
			return providerAuthMap.get(provider)?.effective ?? missingProviderAuthEffective;
		};
		const resolveCliRuntimeAuthProvider = (usage) => cliRuntimeAuthUsages.find((candidate) => candidate.provider === usage.provider && candidate.model === usage.model && candidate.allowCodexRuntimeFallback === usage.allowCodexRuntimeFallback)?.runtime;
		const evaluateProviderUseAuth = (usage) => {
			const runtimeProvider = resolveCliRuntimeAuthProvider(usage);
			return runtimeProvider ? authResolver.evaluateModelAuth(runtimeProvider) : usage.evaluation;
		};
		const hasUsableAuthForProviderInUse = (usage) => {
			const cliRuntimeAuthProvider = resolveCliRuntimeAuthProvider(usage);
			if (cliRuntimeAuthProvider) return authResolver.resolveProviderAuthAvailability(cliRuntimeAuthProvider) !== false;
			if (resolveStatusProviderUseIncompatibility(usage)) return true;
			return usage.evaluation.availability !== false;
		};
		const runtimeAuthRouteEntries = [...Array.from(groupByProvider(codexRuntimeAuthUsages)).map(([provider, usages]) => {
			const representative = usages.find((usage) => usage.evaluation.availability === true) ?? usages[0];
			const effective = resolveRuntimeAuthRouteEffective(codexProvider, representative?.evaluation);
			const availabilities = usages.map((usage) => usage.evaluation.availability);
			const authStatus = availabilities.every((availability) => availability === true) ? "usable" : availabilities.some((availability) => availability === false) ? "missing" : "indeterminate";
			const runtimeAvailability = representative?.runtimeAvailability;
			const base = {
				provider,
				runtime: "codex",
				authProvider: codexProvider,
				status: authStatus,
				effective
			};
			const route = runtimeAvailability?.status === "unavailable" ? {
				...base,
				status: "unavailable",
				authStatus,
				runtimeStatus: runtimeAvailability.status,
				runtimeReason: runtimeAvailability.reason,
				runtimeDetail: runtimeAvailability.detail,
				runtimePluginIds: runtimeAvailability.ownerPluginIds
			} : base;
			return [`${provider}:codex:${codexProvider}`, route];
		}), ...cliRuntimeAuthUsages.map((usage) => {
			const evaluation = authResolver.evaluateModelAuth(usage.runtime);
			const effective = resolveRuntimeAuthRouteEffective(usage.runtime, evaluation);
			return [`${usage.provider}:${usage.runtime}:${usage.runtime}`, {
				provider: usage.provider,
				runtime: usage.runtime,
				authProvider: usage.runtime,
				status: evaluation.availability === true ? "usable" : evaluation.availability === false ? "missing" : "indeterminate",
				effective
			}];
		})];
		const runtimeAuthRoutes = Array.from(new Map(runtimeAuthRouteEntries).values()).toSorted((a, b) => a.provider.localeCompare(b.provider));
		const modelRouteIssues = providerUses.flatMap((usage) => {
			const evaluation = evaluateProviderUseAuth(usage);
			const incompatibility = resolveStatusProviderUseIncompatibility(usage);
			if (incompatibility) return {
				kind: "incompatible",
				provider: usage.provider,
				model: usage.model,
				code: incompatibility.code,
				message: incompatibility.message
			};
			if (evaluation.availability === void 0) return {
				kind: "indeterminate",
				provider: usage.provider,
				model: usage.model,
				...evaluation.evidence ? { evidence: evaluation.evidence } : {},
				message: `Auth readiness could not be confirmed for ${usage.provider}/${usage.model}.`
			};
			if (!usage.evaluation.selectedRoute || evaluation.availability) return [];
			const authRequirement = usage.evaluation.selectedRoute.authRequirement;
			return {
				kind: "missing-auth",
				provider: usage.provider,
				model: usage.model,
				authRequirement,
				message: `No usable ${authRequirement} authentication is available for ${usage.provider}/${usage.model}.`
			};
		});
		const dedupedModelRouteIssues = dedupeByKey(modelRouteIssues, (issue) => JSON.stringify(issue));
		const missingProvidersInUse = Array.from(new Set(providerUses.filter((usage) => !hasUsableAuthForProviderInUse(usage)).map((usage) => resolveCliRuntimeAuthProvider(usage) ?? usage.provider))).filter((provider) => !isCliProvider(provider, cfg) || cliRuntimeAuthUsages.some((usage) => usage.runtime === provider)).toSorted((a, b) => a.localeCompare(b));
		const probeProfileIds = [opts.probeProfile ?? []].flat().flatMap((value) => (value ?? "").split(",")).map((value) => value.trim()).filter(Boolean);
		const probeTimeoutMs = parseProbeOption(opts.probeTimeout, "--probe-timeout", 8e3);
		const probeConcurrency = parseProbeOption(opts.probeConcurrency, "--probe-concurrency", 2, "integer");
		const probeMaxTokens = parseProbeOption(opts.probeMaxTokens, "--probe-max-tokens", 8, "integer");
		let probeSummary;
		if (opts.probe) {
			const [{ withProgressTotals }, { runAuthProbes }] = await Promise.all([import("./progress-CGxL4jR6.mjs"), listProbeRuntimeLoader.load()]);
			probeSummary = await withProgressTotals({
				label: "Checking auth profiles…",
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
					stateOwnership: { mode: "exclusive" },
					onProgress: update
				});
			});
		}
		const providersWithOauth = providerAuth.flatMap((entry) => {
			const count = entry.profiles.oauth + entry.profiles.token + (entry.env?.value === "OAuth (env)" ? 1 : 0);
			return count > 0 ? [`${entry.provider} (${count})`] : [];
		});
		const oauthProfiles = authHealth.profiles.filter((profile) => profile.type === "oauth" || profile.type === "token");
		const unusableProfiles = listUnavailableAuthProfiles(store).map(({ profileId, provider, kind, reason, classification, until, remainingMs }) => Object.assign({
			profileId,
			provider,
			kind,
			reason
		}, classification ? { classification } : {}, {
			recoveryHint: buildAuthProfileUnusableHint({
				kind,
				reason,
				provider: provider ?? profileId,
				profileId
			}),
			until,
			remainingMs
		})).toSorted((a, b) => a.remainingMs - b.remainingMs);
		const checkStatus = (() => {
			const resolveRouteAuthHealth = (usage) => {
				if (resolveStatusProviderUseIncompatibility(usage)) return "missing";
				const evaluation = evaluateProviderUseAuth(usage);
				if (evaluation.availability === void 0) return "indeterminate";
				if (!evaluation.availability) return "missing";
				const profileId = evaluation.selectedProfileId;
				if (!profileId) return "ok";
				const health = authProfileHealthById.get(profileId);
				if (health?.status === "expiring") return "expiring";
				if (health?.status === "expired" || health?.status === "missing") return "missing";
				return "ok";
			};
			const routeAuthHealth = new Set(providerUses.map(resolveRouteAuthHealth));
			const hasExpiredOrMissing = dedupedModelRouteIssues.some((issue) => issue.kind === "incompatible" || issue.kind === "indeterminate") || routeAuthHealth.has("missing") || routeAuthHealth.has("indeterminate") || runtimeAuthRoutes.some((route) => route.status === "unavailable") || missingProvidersInUse.length > 0;
			const hasExpiring = routeAuthHealth.has("expiring");
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
				utilityModel: {
					ref: utilityModelDisplayRef,
					source: utilityModelSource
				},
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
					modelRouteIssues: dedupedModelRouteIssues,
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
			writeRuntimeStdout(runtime, resolvedLabel);
			finishModelsStatusOutput(runtime, opts.check, checkStatus);
			return;
		}
		const rich = isRich(opts);
		const label = (value) => colorize(rich, theme.accent, value.padEnd(14));
		const logField = (name, value, style, source) => runtime.log(`${label(source ? `${name} (${source})` : name)}${colorize(rich, theme.muted, ":")} ${colorize(rich, style, value)}`);
		const logList = (name, values, style, source, empty = "-") => logField(`${name} (${values.length})`, values.length ? values.join(", ") : empty, values.length ? style : theme.muted, source);
		const logSection = (heading) => {
			runtime.log("");
			runtime.log(colorize(rich, theme.heading, heading));
		};
		const displayDefault = rawModel && rawModel !== resolvedLabel ? `${resolvedLabel} (from ${rawModel})` : resolvedLabel;
		logField("Config", shortenHomePath(configPath), theme.info);
		logField("Agent dir", shortenHomePath(agentDir), theme.info);
		logField("Default", displayDefault, theme.success, agentId ? agentModelPrimary ? "agent" : "defaults" : void 0);
		logList("Fallbacks", fallbacks, theme.warn, agentId ? agentFallbacksOverride !== void 0 ? "agent" : "defaults" : void 0);
		logField("Utility model", utilityModelDisplayRef ? `${utilityModelDisplayRef}${utilityModelSource === "provider-default" ? " (provider default)" : ""}` : utilityModelSource === "disabled" ? "off" : "-", utilityModelDisplayRef ? theme.success : theme.muted);
		logField("Image model", imageModel || "-", imageModel ? theme.accentBright : theme.muted, agentId ? "defaults" : void 0);
		logList("Image fallbacks", imageFallbacks, theme.accentBright, agentId ? "defaults" : void 0);
		logList("Aliases", Object.entries(aliases).map(([alias, target]) => rich ? `${theme.accentDim(alias)} ${theme.muted("->")} ${theme.info(target)}` : `${alias} -> ${target}`), theme.accent);
		logList("Allowed models", allowed, theme.info, void 0, "all");
		logSection("Auth overview");
		logField("Auth store", shortenHomePath(resolveAuthStorePathForDisplay(agentDir)), theme.info);
		runtime.log(`${label("Shell env")}${colorize(rich, theme.muted, ":")} ${colorize(rich, shellFallbackEnabled ? theme.success : theme.muted, shellFallbackEnabled ? "on" : "off")}${applied.length ? colorize(rich, theme.muted, ` (applied: ${applied.join(", ")})`) : ""}`);
		logList("Providers w/ OAuth/tokens", providersWithOauth, theme.info);
		const formatKey = (key) => colorize(rich, theme.warn, key);
		const formatKeyValue = (key, value) => `${formatKey(key)}=${colorize(rich, theme.info, value)}`;
		const formatSeparator = () => colorize(rich, theme.muted, " | ");
		const formatEffective = (effective) => formatKeyValue("effective", `${colorize(rich, theme.accentBright, effective.kind)}:${colorize(rich, theme.muted, effective.detail)}`);
		for (const entry of providerAuth) {
			const separator = formatSeparator();
			const bits = [formatEffective(entry.effective)];
			if (entry.profiles.count > 0) {
				bits.push(formatKeyValue("profiles", formatProviderAuthProfileCounts(entry.profiles)));
				if (entry.profiles.labels.length > 0) bits.push(colorize(rich, theme.info, entry.profiles.labels.join(", ")));
			}
			for (const [key, auth] of [
				["env", entry.env],
				["models.json", entry.modelsJson],
				["synthetic", entry.syntheticAuth]
			]) if (auth) bits.push(formatKeyValue(key, `${auth.value}${separator}${formatKeyValue("source", auth.source)}`));
			runtime.log(`- ${theme.heading(entry.provider)} ${bits.join(separator)}`);
		}
		if (runtimeAuthRoutes.length > 0) {
			logSection("Runtime auth");
			for (const route of runtimeAuthRoutes) {
				const runtimeAvailability = route.status === "unavailable" ? `${formatSeparator()}${formatKeyValue("auth", route.authStatus)}${formatSeparator()}${formatKeyValue("runtime", route.runtimeStatus)}${route.runtimeDetail ? `${formatSeparator()}${colorize(rich, theme.muted, route.runtimeDetail)}` : ""}` : "";
				runtime.log(`- ${theme.heading(route.provider)} via ${colorize(rich, theme.accentBright, route.runtime)} uses ${theme.heading(route.authProvider)} ${formatEffective(route.effective)}${formatSeparator()}${formatKeyValue("status", route.status)}${runtimeAvailability}`);
			}
		}
		if (dedupedModelRouteIssues.length > 0) {
			logSection("Model route issues");
			for (const issue of dedupedModelRouteIssues) {
				const modelRef = `${issue.provider}/${issue.model}`;
				const requirement = issue.kind === "missing-auth" ? `requires ${issue.authRequirement} auth:` : `[${issue.kind === "incompatible" ? issue.code : "indeterminate"}]`;
				runtime.log(`- ${theme.heading(modelRef)} ${requirement} ${issue.message}`);
			}
		}
		if (missingProvidersInUse.length > 0) {
			const { buildProviderAuthRecoveryHint } = await import("./provider-auth-recovery-hint-BQ6dlCkY.mjs");
			logSection("Missing auth");
			for (const provider of missingProvidersInUse) {
				const requiresSubscription = dedupedModelRouteIssues.some((issue) => issue.kind === "missing-auth" && issue.provider === provider && issue.authRequirement === "subscription");
				const hint = buildProviderAuthRecoveryHint({
					provider,
					config: cfg,
					includeEnvVar: !requiresSubscription
				});
				runtime.log(`- ${theme.heading(provider)} ${hint}`);
			}
		}
		if (unusableProfiles.length > 0) {
			logSection("Unavailable auth profiles");
			for (const profile of unusableProfiles) {
				const diagnostic = profile.classification ?? profile.reason;
				const reason = diagnostic ? `:${diagnostic}` : "";
				const provider = profile.provider ? ` (${profile.provider})` : "";
				runtime.log(`- ${theme.heading(profile.profileId)}${provider} ${profile.kind}${reason} (${formatRemainingShort(profile.remainingMs)}) — ${profile.recoveryHint}`);
			}
		}
		logSection("OAuth/token status");
		if (oauthProfiles.length === 0) runtime.log(colorize(rich, theme.muted, "- none"));
		else {
			const { formatUsageWindowSummary, loadProviderUsageSummary, resolveUsageProviderId } = await import("./provider-usage-BNy8z9Ms.mjs");
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
			const statusLabels = /* @__PURE__ */ new Map([
				["ok", colorize(rich, theme.success, "ok")],
				["static", colorize(rich, theme.muted, "static")],
				["expiring", colorize(rich, theme.warn, "expiring")],
				["missing", colorize(rich, theme.warn, "unknown")]
			]);
			for (const [provider, profiles] of groupByProvider(oauthProfiles)) {
				const usageKey = resolveUsageProviderId(provider, { credentialType: profiles[0]?.type });
				const usage = usageKey ? usageByProvider.get(usageKey) : void 0;
				const usageSuffix = usage ? colorize(rich, theme.muted, ` usage: ${usage}`) : "";
				runtime.log(`- ${colorize(rich, theme.heading, provider)}${usageSuffix}`);
				for (const profile of profiles) {
					const labelText = profile.label || profile.profileId;
					const labelLocal = colorize(rich, theme.accent, labelText);
					const status = statusLabels.get(profile.status) ?? colorize(rich, theme.error, "expired");
					const expiry = profile.status === "static" ? "" : profile.expiresAt ? ` expires in ${formatRemainingShort(profile.remainingMs)}` : " expires unknown";
					runtime.log(`  - ${labelLocal} ${status}${expiry}`);
				}
			}
		}
		if (probeSummary) {
			const [{ getTerminalTableWidth, renderTable }, { describeProbeSummary, sortProbeResults }] = await Promise.all([import("./terminal-core/table.js"), listProbeRuntimeLoader.load()]);
			logSection("Auth checks");
			if (probeSummary.results.length === 0) runtime.log(colorize(rich, theme.muted, "- none"));
			else {
				const tableWidth = getTerminalTableWidth();
				const sorted = sortProbeResults(probeSummary.results);
				const statusColor = (status) => {
					if (status === "ok") return theme.success;
					if (status === "rate_limit" || status === "timeout" || status === "billing") return theme.warn;
					if (status === "auth" || status === "format") return theme.error;
					return theme.muted;
				};
				const rows = sorted.map((result) => {
					const status = colorize(rich, statusColor(result.status), result.status);
					const latency = formatMs(result.latencyMs);
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
	}, {
		config: cfg,
		workspaceDir,
		env: process.env
	});
}
//#endregion
export { modelsStatusCommand };
