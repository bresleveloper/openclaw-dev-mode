import { c as isVitestRuntimeEnv } from "./env-DbG527wb.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as isVerbose } from "./global-state-BAD7XgmL.mjs";
import { o as createConfigRuntimeEnvBase, r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { h as preflightRuntimeSnapshotWrite } from "./runtime-snapshot-BBYDJbw9.mjs";
import { h as setConfigResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { a as hashConfigRevision, h as restoreAuthoredTildePathsForWrite, i as hashConfigRaw, m as resolveGatewayMode, n as containsConfigIncludeDirective, r as hasConfigMeta, u as resolveConfigForRead } from "./io.read-helpers-KYk5dB53.mjs";
import { n as formatConfigIssueLines } from "./issue-format-Cu1pIc3h.mjs";
import { _ as configSnapshotAuditRecordMatchesPath, a as capConfigAuditIssues, b as restoreConfigSnapshotAuditRecordAsync, d as finalizeConfigWriteAuditRecord, f as formatConfigOverwriteLogMessage, i as appendConfigAuditRecord, l as createConfigWriteAuditRecordBase, o as capConfigAuditPaths, v as fingerprintConfigSnapshotAuthoredConfig, x as upsertConfigSnapshotAuditRecordAsync, y as readLatestConfigSnapshotAuditRecordAsync } from "./io.audit-CCHda99t.mjs";
import { S as setBoundedConfigIoWarningEntry, _ as resolveConfigWriteBlockingReasons, a as logConfigWarningsOnce, b as loggedConfigWarningFingerprints, c as assertBaseSnapshotStillCurrent, g as resolveConfigStatMetadata, h as resolveConfigSizeBaselineBytes, m as formatConfigArtifactTimestamp, p as createConfigFileWriteGuard, s as warnIfJSON5CommentsWillBeStripped, t as captureConfigWriteLockGuard, v as resolveConfigWriteSuspiciousReasons, y as rollbackConfigFileWriteIfUnchanged } from "./write-lock-BlX1pI0w.mjs";
import { t as readExistingStateRootMode } from "./private-dir-mode-BBICrnrB.mjs";
import { a as stampConfigWriteMetadata, i as recordConfigWriteMetadata, r as projectWebhookMigrationIncludeWrite } from "./io.meta-B0rmlrR1.mjs";
import { t as bindConfigWriteLockGuard } from "./write-authority-BQPo8rSc.mjs";
import { m as withDeferredPluginMigrationsCurrent, p as withDeferredPluginConfigRollback } from "./deferred-plugin-migrations-CSwavNpj.mjs";
import { a as preserveDeferredPluginMigrationConfig, c as setDeferredPluginMigrationConfigFacts, l as applyUnsetPathsForWrite, o as readConfigWriteMigrationFacts, u as resolveManagedUnsetPathsForWrite } from "./deferred-plugin-migration-config-Cc7gzBuJ.mjs";
import { i as resolveKeyedAgentEntryIncludePreservation } from "./include-write-boundary-C8YkLUfy.mjs";
import { r as validateConfigObjectRawWithPlugins } from "./validation-gzn6Bd6i.mjs";
import { r as initializeNativeSessionCatalogPreferences } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { m as getUpdateDoctorConfigWriteAuthority, s as assertUpdateDoctorConfigInputHash, v as recordUpdateDoctorConfigWrite } from "./update-doctor-result-oZ38327j.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-BBJ5cpXU.mjs";
import { n as configWriteCommittedSnapshot, r as configWritePostCommitRollback, t as ConfigRuntimeRefreshError } from "./io.types-BryqPXkC.mjs";
import { i as createConfigWriteSafetyRejectionError, r as createConfigValidationFailedError, t as ConfigWritePostCommitError } from "./io.write-errors-BBNhGTcQ.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-D-eANYlX.mjs";
import { a as resolvePersistCandidateForWrite, t as injectExplicitlySetPaths } from "./io.write-prepare-BqmTkDyF.mjs";
import { n as prepareConfigFileWrite } from "./backup-rotation-BJBdiSUE.mjs";
import { t as rejectConfigNonFiniteNumbers } from "./value-tree-3oLf9xok.mjs";
import { n as assertAgentDeletionTargetsUnchanged } from "./agent-workspace-roster-transition-Db3DDtpa.mjs";
import { i as resolveCronJobsStorePathFromConfigAsync } from "./paths-C7jZRDkL.mjs";
import "./store-HF7PvtRl.mjs";
import { n as collectConfigWriteChangedPaths, t as collectChangedPaths } from "./config-change-paths-qjN4mYbV.mjs";
import { t as prepareConfigWriteTopology } from "./io.write-topology-BN3WkKzC.mjs";
import { r as prepareCronOwnerWriteRefusal } from "./io.cron-owner-refusal-DQsCD4nO.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/config/io.write.ts
async function writeConfigFileFromContext(context, cfg, writeOptions, readSnapshot) {
	const { deps, configPath, options: ioOptions } = context;
	const sourceGuard = captureConfigWriteLockGuard(configPath);
	const doctorAuthority = getUpdateDoctorConfigWriteAuthority(configPath);
	let options = bindConfigWriteLockGuard(writeOptions, sourceGuard);
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
	const pendingMigrations = await readConfigWriteMigrationFacts(snapshot, deps.env, ioOptions);
	const configForWrite = preserveDeferredPluginMigrationConfig({
		sourceConfig: snapshot.sourceConfig,
		nextConfig: cfg,
		pending: pendingMigrations ?? [],
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
	const { nextConfig, clearedSessionStoreOwner, authoredConfig, authoredSourceConfig, authoredRuntimeConfig, explicitSetPaths, explicitSetValueSource, persistCanonicalAgentRoster, preserveLegacyAgentRoster, cronOwner } = await prepareConfigWriteTopology({
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
		storePath: await resolveCronJobsStorePathFromConfigAsync(nextConfig, deps.env),
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
			deferredPluginMigrations: pendingMigrations
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
	const tildeRestoredOutputConfig = restoreAuthoredTildePathsForWrite(persistCandidate, snapshot.parsed, void 0, deps.homedir());
	const stampedOutputConfig = stampConfigWriteMetadata(preserveDeferredPluginMigrationConfig({
		sourceConfig: snapshot.parsed,
		nextConfig: applyUnsetPathsForWrite(tildeRestoredOutputConfig, unsetPaths),
		pending: pendingMigrations ?? [],
		writeOptions: { unsetPaths: options.unsetPaths }
	}), options.lastTouchedVersionOverride, void 0, deps.env);
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
		hasMetaAfter: hasConfigMeta(stampedOutputConfig),
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
		const diagnosticMessage = `Config write rejected: ${configPath} (${blockingReasons.join(", ")}). ${saveDetail}`;
		const diagnosticError = Object.assign(new Error(diagnosticMessage), {
			code: "CONFIG_WRITE_REJECTED",
			...rejectedSave.ok ? { rejectedPath } : {},
			reasons: blockingReasons
		});
		const userFacingError = createConfigWriteSafetyRejectionError({
			reasons: blockingReasons,
			...rejectedSave.ok ? { rejectedPath } : {}
		});
		deps.logger.warn(diagnosticMessage);
		await appendWriteAudit("rejected", diagnosticError);
		throw userFacingError;
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
	const stateDirectory = {
		path: resolveStateDir(deps.env, deps.homedir),
		warn: (message) => deps.logger.warn(message)
	};
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
				stateDirectory,
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
				stateDirectory,
				...writeGuard.captureRollbackProof(assertCurrent),
				withPublication: (publish, didMutate) => withDeferredPluginConfigRollback({
					configPath,
					env: deps.env,
					assertCurrent
				}, publish, didMutate)
			});
			const preparedFile = _usingCtx$1.a(await prepareConfigFileWrite({
				configPath,
				dirMode: readExistingStateRootMode(path.dirname(configPath), stateDirectory.path, deps.fs),
				content: json,
				previousRaw: snapshot.raw,
				fsModule: writeGuard.fileSystem,
				assertCurrent: writeGuard.assertCurrent,
				assertBeforeMutation: writeGuard.assertBeforeMutation,
				onDestinationState: writeGuard.onDestinationState
			}));
			await assertAgentDeletionTargetsUnchanged(snapshot.config, sourceConfigForPreflight, deps.env);
			await options.beforeCommit?.();
			const result = withDeferredPluginMigrationsCurrent({
				env: deps.env,
				configPath,
				expectedPending: pendingMigrations
			}, () => {
				options.assertBeforePublish?.();
				const published = preparedFile.publish();
				publication.phase = "published";
				return published;
			});
			options.assertConfigPathForWrite?.();
			publication.phase = "accepted";
			recordUpdateDoctorConfigWrite(configPath, previousHash, nextHash, snapshot.parsed, json);
			try {
				await recordConfigWriteMetadata();
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
			setDeferredPluginMigrationConfigFacts(sourceConfigForPreflight, pendingMigrations);
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
