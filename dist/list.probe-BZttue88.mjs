import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { t as appendConfigPathSegment } from "./dot-path-BSC76DAI.mjs";
import { o as hasConfiguredSecretInput, p as resolveSecretInputRef, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { f as resolveConfigSecretRef, i as copyConfigResolutionFactsExcept, r as copyConfigResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { o as resolveMergedModelProviderEntry } from "./model-provider-config-BbSyhfVf.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as parseModelRef, t as findNormalizedProviderValue } from "./model-selection-normalize-Dij_chYC.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { t as resolveSecretRefString } from "./resolve-C3ItmvEK.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { o as disposeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-CaQAStOA.mjs";
import { h as resolveAuthProfileDatabasePath } from "./sqlite-BIg_k8qE.mjs";
import { r as clearRuntimeAuthProfileStoreSnapshot } from "./store-CTvq6MSF.mjs";
import { l as upsertAuthProfileWithLock } from "./profiles-DblRQQgZ.mjs";
import { A as resolveProviderEntryApiKeyBinding, M as resolveUsableCustomProviderApiKey, _ as hasUsableCustomProviderApiKey, g as hasSyntheticLocalProviderAuthConfig, j as resolveProviderEntryApiKeyProfileReference } from "./loader-runtime-load-XbrcYJWd.mjs";
import { i as externalCliDiscoveryScoped } from "./external-cli-discovery-BbOBKQM3.mjs";
import { i as resolveAuthProfileEligibility, o as resolveAuthProfileOrderWithMetadata, p as listProfilesForProvider } from "./order-BQhYF772.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-BcoYkagW.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-CYVlYrag.mjs";
import "./model-auth-CCIBdEPk.mjs";
import "./model-selection-CaFyCMqp.mjs";
import "./workspace-mlzi3k1x.mjs";
import { d as readPreparedModelCatalog } from "./prepared-model-catalog-C3E7Txvc.mjs";
import { l as prepareSystemAgentRunAdmission } from "./admitted-run-context-BNasoszr.mjs";
import { i as describeFailoverError } from "./failover-error-C3SnWYBJ.mjs";
import { n as prepareInternalSessionEffectsSession, r as removeInternalSessionEffectsSession } from "./internal-session-effects-z8gluM_J.mjs";
import { r as extractAgentRunTerminalError, t as agentRunHasVisibleReply } from "./agent-run-result-ecnMVuqT.mjs";
import { r as formatMs } from "./shared-CyxoXW6o.mjs";
import { i as redactStatusSecrets } from "./format-BAb_G2oU.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import os from "node:os";
import crypto from "node:crypto";
import pMap from "p-map";
//#region src/commands/models/list.probe.cleanup.ts
const log = createSubsystemLogger("models/probe");
/** Probe-owned files and locks follow actual work without extending run admission. */
async function createAuthProbeWork(signal) {
	const parent = captureAsyncWorkTracker();
	const parentSignal = getAsyncWorkSignal();
	const ready = createDeferredCore();
	const completion = createDeferredCore();
	parent(() => {
		ready.resolve();
		return completion.promise;
	}).catch(ready.reject);
	await ready.promise;
	const work = new AsyncWorkScope();
	const context = work.run(() => AsyncLocalStorage.snapshot());
	const abortListeners = /* @__PURE__ */ new Map();
	for (const source of [signal, parentSignal]) {
		if (!source || abortListeners.has(source)) continue;
		const abort = () => context(() => work.beginClose(source.reason));
		abortListeners.set(source, abort);
		source.addEventListener("abort", abort, { once: true });
		if (source.aborted) abort();
	}
	return {
		run(operation) {
			return work.track(operation);
		},
		async settle(cleanup) {
			const finish = async () => {
				try {
					await AsyncWorkScope.runWhenAllIdle(() => [work], () => context(() => work.drain()));
					await cleanup();
				} catch (error) {
					recordAgentCleanupFailure();
					completion.reject(error);
					throw error;
				} finally {
					for (const [source, abort] of abortListeners) source.removeEventListener("abort", abort);
					completion.resolve();
				}
			};
			if (!work.hasPendingWork) {
				await finish();
				return;
			}
			finish().catch((error) => {
				log.warn(`Auth probe cleanup failed: ${redactStatusSecrets(formatErrorMessage(error))}`);
			});
		}
	};
}
//#endregion
//#region src/commands/models/list.probe.models.ts
/** Groups configured model candidates by their requested provider identity. */
function buildProbeCandidateMap(modelCandidates) {
	const map = /* @__PURE__ */ new Map();
	for (const raw of modelCandidates) {
		const parsed = parseModelRef(raw ?? "", DEFAULT_PROVIDER);
		if (!parsed) continue;
		const list = map.get(parsed.provider) ?? [];
		if (!list.includes(parsed.model)) list.push(parsed.model);
		map.set(parsed.provider, list);
	}
	return map;
}
function probePriority(provider, modelId) {
	const id = modelId.trim().toLowerCase();
	if (provider !== "anthropic") return 50;
	if (/^claude-haiku-4-5-\d{8}$/.test(id)) return 0;
	if (id === "claude-haiku-4-5") return 1;
	if (id === "claude-sonnet-5" || id.startsWith("claude-sonnet-5-")) return 2;
	if (id === "claude-sonnet-4-6" || id.startsWith("claude-sonnet-4-6-")) return 3;
	if (id.startsWith("claude-sonnet-4-")) return 4;
	if (id.startsWith("claude-3-")) return 100;
	return 50;
}
/** Selects a requested-provider candidate before falling back to its catalog rows. */
function selectProbeModel(params) {
	const { provider, candidates, catalog } = params;
	const direct = candidates.get(provider)?.[0];
	if (direct) return {
		provider,
		model: direct
	};
	const fromCatalog = catalog.filter((entry) => normalizeProviderId(entry.provider) === provider && entry.status !== "deprecated" && entry.status !== "disabled").toSorted((a, b) => probePriority(provider, a.id) - probePriority(provider, b.id))[0];
	return fromCatalog ? {
		provider,
		model: fromCatalog.id
	} : null;
}
//#endregion
//#region src/commands/models/list.probe.ts
/** Auth probe planning and execution helpers for model diagnostics. */
const PROBE_PROMPT = "Reply with OK. Do not use tools.";
/** Scrubs credential-shaped text before probe failures cross a UI or CLI boundary. */
function redactAuthProbeError(error) {
	return redactStatusSecrets(error);
}
const embeddedRunnerModuleLoader = createLazyImportLoader(() => import("./embedded-agent-BakffRTS.mjs"));
function loadEmbeddedRunnerModule() {
	return embeddedRunnerModuleLoader.load();
}
const PROBE_STATUS_BY_FAILOVER_REASON = {
	auth: "auth",
	auth_permanent: "auth",
	format: "format",
	rate_limit: "rate_limit",
	overloaded: "rate_limit",
	billing: "billing",
	server_error: "unknown",
	timeout: "timeout",
	tls_certificate: "unknown",
	context_overflow: "unknown",
	model_not_found: "format",
	session_expired: "unknown",
	empty_response: "unknown",
	no_error_details: "unknown",
	unclassified: "unknown",
	unknown: "unknown"
};
/** Maps runtime failover reasons into stable auth probe status buckets. */
function mapFailoverReasonToProbeStatus(reason) {
	return reason ? PROBE_STATUS_BY_FAILOVER_REASON[reason] ?? "unknown" : "unknown";
}
function mapEligibilityReasonToProbeReasonCode(reasonCode) {
	if (reasonCode === "missing_credential") return "missing_credential";
	if (reasonCode === "expired") return "expired";
	if (reasonCode === "invalid_expires") return "invalid_expires";
	if (reasonCode === "unresolved_ref") return "unresolved_ref";
	return "ineligible_profile";
}
function formatMissingCredentialProbeError(reasonCode) {
	const legacyLine = "Auth profile credentials are missing or expired.";
	if (reasonCode === "expired") return `${legacyLine}\n↳ Auth reason [expired]: token credentials are expired.`;
	if (reasonCode === "invalid_expires") return `${legacyLine}\n↳ Auth reason [invalid_expires]: token expires must be a positive Unix ms timestamp.`;
	if (reasonCode === "missing_credential") return `${legacyLine}\n↳ Auth reason [missing_credential]: no inline credential or SecretRef is configured.`;
	if (reasonCode === "unresolved_ref") return `${legacyLine}\n↳ Auth reason [unresolved_ref]: configured SecretRef could not be resolved.`;
	return `${legacyLine}\n↳ Auth reason [ineligible_profile]: profile is incompatible with provider config.`;
}
function resolveProbeSecretRef(profile, cfg) {
	const defaults = cfg.secrets?.defaults;
	if (profile.type === "api_key") return resolveSecretInputRef({
		value: profile.key,
		refValue: profile.keyRef,
		defaults
	}).ref;
	if (profile.type === "token") return resolveSecretInputRef({
		value: profile.token,
		refValue: profile.tokenRef,
		defaults
	}).ref;
	return null;
}
function formatUnresolvedRefProbeError(refLabel) {
	return `Auth profile credentials are missing or expired.\n↳ Auth reason [unresolved_ref]: could not resolve SecretRef "${refLabel}".`;
}
function withDirectCredential(cfg, provider, value, mode) {
	const providers = cfg.models?.providers ?? {};
	const configuredEntry = resolveMergedModelProviderEntry(cfg, provider);
	const configKey = configuredEntry?.providerKey ?? provider;
	const configured = configuredEntry?.providerConfig;
	if (!configured) return withoutProfileFallback(cfg, provider);
	const auth = mode === "oauth" || mode === "token" ? mode : "api-key";
	const next = {
		...cfg,
		models: {
			...cfg.models,
			providers: {
				...providers,
				[configKey]: {
					...configured,
					apiKey: value,
					auth
				}
			}
		},
		auth: {
			...cfg.auth,
			order: {
				...cfg.auth?.order,
				[provider]: []
			}
		}
	};
	copyConfigResolutionFactsExcept(cfg, next, [`${appendConfigPathSegment("models.providers", configKey)}.apiKey`]);
	return next;
}
function withoutProfileFallback(cfg, provider) {
	const next = {
		...cfg,
		auth: {
			...cfg.auth,
			order: {
				...cfg.auth?.order,
				[provider]: []
			}
		}
	};
	copyConfigResolutionFacts(cfg, next);
	return next;
}
async function resolveConfiguredProbeCredential(params) {
	const ref = resolveConfigSecretRef({
		config: params.cfg,
		path: params.path,
		value: params.input,
		defaults: params.cfg.secrets?.defaults
	});
	if (!ref) return normalizeSecretInputString(params.input) ?? null;
	try {
		return await resolveSecretRefString(ref, {
			config: params.cfg,
			env: process.env,
			cache: params.cache
		});
	} catch {
		return null;
	}
}
async function maybeResolveUnresolvedRefIssue(params) {
	if (!params.profile) return null;
	const ref = resolveProbeSecretRef(params.profile, params.cfg);
	if (!ref) return null;
	try {
		await resolveSecretRefString(ref, {
			config: params.cfg,
			env: process.env,
			cache: params.cache
		});
		return null;
	} catch {
		return {
			reasonCode: "unresolved_ref",
			error: formatUnresolvedRefProbeError(`${ref.source}:${ref.provider}:${ref.id}`)
		};
	}
}
/** Builds probe targets plus preflight failures for missing/invalid credentials. */
async function buildProbeTargets(params) {
	const { cfg, agentDir, providers, modelCandidates, options, workspaceDir } = params;
	const authAliasLookupParams = {
		config: cfg,
		workspaceDir
	};
	const store = ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryScoped({
		config: cfg,
		allowKeychainPrompt: false,
		providerIds: providers.map((provider) => resolveProviderIdForAuth(provider, authAliasLookupParams)),
		profileIds: options.profileIds
	}) });
	const providerFilter = options.provider?.trim();
	const providerFilterKey = providerFilter ? normalizeProviderId(providerFilter) : null;
	const profileFilter = new Set(normalizeUniqueStringEntries(options.profileIds));
	const refResolveCache = {};
	const catalog = await readPreparedModelCatalog({
		config: cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...agentDir ? { agentDir } : {},
		...workspaceDir ? { workspaceDir } : {},
		readOnly: true
	});
	const candidates = buildProbeCandidateMap(modelCandidates);
	const targets = [];
	const results = [];
	for (const provider of providers) {
		const providerKey = normalizeProviderId(provider);
		const authProviderKey = resolveProviderIdForAuth(providerKey, authAliasLookupParams);
		if (providerFilterKey && providerKey !== providerFilterKey) continue;
		const model = selectProbeModel({
			provider: providerKey,
			candidates,
			catalog
		});
		const configuredProviderEntry = resolveMergedModelProviderEntry(cfg, providerKey);
		const configuredProvider = configuredProviderEntry?.providerConfig;
		const hasConfiguredProviderSecretRef = Boolean(configuredProviderEntry && resolveConfigSecretRef({
			config: cfg,
			path: `${appendConfigPathSegment("models.providers", configuredProviderEntry.providerKey)}.apiKey`,
			value: configuredProvider?.apiKey,
			defaults: cfg.secrets?.defaults
		}));
		const includeDirectKeys = options.includeDirectKeys === true && profileFilter.size === 0;
		const includeConfigKey = includeDirectKeys && profileFilter.size === 0 && hasConfiguredSecretInput(configuredProvider?.apiKey, cfg.secrets?.defaults);
		const profileIds = [.../* @__PURE__ */ new Set([...listProfilesForProvider(store, authProviderKey), ...authProviderKey === providerKey ? [] : listProfilesForProvider(store, providerKey)])];
		const configuredReference = includeConfigKey ? resolveProviderEntryApiKeyProfileReference({
			cfg,
			provider: providerKey,
			store
		}) : { kind: "none" };
		const configuredBinding = configuredReference.kind === "profile" && !profileIds.includes(configuredReference.profileId) ? await resolveProviderEntryApiKeyBinding({
			cfg,
			provider: providerKey,
			store,
			agentDir
		}) : null;
		const configuredValue = configuredProviderEntry && includeConfigKey && configuredReference.kind !== "profile" && configuredReference.kind !== "profile-incompatible" ? configuredReference.kind === "marker" ? resolveUsableCustomProviderApiKey({
			cfg,
			provider: providerKey,
			env: process.env
		})?.apiKey ?? null : await resolveConfiguredProbeCredential({
			cfg,
			input: configuredProvider?.apiKey,
			path: `${appendConfigPathSegment("models.providers", configuredProviderEntry.providerKey)}.apiKey`,
			cache: refResolveCache
		}) : null;
		const configuredMode = configuredProvider?.auth === "oauth" || configuredProvider?.auth === "token" ? configuredProvider.auth : "api_key";
		const resolvedEnvironmentValue = includeDirectKeys && !hasConfiguredProviderSecretRef ? resolveEnvApiKey(authProviderKey, process.env, {
			config: cfg,
			workspaceDir
		}) : null;
		const environmentValue = resolvedEnvironmentValue?.apiKey === configuredValue ? null : resolvedEnvironmentValue;
		const configuredTargetLabel = configuredReference.kind === "marker" && configuredValue && isNonSecretApiKeyMarker(configuredValue, { includeEnvVarName: false }) ? "provider" : "config";
		const appendDirectTargets = () => {
			if (includeConfigKey) {
				if (configuredReference.kind === "profile-incompatible") results.push({
					provider: providerKey,
					model: model ? `${model.provider}/${model.model}` : void 0,
					profileId: configuredReference.profileId,
					label: "config",
					source: "models.json",
					mode: configuredMode,
					status: "unknown",
					reasonCode: "ineligible_profile",
					error: "Configured API key references an incompatible auth profile."
				});
				else if (configuredReference.kind === "profile") {
					if (!profileIds.includes(configuredReference.profileId)) {
						if (configuredBinding?.kind === "profile-resolved" && model) targets.push({
							provider: providerKey,
							model,
							profileId: configuredBinding.auth.profileId,
							label: "config",
							source: "models.json",
							mode: configuredBinding.auth.mode,
							boundValue: configuredBinding.auth.apiKey
						});
						else results.push({
							provider: providerKey,
							model: model ? `${model.provider}/${model.model}` : void 0,
							profileId: configuredReference.profileId,
							label: "config",
							source: "models.json",
							mode: configuredMode,
							status: model ? "unknown" : "no_model",
							reasonCode: model ? "unresolved_ref" : "no_model",
							error: model ? "Configured auth profile could not be resolved." : "No model available for probe"
						});
					}
				} else if (!configuredValue) results.push({
					provider: providerKey,
					model: model ? `${model.provider}/${model.model}` : void 0,
					label: "config",
					source: "models.json",
					mode: configuredMode,
					status: model ? "unknown" : "no_model",
					reasonCode: model ? "unresolved_ref" : "no_model",
					error: model ? "Configured API key could not be resolved." : "No model available for probe"
				});
				else if (model) targets.push({
					provider: providerKey,
					model,
					label: configuredTargetLabel,
					source: "models.json",
					mode: configuredMode,
					boundValue: configuredValue,
					...configuredReference.kind === "marker" ? { useRuntimeAuth: true } : {}
				});
				else results.push({
					provider: providerKey,
					model: void 0,
					label: configuredTargetLabel,
					source: "models.json",
					mode: configuredMode,
					status: "no_model",
					reasonCode: "no_model",
					error: "No model available for probe"
				});
			}
			if (environmentValue) {
				const mode = configuredProvider?.auth === "oauth" || configuredProvider?.auth === "token" ? configuredProvider.auth : environmentValue.source.includes("OAUTH_TOKEN") ? "oauth" : "api_key";
				if (model) targets.push({
					provider: providerKey,
					model,
					label: environmentValue.source,
					source: "env",
					mode,
					boundValue: environmentValue.apiKey
				});
				else results.push({
					provider: providerKey,
					model: void 0,
					label: environmentValue.source,
					source: "env",
					mode,
					status: "no_model",
					reasonCode: "no_model",
					error: "No model available for probe"
				});
			}
		};
		const explicitOrder = findNormalizedProviderValue(store.order, authProviderKey) ?? findNormalizedProviderValue(store.order, providerKey) ?? findNormalizedProviderValue(cfg?.auth?.order, authProviderKey) ?? findNormalizedProviderValue(cfg?.auth?.order, providerKey);
		const orderResolution = resolveAuthProfileOrderWithMetadata({
			cfg,
			store,
			provider: providerKey,
			forModel: model?.model
		});
		const allowedProfiles = orderResolution.hasExplicitOrder ? new Set(orderResolution.profileIds) : null;
		const filteredProfiles = profileFilter.size ? profileIds.filter((id) => profileFilter.has(id)) : profileIds;
		if (filteredProfiles.length > 0) {
			for (const profileId of filteredProfiles) {
				const profile = store.profiles[profileId];
				const mode = profile?.type;
				const label = resolveAuthProfileDisplayLabel({
					cfg,
					store,
					profileId
				});
				const isConfigBoundProfile = includeConfigKey && configuredReference.kind === "profile" && profileId === configuredReference.profileId;
				if (!isConfigBoundProfile && explicitOrder && !explicitOrder.includes(profileId)) {
					results.push({
						provider: providerKey,
						profileId,
						model: model ? `${model.provider}/${model.model}` : void 0,
						label,
						source: "profile",
						mode,
						status: "unknown",
						reasonCode: "excluded_by_auth_order",
						error: "Excluded by auth.order for this provider."
					});
					continue;
				}
				if (!isConfigBoundProfile && allowedProfiles && !allowedProfiles.has(profileId)) {
					const reasonCode = mapEligibilityReasonToProbeReasonCode(resolveAuthProfileEligibility({
						cfg,
						store,
						provider: providerKey,
						profileId
					}).reasonCode);
					results.push({
						provider: providerKey,
						model: model ? `${model.provider}/${model.model}` : void 0,
						profileId,
						label,
						source: "profile",
						mode,
						status: "unknown",
						reasonCode,
						error: formatMissingCredentialProbeError(reasonCode)
					});
					continue;
				}
				const unresolvedRefIssue = await maybeResolveUnresolvedRefIssue({
					cfg,
					profile,
					cache: refResolveCache
				});
				if (unresolvedRefIssue) {
					results.push({
						provider: providerKey,
						model: model ? `${model.provider}/${model.model}` : void 0,
						profileId,
						label,
						source: "profile",
						mode,
						status: "unknown",
						reasonCode: unresolvedRefIssue.reasonCode,
						error: unresolvedRefIssue.error
					});
					continue;
				}
				if (!model) {
					results.push({
						provider: providerKey,
						model: void 0,
						profileId,
						label,
						source: "profile",
						mode,
						status: "no_model",
						reasonCode: "no_model",
						error: "No model available for probe"
					});
					continue;
				}
				targets.push({
					provider: providerKey,
					model,
					profileId,
					label,
					source: "profile",
					mode
				});
			}
			appendDirectTargets();
			continue;
		}
		if (profileFilter.size > 0) continue;
		appendDirectTargets();
		if (includeConfigKey || environmentValue) continue;
		const hasUsableModelsJsonKey = hasUsableCustomProviderApiKey(cfg, providerKey);
		const hasSyntheticLocalAuth = hasSyntheticLocalProviderAuthConfig({
			cfg,
			provider: providerKey
		});
		if (orderResolution.hasExplicitOrder && !hasUsableModelsJsonKey && !hasSyntheticLocalAuth) continue;
		const envKey = orderResolution.hasExplicitOrder || hasConfiguredProviderSecretRef ? null : resolveEnvApiKey(authProviderKey, process.env, {
			config: cfg,
			workspaceDir
		});
		if (!envKey && !hasUsableModelsJsonKey && !hasSyntheticLocalAuth) continue;
		const label = envKey ? "env" : "models.json";
		const source = envKey ? "env" : "models.json";
		const mode = envKey?.source.includes("OAUTH_TOKEN") ? "oauth" : "api_key";
		if (!model) {
			results.push({
				provider: providerKey,
				model: void 0,
				label,
				source,
				mode,
				status: "no_model",
				reasonCode: "no_model",
				error: "No model available for probe"
			});
			continue;
		}
		targets.push({
			provider: providerKey,
			model,
			label,
			source,
			mode,
			...hasSyntheticLocalAuth && !envKey && !hasUsableModelsJsonKey ? { useRuntimeAuth: true } : {}
		});
	}
	return {
		targets,
		results
	};
}
async function probeTarget(params) {
	const { cfg, agentId, agentDir, workspaceDir, storePath, target, timeoutMs, maxTokens } = params;
	const probeConfig = target.useRuntimeAuth ? withoutProfileFallback(cfg, target.provider) : !target.boundValue ? cfg : withDirectCredential(cfg, target.provider, target.boundValue, target.mode);
	if (!target.model) return {
		provider: target.provider,
		model: void 0,
		profileId: target.profileId,
		label: target.label,
		source: target.source,
		mode: target.mode,
		status: "no_model",
		reasonCode: "no_model",
		error: "No model available for probe"
	};
	const model = target.model;
	const runId = `probe-${target.provider}-${crypto.randomUUID()}`;
	let isolatedAgentDir = null;
	let isolatedProfileId;
	let sessionTarget;
	let preparedRunAdmission;
	const work = await createAuthProbeWork(params.abortSignal);
	const start = Date.now();
	const buildResult = (status, error) => ({
		provider: target.provider,
		model: `${model.provider}/${model.model}`,
		profileId: target.profileId,
		label: target.label,
		source: target.source,
		mode: target.mode,
		status,
		...error ? { error } : {},
		latencyMs: Date.now() - start
	});
	try {
		sessionTarget = await prepareInternalSessionEffectsSession({
			agentId,
			cwd: workspaceDir,
			runId,
			storePath
		});
		if (target.boundValue || target.useRuntimeAuth) isolatedAgentDir = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-auth-probe-")));
		if (target.boundValue && !target.useRuntimeAuth && isolatedAgentDir) {
			isolatedProfileId = `${target.provider}:probe-${crypto.randomUUID()}`;
			const value = target.boundValue;
			const profile = target.mode === "oauth" ? {
				type: "oauth",
				provider: target.provider,
				access: value,
				refresh: "not-a-real",
				expires: Date.now() + 36e5
			} : target.mode === "token" ? {
				type: "token",
				provider: target.provider,
				token: value
			} : {
				type: "api_key",
				provider: target.provider,
				key: value
			};
			if (!await upsertAuthProfileWithLock({
				profileId: isolatedProfileId,
				credential: profile,
				agentDir: isolatedAgentDir
			})) throw new Error("Could not prepare isolated auth probe profile");
		}
		const { runEmbeddedAgent } = await loadEmbeddedRunnerModule();
		const probeSessionTarget = sessionTarget;
		preparedRunAdmission = prepareSystemAgentRunAdmission(probeConfig, runId, agentId, "models.auth-probe");
		const runResult = await work.run(() => runEmbeddedAgent({
			preparedRunAdmission,
			sessionId: probeSessionTarget.sessionId,
			sessionKey: probeSessionTarget.sessionKey,
			sessionTarget: probeSessionTarget,
			agentId,
			workspaceDir,
			agentDir: isolatedAgentDir ?? agentDir,
			config: probeConfig,
			prompt: PROBE_PROMPT,
			provider: model.provider,
			model: model.model,
			requestedRouteResolution: "resolved",
			modelFallbacksOverride: [],
			authProfileId: isolatedProfileId ?? target.profileId,
			authProfileIdSource: isolatedProfileId || target.profileId ? "user" : void 0,
			timeoutMs,
			runId,
			lane: `auth-probe:${target.provider}:${target.profileId ?? target.source}`,
			thinkLevel: "off",
			reasoningLevel: "off",
			verboseLevel: "off",
			streamParams: { maxTokens },
			agentHarnessRuntimeOverride: "openclaw",
			disableTools: true,
			modelRun: true,
			cleanupBundleMcpOnRunEnd: true,
			...isolatedAgentDir ? { preparedModelRuntimeMode: "isolated-read-only" } : {},
			abortSignal: params.abortSignal
		}));
		const terminalError = extractAgentRunTerminalError(runResult);
		if (terminalError) {
			const described = describeFailoverError(new Error(terminalError));
			return buildResult(mapFailoverReasonToProbeStatus(described.reason), redactAuthProbeError(described.message));
		}
		if (!agentRunHasVisibleReply(runResult)) return buildResult("format", "The model did not return a visible probe response.");
		return buildResult("ok");
	} catch (err) {
		const described = describeFailoverError(err);
		return buildResult(mapFailoverReasonToProbeStatus(described.reason), redactAuthProbeError(described.message));
	} finally {
		preparedRunAdmission?.close();
		await work.settle(async () => {
			const cleanups = [() => removeInternalSessionEffectsSession(sessionTarget)];
			if (isolatedAgentDir) {
				const ownedDir = isolatedAgentDir;
				cleanups.push(() => {
					clearRuntimeAuthProfileStoreSnapshot(ownedDir);
				}, () => {
					disposeOpenClawAgentDatabaseByPath(resolveAuthProfileDatabasePath(ownedDir));
				}, () => fs.rm(ownedDir, {
					recursive: true,
					force: true
				}));
			}
			const errors = [];
			for (const cleanup of cleanups) try {
				await cleanup();
			} catch (error) {
				errors.push(error);
			}
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "Auth probe resources could not all be released", { cause: errors[0] });
		});
	}
}
async function runTargetsWithConcurrency(params) {
	const { cfg, targets, timeoutMs, maxTokens, onProgress } = params;
	const concurrency = Math.max(1, Math.min(targets.length || 1, params.concurrency));
	const agentId = params.agentId ?? resolveDefaultAgentId(cfg);
	const agentDir = params.agentDir ?? resolveAgentDir(cfg, agentId);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	await fs.mkdir(workspaceDir, { recursive: true });
	let completed = 0;
	return await pMap(targets, async (target) => {
		onProgress?.({
			completed,
			total: targets.length,
			label: `Probing ${target.provider}${target.profileId ? ` (${target.label})` : ""}`
		});
		const result = await probeTarget({
			cfg,
			agentId,
			agentDir,
			workspaceDir,
			storePath,
			target,
			timeoutMs,
			maxTokens,
			abortSignal: params.abortSignal
		});
		completed += 1;
		onProgress?.({
			completed,
			total: targets.length
		});
		return result;
	}, {
		concurrency,
		stopOnError: true,
		...params.abortSignal ? { signal: params.abortSignal } : {}
	});
}
function formatActiveGatewayModelsProbeRefusal(identity) {
	return `A Gateway is running for this state directory (pid ${identity.pid}, port ${identity.port}). Stop the Gateway first (${formatCliCommand("openclaw gateway stop")}), then rerun models status --probe.`;
}
/** Own canonical state only for direct CLI probes; Gateway RPC probes already run under its lock. */
async function withAuthProbeStateOwnership(ownership, run) {
	if (!ownership) return await run();
	const { acquireEmbeddedStateLock, createEmbeddedStateSignalBridge } = await import("./embedded-state-lock-BYJUg_WD.mjs");
	const signalBridge = createEmbeddedStateSignalBridge(ownership.process ?? process);
	let stateLock;
	let work;
	try {
		work = await createAuthProbeWork(signalBridge.signal);
		stateLock = await acquireEmbeddedStateLock({
			options: ownership.gatewayLockOptions,
			signal: signalBridge.signal,
			formatActiveGatewayRefusal: formatActiveGatewayModelsProbeRefusal
		});
		return await work.run(() => run(signalBridge.signal));
	} finally {
		const release = async () => {
			try {
				await stateLock?.release();
			} finally {
				signalBridge.dispose();
			}
		};
		if (work) await work.settle(release);
		else await release();
	}
}
/** Runs all auth probes with bounded concurrency and returns a summary. */
async function runAuthProbes(params) {
	return await withAuthProbeStateOwnership(params.stateOwnership, async (abortSignal) => {
		const startedAt = Date.now();
		const plan = await buildProbeTargets({
			cfg: params.cfg,
			...params.agentId ? { agentId: params.agentId } : {},
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			providers: params.providers,
			modelCandidates: params.modelCandidates,
			options: params.options
		});
		const totalTargets = plan.targets.length;
		params.onProgress?.({
			completed: 0,
			total: totalTargets
		});
		const results = totalTargets ? await runTargetsWithConcurrency({
			cfg: params.cfg,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			targets: plan.targets,
			timeoutMs: params.options.timeoutMs,
			maxTokens: params.options.maxTokens,
			concurrency: params.options.concurrency,
			onProgress: params.onProgress,
			abortSignal
		}) : [];
		const finishedAt = Date.now();
		return {
			startedAt,
			finishedAt,
			durationMs: finishedAt - startedAt,
			totalTargets,
			options: params.options,
			results: [...plan.results, ...results]
		};
	});
}
/** Formats probe latency for table output. */
function formatProbeLatency(latencyMs) {
	if (!latencyMs && latencyMs !== 0) return "-";
	return formatMs(latencyMs);
}
/** Sorts probe results by provider and display label. */
function sortProbeResults(results) {
	return results.slice().toSorted((a, b) => {
		const provider = a.provider.localeCompare(b.provider);
		if (provider !== 0) return provider;
		const aLabel = a.label || a.profileId || "";
		const bLabel = b.label || b.profileId || "";
		return aLabel.localeCompare(bLabel);
	});
}
/** Produces the terse completion line for auth probe output. */
function describeProbeSummary(summary) {
	if (summary.totalTargets === 0) return "No probe targets.";
	return `Probed ${summary.totalTargets} target${summary.totalTargets === 1 ? "" : "s"} in ${formatMs(summary.durationMs)}`;
}
//#endregion
export { redactAuthProbeError as a, withAuthProbeStateOwnership as c, mapFailoverReasonToProbeStatus as i, describeProbeSummary as n, runAuthProbes as o, formatProbeLatency as r, sortProbeResults as s, buildProbeTargets as t };
