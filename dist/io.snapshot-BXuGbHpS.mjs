import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.mjs";
import { D as withPluginCache, d as getPluginMetadataSnapshotCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { n as isErrno, r as isMissingPathError, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as isPathInside } from "./path-safety-0BfxAYBQ.mjs";
import { a as hashConfigIncludeRaw, n as ConfigIncludeError } from "./includes-CaaCq-XN.mjs";
import { t as classifyOtelGrpcMigrationOwnership } from "./include-migration-ownership-D1fnTYxB.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { I as materializeModelPolicyAllowlist } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir, b as resolveIsConfigReadOnly } from "./paths-DehQwyE0.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { h as setConfigResolutionFacts, r as copyConfigResolutionFacts, t as cloneConfigWithResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { i as isPluginSourceModulePath } from "./native-module-require-CFiIAPP0.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { r as shouldWarnOnTouchedVersion } from "./version-ByD9iTct.mjs";
import { h as snapshotEnv, m as restoreEnvChangesIfUnchanged, n as cloneEnvWithPlatformSemantics, t as applyConfigEnvVars } from "./config-env-vars-BHI12YH5.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { r as findStartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
import { o as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { n as OpenClawStateOwnershipError } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { a as withArtifactPreservingStateReads, p as withSynchronousArtifactPreservingStateSnapshot, r as isArtifactPreservingStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { l as findUninspectedPluginDiagnostic, t as discoverConfiguredPluginLoadPaths } from "./discovery-D_5mAUI7.mjs";
import { n as replaceFileAtomic, r as replaceFileAtomicSync } from "./replace-file-DJtj9VLX.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-Rvdo_TFm.mjs";
import { t as loadBundledChannelDoctorContractApi } from "./doctor-contract-api-8Ozuzgil.mjs";
import { i as isPluginDoctorMigrationDeferred, m as applyPluginDoctorCompatibilityMigration, n as applyPluginDoctorCompatibilityMigrations, r as collectDoctorConfigRepairPluginIds } from "./doctor-contract-registry-6tw5Ndqt.mjs";
import { i as resolveConfigWidePluginMetadataSnapshotAsync, r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DPc05JSs.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-DxxfdkXT.mjs";
import "./legacy-config-migrations.runtime.models-BvDaSkAf.mjs";
import { t as resolveChannelAccountBindingRepairInput } from "./legacy-config-binding-repair-input-LZJfZZrP.mjs";
import { n as LEGACY_CONFIG_MIGRATIONS, r as collectToolPolicyConflictWarnings, t as findLegacyConfigIssues } from "./legacy-2ovrASa7.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-CoAPHAUL.mjs";
import { t as captureManagedConfigSnapshotPreparation } from "./runtime-snapshot-DbgWcCyV.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as createDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { a as readDeferredPluginMigrations, o as readDeferredPluginMigrationsAsync } from "./deferred-plugin-migrations-DZuh_dkr.mjs";
import { c as shouldEnableShellEnvFallback, i as loadShellEnvFallback, o as resolveShellEnvFallbackTimeoutMs, s as shouldDeferShellEnvFallback } from "./shell-env-B_7LkFoy.mjs";
import { D as attachAgentListProjection, O as DuplicateAgentDirError, d as asResolvedSourceConfig, f as asRuntimeConfig, k as findDuplicateAgentDirs, p as materializeRuntimeConfig } from "./validation-core-DwJVlxTe.mjs";
import { c as resolveManagedUnsetPathsForWrite, i as preserveDeferredPluginMigrationConfig, o as setDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { a as appendConfigAuditRecordSync, c as createConfigObserveAuditRecord, i as appendConfigAuditRecord } from "./io.audit-CcH6Zt2-.mjs";
import { a as writeConfigHealthPatchInDatabase, i as readConfigHealthStateInDatabase, n as prepareConfigHealthPatch } from "./io.health-state.kernel-gktZBgVh.mjs";
import { a as hashConfigRaw, c as parseConfigJson5, d as resolveConfigIncludesForRead, f as resolveConfigPathForDeps, i as hasConfigMeta, m as resolveGatewayMode, n as containsConfigIncludeDirective, o as maybeLoadDotEnvForConfig, s as normalizeConfigIoDeps, t as coerceConfig, u as resolveConfigForRead } from "./io.read-helpers-N26RjV2V.mjs";
import { a as writeConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { n as createConfigWriteAuthorityGuard, t as composeConfigWriteAssertions } from "./write-authority-BBYsD_pp.mjs";
import { s as withFileLock } from "./file-lock-BmQQ9PQF.mjs";
import "./file-lock-DJoMQumt.mjs";
import { m as recordUpdateDoctorConfigWriteRefusal, u as getUpdateDoctorConfigWriteAuthority } from "./update-doctor-result-C3mikR6I.mjs";
import { t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-B6JBgh1M.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-BQNShMey.mjs";
import { f as migrateLegacyContextBudgetConfig, n as prepareConfigSnapshotValidation, o as validateConfigObjectWithPlugins, s as validateConfigObjectWithPluginsAsync, t as materializeConfigSnapshotDefaults } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { i as unsetConfigValueAtPath, n as parseConfigPath, r as setConfigValueAtPath } from "./config-paths-BKljx7kX.mjs";
import { t as resolveShellEnvExpectedKeys } from "./shell-env-expected-keys-BLCiXv8D.mjs";
import { i as shouldAttemptLastKnownGoodRecovery, n as isPluginLocalInvalidConfigSnapshot, t as collectPollutedSecretPlaceholders } from "./recovery-policy-aFpXeB1n.mjs";
import { a as includeContributionOwnsBindings, i as includeContributionOwnsAgentRoster } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
import crypto, { createHash } from "node:crypto";
//#region src/agents/owner-display.ts
const MAX_OWNER_PROMPT_SENDERS = 16;
function exceedsOwnerPromptContentBudget(ownerNumbers) {
	let bytes = 0;
	for (const ownerId of ownerNumbers) {
		bytes += Buffer.byteLength(ownerId, "utf8") + (bytes > 0 ? 2 : 0);
		if (bytes > 980) return true;
	}
	return false;
}
/** Keep owner identity guidance bounded without changing the authorization allowlist. */
function resolveOwnerPromptNumbers(params) {
	const ownerNumbers = params.ownerNumbers;
	if (!ownerNumbers?.length) return;
	if (ownerNumbers.length <= MAX_OWNER_PROMPT_SENDERS && !exceedsOwnerPromptContentBudget(ownerNumbers)) return ownerNumbers;
	const promptOwners = ownerNumbers.slice(0, MAX_OWNER_PROMPT_SENDERS);
	const senderId = params.senderId;
	if (params.senderIsOwner && senderId && ownerNumbers.includes(senderId)) {
		if (!promptOwners.includes(senderId)) promptOwners[promptOwners.length - 1] = senderId;
		if (exceedsOwnerPromptContentBudget(promptOwners) && promptOwners[0] !== senderId) return [senderId, ...promptOwners.filter((ownerId) => ownerId !== senderId)];
	}
	return promptOwners;
}
/**
* Ensure hash mode has a dedicated secret.
* Returns updated config and generated secret when autofill was needed.
*/
function ensureOwnerDisplaySecret(config, _generateSecret) {
	return { config };
}
//#endregion
//#region src/commands/doctor/shared/channel-legacy-config-migrate.ts
const log = createSubsystemLogger("plugins/doctor-contracts");
function migrateHeartbeatVisibility(raw, changes) {
	const channels = isRecord(raw.channels) ? raw.channels : null;
	if (!channels) return;
	const migrateEntry = (entry, path, preserveEmptyPluginBlock = false) => {
		const heartbeat = isRecord(entry.heartbeat) ? entry.heartbeat : null;
		const keys = heartbeat ? Object.keys(heartbeat) : [];
		if (!heartbeat || preserveEmptyPluginBlock && keys.length === 0 || keys.some((key) => key !== "showOk" && key !== "showAlerts" && key !== "useIndicator")) return;
		if (entry.heartbeatVisibility === void 0) {
			entry.heartbeatVisibility = entry.heartbeat;
			changes.push(`Moved ${path}.heartbeat → ${path}.heartbeatVisibility.`);
		} else changes.push(`Removed ${path}.heartbeat (${path}.heartbeatVisibility already set).`);
		delete entry.heartbeat;
	};
	const defaults = isRecord(channels.defaults) ? channels.defaults : null;
	if (defaults) migrateEntry(defaults, "channels.defaults");
	for (const [channelId, value] of Object.entries(channels)) {
		if (!channelId.trim() || isChannelConfigMetadataKey(channelId) || !isRecord(value)) continue;
		const preserveEmptyPluginBlock = channelId === "feishu";
		migrateEntry(value, `channels.${channelId}`, preserveEmptyPluginBlock);
		const accounts = isRecord(value.accounts) ? value.accounts : null;
		if (!accounts) continue;
		for (const [accountId, account] of Object.entries(accounts)) if (isRecord(account)) migrateEntry(account, `channels.${channelId}.accounts.${accountId}`, preserveEmptyPluginBlock);
	}
}
function resolveBundledChannelCompatibilityNormalizer(channelId) {
	if (isPluginDoctorMigrationDeferred(channelId)) return;
	const contractNormalizer = loadBundledChannelDoctorContractApi(channelId)?.normalizeCompatibilityConfig;
	if (typeof contractNormalizer === "function") return contractNormalizer;
	return getBootstrapChannelPlugin(channelId)?.doctor?.normalizeCompatibilityConfig;
}
function collectPluginDoctorCompatibilityIds(params) {
	const unresolvedChannelIds = new Set(params.unresolvedChannelIds);
	return [.../* @__PURE__ */ new Set([...params.unresolvedChannelIds, ...collectDoctorConfigRepairPluginIds(params.raw).filter((pluginId) => !unresolvedChannelIds.has(pluginId))])].toSorted();
}
/** Apply bundled and plugin channel compatibility migrations to a legacy config object. */
function applyChannelDoctorCompatibilityMigrations(cfg, options) {
	let nextCfg = cfg;
	const loadPaths = nextCfg.plugins?.load?.paths ?? [];
	if (loadPaths.length > 0) {
		const warning = findUninspectedPluginDiagnostic(discoverConfiguredPluginLoadPaths({ loadPaths }).diagnostics);
		if (warning) {
			log.warn(warning.message);
			return {
				next: cfg,
				changes: []
			};
		}
	}
	const changes = [];
	const warnings = [];
	migrateHeartbeatVisibility(cfg, changes);
	const unresolvedChannelIds = [];
	for (const channelId of listDoctorConfiguredChannelIds(cfg, {
		configEntryPolicy: "raw",
		sort: "codepoint"
	})) {
		const normalizeCompatibilityConfig = resolveBundledChannelCompatibilityNormalizer(channelId);
		if (!normalizeCompatibilityConfig) {
			unresolvedChannelIds.push(channelId);
			continue;
		}
		const mutation = applyPluginDoctorCompatibilityMigration({
			pluginId: channelId,
			config: nextCfg,
			normalize: normalizeCompatibilityConfig
		});
		nextCfg = mutation.config;
		changes.push(...mutation.changes);
		warnings.push(...mutation.warnings ?? []);
	}
	const pluginIds = options?.pluginContracts === false ? [] : collectPluginDoctorCompatibilityIds({
		raw: cfg,
		unresolvedChannelIds
	});
	if (pluginIds.length > 0) {
		const compat = applyPluginDoctorCompatibilityMigrations(nextCfg, {
			config: cfg,
			pluginIds
		});
		nextCfg = compat.config;
		changes.push(...compat.changes);
		warnings.push(...compat.warnings ?? []);
	}
	return {
		next: nextCfg,
		changes,
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-compat.ts
const require = createRequire(import.meta.url);
function loadBindingRepair() {
	const source = isPluginSourceModulePath(fileURLToPath(import.meta.url));
	const modulePath = fileURLToPath(new URL(source ? "./legacy-config-binding-repair.runtime.ts" : "./legacy-config-binding-repair.runtime.js", import.meta.url));
	return source ? getCachedPluginModuleLoader({
		modulePath,
		importerUrl: import.meta.url,
		tryNative: false
	})(modulePath) : require(modulePath);
}
/** Apply all legacy doctor migrations to raw config, returning null when nothing changed. */
function applyLegacyDoctorMigrations(raw, options) {
	if (!raw || typeof raw !== "object") return {
		next: null,
		changes: []
	};
	const original = raw;
	const next = cloneConfigWithResolutionFacts(original);
	const changes = [];
	for (const migration of LEGACY_CONFIG_MIGRATIONS) migration.apply(next, changes, options.context);
	const compat = applyChannelDoctorCompatibilityMigrations(next, { pluginContracts: options.pluginContracts !== false });
	changes.push(...compat.changes);
	const ownership = options.pluginContracts !== false && resolveChannelAccountBindingRepairInput(compat.next) ? loadBindingRepair().repairUnownedChannelAccountBindings({
		config: compat.next,
		sourceConfigBeforeMigrations: options.sourceConfigBeforeMigrations
	}) : {
		config: compat.next,
		changes: []
	};
	changes.push(...ownership.changes);
	const warnings = [
		...compat.warnings ?? [],
		...ownership.warnings ?? [],
		...collectToolPolicyConflictWarnings(ownership.config)
	];
	return {
		next: changes.length > 0 ? inheritLegacyDefaultAgentId(original, ownership.config) : null,
		changes,
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
//#region src/config/io.state.ts
const CONFIG_IO_WARNING_CACHE_MAX_SIZE = 4096;
const loggedInvalidConfigs = createDedupeCache({
	ttlMs: 0,
	maxSize: CONFIG_IO_WARNING_CACHE_MAX_SIZE
});
const loggedConfigWarningFingerprints = /* @__PURE__ */ new Map();
const warnedFutureTouchedVersions = createDedupeCache({
	ttlMs: 0,
	maxSize: CONFIG_IO_WARNING_CACHE_MAX_SIZE
});
const autoOwnerDisplaySecretByPath = /* @__PURE__ */ new Map();
/** Retains a warning fingerprint as most-recently used while enforcing the shared bound. */
function setBoundedConfigIoWarningEntry(map, key, value) {
	map.delete(key);
	map.set(key, value);
	pruneMapToMaxSize(map, CONFIG_IO_WARNING_CACHE_MAX_SIZE);
}
//#endregion
//#region src/config/io.health-state.ts
const observations = resolveGlobalSet(Symbol.for("openclaw.configHealthObservations"), "close-and-restart");
const supersededObservation = /* @__PURE__ */ new Error("Config health observation was superseded");
function matchingObservations(next) {
	const matches = [];
	for (const current of observations) if (current.configPath === next.configPath && (current.databasePath === next.databasePath || next.identity() !== void 0 && current.identity() === next.identity())) matches.push(current);
	return matches;
}
function supersedeMatchingObservations(next) {
	for (const current of matchingObservations(next)) observations.delete(current);
}
/** Synchronous producers invalidate in-flight observations without retaining a scope. */
function supersedeConfigHealthObservations(deps, configPath) {
	if (observations.size === 0) return;
	const env = resolveConfigHealthStateEnv(deps);
	const databasePath = resolveOpenClawStateSqlitePath(env);
	let context;
	try {
		context = captureOpenClawStateWorkerContext({
			path: databasePath,
			env
		});
	} catch {}
	supersedeMatchingObservations({
		databasePath,
		configPath,
		identity: () => context?.admission.identity.key
	});
}
const loggedHealthWriteFailures = /* @__PURE__ */ new Map();
function resolveConfigHealthStateEnv(deps) {
	if (deps.env.OPENCLAW_HOME || deps.env.HOME || deps.env.USERPROFILE || deps.env.PREFIX) return deps.env;
	return {
		...deps.env,
		HOME: deps.homedir()
	};
}
function handleHealthReadFailure(error) {
	if (error instanceof OpenClawStateOwnershipError) throw error;
	return {};
}
function handleHealthWriteFailure(deps, databasePath, error) {
	if (error instanceof OpenClawStateOwnershipError || findStartupMaintenanceRequiredError(error)) throw error;
	const message = formatErrorMessage(error);
	const repeated = loggedHealthWriteFailures.get(databasePath) === message;
	setBoundedConfigIoWarningEntry(loggedHealthWriteFailures, databasePath, message);
	if (!repeated) deps.logger.warn(`Config health-state write failed: ${message}`);
}
function readConfigHealthStateFromStore(deps) {
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readConfigHealthStateInDatabase(db), { env: resolveConfigHealthStateEnv(deps) }) ?? {};
	} catch (error) {
		return handleHealthReadFailure(error);
	}
}
function patchConfigHealthEntryToStore(deps, configPath, changes) {
	const env = resolveConfigHealthStateEnv(deps);
	const databasePath = resolveOpenClawStateSqlitePath(env);
	try {
		const patch = prepareConfigHealthPatch(changes);
		if (Object.keys(patch).length === 0) return;
		const updatedAtMs = Date.now();
		runOpenClawStateWriteTransaction(({ db }) => {
			let pending = [];
			if (observations.size > 0) {
				let context;
				try {
					context = captureOpenClawStateWorkerContext({
						path: databasePath,
						env
					});
				} catch {}
				pending = matchingObservations({
					databasePath,
					configPath,
					identity: () => context?.admission.identity.key
				});
			}
			writeConfigHealthPatchInDatabase(db, configPath, patch, updatedAtMs);
			const publish = () => {
				for (const observation of pending) observations.delete(observation);
				loggedHealthWriteFailures.delete(databasePath);
			};
			if (!deferSqlitePostCommitPublication(db, publish)) publish();
		}, {
			env,
			path: databasePath
		});
	} catch (error) {
		handleHealthWriteFailure(deps, databasePath, error);
	}
}
/** Bind one asynchronous observation/recovery to its original shared-state owner. */
function captureConfigHealthStateStore(deps, configPath, assertAdmissionCurrent) {
	const env = resolveConfigHealthStateEnv(deps);
	const databasePath = resolveOpenClawStateSqlitePath(env);
	let captured;
	try {
		captured = { context: captureOpenClawStateWorkerContext({
			path: databasePath,
			env
		}) };
	} catch (error) {
		captured = { error };
	}
	const captureScope = (continuation = false) => {
		assertAdmissionCurrent?.();
		const observation = {
			databasePath,
			configPath,
			identity: () => "context" in captured ? captured.context.admission.identity.key : void 0
		};
		if (!continuation) supersedeMatchingObservations(observation);
		if (matchingObservations(observation).length === 0) observations.add(observation);
		const isCurrent = () => {
			assertAdmissionCurrent?.();
			if ("context" in captured) captured.context.admission.assertCurrent();
			return observations.has(observation);
		};
		const assertCurrent = () => {
			if (!isCurrent()) throw supersededObservation;
		};
		const createOperationGuard = () => {
			let guardFailed = false;
			return {
				rethrowIfInvalid: (error) => {
					if (guardFailed && error !== supersededObservation) throw error;
					try {
						isCurrent();
					} catch {
						throw error;
					}
				},
				assertCurrent: () => {
					try {
						assertCurrent();
					} catch (error) {
						guardFailed = true;
						throw error;
					}
				}
			};
		};
		const store = {
			isCurrent,
			captureContinuation: () => captureScope(true),
			[Symbol.dispose]() {
				observations.delete(observation);
			},
			async read() {
				const artifactPreserving = isArtifactPreservingStateRead();
				const guard = createOperationGuard();
				try {
					if ("error" in captured) throw captured.error;
					const snapshot = await runOpenClawStateWorkerOperation(captured.context, (scope) => scope.execute({
						type: "config.health.read",
						input: { artifactPreserving }
					}), {
						existingOnly: true,
						assertCurrent: guard.assertCurrent
					}) ?? {
						state: {},
						basis: {}
					};
					return isCurrent() ? snapshot : null;
				} catch (error) {
					guard.rethrowIfInvalid(error);
					if (error === supersededObservation) return null;
					const state = handleHealthReadFailure(error);
					return isCurrent() ? {
						state,
						basis: null
					} : null;
				}
			},
			async update(changes, previous) {
				const guard = createOperationGuard();
				try {
					const patch = prepareConfigHealthPatch(changes);
					if (Object.keys(patch).length === 0) return;
					if ("error" in captured) throw captured.error;
					const prior = previous.basis?.[configPath];
					const expected = previous.basis === null ? void 0 : prior ? { ...prior } : null;
					const updatedAtMs = Date.now();
					if (await runOpenClawStateWorkerOperation(captured.context, (scope) => scope.execute({
						type: "config.health.patch",
						input: {
							configPath,
							patch,
							expected,
							updatedAtMs
						}
					}), { assertCurrent: guard.assertCurrent }) && observations.has(observation)) loggedHealthWriteFailures.delete(databasePath);
				} catch (error) {
					guard.rethrowIfInvalid(error);
					if (error === supersededObservation) return;
					handleHealthWriteFailure(deps, databasePath, error);
				}
			},
			async updateAfterFileCommit(changes, previous) {
				try {
					await store.update(changes, previous);
				} catch (error) {
					handleHealthWriteFailure(deps, databasePath, error);
				}
			}
		};
		return store;
	};
	return captureScope();
}
//#endregion
//#region src/config/io.meta.ts
/** Metadata keys automatically stamped on config writes. */
const AUTO_MANAGED_CONFIG_META_PATHS = [
	["meta", "lastTouchedVersion"],
	[
		"meta",
		"migrations",
		"modelPolicyAllowlist"
	],
	[
		"meta",
		"migrations",
		"utilityModelSeparation"
	]
];
function stampConfigWriteMetadata(cfg, _now = (/* @__PURE__ */ new Date()).toISOString(), version = VERSION, previousConfig) {
	const migrationStamped = previousConfig === void 0 ? cfg : materializeUtilityModelSeparation(materializeModelPolicyAllowlist(cfg, previousConfig).config, previousConfig).config;
	return {
		...migrationStamped,
		meta: {
			...migrationStamped.meta,
			lastTouchedVersion: version
		}
	};
}
/** Persist machine-owned metadata only after the matching config file commit succeeds. */
function recordConfigWriteMetadata(now = (/* @__PURE__ */ new Date()).toISOString(), _version = VERSION) {
	writeConfigMachineState("config.lastTouchedAt", now);
}
//#endregion
//#region src/config/write-lock.ts
const CONFIG_MUTATION_LOCK_OPTIONS = {
	retries: {
		retries: 80,
		factor: 1.2,
		minTimeout: 25,
		maxTimeout: 250,
		randomize: true
	},
	stale: 3e4
};
const activeConfigMutationLocks = new AsyncLocalStorage();
const configMutationQueue = new KeyedAsyncQueue();
/** Capture the live source owner, not merely the fact that a lock was once held. */
function captureConfigWriteLockGuard(pathname) {
	const context = activeConfigMutationLocks.getStore();
	const guarded = [...new Set(context?.paths.values())].filter((scope) => scope.assertCurrent);
	if (!guarded.length) return;
	const target = context?.paths.get(path.resolve(pathname));
	return composeConfigWriteAssertions(() => {
		if (!target?.active || !target.assertCurrent) throw new Error("Config write has no live source ownership for this path.");
	}, ...guarded.flatMap((scope) => [() => {
		if (!scope.active) throw new Error("Config write source ownership has closed.");
	}, scope.assertCurrent]));
}
async function runConfigLockScope(configPath, fn, assertCurrent) {
	const scope = {
		active: true,
		accepting: true,
		pending: /* @__PURE__ */ new Set(),
		assertCurrent
	};
	const paths = new Map(activeConfigMutationLocks.getStore()?.paths);
	paths.set(configPath, scope);
	try {
		return await activeConfigMutationLocks.run({
			paths,
			current: scope
		}, async () => {
			let outcome;
			try {
				assertCurrent?.();
				outcome = { value: await fn() };
			} catch (error) {
				outcome = { error };
			} finally {
				scope.accepting = false;
			}
			const failures = [];
			while (scope.pending.size > 0) for (const result of await Promise.allSettled(scope.pending)) if (result.status === "rejected") failures.push(result.reason);
			if (failures.length) throw new AggregateError("error" in outcome ? [outcome.error, ...failures] : failures, "Config write operation did not settle successfully.");
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		});
	} finally {
		scope.active = false;
	}
}
async function withConfigWriteLock(pathname, fn, env, assertCurrent) {
	const configPath = path.resolve(pathname);
	assertConfigWriteAllowedInCurrentMode({
		configPath,
		env
	});
	const assertResourceUnborrowed = (targetPath) => createManagedHandoffLeaseStore().assertSourceUnborrowed(targetPath);
	assertResourceUnborrowed(configPath);
	const inherited = activeConfigMutationLocks.getStore();
	const guardedParent = [...inherited?.paths.entries() ?? []].find(([, scope]) => scope.assertCurrent);
	const parentGuard = guardedParent ? captureConfigWriteLockGuard(guardedParent[0]) : void 0;
	if (parentGuard && !inherited?.current.accepting) throw new Error("Config write source admission has closed.");
	const doctorAuthority = getUpdateDoctorConfigWriteAuthority(configPath);
	const guard = assertCurrent || doctorAuthority ? composeConfigWriteAssertions(parentGuard, assertCurrent, doctorAuthority ? () => doctorAuthority.assertCurrent() : void 0) : captureConfigWriteLockGuard(configPath);
	guard?.();
	const inheritedScope = inherited?.paths.get(configPath);
	if (inheritedScope?.active) {
		const running = Promise.resolve().then(() => {
			assertResourceUnborrowed(configPath);
			captureConfigWriteLockGuard(configPath)?.();
			return guard ? runConfigLockScope(configPath, fn, guard) : fn();
		});
		inheritedScope.pending.add(running);
		try {
			return await running;
		} finally {
			inheritedScope.pending.delete(running);
		}
	}
	const configDir = path.dirname(configPath);
	await fs$1.mkdir(configDir, {
		recursive: true,
		mode: 448
	});
	return await configMutationQueue.enqueue(configPath, async () => {
		return await withFileLock(configPath, {
			...CONFIG_MUTATION_LOCK_OPTIONS,
			assertResourceUnborrowed
		}, () => runConfigLockScope(configPath, fn, guard));
	}).catch(async (error) => {
		recordUpdateDoctorConfigWriteRefusal({
			reason: "config-lock-refused",
			message: formatErrorMessage(error),
			keys: []
		});
		if (!await isPermissionErrorInDirectory(error, configDir)) throw error;
		throw new Error(`OpenClaw cannot write to the config directory ${configDir}. Fix its ownership or permissions, then try again. Underlying error: ${formatErrorMessage(error)}`, { cause: error });
	});
}
function markActiveConfigMutationPath(configPath) {
	captureConfigWriteLockGuard(configPath)?.();
	const scope = activeConfigMutationLocks.getStore();
	if (scope?.current.active) scope.paths.set(path.resolve(configPath), scope.current);
}
async function isPermissionErrorInDirectory(error, directory) {
	if (!isErrno(error) || error.code !== "EACCES" && error.code !== "EPERM" && error.code !== "EROFS") return false;
	const failedPath = error.path;
	if (typeof failedPath !== "string") return false;
	const failedDir = path.dirname(path.resolve(failedPath));
	if (failedDir === directory) return true;
	const canonicalDirectory = await fs$1.realpath(directory).catch(() => void 0);
	return canonicalDirectory !== void 0 && failedDir === canonicalDirectory;
}
//#endregion
//#region src/config/io.write-safety.ts
/** Pin path lookups without pinning the regular file this write will replace. */
function captureConfigFileWritePathProof(filePath, targetPath, ioFs) {
	const facts = /* @__PURE__ */ new Map();
	const visited = /* @__PURE__ */ new Set();
	const conflict = () => new ConfigMutationConflictError("included config target changed since last load", { retryable: false });
	const remember = (entry, stat, link) => {
		if (!facts.has(entry)) facts.set(entry, stat ? {
			kind: "existing",
			dev: stat.dev,
			ino: stat.ino,
			link
		} : { kind: "missing-directory" });
	};
	const capture = (entry) => {
		if (visited.has(entry)) return;
		visited.add(entry);
		const parent = path.dirname(entry);
		if (parent === entry) return;
		capture(parent);
		let realParent;
		try {
			realParent = ioFs.realpathSync(parent);
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
			realParent = resolvePathViaExistingAncestorSync(parent);
		}
		remember(realParent, ioFs.lstatSync(realParent, {
			bigint: true,
			throwIfNoEntry: false
		}));
		const lookup = path.join(realParent, path.basename(entry));
		const stat = ioFs.lstatSync(lookup, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (!stat) {
			if (!isPathInside(lookup, targetPath)) throw conflict();
			return;
		}
		if (stat.isSymbolicLink()) {
			const link = ioFs.readlinkSync(lookup);
			remember(lookup, stat, link);
			capture(path.isAbsolute(link) ? link : `${realParent}${path.sep}${link}`);
		}
	};
	if (path.normalize(resolvePathViaExistingAncestorSync(filePath)) !== targetPath) throw conflict();
	capture(filePath);
	capture(targetPath);
	const assertCurrent = () => {
		for (const [entry, expected] of facts) {
			const stat = ioFs.lstatSync(entry, {
				bigint: true,
				throwIfNoEntry: false
			});
			if (expected.kind === "missing-directory") {
				if (stat && !stat.isDirectory()) throw conflict();
				continue;
			}
			if (!stat || stat.dev !== expected.dev || stat.ino !== expected.ino || (expected.link === void 0 ? !stat.isDirectory() : !stat.isSymbolicLink() || ioFs.readlinkSync(entry) !== expected.link)) throw conflict();
		}
		if (ioFs.lstatSync(targetPath, { throwIfNoEntry: false })?.isSymbolicLink()) throw conflict();
	};
	assertCurrent();
	return {
		path: filePath,
		assertCurrent
	};
}
function formatConfigPermissionHardeningWarning(params) {
	const detail = params.error instanceof Error ? params.error.message : String(params.error);
	return `Config permission hardening failed (${params.context}): ${params.configPath}: ${detail}`;
}
async function chmodConfigBestEffort(params) {
	try {
		await params.deps.fs.promises.chmod?.(params.configPath, 384);
	} catch (error) {
		params.deps.logger.warn(formatConfigPermissionHardeningWarning({
			...params,
			error
		}));
	}
}
function chmodConfigBestEffortSync(params) {
	try {
		params.deps.fs.chmodSync?.(params.configPath, 384);
	} catch (error) {
		params.deps.logger.warn(formatConfigPermissionHardeningWarning({
			...params,
			error
		}));
	}
}
/** Fence new effects; descriptor-bound completion and private cleanup retain their own identity. */
function createGuardedConfigFileSystem(configPath, fsModule, assertCurrent, publication) {
	const includePathProofs = new Map(Object.entries(publication?.includeGraph.targets ?? {}).map(([includePath, target]) => [includePath, publication?.targetPathProof?.path === includePath ? publication.targetPathProof : captureConfigFileWritePathProof(includePath, target, fsModule)]));
	let expectedPublication = publication;
	const authority = createConfigWriteAuthorityGuard(assertCurrent);
	const check = (assertion) => {
		try {
			current();
			assertion();
		} catch (error) {
			refusal ??= { error };
			throw refusal.error;
		}
	};
	let refusal;
	const current = () => {
		if (refusal) throw refusal.error;
		authority();
	};
	const assertPublication = () => check(() => {
		assertTargetIdentity(publishedIdentity);
		if (expectedPublication) assertBaseSnapshotStillCurrent(expectedPublication.snapshot, configPath, fsModule, expectedPublication.includeGraph, includePathProofs);
	});
	const descriptors = /* @__PURE__ */ new Map();
	const privatePaths = /* @__PURE__ */ new Map();
	let publishedIdentity = publication?.publicationIdentity;
	const same = (a, b) => a.dev === b.dev && a.ino === b.ino;
	const assertTargetIdentity = (identity) => {
		if (identity === void 0) return;
		const entry = fsModule.lstatSync(configPath, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (identity === null ? entry !== void 0 : !entry || !same(entry, identity) || !entry.isFile() || entry.nlink !== 1n) throw new ConfigMutationConflictError("config publication identity changed", { retryable: false });
	};
	const assertIdentity = (opened, fd) => {
		const entry = fsModule.lstatSync(opened.path, { bigint: true });
		const held = fd === void 0 ? opened.stat : fsModule.fstatSync(fd, { bigint: true });
		if (!same(entry, opened.stat) || !same(held, opened.stat) || entry.isSymbolicLink() || entry.isFile() && (entry.nlink !== 1n || held.nlink !== 1n)) throw new ConfigMutationConflictError("config write descriptor target changed", { retryable: false });
	};
	const assertDescriptorWrite = (fd) => check(() => {
		const opened = descriptors.get(fd);
		if (!opened?.writable) throw new ConfigMutationConflictError("config write descriptor has no captured owner", { retryable: false });
		if (opened.path !== configPath) assertPublication();
		else {
			publication?.targetPathProof?.assertCurrent();
			for (const proof of includePathProofs.values()) proof.assertCurrent();
			if (publication) assertBaseSnapshotStillCurrent({
				...publication.snapshot,
				raw: null,
				exists: true
			}, configPath, fsModule, publication.includeGraph, includePathProofs);
		}
		assertIdentity(opened, fd);
	});
	const assertPublishedIdentity = () => {
		publication?.targetPathProof?.assertCurrent();
		assertTargetIdentity(publishedIdentity);
	};
	const captureRollbackProof = (assertOwner) => {
		const assertRollbackOwner = () => {
			assertOwner();
			publication?.targetPathProof?.assertCurrent();
		};
		assertRollbackOwner();
		assertPublishedIdentity();
		if (publishedIdentity === void 0) throw new ConfigMutationConflictError("config write has no publication to roll back", { retryable: false });
		return {
			assertCurrent: assertRollbackOwner,
			publicationIdentity: publishedIdentity
		};
	};
	return {
		fileSystem: {
			...fsModule,
			mkdirSync: new Proxy(fsModule.mkdirSync, { apply(target, thisArg, args) {
				assertPublication();
				return Reflect.apply(target, thisArg, args);
			} }),
			openSync: (filePath, flags, mode) => {
				const writable = typeof flags === "number" ? (flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_TRUNC)) !== 0 : /[wa+]/.test(flags);
				if (writable) assertPublication();
				const fd = fsModule.openSync(filePath, flags, mode);
				try {
					const pathname = String(filePath);
					const exclusive = typeof flags === "number" ? (flags & fs.constants.O_EXCL) !== 0 : flags.includes("x");
					const opened = {
						path: pathname,
						stat: fsModule.fstatSync(fd, { bigint: true }),
						writable,
						private: writable && exclusive && pathname !== configPath
					};
					descriptors.set(fd, opened);
					if (opened.private) privatePaths.set(pathname, opened);
					if (writable && pathname === configPath) {
						publishedIdentity = opened.stat;
						publication?.onRootRemoved?.();
					}
					return fd;
				} catch (error) {
					try {
						fsModule.closeSync(fd);
					} catch (closeError) {
						throw new AggregateError([error, closeError], "Config descriptor adoption and close failed", { cause: closeError });
					}
					throw error;
				}
			},
			writeFileSync: new Proxy(fsModule.writeFileSync, { apply(target, thisArg, args) {
				if (typeof args[0] === "number") assertDescriptorWrite(args[0]);
				else assertPublication();
				return Reflect.apply(target, thisArg, args);
			} }),
			ftruncateSync: (fd, length) => {
				assertDescriptorWrite(fd);
				return fsModule.ftruncateSync(fd, length);
			},
			writeSync: new Proxy(fsModule.writeSync, { apply(target, thisArg, args) {
				assertDescriptorWrite(args[0]);
				return Reflect.apply(target, thisArg, args);
			} }),
			fchmodSync: (fd, mode) => {
				const opened = descriptors.get(fd);
				if (publication?.preserveDirectoryMode && fsModule.fstatSync(fd).isDirectory()) return;
				if (opened?.writable) assertIdentity(opened, fd);
				else {
					assertPublication();
					if (opened) assertIdentity(opened, fd);
				}
				return fsModule.fchmodSync(fd, mode);
			},
			fsyncSync: (fd) => {
				const opened = descriptors.get(fd);
				if (opened) assertIdentity(opened, fd);
				return fsModule.fsyncSync(fd);
			},
			closeSync: (fd) => {
				try {
					return fsModule.closeSync(fd);
				} finally {
					descriptors.delete(fd);
				}
			},
			renameSync: (source, destination) => {
				assertPublication();
				const owned = privatePaths.get(String(source)) ?? [...descriptors.values()].find((entry) => entry.path === String(source));
				if (owned) assertIdentity(owned);
				fsModule.renameSync(source, destination);
				privatePaths.delete(String(source));
				if (owned) owned.path = String(destination);
				if (destination === configPath) {
					publishedIdentity = owned?.stat ?? fsModule.lstatSync(configPath, { bigint: true });
					expectedPublication = void 0;
					publication?.onRootPublished?.();
				}
			},
			unlinkSync: (filePath) => {
				const owned = privatePaths.get(String(filePath));
				if (owned) assertIdentity(owned);
				else {
					assertPublication();
					const opened = [...descriptors.values()].find((entry) => entry.path === String(filePath));
					if (opened) assertIdentity(opened);
				}
				fsModule.unlinkSync(filePath);
				privatePaths.delete(String(filePath));
			},
			rmSync: (filePath, options) => {
				assertPublication();
				fsModule.rmSync(filePath, options);
				if (filePath === configPath && expectedPublication) {
					publishedIdentity = null;
					expectedPublication.onRootRemoved?.();
					expectedPublication = {
						...expectedPublication,
						snapshot: {
							...expectedPublication.snapshot,
							exists: false,
							raw: null
						}
					};
				}
			}
		},
		assertCurrent: current,
		assertPublishedIdentity,
		captureRollbackProof
	};
}
function assertBaseSnapshotStillCurrent(snapshot, configPath, ioFs, includeGraph, includePathProofs) {
	if (snapshot.path !== configPath) throw new ConfigMutationConflictError("config path changed since last load", { retryable: false });
	for (const [includePath, expectedHash] of Object.entries(includeGraph?.hashes ?? {})) try {
		const expectedTarget = includeGraph?.targets[includePath];
		if (!expectedTarget) throw new ConfigMutationConflictError("included config target changed since last load", { retryable: false });
		const pathProof = includePathProofs?.get(includePath);
		pathProof?.assertCurrent();
		if (!pathProof && path.normalize(ioFs.realpathSync(includePath)) !== expectedTarget) throw new ConfigMutationConflictError("included config target changed since last load", { retryable: false });
		if (expectedTarget === configPath) continue;
		if (hashConfigIncludeRaw(ioFs.readFileSync(expectedTarget, "utf-8")) !== expectedHash) throw new ConfigMutationConflictError("included config changed since last load");
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
		throw new ConfigMutationConflictError("included config disappeared since last load");
	}
	if (snapshot.readError) return;
	const expectedHash = snapshot.raw === null ? null : hashConfigRaw(snapshot.raw);
	let currentRaw = null;
	let currentExists = true;
	try {
		currentRaw = ioFs.readFileSync(configPath, "utf-8");
	} catch (error) {
		if (error?.code !== "ENOENT") throw error;
		currentExists = false;
	}
	const currentHash = currentExists ? hashConfigRaw(currentRaw) : null;
	if (currentExists !== snapshot.exists || currentExists && expectedHash !== null && currentHash !== expectedHash) throw new ConfigMutationConflictError("config changed since last load");
}
async function tightenStateDirPermissionsIfNeeded(params) {
	const assertCurrent = captureConfigWriteLockGuard(params.configPath);
	if (process.platform === "win32") return;
	const stateDir = resolveStateDir(params.env, params.homedir);
	const configDir = path.dirname(params.configPath);
	if (path.resolve(configDir) !== path.resolve(stateDir)) return;
	try {
		if (((await params.fsModule.promises.stat(configDir)).mode & 63) !== 0) {
			assertCurrent?.();
			params.assertConfigPathForWrite?.();
			await params.fsModule.promises.chmod(configDir, 448);
		}
	} catch {
		assertCurrent?.();
		params.assertConfigPathForWrite?.();
	}
}
async function rollbackConfigFileWriteIfUnchanged(params) {
	const assertCurrent = params.assertCurrent;
	assertCurrent?.();
	let currentRaw = null;
	try {
		currentRaw = await params.fsModule.promises.readFile(params.configPath, "utf-8");
	} catch (error) {
		assertCurrent?.();
		if (error?.code !== "ENOENT") throw error;
	}
	assertCurrent?.();
	if (hashConfigRaw(currentRaw) !== params.committedHash) return false;
	if (params.previousSnapshot.exists && typeof params.previousSnapshot.raw === "string") {
		replaceFileAtomicSync({
			filePath: params.configPath,
			content: params.previousSnapshot.raw,
			dirMode: 448,
			mode: 384,
			copyFallbackOnPermissionError: true,
			syncTempFile: params.durable,
			syncParentDir: params.durable,
			destinationHardlinks: params.destinationHardlinks,
			throwOnCleanupError: true,
			fileSystem: createGuardedConfigFileSystem(params.configPath, params.fsModule, assertCurrent, {
				publicationIdentity: params.publicationIdentity,
				snapshot: {
					...params.previousSnapshot,
					exists: currentRaw !== null,
					raw: currentRaw
				},
				includeGraph: {
					hashes: {},
					targets: {}
				},
				preserveDirectoryMode: params.preserveDirectoryMode
			}).fileSystem
		});
		return true;
	}
	if (params.previousSnapshot.exists) return false;
	createGuardedConfigFileSystem(params.configPath, params.fsModule, assertCurrent, {
		publicationIdentity: params.publicationIdentity,
		snapshot: {
			...params.previousSnapshot,
			exists: currentRaw !== null,
			raw: currentRaw
		},
		includeGraph: {
			hashes: {},
			targets: {}
		}
	}).fileSystem.rmSync(params.configPath, { force: true });
	return true;
}
function normalizeStatNumber(value) {
	return asFiniteNumber(value) ?? null;
}
function normalizeStatId(value) {
	if (typeof value === "bigint") return value.toString();
	return typeof value === "number" && Number.isFinite(value) ? String(value) : null;
}
function resolveConfigStatMetadata(stat) {
	return {
		dev: normalizeStatId(stat?.dev ?? null),
		ino: normalizeStatId(stat?.ino ?? null),
		mode: normalizeStatNumber(stat ? stat.mode & 511 : null),
		nlink: normalizeStatNumber(stat?.nlink ?? null),
		uid: normalizeStatNumber(stat?.uid ?? null),
		gid: normalizeStatNumber(stat?.gid ?? null)
	};
}
function resolveConfigWriteSuspiciousReasons(params) {
	const reasons = [];
	if (!params.existsBefore) return reasons;
	if (params.unreadableBefore) reasons.push("unreadable-config-before-write");
	if (typeof params.sizeBaselineBytes === "number" && typeof params.nextBytes === "number" && params.sizeBaselineBytes >= 512 && params.nextBytes < Math.floor(params.sizeBaselineBytes * .5)) reasons.push(`size-drop:${params.sizeBaselineBytes}->${params.nextBytes}`);
	if (!params.hasMetaBefore) reasons.push("missing-meta-before-write");
	if (params.gatewayModeBefore && !params.gatewayModeAfter) reasons.push("gateway-mode-removed");
	return reasons;
}
function resolveConfigWriteBlockingReasons(suspicious, options = {}) {
	return suspicious.filter((reason) => reason === "unreadable-config-before-write" || reason.startsWith("size-drop:") && options.allowConfigSizeDrop !== true || reason === "gateway-mode-removed");
}
function formatConfigArtifactTimestamp$1(ts) {
	return ts.replaceAll(":", "-").replaceAll(".", "-");
}
function stampConfigVersion(cfg, version, previousConfig) {
	return stampConfigWriteMetadata(cfg, (/* @__PURE__ */ new Date()).toISOString(), version, previousConfig);
}
function resolveConfigSizeBaselineBytes(params) {
	if (params.raw === null) return null;
	const rawBytes = Buffer.byteLength(params.raw, "utf-8");
	const parsed = parseConfigJson5(params.raw, params.json5);
	if (!parsed.ok || !isRecord(parsed.parsed)) return rawBytes;
	const canonical = JSON.stringify(stampConfigVersion(parsed.parsed, params.lastTouchedVersionOverride), null, 2).trimEnd().concat("\n");
	return Buffer.byteLength(canonical, "utf-8");
}
//#endregion
//#region src/config/io.observe-state.ts
function readConfigHealthEntry(state, configPath) {
	const entry = state.entries?.[configPath];
	return isRecord(entry) ? entry : {};
}
function createConfigHealthFingerprint(params) {
	return {
		hash: params.hash ?? hashConfigRaw(params.raw),
		bytes: Buffer.byteLength(params.raw, "utf-8"),
		mtimeMs: params.stat?.mtimeMs ?? null,
		ctimeMs: params.stat?.ctimeMs ?? null,
		...resolveConfigStatMetadata(params.stat),
		hasMeta: hasConfigMeta(params.parsed),
		gatewayMode: resolveGatewayMode(params.resolved ?? params.parsed),
		observedAt: params.observedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
function createConfigFingerprintFromRead(params) {
	const parsed = parseConfigJson5(params.raw, params.deps.json5);
	return createConfigHealthFingerprint({
		raw: params.raw,
		parsed: parsed.ok ? parsed.parsed : {},
		stat: params.stat
	});
}
async function readConfigFingerprintForPath(deps, configPath) {
	try {
		return createConfigFingerprintFromRead({
			deps,
			raw: await deps.fs.promises.readFile(configPath, "utf-8"),
			stat: await deps.fs.promises.stat(configPath).catch(() => null)
		});
	} catch {
		return null;
	}
}
function readConfigFingerprintForPathSync(deps, configPath) {
	try {
		const raw = deps.fs.readFileSync(configPath, "utf-8");
		let stat = null;
		try {
			stat = deps.fs.statSync(configPath, { throwIfNoEntry: false }) ?? null;
		} catch {}
		return createConfigFingerprintFromRead({
			deps,
			raw,
			stat
		});
	} catch {
		return null;
	}
}
function createConfigObserveAuditAppendParams(deps, params) {
	return {
		env: deps.env,
		homedir: deps.homedir,
		record: createConfigObserveAuditRecord(params)
	};
}
function extractRestoreErrorDetails(error) {
	if (!error || typeof error !== "object") return {
		code: null,
		message: typeof error === "string" ? error : null
	};
	return {
		code: "code" in error && typeof error.code === "string" ? error.code : null,
		message: "message" in error && typeof error.message === "string" ? error.message : null
	};
}
//#endregion
//#region src/config/io.observe-suspicious.ts
function isUpdateChannelOnlyRoot(value) {
	if (!isRecord(value)) return false;
	const keys = Object.keys(value);
	if (keys.length !== 1 || keys[0] !== "update") return false;
	const update = value.update;
	if (!isRecord(update)) return false;
	return Object.keys(update).length === 1 && typeof update.channel === "string";
}
function resolveConfigObserveSuspiciousReasons(params) {
	const reasons = [];
	const baseline = params.lastKnownGood;
	if (!baseline) return reasons;
	if (baseline.bytes >= 512 && params.bytes < Math.floor(baseline.bytes * .5)) reasons.push(`size-drop-vs-last-good:${baseline.bytes}->${params.bytes}`);
	if (baseline.hasMeta && !params.hasMeta) reasons.push("missing-meta-vs-last-good");
	if (baseline.gatewayMode && !params.gatewayMode) reasons.push("gateway-mode-missing-vs-last-good");
	if (baseline.gatewayMode && isUpdateChannelOnlyRoot(params.parsed)) reasons.push("update-channel-only-root");
	return reasons;
}
function isRecoverableConfigReadSuspiciousReason(reason) {
	return reason === "missing-meta-vs-last-good" || reason === "gateway-mode-missing-vs-last-good" || reason === "update-channel-only-root" || reason.startsWith("size-drop-vs-last-good:");
}
function resolveConfigReadRecoveryContext(params) {
	const suspicious = resolveConfigObserveSuspiciousReasons({
		bytes: params.current.bytes,
		hasMeta: params.current.hasMeta,
		gatewayMode: params.current.gatewayMode,
		parsed: params.parsed,
		lastKnownGood: params.backupBaseline
	});
	if (!suspicious.some(isRecoverableConfigReadSuspiciousReason)) return null;
	const suspiciousSignature = `${params.current.hash}:${suspicious.join(",")}`;
	if (params.entry.lastObservedSuspiciousSignature === suspiciousSignature) return null;
	return {
		suspicious,
		suspiciousSignature
	};
}
//#endregion
//#region src/config/io.observe.ts
function sameFingerprint(left, right) {
	if (!left) return false;
	return left.hash === right.hash && left.bytes === right.bytes && left.mtimeMs === right.mtimeMs && left.ctimeMs === right.ctimeMs && left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.nlink === right.nlink && left.uid === right.uid && left.gid === right.gid && left.hasMeta === right.hasMeta && left.gatewayMode === right.gatewayMode;
}
function createObservedFingerprint(snapshot, stat) {
	const raw = snapshot.raw;
	return createConfigHealthFingerprint({
		raw,
		parsed: snapshot.parsed,
		resolved: snapshot.resolved,
		stat
	});
}
function resolveObservation(params) {
	const entry = readConfigHealthEntry(params.healthState, params.snapshot.path);
	const baseline = entry.lastKnownGood ?? params.backupBaseline;
	return {
		entry,
		baseline,
		suspicious: resolveConfigObserveSuspiciousReasons({
			bytes: params.current.bytes,
			hasMeta: params.current.hasMeta,
			gatewayMode: params.current.gatewayMode,
			parsed: params.snapshot.parsed,
			lastKnownGood: baseline
		})
	};
}
function resolveHealthyObservationChanges(params) {
	if (!params.snapshot.valid) return null;
	const changes = {
		lastKnownGood: params.current,
		lastObservedSuspiciousSignature: null
	};
	return !sameFingerprint(params.entry.lastKnownGood, params.current) || params.entry.lastObservedSuspiciousSignature !== null ? changes : null;
}
async function observeConfigSnapshot(deps, snapshot, assertCurrent) {
	if (!snapshot.exists || typeof snapshot.raw !== "string") return;
	assertCurrent?.();
	try {
		try {
			var _usingCtx$2 = _usingCtx();
			const health = _usingCtx$2.u(captureConfigHealthStateStore(deps, snapshot.path, assertCurrent));
			const stat = await deps.fs.promises.stat(snapshot.path).catch(() => null);
			if (!health.isCurrent()) return;
			const current = createObservedFingerprint(snapshot, stat);
			const healthSnapshot = await health.read();
			if (!healthSnapshot) return;
			const healthState = healthSnapshot.state;
			const backupPath = `${snapshot.path}.bak`;
			const backupBaseline = readConfigHealthEntry(healthState, snapshot.path).lastKnownGood ?? await readConfigFingerprintForPath(deps, backupPath) ?? void 0;
			if (!health.isCurrent()) return;
			const { entry, baseline, suspicious } = resolveObservation({
				snapshot,
				current,
				healthState,
				backupBaseline
			});
			if (suspicious.length === 0) {
				const changes = resolveHealthyObservationChanges({
					snapshot,
					current,
					entry
				});
				if (changes) await health.update(changes, healthSnapshot);
				return;
			}
			const signature = `${current.hash}:${suspicious.join(",")}`;
			if (entry.lastObservedSuspiciousSignature === signature) return;
			const backup = (baseline?.hash ? baseline : null) ?? await readConfigFingerprintForPath(deps, backupPath);
			if (!health.isCurrent()) return;
			deps.logger.warn(`Config observe anomaly: ${snapshot.path} (${suspicious.join(", ")})`);
			await appendConfigAuditRecord({
				env: deps.env,
				homedir: deps.homedir,
				record: createConfigObserveAuditRecord({
					configPath: snapshot.path,
					valid: snapshot.valid,
					current,
					suspicious,
					lastKnownGood: entry.lastKnownGood,
					backup
				})
			}, assertCurrent);
			await health.update({ lastObservedSuspiciousSignature: signature }, healthSnapshot);
		} catch (_) {
			_usingCtx$2.e = _;
		} finally {
			_usingCtx$2.d();
		}
	} catch (error) {
		if (isStateDatabaseReadAdmissionInvalidatedError(error)) return;
		throw error;
	}
}
function observeConfigSnapshotSync(deps, snapshot) {
	if (!snapshot.exists || typeof snapshot.raw !== "string") return;
	supersedeConfigHealthObservations(deps, snapshot.path);
	const current = createObservedFingerprint(snapshot, deps.fs.statSync(snapshot.path, { throwIfNoEntry: false }) ?? null);
	const healthState = readConfigHealthStateFromStore(deps);
	const backupPath = `${snapshot.path}.bak`;
	const { entry, baseline, suspicious } = resolveObservation({
		snapshot,
		current,
		healthState,
		backupBaseline: readConfigHealthEntry(healthState, snapshot.path).lastKnownGood ?? readConfigFingerprintForPathSync(deps, backupPath) ?? void 0
	});
	if (suspicious.length === 0) {
		const changes = resolveHealthyObservationChanges({
			snapshot,
			current,
			entry
		});
		if (changes) patchConfigHealthEntryToStore(deps, snapshot.path, changes);
		return;
	}
	const signature = `${current.hash}:${suspicious.join(",")}`;
	if (entry.lastObservedSuspiciousSignature === signature) return;
	const backup = (baseline?.hash ? baseline : null) ?? readConfigFingerprintForPathSync(deps, backupPath);
	deps.logger.warn(`Config observe anomaly: ${snapshot.path} (${suspicious.join(", ")})`);
	appendConfigAuditRecordSync({
		env: deps.env,
		homedir: deps.homedir,
		record: createConfigObserveAuditRecord({
			configPath: snapshot.path,
			valid: snapshot.valid,
			current,
			suspicious,
			lastKnownGood: entry.lastKnownGood,
			backup
		})
	});
	patchConfigHealthEntryToStore(deps, snapshot.path, { lastObservedSuspiciousSignature: signature });
}
//#endregion
//#region src/config/io.owner-display-secret.ts
/** Retains generated owner display secrets in memory without persisting them into config. */
function retainGeneratedOwnerDisplaySecret(params) {
	const { config, configPath, generatedSecret, state } = params;
	if (!generatedSecret) {
		state.pendingByPath.delete(configPath);
		return config;
	}
	state.pendingByPath.set(configPath, generatedSecret);
	return config;
}
//#endregion
//#region src/config/runtime-overrides.ts
let overrides = {};
function sanitizeOverrideValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (Array.isArray(value)) return value.map((entry) => sanitizeOverrideValue(entry, seen));
	if (!isPlainObject(value)) return value;
	if (seen.has(value)) return {};
	seen.add(value);
	const sanitized = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry === void 0 || isBlockedObjectKey(key)) continue;
		sanitized[key] = sanitizeOverrideValue(entry, seen);
	}
	seen.delete(value);
	return sanitized;
}
function mergeOverrides(base, override) {
	if (!isPlainObject(base) || !isPlainObject(override)) return override;
	const next = { ...base };
	for (const [key, value] of Object.entries(override)) {
		if (value === void 0 || isBlockedObjectKey(key)) continue;
		next[key] = mergeOverrides(base[key], value);
	}
	return next;
}
function applyOverrideTree(cfg, overrideTree) {
	const next = mergeOverrides(cfg, overrideTree);
	if (next.agents === cfg.agents) return inheritLegacyDefaultAgentId(cfg, next);
	return inheritLegacyDefaultAgentId(cfg, attachAgentListProjection(next));
}
/** Return the process-local runtime override tree used by debug config commands. */
function getConfigOverrides() {
	return overrides;
}
/** Clear all process-local runtime overrides. Intended for debug reset flows and tests. */
function resetConfigOverrides() {
	overrides = {};
}
/** Set one runtime override at a parsed config path after sanitizing object values. */
function setConfigOverride(pathRaw, value) {
	const parsed = parseConfigPath(pathRaw);
	if (!parsed.ok) return err(parsed.error);
	setConfigValueAtPath(overrides, parsed.path, sanitizeOverrideValue(value));
	return ok(parsed.path);
}
/** Remove one runtime override path and report whether an override was present. */
function unsetConfigOverride(pathRaw) {
	const parsed = parseConfigPath(pathRaw);
	if (!parsed.ok) return err(parsed.error);
	const removed = unsetConfigValueAtPath(overrides, parsed.path);
	return ok(removed);
}
/** Merge the current runtime overrides over a loaded config without mutating the input config. */
function applyConfigOverrides(cfg) {
	if (!overrides || Object.keys(overrides).length === 0) return cfg;
	return applyOverrideTree(cfg, overrides);
}
/** Capture an immutable applier for the process-local overrides active at this instant. */
function captureConfigOverrideApplier() {
	const capturedOverrides = structuredClone(overrides);
	if (Object.keys(capturedOverrides).length === 0) return (cfg) => cfg;
	return (cfg) => applyOverrideTree(cfg, capturedOverrides);
}
//#endregion
//#region src/config/io.context.ts
function createConfigIoContext(options = {}) {
	const deps = normalizeConfigIoDeps(options);
	const configPath = resolveConfigPathForDeps(deps);
	const pathResolution = {
		env: deps.env,
		homedir: options.homedir
	};
	function resolveDeferredPluginMigrations() {
		return options.deferredPluginMigrations ?? (options.pluginValidation === "core-only" ? [] : readDeferredPluginMigrations({
			env: deps.env,
			artifactPreservingReadOnly: !deps.observe
		}));
	}
	async function resolveDeferredPluginMigrationsAsync() {
		return options.deferredPluginMigrations ?? (options.pluginValidation === "core-only" ? [] : readDeferredPluginMigrationsAsync({
			env: deps.env,
			artifactPreservingReadOnly: !deps.observe
		}));
	}
	function observeLoadConfigSnapshot(snapshot) {
		if (deps.observe) observeConfigSnapshotSync(deps, snapshot);
		return snapshot;
	}
	async function observeLoadConfigSnapshotAsync(snapshot, assertCurrent) {
		if (deps.observe) await observeConfigSnapshot(deps, snapshot, assertCurrent);
		return snapshot;
	}
	function shouldLoadShellEnv(config, env) {
		return (shouldEnableShellEnvFallback(env) || config.env?.shellEnv?.enabled === true) && options.shellEnvFallback !== "defer" && !shouldDeferShellEnvFallback(env);
	}
	async function finalizeLoadedRuntimeConfigAsync(config, metadata, assertCurrent) {
		if (!metadata.getSnapshot()) {
			const env = cloneEnvWithPlatformSemantics(deps.env);
			applyConfigEnvVars(config, env);
			if (shouldLoadShellEnv(config, env)) await metadata.loadAsync(config);
		}
		assertCurrent?.();
		const snapshot = metadata.getSnapshot();
		return snapshot ? withPluginMetadataSnapshotScope(snapshot, () => finalizeLoadedRuntimeConfig(config), {
			config,
			env: deps.env
		}) : finalizeLoadedRuntimeConfig(config);
	}
	function finalizeLoadedRuntimeConfig(cfg) {
		const duplicates = findDuplicateAgentDirs(cfg, pathResolution);
		if (duplicates.length > 0) throw new DuplicateAgentDirError(duplicates);
		applyConfigEnvVars(cfg, deps.env);
		if (shouldLoadShellEnv(cfg, deps.env)) loadShellEnvFallback({
			enabled: true,
			env: deps.env,
			expectedKeys: resolveShellEnvExpectedKeys(deps.env, cfg),
			logger: deps.logger,
			timeoutMs: cfg.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(deps.env)
		});
		const pendingValue = autoOwnerDisplaySecretByPath.get(configPath);
		const { config: resolvedConfig, generatedSecret } = ensureOwnerDisplaySecret(cfg, () => pendingValue ?? crypto.randomBytes(32).toString("hex"));
		const finalized = applyConfigOverrides(retainGeneratedOwnerDisplaySecret({
			config: resolvedConfig,
			configPath,
			generatedSecret,
			state: { pendingByPath: autoOwnerDisplaySecretByPath }
		}));
		const inherited = inheritLegacyDefaultAgentId(cfg, finalized);
		copyConfigResolutionFacts(cfg, inherited);
		return inherited;
	}
	function createValidationPluginMetadataSnapshotLoader(params) {
		let snapshot;
		let pending;
		return {
			load: (config) => {
				snapshot ??= resolveConfigWidePluginMetadataSnapshot({
					config,
					env: params.env,
					allowCurrent: params.allowCurrentPluginMetadata
				});
				return { manifestRegistry: snapshot.manifestRegistry };
			},
			loadAsync: (config) => pending ??= (async () => {
				snapshot ??= await resolveConfigWidePluginMetadataSnapshotAsync({
					config,
					env: params.env,
					allowCurrent: params.allowCurrentPluginMetadata
				});
				const records = await withPluginCache(getPluginMetadataSnapshotCache(snapshot), () => loadInstalledPluginIndexInstallRecords({ env: params.env })).catch(() => ({}));
				return {
					manifestRegistry: snapshot.manifestRegistry,
					installedPluginRecordIds: new Set(Object.keys(records))
				};
			})(),
			getManifestRegistry: () => snapshot?.manifestRegistry,
			getSnapshot: () => snapshot
		};
	}
	function resolveRuntimePreflightSourceConfig(candidate, includeFileHashes, includeFileTargets, baseEnv = deps.env) {
		const env = cloneEnvWithPlatformSemantics(baseEnv);
		const resolvedIncludes = resolveConfigIncludesForRead(candidate, configPath, {
			...deps,
			env
		}, includeFileHashes, includeFileTargets);
		const resolution = resolveConfigForRead(resolvedIncludes, env, deps.lowerPrecedenceEnv);
		const contextBudgetConfig = migrateLegacyContextBudgetConfig(resolution.resolvedConfigRaw).config;
		return coerceConfig(migratePersistedImplicitMainRoster(contextBudgetConfig, {
			env,
			homedir: deps.homedir
		}).config);
	}
	function* prepareRecoveryBackupCandidateSteps(candidate) {
		try {
			const originalEnv = cloneEnvWithPlatformSemantics(deps.env);
			const includeProvenance = [];
			const originalResolvedIncludes = resolveConfigIncludesForRead(candidate.parsed, configPath, {
				...deps,
				env: originalEnv
			}, void 0, void 0, void 0, (event) => {
				const { value: _value, ...ownership } = event;
				includeProvenance.push(ownership);
			});
			const originalResolution = resolveConfigForRead(originalResolvedIncludes, originalEnv, deps.lowerPrecedenceEnv);
			const otelOwnership = classifyOtelGrpcMigrationOwnership({
				snapshot: {
					path: configPath,
					includeProvenance
				},
				authoredConfig: candidate.parsed,
				resolvedConfig: originalResolution.resolvedConfigRaw
			});
			if (otelOwnership && otelOwnership.kind !== "direct") return {
				ok: false,
				reason: otelOwnership.kind === "resolved-only" ? "candidate migration cannot persist an env-resolved diagnostics.otel.protocol repair" : "candidate migration requires an include-owned diagnostics.otel.protocol repair"
			};
			const prepareValidation = (pending) => {
				const migration = applyLegacyDoctorMigrations(candidate.parsed, {
					sourceConfigBeforeMigrations: originalResolution.resolvedConfigRaw,
					context: {
						authoredRaw: candidate.parsed,
						resolvedRaw: originalResolution.resolvedConfigRaw
					}
				});
				const authoredCandidate = migration.next ? preserveDeferredPluginMigrationConfig({
					sourceConfig: candidate.parsed,
					nextConfig: migration.next,
					pending
				}) : candidate.parsed;
				const candidateEnv = cloneEnvWithPlatformSemantics(deps.env);
				const resolved = resolveConfigIncludesForRead(authoredCandidate, configPath, {
					...deps,
					env: candidateEnv
				});
				const effectiveConfigRaw = resolveConfigForRead(resolved, candidateEnv, deps.lowerPrecedenceEnv).resolvedConfigRaw;
				return {
					migrated: migration,
					authoredCandidate,
					effectiveConfigRaw,
					pluginMetadata: createValidationPluginMetadataSnapshotLoader({
						effectiveConfigRaw,
						env: candidateEnv
					}),
					validationOptions: {
						...pathResolution,
						env: candidateEnv,
						pluginValidation: options.pluginValidation,
						sourceRaw: authoredCandidate,
						preservedLegacyRootKeys: options.preservedLegacyRootKeys,
						deferredPluginMigrations: pending
					}
				};
			};
			const { migrated: legacyMigration, authoredCandidate: preparedRawConfig, validated } = yield {
				sync: () => withSynchronousArtifactPreservingStateSnapshot(() => {
					const prepared = prepareValidation(resolveDeferredPluginMigrations());
					return {
						migrated: prepared.migrated,
						authoredCandidate: prepared.authoredCandidate,
						validated: validateConfigObjectWithPlugins(prepared.effectiveConfigRaw, {
							...prepared.validationOptions,
							loadPluginMetadataSnapshot: prepared.pluginMetadata.load
						})
					};
				}),
				async: async () => {
					const prepared = prepareValidation(await resolveDeferredPluginMigrationsAsync());
					return {
						migrated: prepared.migrated,
						authoredCandidate: prepared.authoredCandidate,
						validated: await validateConfigObjectWithPluginsAsync(prepared.effectiveConfigRaw, {
							...prepared.validationOptions,
							loadPluginMetadataSnapshotAsync: prepared.pluginMetadata.loadAsync
						})
					};
				}
			};
			if (!validated.ok) {
				const issueSummary = formatConfigIssueSummary(validated.issues.slice(0, 3)) ?? "";
				const detail = issueSummary.length > 800 ? `${issueSummary.slice(0, 799)}…` : issueSummary;
				return {
					ok: false,
					reason: `candidate remains invalid after legacy migration${detail ? `: ${detail}` : ""}`
				};
			}
			return {
				ok: true,
				candidate: {
					config: validated.config,
					parsed: preparedRawConfig,
					raw: legacyMigration.next ? JSON.stringify(preparedRawConfig, null, 2).trimEnd().concat("\n") : candidate.raw
				}
			};
		} catch (error) {
			return {
				ok: false,
				reason: `candidate preparation failed: ${error instanceof Error ? error.message : String(error)}`
			};
		}
	}
	function prepareRecoveryBackupCandidate(candidate) {
		const steps = prepareRecoveryBackupCandidateSteps(candidate);
		let next = steps.next();
		while (!next.done) try {
			next = steps.next(next.value.sync());
		} catch (error) {
			next = steps.throw(error);
		}
		return next.value;
	}
	async function prepareRecoveryBackupCandidateAsync(candidate) {
		const steps = prepareRecoveryBackupCandidateSteps(candidate);
		let next = steps.next();
		while (!next.done) try {
			next = steps.next(await next.value.async());
		} catch (error) {
			next = steps.throw(error);
		}
		return next.value;
	}
	return {
		deps,
		pathResolution,
		configPath,
		options,
		resolveDeferredPluginMigrations,
		resolveDeferredPluginMigrationsAsync,
		observeLoadConfigSnapshot,
		observeLoadConfigSnapshotAsync,
		finalizeLoadedRuntimeConfig,
		finalizeLoadedRuntimeConfigAsync,
		createValidationPluginMetadataSnapshotLoader,
		resolveRuntimePreflightSourceConfig,
		prepareRecoveryBackupCandidate,
		prepareRecoveryBackupCandidateAsync
	};
}
//#endregion
//#region src/config/io.clobber-snapshot.ts
/** Maximum retained clobbered-config snapshots per config file. */
const CONFIG_CLOBBER_SNAPSHOT_LIMIT = 32;
const CONFIG_CLOBBER_LOCK_STALE_MS = 3e4;
const CONFIG_CLOBBER_LOCK_RETRY_MS = 10;
const CONFIG_CLOBBER_LOCK_TIMEOUT_MS = 2e3;
const clobberSnapshotQueue = new KeyedAsyncQueue();
const clobberCapWarnedPaths = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
function formatConfigArtifactTimestamp(ts) {
	return ts.replaceAll(":", "-").replaceAll(".", "-");
}
function isFsErrorCode(error, code) {
	return error instanceof Error && "code" in error && typeof error.code === "string" && error.code === code;
}
function resolveClobberPaths(configPath) {
	const dir = path.dirname(configPath);
	const basename = path.basename(configPath);
	return {
		dir,
		prefix: `${basename}.clobbered.`,
		lockPath: path.join(dir, `${basename}.clobber.lock`)
	};
}
function shouldRemoveStaleLock(mtimeMs, nowMs) {
	return typeof mtimeMs === "number" && nowMs - mtimeMs > CONFIG_CLOBBER_LOCK_STALE_MS;
}
async function acquireClobberLock(deps, lockPath) {
	const startedAt = Date.now();
	while (Date.now() - startedAt < CONFIG_CLOBBER_LOCK_TIMEOUT_MS) try {
		await deps.fs.promises.mkdir(lockPath, { mode: 448 });
		return true;
	} catch (error) {
		if (!isFsErrorCode(error, "EEXIST")) return false;
		if (shouldRemoveStaleLock((await deps.fs.promises.stat(lockPath).catch(() => null))?.mtimeMs, Date.now())) {
			await deps.fs.promises.rmdir(lockPath).catch(() => {});
			continue;
		}
		await sleep(CONFIG_CLOBBER_LOCK_RETRY_MS);
	}
	return false;
}
function acquireClobberLockSync(deps, lockPath) {
	for (let attempt = 0; attempt < 2; attempt++) try {
		deps.fs.mkdirSync(lockPath, { mode: 448 });
		return true;
	} catch (error) {
		if (!isFsErrorCode(error, "EEXIST")) return false;
		if (!shouldRemoveStaleLock(deps.fs.statSync(lockPath, { throwIfNoEntry: false })?.mtimeMs, Date.now())) return false;
		try {
			deps.fs.rmdirSync(lockPath);
		} catch {
			return false;
		}
	}
	return false;
}
function compareClobberedSiblings(left, right) {
	return left.timestampKey.localeCompare(right.timestampKey) || left.mtimeMs - right.mtimeMs || left.name.localeCompare(right.name);
}
function createClobberedSiblingSnapshot(params) {
	return {
		name: params.entry,
		path: path.join(params.dir, params.entry),
		timestampKey: params.entry.slice(params.prefix.length).replace(/-\d{2}$/, ""),
		mtimeMs: params.mtimeMs
	};
}
async function listClobberedSiblings(deps, dir, prefix) {
	try {
		const entries = await deps.fs.promises.readdir(dir);
		const snapshots = [];
		for (const entry of entries) {
			if (!entry.startsWith(prefix)) continue;
			const stat = await deps.fs.promises.stat(path.join(dir, entry)).catch(() => null);
			snapshots.push(createClobberedSiblingSnapshot({
				dir,
				entry,
				prefix,
				mtimeMs: stat?.mtimeMs ?? 0
			}));
		}
		return snapshots.toSorted(compareClobberedSiblings);
	} catch {
		return [];
	}
}
function listClobberedSiblingsSync(deps, dir, prefix) {
	try {
		const snapshots = [];
		for (const entry of deps.fs.readdirSync(dir)) {
			if (!entry.startsWith(prefix)) continue;
			const stat = deps.fs.statSync(path.join(dir, entry), { throwIfNoEntry: false });
			snapshots.push(createClobberedSiblingSnapshot({
				dir,
				entry,
				prefix,
				mtimeMs: stat?.mtimeMs ?? 0
			}));
		}
		return snapshots.toSorted(compareClobberedSiblings);
	} catch {
		return [];
	}
}
function warnClobberCapReached(deps, configPath, existing) {
	if (clobberCapWarnedPaths.check(configPath)) return;
	deps.logger.warn(`Config clobber snapshot cap reached for ${configPath}: ${existing} existing .clobbered.* files; rotating oldest snapshots to preserve the latest forensic copy.`);
}
async function rotateOldestClobberedSiblings(deps, snapshots) {
	const deleteCount = Math.max(0, snapshots.length - CONFIG_CLOBBER_SNAPSHOT_LIMIT + 1);
	for (const snapshot of snapshots.slice(0, deleteCount)) try {
		await deps.fs.promises.unlink(snapshot.path);
	} catch (error) {
		if (!isFsErrorCode(error, "ENOENT")) return false;
	}
	return true;
}
function rotateOldestClobberedSiblingsSync(deps, snapshots) {
	const deleteCount = Math.max(0, snapshots.length - CONFIG_CLOBBER_SNAPSHOT_LIMIT + 1);
	for (const snapshot of snapshots.slice(0, deleteCount)) try {
		deps.fs.unlinkSync(snapshot.path);
	} catch (error) {
		if (!isFsErrorCode(error, "ENOENT")) return false;
	}
	return true;
}
function buildClobberedTargetPath(configPath, observedAt, attempt) {
	const basePath = `${configPath}.clobbered.${formatConfigArtifactTimestamp(observedAt)}`;
	return attempt === 0 ? basePath : `${basePath}-${String(attempt).padStart(2, "0")}`;
}
async function persistBoundedClobberedConfigSnapshot(params) {
	const paths = resolveClobberPaths(params.configPath);
	return await clobberSnapshotQueue.enqueue(paths.lockPath, async () => {
		if (!await acquireClobberLock(params.deps, paths.lockPath)) return null;
		try {
			const existing = await listClobberedSiblings(params.deps, paths.dir, paths.prefix);
			if (existing.length >= CONFIG_CLOBBER_SNAPSHOT_LIMIT) {
				warnClobberCapReached(params.deps, params.configPath, existing.length);
				if (!await rotateOldestClobberedSiblings(params.deps, existing)) return null;
			}
			for (let attempt = 0; attempt < CONFIG_CLOBBER_SNAPSHOT_LIMIT; attempt++) {
				const targetPath = buildClobberedTargetPath(params.configPath, params.observedAt, attempt);
				try {
					await params.deps.fs.promises.writeFile(targetPath, params.raw, {
						encoding: "utf-8",
						mode: 384,
						flag: "wx"
					});
					return targetPath;
				} catch (error) {
					if (!isFsErrorCode(error, "EEXIST")) return null;
				}
			}
			return null;
		} finally {
			await params.deps.fs.promises.rmdir(paths.lockPath).catch(() => {});
		}
	});
}
function persistBoundedClobberedConfigSnapshotSync(params) {
	const paths = resolveClobberPaths(params.configPath);
	if (!acquireClobberLockSync(params.deps, paths.lockPath)) return null;
	try {
		const existing = listClobberedSiblingsSync(params.deps, paths.dir, paths.prefix);
		if (existing.length >= CONFIG_CLOBBER_SNAPSHOT_LIMIT) {
			warnClobberCapReached(params.deps, params.configPath, existing.length);
			if (!rotateOldestClobberedSiblingsSync(params.deps, existing)) return null;
		}
		for (let attempt = 0; attempt < CONFIG_CLOBBER_SNAPSHOT_LIMIT; attempt++) {
			const targetPath = buildClobberedTargetPath(params.configPath, params.observedAt, attempt);
			try {
				params.deps.fs.writeFileSync(targetPath, params.raw, {
					encoding: "utf-8",
					mode: 384,
					flag: "wx"
				});
				return targetPath;
			} catch (error) {
				if (!isFsErrorCode(error, "EEXIST")) return null;
			}
		}
		return null;
	} finally {
		try {
			params.deps.fs.rmdirSync(paths.lockPath);
		} catch {}
	}
}
//#endregion
//#region src/config/io.observe-recovery-effects.ts
function createConfigRecoveryStatEffect(deps, configPath) {
	return {
		sync: () => {
			try {
				return deps.fs.statSync(configPath, { throwIfNoEntry: false }) ?? null;
			} catch {
				return null;
			}
		},
		async: () => deps.fs.promises.stat(configPath).catch(() => null)
	};
}
function createConfigBackupMissingEffect(deps, backupPath) {
	return {
		sync: () => {
			try {
				deps.fs.statSync(backupPath);
				return false;
			} catch (error) {
				return hasErrnoCode(error, "ENOENT");
			}
		},
		async: () => deps.fs.promises.stat(backupPath).then(() => false, (error) => hasErrnoCode(error, "ENOENT"))
	};
}
function createConfigBackupReadEffect(deps, backupPath) {
	return {
		sync: () => {
			try {
				return deps.fs.readFileSync(backupPath, "utf-8");
			} catch {
				return null;
			}
		},
		async: () => deps.fs.promises.readFile(backupPath, "utf-8").catch(() => null)
	};
}
//#endregion
//#region src/config/json5-comments.ts
function hasJSON5Comments(raw) {
	let quote;
	for (let index = 0; index < raw.length; index += 1) {
		const char = raw[index];
		if (quote) {
			if (char === "\\") index += 1;
			else if (char === quote) quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			continue;
		}
		if (char === "/" && (raw[index + 1] === "/" || raw[index + 1] === "*")) return true;
	}
	return false;
}
function warnIfJSON5CommentsWillBeStripped(params) {
	if (params.skipOutputLogs || typeof params.raw !== "string" || !hasJSON5Comments(params.raw)) return;
	(params.warn ?? console.warn)(`Config write will strip JSON5 comments from ${params.filePath}.`);
}
//#endregion
//#region src/config/io.observe-recovery.ts
async function commitRecoveryFileIfCurrent(params) {
	let superseded;
	try {
		await params.write(() => {
			params.beforeCommit?.();
			if (!params.health.isCurrent()) {
				superseded = /* @__PURE__ */ new Error("Config recovery observation was superseded");
				throw superseded;
			}
		});
		return true;
	} catch (error) {
		if (superseded && error === superseded) return false;
		throw error;
	}
}
function createRecoveryCommitEffect(params) {
	const options = {
		filePath: params.configPath,
		content: params.raw,
		dirMode: 448,
		mode: 384,
		tempPrefix: path.basename(params.configPath),
		fileSystem: params.deps.fs
	};
	return {
		sync: () => {
			replaceFileAtomicSync(options);
			return true;
		},
		async: (health) => commitRecoveryFileIfCurrent({
			health,
			beforeCommit: params.beforeCommit,
			write: (assertCurrent) => replaceFileAtomic({
				...options,
				copyFallbackOnPermissionError: false,
				fileSystem: { promises: {
					...params.deps.fs.promises,
					rename: (source, destination) => {
						assertCurrent();
						return params.deps.fs.promises.rename(source, destination);
					}
				} }
			})
		})
	};
}
function parseBackupConfigRaw(deps, backupRaw) {
	try {
		return { parsed: deps.json5.parse(backupRaw) };
	} catch {
		return null;
	}
}
async function maybeRecoverSuspiciousConfigRead(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const health = _usingCtx$1.u(captureConfigHealthStateStore(params.deps, params.configPath, params.assertCurrent));
		return await runConfigRecoveryAsync(recoverSuspiciousConfigRead(params), health, params.assertCurrent);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
async function runConfigRecoveryAsync(recovery, health, assertCurrent) {
	assertCurrent?.();
	let step = recovery.next();
	while (!step.done) try {
		assertCurrent?.();
		const value = await step.value.async(health);
		assertCurrent?.();
		step = recovery.next(value);
	} catch (error) {
		assertCurrent?.();
		try {
			if (!health.isCurrent()) throw error;
		} catch {
			throw error;
		}
		step = recovery.throw(error);
	}
	return step.value;
}
function maybeRecoverSuspiciousConfigReadSync(params) {
	supersedeConfigHealthObservations(params.deps, params.configPath);
	const recovery = recoverSuspiciousConfigRead(params);
	let step = recovery.next();
	while (!step.done) try {
		step = recovery.next(step.value.sync());
	} catch (error) {
		step = recovery.throw(error);
	}
	return step.value;
}
/** Prepare the existing recovery without observing or writing the selected config. */
async function prepareSuspiciousConfigRead(params) {
	try {
		var _usingCtx3 = _usingCtx();
		const health = _usingCtx3.u(captureConfigHealthStateStore(params.deps, params.configPath, params.assertCurrent));
		const plan = await runConfigRecoveryAsync(planSuspiciousConfigRead(params), health);
		const captureApplyHealth = () => health.captureContinuation();
		return plan && {
			candidate: plan.candidate,
			apply: async (beforeCommit) => {
				try {
					var _usingCtx4 = _usingCtx();
					const applyHealth = _usingCtx4.u(captureApplyHealth());
					const assertAllowed = () => {
						if (!applyHealth.isCurrent()) throw new ConfigMutationConflictError("config recovery observation was superseded", { retryable: false });
						beforeCommit?.();
						plan.assertUnchanged();
					};
					assertAllowed();
					const currentPlan = await runConfigRecoveryAsync(planSuspiciousConfigRead(params), applyHealth);
					if (!currentPlan || !isDeepStrictEqual(currentPlan.candidate, plan.candidate)) throw new ConfigMutationConflictError("config recovery candidate changed since preparation", { retryable: false });
					const assertCurrentPlan = () => {
						assertAllowed();
						currentPlan.assertUnchanged();
					};
					assertCurrentPlan();
					const result = await runConfigRecoveryAsync(currentPlan.apply(assertCurrentPlan), applyHealth);
					if (result.superseded) throw new ConfigMutationConflictError("config recovery observation was superseded", { retryable: false });
					if (!result.restored) throw result.error;
				} catch (_) {
					_usingCtx4.e = _;
				} finally {
					_usingCtx4.d();
				}
			}
		};
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		_usingCtx3.d();
	}
}
function* recoverSuspiciousConfigRead(params) {
	const { raw, parsed } = params;
	const plan = yield* planSuspiciousConfigRead(params);
	if (!plan) return {
		raw,
		parsed
	};
	if (params.allowBackupRecovery) {
		if (!(yield {
			sync: () => true,
			async: () => params.allowBackupRecovery?.() ?? true
		})) return {
			raw,
			parsed
		};
	}
	return (yield* plan.apply()).superseded ? {
		raw,
		parsed
	} : plan.candidate;
}
function* planSuspiciousConfigRead(params) {
	const { deps, configPath, raw, parsed } = params;
	if (resolveIsConfigReadOnly(deps.env)) return null;
	const backupPath = `${configPath}.bak`;
	if (yield createConfigBackupMissingEffect(deps, backupPath)) return null;
	const stat = yield createConfigRecoveryStatEffect(deps, configPath);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const current = createConfigHealthFingerprint({
		raw,
		parsed,
		stat,
		observedAt: now
	});
	const healthSnapshot = yield {
		sync: () => ({
			state: readConfigHealthStateFromStore(deps),
			basis: null
		}),
		async: (health) => health.read()
	};
	if (!healthSnapshot) return null;
	const healthState = healthSnapshot.state;
	const entry = readConfigHealthEntry(healthState, configPath);
	const recoveryContext = resolveConfigReadRecoveryContext({
		current,
		parsed,
		entry,
		backupBaseline: entry.lastKnownGood ?? (yield {
			sync: () => readConfigFingerprintForPathSync(deps, backupPath),
			async: () => readConfigFingerprintForPath(deps, backupPath)
		}) ?? void 0
	});
	if (!recoveryContext) return null;
	const { suspicious, suspiciousSignature } = recoveryContext;
	const backupRaw = yield createConfigBackupReadEffect(deps, backupPath);
	if (!backupRaw) return null;
	const backupParse = parseBackupConfigRaw(deps, backupRaw);
	if (!backupParse || !resolveGatewayMode(backupParse.parsed)) return null;
	const backupCandidate = {
		raw: backupRaw,
		parsed: backupParse.parsed
	};
	const prepared = yield {
		sync: () => params.prepareBackup(backupCandidate),
		async: () => params.prepareBackupAsync?.(backupCandidate) ?? params.prepareBackup(backupCandidate)
	};
	if (!prepared.ok) return null;
	const preparedCandidate = prepared.candidate;
	const backupStat = yield createConfigRecoveryStatEffect(deps, backupPath);
	const backup = createConfigHealthFingerprint({
		raw: backupRaw,
		parsed: backupParse.parsed,
		stat: backupStat
	});
	const currentObservation = {
		sync: () => true,
		async: (health) => health.isCurrent()
	};
	if (!(yield currentObservation)) return null;
	return {
		candidate: preparedCandidate,
		assertUnchanged: () => {
			for (const [pathname, expectedRaw, expectedStat] of [[
				configPath,
				raw,
				stat
			], [
				backupPath,
				backupRaw,
				backupStat
			]]) {
				const actualRaw = createConfigBackupReadEffect(deps, pathname).sync();
				const actualStat = createConfigRecoveryStatEffect(deps, pathname).sync();
				if (actualRaw !== expectedRaw || !actualStat || !expectedStat || actualStat.dev !== expectedStat.dev || actualStat.ino !== expectedStat.ino || actualStat.mtimeMs !== expectedStat.mtimeMs || actualStat.size !== expectedStat.size) throw new ConfigMutationConflictError("config recovery source changed since preparation", { retryable: false });
			}
		},
		*apply(beforeCommit) {
			if (!(yield currentObservation)) return {
				restored: false,
				error: void 0,
				superseded: true
			};
			const snapshotParams = {
				deps,
				configPath,
				raw,
				observedAt: now
			};
			const clobberedPath = yield {
				sync: () => persistBoundedClobberedConfigSnapshotSync(snapshotParams),
				async: () => persistBoundedClobberedConfigSnapshot(snapshotParams)
			};
			if (!(yield currentObservation)) return {
				restored: false,
				error: void 0,
				superseded: true
			};
			let restoredFromBackup = false;
			let restoreError;
			try {
				if (preparedCandidate.raw !== backupRaw) warnIfJSON5CommentsWillBeStripped({
					raw: backupRaw,
					filePath: configPath,
					warn: (message) => deps.logger.warn(message)
				});
				if (!(yield createRecoveryCommitEffect({
					deps,
					configPath,
					raw: preparedCandidate.raw,
					beforeCommit
				}))) return {
					restored: false,
					error: void 0,
					superseded: true
				};
				const chmodParams = {
					deps,
					configPath,
					context: "backup restore"
				};
				yield {
					sync: () => chmodConfigBestEffortSync(chmodParams),
					async: () => chmodConfigBestEffort(chmodParams)
				};
				restoredFromBackup = true;
			} catch (error) {
				restoreError = error;
			}
			const restoreErrorDetails = restoredFromBackup ? {
				code: null,
				message: null
			} : extractRestoreErrorDetails(restoreError);
			const result = restoredFromBackup ? "auto-restored from backup" : "auto-restore from backup failed";
			const detail = !restoredFromBackup && restoreErrorDetails.message ? `; ${restoreErrorDetails.message}` : "";
			deps.logger.warn(`Config ${result}: ${configPath} (${suspicious.join(", ")}${detail})`);
			const audit = createConfigObserveAuditAppendParams(deps, {
				configPath,
				valid: restoredFromBackup,
				current,
				suspicious,
				lastKnownGood: entry.lastKnownGood,
				backup,
				clobberedPath,
				restoredFromBackup,
				restoredBackupPath: backupPath,
				restoreErrorCode: restoreErrorDetails.code,
				restoreErrorMessage: restoreErrorDetails.message
			});
			yield {
				sync: () => appendConfigAuditRecordSync(audit),
				async: () => appendConfigAuditRecord(audit, params.assertCurrent)
			};
			if (restoredFromBackup) yield {
				sync: () => patchConfigHealthEntryToStore(deps, configPath, { lastObservedSuspiciousSignature: suspiciousSignature }),
				async: (health) => health.updateAfterFileCommit({ lastObservedSuspiciousSignature: suspiciousSignature }, healthSnapshot)
			};
			return {
				restored: restoredFromBackup,
				error: restoreError
			};
		}
	};
}
/** True reports committed file work; health metadata remains best-effort. */
async function promoteConfigSnapshotToLastKnownGoodCore(params) {
	try {
		var _usingCtx5 = _usingCtx();
		const { deps, snapshot } = params;
		if (resolveIsConfigReadOnly(deps.env)) return false;
		if (!snapshot.exists || !snapshot.valid || typeof snapshot.raw !== "string") return false;
		const polluted = collectPollutedSecretPlaceholders(snapshot.parsed);
		if (polluted.length > 0) {
			params.logger?.warn(`Config last-known-good promotion skipped: redacted secret placeholder at ${polluted[0]}`);
			return false;
		}
		const health = _usingCtx5.u(captureConfigHealthStateStore(deps, snapshot.path));
		const healthSnapshot = await health.read();
		if (!healthSnapshot) return false;
		const stat = await deps.fs.promises.stat(snapshot.path).catch(() => null);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const current = createConfigHealthFingerprint({
			raw: snapshot.raw,
			parsed: snapshot.parsed,
			resolved: snapshot.resolved,
			stat,
			observedAt: now
		});
		const lastGoodPath = `${snapshot.path}.last-good`;
		if (!health.isCurrent()) return false;
		const raw = snapshot.raw;
		if (!await commitRecoveryFileIfCurrent({
			health,
			write: async (assertCurrent) => {
				await (await root(path.dirname(lastGoodPath))).write(path.basename(lastGoodPath), raw, {
					mkdir: false,
					mode: 384,
					durable: false,
					encoding: "utf8",
					overwrite: true,
					assertBeforeMutation: assertCurrent
				});
			}
		})) return false;
		await chmodConfigBestEffort({
			deps,
			configPath: lastGoodPath,
			context: "last-known-good promotion"
		});
		await health.updateAfterFileCommit({
			lastKnownGood: current,
			lastPromotedGood: current,
			lastObservedSuspiciousSignature: null
		}, healthSnapshot);
		return true;
	} catch (_) {
		_usingCtx5.e = _;
	} finally {
		_usingCtx5.d();
	}
}
/** True lets recovery callers reread the changed file even if newer health facts win. */
async function recoverConfigFromLastKnownGoodCore(params) {
	try {
		var _usingCtx6 = _usingCtx();
		const { deps, snapshot } = params;
		if (resolveIsConfigReadOnly(deps.env)) return false;
		if (!snapshot.exists || typeof snapshot.raw !== "string") return false;
		if (!shouldAttemptLastKnownGoodRecovery(snapshot)) {
			if (isPluginLocalInvalidConfigSnapshot(snapshot)) deps.logger.warn(`Config last-known-good recovery skipped: invalidity is scoped to stale plugin config (${params.reason})`);
			return false;
		}
		const health = _usingCtx6.u(captureConfigHealthStateStore(deps, snapshot.path));
		const healthSnapshot = await health.read();
		if (!healthSnapshot) return false;
		const promoted = readConfigHealthEntry(healthSnapshot.state, snapshot.path).lastPromotedGood;
		if (!promoted?.hash) return false;
		const lastGoodPath = `${snapshot.path}.last-good`;
		const backupRaw = await deps.fs.promises.readFile(lastGoodPath, "utf-8").catch(() => null);
		if (!backupRaw || hashConfigRaw(backupRaw) !== promoted.hash) return false;
		const backupParse = parseBackupConfigRaw(deps, backupRaw);
		if (!backupParse) return false;
		const originalCandidate = {
			raw: backupRaw,
			parsed: backupParse.parsed
		};
		const prepared = params.prepareCandidate(originalCandidate);
		if (!prepared.ok) {
			deps.logger.warn(`Config last-known-good recovery skipped: ${prepared.reason} (${params.reason})`);
			return false;
		}
		const recoveryCandidate = prepared.candidate;
		const polluted = collectPollutedSecretPlaceholders(recoveryCandidate.parsed);
		if (polluted.length > 0) {
			deps.logger.warn(`Config last-known-good recovery skipped: redacted secret placeholder at ${polluted[0]}`);
			return false;
		}
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const stat = await deps.fs.promises.stat(snapshot.path).catch(() => null);
		const current = createConfigHealthFingerprint({
			raw: snapshot.raw,
			parsed: snapshot.parsed,
			resolved: snapshot.resolved,
			stat,
			observedAt: now
		});
		if (!health.isCurrent()) return false;
		const clobberedPath = await persistBoundedClobberedConfigSnapshot({
			deps,
			configPath: snapshot.path,
			raw: snapshot.raw,
			observedAt: now
		});
		if (!health.isCurrent()) return false;
		if (recoveryCandidate.raw !== backupRaw) warnIfJSON5CommentsWillBeStripped({
			raw: backupRaw,
			filePath: snapshot.path,
			warn: (message) => deps.logger.warn(message)
		});
		if (!await createRecoveryCommitEffect({
			deps,
			configPath: snapshot.path,
			raw: recoveryCandidate.raw
		}).async(health)) return false;
		await chmodConfigBestEffort({
			deps,
			configPath: snapshot.path,
			context: "last-known-good recovery"
		});
		const issueSummary = formatConfigIssueSummary([...snapshot.issues, ...snapshot.legacyIssues]);
		deps.logger.warn(`Config auto-restored from last-known-good: ${snapshot.path} (${params.reason})${issueSummary ? `; Rejected validation details: ${issueSummary}.` : ""}`);
		await appendConfigAuditRecord(createConfigObserveAuditAppendParams(deps, {
			configPath: snapshot.path,
			valid: snapshot.valid,
			current,
			suspicious: [params.reason],
			lastKnownGood: promoted,
			backup: promoted,
			clobberedPath,
			restoredFromBackup: true,
			restoredBackupPath: lastGoodPath
		}));
		await health.updateAfterFileCommit({
			lastKnownGood: promoted,
			lastPromotedGood: promoted,
			lastObservedSuspiciousSignature: null
		}, healthSnapshot);
		return true;
	} catch (_) {
		_usingCtx6.e = _;
	} finally {
		_usingCtx6.d();
	}
}
//#endregion
//#region src/config/io.snapshot-shared.ts
function createConfigFileSnapshot(params) {
	const sourceConfigBeforeMigrations = params.sourceConfigBeforeMigrations ? asResolvedSourceConfig(params.sourceConfigBeforeMigrations) : void 0;
	const sourceConfig = asResolvedSourceConfig(params.sourceConfig);
	setDeferredPluginMigrationConfigFacts(sourceConfig, params.deferredPluginMigrations);
	const runtimeConfig = asRuntimeConfig(params.runtimeConfig);
	if (params.resolutionFacts !== void 0) {
		setConfigResolutionFacts(sourceConfigBeforeMigrations, params.resolutionFacts);
		setConfigResolutionFacts(sourceConfig, params.resolutionFacts);
		setConfigResolutionFacts(runtimeConfig, params.resolutionFacts);
	}
	return {
		path: params.path,
		includedPaths: [...params.includedPaths ?? []],
		...params.includeProvenance ? { includeProvenance: params.includeProvenance.map((entry) => ({
			...entry,
			path: [...entry.path],
			...entry.targetPaths ? { targetPaths: [...entry.targetPaths] } : {}
		})) } : {},
		...params.agentRosterIncludeOwned !== void 0 ? { agentRosterIncludeOwned: params.agentRosterIncludeOwned } : {},
		...params.bindingsIncludeOwned !== void 0 ? { bindingsIncludeOwned: params.bindingsIncludeOwned } : {},
		exists: params.exists,
		raw: params.raw,
		parsed: params.parsed,
		...params.authoredConfig ? { authoredConfig: params.authoredConfig } : {},
		...sourceConfigBeforeMigrations ? { sourceConfigBeforeMigrations } : {},
		sourceConfig,
		resolved: sourceConfig,
		valid: params.valid,
		runtimeConfig,
		config: runtimeConfig,
		hash: params.hash,
		...params.readError ? { readError: params.readError } : {},
		issues: params.issues,
		warnings: params.warnings,
		legacyIssues: params.legacyIssues
	};
}
async function finalizeReadConfigSnapshotInternalResult(deps, result, options) {
	if (deps.observe && options?.observe !== false) await observeConfigSnapshot(deps, result.snapshot);
	return result;
}
async function collectInvalidConfigLegacyIssues(raw, sourceRaw) {
	if (!raw || typeof raw !== "object") return [];
	const { findDoctorLegacyConfigIssues } = await import("./legacy-config-issues-DtME0IL7.mjs");
	return findDoctorLegacyConfigIssues(raw, sourceRaw);
}
//#endregion
//#region src/config/io.warnings.ts
function warnOnConfigMiskeys(raw, logger) {
	if (!raw || typeof raw !== "object") return;
	const gateway = raw.gateway;
	if (!gateway || typeof gateway !== "object") return;
	if ("token" in gateway) logger.warn("Config uses \"gateway.token\". This key is ignored; use \"gateway.auth.token\" instead.");
}
function logConfigWarningsOnce(params) {
	if (params.warnings.length === 0) {
		loggedConfigWarningFingerprints.delete(params.configPath);
		return;
	}
	const details = params.warnings.map((warning) => `${sanitizeTerminalText(warning.path || "<root>")}: ${sanitizeTerminalText(warning.message)}`).join("; ");
	const fingerprint = hashConfigRaw(details);
	if (loggedConfigWarningFingerprints.get(params.configPath) === fingerprint) {
		setBoundedConfigIoWarningEntry(loggedConfigWarningFingerprints, params.configPath, fingerprint);
		return;
	}
	setBoundedConfigIoWarningEntry(loggedConfigWarningFingerprints, params.configPath, fingerprint);
	params.logger.warn(`Config warnings: ${details}`);
}
function warnIfConfigFromFuture(cfg, logger) {
	const touched = cfg.meta?.lastTouchedVersion;
	if (!touched || !shouldWarnOnTouchedVersion(VERSION, touched)) return;
	if (warnedFutureTouchedVersions.check(touched)) return;
	logger.warn([
		`Your OpenClaw config was written by version ${touched}, but this command is running ${VERSION}.`,
		"Check: `openclaw --version`, `which openclaw`, and `openclaw gateway status --deep`.",
		"If unexpected, update PATH so `openclaw` points to the version you want, or reinstall the Gateway service from that same OpenClaw install."
	].join("\n"));
}
//#endregion
//#region src/config/io.snapshot.ts
function listResolvedIncludePaths(includeFilePathsForWatch) {
	return [...includeFilePathsForWatch].toSorted();
}
function hashConfigRevision(raw, includeFileHashes, includeFileTargets) {
	const revision = createHash("sha256").update(raw);
	for (const [includePath, includeHash] of Object.entries(includeFileHashes)) revision.update(JSON.stringify([
		includePath,
		includeFileTargets[includePath],
		includeHash
	]));
	return revision.digest("hex");
}
async function readConfigFileSnapshotInternal(context, options = {}, sourceRaw) {
	const preparation = options.preparation === void 0 ? captureManagedConfigSnapshotPreparation(context.configPath) : options.preparation;
	preparation?.assertCurrent();
	const result = await readConfigSnapshotWithPreparation(context, {
		...options,
		preparation
	}, sourceRaw);
	preparation?.assertCurrent();
	return result;
}
async function readConfigSnapshotWithPreparation(context, options, sourceRaw) {
	const { deps, configPath, pathResolution } = context;
	const preparation = options.preparation;
	maybeLoadDotEnvForConfig(deps.env);
	const envBeforeRead = snapshotEnv(deps.env);
	if (sourceRaw === void 0 && !deps.fs.existsSync(configPath)) {
		const migrated = migratePersistedImplicitMainRoster({});
		const config = coerceConfig(migrated.config);
		const metadata = context.createValidationPluginMetadataSnapshotLoader({
			effectiveConfigRaw: config,
			env: deps.env,
			allowCurrentPluginMetadata: options.allowCurrentPluginMetadata
		});
		return await finalizeReadConfigSnapshotInternalResult(deps, {
			snapshot: createConfigFileSnapshot({
				path: configPath,
				exists: false,
				raw: null,
				parsed: {},
				sourceConfig: config,
				valid: true,
				runtimeConfig: preparation ? await preparation((prepare) => prepare({
					kind: "materialize",
					context,
					metadata,
					config
				})) : materializeConfigSnapshotDefaults(context, config, metadata),
				hash: hashConfigRaw(null),
				issues: [],
				warnings: [],
				legacyIssues: []
			}),
			pluginMetadataSnapshot: metadata.getSnapshot()
		});
	}
	let fallbackRaw = null;
	let fallbackParsed = {};
	let fallbackSourceConfig = {};
	let fallbackHash = hashConfigRaw(null);
	let fallbackEnvSnapshotForRestore;
	const includeFileHashesForWrite = {};
	const includeFileTargetsForWrite = {};
	const includeFilePathsForWatch = /* @__PURE__ */ new Set();
	const includeProvenance = [];
	let agentRosterIncludeOwned = false;
	let bindingsIncludeOwned = false;
	try {
		const raw = await deps.measure("config.snapshot.read.file", () => sourceRaw ?? deps.fs.readFileSync(configPath, "utf-8"));
		const rawHash = await deps.measure("config.snapshot.read.hash", () => hashConfigRaw(raw));
		fallbackRaw = raw;
		fallbackHash = rawHash;
		const parsedRes = await deps.measure("config.snapshot.read.parse", () => parseConfigJson5(raw, deps.json5));
		if (!parsedRes.ok) return await finalizeReadConfigSnapshotInternalResult(deps, { snapshot: createConfigFileSnapshot({
			path: configPath,
			includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
			exists: true,
			raw,
			parsed: {},
			sourceConfig: {},
			valid: false,
			runtimeConfig: {},
			hash: rawHash,
			issues: [{
				path: "",
				message: `JSON5 parse failed: ${parsedRes.error}`
			}],
			warnings: [],
			legacyIssues: []
		}) });
		const effectiveParsed = parsedRes.parsed;
		fallbackParsed = effectiveParsed;
		fallbackSourceConfig = coerceConfig(effectiveParsed);
		let resolved;
		try {
			resolved = await deps.measure("config.snapshot.read.includes", () => resolveConfigIncludesForRead(effectiveParsed, configPath, deps, includeFileHashesForWrite, includeFileTargetsForWrite, includeFilePathsForWatch, (event) => {
				const { value: _value, ...ownership } = event;
				includeProvenance.push(ownership);
				agentRosterIncludeOwned ||= includeContributionOwnsAgentRoster(event);
				bindingsIncludeOwned ||= includeContributionOwnsBindings(event);
			}));
		} catch (error) {
			const message = error instanceof ConfigIncludeError ? error.message : `Include resolution failed: ${String(error)}`;
			return await finalizeReadConfigSnapshotInternalResult(deps, {
				snapshot: createConfigFileSnapshot({
					path: configPath,
					includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
					exists: true,
					raw,
					parsed: effectiveParsed,
					sourceConfig: coerceConfig(effectiveParsed),
					valid: false,
					runtimeConfig: coerceConfig(effectiveParsed),
					hash: rawHash,
					issues: [{
						path: "",
						message
					}],
					warnings: [],
					legacyIssues: []
				}),
				includeFileHashesForWrite,
				includeFileTargetsForWrite
			});
		}
		const readResolution = await deps.measure("config.snapshot.read.env", () => resolveConfigForRead(resolved, deps.env, deps.lowerPrecedenceEnv));
		fallbackEnvSnapshotForRestore = readResolution.envSnapshotForRestore;
		const envVarWarnings = readResolution.envWarnings.map((warning) => ({
			path: warning.configPath,
			message: `Missing env var "${warning.varName}" - feature using this value will be unavailable`
		}));
		const contextBudgetMigration = migrateLegacyContextBudgetConfig(readResolution.resolvedConfigRaw);
		const rosterMigration = migratePersistedImplicitMainRoster(contextBudgetMigration.config, {
			env: deps.env,
			homedir: deps.homedir
		});
		envVarWarnings.push(...contextBudgetMigration.changes, ...contextBudgetMigration.warnings, ...rosterMigration.diagnostics.map((message) => ({
			path: "agents.entries",
			message
		})));
		const effectiveConfigRaw = rosterMigration.config;
		const validationConfigRaw = effectiveConfigRaw;
		const snapshotRaw = raw;
		const snapshotParsed = effectiveParsed;
		const snapshotHash = hashConfigRevision(raw, includeFileHashesForWrite, includeFileTargetsForWrite);
		fallbackHash = snapshotHash;
		fallbackSourceConfig = coerceConfig(effectiveConfigRaw);
		const pluginMetadata = context.createValidationPluginMetadataSnapshotLoader({
			effectiveConfigRaw,
			env: deps.env,
			allowCurrentPluginMetadata: options.allowCurrentPluginMetadata
		});
		const validationRequest = {
			kind: "validate",
			prepareValidation: options.prepareValidation,
			context,
			metadata: pluginMetadata,
			raw: validationConfigRaw,
			sourceRaw: effectiveParsed
		};
		const { deferredPluginMigrations, validated } = await deps.measure("config.snapshot.read.validate", () => preparation ? preparation((prepare) => prepare(validationRequest)) : options.prepareValidation ? prepareConfigSnapshotValidation(validationRequest) : withSynchronousArtifactPreservingStateSnapshot(() => {
			const pending = context.resolveDeferredPluginMigrations();
			return {
				deferredPluginMigrations: pending,
				validated: validateConfigObjectWithPlugins(validationConfigRaw, {
					...pathResolution,
					pluginValidation: context.options.pluginValidation,
					loadPluginMetadataSnapshot: pluginMetadata.load,
					sourceRaw: effectiveParsed,
					preservedLegacyRootKeys: context.options.preservedLegacyRootKeys,
					deferredPluginMigrations: pending
				})
			};
		}));
		if (!validated.ok) {
			const availableSnapshot = pluginMetadata.getSnapshot();
			const collect = () => context.options.pluginValidation === "core-only" ? findLegacyConfigIssues(effectiveConfigRaw, effectiveParsed) : collectInvalidConfigLegacyIssues(effectiveConfigRaw, effectiveParsed);
			const legacyIssues = await deps.measure("config.snapshot.read.legacy-issues", () => availableSnapshot ? withPluginMetadataSnapshotScope(availableSnapshot, collect, {
				config: coerceConfig(effectiveConfigRaw),
				env: deps.env
			}) : collect());
			restoreEnvChangesIfUnchanged({
				env: deps.env,
				before: envBeforeRead,
				after: snapshotEnv(deps.env)
			});
			return await finalizeReadConfigSnapshotInternalResult(deps, {
				snapshot: createConfigFileSnapshot({
					path: configPath,
					includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
					exists: true,
					raw: snapshotRaw,
					parsed: snapshotParsed,
					authoredConfig: coerceConfig(resolved),
					includeProvenance,
					agentRosterIncludeOwned,
					bindingsIncludeOwned,
					sourceConfigBeforeMigrations: coerceConfig(readResolution.resolvedConfigRaw),
					sourceConfig: coerceConfig(effectiveConfigRaw),
					valid: false,
					runtimeConfig: coerceConfig(effectiveConfigRaw),
					hash: snapshotHash,
					issues: validated.issues,
					deferredPluginMigrations,
					warnings: [...validated.warnings, ...envVarWarnings],
					resolutionFacts: readResolution.resolutionFacts,
					legacyIssues
				}),
				envSnapshotForRestore: readResolution.envSnapshotForRestore,
				includeFileHashesForWrite,
				includeFileTargetsForWrite
			});
		}
		if (!deps.suppressFutureVersionWarning) warnIfConfigFromFuture(validated.config, deps.logger);
		let callerRejectedSuspiciousRecovery = false;
		if (options.recoverSuspicious === true && deps.observe && !options.skipSuspiciousRecovery && !containsConfigIncludeDirective(effectiveParsed)) {
			const allowSuspiciousRecovery = options.allowSuspiciousRecovery;
			let recoveryCandidate = null;
			if ((await deps.measure("config.snapshot.read.recover-suspicious", () => maybeRecoverSuspiciousConfigRead({
				deps,
				configPath,
				raw,
				parsed: effectiveParsed,
				prepareBackup: (backup) => {
					const prepared = context.prepareRecoveryBackupCandidate(backup);
					recoveryCandidate = prepared.ok ? prepared.candidate.config ?? null : null;
					return prepared;
				},
				...allowSuspiciousRecovery ? { allowBackupRecovery: async () => {
					const allowed = recoveryCandidate !== null && await allowSuspiciousRecovery(recoveryCandidate, validated.config);
					callerRejectedSuspiciousRecovery = !allowed;
					return allowed;
				} } : {}
			}))).raw !== raw) {
				restoreEnvChangesIfUnchanged({
					env: deps.env,
					before: envBeforeRead,
					after: snapshotEnv(deps.env)
				});
				return await readConfigFileSnapshotInternal(context, {
					preparation,
					prepareValidation: options.prepareValidation,
					allowCurrentPluginMetadata: options.allowCurrentPluginMetadata,
					recoverSuspicious: options.recoverSuspicious,
					skipSuspiciousRecovery: true
				});
			}
		}
		const snapshotConfig = await deps.measure("config.snapshot.read.materialize", () => materializeRuntimeConfig(validated.config, {
			...pathResolution,
			manifestRegistry: pluginMetadata.getSnapshot()?.manifestRegistry ?? (context.options.pluginValidation === "core-only" ? { plugins: [] } : void 0)
		}));
		return await deps.measure("config.snapshot.read.observe", () => finalizeReadConfigSnapshotInternalResult(deps, {
			snapshot: createConfigFileSnapshot({
				path: configPath,
				includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
				exists: true,
				raw: snapshotRaw,
				parsed: snapshotParsed,
				authoredConfig: coerceConfig(resolved),
				includeProvenance,
				agentRosterIncludeOwned,
				bindingsIncludeOwned,
				sourceConfigBeforeMigrations: coerceConfig(readResolution.resolvedConfigRaw),
				sourceConfig: coerceConfig(effectiveConfigRaw),
				valid: true,
				runtimeConfig: snapshotConfig,
				hash: snapshotHash,
				issues: [],
				warnings: [...validated.warnings, ...envVarWarnings],
				deferredPluginMigrations,
				resolutionFacts: readResolution.resolutionFacts,
				legacyIssues: []
			}),
			envSnapshotForRestore: readResolution.envSnapshotForRestore,
			includeFileHashesForWrite,
			includeFileTargetsForWrite,
			pluginMetadataSnapshot: pluginMetadata.getSnapshot(),
			...validated.strictIssues ? { strictIssues: validated.strictIssues } : {}
		}, { observe: !callerRejectedSuspiciousRecovery }));
	} catch (error) {
		preparation?.assertCurrent();
		if (findStartupMaintenanceRequiredError(error)) throw error;
		const nodeError = error;
		let message;
		if (nodeError?.code === "EACCES") {
			const uid = process.getuid?.();
			const uidHint = typeof uid === "number" ? String(uid) : "$(id -u)";
			message = [
				`read failed: ${String(error)}`,
				"",
				"Config file is not readable by the current process. If running in a container",
				"or 1-click deployment, fix ownership with:",
				`  chown ${uidHint} "${configPath}"`,
				"Then restart the gateway."
			].join("\n");
			deps.logger.error(message);
		} else message = `read failed: ${String(error)}`;
		return await finalizeReadConfigSnapshotInternalResult(deps, {
			snapshot: createConfigFileSnapshot({
				path: configPath,
				includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
				exists: true,
				raw: fallbackRaw,
				parsed: fallbackParsed,
				sourceConfig: fallbackSourceConfig,
				valid: false,
				runtimeConfig: fallbackSourceConfig,
				hash: fallbackHash,
				...fallbackRaw === null ? { readError: { code: nodeError?.code ?? null } } : {},
				issues: [{
					path: "",
					message
				}],
				warnings: [],
				legacyIssues: []
			}),
			envSnapshotForRestore: fallbackEnvSnapshotForRestore,
			includeFileHashesForWrite,
			includeFileTargetsForWrite
		});
	}
}
/** Preview recovery through the ordinary snapshot pipeline at the selected config path. */
async function prepareConfigRecoveryFromContext(context, current) {
	return await withArtifactPreservingStateReads(async () => {
		if (!current.exists || !current.valid || typeof current.raw !== "string" || containsConfigIncludeDirective(current.parsed)) return null;
		if (current.path !== context.configPath) throw new ConfigMutationConflictError("config recovery path changed since last load", { retryable: false });
		const previewContext = createConfigIoContext({
			...context.options,
			configPath: context.configPath,
			env: cloneEnvWithPlatformSemantics(context.deps.env),
			observe: false
		});
		const plan = await prepareSuspiciousConfigRead({
			deps: previewContext.deps,
			configPath: context.configPath,
			raw: current.raw,
			parsed: current.parsed,
			prepareBackup: previewContext.prepareRecoveryBackupCandidate
		});
		if (!plan) return null;
		const envBeforeRead = snapshotEnv(previewContext.deps.env);
		try {
			const { snapshot, pluginMetadataSnapshot } = await readConfigFileSnapshotInternal(previewContext, { allowCurrentPluginMetadata: false }, plan.candidate.raw);
			return snapshot.valid ? {
				snapshot,
				pluginMetadataSnapshot,
				apply: plan.apply
			} : null;
		} finally {
			restoreEnvChangesIfUnchanged({
				env: previewContext.deps.env,
				before: envBeforeRead,
				after: snapshotEnv(previewContext.deps.env)
			});
		}
	});
}
async function readConfigFileSnapshotFromContext(context, options = {}) {
	return (await readConfigFileSnapshotInternal(context, {
		recoverSuspicious: options.recoverSuspicious === true,
		allowSuspiciousRecovery: options.allowSuspiciousRecovery
	})).snapshot;
}
async function readConfigFileSnapshotWithPluginMetadataFromContext(context, options = {}) {
	const read = () => readConfigSnapshotWithPluginMetadata(context, options);
	return options.prepareValidation && !context.deps.observe ? withArtifactPreservingStateReads(read) : read();
}
async function readConfigSnapshotWithPluginMetadata(context, options) {
	const preparation = captureManagedConfigSnapshotPreparation(context.configPath);
	const result = await readConfigFileSnapshotInternal(context, {
		preparation,
		prepareValidation: options.prepareValidation,
		allowCurrentPluginMetadata: options.allowCurrentPluginMetadata,
		recoverSuspicious: options.recoverSuspicious === true,
		allowSuspiciousRecovery: options.allowSuspiciousRecovery
	});
	let pluginMetadataSnapshot = result.pluginMetadataSnapshot;
	if (!pluginMetadataSnapshot && result.snapshot.valid) {
		const pluginMetadata = context.createValidationPluginMetadataSnapshotLoader({
			effectiveConfigRaw: result.snapshot.sourceConfig,
			env: context.deps.env,
			allowCurrentPluginMetadata: options.allowCurrentPluginMetadata
		});
		if (preparation) await preparation((prepare) => prepare({
			kind: "metadata",
			metadata: pluginMetadata,
			config: result.snapshot.sourceConfig
		}));
		else if (options.prepareValidation) await pluginMetadata.loadAsync(result.snapshot.sourceConfig);
		else pluginMetadata.load(result.snapshot.sourceConfig);
		pluginMetadataSnapshot = pluginMetadata.getSnapshot();
	}
	preparation?.assertCurrent();
	return {
		snapshot: result.snapshot,
		...result.strictIssues ? { strictIssues: result.strictIssues } : {},
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
	};
}
async function readConfigFileSnapshotForWriteFromContext(context, options = {}) {
	const assertConfigPathForWrite = () => {
		if (resolveConfigPathForDeps(context.deps) !== context.configPath) throw new ConfigMutationConflictError("config path changed since last load", { retryable: false });
	};
	assertConfigPathForWrite();
	const readContext = options.observe === false ? {
		...context,
		deps: {
			...context.deps,
			observe: false
		}
	} : context;
	const read = () => readConfigFileSnapshotInternal(readContext);
	const result = await (readContext.deps.observe ? read() : withArtifactPreservingStateReads(read));
	assertConfigPathForWrite();
	return {
		snapshot: result.snapshot,
		writeOptions: {
			assertConfigPathForWrite,
			basePluginMetadataSnapshot: result.pluginMetadataSnapshot,
			envSnapshotForRestore: result.envSnapshotForRestore,
			expectedConfigPath: context.configPath,
			ownedConfigPathForWrite: context.configPath,
			includeFileHashesForWrite: result.includeFileHashesForWrite,
			includeFileTargetsForWrite: result.includeFileTargetsForWrite,
			unsetPaths: resolveManagedUnsetPathsForWrite(void 0)
		}
	};
}
async function readBestEffortConfigSnapshotFromContext(context) {
	const operation = async () => {
		const result = await readConfigFileSnapshotInternal(context);
		if (!result.snapshot.valid) return {
			config: result.snapshot.config,
			sourceConfig: result.snapshot.sourceConfig,
			configDiagnostics: {
				path: result.snapshot.path,
				issues: result.snapshot.issues
			}
		};
		return {
			config: context.finalizeLoadedRuntimeConfig(result.snapshot.config),
			sourceConfig: result.snapshot.sourceConfig,
			configDiagnostics: null
		};
	};
	return await (context.deps.observe ? operation() : withArtifactPreservingStateReads(operation));
}
async function readSourceConfigBestEffortFromContext(context) {
	const { deps, configPath } = context;
	maybeLoadDotEnvForConfig(deps.env);
	if (!deps.fs.existsSync(configPath)) return {};
	try {
		const raw = deps.fs.readFileSync(configPath, "utf-8");
		const parsed = parseConfigJson5(raw, deps.json5);
		if (!parsed.ok) {
			deps.logger.warn(`Config (${configPath}): best-effort read ignored unparseable config: ${parsed.error}`);
			return {};
		}
		let resolved;
		try {
			resolved = resolveConfigIncludesForRead(parsed.parsed, configPath, deps);
		} catch (err) {
			deps.logger.warn(`Config (${configPath}): best-effort read skipped $include resolution: ${formatErrorMessage(err)}`);
			return coerceConfig(parsed.parsed);
		}
		const resolution = resolveConfigForRead(resolved, deps.env, deps.lowerPrecedenceEnv);
		return coerceConfig(resolution.resolvedConfigRaw);
	} catch (err) {
		deps.logger.warn(`Config (${configPath}): best-effort read failed: ${formatErrorMessage(err)}`);
		return {};
	}
}
//#endregion
export { resolveConfigSizeBaselineBytes as A, AUTO_MANAGED_CONFIG_META_PATHS as B, resetConfigOverrides as C, captureConfigFileWritePathProof as D, assertBaseSnapshotStillCurrent as E, stampConfigVersion as F, setBoundedConfigIoWarningEntry as G, stampConfigWriteMetadata as H, tightenStateDirPermissionsIfNeeded as I, resolveOwnerPromptNumbers as J, applyLegacyDoctorMigrations as K, captureConfigWriteLockGuard as L, resolveConfigWriteBlockingReasons as M, resolveConfigWriteSuspiciousReasons as N, createGuardedConfigFileSystem as O, rollbackConfigFileWriteIfUnchanged as P, markActiveConfigMutationPath as R, getConfigOverrides as S, unsetConfigOverride as T, loggedConfigWarningFingerprints as U, recordConfigWriteMetadata as V, loggedInvalidConfigs as W, warnIfJSON5CommentsWillBeStripped as _, readConfigFileSnapshotFromContext as a, applyConfigOverrides as b, readSourceConfigBestEffortFromContext as c, warnOnConfigMiskeys as d, createConfigFileSnapshot as f, recoverConfigFromLastKnownGoodCore as g, promoteConfigSnapshotToLastKnownGoodCore as h, readConfigFileSnapshotForWriteFromContext as i, resolveConfigStatMetadata as j, formatConfigArtifactTimestamp$1 as k, logConfigWarningsOnce as l, maybeRecoverSuspiciousConfigReadSync as m, prepareConfigRecoveryFromContext as n, readConfigFileSnapshotInternal as o, maybeRecoverSuspiciousConfigRead as p, applyChannelDoctorCompatibilityMigrations as q, readBestEffortConfigSnapshotFromContext as r, readConfigFileSnapshotWithPluginMetadataFromContext as s, hashConfigRevision as t, warnIfConfigFromFuture as u, persistBoundedClobberedConfigSnapshot as v, setConfigOverride as w, captureConfigOverrideApplier as x, createConfigIoContext as y, withConfigWriteLock as z };
