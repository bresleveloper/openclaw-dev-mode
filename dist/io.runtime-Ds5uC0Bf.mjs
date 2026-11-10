import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as restoreEnvChangesIfUnchanged, o as createConfigRuntimeEnvBase, p as snapshotEnv, r as cloneEnvWithPlatformSemantics, u as prepareConfigRuntimeEnvLoad } from "./config-env-vars-BHneg24Q.mjs";
import { _ as registerManagedRuntimeConfigWriteOwner, c as getRuntimeConfigSnapshotRefreshHandler, d as loadPinnedRuntimeConfig, f as loadPinnedRuntimeConfigAsync, h as preflightRuntimeSnapshotWrite, i as finalizeRuntimeSnapshotWrite, j as hashRuntimeConfigValue, l as getRuntimeConfigSourceSnapshot, m as preflightManagedRuntimeConfigWrite, o as getRuntimeConfigSnapshot, p as notifyRuntimeConfigWriteListeners, s as getRuntimeConfigSnapshotMetadata, u as hasManagedRuntimeConfigWriteOwner, y as registerRuntimeConfigWriteListener } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as hashConfigRaw, l as replaceEnvSnapshot } from "./io.read-helpers-KYk5dB53.mjs";
import { a as createManagedRuntimeEnvBase, s as resolveManagedRuntimeEnvBaseline, t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-Cu1pIc3h.mjs";
import { a as logConfigWarningsOnce, c as assertBaseSnapshotStillCurrent, i as withConfigWriteLock, t as captureConfigWriteLockGuard } from "./write-lock-BlX1pI0w.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { n as getDeferredPluginMigrationConfigFacts, u as resolveManagedUnsetPathsForWrite } from "./deferred-plugin-migration-config-Cc7gzBuJ.mjs";
import { r as projectLegacyRuntimeConfigWrite } from "./runtime-source-projection-DAkjzBhe.mjs";
import { n as loadDotEnvAsync, t as loadDotEnv } from "./dotenv-DYpbXCOa.mjs";
import { t as GATEWAY_CONFIG_SELECTION_ENV_KEYS } from "./gateway-env-selection-CVppArD2.mjs";
import { v as recordUpdateDoctorConfigWrite } from "./update-doctor-result-oZ38327j.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-BBJ5cpXU.mjs";
import { t as resolveWriteEnvSnapshotForPath } from "./env-preserve-ZftHp-Ht.mjs";
import { r as configWritePostCommitRollback, t as ConfigRuntimeRefreshError } from "./io.types-BryqPXkC.mjs";
import { s as recoverConfigWriteFailure } from "./io.write-errors-BBNhGTcQ.mjs";
import { n as createMergePatch, r as mergePatchConflicts } from "./merge-patch-D-eANYlX.mjs";
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
//#region src/config/runtime-write-application.ts
const runtimeConfigWriteApplications = /* @__PURE__ */ new WeakMap();
/** Creates a single-owner receipt for one persisted config write. */
function createRuntimeConfigWriteApplication(runTransaction, activation) {
	let claimed = false;
	let settled = false;
	let isCarriedBy;
	const result = createDeferredCore();
	return {
		result: result.promise,
		get claimed() {
			return claimed;
		},
		recordConfigChange: (previous, written) => {
			if (!activation?.prepare && !activation?.requireImmediateApplication) {
				const patch = createMergePatch(previous, written);
				isCarriedBy = (config) => !settled && !mergePatchConflicts(written, config, patch);
			}
		},
		claim: () => {
			if (claimed) return null;
			claimed = true;
			const claim = {
				settle: (status) => {
					settled = true;
					delete claim.runTransaction;
					result.resolve(status);
				},
				...runTransaction ? { runTransaction } : {},
				...activation,
				...isCarriedBy ? { isCarriedBy } : {}
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
function publishRuntimeConfigWrite(params) {
	const runtimeConfig = params.deferRuntimeActivation ? params.runtimeConfig : getRuntimeConfigSnapshot();
	if (!runtimeConfig) return;
	const application = params.writeOptions && getRuntimeConfigWriteApplication(params.writeOptions);
	const afterWrite = params.afterWrite ?? params.writeOptions?.afterWrite;
	const refresh = params.writeOptions?.runtimeRefresh;
	if ((!afterWrite || afterWrite.mode === "auto") && !refresh?.includeAuthStoreRefs && !refresh?.requireImmediateApplication) application?.recordConfigChange(params.previousSourceConfig, params.writtenSourceConfig);
	const preparedCandidatesByOwner = new Map([...params.preparedCandidates].map(([ownerId, candidate]) => [ownerId, {
		...candidate,
		runtimeConfig: candidate.reapplyRuntimeOverlays?.(params.runtimeConfig) ?? candidate.runtimeConfig,
		compareConfig: candidate.reapplyCompareOverlays?.(params.sourceConfig) ?? candidate.compareConfig
	}]));
	const publishedMetadata = getRuntimeConfigSnapshotMetadata();
	const metadata = runtimeConfig === getRuntimeConfigSnapshot() && publishedMetadata ? publishedMetadata : {
		revision: publishedMetadata?.revision ?? 0,
		fingerprint: hashRuntimeConfigValue(runtimeConfig),
		sourceFingerprint: hashRuntimeConfigValue(params.sourceConfig),
		updatedAtMs: Date.now()
	};
	notifyRuntimeConfigWriteListeners(copyRuntimeConfigWriteApplication(params.writeOptions, {
		configPath: params.configPath,
		snapshot: params.snapshot,
		sourceConfig: params.sourceConfig,
		runtimeConfig,
		persistedHash: params.persistedHash,
		revision: metadata.revision,
		fingerprint: metadata.fingerprint,
		sourceFingerprint: metadata.sourceFingerprint,
		writtenAtMs: Date.now(),
		afterWrite: params.afterWrite ?? params.writeOptions?.afterWrite,
		...params.writeOptions?.runtimeRefresh ? { runtimeRefresh: params.writeOptions.runtimeRefresh } : {},
		...preparedCandidatesByOwner.size > 0 ? { preparedCandidatesByOwner } : {}
	}));
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
		publishRuntimeConfigWrite({
			configPath: io.configPath,
			snapshot: expectDefined(canonicalRead, "canonical config reread").snapshot,
			sourceConfig: canonicalSourceConfig,
			previousSourceConfig: baseSnapshot.sourceConfig,
			writtenSourceConfig: params.nextCfg,
			runtimeConfig: canonicalRuntimeConfig,
			persistedHash: canonicalPersistedHash,
			deferRuntimeActivation,
			preparedCandidates: managedPreparedCandidates,
			writeOptions: options
		});
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
		const rollback = writeResult[configWritePostCommitRollback];
		return await recoverConfigWriteFailure({
			configPath: io.configPath,
			cause: error,
			restoreFile: async () => rollback?.restoreFile(() => params.assertPostCommitCurrent?.()),
			restoreEffects: async () => {
				params.assertPostCommitCurrent?.();
				recordUpdateDoctorConfigWrite(io.configPath, writeResult.persistedHash, hashConfigRaw(baseSnapshot.raw), writeResult.persistedConfig, JSON.stringify(isRecord(baseSnapshot.parsed) ? baseSnapshot.parsed : {}));
				restoreEnvChangesIfUnchanged({
					env: io.env,
					before: envBeforeCanonicalRead,
					after: envAfterCanonicalRead
				});
				await rollback?.restoreEffects(() => params.assertPostCommitCurrent?.());
			}
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
/** @deprecated Use the prepared runtime snapshot or await captureRuntimeConfigAsyncReader()(). */
function loadConfig(options) {
	const loadFresh = () => createConfigIO({
		...options?.skipPluginValidation ? { pluginValidation: "skip" } : {},
		...options?.skipShellEnvFallback ? { shellEnvFallback: "defer" } : {}
	}).loadConfig();
	return options?.pin === false ? loadFresh() : loadPinnedRuntimeConfig(loadFresh);
}
function captureRuntimeConfigAsyncReader(options = {}) {
	const sourceEnv = process.env;
	const cwd = tryProcessCwd();
	const readSelectors = () => new Map([...GATEWAY_CONFIG_SELECTION_ENV_KEYS].map((key) => [key, sourceEnv[key]]));
	let selectors = readSelectors();
	const stage = prepareConfigRuntimeEnvLoad({ previousConfig: {} });
	const io = createConfigIO({
		env: stage.env,
		...options.skipPluginValidation ? { pluginValidation: "skip" } : {}
	});
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
	return createCurrentConfigReader(params).loadConfig({ skipSuspiciousRecovery: true });
}
/** Read canonical disk policy asynchronously without inspecting migration state. */
async function readCurrentConfigForPolicyCheckAsync(params) {
	const configPath = params.configPath;
	return await createCurrentConfigReader({
		configPath,
		env: cloneEnvWithPlatformSemantics(params.env)
	}).loadConfigAsync({ skipSuspiciousRecovery: true });
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
	return await createConfigIO({
		deferredPluginMigrations: options.deferredPluginMigrations,
		measure: options.measure,
		observe: options.observe === false ? false : void 0,
		env: options.isolateEnv ? cloneEnvWithPlatformSemantics(process.env) : void 0,
		lowerPrecedenceEnv: options.lowerPrecedenceEnv,
		pluginValidation: options.pluginValidation ?? (options.skipPluginValidation ? "skip" : void 0),
		suppressFutureVersionWarning: options.suppressFutureVersionWarning || void 0,
		preservedLegacyRootKeys: options.preservedLegacyRootKeys
	}).readConfigFileSnapshot({
		recoverSuspicious: options.recoverSuspicious === true,
		allowSuspiciousRecovery: options.allowSuspiciousRecovery
	});
}
async function readConfigFileSnapshotWithPluginMetadata(options) {
	return await createConfigIO({
		deferredPluginMigrations: options?.deferredPluginMigrations,
		measure: options?.measure,
		observe: options?.observe === false ? false : void 0,
		env: options?.isolateEnv ? cloneEnvWithPlatformSemantics(process.env) : void 0,
		lowerPrecedenceEnv: options?.lowerPrecedenceEnv,
		pluginValidation: options?.skipPluginValidation ? "skip" : void 0
	}).readConfigFileSnapshotWithPluginMetadata({
		completePluginMetadata: options?.completePluginMetadata,
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
async function recoverConfigFromJsonRootSuffix(snapshot, assertRecoveryCandidate) {
	return await createConfigIO().recoverConfigFromJsonRootSuffix(snapshot, assertRecoveryCandidate);
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
		...options?.observe === false ? { observe: false } : {},
		...options?.deferredPluginMigrations !== void 0 ? { deferredPluginMigrations: options.deferredPluginMigrations } : {},
		...options?.preservedLegacyRootKeys ? { preservedLegacyRootKeys: options.preservedLegacyRootKeys } : {}
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
	const deferredPluginMigrations = options.deferredPluginMigrations ?? getDeferredPluginMigrationConfigFacts(options.baseSnapshot?.sourceConfig);
	const ioOptions = {
		...deferredPluginMigrations !== void 0 ? { deferredPluginMigrations } : {},
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
export { createRuntimeConfigWriteApplication as C, copyRuntimeConfigWriteApplication as S, publishRuntimeConfigWrite as T, recoverConfigFromJsonRootSuffix as _, readBestEffortConfig as a, writeConfigFile as b, readConfigFileSnapshotForRuntimeTransaction as c, readCurrentConfigForPolicyCheck as d, readCurrentConfigForPolicyCheckAsync as f, readSourceConfigSnapshotForWrite as g, readSourceConfigSnapshot as h, promoteConfigSnapshotToLastKnownGood as i, readConfigFileSnapshotForWrite as l, readSourceConfigBestEffort as m, clearConfigCache as n, readBestEffortConfigSnapshot as o, readCurrentConfigForResolution as p, loadConfig as r, readConfigFileSnapshot as s, captureRuntimeConfigAsyncReader as t, readConfigFileSnapshotWithPluginMetadata as u, recoverConfigFromLastKnownGood as v, getRuntimeConfigWriteApplication as w, attachRuntimeConfigWriteApplication as x, registerConfigWriteListener as y };
