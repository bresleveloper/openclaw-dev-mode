import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { f as normalizeSecretInputString, g as resolveSecretInputRef, o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as resolveConfigSecretRef, i as copyConfigResolutionFactsExcept, r as copyConfigResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { o as resolveMergedModelProviderEntry } from "./model-provider-config-wdC9jpCz.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { _ as resolveDefaultAgentId, a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { n as clearRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-HRosak4u.mjs";
import { i as DEFAULT_PROVIDER } from "./defaults-Bg930vxE.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as parseModelRef, t as findNormalizedProviderValue } from "./model-selection-normalize-DulZGI4S.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { f as listProfilesForProvider, i as resolveAuthProfileEligibility, o as resolveAuthProfileOrderWithMetadata } from "./order-CElLtwMu.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { s as getScopedAuthProfileEnv } from "./store-BPXZsh12.mjs";
import { i as externalCliDiscoveryScoped } from "./external-cli-discovery-kYfv_bUN.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CPdn6zH8.mjs";
import { _ as resolveProviderEntryApiKeyBinding, a as hasUsableCustomProviderApiKey, b as resolveUsableCustomProviderApiKey, i as hasSyntheticLocalProviderAuthConfig, v as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { r as ensureAuthProfileStore } from "./store-runtime-CwqGD12G.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import { i as describeFailoverError } from "./failover-error-Bjf0VdY2.mjs";
import { t as resolveSecretRefString } from "./resolve-D1-YVpS6.mjs";
import { u as upsertAuthProfileWithLock } from "./profiles-Df1OQ7iN.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./display-D4lohsyV.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { d as readPreparedModelCatalog } from "./prepared-model-catalog-B9Dr8wIV.mjs";
import "./model-auth-CMoPmop7.mjs";
import { t as FAILOVER_PROBE_STATUS } from "./probe-status-BaXI8Vaw.mjs";
import { r as formatMs } from "./shared-Ck_WZImY.mjs";
import { i as redactStatusSecrets } from "./format-DvaI7amh.mjs";
import { t as disposeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-disposal-CSKcL2-Z.mjs";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import pMap from "p-map";
//#region src/commands/models/list.probe.cleanup.ts
const log = createSubsystemLogger("models/probe");
/** Keep private credential files until their database and registration have settled. */
async function disposeAuthProbeDirectory(ownedDir, env) {
	clearRuntimeAuthProfileStoreSnapshotCore(ownedDir);
	try {
		await disposeOpenClawAgentDatabaseByPath(resolveAuthProfileDatabasePath(ownedDir), { env });
	} catch (cause) {
		throw new Error(`Auth probe database cleanup failed; retained ${ownedDir}: ${formatErrorMessage(cause)}`, { cause });
	}
	await fs.rm(ownedDir, {
		recursive: true,
		force: true
	});
}
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
				log.warn(`Auth check cleanup failed: ${redactStatusSecrets(formatErrorMessage(error))}`);
			});
		}
	};
}
//#endregion
//#region src/commands/models/list.probe.models.ts
function buildProbeCandidateMap(modelCandidates) {
	const map = /* @__PURE__ */ new Map();
	for (const raw of modelCandidates) {
		const parsed = parseModelRef(raw ?? "", DEFAULT_PROVIDER);
		if (parsed && !map.has(parsed.provider)) map.set(parsed.provider, parsed.model);
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
	const direct = candidates.get(provider);
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
const PROBE_PROMPT = "Reply with OK. Do not use tools.";
function buildProbeResult(target, outcome) {
	return {
		provider: target.provider,
		model: target.model ? `${target.model.provider}/${target.model.model}` : void 0,
		profileId: target.profileId,
		label: target.label,
		source: target.source,
		mode: target.mode,
		...outcome
	};
}
function buildNoModelProbeResult(target) {
	return buildProbeResult(target, {
		status: "no_model",
		reasonCode: "no_model",
		error: "No model available for check"
	});
}
function mapFailoverReasonToProbeStatus(reason) {
	return reason ? FAILOVER_PROBE_STATUS[reason] ?? "unknown" : "unknown";
}
const ELIGIBILITY_PROBE_ERRORS = {
	expired: "token credentials are expired.",
	invalid_expires: "token expires must be a positive Unix ms timestamp.",
	missing_credential: "no inline credential or SecretRef is configured.",
	unresolved_ref: "configured SecretRef could not be resolved.",
	ineligible_profile: "profile is incompatible with provider config."
};
function mapEligibilityReasonToProbeReasonCode(reasonCode) {
	switch (reasonCode) {
		case "missing_credential":
		case "expired":
		case "invalid_expires":
		case "unresolved_ref": return reasonCode;
		default: return "ineligible_profile";
	}
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
function createProbeConfig(cfg, target) {
	if (!target.useRuntimeAuth && !target.boundValue) return cfg;
	const value = target.useRuntimeAuth ? void 0 : target.boundValue;
	const entry = value ? resolveMergedModelProviderEntry(cfg, target.provider) : void 0;
	const next = {
		...cfg,
		...entry?.providerConfig ? { models: {
			...cfg.models,
			providers: {
				...cfg.models?.providers,
				[entry.providerKey]: {
					...entry.providerConfig,
					apiKey: value,
					auth: target.mode === "oauth" || target.mode === "token" ? target.mode : "api-key"
				}
			}
		} } : {},
		auth: {
			...cfg.auth,
			order: {
				...cfg.auth?.order,
				[target.provider]: []
			}
		}
	};
	if (entry?.providerConfig) copyConfigResolutionFactsExcept(cfg, next, [`${appendConfigPathSegment("models.providers", entry.providerKey)}.apiKey`]);
	else copyConfigResolutionFacts(cfg, next);
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
	const candidates = buildProbeCandidateMap(modelCandidates);
	const providersNeedingCatalog = providers.filter((provider) => !candidates.has(normalizeProviderId(provider)));
	const catalog = providersNeedingCatalog.length ? await readPreparedModelCatalog({
		config: cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...agentDir ? { agentDir } : {},
		...workspaceDir ? { workspaceDir } : {},
		readOnly: true,
		providerDiscoveryProviderIds: providersNeedingCatalog
	}) : [];
	const targets = [];
	const results = [];
	const appendTarget = (target) => {
		if (target.model) targets.push(target);
		else results.push(buildNoModelProbeResult(target));
	};
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
		const includeConfigKey = includeDirectKeys && hasConfiguredSecretInput(configuredProvider?.apiKey, cfg.secrets?.defaults);
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
		const explicitOrder = findNormalizedProviderValue(store.order, authProviderKey) ?? findNormalizedProviderValue(store.order, providerKey) ?? findNormalizedProviderValue(cfg?.auth?.order, authProviderKey) ?? findNormalizedProviderValue(cfg?.auth?.order, providerKey);
		const orderResolution = resolveAuthProfileOrderWithMetadata({
			cfg,
			store,
			provider: providerKey,
			forModel: model?.model
		});
		const allowedProfiles = orderResolution.hasExplicitOrder ? new Set(orderResolution.profileIds) : null;
		const filteredProfiles = profileFilter.size ? profileIds.filter((id) => profileFilter.has(id)) : profileIds;
		for (const profileId of filteredProfiles) {
			const profile = store.profiles[profileId];
			const mode = profile?.type;
			const target = {
				provider: providerKey,
				model,
				profileId,
				label: resolveAuthProfileDisplayLabel({
					cfg,
					store,
					profileId
				}),
				source: "profile",
				mode
			};
			const isConfigBoundProfile = includeConfigKey && configuredReference.kind === "profile" && profileId === configuredReference.profileId;
			let issue;
			if (!isConfigBoundProfile && explicitOrder && !explicitOrder.includes(profileId)) issue = {
				reasonCode: "excluded_by_auth_order",
				error: "Excluded by auth.order for this provider."
			};
			else if (!isConfigBoundProfile && allowedProfiles && !allowedProfiles.has(profileId)) {
				const reasonCode = mapEligibilityReasonToProbeReasonCode(resolveAuthProfileEligibility({
					cfg,
					store,
					provider: providerKey,
					profileId
				}).reasonCode);
				issue = {
					reasonCode,
					error: `Auth profile credentials are missing or expired.\n↳ Auth reason [${reasonCode}]: ${ELIGIBILITY_PROBE_ERRORS[reasonCode]}`
				};
			} else issue = await maybeResolveUnresolvedRefIssue({
				cfg,
				profile,
				cache: refResolveCache
			});
			if (issue) results.push(buildProbeResult(target, {
				status: "unknown",
				...issue
			}));
			else appendTarget(target);
		}
		if (filteredProfiles.length === 0 && profileFilter.size > 0) continue;
		if (includeConfigKey) {
			const target = {
				provider: providerKey,
				model,
				...configuredReference.kind === "profile" || configuredReference.kind === "profile-incompatible" ? { profileId: configuredReference.profileId } : {},
				label: "config",
				source: "models.json",
				mode: configuredMode
			};
			const unresolvedResult = (error) => ({
				...target,
				model: model ? `${model.provider}/${model.model}` : void 0,
				status: model ? "unknown" : "no_model",
				reasonCode: model ? "unresolved_ref" : "no_model",
				error: model ? error : "No model available for check"
			});
			if (configuredReference.kind === "profile-incompatible") results.push({
				...target,
				model: model ? `${model.provider}/${model.model}` : void 0,
				status: "unknown",
				reasonCode: "ineligible_profile",
				error: "Configured API key references an incompatible auth profile."
			});
			else if (configuredReference.kind === "profile") {
				if (!profileIds.includes(configuredReference.profileId)) {
					if (configuredBinding?.kind === "profile-resolved" && model) targets.push({
						...target,
						profileId: configuredBinding.auth.profileId,
						mode: configuredBinding.auth.mode,
						boundValue: configuredBinding.auth.apiKey
					});
					else results.push(unresolvedResult("Configured auth profile could not be resolved."));
				}
			} else if (!configuredValue) results.push(unresolvedResult("Configured API key could not be resolved."));
			else appendTarget({
				...target,
				label: configuredTargetLabel,
				boundValue: configuredValue,
				...configuredReference.kind === "marker" ? { useRuntimeAuth: true } : {}
			});
		}
		if (environmentValue) {
			const mode = configuredProvider?.auth === "oauth" || configuredProvider?.auth === "token" ? configuredProvider.auth : environmentValue.source.includes("OAUTH_TOKEN") ? "oauth" : "api_key";
			appendTarget({
				provider: providerKey,
				model,
				label: environmentValue.source,
				source: "env",
				mode,
				boundValue: environmentValue.apiKey
			});
		}
		if (filteredProfiles.length > 0 || includeConfigKey || environmentValue) continue;
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
		const source = envKey ? "env" : "models.json";
		appendTarget({
			provider: providerKey,
			model,
			label: source,
			source,
			mode: envKey?.source.includes("OAUTH_TOKEN") ? "oauth" : "api_key",
			...hasSyntheticLocalAuth && !envKey && !hasUsableModelsJsonKey ? { useRuntimeAuth: true } : {}
		});
	}
	return {
		targets,
		results
	};
}
async function probeTarget(params) {
	const { cfg, agentId, agentDir, workspaceDir, target, timeoutMs, maxTokens } = params;
	const probeConfig = createProbeConfig(cfg, target);
	if (!target.model) return buildNoModelProbeResult(target);
	const model = target.model;
	let isolatedAgentDir = null;
	let isolatedAuthEnv;
	let isolatedProfileId;
	let latencyMs;
	const work = await createAuthProbeWork(params.abortSignal);
	const buildResult = (status, error) => buildProbeResult(target, {
		status,
		...error ? { error } : {},
		...latencyMs !== void 0 ? { latencyMs } : {}
	});
	try {
		if (target.boundValue || target.useRuntimeAuth) {
			isolatedAgentDir = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-auth-probe-")));
			isolatedAuthEnv = cloneEnvWithPlatformSemantics(getScopedAuthProfileEnv() ?? process.env);
		}
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
			})) throw new Error("Could not prepare isolated auth check profile");
		}
		const { runIsolatedCompletion } = await import("./isolated-completion-CfKBV3c2.mjs");
		if (!(await work.run(() => runIsolatedCompletion({
			config: probeConfig,
			agentId,
			agentDir: isolatedAgentDir ?? agentDir,
			workspaceDir,
			provider: model.provider,
			model: model.model,
			authProfileId: isolatedProfileId ?? target.profileId,
			...isolatedAgentDir ? { preparedModelRuntimeMode: "isolated-read-only" } : {},
			agentHarnessRuntimeOverride: "openclaw",
			systemPrompt: "",
			prompt: PROBE_PROMPT,
			timeoutMs,
			abortSignal: params.abortSignal,
			thinkLevel: "off",
			streamParams: { maxTokens },
			outputTextPolicy: "strict-visible",
			onRequestComplete: (durationMs) => {
				latencyMs = Math.round(durationMs);
			}
		}))).text.trim()) return buildResult("format", "The provider returned no visible text.");
		return buildResult("ok");
	} catch (err) {
		const described = describeFailoverError(err);
		return buildResult(mapFailoverReasonToProbeStatus(described.reason), redactStatusSecrets(described.message));
	} finally {
		await work.settle(async () => {
			if (isolatedAgentDir) await disposeAuthProbeDirectory(isolatedAgentDir, isolatedAuthEnv);
		});
	}
}
async function runTargetsWithConcurrency(params) {
	const { cfg, targets, options, onProgress } = params;
	const { timeoutMs, maxTokens } = options;
	const concurrency = Math.max(1, Math.min(targets.length || 1, options.concurrency));
	const agentId = params.agentId ?? resolveDefaultAgentId(cfg);
	const agentDir = params.agentDir ?? resolveAgentDir(cfg, agentId);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId);
	await fs.mkdir(workspaceDir, { recursive: true });
	let completed = 0;
	return await pMap(targets, async (target) => {
		onProgress?.({
			completed,
			total: targets.length,
			label: `Checking ${target.provider}${target.profileId ? ` (${target.label})` : ""}`
		});
		const result = await probeTarget({
			cfg,
			agentId,
			agentDir,
			workspaceDir,
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
	const { acquireEmbeddedStateLock, createEmbeddedStateSignalBridge } = await import("./embedded-state-lock-y-OKgBZW.mjs");
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
async function runAuthProbes(params) {
	return await withAuthProbeStateOwnership(params.stateOwnership, async (abortSignal) => {
		const startedAt = Date.now();
		const plan = await buildProbeTargets(params);
		const totalTargets = plan.targets.length;
		params.onProgress?.({
			completed: 0,
			total: totalTargets
		});
		const results = totalTargets ? await runTargetsWithConcurrency({
			...params,
			targets: plan.targets,
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
function sortProbeResults(results) {
	return results.toSorted((a, b) => {
		const provider = a.provider.localeCompare(b.provider);
		if (provider !== 0) return provider;
		const aLabel = a.label || a.profileId || "";
		const bLabel = b.label || b.profileId || "";
		return aLabel.localeCompare(bLabel);
	});
}
function describeProbeSummary(summary) {
	if (summary.totalTargets === 0) return "No check targets.";
	return `Checked ${summary.totalTargets} target${summary.totalTargets === 1 ? "" : "s"} in ${formatMs(summary.durationMs)}`;
}
//#endregion
export { sortProbeResults as a, runAuthProbes as i, describeProbeSummary as n, withAuthProbeStateOwnership as o, mapFailoverReasonToProbeStatus as r, buildProbeTargets as t };
