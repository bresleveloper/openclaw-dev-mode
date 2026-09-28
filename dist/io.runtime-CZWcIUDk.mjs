import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { E as assertBaseSnapshotStillCurrent, L as captureConfigWriteLockGuard, l as logConfigWarningsOnce, z as withConfigWriteLock } from "./io.snapshot-BXLTgjrd.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { f as prepareConfigRuntimeEnvLoad, h as snapshotEnv, m as restoreEnvChangesIfUnchanged, n as cloneEnvWithPlatformSemantics, s as createConfigRuntimeEnvBase } from "./config-env-vars-BHI12YH5.mjs";
import { _ as preflightRuntimeSnapshotWrite, a as finalizeRuntimeSnapshotWrite, d as hasManagedRuntimeConfigWriteOwner, g as preflightManagedRuntimeConfigWrite, h as notifyRuntimeConfigWriteListeners, i as createRuntimeConfigWriteNotification, l as getRuntimeConfigSnapshotRefreshHandler, m as loadPinnedRuntimeConfigAsync, p as loadPinnedRuntimeConfig, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot, v as projectRuntimeConfigWritePreparedCandidates, x as registerRuntimeConfigWriteListener, y as registerManagedRuntimeConfigWriteOwner } from "./runtime-snapshot-DbgWcCyV.mjs";
import { r as projectLegacyRuntimeConfigWrite } from "./runtime-source-projection-D2uZ1zpS.mjs";
import { a as readDeferredPluginMigrations } from "./deferred-plugin-migrations-DZuh_dkr.mjs";
import { c as resolveManagedUnsetPathsForWrite } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { n as loadDotEnvAsync, t as loadDotEnv } from "./dotenv-DvPPvduE.mjs";
import { _ as GATEWAY_CONFIG_SELECTION_ENV_KEYS, a as hashConfigRaw, h as resolveManagedRuntimeEnvBaseline, l as replaceEnvSnapshot, r as createManagedRuntimeEnvBase } from "./io.read-helpers-N26RjV2V.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { p as recordUpdateDoctorConfigWrite } from "./update-doctor-result-CoUVRLb-.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-BQNShMey.mjs";
import { t as createConfigIO } from "./io.factory-BWiVTxfI.mjs";
import { i as resolveWriteEnvSnapshotForPath, r as configWritePostCommitRollback, t as ConfigRuntimeRefreshError } from "./io.types-zuIBxyy5.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-C28rym6a.mjs";
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
//#region src/config/runtime-write-application.ts
const runtimeConfigWriteApplications = /* @__PURE__ */ new WeakMap();
/** Creates a single-owner receipt for one persisted config write. */
function createRuntimeConfigWriteApplication(runTransaction, activation) {
	let claimed = false;
	const result = createDeferredCore();
	return {
		result: result.promise,
		get claimed() {
			return claimed;
		},
		claim: () => {
			if (claimed) return null;
			claimed = true;
			const claim = {
				settle: (status) => {
					delete claim.runTransaction;
					result.resolve(status);
				},
				...runTransaction ? { runTransaction } : {},
				...activation
			};
			return claim;
		}
	};
}
/** Attaches a private application receipt without changing the config notification contract. */
function attachRuntimeConfigWriteApplication(target, application) {
	if (application) runtimeConfigWriteApplications.set(target, application);
	return target;
}
/** Copies a private application receipt when rebuilding an internal write carrier. */
function copyRuntimeConfigWriteApplication(source, target) {
	return attachRuntimeConfigWriteApplication(target, source ? runtimeConfigWriteApplications.get(source) : void 0);
}
/** Returns the private application receipt attached to a write or notification. */
function getRuntimeConfigWriteApplication(target) {
	return runtimeConfigWriteApplications.get(target);
}
//#endregion
//#region src/config/io.runtime-write-finalization.ts
async function finalizeCommittedConfigWrite(params) {
	const { io, options, writeResult, baseSnapshot, deferRuntimeActivation, managedPreparedCandidates } = params;
	let canonicalSourceConfig = params.nextCfg;
	let canonicalRuntimeConfig = params.nextCfg;
	let canonicalPersistedHash = writeResult.persistedHash;
	let canonicalRead;
	let envBeforeCanonicalRead = snapshotEnv(io.env);
	let envAfterCanonicalRead;
	let canonicalReadFailure = null;
	try {
		let stableEnvGeneration = !deferRuntimeActivation;
		for (let attempt = 0; attempt < 3; attempt += 1) {
			const baseline = resolveManagedRuntimeEnvBaseline();
			if (deferRuntimeActivation) {
				replaceEnvSnapshot(io.env, createConfigRuntimeEnvBase(baseline.sourceConfig, process.env, { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS }));
				envBeforeCanonicalRead = snapshotEnv(io.env);
			}
			canonicalRead = await io.readConfigFileSnapshotForWrite();
			const freshSnapshot = canonicalRead.snapshot;
			if (freshSnapshot.exists && freshSnapshot.valid) {
				canonicalSourceConfig = freshSnapshot.sourceConfig;
				canonicalRuntimeConfig = freshSnapshot.config;
				canonicalPersistedHash = expectDefined(freshSnapshot.hash, "canonical config snapshot hash");
			} else {
				const issueSummary = formatConfigIssueSummary(freshSnapshot.issues);
				io.logger.warn(`Config (${io.configPath}): canonical reread after write was ${freshSnapshot.exists ? "invalid" : "missing"}; runtime keeps the written config${issueSummary ? `: ${issueSummary}` : ""}`);
			}
			if (!deferRuntimeActivation || resolveManagedRuntimeEnvBaseline().generation === baseline.generation) {
				stableEnvGeneration = true;
				break;
			}
		}
		if (!stableEnvGeneration) canonicalReadFailure = new ConfigRuntimeRefreshError("the active config environment changed during every canonical reread");
	} catch (error) {
		canonicalReadFailure = new ConfigRuntimeRefreshError(`canonical reread failed: ${formatErrorMessage(error)}`, { cause: error });
	} finally {
		envAfterCanonicalRead = snapshotEnv(io.env);
	}
	const notifyCommittedWrite = () => {
		const currentRuntimeConfig = getRuntimeConfigSnapshot();
		const notificationRuntimeConfig = deferRuntimeActivation ? canonicalRuntimeConfig : currentRuntimeConfig;
		if (!notificationRuntimeConfig) return;
		const notificationPreparedCandidates = projectRuntimeConfigWritePreparedCandidates(managedPreparedCandidates, canonicalRuntimeConfig, canonicalSourceConfig);
		notifyRuntimeConfigWriteListeners(attachRuntimeConfigWriteApplication(createRuntimeConfigWriteNotification({
			configPath: io.configPath,
			sourceConfig: canonicalSourceConfig,
			runtimeConfig: notificationRuntimeConfig,
			persistedHash: canonicalPersistedHash,
			afterWrite: options.afterWrite,
			runtimeRefresh: options.runtimeRefresh,
			...notificationPreparedCandidates.size > 0 ? { preparedCandidatesByOwner: notificationPreparedCandidates } : {}
		}), getRuntimeConfigWriteApplication(options)));
	};
	try {
		if (canonicalReadFailure) throw canonicalReadFailure;
		options.assertConfigPathForWrite?.();
		await finalizeRuntimeSnapshotWrite({
			assertCurrent: () => {
				params.assertPostCommitCurrent?.();
				const read = expectDefined(canonicalRead, "canonical config reread");
				read.writeOptions.assertConfigPathForWrite?.();
				assertBaseSnapshotStillCurrent(read.snapshot, io.configPath, fs, {
					hashes: read.writeOptions.includeFileHashesForWrite ?? {},
					targets: read.writeOptions.includeFileTargetsForWrite ?? {}
				});
			},
			nextSourceConfig: canonicalSourceConfig,
			refreshOptions: options.runtimeRefresh,
			hadBothSnapshots: params.hadBothSnapshots,
			freshConfig: async (assertCurrent) => {
				assertCurrent();
				const stage = prepareConfigRuntimeEnvLoad({
					previousConfig: resolveManagedRuntimeEnvBaseline().sourceConfig,
					env: io.env,
					preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS
				});
				const stagedIo = createConfigIO({
					...params.ioOptions,
					configPath: io.configPath,
					env: stage.env
				});
				try {
					if (isMainThread) await loadDotEnvAsync({
						env: stage.env,
						quiet: true
					});
					else loadDotEnv({
						env: stage.env,
						quiet: true
					});
				} finally {
					stage.captureDotEnvBaseline();
					assertCurrent();
					stage.prepareFailure().publish().commit();
				}
				const config = await stagedIo.loadConfigAsync({ assertCurrent });
				assertCurrent();
				return {
					config,
					runtimeEnv: stage.prepare(config)
				};
			},
			notifyCommittedWrite,
			formatRefreshError: (error) => formatErrorMessage(error),
			preflightResult: params.runtimePreflightResult,
			deferRuntimeActivation,
			createRefreshError: (detail, cause) => new ConfigRuntimeRefreshError(`runtime snapshot refresh failed: ${detail}`, { cause })
		});
	} catch (error) {
		let rollbackStatus = "unknown";
		try {
			const rollback = writeResult[configWritePostCommitRollback];
			const rolledBackConfig = await rollback?.restoreFile(() => params.assertPostCommitCurrent?.());
			rollbackStatus = rolledBackConfig ? "restored" : "not-restored";
			if (rolledBackConfig) {
				params.assertPostCommitCurrent?.();
				recordUpdateDoctorConfigWrite(io.configPath, writeResult.persistedHash, hashConfigRaw(baseSnapshot.raw), writeResult.persistedConfig, JSON.stringify(isRecord(baseSnapshot.parsed) ? baseSnapshot.parsed : {}));
				restoreEnvChangesIfUnchanged({
					env: io.env,
					before: envBeforeCanonicalRead,
					after: envAfterCanonicalRead
				});
				rollback?.restoreEffects(() => params.assertPostCommitCurrent?.());
			}
		} catch (rollbackError) {
			throw new ConfigWritePostCommitError({
				configPath: io.configPath,
				rollbackStatus,
				cause: new AggregateError([error, rollbackError], `${formatErrorMessage(error)} Recovery failed: ${formatErrorMessage(rollbackError)}`, { cause: rollbackError })
			});
		}
		throw new ConfigWritePostCommitError({
			configPath: io.configPath,
			rollbackStatus,
			cause: error
		});
	}
	return writeResult;
}
//#endregion
//#region src/config/io.runtime.ts
function clearConfigCache() {}
function registerConfigWriteListener(listener, options = {}) {
	const unregisterOwner = options.ownsRuntimeActivationFor ? registerManagedRuntimeConfigWriteOwner(options.ownsRuntimeActivationFor, options.preCommitRuntimePreflight, options.prepareSnapshot) : void 0;
	const unregisterListener = registerRuntimeConfigWriteListener((event) => {
		const { preparedCandidate: _preparedCandidate, preparedCandidatesByOwner: _preparedCandidatesByOwner, ...baseEvent } = event;
		const preparedCandidate = unregisterOwner ? event.preparedCandidatesByOwner?.get(unregisterOwner.ownerId) : void 0;
		listener(copyRuntimeConfigWriteApplication(event, {
			...baseEvent,
			...preparedCandidate ? { preparedCandidate } : {}
		}));
	});
	return () => {
		unregisterListener();
		unregisterOwner?.();
	};
}
function loadConfig(options) {
	const loadFresh = () => createConfigIO({
		...options?.skipPluginValidation ? { pluginValidation: "skip" } : {},
		...options?.skipShellEnvFallback ? { shellEnvFallback: "defer" } : {}
	}).loadConfig();
	return options?.pin === false ? loadFresh() : loadPinnedRuntimeConfig(loadFresh);
}
function getRuntimeConfig(options) {
	return loadConfig(options);
}
function captureRuntimeConfigAsyncReader(options = {}) {
	const sourceEnv = process.env;
	const cwd = tryProcessCwd();
	const readSelectors = () => new Map([...GATEWAY_CONFIG_SELECTION_ENV_KEYS].map((key) => [key, sourceEnv[key]]));
	let selectors = readSelectors();
	const stage = prepareConfigRuntimeEnvLoad({ previousConfig: {} });
	const io = createConfigIO({ env: stage.env });
	const assertCurrent = () => {
		options.assertCurrent?.();
		if (process.env !== sourceEnv || tryProcessCwd() !== cwd || [...selectors].some(([key, value]) => sourceEnv[key] !== value)) throw new Error("Runtime config source changed during asynchronous preparation");
	};
	const preparePublication = (prepared) => ({
		env: prepared.env,
		publish: () => {
			assertCurrent();
			const previousSelectors = selectors;
			const publication = prepared.publish();
			selectors = readSelectors();
			return Object.assign(() => {
				publication();
				selectors = previousSelectors;
			}, { commit: () => publication.commit() });
		}
	});
	let pending;
	const read = () => {
		assertCurrent();
		const loadFresh = async (assertPinned) => {
			try {
				assertPinned();
				try {
					await loadDotEnvAsync({
						env: stage.env,
						quiet: true,
						cwd
					});
				} finally {
					stage.captureDotEnvBaseline();
				}
				assertPinned();
				const config = await io.loadConfigAsync({ assertCurrent: assertPinned });
				assertPinned();
				return {
					config,
					runtimeEnv: preparePublication(stage.prepare(config))
				};
			} catch (error) {
				assertPinned();
				preparePublication(stage.prepareFailure()).publish().commit();
				throw error;
			}
		};
		return pending ??= options.capture ? loadPinnedRuntimeConfigAsync(loadFresh, {
			assertCurrent,
			capture: true
		}) : loadPinnedRuntimeConfigAsync(loadFresh, { assertCurrent });
	};
	return Object.assign(read, { assertCurrent });
}
function createCurrentConfigReader(params) {
	return createConfigIO({
		configPath: params.configPath,
		env: cloneEnvWithPlatformSemantics(params.env ?? process.env),
		observe: false,
		pluginValidation: "core-only",
		deferredPluginMigrations: params.deferredPluginMigrations,
		shellEnvFallback: "defer",
		suppressFutureVersionWarning: true,
		logger: {
			warn: () => {},
			error: () => {}
		}
	});
}
/** Inspection may degrade location selection; it never admits invalid config for state repairs. */
function readCurrentConfigForResolution(params = {}) {
	if (params.config) return {
		config: params.config,
		env: params.env ?? process.env,
		configDiagnostics: null
	};
	const io = createCurrentConfigReader(params);
	let config;
	try {
		const loaded = io.loadConfig({ skipSuspiciousRecovery: true });
		if (fs.existsSync(io.configPath)) config = loaded;
	} catch {}
	const issues = config ? [] : [{
		path: io.configPath,
		message: "Config unavailable; using environment and default agent directory settings."
	}];
	logConfigWarningsOnce({
		configPath: `${io.configPath}#directory-resolution`,
		warnings: issues,
		logger: console
	});
	return {
		config: config ?? {},
		env: io.env,
		configDiagnostics: config ? null : {
			path: io.configPath,
			issues
		}
	};
}
/** Revalidate disk policy at a synchronous effect boundary without observing or repairing state. */
function readCurrentConfigForPolicyCheck(params) {
	return createCurrentConfigReader({
		...params,
		deferredPluginMigrations: readDeferredPluginMigrations({ env: params.env })
	}).loadConfig({ skipSuspiciousRecovery: true });
}
async function readBestEffortConfig(options) {
	return await createConfigIO({
		...options?.isolateEnv ? { env: cloneEnvWithPlatformSemantics(process.env) } : {},
		...options?.observe === false ? { observe: false } : {},
		pluginValidation: options?.pluginValidation ?? (options?.skipPluginValidation ? "skip" : void 0)
	}).readBestEffortConfig();
}
async function readBestEffortConfigSnapshot(options) {
	return await createConfigIO({
		...options?.observe === false ? { observe: false } : {},
		...options?.skipPluginValidation ? { pluginValidation: "skip" } : {}
	}).readBestEffortConfigSnapshot();
}
async function readSourceConfigBestEffort() {
	return await createConfigIO().readSourceConfigBestEffort();
}
async function readConfigFileSnapshot(options = {}) {
	const pluginValidation = options.pluginValidation ?? (options.skipPluginValidation ? "skip" : void 0);
	return await createConfigIO({
		...options.deferredPluginMigrations ? { deferredPluginMigrations: options.deferredPluginMigrations } : {},
		...options.measure ? { measure: options.measure } : {},
		...options.observe === false ? { observe: false } : {},
		...options.isolateEnv ? { env: cloneEnvWithPlatformSemantics(process.env) } : {},
		...options.lowerPrecedenceEnv ? { lowerPrecedenceEnv: options.lowerPrecedenceEnv } : {},
		...pluginValidation ? { pluginValidation } : {},
		...options.suppressFutureVersionWarning ? { suppressFutureVersionWarning: true } : {},
		...options.preservedLegacyRootKeys ? { preservedLegacyRootKeys: options.preservedLegacyRootKeys } : {}
	}).readConfigFileSnapshot({
		recoverSuspicious: options.recoverSuspicious === true,
		allowSuspiciousRecovery: options.allowSuspiciousRecovery
	});
}
async function readConfigFileSnapshotWithPluginMetadata(options) {
	return await createConfigIO({
		...options?.deferredPluginMigrations ? { deferredPluginMigrations: options.deferredPluginMigrations } : {},
		...options?.measure ? { measure: options.measure } : {},
		...options?.observe === false ? { observe: false } : {},
		...options?.isolateEnv ? { env: cloneEnvWithPlatformSemantics(process.env) } : {},
		...options?.lowerPrecedenceEnv ? { lowerPrecedenceEnv: options.lowerPrecedenceEnv } : {},
		...options?.skipPluginValidation ? { pluginValidation: "skip" } : {}
	}).readConfigFileSnapshotWithPluginMetadata({
		prepareValidation: options?.prepareValidation,
		allowCurrentPluginMetadata: options?.allowCurrentPluginMetadata,
		recoverSuspicious: options?.recoverSuspicious === true,
		allowSuspiciousRecovery: options?.allowSuspiciousRecovery
	});
}
async function promoteConfigSnapshotToLastKnownGood(snapshot) {
	return await createConfigIO().promoteConfigSnapshotToLastKnownGood(snapshot);
}
async function recoverConfigFromLastKnownGood(params) {
	return await createConfigIO().recoverConfigFromLastKnownGood(params);
}
async function recoverConfigFromJsonRootSuffix(snapshot) {
	return await createConfigIO().recoverConfigFromJsonRootSuffix(snapshot);
}
async function readSourceConfigSnapshot() {
	return await readConfigFileSnapshot();
}
async function readConfigFileSnapshotForRuntimeTransaction(activeSourceConfig) {
	return await createConfigIO({ env: createConfigRuntimeEnvBase(activeSourceConfig, process.env, { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS }) }).readConfigFileSnapshot();
}
async function readConfigFileSnapshotForWrite(options) {
	const readOptions = {
		...options?.skipPluginValidation ? { pluginValidation: "skip" } : {},
		...options?.observe === false ? { observe: false } : {}
	};
	for (let attempt = 0; attempt < 3; attempt += 1) try {
		const processIo = createConfigIO(readOptions);
		const result = await (hasManagedRuntimeConfigWriteOwner(processIo.configPath) ? createConfigIO({
			...readOptions,
			env: createManagedRuntimeEnvBase()
		}) : processIo).readConfigFileSnapshotForWrite();
		result.writeOptions.assertConfigPathForWrite?.();
		return result;
	} catch (error) {
		if (!(error instanceof ConfigMutationConflictError) || error.retryable || attempt === 2) throw error;
	}
	throw new Error("unreachable");
}
async function readSourceConfigSnapshotForWrite() {
	return await readConfigFileSnapshotForWrite();
}
async function writeConfigFile(cfg, options = {}) {
	options.assertConfigPathForWrite?.();
	const ioOptions = {
		...options.ownedConfigPathForWrite ? { configPath: options.ownedConfigPathForWrite } : {},
		...options.skipPluginValidation ? { pluginValidation: "skip" } : {},
		...options.observe === false ? { observe: false } : {},
		...options.preservedLegacyRootKeys ? { preservedLegacyRootKeys: options.preservedLegacyRootKeys } : {}
	};
	const processIo = createConfigIO(ioOptions);
	return await withConfigWriteLock(processIo.configPath, async () => {
		options.assertConfigPathForWrite?.();
		const deferRuntimeActivation = hasManagedRuntimeConfigWriteOwner(processIo.configPath);
		const io = deferRuntimeActivation ? createConfigIO({
			...ioOptions,
			env: createManagedRuntimeEnvBase()
		}) : processIo;
		assertConfigWriteAllowedInCurrentMode({ configPath: io.configPath });
		const runtimeConfigSnapshot = getRuntimeConfigSnapshot();
		const runtimeConfigSourceSnapshot = getRuntimeConfigSourceSnapshot();
		const hadRuntimeSnapshot = Boolean(runtimeConfigSnapshot);
		const hadBothSnapshots = Boolean(runtimeConfigSnapshot && runtimeConfigSourceSnapshot);
		let nextCfg = options.inputBase === void 0 ? projectLegacyRuntimeConfigWrite(cfg, runtimeConfigSnapshot, runtimeConfigSourceSnapshot) : cfg;
		const baseSnapshotRead = options.baseSnapshot ? {
			snapshot: options.baseSnapshot,
			pluginMetadataSnapshot: options.basePluginMetadataSnapshot
		} : await io.readConfigFileSnapshotWithPluginMetadata();
		const baseSnapshot = baseSnapshotRead.snapshot;
		if (deferRuntimeActivation) replaceEnvSnapshot(io.env, createManagedRuntimeEnvBase());
		let runtimePreflightResult;
		let managedPreparedCandidates = /* @__PURE__ */ new Map();
		const assertPostCommitCurrent = captureConfigWriteLockGuard(io.configPath);
		const writeResult = await io.writeConfigFile(nextCfg, {
			...options,
			baseSnapshot,
			basePluginMetadataSnapshot: baseSnapshotRead.pluginMetadataSnapshot,
			envSnapshotForRestore: resolveWriteEnvSnapshotForPath({
				actualConfigPath: io.configPath,
				expectedConfigPath: options.expectedConfigPath,
				envSnapshotForRestore: options.envSnapshotForRestore
			}),
			unsetPaths: resolveManagedUnsetPathsForWrite(options.unsetPaths),
			explicitSetValueSource: options.explicitSetPaths ? options.explicitSetValueSource ?? cfg : void 0,
			preCommitRuntimePreflight: async (sourceConfig) => {
				nextCfg = sourceConfig;
				if (deferRuntimeActivation) managedPreparedCandidates = await preflightManagedRuntimeConfigWrite(io.configPath, sourceConfig, options.runtimeRefresh);
				else runtimePreflightResult = await preflightRuntimeSnapshotWrite({
					nextSourceConfig: sourceConfig,
					refreshOptions: options.runtimeRefresh,
					formatRefreshError: (error) => formatErrorMessage(error),
					createRefreshError: (detail, cause) => new ConfigRuntimeRefreshError(`Config write blocked before committing ${io.configPath}: active SecretRef resolution failed: ${detail}`, { cause })
				});
				await options.preCommitRuntimePreflight?.(sourceConfig);
			}
		});
		if (options.skipRuntimeSnapshotRefresh && !hadRuntimeSnapshot && !getRuntimeConfigSnapshotRefreshHandler()) return writeResult;
		if (deferRuntimeActivation) replaceEnvSnapshot(io.env, createManagedRuntimeEnvBase());
		return await finalizeCommittedConfigWrite({
			io,
			ioOptions,
			options,
			nextCfg,
			writeResult,
			baseSnapshot,
			hadBothSnapshots,
			deferRuntimeActivation,
			runtimePreflightResult,
			managedPreparedCandidates,
			assertPostCommitCurrent
		});
	}, processIo.env, options.assertCurrent);
}
//#endregion
export { createRuntimeConfigWriteApplication as C, copyRuntimeConfigWriteApplication as S, recoverConfigFromJsonRootSuffix as _, promoteConfigSnapshotToLastKnownGood as a, writeConfigFile as b, readConfigFileSnapshot as c, readConfigFileSnapshotWithPluginMetadata as d, readCurrentConfigForPolicyCheck as f, readSourceConfigSnapshotForWrite as g, readSourceConfigSnapshot as h, loadConfig as i, readConfigFileSnapshotForRuntimeTransaction as l, readSourceConfigBestEffort as m, clearConfigCache as n, readBestEffortConfig as o, readCurrentConfigForResolution as p, getRuntimeConfig as r, readBestEffortConfigSnapshot as s, captureRuntimeConfigAsyncReader as t, readConfigFileSnapshotForWrite as u, recoverConfigFromLastKnownGood as v, getRuntimeConfigWriteApplication as w, attachRuntimeConfigWriteApplication as x, registerConfigWriteListener as y };
