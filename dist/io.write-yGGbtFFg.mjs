import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as isVerbose } from "./global-state-BAD7XgmL.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { o as createConfigRuntimeEnvBase, r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { h as setConfigResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { a as hashConfigRevision, h as restoreAuthoredTildePathsForWrite, i as hashConfigRaw, m as resolveGatewayMode, n as containsConfigIncludeDirective, r as hasConfigMeta, u as resolveConfigForRead } from "./io.read-helpers-Bvdjf9tk.mjs";
import { m as withDeferredPluginMigrationsCurrent, o as readConfigWritePendingMigrations, p as withDeferredPluginConfigRollback } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { _ as fingerprintConfigSnapshotAuthoredConfig, b as upsertConfigSnapshotAuditRecordAsync, d as formatConfigOverwriteLogMessage, g as configSnapshotAuditRecordMatchesPath, i as appendConfigAuditRecord, l as createConfigWriteAuditRecordBase, o as capConfigAuditIssues, s as capConfigAuditPaths, u as finalizeConfigWriteAuditRecord, v as readLatestConfigSnapshotAuditRecordAsync, y as restoreConfigSnapshotAuditRecordAsync } from "./io.audit-BXzMurur.mjs";
import { C as projectWebhookMigrationIncludeWrite, E as loggedConfigWarningFingerprints, O as setBoundedConfigIoWarningEntry, T as stampConfigWriteMetadata, _ as captureConfigWriteLockGuard, d as resolveConfigSizeBaselineBytes, f as resolveConfigStatMetadata, g as tightenStateDirPermissionsIfNeeded, h as rollbackConfigFileWriteIfUnchanged, i as assertBaseSnapshotStillCurrent, l as createConfigFileWriteGuard, m as resolveConfigWriteSuspiciousReasons, p as resolveConfigWriteBlockingReasons, r as warnIfJSON5CommentsWillBeStripped, t as logConfigWarningsOnce, u as formatConfigArtifactTimestamp, w as recordConfigWriteMetadata } from "./io.warnings-Dz_nq5SM.mjs";
import { _ as recordUpdateDoctorConfigWrite, o as assertUpdateDoctorConfigInputHash, p as getUpdateDoctorConfigWriteAuthority } from "./update-doctor-result-yVslo54h.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-6uPuICvJ.mjs";
import { c as resolveManagedUnsetPathsForWrite, i as preserveDeferredPluginMigrationConfig, o as setDeferredPluginMigrationConfigFacts, s as applyUnsetPathsForWrite } from "./deferred-plugin-migration-config-Db8uALnk.mjs";
import { i as resolveKeyedAgentEntryIncludePreservation } from "./include-write-boundary-Cv161pwQ.mjs";
import { g as preflightRuntimeSnapshotWrite } from "./runtime-snapshot-DYptB0Cf.mjs";
import { n as validateConfigObjectRawWithPlugins } from "./validation-R7HXbC_L.mjs";
import { r as initializeNativeSessionCatalogPreferences } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { n as configWriteCommittedSnapshot, r as configWritePostCommitRollback, t as ConfigRuntimeRefreshError } from "./io.types-E3Nszhk8.mjs";
import { r as createConfigValidationFailedError, t as ConfigWritePostCommitError } from "./io.write-errors-DuSgsySH.mjs";
import { a as resolvePersistCandidateForWrite, t as injectExplicitlySetPaths } from "./io.write-prepare-DWaupA4w.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-C4XTCka4.mjs";
import { n as prepareConfigFileWrite } from "./backup-rotation-C9pxGn3m.mjs";
import { t as rejectConfigNonFiniteNumbers } from "./value-tree-3oLf9xok.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-C7ju4So0.mjs";
import "./store-ChPMJI5O.mjs";
import { n as collectConfigWriteChangedPaths, t as collectChangedPaths } from "./config-change-paths-Bn8_AFL9.mjs";
import { t as prepareConfigWriteTopology } from "./io.write-topology-C0PMHLXh.mjs";
import { r as prepareCronOwnerWriteRefusal } from "./io.cron-owner-refusal-Cje_ZhR1.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/config/io.write.ts
async function writeConfigFileFromContext(context, cfg, writeOptions, readSnapshot) {
	const { deps, configPath } = context;
	let options = writeOptions;
	const sourceGuard = captureConfigWriteLockGuard(configPath);
	const doctorAuthority = getUpdateDoctorConfigWriteAuthority(configPath);
	if (sourceGuard) {
		const original = options;
		options = {
			...options,
			assertConfigPathForWrite: () => {
				sourceGuard();
				original.assertConfigPathForWrite?.();
			},
			beforeCommit: async () => {
				await original.beforeCommit?.();
				sourceGuard();
			}
		};
	}
	options.assertConfigPathForWrite?.();
	assertConfigWriteAllowedInCurrentMode({
		configPath,
		env: deps.env
	});
	const unsetPaths = resolveManagedUnsetPathsForWrite(options.unsetPaths);
	const snapshotRead = options.baseSnapshot ? {
		snapshot: options.baseSnapshot,
		pluginMetadataSnapshot: options.basePluginMetadataSnapshot
	} : await readSnapshot();
	const snapshot = snapshotRead.snapshot;
	const deferredPluginMigrations = readConfigWritePendingMigrations(configPath, deps.env);
	const configForWrite = preserveDeferredPluginMigrationConfig({
		sourceConfig: snapshot.sourceConfig,
		nextConfig: cfg,
		pending: deferredPluginMigrations,
		writeOptions: options
	});
	if (doctorAuthority) {
		sourceGuard?.();
		assertUpdateDoctorConfigInputHash(configPath, hashConfigRaw(snapshot.raw));
		options = {
			...options,
			baseSnapshot: snapshot
		};
	}
	if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
	const { nextConfig, clearedSessionStoreOwner, authoredConfig, authoredSourceConfig, authoredRuntimeConfig, explicitSetPaths, explicitSetValueSource, persistCanonicalAgentRoster, preserveLegacyAgentRoster, cronOwner } = prepareConfigWriteTopology({
		...snapshotRead,
		nextConfig: configForWrite,
		options,
		unsetPaths,
		env: deps.env,
		lowerPrecedenceEnv: deps.lowerPrecedenceEnv,
		homedir: deps.homedir
	});
	const inputBasis = {
		kind: options.inputBase ?? "runtime",
		config: options.inputBase === "source" ? authoredSourceConfig : authoredRuntimeConfig
	};
	const cronOwnerRefusal = cronOwner ? await prepareCronOwnerWriteRefusal(snapshot.config, {
		storePath: resolveCronJobsStorePathFromConfig(nextConfig, deps.env),
		...cronOwner,
		env: deps.env
	}) : void 0;
	let persistCandidate = authoredConfig;
	const changedPaths = collectConfigWriteChangedPaths(inputBasis.config, authoredConfig, [...explicitSetPaths, ...options.unsetPaths ?? []]);
	const hasAuthoredIncludes = containsConfigIncludeDirective(snapshot.parsed);
	if (snapshot.valid || snapshot.exists && hasAuthoredIncludes) {
		const webhookMigration = hasAuthoredIncludes ? projectWebhookMigrationIncludeWrite(authoredSourceConfig, authoredConfig) : void 0;
		const keyedAgentEntryIncludes = resolveKeyedAgentEntryIncludePreservation({
			configPath: snapshot.path,
			provenance: snapshot.includeProvenance
		});
		persistCandidate = resolvePersistCandidateForWrite({
			inputBasis,
			runtimeConfig: authoredRuntimeConfig,
			sourceConfig: authoredSourceConfig,
			sourceConfigValid: snapshot.valid,
			sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations,
			nextConfig: webhookMigration?.config ?? authoredConfig,
			rootAuthoredConfig: snapshot.parsed,
			agentRosterIncludeOwned: snapshot.agentRosterIncludeOwned,
			keyedAgentEntryIncludePaths: keyedAgentEntryIncludes?.includePaths,
			unsetPaths,
			explicitSetPaths: explicitSetPaths.filter((field) => !webhookMigration?.paths.some((pin) => isDeepStrictEqual(pin, field))),
			explicitSetValueSource,
			persistCanonicalAgentRoster,
			allowedAgentRosterRemovals: options.allowedAgentRosterRemovals,
			allowIncludeAncestorExplicitSetPaths: options.allowIncludeAncestorExplicitSetPaths,
			preserveLegacyAgentRoster
		});
		if (webhookMigration) persistCandidate = injectExplicitlySetPaths({
			valueSource: authoredConfig,
			persistedCandidate: persistCandidate,
			runtimeConfig: authoredRuntimeConfig,
			sourceConfig: authoredSourceConfig,
			rootAuthoredConfig: snapshot.parsed,
			explicitSetPaths: webhookMigration.paths,
			allowIncludeAncestorExplicitSetPaths: true
		});
	}
	const validationEnvBase = createConfigRuntimeEnvBase(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig, deps.env);
	const resolveValidationCandidate = (candidate) => {
		const config = applyUnsetPathsForWrite(candidate, unsetPaths);
		if (containsConfigIncludeDirective(config)) return context.resolveRuntimePreflightSourceConfig(config, void 0, void 0, validationEnvBase);
		const resolution = resolveConfigForRead(config, cloneEnvWithPlatformSemantics(validationEnvBase), deps.lowerPrecedenceEnv);
		setConfigResolutionFacts(resolution.resolvedConfigRaw, resolution.resolutionFacts);
		return resolution.resolvedConfigRaw;
	};
	const validationCandidate = resolveValidationCandidate(persistCandidate);
	const validateCandidate = (candidate) => {
		const result = validateConfigObjectRawWithPlugins(candidate, {
			...context.pathResolution,
			pluginValidation: options.skipPluginValidation ? "skip" : "full",
			semanticValidation: "strict",
			preservedLegacyRootKeys: options.preservedLegacyRootKeys,
			deferredPluginMigrations
		});
		if (!result.ok) throw createConfigValidationFailedError(result.issues);
		return result;
	};
	validateCandidate(validationCandidate);
	const validatedCandidate = validationCandidate;
	const previousSource = snapshot.authoredConfig ?? snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
	const materialized = stampConfigWriteMetadata(snapshot.exists ? validatedCandidate : initializeNativeSessionCatalogPreferences(validatedCandidate), options.lastTouchedVersionOverride, snapshot.exists ? previousSource : null, deps.env);
	persistCandidate = applyMergePatch(persistCandidate, createMergePatch(validationCandidate, materialized));
	const validated = validateCandidate(resolveValidationCandidate(persistCandidate));
	const previousWarningFingerprint = loggedConfigWarningFingerprints.get(configPath);
	options.assertConfigPathForWrite?.();
	const priorSnapshotAuditRecord = await readLatestConfigSnapshotAuditRecordAsync({
		env: deps.env,
		homedir: deps.homedir
	}, options.assertConfigPathForWrite);
	options.assertConfigPathForWrite?.();
	await deps.fs.promises.mkdir(path.dirname(configPath), {
		recursive: true,
		mode: 448
	});
	await tightenStateDirPermissionsIfNeeded({
		configPath,
		env: deps.env,
		homedir: deps.homedir,
		fsModule: deps.fs,
		assertConfigPathForWrite: options.assertConfigPathForWrite
	});
	const tildeRestoredOutputConfig = restoreAuthoredTildePathsForWrite(persistCandidate, snapshot.parsed, void 0, deps.homedir());
	const outputConfig = preserveDeferredPluginMigrationConfig({
		sourceConfig: snapshot.parsed,
		nextConfig: applyUnsetPathsForWrite(tildeRestoredOutputConfig, unsetPaths),
		pending: deferredPluginMigrations,
		writeOptions: { unsetPaths: options.unsetPaths }
	});
	const stampedOutputConfig = stampConfigWriteMetadata(outputConfig, options.lastTouchedVersionOverride, void 0, deps.env);
	rejectConfigNonFiniteNumbers(stampedOutputConfig);
	const json = JSON.stringify(stampedOutputConfig, null, 2).trimEnd().concat("\n");
	const nextHash = hashConfigRaw(json);
	const previousHash = hashConfigRaw(snapshot.raw);
	const changedPathCount = changedPaths.size;
	const previousBytes = typeof snapshot.raw === "string" ? Buffer.byteLength(snapshot.raw, "utf-8") : null;
	const sizeBaselineBytes = resolveConfigSizeBaselineBytes({
		raw: snapshot.raw,
		json5: deps.json5,
		lastTouchedVersionOverride: options.lastTouchedVersionOverride,
		env: deps.env
	});
	const nextBytes = Buffer.byteLength(json, "utf-8");
	const previousStat = snapshot.exists ? await deps.fs.promises.stat(configPath).catch(() => null) : null;
	const hasMetaBefore = hasConfigMeta(snapshot.parsed);
	const hasMetaAfter = hasConfigMeta(stampedOutputConfig);
	const gatewayModeBefore = resolveGatewayMode(snapshot.resolved);
	const includeFileHashes = {};
	const includeFileTargets = {};
	const sourceConfigForPreflight = context.resolveRuntimePreflightSourceConfig(stampedOutputConfig, includeFileHashes, includeFileTargets, validationEnvBase);
	const committedRevision = hashConfigRevision(json, includeFileHashes, includeFileTargets);
	const gatewayModeAfter = resolveGatewayMode(sourceConfigForPreflight);
	const suspiciousReasons = resolveConfigWriteSuspiciousReasons({
		existsBefore: snapshot.exists,
		unreadableBefore: snapshot.readError != null,
		sizeBaselineBytes,
		nextBytes,
		hasMetaBefore,
		gatewayModeBefore,
		gatewayModeAfter
	});
	const readTestLogFlag = (name) => isVitestRuntimeEnv(deps.env) && deps.env[name] === "1";
	const logConfigOverwrite = () => {
		if (!snapshot.exists || options.skipOutputLogs || isVitestRuntimeEnv(deps.env) && !readTestLogFlag("OPENCLAW_TEST_CONFIG_WRITE_LOG")) return;
		const testLog = readTestLogFlag("OPENCLAW_TEST_CONFIG_WRITE_LOG");
		if (!isVerbose() && deps.env.OPENCLAW_CONFIG_OVERWRITE_LOG !== "1" && !testLog) return;
		deps.logger.warn(formatConfigOverwriteLogMessage({
			configPath,
			previousHash: previousHash ?? null,
			nextHash,
			changedPathCount
		}));
	};
	const logConfigWriteAnomalies = () => {
		const testLog = readTestLogFlag("OPENCLAW_TEST_CONFIG_WRITE_LOG");
		if (suspiciousReasons.length === 0 || options.skipOutputLogs || isVitestRuntimeEnv(deps.env) && !testLog) return;
		const visibleReasons = isVerbose() || deps.env.OPENCLAW_CONFIG_WRITE_ANOMALY_LOG === "1" || testLog ? suspiciousReasons : suspiciousReasons.filter((reason) => reason !== "missing-meta-before-write");
		if (visibleReasons.length > 0) deps.logger.warn(`Config write anomaly: ${configPath} (${visibleReasons.join(", ")})`);
	};
	const auditRecordBase = createConfigWriteAuditRecordBase({
		configPath,
		env: deps.env,
		existsBefore: snapshot.exists,
		previousHash: previousHash ?? null,
		nextHash,
		previousBytes,
		nextBytes,
		previousMetadata: resolveConfigStatMetadata(previousStat),
		changedPathCount,
		changedPaths: [...changedPaths],
		origin: options.auditOrigin,
		hasMetaBefore,
		hasMetaAfter,
		gatewayModeBefore,
		gatewayModeAfter,
		suspicious: suspiciousReasons
	});
	const appendWriteAudit = async (result, error, nextStat) => {
		options.assertConfigPathForWrite?.();
		await appendConfigAuditRecord({
			env: deps.env,
			homedir: deps.homedir,
			record: finalizeConfigWriteAuditRecord({
				base: auditRecordBase,
				result,
				err: error,
				nextMetadata: resolveConfigStatMetadata(nextStat ?? null)
			})
		});
	};
	const blockingReasons = resolveConfigWriteBlockingReasons(suspiciousReasons, options);
	if (blockingReasons.length > 0 && options.allowDestructiveWrite !== true) {
		const rejectedPath = `${configPath}.rejected.${formatConfigArtifactTimestamp((/* @__PURE__ */ new Date()).toISOString())}`;
		options.assertConfigPathForWrite?.();
		const rejectedSave = await deps.fs.promises.writeFile(rejectedPath, json, {
			encoding: "utf-8",
			mode: 384,
			flag: "wx"
		}).then(ok, err);
		const saveDetail = rejectedSave.ok ? `Rejected payload saved to ${rejectedPath}.` : `Rejected payload could not be saved to ${rejectedPath}: ${formatErrorMessage(rejectedSave.error)}.`;
		const message = `Config write rejected: ${configPath} (${blockingReasons.join(", ")}). ${saveDetail}`;
		const error = Object.assign(new Error(message), {
			code: "CONFIG_WRITE_REJECTED",
			...rejectedSave.ok ? { rejectedPath } : {},
			reasons: blockingReasons
		});
		deps.logger.warn(message);
		await appendWriteAudit("rejected", error);
		throw error;
	}
	await (options.preCommitRuntimePreflight ?? (async (sourceConfig) => {
		await preflightRuntimeSnapshotWrite({
			nextSourceConfig: sourceConfig,
			refreshOptions: options.runtimeRefresh,
			formatRefreshError: (error) => formatErrorMessage(error),
			createRefreshError: (detail, cause) => new ConfigRuntimeRefreshError(`Config write blocked before committing ${configPath}: active SecretRef resolution failed: ${detail}`, { cause })
		});
	}))(sourceConfigForPreflight);
	const publication = { phase: "unpublished" };
	let restoreFile;
	let rollbackStatus = "not-restored";
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			options.assertConfigPathForWrite?.();
			if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
			options.assertConfigPathForWrite?.();
			await cronOwnerRefusal?.recheck();
			options.assertConfigPathForWrite?.();
			warnIfJSON5CommentsWillBeStripped({
				raw: snapshot.raw,
				filePath: configPath,
				warn: (message) => deps.logger.warn(message),
				skipOutputLogs: options.skipOutputLogs
			});
			const writeGuard = createConfigFileWriteGuard(configPath, deps.fs, options.assertConfigPathForWrite, {
				snapshot,
				includeGraph: {
					hashes: includeFileHashes,
					targets: includeFileTargets
				},
				onRootRemoved: () => {
					publication.phase = "removed";
				},
				onRootPublished: () => {
					publication.phase = "published";
				}
			});
			restoreFile = (assertCurrent) => rollbackConfigFileWriteIfUnchanged({
				configPath,
				previousSnapshot: snapshot,
				committedHash: publication.phase === "removed" ? hashConfigRaw(null) : nextHash,
				fsModule: deps.fs,
				...writeGuard.captureRollbackProof(assertCurrent),
				withPublication: (publish, didMutate) => withDeferredPluginConfigRollback({
					configPath,
					env: deps.env,
					assertCurrent
				}, publish, didMutate)
			});
			const preparedFile = _usingCtx$1.a(await prepareConfigFileWrite({
				configPath,
				content: json,
				previousRaw: snapshot.raw,
				fsModule: writeGuard.fileSystem,
				assertCurrent: writeGuard.assertCurrent,
				assertBeforeMutation: writeGuard.assertBeforeMutation,
				onDestinationState: writeGuard.onDestinationState
			}));
			await options.beforeCommit?.();
			const result = withDeferredPluginMigrationsCurrent({
				env: deps.env,
				configPath,
				expectedPending: deferredPluginMigrations
			}, () => {
				const published = preparedFile.publish();
				publication.phase = "published";
				return published;
			});
			options.assertConfigPathForWrite?.();
			publication.phase = "accepted";
			recordUpdateDoctorConfigWrite(configPath, previousHash, nextHash, snapshot.parsed, json);
			try {
				recordConfigWriteMetadata();
			} catch (error) {
				deps.logger.warn(`Config metadata state update failed: ${formatErrorMessage(error)}`);
			}
			logConfigOverwrite();
			logConfigWriteAnomalies();
			await appendWriteAudit(result.method, void 0, await deps.fs.promises.stat(configPath).catch(() => null));
			options.assertConfigPathForWrite?.();
			if (configSnapshotAuditRecordMatchesPath(priorSnapshotAuditRecord, configPath) && priorSnapshotAuditRecord.rawHash !== previousHash) {
				const offlineChangedPaths = /* @__PURE__ */ new Set();
				collectChangedPaths(priorSnapshotAuditRecord.fingerprintedAuthoredConfig, fingerprintConfigSnapshotAuthoredConfig(snapshot.parsed, {
					env: deps.env,
					homedir: deps.homedir
				}), "", offlineChangedPaths);
				await appendConfigAuditRecord({
					env: deps.env,
					homedir: deps.homedir,
					record: {
						ts: (/* @__PURE__ */ new Date()).toISOString(),
						source: "config-io",
						event: "config.external",
						detectedBy: "write",
						configPath,
						previousHash: priorSnapshotAuditRecord.rawHash,
						nextHash: previousHash ?? null,
						valid: snapshot.valid,
						...snapshot.valid ? offlineChangedPaths.size > 0 ? { changedPaths: capConfigAuditPaths([...offlineChangedPaths]) } : { opaqueChange: true } : { issues: capConfigAuditIssues(formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true })) }
					}
				});
			}
			options.assertConfigPathForWrite?.();
			const writtenSnapshotAuditRecord = await upsertConfigSnapshotAuditRecordAsync({
				env: deps.env,
				homedir: deps.homedir,
				configPath,
				rawHash: nextHash,
				authoredConfig: stampedOutputConfig,
				expectedSnapshot: priorSnapshotAuditRecord
			}, options.assertConfigPathForWrite);
			options.assertConfigPathForWrite?.();
			if (!options.skipPluginValidation) logConfigWarningsOnce({
				configPath,
				warnings: validated.warnings,
				logger: deps.logger
			});
			if (clearedSessionStoreOwner && !options.skipOutputLogs) deps.logger.warn("Cleared agents.defaults.sessionStore.agentId because session.store changed. Set that owner path explicitly to assign the destination store's owner.");
			setDeferredPluginMigrationConfigFacts(sourceConfigForPreflight, deferredPluginMigrations);
			return {
				persistedHash: nextHash,
				persistedConfig: stampedOutputConfig,
				persistedSourceConfig: sourceConfigForPreflight,
				[configWriteCommittedSnapshot]: {
					hash: committedRevision,
					sourceConfig: sourceConfigForPreflight
				},
				[configWritePostCommitRollback]: {
					restoreFile,
					restoreEffects: async (assertCurrent) => {
						assertCurrent();
						await restoreConfigSnapshotAuditRecordAsync({
							env: deps.env,
							homedir: deps.homedir,
							snapshot: priorSnapshotAuditRecord,
							expectedSnapshot: writtenSnapshotAuditRecord
						}, assertCurrent);
						assertCurrent();
						if (previousWarningFingerprint === void 0) loggedConfigWarningFingerprints.delete(configPath);
						else setBoundedConfigIoWarningEntry(loggedConfigWarningFingerprints, configPath, previousWarningFingerprint);
					}
				}
			};
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (error) {
		let failure = error;
		if (restoreFile && (publication.phase === "removed" || publication.phase === "published")) try {
			rollbackStatus = await restoreFile(() => sourceGuard?.()) ? "restored" : "not-restored";
		} catch (rollbackError) {
			rollbackStatus = "unknown";
			failure = new AggregateError([error, rollbackError], `${formatErrorMessage(error)} Recovery failed: ${formatErrorMessage(rollbackError)}`);
		}
		try {
			try {
				sourceGuard?.();
			} catch (ownershipError) {
				if (ownershipError === error) throw error;
				throw new AggregateError([error, ownershipError], `Config write failed after source ownership changed: ${formatErrorMessage(error)}`, { cause: ownershipError });
			}
			try {
				writeOptions.assertConfigPathForWrite?.();
			} catch {
				throw error;
			}
			try {
				await appendWriteAudit("failed", error);
			} catch (auditError) {
				throw new AggregateError([error, auditError], `${formatErrorMessage(error)} Failure auditing failed: ${formatErrorMessage(auditError)}`, { cause: auditError });
			}
		} catch (failureDuringAudit) {
			failure = failureDuringAudit;
		}
		if (publication.phase === "unpublished") throw failure;
		throw new ConfigWritePostCommitError({
			configPath,
			rollbackStatus,
			cause: failure,
			publication: publication.phase === "removed" ? "partial" : "complete"
		});
	}
}
//#endregion
export { writeConfigFileFromContext as t };
