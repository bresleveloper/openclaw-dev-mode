import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import "./utils-aKqR_F_U.mjs";
import { x as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { c as isSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { m as serializeConfigResolutionFacts, r as copyConfigResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as applyLoggingConfig } from "./logger--ALOusOG.mjs";
import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { F as hashStableJson } from "./discovery-D_5mAUI7.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { O as setRuntimeConfigAppliedHash, c as getRuntimeConfigSnapshotMetadata, f as hashRuntimeConfigValue, u as getRuntimeConfigSourceSnapshot, w as resolveConfigWriteFollowUp } from "./runtime-snapshot-DbgWcCyV.mjs";
import { _ as fingerprintConfigSnapshotAuthoredConfig, a as appendConfigAuditRecordSync, g as configSnapshotAuditRecordMatchesPath, o as capConfigAuditIssues, s as capConfigAuditPaths, v as readConfigSnapshotAuditRecord, x as upsertConfigSnapshotAuditRecord, y as readLatestConfigSnapshotAuditRecord } from "./io.audit-CcH6Zt2-.mjs";
import { a as hashConfigRaw } from "./io.read-helpers-N26RjV2V.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { t as getConfigValueAtPath } from "./config-paths-BKljx7kX.mjs";
import { r as getRuntimeConfig, w as getRuntimeConfigWriteApplication } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-4VeKpJhh.mjs";
import { n as isRestartEnabled } from "./commands.flags-BNJlVVgU.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission, a as getActiveGatewayRootWorkCount } from "./gateway-work-admission-CHv_0noy.mjs";
import { l as reloadSessionMcpRuntimes } from "./agent-bundle-mcp-manager-api-jXc1RW7-.mjs";
import { l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { n as getLoadedChannelPluginEntryById } from "./registry-loaded-CYq2sa_C.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { g as hasSameSecretReloadContract, i as clearSecretsRuntimeSnapshotState, l as getActiveSecretsRuntimeSnapshotRevisionState, p as hasActiveSecretsRuntimeSnapshotLineage, u as getActiveSecretsRuntimeSnapshotState, x as setSecretsRuntimeSourceSnapshotIfCurrent, y as restoreSecretsRuntimeSourceSnapshotIfLineageCurrent } from "./runtime-state-CtZtwiOt.mjs";
import { s as publishOperatorRoleConfigChange } from "./operator-role-policy-BNrKHiJ3.mjs";
import { u as runOutsideSetupCredentialAccess } from "./order-BQhYF772.mjs";
import { _ as rejectPendingPreparedModelRuntimeReplacement, d as markPreparedModelRuntimeSnapshotsStale, g as refreshPreparedModelRuntimeSnapshots, s as advancePreparedModelRuntimeConfig } from "./prepared-model-runtime-DtKqtgJz.mjs";
import { n as runOutsidePluginLifecycleLease, r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { C as publishSystemEventStoreConfig } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { t as getActiveEmbeddedRunCount } from "./active-run-projections-BHX_SDCX.mjs";
import { _ as isCurrentGatewayReloadGeneration, d as setGatewayRestartPolicy, g as abortPendingChannelReloads, r as deferGatewayRestartUntilIdle, v as isGatewayReloadGenerationAborted, y as nextGatewayReloadGeneration } from "./restart-Bb4QxGMO.mjs";
import { c as getActiveBackgroundExecSessionCount } from "./bash-process-registry-CkYBcnWR.mjs";
import { t as getTotalPendingReplies } from "./dispatcher-registry-BAhstaE7.mjs";
import { w as requestActiveCronJobCancellationByDeclarationKeyPrefix } from "./active-jobs-BdNx3YyC.mjs";
import { s as getTotalQueueSize } from "./command-queue-CaY517ob.mjs";
import { n as getInspectableActiveTaskRestartBlockers } from "./task-registry.maintenance-C1rFYT15.mjs";
import { t as formatActiveTaskRestartBlocker } from "./task-restart-blocker-B7ca32LH.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-CYRu5kQ6.mjs";
import { r as resetDirectoryCache } from "./target-resolver-BZNj5Sdk.mjs";
import "./agent-bundle-mcp-tools-sYSmxaoq.mjs";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-q1wYjpRM.mjs";
import { n as disconnectStaleSharedGatewayAuthClients } from "./server-shared-auth-generation-aNODWb-9.mjs";
import { i as refreshContextWindowCache } from "./context-BNGdirIS.mjs";
import { l as resetSkillSnapshotConfigFingerprintCache } from "./workspace-skill-loader-CHrBsX7y.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-NJJr9z6k.mjs";
import { t as commitHooksConfigReload, y as resolveHooksConfig } from "./hooks-BXb-LCk7.mjs";
import { i as getPluginRuntimeGeneration, n as PluginRuntimeApplicationError } from "./lifecycle-D58-fLcH.mjs";
import { a as resolvePluginInstallReloadMetadata, n as isNoopGatewayReloadPlan, o as diffConfigPaths, r as listConfigReloadRefinementPrefixes, s as diffGatewayReloadPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-CGQS_zJR.mjs";
import { n as resolveReloadAgentIds, t as refreshModelRuntimeAfterHotReload } from "./server-reload-model-runtime-scope-CGxfXpYU.mjs";
import { t as invalidateConfigGetResponseCache } from "./config-get-response-5BCxdw8e.mjs";
import { a as assertReloadPublicationCurrent, i as GatewayReloadRequiresRecoveryOwnerError, n as GatewayHotReloadRecoveryError, o as createReloadCancellationError, r as GatewayHotReloadStaleSecretsError, t as GatewayConfigReloadSupersededError } from "./server-reload-contracts-BKTBnxfS.mjs";
import { n as applyGatewayLaneConcurrency, r as resolveGatewayLaneConcurrency, t as resolveHookClientIpConfig } from "./hook-client-ip-config-CvkkVv9_.mjs";
import { r as startGatewayCronWithLogging } from "./server-runtime-services-IShdvS9D.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
import chokidar from "chokidar";
//#region src/gateway/config-reload-recovery.ts
function shouldRefreshContextWindowCache(plan) {
	return plan.reloadPlugins || plan.changedPaths.some((path) => path === "models" || path.startsWith("models.") || path === "agents" || path === "agents.defaults" || path === "agents.entries" || path.startsWith("agents.entries.") || path === "agents.defaults.workspace" || path.startsWith("agents.defaults.workspace."));
}
/** Auth changes must replace prepared owners instead of advancing their config in place. */
function doesReloadAffectProviderAuth(plan) {
	return plan.reloadPlugins || plan.changedPaths.some(isProviderAuthRelevantReloadPath);
}
const PROVIDER_AUTH_RELEVANT_CONFIG_ROOTS = /* @__PURE__ */ new Set([
	"auth",
	"env",
	"models",
	"plugins",
	"secrets"
]);
const PROVIDER_AUTH_RELEVANT_AGENT_SUBFIELDS = /* @__PURE__ */ new Set([
	"agentDir",
	"agentRuntime",
	"default",
	"id",
	"imageModel",
	"mediaModels",
	"model",
	"models",
	"modelPolicy",
	"pdfModel",
	"runtime",
	"utilityModel",
	"voiceModel",
	"workspace"
]);
function isAuthRelevantAgentSubfield(field, next, nested) {
	if (field === void 0) return true;
	if (PROVIDER_AUTH_RELEVANT_AGENT_SUBFIELDS.has(field)) return true;
	if (field === "heartbeat" || field === "subagents") return next === void 0 || next === "model";
	return field === "compaction" && (next === void 0 || next === "model" || next === "provider" || next === "memoryFlush" && (nested === void 0 || nested === "model"));
}
function isProviderAuthRelevantReloadPath(path) {
	const segments = path.split(".");
	const [head = "", second, third, fourth] = segments;
	if (PROVIDER_AUTH_RELEVANT_CONFIG_ROOTS.has(head)) return true;
	if (head === "agent" && second === "model") return true;
	if (head !== "agents") return false;
	if (second === void 0 || second === "list") return true;
	if (second === "defaults") return isAuthRelevantAgentSubfield(third, segments[3], segments[4]);
	if (second === "entries") return isAuthRelevantAgentSubfield(fourth, segments[4], segments[5]);
	return false;
}
function reloadPlanNeedsRecovery(plan) {
	return plan.restartCron || plan.restartGmailWatcher || plan.reloadPlugins || (plan.restartServices?.size ?? 0) > 0 || plan.restartChannels.size > 0 || (plan.restartChannelAccounts?.size ?? 0) > 0 || shouldRefreshContextWindowCache(plan);
}
//#endregion
//#region src/gateway/config-applied-revision.ts
function createConfigAppliedRevisionTracker(options) {
	let pending = null;
	const flush = async (currentConfig) => {
		const owner = pending;
		if (!owner) return;
		await options.onConfigApplied?.(owner.plan, currentConfig);
		options.onRevisionApplied?.(owner.hash);
		if (pending === owner) pending = null;
	};
	return {
		defer: (plan, hash) => {
			pending = {
				plan,
				hash
			};
		},
		flush,
		apply: async (plan, config, hash) => {
			if (pending?.plan === plan) {
				await flush(config);
				return;
			}
			await options.onConfigApplied?.(plan, config);
			options.onRevisionApplied?.(hash);
		}
	};
}
//#endregion
//#region src/gateway/config-reload.ts
const MISSING_CONFIG_RETRY_DELAY_MS = 150;
const MISSING_CONFIG_MAX_RETRIES = 2;
const WATCHER_RECREATE_MAX_RETRIES = 3;
const WATCHER_RECREATE_BACKOFF_MS = [
	500,
	2e3,
	5e3
];
function resolveChokidarUsePolling(degradedToPolling) {
	const envPoll = process.env.CHOKIDAR_USEPOLLING;
	if (envPoll !== void 0) {
		const envLower = envPoll.toLowerCase();
		if (envLower === "false" || envLower === "0") return false;
		if (envLower === "true" || envLower === "1") return true;
		return Boolean(envLower);
	}
	return Boolean(process.env.VITEST) || degradedToPolling;
}
function asPluginInstallConfig(records) {
	return { plugins: { installs: records } };
}
function isConfigReloadSuperseded(error) {
	return (error instanceof PluginRuntimeApplicationError && !error.details.committed ? error.cause : error) instanceof GatewayConfigReloadSupersededError;
}
function startGatewayConfigReloader(opts) {
	const initialSourceConfig = opts.initialCompareConfig ?? opts.initialConfig;
	let currentConfig = opts.initialConfig;
	let currentCompareConfig = initialSourceConfig;
	let currentSourceConfig = initialSourceConfig;
	let currentRawHash = opts.initialSnapshotRawHash;
	let lastObservedRawHash = opts.initialSnapshotRawHash;
	let currentFingerprintedAuthoredConfig = fingerprintConfigSnapshotAuthoredConfig(opts.initialAuthoredConfig, {
		env: process.env,
		homedir
	});
	let currentRuntimeEnvSourceConfig = initialSourceConfig;
	let currentReapplyRuntimeOverlays = (config) => config;
	let currentRuntimeRefresh;
	const resolveSettings = (config) => {
		const resolved = resolveGatewayReloadSettings(config);
		return opts.testDebounceMs === void 0 ? resolved : {
			...resolved,
			debounceMs: opts.testDebounceMs
		};
	};
	let settings = resolveSettings(currentConfig);
	let debounceTimer = null;
	let pending = false;
	let running = false;
	let stopped = false;
	let initialized = false;
	const lifecycle = new AbortController();
	const withRestartPreparation = (ownership, checkpointOwned, run) => runOutsidePluginLifecycleLease(() => withPluginLifecycleLease({ signal: lifecycle.signal }, async (lease) => {
		const current = {
			...ownership,
			assertInvokerOwned: () => lease.assertOwned(),
			checkpoint: () => checkpointOwned(() => lease.assertOwned())
		};
		await current.checkpoint();
		const result = await run(current);
		await current.checkpoint();
		return result;
	}));
	let watcherReload;
	const activeReloads = /* @__PURE__ */ new Set();
	let pluginOperationTail = Promise.resolve();
	let missingConfigRetries = 0;
	let sourceObservation = {
		epoch: 0,
		writerEpoch: 0
	};
	let pendingInProcessConfig = null;
	let activeInProcessConfig = null;
	let watcherIntentCandidate = null;
	let watcherIntentCameFromPendingWrite = false;
	const settleApplication = (candidate, status) => {
		candidate?.application?.settle(status);
	};
	let lastAppliedWriteHash = null;
	let lastSourceOnly;
	const appendExternalAudit = (record) => {
		appendConfigAuditRecordSync({
			env: process.env,
			homedir,
			record: {
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				source: "config-io",
				event: "config.external",
				configPath: opts.watchPath,
				...record
			}
		});
	};
	let currentSnapshotSlot = null;
	const updateAcceptedSnapshot = (rawHash, authoredConfig) => {
		currentRawHash = rawHash;
		currentFingerprintedAuthoredConfig = fingerprintConfigSnapshotAuthoredConfig(authoredConfig, {
			env: process.env,
			homedir
		});
		const updatedSlot = upsertConfigSnapshotAuditRecord({
			configPath: opts.watchPath,
			rawHash,
			authoredConfig,
			expectedSnapshot: currentSnapshotSlot
		});
		if (updatedSlot) {
			currentSnapshotSlot = updatedSlot;
			return;
		}
		currentSnapshotSlot = readLatestConfigSnapshotAuditRecord();
		if (configSnapshotAuditRecordMatchesPath(currentSnapshotSlot, opts.watchPath)) {
			currentRawHash = currentSnapshotSlot.rawHash;
			currentFingerprintedAuthoredConfig = currentSnapshotSlot.fingerprintedAuthoredConfig;
		}
	};
	const readCurrentInstallRecords = () => withPluginCache(createPluginCache(), loadInstalledPluginIndexInstallRecords);
	let currentPluginInstallRecords = {};
	let completedPluginApplication;
	const readPluginInstallRecords = opts.readPluginInstallRecords ?? readCurrentInstallRecords;
	const appliedRevision = createConfigAppliedRevisionTracker({
		onConfigApplied: opts.onConfigApplied,
		onRevisionApplied: opts.onConfigRevisionApplied
	});
	const clearReloadTimer = () => {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = null;
	};
	const scheduleAfter = (wait) => {
		if (stopped || !initialized) return;
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			startTrackedReload();
		}, wait);
	};
	const schedule = () => {
		scheduleAfter(settings.debounceMs);
	};
	const prepareRestart = async (plan, nextConfig, ownership, sourceConfig) => {
		try {
			await opts.onRestart(plan, nextConfig, ownership, sourceConfig);
		} catch (err) {
			if (isConfigReloadSuperseded(err)) opts.log.info(`config restart superseded: ${String(err)}`);
			else opts.log.error(`config restart failed: ${String(err)}`);
			throw err;
		}
	};
	const handleMissingSnapshot = (snapshot) => {
		if (snapshot.exists) {
			missingConfigRetries = 0;
			return false;
		}
		if (missingConfigRetries < MISSING_CONFIG_MAX_RETRIES) {
			missingConfigRetries += 1;
			opts.log.info(`config reload retry (${missingConfigRetries}/${MISSING_CONFIG_MAX_RETRIES}): config file not found`);
			scheduleAfter(MISSING_CONFIG_RETRY_DELAY_MS);
			return true;
		}
		opts.log.warn("config reload skipped (config file not found)");
		return true;
	};
	const applySnapshot = async (sourceSnapshot, candidate, initialEpoch = sourceObservation.epoch, { pluginLifecycle, onRuntimeCommitted, assertInvokerOwned: pluginInvokerGuard } = {}) => {
		let transactionEpoch = initialEpoch;
		const { hash: persistedHash } = sourceSnapshot;
		const { config: candidateRuntimeConfig = sourceSnapshot.config, compareConfig: nextSourceConfig = sourceSnapshot.sourceConfig, afterWrite, preparedCandidate: preflightCandidate, runtimeRefresh, application } = candidate ?? {};
		const settleRuntimeApplication = (result = "applied") => {
			const status = typeof result === "string" ? result : result.status;
			application?.settle(opts.hasOutstandingGatewayRestart?.() ? "applied-restart-required" : status);
		};
		let nextPluginInstallRecords = currentPluginInstallRecords;
		let committedRuntimeConfig = null;
		let rejected = false;
		const isCurrent = () => !stopped && !rejected && sourceObservation.epoch === transactionEpoch;
		const assertInvokerOwned = () => {
			if (!committedRuntimeConfig) pluginInvokerGuard?.();
		};
		const assertCurrent = () => {
			assertInvokerOwned();
			assertReloadPublicationCurrent(isCurrent(), false);
		};
		const checkpointOwned = async (assertOwned) => {
			if (stopped || rejected) throw new GatewayConfigReloadSupersededError();
			assertOwned();
			if (sourceObservation.epoch !== transactionEpoch) {
				const observed = sourceObservation;
				if (observed.writerEpoch > transactionEpoch) throw new GatewayConfigReloadSupersededError();
				const [snapshot, installs] = await (observed.read ??= Promise.all([opts.readSnapshot(currentRuntimeEnvSourceConfig), readPluginInstallRecords()]));
				if (stopped || sourceObservation !== observed || !snapshot.exists || !snapshot.valid || typeof persistedHash !== "string" || snapshot.hash !== persistedHash || diffConfigPaths(snapshot.sourceConfig, nextSourceConfig).length > 0 || !isDeepStrictEqual(installs, nextPluginInstallRecords) || !isDeepStrictEqual(snapshot.includedPaths, sourceSnapshot.includedPaths) || !isDeepStrictEqual(snapshot.includeProvenance, sourceSnapshot.includeProvenance) || !isDeepStrictEqual(serializeConfigResolutionFacts(snapshot.sourceConfig), serializeConfigResolutionFacts(sourceSnapshot.sourceConfig))) throw new GatewayConfigReloadSupersededError();
				assertOwned();
				transactionEpoch = observed.epoch;
			}
			assertOwned();
			assertReloadPublicationCurrent(isCurrent(), false);
		};
		const checkpoint = async () => {
			try {
				await checkpointOwned(assertInvokerOwned);
			} catch (error) {
				rejected = true;
				throw error;
			}
		};
		const completeApplication = (runtime) => {
			if (isCurrent()) {
				clearReloadTimer();
				pending = false;
			}
			return {
				runtime,
				isCurrent
			};
		};
		assertInvokerOwned();
		try {
			nextPluginInstallRecords = await readPluginInstallRecords();
		} catch (err) {
			opts.log.warn(`config reload plugin install record check failed: ${String(err)}`);
		}
		await checkpoint();
		await application?.prepare?.(assertCurrent);
		await checkpoint();
		const preparedCandidate = opts.prepareConfigCandidate ? await opts.prepareConfigCandidate({
			runtimeConfig: candidateRuntimeConfig,
			sourceConfig: nextSourceConfig,
			previousSourceConfig: currentRuntimeEnvSourceConfig
		}) : preflightCandidate;
		if (stopped) throw new GatewayConfigReloadSupersededError();
		assertInvokerOwned();
		const nextConfig = preparedCandidate?.runtimeConfig ?? candidateRuntimeConfig;
		const nextCompareConfig = preparedCandidate?.compareConfig ?? nextSourceConfig;
		const nextConfigRevisionHash = hashRuntimeConfigValue(nextSourceConfig);
		let publishedRuntimeEnv;
		let runtimeEnvCommitted = false;
		const nextSettings = resolveSettings(nextConfig);
		const commitPublishedRuntimeEnv = () => {
			runtimeEnvCommitted = true;
			publishedRuntimeEnv?.commit();
			publishedRuntimeEnv = void 0;
		};
		const ownership = {
			isCurrent,
			checkpoint,
			withRestartPreparation: (run) => withRestartPreparation(ownership, checkpointOwned, run),
			assertInvokerOwned,
			reapplyRuntimeOverlays: preparedCandidate?.reapplyRuntimeOverlays ?? ((config) => config),
			...preparedCandidate?.runtimeEnv ? { runtimeEnv: preparedCandidate.runtimeEnv } : {},
			...runtimeRefresh ? { runtimeRefresh } : {},
			publishRuntimeEnv: () => {
				assertCurrent();
				if (runtimeEnvCommitted) return;
				publishedRuntimeEnv ??= preparedCandidate?.runtimeEnv?.publish();
				assertCurrent();
			},
			rollbackRuntimeEnv: () => {
				if (runtimeEnvCommitted) return;
				publishedRuntimeEnv?.();
				publishedRuntimeEnv = void 0;
			},
			commitRuntimeEnv: commitPublishedRuntimeEnv,
			markRuntimeCommitted: (runtimeConfig, plan) => {
				commitPublishedRuntimeEnv();
				onRuntimeCommitted?.();
				opts.onRuntimeConfigCommitted?.(plan, runtimeConfig);
				committedRuntimeConfig = runtimeConfig;
				currentConfig = runtimeConfig;
				currentCompareConfig = nextCompareConfig;
				currentSourceConfig = nextSourceConfig;
				currentRuntimeEnvSourceConfig = nextSourceConfig;
				currentReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
				currentRuntimeRefresh = ownership.runtimeRefresh;
				currentPluginInstallRecords = nextPluginInstallRecords;
				settings = resolveSettings(runtimeConfig);
				appliedRevision.defer(plan, nextConfigRevisionHash);
			}
		};
		const configChangedPaths = diffGatewayReloadPaths(currentCompareConfig, nextCompareConfig, listConfigReloadRefinementPrefixes());
		const configInstallMetadata = resolvePluginInstallReloadMetadata(currentCompareConfig, nextCompareConfig);
		await checkpoint();
		assertCurrent();
		const previousPluginInstallConfig = asPluginInstallConfig(currentPluginInstallRecords);
		const nextPluginInstallConfig = asPluginInstallConfig(nextPluginInstallRecords);
		const pluginInstallRecordChangedPaths = diffConfigPaths(previousPluginInstallConfig, nextPluginInstallConfig);
		const installMetadata = resolvePluginInstallReloadMetadata(previousPluginInstallConfig, nextPluginInstallConfig);
		const changedPaths = [...configChangedPaths, ...pluginInstallRecordChangedPaths];
		await appliedRevision.flush(currentConfig);
		await checkpoint();
		assertCurrent();
		const completed = completedPluginApplication;
		if (pluginLifecycle?.expectedInstallHashes && Object.keys(pluginLifecycle.expectedInstallHashes).length > 0 && completed && completed.runtime.generation === getPluginRuntimeGeneration() && !opts.hasOutstandingGatewayRestart?.() && sourceSnapshot.hash === completed.snapshot.hash && diffConfigPaths(nextSourceConfig, completed.snapshot.sourceConfig).length === 0 && isDeepStrictEqual(sourceSnapshot.includedPaths, completed.snapshot.includedPaths) && isDeepStrictEqual(sourceSnapshot.includeProvenance, completed.snapshot.includeProvenance) && isDeepStrictEqual(serializeConfigResolutionFacts(nextSourceConfig), serializeConfigResolutionFacts(completed.snapshot.sourceConfig)) && isDeepStrictEqual(nextPluginInstallRecords, completed.installRecords) && Object.entries(pluginLifecycle.expectedInstallHashes).every(([id, hash]) => nextPluginInstallRecords[id] && hashStableJson(nextPluginInstallRecords[id]) === hash)) {
			const registry = getActivePluginRegistry();
			const metadata = getProcessGatewayPluginMetadataSnapshot();
			const expected = pluginLifecycle.expectedSourceDigests ?? {};
			const entries = metadata?.index.plugins.filter((entry) => expected[entry.pluginId] !== void 0) ?? [];
			if (entries.length === Object.keys(expected).length) {
				const { inspectPluginGenerationSources } = await import("./plugin-generation-source-inspection-BOMwlkxE.mjs");
				await checkpoint();
				assertCurrent();
				if (pluginLifecycle.pluginIds.every((id) => {
					const record = registry?.plugins.find((plugin) => plugin.id === id);
					const instance = record && getPluginInstance(record);
					return completed.runtime.pluginIds.includes(id) && (record?.status === "disabled" ? expected[id] === void 0 : record?.status === "loaded" && instance?.acceptingCalls && expected[id] !== void 0 && instance.sourceDigest === expected[id] && completed.runtime.sourceDigests?.[id] === expected[id]);
				}) && completed.runtime.generation === getPluginRuntimeGeneration() && registry === getActivePluginRegistry() && metadata === getProcessGatewayPluginMetadataSnapshot()) {
					const source = inspectPluginGenerationSources(entries.map((entry) => ({
						pluginId: entry.pluginId,
						rootDir: entry.rootDir,
						entryFile: entry.source === entry.manifestPath ? entry.source : void 0
					})));
					for (const [id, digest] of Object.entries(expected)) if (source.sourceDigests[id] !== digest) throw new Error(`Plugin ${id} captured source changed after installation`);
					source.assertSourceCurrent();
					assertCurrent();
					application?.settle("applied");
					return completeApplication(completed.runtime);
				}
			}
		}
		let publishedSource;
		const publishSource = changedPaths.length === 0 && !pluginLifecycle && opts.onEffectiveConfigUnchanged ? async () => {
			publishedSource ??= await opts.onEffectiveConfigUnchanged(nextConfig, ownership, nextSourceConfig);
		} : void 0;
		const commitReloadBaseline = async (options = {}) => {
			await checkpoint();
			assertCurrent();
			await appliedRevision.flush(currentConfig);
			await checkpoint();
			assertCurrent();
			const notifyCommitted = () => {
				opts.onReloadEnabledChange?.(nextSettings.mode !== "off");
				if (changedPaths.length > 0) opts.onConfigCandidateCommitted?.({
					path: opts.watchPath,
					persistedHash: persistedHash ?? null,
					changedPaths
				});
			};
			try {
				await opts.onConfigAccepted?.(committedRuntimeConfig ?? nextConfig, ownership, nextSourceConfig, {
					runtimeApplied: options.runtimeApplied !== false,
					...publishSource ? { publishSource } : {}
				});
				await checkpoint();
				assertCurrent();
				if (!publishedSource) await publishSource?.();
				await checkpoint();
				assertCurrent();
				currentSourceConfig = nextSourceConfig;
				updateAcceptedSnapshot(hashConfigRaw(sourceSnapshot.raw), sourceSnapshot.parsed);
				if (options.runtimeApplied === false) {
					lastSourceOnly = {
						hash: persistedHash ?? null,
						config: nextConfig,
						sourceConfig: nextSourceConfig,
						reapplyRuntimeOverlays: ownership.reapplyRuntimeOverlays,
						runtimeRefresh: ownership.runtimeRefresh
					};
					notifyCommitted();
					return;
				}
				ownership.publishRuntimeEnv();
				currentRuntimeEnvSourceConfig = nextSourceConfig;
				if (persistedHash === lastSourceOnly?.hash) lastSourceOnly = void 0;
				currentConfig = committedRuntimeConfig ?? nextConfig;
				currentCompareConfig = nextCompareConfig;
				currentReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
				currentRuntimeRefresh = ownership.runtimeRefresh;
				currentPluginInstallRecords = nextPluginInstallRecords;
				settings = committedRuntimeConfig ? resolveSettings(committedRuntimeConfig) : nextSettings;
				commitPublishedRuntimeEnv();
			} catch (error) {
				ownership.rollbackRuntimeEnv();
				await publishedSource?.rollback();
				throw error;
			}
			notifyCommitted();
		};
		if (changedPaths.length === 0 && !pluginLifecycle) {
			await commitReloadBaseline();
			publishedSource?.commit?.();
			opts.onConfigRevisionApplied?.(nextConfigRevisionHash);
			settleRuntimeApplication();
			return completeApplication();
		}
		const skillsChangedPath = changedPaths.find((path) => path === "skills" || path.startsWith("skills."));
		if (skillsChangedPath !== void 0) {
			bumpSkillsSnapshotVersion({
				reason: "config-change",
				changedPath: skillsChangedPath
			});
			opts.log.info(`skills snapshot invalidated by config change (${skillsChangedPath})`);
		}
		const followUp = resolveConfigWriteFollowUp(pluginLifecycle ? void 0 : afterWrite);
		opts.log.info(changedPaths.length > 0 ? `config change detected; evaluating reload (${changedPaths.join(", ")})` : "plugin metadata changed with identical config; applying plugin lifecycle");
		if (followUp.mode === "none") {
			opts.log.info(`config reload skipped by writer intent (${followUp.reason})`);
			await commitReloadBaseline({ runtimeApplied: false });
			application?.settle("failed");
			return completeApplication();
		}
		const plan = buildGatewayReloadPlan(changedPaths, {
			noopPaths: [...configInstallMetadata.noopPaths, ...installMetadata.noopPaths],
			forceChangedPaths: [...configInstallMetadata.forceChangedPaths, ...installMetadata.forceChangedPaths],
			candidateConfig: nextConfig,
			previousConfig: currentConfig
		});
		if (pluginLifecycle) {
			plan.pluginLifecycle = pluginLifecycle;
			plan.reloadPlugins = true;
			const unrelatedRestart = plan.restartReasons.find((path) => path !== "plugins" && !path.startsWith("plugins."));
			if (unrelatedRestart) throw new Error(`Cannot apply plugin change while ${unrelatedRestart} requires a Gateway restart.`);
			plan.restartGateway = false;
			plan.restartReasons = [];
		}
		if (nextSettings.mode === "off" && !pluginLifecycle) {
			opts.log.info("config reload disabled (gateway.reload.mode=off)");
			await commitReloadBaseline({ runtimeApplied: false });
			application?.settle("failed");
			return completeApplication();
		}
		if (followUp.requiresRestart) {
			plan.restartGateway = true;
			plan.restartReasons.push(followUp.reason);
		}
		if (application?.requireImmediateApplication && (plan.restartGateway || plan.reloadPlugins)) throw new Error("The plugin or restart requirement changed before activation. Complete that update separately, then retry the saved sign-in.");
		if (plan.restartGateway) {
			await opts.onConfigChange?.(plan, nextConfig);
			await prepareRestart(plan, nextConfig, ownership, nextSourceConfig);
			await commitReloadBaseline();
			application?.settle("restart-pending");
			return completeApplication();
		}
		const applyRuntime = isNoopGatewayReloadPlan(plan) ? opts.onNoopConfigCommit : opts.onHotReload;
		await opts.onConfigChange?.(plan, nextConfig);
		let applicationStatus;
		try {
			applicationStatus = await applyRuntime(plan, nextConfig, ownership, nextSourceConfig);
		} catch (error) {
			ownership.rollbackRuntimeEnv();
			throw error;
		}
		await checkpoint();
		assertCurrent();
		await appliedRevision.apply(plan, nextConfig, nextConfigRevisionHash);
		await commitReloadBaseline();
		settleRuntimeApplication(applicationStatus ?? "applied");
		const runtime = typeof applicationStatus === "object" && applicationStatus.status === "applied" ? applicationStatus.runtime : void 0;
		if (runtime) completedPluginApplication = {
			runtime,
			snapshot: sourceSnapshot,
			installRecords: nextPluginInstallRecords
		};
		return completeApplication(runtime);
	};
	const promoteAcceptedSnapshot = async (snapshot, reason) => {
		if (!opts.promoteSnapshot || !snapshot.exists || !snapshot.valid) return;
		try {
			await opts.promoteSnapshot(snapshot, reason);
		} catch (err) {
			opts.log.warn(`config reload last-known-good promotion failed: ${String(err)}`);
		}
	};
	const runAcceptedTransaction = async (run, application) => {
		const runTransaction = application?.runTransaction ?? opts.runTransaction;
		await runOutsideSetupCredentialAccess(() => runTransaction ? runTransaction(run) : run());
	};
	const acceptCurrentRuntimeEcho = async (transactionEpoch, snapshot, runtimeApplied, assertLeaseOwned) => {
		const sourceOnly = runtimeApplied ? void 0 : lastSourceOnly;
		const runtimeRefresh = runtimeApplied ? currentRuntimeRefresh : sourceOnly?.runtimeRefresh;
		const checkpointOwned = async (assertOwned) => {
			if (stopped || sourceObservation.epoch !== transactionEpoch) throw new GatewayConfigReloadSupersededError();
			assertOwned();
		};
		const ownership = {
			isCurrent: () => !stopped && sourceObservation.epoch === transactionEpoch,
			checkpoint: () => checkpointOwned(assertLeaseOwned),
			withRestartPreparation: (run) => withRestartPreparation(ownership, checkpointOwned, run),
			reapplyRuntimeOverlays: sourceOnly?.reapplyRuntimeOverlays ?? currentReapplyRuntimeOverlays,
			publishRuntimeEnv: () => {},
			rollbackRuntimeEnv: () => {},
			commitRuntimeEnv: () => {},
			...runtimeRefresh ? { runtimeRefresh } : {},
			markRuntimeCommitted: () => {}
		};
		await runAcceptedTransaction(async () => {
			await appliedRevision.flush(currentConfig);
			assertLeaseOwned();
			if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError();
			await opts.onConfigAccepted?.(sourceOnly?.config ?? currentConfig, ownership, sourceOnly?.sourceConfig ?? currentSourceConfig, { runtimeApplied });
			assertLeaseOwned();
			if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError();
			if (snapshot.valid && typeof snapshot.hash === "string") updateAcceptedSnapshot(hashConfigRaw(snapshot.raw), snapshot.parsed);
		});
		if (snapshot.valid) await acceptWatchedPaths(snapshot.includedPaths ?? []);
	};
	const applyWrittenSnapshot = async (snapshot, candidate, epoch, assertLeaseOwned) => {
		const applied = await applySnapshot(snapshot, candidate, epoch, { assertInvokerOwned: assertLeaseOwned });
		if (activeInProcessConfig === candidate) activeInProcessConfig = null;
		if (watcherIntentCandidate === candidate) {
			watcherIntentCandidate = null;
			watcherIntentCameFromPendingWrite = false;
		}
		await acceptWatchedPaths(snapshot.includedPaths ?? []);
		if (applied.isCurrent()) await promoteAcceptedSnapshot(snapshot, "in-process-write");
	};
	const runReload = async (assertLeaseOwned) => {
		if (stopped || !initialized) return;
		if (running) {
			pending = true;
			return;
		}
		running = true;
		pending = false;
		clearReloadTimer();
		let attemptedCandidate = null;
		try {
			assertLeaseOwned();
			if (pendingInProcessConfig) {
				const pendingWrite = pendingInProcessConfig;
				attemptedCandidate = pendingWrite;
				pendingInProcessConfig = null;
				activeInProcessConfig = pendingWrite;
				missingConfigRetries = 0;
				try {
					await runAcceptedTransaction(async () => {
						const snapshot = await opts.readSnapshot(currentRuntimeEnvSourceConfig);
						assertLeaseOwned();
						if (!snapshot.exists || !snapshot.valid || sourceObservation.writerEpoch > pendingWrite.epoch || activeInProcessConfig !== pendingWrite || snapshot.hash !== pendingWrite.persistedHash || diffConfigPaths(snapshot.sourceConfig, pendingWrite.compareConfig).length > 0) throw new GatewayConfigReloadSupersededError();
						await applyWrittenSnapshot(snapshot, pendingWrite, pendingWrite.epoch, assertLeaseOwned);
					}, pendingWrite.application);
				} catch (err) {
					if (lastAppliedWriteHash === pendingWrite.persistedHash) lastAppliedWriteHash = null;
					if (sourceObservation.epoch === pendingWrite.epoch && !pendingInProcessConfig && !watcherIntentCandidate) {
						watcherIntentCandidate = pendingWrite;
						watcherIntentCameFromPendingWrite = false;
					}
					throw err;
				} finally {
					if (activeInProcessConfig === pendingWrite) activeInProcessConfig = null;
				}
				return;
			}
			const transactionEpoch = sourceObservation.epoch;
			const intentCandidate = watcherIntentCandidate;
			attemptedCandidate = intentCandidate;
			const intentCandidateCameFromPendingWrite = watcherIntentCameFromPendingWrite;
			const snapshot = await opts.readSnapshot(currentRuntimeEnvSourceConfig);
			assertLeaseOwned();
			if (sourceObservation.epoch !== transactionEpoch) throw new GatewayConfigReloadSupersededError();
			const missingRetriesExhausted = !snapshot.exists && missingConfigRetries >= MISSING_CONFIG_MAX_RETRIES;
			if (handleMissingSnapshot(snapshot)) {
				if (missingRetriesExhausted) settleApplication(intentCandidate, "failed");
				await appliedRevision.flush(currentConfig);
				return;
			}
			await observeCandidateWatchedPaths(snapshot.includedPaths ?? []);
			assertLeaseOwned();
			const observedRawHash = hashConfigRaw(snapshot.raw);
			const previousObservedRawHash = lastObservedRawHash;
			const newObservedRawHash = observedRawHash !== previousObservedRawHash;
			lastObservedRawHash = observedRawHash;
			if (intentCandidate && snapshot.valid && snapshot.hash === intentCandidate.persistedHash && diffConfigPaths(intentCandidate.compareConfig, snapshot.sourceConfig).length === 0) {
				lastAppliedWriteHash = intentCandidate.persistedHash;
				try {
					await runAcceptedTransaction(async () => {
						await applyWrittenSnapshot(snapshot, intentCandidate, transactionEpoch, assertLeaseOwned);
					}, intentCandidate.application);
				} catch (err) {
					if (lastAppliedWriteHash === intentCandidate.persistedHash) lastAppliedWriteHash = null;
					if (sourceObservation.epoch === transactionEpoch && !watcherIntentCandidate) {
						watcherIntentCandidate = intentCandidate;
						watcherIntentCameFromPendingWrite = intentCandidateCameFromPendingWrite;
					}
					throw err;
				}
				return;
			}
			if (watcherIntentCandidate === intentCandidate) {
				settleApplication(intentCandidate, "superseded");
				watcherIntentCandidate = null;
				watcherIntentCameFromPendingWrite = false;
			}
			if (intentCandidate && lastAppliedWriteHash === intentCandidate.persistedHash) lastAppliedWriteHash = null;
			if (lastAppliedWriteHash && typeof snapshot.hash === "string") {
				if (snapshot.valid && snapshot.hash === lastAppliedWriteHash && diffConfigPaths(currentSourceConfig, snapshot.sourceConfig).length === 0) {
					await acceptCurrentRuntimeEcho(transactionEpoch, snapshot, snapshot.hash !== lastSourceOnly?.hash, assertLeaseOwned);
					return;
				}
				lastAppliedWriteHash = null;
			}
			if (!snapshot.valid) {
				if (newObservedRawHash) appendExternalAudit({
					detectedBy: "watch",
					previousHash: previousObservedRawHash,
					nextHash: observedRawHash,
					valid: false,
					issues: capConfigAuditIssues(formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true }))
				});
				const issues = formatConfigIssueLines(snapshot.issues, "").join(", ");
				opts.log.warn(`config reload skipped (invalid config): ${issues}`);
				await appliedRevision.flush(currentConfig);
				return;
			}
			const nextRawHash = observedRawHash;
			const externalChangedPaths = diffConfigPaths(currentSourceConfig, snapshot.sourceConfig);
			const fingerprintedAuthoredChangedPaths = diffConfigPaths(currentFingerprintedAuthoredConfig, fingerprintConfigSnapshotAuthoredConfig(snapshot.parsed, {
				env: process.env,
				homedir
			}));
			const journalChangedPaths = [.../* @__PURE__ */ new Set([...externalChangedPaths, ...fingerprintedAuthoredChangedPaths])];
			const matchingWriterSlot = readConfigSnapshotAuditRecord({ configPath: opts.watchPath });
			if (newObservedRawHash && (nextRawHash === currentRawHash || matchingWriterSlot?.rawHash !== nextRawHash)) appendExternalAudit({
				detectedBy: "watch",
				previousHash: previousObservedRawHash,
				nextHash: nextRawHash,
				valid: true,
				...journalChangedPaths.length > 0 ? { changedPaths: capConfigAuditPaths(journalChangedPaths) } : {},
				...journalChangedPaths.length === 0 ? { opaqueChange: true } : {}
			});
			await runAcceptedTransaction(async () => {
				if ((await applySnapshot(snapshot, void 0, transactionEpoch, { assertInvokerOwned: assertLeaseOwned })).isCurrent()) await promoteAcceptedSnapshot(snapshot, "valid-config");
			});
			await acceptWatchedPaths(snapshot.includedPaths ?? []);
		} catch (err) {
			const superseded = isConfigReloadSuperseded(err);
			if (!(superseded && attemptedCandidate !== null && watcherIntentCandidate === attemptedCandidate)) settleApplication(attemptedCandidate, superseded ? "superseded" : "failed");
			if (superseded) opts.log.info(`config reload superseded: ${String(err)}`);
			else opts.log.error(`config reload failed: ${String(err)}`);
		} finally {
			running = false;
		}
	};
	function trackReload(reload) {
		activeReloads.add(reload);
		reload.then(() => activeReloads.delete(reload), () => activeReloads.delete(reload));
	}
	function startTrackedReload() {
		if (running || watcherReload) {
			pending = true;
			return;
		}
		const reload = runOutsidePluginLifecycleLease(() => withPluginLifecycleLease({ signal: lifecycle.signal }, async (lease) => {
			await runReload(() => lease.assertOwned());
		})).catch((error) => {
			if (!stopped) opts.log.error(`config reload failed: ${String(error)}`);
		});
		watcherReload = reload;
		activeReloads.add(reload);
		reload.then(() => {
			activeReloads.delete(reload);
			watcherReload = void 0;
			if (pending && !running) {
				pending = false;
				schedule();
			}
		});
	}
	const applyPluginLifecycleChange = (params) => {
		const previousOperation = pluginOperationTail;
		const operationId = randomUUID();
		const operation = previousOperation.then(async () => {
			params.assertInvokerOwned?.();
			await ready;
			params.assertInvokerOwned?.();
			for (;;) {
				const reload = watcherReload;
				if (!running || !reload) break;
				await reload;
			}
			params.assertInvokerOwned?.();
			if (stopped) throw new Error("Gateway plugin lifecycle is stopped.");
			running = true;
			clearReloadTimer();
			let candidate = pendingInProcessConfig ?? watcherIntentCandidate;
			let committed = false;
			try {
				const expectedSourceConfig = params.write ? params.write.persistedSourceConfig : params.config;
				const epoch = sourceObservation.epoch;
				const snapshot = await opts.readSnapshot(currentRuntimeEnvSourceConfig);
				params.assertInvokerOwned?.();
				if (!snapshot.valid || !snapshot.exists) throw new Error("Plugin runtime application requires a valid persisted config.");
				if (!expectedSourceConfig || params.write && (typeof params.write.persistedHash !== "string" || snapshot.hash !== params.write.persistedHash) || diffConfigPaths(snapshot.sourceConfig, expectedSourceConfig).length > 0) throw new GatewayConfigReloadSupersededError();
				if (pendingInProcessConfig === candidate) pendingInProcessConfig = null;
				activeInProcessConfig = candidate;
				if (sourceObservation.writerEpoch > epoch) throw new GatewayConfigReloadSupersededError();
				const matchesSnapshot = (queued) => queued !== null && snapshot.hash === queued.persistedHash && diffConfigPaths(snapshot.sourceConfig, queued.compareConfig).length === 0;
				if (!matchesSnapshot(candidate)) {
					if (candidate !== watcherIntentCandidate) settleApplication(candidate, "superseded");
					candidate = matchesSnapshot(watcherIntentCandidate) ? watcherIntentCandidate : null;
				}
				if (watcherIntentCandidate && watcherIntentCandidate !== candidate) {
					settleApplication(watcherIntentCandidate, "superseded");
					watcherIntentCandidate = null;
					watcherIntentCameFromPendingWrite = false;
				}
				activeInProcessConfig = candidate;
				const applied = await applySnapshot(snapshot, candidate, epoch, {
					pluginLifecycle: {
						pluginIds: params.pluginIds,
						reason: params.reason,
						operationId,
						expectedSourceDigests: params.expectedSourceDigests,
						expectedInstallHashes: params.expectedInstallHashes
					},
					onRuntimeCommitted: () => {
						committed = true;
					},
					assertInvokerOwned: params.assertInvokerOwned
				});
				if (!applied.runtime) throw new Error("Plugin runtime application did not produce a completed receipt.");
				if (watcherIntentCandidate === candidate) {
					watcherIntentCandidate = null;
					watcherIntentCameFromPendingWrite = false;
				}
				lastAppliedWriteHash = snapshot.hash ?? null;
				await acceptWatchedPaths(snapshot.includedPaths ?? []);
				if (applied.isCurrent()) await promoteAcceptedSnapshot(snapshot, "plugin-lifecycle");
				return applied.runtime;
			} catch (error) {
				settleApplication(candidate, "failed");
				if (error instanceof PluginRuntimeApplicationError) throw error;
				throw new PluginRuntimeApplicationError(String(error), {
					operationId,
					generation: getPluginRuntimeGeneration(),
					pluginIds: [...params.pluginIds],
					phase: "prepare",
					committed
				}, { cause: error });
			} finally {
				if (activeInProcessConfig === candidate) activeInProcessConfig = null;
				running = false;
				if (pending || pendingInProcessConfig) {
					pending = false;
					schedule();
				}
			}
		});
		pluginOperationTail = operation.catch(() => {});
		trackReload(operation);
		return operation;
	};
	const scheduleExternalRefresh = () => {
		opts.onConfigCandidateObserved?.();
		sourceObservation = {
			epoch: sourceObservation.epoch + 1,
			writerEpoch: sourceObservation.writerEpoch
		};
		const pendingCandidate = pendingInProcessConfig;
		const activeCandidate = activeInProcessConfig;
		const newestLiveCandidate = pendingCandidate && (!activeCandidate || pendingCandidate.epoch > activeCandidate.epoch) ? pendingCandidate : activeCandidate;
		if (newestLiveCandidate && (!watcherIntentCandidate || newestLiveCandidate.epoch > watcherIntentCandidate.epoch)) {
			if (watcherIntentCandidate !== newestLiveCandidate) settleApplication(watcherIntentCandidate, "superseded");
			watcherIntentCandidate = newestLiveCandidate;
			watcherIntentCameFromPendingWrite = newestLiveCandidate === pendingCandidate;
		}
		if (pendingInProcessConfig) pendingInProcessConfig = null;
		schedule();
	};
	const unsubscribeFromWrites = opts.subscribeToWrites?.((event) => {
		if (event.configPath !== opts.watchPath) return;
		const application = getRuntimeConfigWriteApplication(event)?.claim();
		if (stopped) {
			application?.settle("stopped");
			return;
		}
		opts.onConfigCandidateObserved?.();
		sourceObservation = {
			epoch: sourceObservation.epoch + 1,
			writerEpoch: sourceObservation.epoch + 1
		};
		const pendingRestartIntent = pendingInProcessConfig?.afterWrite?.mode === "restart" ? pendingInProcessConfig.afterWrite : watcherIntentCameFromPendingWrite && watcherIntentCandidate?.afterWrite?.mode === "restart" ? watcherIntentCandidate.afterWrite : void 0;
		settleApplication(pendingInProcessConfig, "superseded");
		settleApplication(watcherIntentCandidate, "superseded");
		watcherIntentCandidate = null;
		watcherIntentCameFromPendingWrite = false;
		const afterWrite = pendingRestartIntent && event.afterWrite?.mode !== "restart" ? pendingRestartIntent : event.afterWrite;
		pendingInProcessConfig = {
			config: event.runtimeConfig,
			compareConfig: event.sourceConfig,
			persistedHash: event.persistedHash,
			afterWrite,
			...event.preparedCandidate ? { preparedCandidate: event.preparedCandidate } : {},
			...event.runtimeRefresh ? { runtimeRefresh: event.runtimeRefresh } : {},
			...application ? { application } : {},
			epoch: sourceObservation.epoch
		};
		lastAppliedWriteHash = event.persistedHash;
		scheduleAfter(0);
	}) ?? (() => {});
	let watcher = null;
	const acceptedIncludedPaths = new Set(opts.initialIncludedPaths ?? []);
	let candidateIncludedPaths = /* @__PURE__ */ new Set();
	const watchedPaths = /* @__PURE__ */ new Set([opts.watchPath, ...acceptedIncludedPaths]);
	let watcherRecreateRetries = 0;
	let watcherRecreateTimer = null;
	let hotReloadStatus = "active";
	let degradedToPolling = false;
	let watcherUsesPolling = false;
	const reconcileInitialWatch = async (source) => {
		const epoch = sourceObservation.epoch;
		const isCurrent = () => !stopped && watcher === source && sourceObservation.epoch === epoch;
		try {
			const snapshot = await opts.readSnapshot(currentRuntimeEnvSourceConfig);
			if (!isCurrent()) return;
			const includedPaths = snapshot.includedPaths ?? [];
			const hasIncludes = acceptedIncludedPaths.size > 0 || includedPaths.length > 0;
			const sameIncludedPaths = acceptedIncludedPaths.size === includedPaths.length && includedPaths.every((path) => acceptedIncludedPaths.has(path));
			const sameRoot = snapshot.exists ? hashConfigRaw(snapshot.raw) === currentRawHash : currentRawHash === null;
			if (snapshot.valid && sameRoot && (!hasIncludes || sameIncludedPaths && diffConfigPaths(currentSourceConfig, snapshot.sourceConfig).length === 0)) return;
		} catch (err) {
			if (!isCurrent()) return;
			opts.log.warn(`config reload initial watch check failed: ${String(err)}`);
		}
		scheduleExternalRefresh();
	};
	const createWatcher = (reconcileAfterReady) => {
		if (stopped) return;
		const usePolling = resolveChokidarUsePolling(degradedToPolling);
		const next = chokidar.watch([...watchedPaths], {
			depth: 0,
			ignoreInitial: true,
			awaitWriteFinish: {
				stabilityThreshold: 200,
				pollInterval: 50
			},
			usePolling
		});
		const scheduleFromWatcherEvent = (eventPath) => {
			if (!watchedPaths.has(path.normalize(eventPath))) return;
			watcherRecreateRetries = 0;
			scheduleExternalRefresh();
		};
		next.on("add", scheduleFromWatcherEvent);
		next.on("change", scheduleFromWatcherEvent);
		next.on("unlink", scheduleFromWatcherEvent);
		next.on("error", (err) => {
			handleWatcherError(next, err);
		});
		next.on("ready", () => {
			opts.onWatcherReady?.();
			if (reconcileAfterReady) {
				if (!stopped && watcher === next) {
					if (reconcileAfterReady === "initial") trackReload(reconcileInitialWatch(next));
					else scheduleExternalRefresh();
				}
			}
		});
		watcher = next;
		watcherUsesPolling = next.options.usePolling;
		hotReloadStatus = "active";
	};
	const handleWatcherError = (source, err) => {
		if (stopped || source !== watcher) return;
		const failedWatcherUsedPolling = watcherUsesPolling;
		watcher = null;
		watcherUsesPolling = false;
		source?.close().catch(() => {});
		if (watcherRecreateRetries >= WATCHER_RECREATE_MAX_RETRIES) {
			if (!failedWatcherUsedPolling && resolveChokidarUsePolling(true)) {
				degradedToPolling = true;
				watcherRecreateRetries = 0;
				opts.log.warn(`config watcher native retries exhausted; degrading to polling mode: ${String(err)}`);
				watcherRecreateTimer = setTimeout(() => {
					watcherRecreateTimer = null;
					createWatcher("replacement");
				}, WATCHER_RECREATE_BACKOFF_MS[0] ?? 500);
				return;
			}
			const mode = failedWatcherUsedPolling ? "polling mode" : "native mode";
			hotReloadStatus = "disabled";
			opts.log.error(`config hot-reload disabled: watcher failed after ${WATCHER_RECREATE_MAX_RETRIES} re-create attempts in ${mode}: ${String(err)}`);
			return;
		}
		const backoff = WATCHER_RECREATE_BACKOFF_MS[watcherRecreateRetries] ?? WATCHER_RECREATE_BACKOFF_MS[WATCHER_RECREATE_BACKOFF_MS.length - 1] ?? 0;
		watcherRecreateRetries += 1;
		opts.log.warn(`config watcher error; re-creating watcher (attempt ${watcherRecreateRetries}/${WATCHER_RECREATE_MAX_RETRIES} in ${backoff}ms): ${String(err)}`);
		watcherRecreateTimer = setTimeout(() => {
			watcherRecreateTimer = null;
			createWatcher("replacement");
		}, backoff);
	};
	const reconcileWatchedPaths = async (includedPaths) => {
		const nextPaths = /* @__PURE__ */ new Set([opts.watchPath, ...includedPaths]);
		const additions = [...nextPaths].filter((candidate) => !watchedPaths.has(candidate));
		const removals = [...watchedPaths].filter((candidate) => !nextPaths.has(candidate));
		if (additions.length === 0 && removals.length === 0) return;
		watchedPaths.clear();
		for (const candidate of nextPaths) watchedPaths.add(candidate);
		const activeWatcher = watcher;
		if (!activeWatcher) return;
		try {
			await activeWatcher.close();
		} catch (err) {
			handleWatcherError(activeWatcher, err);
			return;
		}
		if (stopped || watcher !== activeWatcher) return;
		watcher = null;
		watcherUsesPolling = false;
		createWatcher("replacement");
	};
	const observeCandidateWatchedPaths = async (includedPaths) => {
		candidateIncludedPaths = new Set(includedPaths);
		await reconcileWatchedPaths([...acceptedIncludedPaths, ...candidateIncludedPaths]);
	};
	const acceptWatchedPaths = async (includedPaths) => {
		acceptedIncludedPaths.clear();
		for (const candidate of includedPaths) acceptedIncludedPaths.add(candidate);
		candidateIncludedPaths.clear();
		await reconcileWatchedPaths([...acceptedIncludedPaths]);
	};
	const ready = (async () => {
		const initialCandidate = opts.prepareConfigCandidate ? await opts.prepareConfigCandidate({
			runtimeConfig: opts.initialConfig,
			sourceConfig: initialSourceConfig,
			previousSourceConfig: initialSourceConfig
		}) : void 0;
		const initialPluginInstallRecords = opts.initialPluginInstallRecords ?? await readCurrentInstallRecords();
		if (stopped) throw new GatewayConfigReloadSupersededError();
		currentConfig = initialCandidate?.runtimeConfig ?? opts.initialConfig;
		currentCompareConfig = initialCandidate?.compareConfig ?? initialSourceConfig;
		currentReapplyRuntimeOverlays = initialCandidate?.reapplyRuntimeOverlays ?? ((config) => config);
		settings = resolveSettings(currentConfig);
		opts.onReloadEnabledChange?.(settings.mode !== "off");
		currentSnapshotSlot = readLatestConfigSnapshotAuditRecord();
		if (sourceObservation.epoch === 0) {
			const priorSnapshot = configSnapshotAuditRecordMatchesPath(currentSnapshotSlot, opts.watchPath) ? currentSnapshotSlot : null;
			if (priorSnapshot && opts.initialSnapshotRawHash === null) {
				currentRawHash = priorSnapshot.rawHash;
				currentFingerprintedAuthoredConfig = priorSnapshot.fingerprintedAuthoredConfig;
				appendExternalAudit({
					detectedBy: "startup",
					previousHash: priorSnapshot.rawHash,
					nextHash: null,
					valid: false,
					issues: capConfigAuditIssues(["config file missing"])
				});
			} else if (priorSnapshot && priorSnapshot.rawHash !== opts.initialSnapshotRawHash) {
				if (!opts.initialSnapshotValid) {
					currentRawHash = priorSnapshot.rawHash;
					currentFingerprintedAuthoredConfig = priorSnapshot.fingerprintedAuthoredConfig;
				}
				const startupChangedPaths = opts.initialSnapshotValid ? diffConfigPaths(priorSnapshot.fingerprintedAuthoredConfig, fingerprintConfigSnapshotAuthoredConfig(opts.initialAuthoredConfig, {
					env: process.env,
					homedir
				})) : [];
				appendExternalAudit({
					detectedBy: "startup",
					previousHash: priorSnapshot.rawHash,
					nextHash: opts.initialSnapshotRawHash,
					valid: opts.initialSnapshotValid,
					...!opts.initialSnapshotValid ? { issues: capConfigAuditIssues(formatConfigIssueLines(opts.initialSnapshotIssues, "", { normalizeRoot: true })) } : startupChangedPaths.length > 0 ? { changedPaths: capConfigAuditPaths(startupChangedPaths) } : { opaqueChange: true }
				});
			}
			if (opts.initialSnapshotRawHash !== null && opts.initialSnapshotValid) updateAcceptedSnapshot(opts.initialSnapshotRawHash, opts.initialAuthoredConfig);
		}
		currentPluginInstallRecords = initialPluginInstallRecords;
		createWatcher(opts.prepareConfigCandidate !== void 0 || opts.initialPluginInstallRecords === void 0 ? "initial" : void 0);
		initialized = true;
		if (pendingInProcessConfig || pending) scheduleAfter(0);
	})();
	return {
		ready,
		isReady: () => initialized,
		applyPluginLifecycleChange,
		isReloading: () => activeReloads.size > 0,
		stop: async () => {
			stopped = true;
			lifecycle.abort(new GatewayConfigReloadSupersededError());
			settleApplication(pendingInProcessConfig, "stopped");
			settleApplication(activeInProcessConfig, "stopped");
			settleApplication(watcherIntentCandidate, "stopped");
			clearReloadTimer();
			if (watcherRecreateTimer) {
				clearTimeout(watcherRecreateTimer);
				watcherRecreateTimer = null;
			}
			unsubscribeFromWrites();
			await ready.catch(() => {});
			const active = watcher;
			watcher = null;
			await active?.close().catch(() => {});
			await Promise.all(activeReloads);
		},
		hotReloadStatus: () => initialized ? hotReloadStatus : void 0
	};
}
//#endregion
//#region src/gateway/server-reload-active-work.ts
const CHANNEL_RELOAD_DEFERRAL_POLL_MS = 500;
const CHANNEL_RELOAD_STILL_PENDING_WARN_MS = 3e4;
function createGatewayActiveWorkTracker(options) {
	const { params, myGeneration } = options;
	let deferredChannelReload;
	const getDeferredChannelReloads = () => {
		if (!deferredChannelReload || !isCurrentGatewayReloadGeneration(myGeneration) || isGatewayReloadGenerationAborted(myGeneration) || !deferredChannelReload.isCurrent()) return [];
		const { channels, publicationPending } = deferredChannelReload;
		return channels.map((channel) => ({
			channel,
			publicationPending
		}));
	};
	const getActiveCounts = () => {
		const queueSize = getTotalQueueSize();
		const pendingReplies = getTotalPendingReplies();
		const embeddedRuns = getActiveEmbeddedRunCount();
		const backgroundExecSessions = getActiveBackgroundExecSessionCount();
		const rootRequests = getActiveGatewayRootWorkCount({ excludeCurrent: true });
		const activeTasks = getInspectableActiveTaskRestartBlockers().length;
		return {
			queueSize,
			pendingReplies,
			embeddedRuns,
			backgroundExecSessions,
			rootRequests,
			activeTasks,
			totalActive: queueSize + pendingReplies + embeddedRuns + backgroundExecSessions + rootRequests + activeTasks
		};
	};
	const formatActiveDetails = (counts) => {
		const details = [];
		if (counts.queueSize > 0) details.push(`${counts.queueSize} operation(s)`);
		if (counts.pendingReplies > 0) details.push(`${counts.pendingReplies} reply(ies)`);
		if (counts.embeddedRuns > 0) details.push(`${counts.embeddedRuns} embedded run(s)`);
		if (counts.backgroundExecSessions > 0) details.push(`${counts.backgroundExecSessions} background exec session(s)`);
		if (counts.rootRequests > 0) details.push(`${counts.rootRequests} gateway request(s)`);
		if (counts.activeTasks > 0) details.push(`${counts.activeTasks} background task run(s)`);
		return details;
	};
	const formatTaskBlockers = () => {
		const blockers = getInspectableActiveTaskRestartBlockers();
		if (blockers.length === 0) return null;
		const shown = blockers.slice(0, 8).map(formatActiveTaskRestartBlocker);
		const omitted = blockers.length - shown.length;
		return omitted > 0 ? `${shown.join("; ")}; +${omitted} more` : shown.join("; ");
	};
	const formatDeferredWorkStatus = (status) => {
		try {
			const details = formatActiveDetails(getActiveCounts()).join(", ");
			const taskBlockers = formatTaskBlockers();
			return `${details} ${status}${taskBlockers ? ` (${taskBlockers})` : ""}`;
		} catch (err) {
			return `pending work unknown (${String(err)})`;
		}
	};
	const waitForActiveWorkBeforeChannelReload = async (channels, isTransactionCurrent, publicationPending) => {
		if (!isTransactionCurrent()) return true;
		const initial = getActiveCounts();
		if (initial.totalActive <= 0) return false;
		const channelIds = [...new Set(channels)];
		const channelNames = channelIds.join(", ");
		const initialDetails = formatActiveDetails(initial);
		params.logReload.warn(`config change requires channel reload (${channelNames}) — deferring until ${initialDetails.join(", ")} complete`);
		const timeoutMs = resolveGatewayRestartDeferralTimeoutMs();
		const startedAt = Date.now();
		let nextStillPendingAt = startedAt + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
		const deferred = {
			channels: channelIds,
			publicationPending,
			isCurrent: isTransactionCurrent
		};
		deferredChannelReload = deferred;
		try {
			while (true) {
				if (!isTransactionCurrent() || isGatewayReloadGenerationAborted(myGeneration)) return true;
				await new Promise((resolve) => {
					setTimeout(resolve, CHANNEL_RELOAD_DEFERRAL_POLL_MS).unref?.();
				});
				if (!isTransactionCurrent() || isGatewayReloadGenerationAborted(myGeneration)) return true;
				const current = getActiveCounts();
				if (current.totalActive <= 0) return false;
				const elapsedMs = Date.now() - startedAt;
				if (timeoutMs !== void 0 && elapsedMs >= timeoutMs) {
					const remaining = formatActiveDetails(current);
					params.logReload.warn(`channel reload timeout after ${elapsedMs}ms with ${remaining.join(", ")} still active; reloading channels anyway`);
					return false;
				}
				if (Date.now() >= nextStillPendingAt) {
					const remaining = formatActiveDetails(current);
					params.logReload.warn(`channel reload still deferred after ${elapsedMs}ms with ${remaining.join(", ")} active`);
					nextStillPendingAt = Date.now() + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
				}
			}
		} finally {
			if (deferredChannelReload === deferred) deferredChannelReload = void 0;
		}
	};
	return {
		formatActiveDetails,
		formatDeferredWorkStatus,
		formatTaskBlockers,
		getActiveCounts,
		getDeferredChannelReloads,
		waitForActiveWorkBeforeChannelReload
	};
}
//#endregion
//#region src/gateway/server-reload-channel-restart.ts
async function restartGatewayChannels(options) {
	const { params, nextConfig, channelsToRestart, restartChannelAccounts, activePluginChannelsAfterReload, shouldSkipChannelRestart, skipChannelRestartLogMessage, isLifecycleReloadAborted, getChannelAutostartSuppression, channelReloadTargets, logSuppressedChannelRestart, scheduleRecoveryRestart } = options;
	const collectChannelAccountTargets = () => {
		const targets = [];
		for (const [channel, accountIds] of restartChannelAccounts) {
			if (channelsToRestart.has(channel) || activePluginChannelsAfterReload?.has(channel) === false) continue;
			const plugin = getLoadedChannelPluginEntryById(channel, params.getPluginRegistry())?.plugin;
			let listedAccountIds;
			try {
				listedAccountIds = new Set(plugin?.config.listAccountIds(nextConfig) ?? []);
			} catch (err) {
				scheduleRecoveryRestart(`channel account enumeration (${channel})`, err);
				continue;
			}
			if ([...accountIds].some((accountId) => !listedAccountIds.has(accountId))) {
				channelsToRestart.add(channel);
				continue;
			}
			try {
				for (const accountId of accountIds) plugin?.config.resolveAccount(nextConfig, accountId);
			} catch (err) {
				params.logChannels.info(`promoting ${channel} account reload to whole-channel restart after account resolution failed: ${formatErrorMessage(err)}`);
				channelsToRestart.add(channel);
				continue;
			}
			for (const accountId of accountIds) targets.push([channel, accountId]);
		}
		return targets;
	};
	if (channelsToRestart.size === 0 && restartChannelAccounts.size === 0) return;
	if (shouldSkipChannelRestart) {
		params.logChannels.info(skipChannelRestartLogMessage);
		return;
	}
	const suppressed = Boolean(getChannelAutostartSuppression());
	const operation = suppressed ? "stop" : "restart";
	const phase = suppressed ? "suppressed hot reload" : "hot reload";
	const targets = [...collectChannelAccountTargets(), ...[...channelsToRestart].map((channel) => [channel])];
	const failures = [];
	for (const [channel, accountId] of targets) {
		if (activePluginChannelsAfterReload?.has(channel) === false) continue;
		const target = accountId === void 0 ? `${channel} channel` : `${channel} account ${accountId}`;
		try {
			params.logChannels.info(suppressed ? `stopping ${target} before suppressed hot reload` : `restarting ${target}`);
			const canRestart = () => !suppressed && !isLifecycleReloadAborted();
			await params.stopChannel(channel, accountId, {
				manual: false,
				...canRestart() ? { routeHandoff: true } : {}
			});
			if (canRestart()) {
				const outcomes = await params.startChannel(channel, accountId, {
					preserveManualStop: true,
					skipUnavailableAccounts: true
				});
				for (const [id, outcome] of outcomes) if (outcome.status === "retry") throw new Error(`${channel}[${id}] replacement not admitted: ${outcome.reason}`);
			} else params.releaseChannelRouteHandoffs(channel, accountId);
		} catch (err) {
			failures.push(accountId === void 0 ? channel : `${channel}[${accountId}]`);
			params.logChannels.error(`failed to ${operation} ${target} during ${phase}: ${formatErrorMessage(err)}`);
		}
	}
	if (failures.length > 0) scheduleRecoveryRestart(`channel ${operation} (${failures.join(", ")})`);
	if (suppressed) logSuppressedChannelRestart(channelReloadTargets(), "channel restart during hot reload");
}
//#endregion
//#region src/gateway/applied-config-hash-publisher.ts
function createAppliedConfigHashPublisher(options) {
	let deferredHash = null;
	return {
		hasOutstandingGatewayRestart: options.hasPendingRestart,
		publishAppliedConfigHash: (hash) => {
			if (options.hasPendingRestart()) {
				deferredHash = hash;
				return;
			}
			deferredHash = null;
			options.publish(hash);
		},
		publishDeferredAppliedConfigHash: () => {
			if (deferredHash === null || options.hasPendingRestart()) return;
			const hash = deferredHash;
			deferredHash = null;
			options.publish(hash);
		}
	};
}
//#endregion
//#region src/gateway/server-reload-restart.ts
const RESTART_EMISSION_RETRY_MS = 1e3;
var GatewayRestartTransaction = class {
	constructor(options) {
		this.options = options;
		this.retryStopped = false;
		this.retryTimer = null;
		this.restartDeferral = null;
		this.requestGeneration = 0;
		this.operation = { kind: "idle" };
		this.pausedDebt = null;
		this.conservativeDebt = null;
		this.acceptedTargetState = { kind: "empty" };
		this.appliedConfigHashPublisher = createAppliedConfigHashPublisher({
			hasPendingRestart: () => this.operation.kind === "request" || this.pausedDebt !== null || this.conservativeDebt !== null,
			publish: setRuntimeConfigAppliedHash
		});
		this.isStopped = () => this.retryStopped;
		this.hasPendingConfigCandidate = () => this.acceptedTargetState.kind === "candidate-pending";
		this.hasOperation = () => this.operation.kind !== "idle";
		this.getAcceptedTarget = () => this.acceptedTargetState.kind === "accepted" ? this.acceptedTargetState.target : null;
	}
	recordAcceptedTarget(target) {
		const acceptedTarget = {
			...target,
			prepareRuntimeConfig: async () => {
				if (this.acceptedTargetState !== acceptedState) throw new GatewayConfigReloadSupersededError();
				const prepared = await target.prepareRuntimeConfig();
				if (this.acceptedTargetState !== acceptedState) throw new GatewayConfigReloadSupersededError();
				return prepared;
			}
		};
		const acceptedState = {
			kind: "accepted",
			target: acceptedTarget
		};
		this.acceptedTargetState = acceptedState;
		return { reject: () => {
			const state = this.acceptedTargetState;
			if (!(state.kind === "accepted" && state.target === acceptedTarget || state.kind === "candidate-pending" && state.previousTarget === acceptedTarget)) return;
			this.acceptedTargetState = {
				kind: "candidate-pending",
				previousTarget: void 0
			};
		} };
	}
	publishAcceptedTarget(target) {
		return {
			ownership: this.recordAcceptedTarget(target),
			conservativeDebt: this.takeConservativeDebt()
		};
	}
	restoreConservativeDebt(debt) {
		this.conservativeDebt ??= debt;
	}
	deferDebt(plan, nextConfig, options) {
		this.preserveDebt(this.createRequestDetails(plan, nextConfig, options));
	}
	acceptConfig(acceptedConfig) {
		if (this.operation.kind === "idle" || this.operation.transaction.state !== "rejected") return { retireRejectedRestart: false };
		if (this.operation.kind === "request" && !this.operation.emissionSettled) this.preserveDebt(this.operation.details);
		this.supersedeRequest();
		const configDebt = this.pausedDebt;
		const retainsConfigDebt = configDebt && acceptedConfig && configDebt.restartOwnedPaths.every((path) => isDeepStrictEqual(getConfigValueAtPath({ ...configDebt.nextConfig }, path.split(".")), getConfigValueAtPath({ ...acceptedConfig }, path.split("."))));
		if (!retainsConfigDebt) this.pausedDebt = null;
		const debt = (retainsConfigDebt ? configDebt : null) ?? this.conservativeDebt;
		return debt ? {
			retireRejectedRestart: false,
			debt
		} : { retireRejectedRestart: true };
	}
	beginLifecycle() {
		if (this.operation.kind === "request" && !this.operation.emissionSettled && this.operation.transaction.state !== "pending") this.preserveDebt(this.operation.details);
		this.supersedeRequest();
		const transaction = { state: "pending" };
		this.operation = {
			kind: "lifecycle",
			transaction
		};
		return { settle: (state) => {
			if (transaction.state === "pending") {
				transaction.state = state;
				if (state === "committed") this.pausedDebt = null;
			}
		} };
	}
	pauseForConfigCandidate() {
		const state = this.acceptedTargetState;
		const previousTarget = state.kind === "accepted" ? state.target : state.kind === "candidate-pending" ? state.previousTarget : void 0;
		this.acceptedTargetState = {
			kind: "candidate-pending",
			previousTarget
		};
		this.beginLifecycle().settle("rejected");
	}
	request(plan, nextConfig, options) {
		if (this.retryStopped) return {
			status: "recovery-pending",
			settle: () => {}
		};
		this.supersedeRequest();
		const transaction = { state: "pending" };
		this.operation = {
			kind: "request",
			transaction,
			details: this.createRequestDetails(plan, nextConfig, options),
			emissionSettled: false
		};
		const requestGeneration = this.requestGeneration;
		return {
			status: this.requestForGeneration(plan, nextConfig, requestGeneration, options) ? "accepted" : "recovery-pending",
			settle: (state) => {
				if (transaction.state === "pending") transaction.state = state;
			}
		};
	}
	stop() {
		this.retryStopped = true;
		this.pausedDebt = null;
		this.conservativeDebt = null;
		this.supersedeRequest();
	}
	createRequestDetails(plan, nextConfig, options) {
		const explicitRestartPaths = plan.restartReasons.filter((path) => plan.changedPaths.includes(path));
		return {
			plan,
			nextConfig: options?.debtConfig ?? nextConfig,
			restartOwnedPaths: explicitRestartPaths.length > 0 ? explicitRestartPaths : [...plan.changedPaths],
			retainDebtAcrossConfigChanges: options?.retainDebtAcrossConfigChanges === true
		};
	}
	preserveDebt(details) {
		if (details.retainDebtAcrossConfigChanges) this.conservativeDebt = details;
		else this.pausedDebt = details;
	}
	takeConservativeDebt() {
		const debt = this.conservativeDebt;
		this.conservativeDebt = null;
		return debt;
	}
	markEmissionSettled() {
		if (this.operation.kind === "request") this.operation.emissionSettled = true;
		this.conservativeDebt = null;
	}
	isCurrentRequest(requestGeneration) {
		return !this.retryStopped && requestGeneration === this.requestGeneration && isCurrentGatewayReloadGeneration(this.options.myGeneration);
	}
	supersedeRequest() {
		this.requestGeneration += 1;
		this.restartDeferral?.cancel();
		this.restartDeferral = null;
		if (this.retryTimer) {
			clearTimeout(this.retryTimer);
			this.retryTimer = null;
		}
		this.operation = { kind: "idle" };
	}
	scheduleEmissionRetry(retry) {
		if (this.retryTimer || !this.isCurrentRequest(retry.requestGeneration)) return;
		this.retryTimer = setTimeout(() => {
			this.retryTimer = null;
			if (!this.isCurrentRequest(retry.requestGeneration)) return;
			runWithGatewayIndependentRootWorkAdmission(async () => {
				if (!this.isCurrentRequest(retry.requestGeneration)) return;
				if (retry.prepareForEmit && !await retry.prepareForEmit()) {
					this.scheduleEmissionRetry(retry);
					return;
				}
				const emitResult = this.options.params.requestRecoveryRestart?.(retry.reason, retry.intent);
				if (emitResult && emitResult.status !== "failed") this.markEmissionSettled();
				if (!emitResult || emitResult.status === "failed") this.scheduleEmissionRetry(retry);
			}, "reload:restart").catch((err) => {
				if (this.isCurrentRequest(retry.requestGeneration)) this.options.params.logReload.warn(`gateway restart recovery retry stopped: ${String(err)}`);
			});
		}, RESTART_EMISSION_RETRY_MS);
		this.retryTimer.unref?.();
	}
	requestForGeneration(plan, nextConfig, requestGeneration, options) {
		const { params } = this.options;
		const reasons = plan.restartReasons.length ? plan.restartReasons.join(", ") : plan.changedPaths.join(", ");
		const restartReason = `config reload: ${reasons}`;
		if (!this.options.restartRecoveryAvailable) {
			params.logReload.warn("gateway restart recovery unavailable; restart-required reload rejected");
			return false;
		}
		if (!params.requestRecoveryRestart) {
			params.logReload.warn("gateway restart recovery handler unavailable; restart skipped");
			return false;
		}
		const requestRecoveryRestart = params.requestRecoveryRestart;
		let emissionPrepared = true;
		const prepareForEmit = async () => {
			try {
				await params.assertRestartReady?.(nextConfig);
				if (!this.isCurrentRequest(requestGeneration)) return false;
				const preparedConfig = options?.prepareRuntimeConfig ? await options.prepareRuntimeConfig() : nextConfig;
				if (!this.isCurrentRequest(requestGeneration)) return false;
				emissionPrepared = true;
				setGatewayRestartPolicy({ allowExternal: isRestartEnabled(preparedConfig) });
				return this.isCurrentRequest(requestGeneration);
			} catch (err) {
				emissionPrepared = false;
				params.logReload.warn(`gateway restart preflight failed: ${String(err)}`);
				return false;
			}
		};
		const active = this.options.getActiveCounts();
		if (active.totalActive > 0 || options?.prepareRuntimeConfig || params.assertRestartReady) {
			if (active.totalActive > 0) {
				const initialDetails = this.options.formatActiveDetails(active);
				params.logReload.warn(`config change requires gateway restart (${reasons}) — deferring until ${initialDetails.join(", ")} complete`);
				const taskBlockers = this.options.formatTaskBlockers();
				if (taskBlockers) params.logReload.warn(`restart blocked by active background task run(s): ${taskBlockers}`);
			} else params.logReload.warn(`config change requires gateway restart (${reasons}) — preparing`);
			let failedEmission;
			this.restartDeferral = deferGatewayRestartUntilIdle({
				getPendingCount: () => this.options.getActiveCounts().totalActive,
				maxWaitMs: resolveGatewayRestartDeferralTimeoutMs(void 0),
				timeoutIntent: {
					force: true,
					reason: "config reload forced restart"
				},
				reason: restartReason,
				emitHooks: {
					beforeEmit: async () => {
						emissionPrepared = await prepareForEmit();
					},
					emitRestart: (reason, intent) => {
						if (!this.isCurrentRequest(requestGeneration)) return { status: "coalesced" };
						const resolvedReason = reason ?? restartReason;
						if (!emissionPrepared) {
							failedEmission = {
								reason: resolvedReason,
								intent
							};
							return { status: "failed" };
						}
						const emitResult = requestRecoveryRestart(resolvedReason, intent);
						if (emitResult.status !== "failed") this.markEmissionSettled();
						failedEmission = emitResult.status === "failed" ? {
							reason: resolvedReason,
							intent
						} : void 0;
						return emitResult;
					},
					afterEmitFailed: async () => {
						if (!this.isCurrentRequest(requestGeneration) || !failedEmission) return;
						if (!this.options.restartRecoveryAvailable) {
							params.logReload.warn("gateway restart recovery unavailable; retry skipped");
							return;
						}
						params.logReload.warn("gateway restart recovery emission failed; retrying");
						this.scheduleEmissionRetry({
							...failedEmission,
							requestGeneration,
							prepareForEmit
						});
					}
				},
				hooks: {
					onReady: () => {
						this.restartDeferral = null;
						params.logReload.info("all operations and replies completed; restarting gateway now");
					},
					onStillPending: (_pending, elapsedMs) => {
						params.logReload.warn(`restart still deferred after ${elapsedMs}ms with ${this.options.formatDeferredWorkStatus("active")}`);
					},
					onTimeout: (_pending, elapsedMs) => {
						params.logReload.warn(`restart timeout after ${elapsedMs}ms with ${this.options.formatDeferredWorkStatus("still active")}; forcing restart`);
					},
					onCheckError: (err) => {
						params.logReload.warn(`restart deferral check failed (${String(err)}); pending work is unknown, deferring and retrying`);
					}
				}
			});
			setGatewayRestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
			return true;
		}
		params.logReload.warn(`config change requires gateway restart (${reasons})`);
		const emitResult = requestRecoveryRestart(restartReason);
		if (emitResult.status !== "failed") this.markEmissionSettled();
		if (emitResult.status === "failed") {
			params.logReload.warn("gateway restart recovery emission failed");
			if (this.options.restartRecoveryAvailable) this.scheduleEmissionRetry({
				reason: restartReason,
				requestGeneration,
				prepareForEmit
			});
			return false;
		}
		if (emitResult.status === "coalesced") params.logReload.info("gateway restart already scheduled; skipping duplicate signal");
		setGatewayRestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
		return true;
	}
};
function createGatewayRestartCoordinator(options) {
	const transaction = new GatewayRestartTransaction(options);
	return {
		acceptRestartConfig: (config) => transaction.acceptConfig(config),
		...transaction.appliedConfigHashPublisher,
		beginGatewayRestartLifecycle: () => transaction.beginLifecycle(),
		pauseGatewayRestartForConfigCandidate: () => transaction.pauseForConfigCandidate(),
		publishAcceptedRestartTarget: (target) => transaction.publishAcceptedTarget(target),
		recordAcceptedRestartTarget: (target) => transaction.recordAcceptedTarget(target),
		requestGatewayRestart: (plan, nextConfig, requestOptions) => transaction.request(plan, nextConfig, requestOptions),
		restoreConservativeRestartDebt: (debt) => transaction.restoreConservativeDebt(debt),
		stopRestartRetries: () => transaction.stop(),
		deferGatewayRestartDebt: (plan, nextConfig, requestOptions) => transaction.deferDebt(plan, nextConfig, requestOptions),
		getLatestAcceptedRestartTarget: transaction.getAcceptedTarget,
		hasConfigCandidatePending: transaction.hasPendingConfigCandidate,
		hasRestartRequestTransaction: transaction.hasOperation,
		isRestartRetryStopped: transaction.isStopped
	};
}
//#endregion
//#region src/gateway/server-reload-utils.ts
function projectCanonicalSecretRefsOntoRuntime(sourceValue, runtimeValue) {
	if (isSecretRef(sourceValue)) return sourceValue;
	if (Array.isArray(sourceValue)) {
		const runtimeArray = Array.isArray(runtimeValue) ? runtimeValue : [];
		return sourceValue.map((entry, index) => projectCanonicalSecretRefsOntoRuntime(entry, runtimeArray[index]));
	}
	if (isRecord(sourceValue)) {
		const runtimeRecord = isRecord(runtimeValue) ? runtimeValue : {};
		const projected = { ...runtimeRecord };
		for (const [key, entry] of Object.entries(sourceValue)) projected[key] = projectCanonicalSecretRefsOntoRuntime(entry, runtimeRecord[key]);
		return projected;
	}
	return runtimeValue === void 0 ? sourceValue : runtimeValue;
}
function restoreCanonicalSecretRefs(runtimeConfig, sourceConfig) {
	return projectCanonicalSecretRefsOntoRuntime(sourceConfig, runtimeConfig);
}
function revokeActiveSkillReviewsBeforeConfigPublication(config) {
	if (resolveSkillWorkshopConfig(config).autonomous.mode === "auto") return;
	requestActiveCronJobCancellationByDeclarationKeyPrefix("skill-collection-review:", "Skill collection review disabled by configuration.");
}
function assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable) {
	if (restartRecoveryAvailable !== false) return;
	if (plan.restartGateway) throw new GatewayReloadRequiresRecoveryOwnerError("gateway restart");
	if (plan.pluginLifecycle && plan.reloadPlugins) return;
	if (reloadPlanNeedsRecovery(plan)) throw new GatewayReloadRequiresRecoveryOwnerError("irreversible hot reload");
}
async function disposeMcpRuntimesWithTimeout(params) {
	let timer;
	const disposePromise = Promise.resolve().then(params.dispose).catch((error) => {
		params.onWarn(`${params.label} failed: ${String(error)}`);
	});
	const timeoutPromise = new Promise((resolve) => {
		timer = setTimeout(() => resolve("timeout"), params.timeoutMs);
		timer.unref?.();
	});
	const result = await Promise.race([disposePromise.then(() => "done"), timeoutPromise]);
	if (timer) clearTimeout(timer);
	if (result === "timeout") params.onWarn(`${params.label} exceeded ${params.timeoutMs}ms; continuing`);
}
//#endregion
//#region src/gateway/server-reload-hot.ts
const MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS = 5e3;
function createGatewayReloadHandlers(params) {
	const myGeneration = nextGatewayReloadGeneration();
	const restartRecoveryAvailable = params.restartRecoveryAvailable !== false && params.requestRecoveryRestart !== void 0;
	const { formatActiveDetails, formatDeferredWorkStatus, formatTaskBlockers, getActiveCounts, getDeferredChannelReloads, waitForActiveWorkBeforeChannelReload } = createGatewayActiveWorkTracker({
		params,
		myGeneration
	});
	const { acceptRestartConfig, beginGatewayRestartLifecycle, deferGatewayRestartDebt, getLatestAcceptedRestartTarget, hasOutstandingGatewayRestart, hasConfigCandidatePending, hasRestartRequestTransaction, isRestartRetryStopped, pauseGatewayRestartForConfigCandidate, publishAcceptedRestartTarget, publishAppliedConfigHash, publishDeferredAppliedConfigHash, recordAcceptedRestartTarget, requestGatewayRestart, restoreConservativeRestartDebt, stopRestartRetries } = createGatewayRestartCoordinator({
		params,
		myGeneration,
		restartRecoveryAvailable,
		getActiveCounts,
		formatActiveDetails,
		formatDeferredWorkStatus,
		formatTaskBlockers
	});
	const applyHotReload = async (plan, nextConfig, publication) => {
		publication?.assertInvokerOwned?.();
		assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable);
		const isCurrent = () => !isRestartRetryStopped() && (publication?.isCurrent?.() ?? true);
		const state = params.getState();
		const nextState = { ...state };
		const candidateEnv = publication?.runtimeEnv ?? process.env;
		const modelRuntimeAgentIds = resolveReloadAgentIds(plan.changedPaths);
		const modelRuntimeRefreshScope = modelRuntimeAgentIds ? { agentIds: modelRuntimeAgentIds } : {};
		if (plan.reloadHooks || plan.refreshHooksPolicy) try {
			nextState.hooksConfig = resolveHooksConfig(nextConfig);
		} catch (err) {
			params.logHooks.warn(`hooks config reload failed: ${String(err)}`);
			throw err;
		}
		nextState.hookClientIpConfig = resolveHookClientIpConfig(nextConfig);
		const internalHooks = plan.reloadInternalHooks || plan.reloadPlugins ? await (await import("./loader-BdcP9Wp-.mjs")).prepareInternalHooks(nextConfig, tryResolveConfiguredAgentWorkspaceDir(nextConfig, candidateEnv) ?? resolveDefaultAgentWorkspaceDir(candidateEnv)) : void 0;
		await publication?.checkpoint?.();
		assertReloadPublicationCurrent(publication?.isCurrent() ?? true, isRestartRetryStopped());
		const assertCronReloadCurrent = () => assertReloadPublicationCurrent(publication?.isCurrent() ?? true, isRestartRetryStopped() || !isCurrentGatewayReloadGeneration(myGeneration) || isGatewayReloadGenerationAborted(myGeneration));
		let cronExitWatcherHandoff;
		if (plan.restartCron) {
			const { buildGatewayCronService } = await import("./server-cron-CaHu2yle.mjs");
			assertCronReloadCurrent();
			nextState.cronState = buildGatewayCronService({
				cfg: nextConfig,
				deps: params.deps,
				broadcast: params.broadcast,
				env: publication?.runtimeEnv ?? process.env,
				...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
			});
			if (state.cronState.cronEnabled && nextState.cronState.cronEnabled && state.cronState.storePath === nextState.cronState.storePath) {
				const [previous, next] = await Promise.all([state.cronState.prepareExitWatcherHandoff?.(), nextState.cronState.prepareExitWatcherHandoff?.()]);
				assertCronReloadCurrent();
				if (previous && next) cronExitWatcherHandoff = {
					previous,
					next
				};
			}
		}
		resetDirectoryCache();
		const channelsToRestart = new Set(plan.restartChannels);
		const restartChannelAccounts = new Map([...plan.restartChannelAccounts ?? []].map(([channel, accountIds]) => [channel, new Set(accountIds)]));
		let remainingPlan = {
			...plan,
			reloadPlugins: false
		};
		const prepareConfigEffects = ({ pluginIds, channels }) => {
			for (const channel of channels) {
				channelsToRestart.delete(channel);
				restartChannelAccounts.delete(channel);
			}
			remainingPlan = {
				...plan,
				reloadPlugins: false,
				restartChannels: channelsToRestart,
				restartChannelAccounts,
				restartServices: new Set(params.getPluginRegistry().services.filter((entry) => plan.restartServices?.has(entry.id) && !pluginIds.has(entry.pluginId)).map((entry) => entry.id))
			};
			assertIrreversibleReloadPlanHasRecoveryOwner(remainingPlan, restartRecoveryAvailable);
			const previousConfig = getRuntimeConfig();
			preparedModelRuntimeReplacementGateId = markPreparedModelRuntimeSnapshotsStale("prepared model runtime owner is stale before plugin drain", {
				waitForReplacement: true,
				...modelRuntimeRefreshScope
			});
			return async () => {
				await refreshModelRuntimeAfterHotReload({
					config: previousConfig,
					agentIds: modelRuntimeAgentIds,
					pluginMetadataSnapshot: params.getPluginMetadataSnapshot?.(),
					isPublicationCurrent: () => isCurrentGatewayReloadGeneration(myGeneration) && !isLifecycleReloadAborted() && !isRestartRetryStopped()
				});
			};
		};
		let activePluginChannelsAfterReload = null;
		let pluginReloadAborted = false;
		let runtimeCommitted = false;
		let configCommitFailure;
		const failConfigCommit = (error) => {
			configCommitFailure = { error };
			throw error;
		};
		const isLifecycleReloadAborted = () => isGatewayReloadGenerationAborted(myGeneration);
		const ownsCron = () => isCurrentGatewayReloadGeneration(myGeneration) && !isLifecycleReloadAborted() && !isRestartRetryStopped() && params.getState().cronState === nextState.cronState;
		const isPluginReloadAborted = () => pluginReloadAborted || !runtimeCommitted && !isCurrent() || isRestartRetryStopped() || isLifecycleReloadAborted();
		let preparedModelRuntimeReplacementGateId;
		let recoveryRestartScheduled = false;
		const laneConcurrency = resolveGatewayLaneConcurrency(nextConfig);
		const shouldSkipChannelRestart = isTruthyEnvValue(candidateEnv.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(candidateEnv.OPENCLAW_SKIP_PROVIDERS);
		const channelReloadTargets = () => /* @__PURE__ */ new Set([...channelsToRestart, ...restartChannelAccounts.keys()]);
		const getChannelAutostartSuppression = () => params.getChannelAutostartSuppression?.() ?? null;
		const logSuppressedChannelRestart = (channels, action) => {
			if (!getChannelAutostartSuppression()) return;
			params.logChannels.info(`${action} suppressed by crash-loop breaker for channels: ${[...channels].join(", ")}`);
		};
		const commitRuntime = async (runtime) => {
			if (runtimeCommitted) return;
			let pluginNotificationFailure;
			const commit = async () => {
				if (plan.restartCron) assertCronReloadCurrent();
				publication?.assertInvokerOwned?.();
				runtime?.publish();
				if (runtime) {
					params.setState(nextState);
					runtimeCommitted = true;
				}
				if (plan.restartHeartbeat) nextState.heartbeatRunner.updateConfig(nextConfig);
				revokeActiveSkillReviewsBeforeConfigPublication(nextConfig);
				preparedModelRuntimeReplacementGateId = markPreparedModelRuntimeSnapshotsStale("prepared model runtime owner is stale before config publication", {
					waitForReplacement: true,
					...modelRuntimeRefreshScope
				});
				if (!runtime) {
					params.setState(nextState);
					runtimeCommitted = true;
				}
				if (plan.reloadHooks) commitHooksConfigReload();
				internalHooks?.commit();
				applyGatewayLaneConcurrency(laneConcurrency);
				try {
					runtime?.afterCommit?.();
				} catch (error) {
					pluginNotificationFailure = { error };
					throw error;
				}
				setGatewayRestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
			};
			try {
				await (publication ? publication.publish(commit, () => runtimeCommitted) : commit());
			} catch (error) {
				if (runtimeCommitted && (!pluginNotificationFailure || pluginNotificationFailure.error !== error)) failConfigCommit(error);
				throw error;
			} finally {
				try {
					if (runtimeCommitted && plan.restartCron) {
						if (ownsCron()) {
							params.cronReconciliation.invalidate();
							params.onCronRestart?.();
						}
						if (cronExitWatcherHandoff && ownsCron()) {
							await cronExitWatcherHandoff.next.adopt(cronExitWatcherHandoff.previous.current());
							await cronExitWatcherHandoff.previous.stopOwner();
						} else if (state.cronState.cron.stopAndDrain) await state.cronState.cron.stopAndDrain();
						else {
							state.cronState.cron.stop();
							await state.cronState.stopStreamWatchers();
						}
					}
				} catch (error) {
					failConfigCommit(error);
				}
			}
			if (!ownsCron()) return;
			if (plan.reconcileSystemJobs && await nextState.cronState.reconcileSystemJobs().catch(failConfigCommit) === "retry-scheduled") failConfigCommit(new GatewayHotReloadRecoveryError("cron monitor"));
			if (plan.restartCron && ownsCron()) startGatewayCronWithLogging({
				cronState: nextState.cronState,
				cronReconciliation: params.cronReconciliation,
				reason: "reload",
				config: nextConfig,
				afterStart: async () => {
					await Promise.all([nextState.cronState.reconcileExitWatchers(), nextState.cronState.reconcileStreamWatchers()]);
				},
				logCron: params.logCron,
				onStartError: (err) => {
					if (!ownsCron()) return;
					try {
						scheduleRecoveryRestart("cron reload", err);
					} catch (recoveryError) {
						params.logCron.error(formatErrorMessage(recoveryError));
					}
				}
			});
		};
		const settleRecoveryRestart = (restartTransaction, surface) => {
			if (restartTransaction.status === "recovery-pending" && !restartRecoveryAvailable) {
				restartTransaction.settle("rejected");
				throw new GatewayHotReloadRecoveryError(surface);
			}
			restartTransaction.settle("committed");
			recoveryRestartScheduled = true;
		};
		const scheduleRecoveryRestart = (surface, err) => {
			rejectPendingPreparedModelRuntimeReplacement(preparedModelRuntimeReplacementGateId, err ?? /* @__PURE__ */ new Error(`prepared model runtime replacement stopped during ${surface}`));
			if (plan.pluginLifecycle && !reloadPlanNeedsRecovery(remainingPlan)) throw new PluginRuntimeApplicationError(`Plugin runtime application failed during ${surface}: ${formatErrorMessage(err)}`, {
				...plan.pluginLifecycle,
				pluginIds: [...plan.pluginLifecycle.pluginIds],
				generation: getPluginRuntimeGeneration(),
				phase: runtimeCommitted ? "activate" : "prepare",
				committed: runtimeCommitted
			}, { cause: err });
			const detail = err === void 0 ? "" : `: ${formatErrorMessage(err)}`;
			if (isRestartRetryStopped()) {
				params.logReload.warn(`${surface} failed during gateway shutdown${detail}`);
				return;
			}
			if (!restartRecoveryAvailable || !params.requestRecoveryRestart) {
				const message = runtimeCommitted ? `config hot reload committed with unrecovered ${surface} failure${detail}; gateway restart recovery is unavailable; runtime may be inconsistent` : `config hot reload failed before commit during ${surface}${detail}; gateway restart recovery is unavailable`;
				if (params.logReload.error) params.logReload.error(message);
				else params.logReload.warn(message);
				if (runtimeCommitted) throw new GatewayHotReloadRecoveryError(surface);
				if (err instanceof Error) throw err;
				throw new Error(`config hot reload failed before commit during ${surface}${detail}`);
			}
			const recoveryPlan = {
				...plan,
				restartGateway: true,
				restartReasons: [`hot reload recovery: ${surface}`]
			};
			if (!isCurrent()) {
				params.logReload.warn(`${surface} failed after config supersession${detail}; recovery deferred to the newer config`);
				const target = getLatestAcceptedRestartTarget();
				if (!hasConfigCandidatePending() && !hasRestartRequestTransaction() && target) {
					const restartTransaction = requestGatewayRestart(recoveryPlan, target.runtimeConfig, {
						retainDebtAcrossConfigChanges: true,
						debtConfig: target.sourceConfig,
						prepareRuntimeConfig: target.prepareRuntimeConfig
					});
					settleRecoveryRestart(restartTransaction, surface);
					return;
				}
				deferGatewayRestartDebt(recoveryPlan, nextConfig, {
					retainDebtAcrossConfigChanges: true,
					debtConfig: publication?.sourceConfig ?? nextConfig
				});
				return;
			}
			const commitState = runtimeCommitted ? "after config commit" : "before config commit";
			params.logReload.warn(`${surface} failed ${commitState}${detail}; restarting gateway`);
			if (recoveryRestartScheduled) return;
			try {
				const restartTransaction = requestGatewayRestart(recoveryPlan, nextConfig, {
					retainDebtAcrossConfigChanges: true,
					debtConfig: publication?.sourceConfig ?? nextConfig,
					...publication?.prepareRestartRuntimeConfig ? { prepareRuntimeConfig: publication.prepareRestartRuntimeConfig } : {}
				});
				settleRecoveryRestart(restartTransaction, surface);
			} catch (restartError) {
				params.logReload.warn(`failed to schedule post-commit gateway restart: ${formatErrorMessage(restartError)}`);
				if (restartError instanceof GatewayHotReloadRecoveryError) throw restartError;
				throw new GatewayHotReloadRecoveryError(surface);
			}
		};
		let pluginRuntimeApplication;
		try {
			if (plan.reloadPlugins) {
				const result = await params.reloadPlugins({
					nextConfig,
					sourceConfig: publication ? publication.sourceConfig : nextConfig,
					changedPaths: plan.changedPaths,
					reloadPluginIds: plan.reloadPluginIds,
					pluginLifecycle: plan.pluginLifecycle,
					prepareConfigEffects,
					commitRuntime,
					env: publication?.runtimeEnv ?? process.env,
					isAborted: isPluginReloadAborted,
					checkpoint: publication?.checkpoint,
					assertInvokerOwned: publication?.assertInvokerOwned
				});
				pluginReloadAborted = isPluginReloadAborted();
				if (!pluginReloadAborted) {
					pluginRuntimeApplication = result.runtime;
					activePluginChannelsAfterReload = result.activeChannels;
					params.pruneInactiveChannelAccountState(result.activeChannels);
				}
			}
			const channelTargets = channelReloadTargets();
			if (!pluginReloadAborted && channelTargets.size > 0 && !shouldSkipChannelRestart) pluginReloadAborted = await waitForActiveWorkBeforeChannelReload(channelTargets, isCurrent, !runtimeCommitted) && isPluginReloadAborted();
			if (pluginReloadAborted) throw createReloadCancellationError(!runtimeCommitted && publication?.isCurrent() === false);
		} catch (error) {
			if (runtimeCommitted && (configCommitFailure || error instanceof PluginRuntimeApplicationError && reloadPlanNeedsRecovery(remainingPlan))) {
				scheduleRecoveryRestart("runtime commit", configCommitFailure?.error ?? error);
				return "applied-restart-required";
			}
			if (preparedModelRuntimeReplacementGateId) rejectPendingPreparedModelRuntimeReplacement(preparedModelRuntimeReplacementGateId, error);
			throw error;
		}
		try {
			await commitRuntime();
		} catch (err) {
			if (!runtimeCommitted) throw err;
			scheduleRecoveryRestart("runtime commit", err);
			return "applied-restart-required";
		}
		if (remainingPlan.restartServices?.size) try {
			if (!params.reloadPluginServices) throw new Error("Plugin service reload owner is unavailable");
			await params.reloadPluginServices(nextConfig, remainingPlan.restartServices);
		} catch (err) {
			scheduleRecoveryRestart("plugin services reload", err);
			return "applied-restart-required";
		}
		try {
			await refreshModelRuntimeAfterHotReload({
				config: nextConfig,
				agentIds: modelRuntimeAgentIds,
				pluginMetadataSnapshot: params.getPluginMetadataSnapshot?.()
			});
		} catch (err) {
			scheduleRecoveryRestart("prepared model runtime reload", err);
			return "applied-restart-required";
		}
		if (plan.disposeMcpRuntimes) await disposeMcpRuntimesWithTimeout({
			dispose: () => reloadSessionMcpRuntimes({
				cfg: nextConfig,
				manifestRegistry: params.getPluginMetadataSnapshot?.()?.manifestRegistry,
				reloadPlugins: plan.reloadPlugins
			}),
			timeoutMs: MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS,
			onWarn: params.logReload.warn,
			label: "bundle-mcp runtime disposal during config reload"
		});
		if (plan.restartGmailWatcher) {
			const restartAbortController = params.createGmailRestartAbortController?.() ?? new AbortController();
			try {
				await params.stopPostReadySidecars?.();
				if (!restartAbortController.signal.aborted) {
					const [{ stopGmailWatcher }, { startGmailWatcherWithLogs }] = await Promise.all([import("./gmail-watcher-N6HKvjrt.mjs"), import("./gmail-watcher-lifecycle-BncNe1w8.mjs")]);
					if (!restartAbortController.signal.aborted) await stopGmailWatcher().catch((err) => {
						params.logHooks.warn(`gmail watcher stop failed during reload: ${String(err)}`);
					});
					if (!restartAbortController.signal.aborted) await startGmailWatcherWithLogs({
						cfg: nextConfig,
						log: params.logHooks,
						signal: restartAbortController.signal,
						onSkipped: () => params.logHooks.info("skipping gmail watcher restart (OPENCLAW_SKIP_GMAIL_WATCHER=1)")
					});
				}
			} catch (err) {
				scheduleRecoveryRestart("gmail watcher reload", err);
			} finally {
				params.clearGmailRestartAbortController?.(restartAbortController);
			}
		}
		await restartGatewayChannels({
			params,
			nextConfig,
			channelsToRestart,
			restartChannelAccounts,
			activePluginChannelsAfterReload,
			shouldSkipChannelRestart,
			skipChannelRestartLogMessage: "skipping channel reload (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)",
			isLifecycleReloadAborted,
			getChannelAutostartSuppression,
			channelReloadTargets,
			logSuppressedChannelRestart,
			scheduleRecoveryRestart
		});
		if (shouldRefreshContextWindowCache(plan)) try {
			await refreshContextWindowCache(nextConfig);
		} catch (err) {
			scheduleRecoveryRestart("context window cache reload", err);
		}
		if (plan.hotReasons.length > 0) params.logReload.info(`config hot reload applied (${plan.hotReasons.join(", ")})`);
		else if (plan.noopPaths.length > 0) params.logReload.info(`config change applied (dynamic reads: ${plan.noopPaths.join(", ")})`);
		const status = recoveryRestartScheduled ? "applied-restart-required" : "applied";
		return pluginRuntimeApplication ? {
			status,
			runtime: pluginRuntimeApplication
		} : status;
	};
	return {
		applyHotReload,
		getDeferredChannelReloads,
		acceptRestartConfig,
		publishAppliedConfigHash,
		publishDeferredAppliedConfigHash,
		hasOutstandingGatewayRestart,
		hasConfigCandidatePending,
		beginGatewayRestartLifecycle,
		pauseGatewayRestartForConfigCandidate,
		publishAcceptedRestartTarget,
		recordAcceptedRestartTarget,
		requestGatewayRestart,
		restoreConservativeRestartDebt,
		stopRestartRetries
	};
}
//#endregion
//#region src/gateway/server-reload-managed-secrets.ts
function isRuntimeSecretsPreparationCurrent(preparation) {
	return getActiveSecretsRuntimeSnapshotRevisionState() === preparation.expectedRevision;
}
async function restoreSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, ownedSnapshot, options) {
	if (!(await import("./runtime-Bttj9d8S.mjs")).restoreSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, ownedSnapshot, { runtimeSourceConfig: options?.runtimeSourceConfig })) return false;
	options?.onActivated?.();
	return true;
}
function createManagedReloadSecretHandlers(options) {
	const { params, prepareRuntimeCandidate, tryPrepareRuntimeSecrets, applyHotReload } = options;
	const prepareRestartRuntimeConfig = (runtimeConfig, sourceConfig, transactionOwnership) => transactionOwnership.withRestartPreparation(async (ownership) => {
		for (;;) {
			const prepared = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(runtimeConfig, sourceConfig, ownership), ownership, {
				reason: "restart-check",
				publishFailureAsDegraded: true,
				...ownership.runtimeEnv ? { env: ownership.runtimeEnv.env } : {}
			});
			await ownership.checkpoint();
			assertReloadPublicationCurrent(ownership.isCurrent(), false);
			if (prepared && isRuntimeSecretsPreparationCurrent(prepared)) return prepared.snapshot.config;
		}
	});
	const onEffectiveConfigUnchanged = async (nextConfig, transactionOwnership, sourceConfig) => {
		for (;;) {
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			const previousRuntimeSourceConfig = getRuntimeConfigSourceSnapshot();
			const previousSecretsSnapshot = getActiveSecretsRuntimeSnapshotState();
			const previousSecretsRevision = getActiveSecretsRuntimeSnapshotRevisionState();
			const previousRuntimeMetadata = getRuntimeConfigSnapshotMetadata();
			const nextSecretsSourceConfig = prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership);
			if (previousRuntimeMetadata && previousRuntimeSourceConfig && previousSecretsSnapshot && hasSameSecretReloadContract(previousSecretsSnapshot.sourceConfig, nextSecretsSourceConfig)) {
				const sourceOnlySnapshot = {
					...previousSecretsSnapshot,
					sourceConfig: nextSecretsSourceConfig
				};
				if (!isDeepStrictEqual(sourceOnlySnapshot.config, nextConfig)) throw new GatewayConfigReloadSupersededError();
				await transactionOwnership.checkpoint();
				assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
				if (!setSecretsRuntimeSourceSnapshotIfCurrent({
					expectedSecretsRevision: previousSecretsRevision,
					expectedRuntimeConfigRevision: previousRuntimeMetadata.revision,
					runtimeSourceConfig: sourceConfig,
					secretsSourceConfig: nextSecretsSourceConfig
				})) continue;
				const committedSecretsRevision = getActiveSecretsRuntimeSnapshotRevisionState();
				const rollbackPublishedSource = async () => {
					if (!restoreSecretsRuntimeSourceSnapshotIfLineageCurrent({
						expectedLineageRevision: committedSecretsRevision,
						runtimeSourceConfig: previousRuntimeSourceConfig,
						secretsSourceConfig: previousSecretsSnapshot.sourceConfig
					})) throw new GatewayConfigReloadSupersededError();
				};
				if (!transactionOwnership.isCurrent()) {
					await rollbackPublishedSource();
					throw new GatewayConfigReloadSupersededError();
				}
				return {
					rollback: rollbackPublishedSource,
					commit: () => params.activateRuntimeSecrets.publishStateTransition(sourceOnlySnapshot, {
						sourceOnly: true,
						expectedRevision: committedSecretsRevision
					})
				};
			}
			const preparation = await tryPrepareRuntimeSecrets(nextSecretsSourceConfig, transactionOwnership, {
				reason: "reload",
				publishFailureAsDegraded: true,
				...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {},
				includeAuthStoreRefs: true
			});
			if (!previousRuntimeMetadata || !transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
			if (getRuntimeConfigSnapshotMetadata()?.revision !== previousRuntimeMetadata.revision) {
				if (hasActiveSecretsRuntimeSnapshotLineage(previousSecretsRevision)) continue;
				throw new GatewayConfigReloadSupersededError();
			}
			if (!preparation || preparation.expectedRevision !== previousSecretsRevision || !isRuntimeSecretsPreparationCurrent(preparation)) continue;
			const preparedSecrets = preparation.snapshot;
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			if (!isDeepStrictEqual(preparedSecrets.config, nextConfig)) throw new GatewayConfigReloadSupersededError();
			if (!previousRuntimeSourceConfig || !previousSecretsSnapshot) throw new GatewayConfigReloadSupersededError();
			const activated = await params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent(preparedSecrets, previousSecretsRevision, {
				reason: "reload",
				activate: true,
				deferStatePublication: true,
				runtimeSourceConfig: sourceConfig
			}, void 0, transactionOwnership.isCurrent, transactionOwnership.checkpoint);
			if (!activated) continue;
			const committedSecretsRevision = getActiveSecretsRuntimeSnapshotRevisionState();
			const rollbackPublishedSource = async () => {
				if (!await restoreSecretsRuntimeSnapshotIfCurrent(previousSecretsSnapshot, committedSecretsRevision, activated, { runtimeSourceConfig: previousRuntimeSourceConfig })) throw new GatewayConfigReloadSupersededError();
			};
			if (!transactionOwnership.isCurrent()) {
				await rollbackPublishedSource();
				throw new GatewayConfigReloadSupersededError();
			}
			return {
				rollback: rollbackPublishedSource,
				commit: () => params.activateRuntimeSecrets.publishStateTransition(activated)
			};
		}
	};
	const onHotReload = async (plan, nextConfig, transactionOwnership, sourceConfig) => {
		const authoredChannels = new Set(plan.restartChannels);
		const authoredAccountTargets = new Map([...plan.restartChannelAccounts ?? []].map(([channel, ids]) => [channel, new Set(ids)]));
		for (;;) {
			transactionOwnership.assertInvokerOwned?.();
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			const previousSnapshot = getActiveSecretsRuntimeSnapshotState();
			const previousRuntimeSourceConfig = getRuntimeConfigSourceSnapshot() ?? void 0;
			const previousSnapshotRevision = getActiveSecretsRuntimeSnapshotRevisionState();
			const previousGenerationOwnership = params.sharedGatewaySessionGenerationState.capture();
			const previousSharedGatewaySessionGeneration = previousGenerationOwnership.generation;
			const preparation = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership), transactionOwnership, {
				reason: "reload",
				publishFailureAsDegraded: true,
				...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {},
				includeAuthStoreRefs: transactionOwnership.runtimeRefresh?.includeAuthStoreRefs
			});
			if (!preparation || preparation.expectedRevision !== previousSnapshotRevision || !isRuntimeSecretsPreparationCurrent(preparation)) continue;
			const prepared = preparation.snapshot;
			params.assertRuntimeSecurityConfig?.(prepared.config, transactionOwnership.runtimeEnv?.env);
			const resolvedChannelPlan = buildGatewayReloadPlan(previousSnapshot ? diffConfigPaths(previousSnapshot.config, prepared.config).filter((path) => path === "channels" || path.startsWith("channels.")) : [], { candidateConfig: prepared.config });
			plan.restartChannels = /* @__PURE__ */ new Set([...authoredChannels, ...resolvedChannelPlan.restartChannels]);
			plan.restartChannelAccounts = new Map([...authoredAccountTargets].map(([channel, ids]) => [channel, new Set(ids)]));
			for (const [channel, ids] of resolvedChannelPlan.restartChannelAccounts ?? []) {
				const targets = plan.restartChannelAccounts.get(channel) ?? /* @__PURE__ */ new Set();
				for (const id of ids) targets.add(id);
				plan.restartChannelAccounts.set(channel, targets);
			}
			for (const channel of plan.restartChannels) plan.restartChannelAccounts.delete(channel);
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== previousSnapshotRevision) continue;
			const nextSharedGatewaySessionGeneration = params.resolveSharedGatewaySessionGenerationForConfig(prepared.config);
			const sharedGatewaySessionGenerationChanged = previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration;
			let runtimeSecretsPublished = false;
			let runtimeCommitted = false;
			let publishedSnapshotRevision = null;
			let publishedSharedGatewaySessionGeneration = null;
			let runtimePolicyReconciled = false;
			let applicationStatus;
			const rollbackPublication = async () => {
				const generationOwnership = publishedSharedGatewaySessionGeneration;
				if (!runtimeSecretsPublished || publishedSnapshotRevision === null || !generationOwnership) return;
				let generationRestored = false;
				const restoreGeneration = () => {
					generationRestored = params.sharedGatewaySessionGenerationState.restoreCurrent(generationOwnership, previousSharedGatewaySessionGeneration);
				};
				let snapshotRestored = false;
				if (previousSnapshot) snapshotRestored = await restoreSecretsRuntimeSnapshotIfCurrent(previousSnapshot, publishedSnapshotRevision, prepared, {
					runtimeSourceConfig: previousRuntimeSourceConfig,
					onActivated: restoreGeneration
				});
				else if (getActiveSecretsRuntimeSnapshotRevisionState() === publishedSnapshotRevision) {
					clearSecretsRuntimeSnapshotState();
					snapshotRestored = true;
					restoreGeneration();
				}
				if (snapshotRestored) {
					if (previousSnapshot && shouldRefreshContextWindowCache(plan)) await refreshContextWindowCache(previousSnapshot.config);
					runtimeSecretsPublished = false;
				}
				if (generationRestored && sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
					state: params.sharedGatewaySessionGenerationState,
					clients: params.clients,
					expectedGeneration: previousSharedGatewaySessionGeneration
				});
			};
			try {
				const publication = {
					isCurrent: transactionOwnership.isCurrent,
					checkpoint: transactionOwnership.checkpoint,
					assertInvokerOwned: transactionOwnership.assertInvokerOwned,
					...transactionOwnership.runtimeEnv ? { runtimeEnv: transactionOwnership.runtimeEnv.env } : {},
					sourceConfig,
					prepareRestartRuntimeConfig: () => prepareRestartRuntimeConfig(prepared.config, sourceConfig, transactionOwnership),
					publish: async (commit, isCommitted) => {
						const claimGenerationOwnership = () => {
							publishedSharedGatewaySessionGeneration ??= params.sharedGatewaySessionGenerationState.claim(previousGenerationOwnership, nextSharedGatewaySessionGeneration);
							if (!publishedSharedGatewaySessionGeneration) throw new GatewayHotReloadStaleSecretsError();
						};
						const publishRuntime = async () => {
							runtimeSecretsPublished = true;
							publishedSnapshotRevision = getActiveSecretsRuntimeSnapshotRevisionState();
							claimGenerationOwnership();
							try {
								transactionOwnership.publishRuntimeEnv();
								try {
									await commit();
								} finally {
									if (isCommitted()) {
										runtimeCommitted = true;
										transactionOwnership.markRuntimeCommitted(prepared.config, plan);
										if (!runtimePolicyReconciled) {
											params.commitRuntimePolicy(prepared.config);
											await params.reconcileRuntimePolicy(prepared.config, "committed");
											runtimePolicyReconciled = true;
										}
										if (sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
											state: params.sharedGatewaySessionGenerationState,
											clients: params.clients,
											expectedGeneration: nextSharedGatewaySessionGeneration
										});
									}
								}
							} catch (err) {
								if (!isCommitted()) await rollbackPublication();
								throw err;
							}
						};
						const canActivate = () => {
							transactionOwnership.assertInvokerOwned?.();
							return transactionOwnership.isCurrent() && params.sharedGatewaySessionGenerationState.owns(previousGenerationOwnership);
						};
						if (!await params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent(prepared, previousSnapshotRevision, {
							reason: "reload",
							activate: true,
							runtimeSourceConfig: sourceConfig
						}, publishRuntime, canActivate, transactionOwnership.checkpoint)) throw new GatewayHotReloadStaleSecretsError();
					}
				};
				if (isNoopGatewayReloadPlan(plan)) {
					let committed = false;
					await publication.publish(async () => {
						committed = true;
					}, () => committed);
					applicationStatus = "applied";
				} else applicationStatus = await applyHotReload(plan, prepared.config, publication);
			} catch (err) {
				if (err instanceof GatewayHotReloadStaleSecretsError) {
					await transactionOwnership.checkpoint();
					assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
					continue;
				}
				if (err instanceof GatewayHotReloadRecoveryError) throw err;
				if (runtimeCommitted) throw err;
				await rollbackPublication();
				throw err;
			}
			if (publishedSharedGatewaySessionGeneration) params.sharedGatewaySessionGenerationState.finalize(publishedSharedGatewaySessionGeneration);
			return applicationStatus;
		}
	};
	return {
		onEffectiveConfigUnchanged,
		onHotReload,
		prepareRestartRuntimeConfig
	};
}
//#endregion
//#region src/gateway/server-reload-managed.ts
function canAdvancePreparedModelRuntimeConfigInPlace(plan) {
	return isNoopGatewayReloadPlan(plan) && !doesReloadAffectProviderAuth(plan);
}
function startManagedGatewayConfigReloader(params) {
	const lifecycle = new AbortController();
	if (params.minimalTestGateway) return {
		ready: Promise.resolve(),
		getCommittedRuntimeConfig: () => params.initialConfig,
		stop: async () => {
			lifecycle.abort(new GatewayConfigReloadSupersededError());
		},
		applyPluginLifecycleChange: async () => {
			throw new Error("Plugin lifecycle is unavailable in a minimal Gateway.");
		},
		isConfigReloadSettled: () => !lifecycle.signal.aborted
	};
	const prepareRuntimeCandidate = (runtimeConfig, sourceConfig, ownership) => {
		const canonicalConfig = restoreCanonicalSecretRefs(runtimeConfig, sourceConfig);
		copyConfigResolutionFacts(sourceConfig, canonicalConfig);
		const candidateConfig = ownership?.reapplyRuntimeOverlays(canonicalConfig) ?? canonicalConfig;
		const prepared = params.applyRuntimeConfigOverrides?.(candidateConfig) ?? candidateConfig;
		copyConfigResolutionFacts(candidateConfig, prepared);
		return prepared;
	};
	const applyRuntimeConfigOverrides = (config) => {
		const applied = params.applyRuntimeConfigOverrides?.(config) ?? config;
		copyConfigResolutionFacts(config, applied);
		return applied;
	};
	const restartRecoveryAvailable = params.restartRecoveryAvailable !== false && params.requestRecoveryRestart !== void 0;
	const tryPrepareRuntimeSecrets = async (config, transactionOwnership, activationParams) => {
		await transactionOwnership.checkpoint();
		assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
		const expectedRevision = getActiveSecretsRuntimeSnapshotRevisionState();
		try {
			const snapshot = await params.activateRuntimeSecrets(config, {
				...activationParams,
				activate: false,
				canPublishFailureAsDegraded: () => transactionOwnership.isCurrent() && getActiveSecretsRuntimeSnapshotRevisionState() === expectedRevision
			});
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			return getActiveSecretsRuntimeSnapshotRevisionState() === expectedRevision ? {
				snapshot,
				expectedRevision
			} : null;
		} catch (error) {
			if (lifecycle.signal.aborted) throw error;
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== expectedRevision) return null;
			throw error;
		}
	};
	let activeGmailRestartAbortController = null;
	const abortActiveGmailRestart = () => {
		activeGmailRestartAbortController?.abort();
		activeGmailRestartAbortController = null;
	};
	const createGmailRestartAbortController = () => {
		abortActiveGmailRestart();
		const abortController = new AbortController();
		if (lifecycle.signal.aborted) {
			abortController.abort();
			return abortController;
		}
		activeGmailRestartAbortController = abortController;
		return abortController;
	};
	const { applyHotReload, getDeferredChannelReloads, acceptRestartConfig, beginGatewayRestartLifecycle, hasOutstandingGatewayRestart, hasConfigCandidatePending, pauseGatewayRestartForConfigCandidate, publishAppliedConfigHash, publishAcceptedRestartTarget, publishDeferredAppliedConfigHash, recordAcceptedRestartTarget, requestGatewayRestart, restoreConservativeRestartDebt, stopRestartRetries } = createGatewayReloadHandlers({
		...params,
		releaseChannelRouteHandoffs: params.channelManager.releaseChannelRouteHandoffs,
		pruneInactiveChannelAccountState: params.channelManager.pruneInactiveChannelAccountState,
		createGmailRestartAbortController,
		clearGmailRestartAbortController: (abortController) => {
			if (activeGmailRestartAbortController === abortController) activeGmailRestartAbortController = null;
		},
		assertRestartReady: (config) => import("./openclaw-database-preflight-DwZaE6VW.mjs").then(({ assertOpenClawDatabasesReady }) => assertOpenClawDatabasesReady({
			env: process.env,
			operation: "gateway-restart",
			config
		})),
		restartRecoveryAvailable
	});
	const runManagedRestart = async (plan, nextConfig, transactionOwnership, sourceConfig, restartOptions, beforeRestartRequest) => {
		const isCurrent = () => !lifecycle.signal.aborted && transactionOwnership.isCurrent();
		const assertCurrent = () => {
			if (!isCurrent()) throw new GatewayConfigReloadSupersededError();
		};
		await transactionOwnership.checkpoint();
		assertCurrent();
		const restartLifecycle = beginGatewayRestartLifecycle();
		let preparation;
		try {
			for (;;) {
				await transactionOwnership.checkpoint();
				assertCurrent();
				const ownership = params.sharedGatewaySessionGenerationState.capture();
				const previousRequired = params.sharedGatewaySessionGenerationState.required;
				const prepared = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership), transactionOwnership, {
					reason: "restart-check",
					publishFailureAsDegraded: true,
					...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {}
				});
				await transactionOwnership.checkpoint();
				assertCurrent();
				const generationChanged = !params.sharedGatewaySessionGenerationState.owns(ownership);
				if (!prepared || !isRuntimeSecretsPreparationCurrent(prepared) || generationChanged) continue;
				preparation = {
					ownership,
					previousRequired,
					previousCurrent: ownership.generation,
					nextGeneration: params.resolveSharedGatewaySessionGenerationForConfig(prepared.snapshot.config),
					runtimeConfig: prepared.snapshot.config
				};
				break;
			}
		} catch (error) {
			restartLifecycle.settle("rejected");
			throw error;
		}
		const { ownership: preparationOwnership, previousRequired: previousRequiredSharedGatewaySessionGeneration, previousCurrent: previousSharedGatewaySessionGeneration, nextGeneration: nextSharedGatewaySessionGeneration, runtimeConfig: preparedRuntimeConfig } = preparation;
		let restartTransaction;
		let requiredOwnership = null;
		try {
			await transactionOwnership.checkpoint();
			assertCurrent();
			await params.reconcileRuntimePolicy(preparedRuntimeConfig, "restart");
			await transactionOwnership.checkpoint();
			assertCurrent();
			await beforeRestartRequest?.();
			await transactionOwnership.checkpoint();
			assertCurrent();
			requiredOwnership = params.sharedGatewaySessionGenerationState.setRequired(preparationOwnership, previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration ? nextSharedGatewaySessionGeneration : null);
			if (!requiredOwnership) throw new GatewayHotReloadStaleSecretsError();
			transactionOwnership.publishRuntimeEnv();
			restartTransaction = requestGatewayRestart(plan, preparedRuntimeConfig, {
				...restartOptions,
				debtConfig: sourceConfig,
				prepareRuntimeConfig: () => prepareRestartRuntimeConfig(preparedRuntimeConfig, sourceConfig, transactionOwnership)
			});
			if (restartTransaction.status === "recovery-pending") throw new GatewayHotReloadRecoveryError("config restart");
			if (previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration) disconnectStaleSharedGatewayAuthClients({
				state: params.sharedGatewaySessionGenerationState,
				clients: params.clients,
				expectedGeneration: nextSharedGatewaySessionGeneration
			});
			restartTransaction.settle("committed");
			transactionOwnership.commitRuntimeEnv();
			restartLifecycle.settle("committed");
		} catch (error) {
			restartTransaction?.settle("rejected");
			restartLifecycle.settle("rejected");
			transactionOwnership.rollbackRuntimeEnv();
			if (requiredOwnership) params.sharedGatewaySessionGenerationState.setRequired(requiredOwnership, previousRequiredSharedGatewaySessionGeneration);
			throw error;
		}
	};
	const { onEffectiveConfigUnchanged, onHotReload, prepareRestartRuntimeConfig } = createManagedReloadSecretHandlers({
		params,
		prepareRuntimeCandidate,
		tryPrepareRuntimeSecrets,
		applyHotReload
	});
	let lastCommittedRuntimeConfig;
	let committedRuntimeConfig = params.initialConfig;
	const configReloader = startGatewayConfigReloader({
		onReloadEnabledChange: params.onReloadEnabledChange,
		initialConfig: params.initialConfig,
		initialCompareConfig: params.initialCompareConfig,
		initialSnapshotRawHash: params.initialSnapshotRawHash,
		initialAuthoredConfig: params.initialAuthoredConfig,
		initialIncludedPaths: params.initialIncludedPaths ?? [],
		initialSnapshotValid: params.initialSnapshotValid,
		initialSnapshotIssues: params.initialSnapshotIssues,
		initialPluginInstallRecords: params.initialPluginInstallRecords,
		onConfigCandidateCommitted: (info) => {
			invalidateConfigGetResponseCache();
			params.broadcast("config.changed", {
				path: info.path,
				hash: info.persistedHash ? params.configRevisionProjector.projectRawHash(info.persistedHash) : null,
				ts: Date.now()
			}, { dropIfSlow: true });
		},
		onRuntimeConfigCommitted: (plan, nextCommittedRuntimeConfig) => {
			lastCommittedRuntimeConfig = nextCommittedRuntimeConfig;
			committedRuntimeConfig = nextCommittedRuntimeConfig;
			publishOperatorRoleConfigChange(params.resolveGatewayContext?.());
			publishSystemEventStoreConfig(nextCommittedRuntimeConfig);
			params.resolveGatewayContext?.()?.mentionInbox?.invalidate();
			if (canAdvancePreparedModelRuntimeConfigInPlace(plan)) advancePreparedModelRuntimeConfig(nextCommittedRuntimeConfig);
		},
		...params.prepareConfigCandidate ? { prepareConfigCandidate: params.prepareConfigCandidate } : {},
		runTransaction: (run) => runWithGatewayIndependentRootWorkAdmission(run, "reload:config", lifecycle.signal).catch((error) => {
			if (lifecycle.signal.reason instanceof GatewayConfigReloadSupersededError && error instanceof Error && error.cause === lifecycle.signal.reason) throw lifecycle.signal.reason;
			throw error;
		}),
		readSnapshot: params.readSnapshot,
		promoteSnapshot: async (snapshot, _reason) => await params.promoteSnapshot(snapshot),
		subscribeToWrites: params.subscribeToWrites,
		onConfigCandidateObserved: () => {
			invalidateConfigGetResponseCache();
			pauseGatewayRestartForConfigCandidate();
		},
		onConfigChange: (plan, nextConfig) => {
			assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable);
			params.prepareTerminalConfig(plan, applyRuntimeConfigOverrides(nextConfig));
		},
		onConfigAccepted: async (nextConfig, transactionOwnership, sourceConfig, acceptance) => {
			const assertCurrent = () => {
				assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			};
			const createRestartTarget = () => ({
				runtimeConfig: prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership),
				sourceConfig,
				prepareRuntimeConfig: () => prepareRestartRuntimeConfig(nextConfig, sourceConfig, transactionOwnership)
			});
			let acceptedTargetOwnership;
			let lateConservativeDebt = null;
			try {
				await transactionOwnership.checkpoint();
				assertCurrent();
				const acceptedRestart = acceptRestartConfig(sourceConfig);
				if (!acceptance.runtimeApplied) {
					await transactionOwnership.checkpoint();
					assertCurrent();
					recordAcceptedRestartTarget(createRestartTarget());
					params.acceptTerminalConfig({ retireRejectedRestart: acceptedRestart.retireRejectedRestart });
					publishDeferredAppliedConfigHash();
					return;
				}
				if (acceptedRestart.debt) await runManagedRestart(acceptedRestart.debt.plan, nextConfig, transactionOwnership, sourceConfig, { retainDebtAcrossConfigChanges: acceptedRestart.debt.retainDebtAcrossConfigChanges }, acceptance.publishSource);
				else await acceptance.publishSource?.();
				await transactionOwnership.checkpoint();
				assertCurrent();
				const acceptedTarget = publishAcceptedRestartTarget(createRestartTarget());
				acceptedTargetOwnership = acceptedTarget.ownership;
				lateConservativeDebt = acceptedTarget.conservativeDebt;
				if (lateConservativeDebt && lateConservativeDebt !== acceptedRestart.debt) await runManagedRestart(lateConservativeDebt.plan, nextConfig, transactionOwnership, sourceConfig, { retainDebtAcrossConfigChanges: lateConservativeDebt.retainDebtAcrossConfigChanges });
				await transactionOwnership.checkpoint();
				assertCurrent();
				params.acceptTerminalConfig({ retireRejectedRestart: acceptedRestart.retireRejectedRestart && !lateConservativeDebt });
				publishDeferredAppliedConfigHash();
			} catch (error) {
				if (lateConservativeDebt) restoreConservativeRestartDebt(lateConservativeDebt);
				acceptedTargetOwnership?.reject();
				throw error;
			}
		},
		onConfigApplied: (plan, nextConfig) => {
			if (plan.changedPaths.some((path) => path === "logging" || path.startsWith("logging."))) applyLoggingConfig(nextConfig.logging);
			resetSkillSnapshotConfigFingerprintCache();
		},
		onConfigRevisionApplied: publishAppliedConfigHash,
		hasOutstandingGatewayRestart,
		onEffectiveConfigUnchanged,
		onNoopConfigCommit: async (plan, nextConfig, ownership, sourceConfig) => {
			lastCommittedRuntimeConfig = void 0;
			const applicationStatus = await onHotReload(plan, nextConfig, ownership, sourceConfig);
			if (isNoopGatewayReloadPlan(plan) && !canAdvancePreparedModelRuntimeConfigInPlace(plan)) {
				const pluginMetadataSnapshot = params.getPluginMetadataSnapshot?.();
				await refreshPreparedModelRuntimeSnapshots(lastCommittedRuntimeConfig ?? nextConfig, {
					gatewayLifecycle: true,
					catalogMode: "static",
					allowGatewaySubagentBinding: true,
					...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
				});
			}
			return applicationStatus;
		},
		onHotReload,
		onRestart: runManagedRestart,
		log: {
			info: (msg) => params.logReload.info(msg),
			warn: (msg) => params.logReload.warn(msg),
			error: (msg) => params.logReload.error(msg)
		},
		watchPath: params.watchPath
	});
	return {
		ready: configReloader.ready,
		getCommittedRuntimeConfig: () => committedRuntimeConfig,
		stop: async () => {
			lifecycle.abort(new GatewayConfigReloadSupersededError());
			stopRestartRetries();
			abortPendingChannelReloads();
			abortActiveGmailRestart();
			await configReloader.stop();
		},
		hotReloadStatus: configReloader.hotReloadStatus,
		getDeferredChannelReloads,
		applyPluginLifecycleChange: configReloader.applyPluginLifecycleChange,
		isConfigReloadSettled: () => configReloader.isReady() && !lifecycle.signal.aborted && !configReloader.isReloading() && !hasConfigCandidatePending() && !hasOutstandingGatewayRestart()
	};
}
//#endregion
export { startManagedGatewayConfigReloader };
