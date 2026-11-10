import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CPodxfi3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as registerSignalExitGate } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { d as writeJson, o as readJsonIfExists } from "./json-files-DYmSFHoN.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { _ as ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV, r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { a as createSqliteLifecycleAggregateError, i as SqliteCoordinatorError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as hasActiveGatewayStateOwner } from "./gateway-state-owner-X3EqhtYx.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { h as prepareOpenClawStateDatabaseRemoval, l as closeOpenClawStateDatabaseByPathAsync } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as isUnfencedUpdateDriver } from "./openclaw-state-schema-publication-C2fzjU88.mjs";
import { o as resolveExecutablePath } from "./executable-path-hXcbMo0b.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { d as setPluginInstallRecordMapEntry, i as copyPluginInstallRecordMap, l as parsePluginInstallRecordMap, u as serializePluginInstallRecordMap } from "./installed-plugin-index-row-B-2QiBMA.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-l0GQCX9n.mjs";
import { n as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-BZAiJgsR.mjs";
import { d as resolveConfigIncludesForRead, i as hashConfigRaw, o as normalizeConfigIoDeps, u as resolveConfigForRead } from "./io.read-helpers-KYk5dB53.mjs";
import { l as assertConfigFileWritePathSnapshot } from "./write-lock-BlX1pI0w.mjs";
import { t as readExistingStateRootMode } from "./private-dir-mode-BBICrnrB.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { n as UpdateFailureFactSchema } from "./update-run-schema-CY2FAM7T.mjs";
import { c as redactSupportString } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { f as isVerifiedUpdateRollback, s as classifyUpdateOutcome } from "./update-outcome-DLbo5ecI.mjs";
import { a as ServiceStartRefusalError, l as hasGatewayServiceStopUnsafeError, s as findServiceOwnershipRefusal } from "./service-inspection-error-ozNMOrIE.mjs";
import { t as unsafeUpdateRecovery } from "./update-recovery-BLzKrbsf.mjs";
import { a as normalizeUpdateFailureFacts } from "./update-failure-facts-3t5Fm3wV.mjs";
import { a as UpdateDoctorDeferredInspectionCheckIdsSchema, h as normalizeUpdatePostInstallDoctorWarnings, i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, l as collectUpdateDoctorFailureFacts, t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-BWNEWHjx.mjs";
import { t as createManagedHandoffProcessIdentityReader } from "./update-managed-service-handoff-process-BULCClsA.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import { i as formatCommandResult, r as formatCommandOutput } from "./command-error-B2V3e5UN.mjs";
import { c as withConfigMutationLock } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import { a as runUtf8CommandWithTimeout, n as runExec } from "./exec-Bf6uhUA7.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { a as restorePersistedInstalledPluginIndexIfCurrent } from "./installed-plugin-index-store-write-DkjTb01T.mjs";
import { a as writePersistedInstalledPluginIndexInstallRecordsWithLease } from "./installed-plugin-index-records-DTzp62mN.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-Drh-C246.mjs";
import "./gateway-shutdown-budget-c8dOC7fR.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { s as resolveManagedGatewayServiceProcessEnv } from "./service-types-CPk6CBn6.mjs";
import { n as GatewayServiceAuthorityError } from "./service-update-authority-Ddw1lcTH.mjs";
import { r as acquireGatewayLock } from "./gateway-lock-OT1e72lx.mjs";
import { a as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CiE2knkN.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-Bbz3m70g.mjs";
import { a as POST_CORE_UPDATE_RESULT_PATH_ENV, c as buildPostCoreHandoffEnv, n as POST_CORE_UPDATE_ENV, o as POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV, r as POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV, s as POST_CORE_UPDATE_STARTED_AT_ENV, t as POST_CORE_UPDATE_CHANNEL_ENV } from "./update-post-core-context-D3kte0je.mjs";
import { n as updateInstallRootsMatch, t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { i as readGitRuntimeArtifactIdentity } from "./update-git-runtime-S2Kgafdv.mjs";
import { i as reportUpdateStepCompletion } from "./update-runner-command-DETznIV7.mjs";
import { i as isUpdateGatewayReadinessPending, o as updateRunStepsFromResultStep } from "./update-run-step-Db60sdKj.mjs";
import { n as compareSemverStrings } from "./update-check-hpRujh0z.mjs";
import { a as UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV, c as UPDATE_POST_CORE_CONVERGENCE_ENV, d as isUpdateDoctorInspectionReportMode, o as UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV, r as UPDATE_IN_PROGRESS_ENV, s as UPDATE_POST_ACTIVATION_INSPECTIONS_REPORT_MODE } from "./update-phase-M5rvMZiC.mjs";
import { f as recordUpdateRunStep } from "./update-run-ledger-C3oL-g8r.mjs";
import { a as getUpdateRunAsync, i as getUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
import { a as parseUpdateDoctorLintReport } from "./update-doctor-lint-BSXy6tAC.mjs";
import { r as sanitizeTriageUpdateFailure } from "./triage-update-YKF7SYYY.mjs";
import { u as writeUpdateRunReportArtifact } from "./update-failure-report-artifact-ZpnzvCW7.mjs";
import { i as createManagedUpdateRequesterContinuationAuthority, o as resolveManagedUpdateRequester, r as createManagedUpdateRequesterAuthority, t as UpdateRequesterRevokedError } from "./update-requester-authority-BP771TSP.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { f as withUpdateCommandExecutorChild, m as UpdateCommandRecoveryPendingError, o as captureUpdateCommandExecutorAuthority, t as withUpdateCommandExecutor } from "./update-command-executor-DUq8yLzH.mjs";
import { a as buildControlPlaneUpdateRestartHealthPendingResult, c as readControlPlaneUpdateSentinelMeta, f as normalizeControlPlaneUpdateResult, i as UPDATE_RUN_ID_ENV, l as resolveManagedServiceUpdateFailureExitCode, n as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { c as supportsPostCoreExecutor } from "./package-update-activation-Bm88ttku.mjs";
import { c as parseUpdateTimeoutMs } from "./shared-DRiGAorf.mjs";
import { t as createUpdateCommandAuthority } from "./update-command-authority-BUaM9lV-.mjs";
import { a as preparePostCorePluginConfig, c as readUpdateConfigFileSnapshot, i as persistValidatedDowngradeConfig, o as readPostCorePreUpdateSourceConfig, t as capturePreUpdateSourceConfig, u as writePostCoreSourceConfigFile } from "./update-command-config-CDBhVGHw.mjs";
import { i as releaseLegacySourceLock, n as settleUpdateDoctorMaintenance, r as completeSourceUpdateRuntime, t as updatePluginsAfterCoreUpdate } from "./update-command-plugins-Dus0-ODD.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
import { c as stripGatewayServiceMarkerEnv, i as resolveServiceRefreshEnv, l as withOwnedManagedUpdateEnv, t as disableUpdatedPackageCompileCacheEnv, u as withUpdateEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { a as recordUpdateRunPhaseAsync, o as recordUpdateRunStepAsync } from "./update-run-write.async-c2y7GgO-.mjs";
import { l as parkForegroundUpdateForActivation, n as maybeStopManagedServiceBeforeMutableUpdate, t as createWindowsTaskAutoStartGuard } from "./update-command-service-maintenance-DvLJF4Bi.mjs";
import { f as resolveGatewayServiceManagementBlockMessageForUpdate, m as resolveUpdatedGatewayRestartPort, n as GatewayServiceUpdateOwnershipError, s as isGatewayServiceManagementAllowedForUpdate, u as readGatewayServiceStateForUpdate } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { i as revalidateManagedGatewayServiceAfterUpdate } from "./update-command-service-publication-Cwq6T0wO.mjs";
import { a as admitInstalledGatewayRecovery, h as isPackageManagerUpdateMode, l as refuseUnsettledDoctorRecovery, m as GatewayRestartHealthError, o as compensateOriginalManagedService, s as maybeRestartServiceAfterFailedMutableUpdate } from "./update-command-verification-D_6SIpZK.mjs";
import { n as retainCurrentDeferredPluginMigrationWarnings } from "./deferred-plugin-migration-warnings-DinUPp8o.mjs";
import { t as hasDeferredUpdateModelRetirement } from "./update-deferred-model-retirement-BmVkte5n.mjs";
import { c as readUpdateStateSchemaVersions, f as updateStateSchemaVersionsMatch, u as resolveUpdateStateContentVersion } from "./update-candidate-state-fXM6fMqw.mjs";
import { r as readUpdateConfigSnapshot } from "./update-command-config-snapshot-tEb-vXUT.mjs";
import { n as runUpdateFinalizationDoctorInFreshProcess, t as completePostCorePluginUpdate } from "./update-command-fresh-doctor-DXWT_dIj.mjs";
import { a as collectPostCorePluginFailureFacts, i as collectPostCorePluginAdvisories, s as createPostCorePluginUpdateResult, t as appendPluginUpdateWarnings } from "./update-command-plugins-internals-DW5z56RP.mjs";
import { n as recordPostCoreUpdateEvidence } from "./update-run-interruption-DoE7kEcq.mjs";
import { t as readPackageUpdateIdentity } from "./update-command-package-identity-DsYk7vPy.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-CPjoG803.mjs";
import { n as verifyUpdateFailureRecovery, t as shouldWaitForRecovery } from "./update-command-failure-recovery-q7GBNmzj.mjs";
import { r as classifyDoctorMaintenanceRefusal } from "./doctor-maintenance-inspection-D2Lw5Rm3.mjs";
import { i as assertUpdateCommandPackageFinalization, n as retireStandaloneGitWrapper, o as assertUpdateCommandRecoveryState, s as createUpdateCommandFinalizationFence } from "./update-command-git-BFD7pJNr.mjs";
import { o as NativePackageRollbackError } from "./package-update-steps-CyYbYiYK.mjs";
import { b as withUpdateStateRead, f as prepareUpdateServiceResult, g as recordUpdateResultNextAction, i as UpdateCommandPendingRecoveryFailure, l as isUpdateStateReadContention, n as UpdateCommandFailure, p as recordServiceReconciliationWarning, u as markControlPlaneUpdateRestartSentinelFailureBestEffort, x as writeControlPlaneUpdateRestartSentinelBestEffort } from "./update-command-result-BgqRj9_Z.mjs";
import { a as retainMutableUpdateSignalWrite, i as recordMutableUpdateSignalPhase, n as captureMutableUpdateCompensation, r as recordMutableUpdateInterruption, s as withMutableUpdateForwardScope } from "./update-command-mutable-signals-D0wsAuNf.mjs";
import { i as readUpdateCandidateSource, o as maybeRestartService, s as tryInstallShellCompletion } from "./update-command-managed-context-CxkSVUSh.mjs";
import { a as recordUpdatePackageCompletion, c as resolveSettledUpdateCommandResult, i as publishUpdateCommandTerminalResult, t as deferUpdateCommandTerminalResult, u as captureUpdateCommandTerminalRecord } from "./update-command-terminal-CPGdOHR-.mjs";
import { n as restoreGatewayServiceDefinitionBackup, r as verifyGatewayServiceDefinitionBackup } from "./service-definition-backup-C9r4K70t.mjs";
import { n as createUpdateDatabaseBackup } from "./update-database-backup-aeI_iiyz.mjs";
import { t as restoreUpdateDatabaseBackup } from "./update-database-restore-CntdXaR8.mjs";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { isDeepStrictEqual, stripVTControlCharacters } from "node:util";
import { spawn } from "node:child_process";
import { replaceFileAtomic } from "@openclaw/fs-safe/atomic";
//#region src/infra/update-timeout-provenance.ts
/** Keep a compatibility allowance for shipped receivers and retain the caller's intent. */
function createUpdateTimeoutHandoff(operatorTimeout, fallbackTimeoutMs) {
	return {
		completionOwner: "parent",
		timeout: {
			version: 1,
			serialized: operatorTimeout ?? String(Math.ceil(fallbackTimeoutMs / 1e3)),
			operator: operatorTimeout ?? null
		}
	};
}
/** Unknown or mismatched private input cannot remove a shipped caller's deadline. */
function isOmittedUpdateTimeout(serialized, handoff) {
	if (!serialized || !parseStrictPositiveInteger(serialized) || !isRecord(handoff)) return false;
	const timeout = handoff.timeout;
	return handoff.completionOwner === "parent" && isRecord(timeout) && timeout.version === 1 && timeout.operator === null && timeout.serialized === serialized;
}
//#endregion
//#region src/cli/update-cli/update-command-post-core.ts
const POST_CORE_UPDATE_RESULT_POLL_MS = 100;
const POST_CORE_UPDATE_STOP_GRACE_MS = 1e3;
const POST_CORE_CONFIG_WRITER_MIN_VERSION = "2026.4.29";
/** Restore operator intent only when the private handoff matches this child command. */
async function resolvePostCoreUpdateHandoff(params) {
	const handoff = params.resultPath ? await readJsonIfExists(path.join(path.dirname(params.resultPath), "handoff.json")) : void 0;
	let opts = typeof handoff?.sourceRuntimePrepared === "boolean" ? {
		...params.opts,
		sourceRuntimePrepared: handoff.sourceRuntimePrepared
	} : params.opts;
	if (opts.timeout !== void 0 && isOmittedUpdateTimeout(opts.timeout, handoff)) opts = {
		...opts,
		timeout: void 0
	};
	return {
		opts,
		parentOwnsCompletion: handoff?.completionOwner === "parent"
	};
}
async function writePostCoreUpdateFailureFile(filePath, error) {
	if (filePath) {
		const failureFacts = collectUpdateDoctorFailureFacts(error);
		const failure = sanitizeTriageUpdateFailure({ error: formatErrorMessage(error) }, {
			env: process.env,
			stateDir: resolveStateDir()
		});
		await writeJson(filePath, {
			status: "failed",
			error: failure.error,
			...failureFacts.length ? { failureFacts } : {}
		}, {
			trailingNewline: true,
			dirMode: 448
		});
	}
}
async function writePostCorePluginUpdateResultFile(filePath, result) {
	if (!filePath) return;
	await writeJson(filePath, result, {
		trailingNewline: true,
		dirMode: 448
	});
}
/** @internal exported for focused handoff contract tests. */
async function writePostCorePluginInstallRecordsFile(filePath, records) {
	await fs$1.writeFile(filePath, `${serializePluginInstallRecordMap(records)}\n`, "utf-8");
}
async function readPostCorePluginInstallRecordsFile(filePath) {
	if (!filePath) return;
	const handoffError = (message, cause) => new Error(`${message}: ${filePath}. Run openclaw doctor to inspect and repair plugin installation state.`, { cause });
	let raw;
	try {
		raw = await fs$1.readFile(filePath, "utf-8");
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT")) return;
		throw handoffError("Unable to read plugin install records file", err);
	}
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw handoffError("Malformed JSON in plugin install records file", err);
	}
	try {
		const records = parsePluginInstallRecordMap(parsed);
		if (!records) throw new Error("Invalid plugin install record map");
		return records;
	} catch (err) {
		throw handoffError("Invalid plugin install records in handoff file", err);
	}
}
async function readPostCoreUpdateResultFile(filePath) {
	try {
		const parsed = await readJsonIfExists(filePath);
		if (parsed?.status === "failed" && typeof parsed.error === "string") {
			const facts = UpdateFailureFactSchema.array().safeParse(parsed.failureFacts);
			return {
				status: "failed",
				error: parsed.error,
				...facts.success && facts.data.length ? { failureFacts: normalizeUpdateFailureFacts(facts.data) } : {}
			};
		}
		if (parsed && typeof parsed === "object" && (parsed.status === "ok" || parsed.status === "warning" || parsed.status === "skipped" || parsed.status === "error")) return parsed;
	} catch {
		return;
	}
}
async function stopPostCoreUpdateChild(child) {
	if (process.platform === "win32" && child.pid) try {
		await runExec(getWindowsSystem32ExePath("taskkill.exe"), [
			"/PID",
			String(child.pid),
			"/T",
			"/F"
		], {
			logOutput: false,
			timeoutMs: 5e3
		});
		return;
	} catch {}
	child.kill();
}
/** @internal exported for focused handoff contract tests. */
function preparePostCorePluginInstallRecordsForFreshProcess(params) {
	if (!params.targetVersion) return params.records;
	const runtimeComparison = compareSemverStrings(VERSION, params.targetVersion);
	if (runtimeComparison === null || runtimeComparison <= 0) return params.records;
	let next;
	for (const [pluginId, record] of Object.entries(params.records)) {
		const installedVersion = record.resolvedVersion ?? record.version;
		const comparison = installedVersion ? compareSemverStrings(installedVersion, params.targetVersion) : null;
		if (record.source !== "npm" || comparison === null || comparison <= 0) continue;
		const { resolvedSpec: _resolvedSpec, resolvedVersion: _resolvedVersion, ...rest } = record;
		next ??= copyPluginInstallRecordMap(params.records);
		setPluginInstallRecordMapEntry(next, pluginId, rest);
	}
	return next ?? params.records;
}
async function continuePostCoreUpdateInFreshProcess(params) {
	const authority = createUpdateCommandAuthority({ opts: params.opts }, "Post-core update");
	authority.assertCurrent();
	const entryPath = await resolveGatewayInstallEntrypoint(params.root);
	authority.assertCurrent();
	if (!entryPath) return { resumed: false };
	const selectedNode = resolveExecutablePath(params.nodeRunner ?? resolveNodeRunner(), { useCache: false });
	if (!selectedNode) throw new Error("The selected Node executable is unavailable for post-core update.");
	const nodeRunner = await fs$1.realpath(selectedNode);
	authority.assertCurrent();
	const delegated = await supportsPostCoreExecutor(params.root, nodeRunner);
	authority.assertCurrent();
	if (delegated && (!authority.executorFence || !authority.runId)) throw new UpdateCommandRecoveryPendingError("Post-core update requires its live executor.");
	const baseEnv = stripGatewayServiceMarkerEnv(disableUpdatedPackageCompileCacheEnv(process.env));
	if (!delegated && params.opts.acceptCapabilities) {
		const { stdout } = await runExec(nodeRunner, [
			entryPath,
			"update",
			"--help"
		], {
			baseEnv,
			logOutput: false,
			timeoutMs: params.timeoutMs
		});
		authority.assertCurrent();
		if (!/^[\t ]*--accept-capabilities(?:[\t ]|$)/m.test(stripVTControlCharacters(stdout))) return { resumed: false };
	}
	const argv = [
		entryPath,
		"update",
		...params.opts.json ? ["--json"] : [],
		...params.opts.restart === false ? ["--no-restart"] : [],
		...params.opts.yes ? ["--yes"] : [],
		...params.opts.acceptCapabilities ? ["--accept-capabilities"] : []
	];
	const handoff = {
		...createUpdateTimeoutHandoff(params.opts.timeout, params.timeoutMs),
		sourceRuntimePrepared: params.sourceRuntimePrepared
	};
	const serializedTimeout = handoff.timeout.serialized;
	argv.push("--timeout", serializedTimeout);
	const resultDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-update-post-core-"));
	const resultPath = path.join(resultDir, "plugins.json");
	const installRecordsPath = path.join(resultDir, "plugin-install-records.json");
	const sourceConfigPath = path.join(resultDir, "source-config.json");
	const postCoreHostVersion = await readPackageVersion(params.root);
	authority.assertCurrent();
	const pluginInstallRecords = preparePostCorePluginInstallRecordsForFreshProcess({
		records: params.pluginInstallRecords,
		targetVersion: postCoreHostVersion
	});
	let tentativePluginIndex;
	let childSettled = true;
	const restoreTentativePluginIndex = async () => {
		const tentative = tentativePluginIndex;
		if (!tentative) return;
		authority.assertCurrent();
		await withPluginLifecycleLease({ assertCurrent: authority.assertCurrent }, async (lease) => {
			await restorePersistedInstalledPluginIndexIfCurrent(tentative.previous, tentative.revision, { lease });
		});
		authority.assertCurrent();
		tentativePluginIndex = void 0;
	};
	try {
		if (pluginInstallRecords !== params.pluginInstallRecords) {
			await withPluginLifecycleLease({ assertCurrent: authority.assertCurrent }, async (lease) => {
				tentativePluginIndex = await writePersistedInstalledPluginIndexInstallRecordsWithLease(pluginInstallRecords, {
					...params.preUpdateConfig ? { config: params.preUpdateConfig.sourceConfig } : {},
					lease
				});
			});
			authority.assertCurrent();
		}
		await writePostCorePluginInstallRecordsFile(installRecordsPath, pluginInstallRecords);
		await writePostCoreSourceConfigFile(sourceConfigPath, params.preUpdateConfig);
		await writeJson(path.join(resultDir, "handoff.json"), handoff, { dirMode: 448 });
		const jsonMode = params.opts.json === true;
		const childStdio = process.platform === "win32" || jsonMode ? "pipe" : "inherit";
		const handoffEnv = buildPostCoreHandoffEnv({
			baseEnv,
			compatHostVersion: postCoreHostVersion,
			requestedChannel: params.requestedChannel,
			sourceConfigPath: params.preUpdateConfig ? sourceConfigPath : void 0
		});
		const sentinelMeta = await readControlPlaneUpdateSentinelMeta(baseEnv);
		authority.assertCurrent();
		if (sentinelMeta?.root) {
			const sentinelPath = path.join(resultDir, "sentinel-meta.json");
			const sentinel = {
				version: 1,
				meta: {
					...sentinelMeta,
					root: resolveUpdateInstallRoot(params.root)
				}
			};
			await fs$1.writeFile(sentinelPath, JSON.stringify(sentinel), { mode: 384 });
			handoffEnv[CONTROL_PLANE_UPDATE_SENTINEL_META_ENV] = sentinelPath;
		}
		authority.assertCurrent();
		await releaseLegacySourceLock(params.root, params.opts.run?.sourceArtifactLock);
		const childEnv = {
			...handoffEnv,
			OPENCLAW_UPDATE_IN_PROGRESS: "1",
			...params.opts.run ? { [UPDATE_RUN_ID_ENV]: params.opts.run.runId } : {},
			[POST_CORE_UPDATE_ENV]: "1",
			[POST_CORE_UPDATE_CHANNEL_ENV]: params.channel,
			[POST_CORE_UPDATE_RESULT_PATH_ENV]: resultPath,
			[POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV]: installRecordsPath,
			[POST_CORE_UPDATE_STARTED_AT_ENV]: String(params.updateStartedAtMs)
		};
		authority.assertCurrent();
		if (delegated && authority.executorFence && authority.runId) {
			const { executorFence, runId } = authority;
			const child = await withUpdateCommandExecutorChild(executorFence, params.root, async (executor, bindChild) => {
				const input = {
					executor,
					runId,
					originalRecoveryCapture: params.opts.run?.originalRecoveryCapture,
					root: params.root,
					requester: authority.requester?.requester,
					opts: {
						json: params.opts.json,
						restart: params.opts.restart,
						yes: params.opts.yes,
						acceptCapabilities: params.opts.acceptCapabilities,
						timeout: serializedTimeout
					}
				};
				const result = await runUtf8CommandWithTimeout([
					nodeRunner,
					path.join(params.root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath),
					"--post-core"
				], {
					cwd: params.root,
					baseEnv: {},
					env: childEnv,
					input: JSON.stringify(input),
					beforeInput: (pid, spawnedArgv) => {
						authority.assertRequesterCurrent();
						bindChild(pid, spawnedArgv);
					},
					timeoutMs: params.opts.run?.activationTimeoutMs,
					killProcessTree: true,
					requireProcessTreeExtinction: true,
					maxOutputBytes: 65536,
					outputCapture: "tail",
					onOutputChunk: (chunk, stream) => {
						(stream === "stdout" && !jsonMode ? process.stdout : process.stderr).write(chunk);
					}
				});
				if (result.cleanup === "forced" || result.cleanup === "uncertain") throw new CommandProcessCleanupError();
				return result;
			});
			authority.assertCurrent();
			const result = await readPostCoreUpdateResultFile(resultPath);
			authority.assertCurrent();
			if (!result) {
				if (await fs$1.lstat(`${resultPath}.pending`).catch((error) => {
					if (hasErrnoCode(error, "ENOENT")) return;
					throw error;
				})) throw new CommandProcessCleanupError();
			}
			if (child.code !== 0 || child.termination !== "exit" || !result || result.status === "failed") {
				await restoreTentativePluginIndex();
				return {
					resumed: false,
					exitCode: child.code || 1,
					error: result?.status === "failed" ? result.error : child.stderr || "Post-core update did not confirm completion.",
					...result?.status === "failed" && result.failureFacts ? { failureFacts: result.failureFacts } : {}
				};
			}
			tentativePluginIndex = void 0;
			return {
				resumed: true,
				pluginUpdate: result
			};
		}
		const child = spawn(nodeRunner, argv, {
			cwd: params.root,
			stdio: childStdio,
			env: childEnv
		});
		if (childStdio === "pipe") {
			child.stdout?.pipe(jsonMode ? process.stderr : process.stdout);
			child.stderr?.pipe(process.stderr);
		}
		const childResult = await new Promise((resolve, reject) => {
			let closed = false;
			let exited = false;
			let committed;
			let childError;
			let terminationError;
			let termination = Promise.resolve();
			let forceStop;
			const resultPoll = setInterval(() => {
				readPostCoreUpdateResultFile(resultPath).then((pluginUpdate) => {
					if (closed || exited || committed || childError || !pluginUpdate || pluginUpdate.status === "failed") return;
					committed = pluginUpdate;
					tentativePluginIndex = void 0;
					clearInterval(resultPoll);
					if (process.platform !== "win32") {
						forceStop = setTimeout(() => {
							if (child.exitCode === null && child.signalCode === null) try {
								child.kill("SIGKILL");
							} catch (error) {
								terminationError = error;
							}
						}, POST_CORE_UPDATE_STOP_GRACE_MS);
						forceStop.unref();
					}
					termination = Promise.resolve().then(() => {
						if (!exited) return stopPostCoreUpdateChild(child);
					}).catch((error) => {
						terminationError = error;
					});
				}).catch(() => void 0);
			}, POST_CORE_UPDATE_RESULT_POLL_MS);
			child.once("error", (error) => {
				childError = error;
			});
			child.once("exit", () => {
				exited = true;
				clearInterval(resultPoll);
			});
			child.once("close", (code, signal) => {
				closed = true;
				clearInterval(resultPoll);
				clearTimeout(forceStop);
				termination.then(async () => {
					const finalResult = committed ?? await readPostCoreUpdateResultFile(resultPath);
					if (finalResult && finalResult.status !== "failed") {
						tentativePluginIndex = void 0;
						resolve({
							kind: "plugin-update",
							pluginUpdate: finalResult
						});
					} else if (terminationError) reject(new Error("Post-core writer termination failed", { cause: terminationError }));
					else if (childError) reject(childError);
					else if (signal) reject(/* @__PURE__ */ new Error(`post-update process terminated by signal ${signal}`));
					else resolve({
						kind: "exit",
						exitCode: code ?? 1
					});
				}).catch(reject);
			});
		});
		const postCoreResult = childResult.kind === "plugin-update" ? childResult.pluginUpdate : await readPostCoreUpdateResultFile(resultPath);
		authority.assertCurrent();
		const exitCode = childResult.kind === "exit" ? childResult.exitCode : 0;
		if (postCoreResult?.status === "failed") {
			await restoreTentativePluginIndex();
			return {
				resumed: false,
				exitCode: exitCode || 1,
				error: postCoreResult.error,
				...postCoreResult.failureFacts ? { failureFacts: postCoreResult.failureFacts } : {}
			};
		}
		const pluginUpdate = postCoreResult;
		if (exitCode !== 0 && !pluginUpdate) {
			await restoreTentativePluginIndex();
			return {
				resumed: false,
				exitCode
			};
		}
		return {
			resumed: true,
			...pluginUpdate ? { pluginUpdate } : {}
		};
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) {
			childSettled = false;
			throw error;
		}
		try {
			await restoreTentativePluginIndex();
		} catch (rollbackError) {
			throw new Error("Post-core update failed and could not restore the previous plugin index", { cause: rollbackError });
		}
		throw error;
	} finally {
		if (childSettled) await fs$1.rm(resultDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
}
function shouldResumePostCoreUpdateInFreshProcess(params) {
	const { result } = params;
	if (result.status !== "ok" || params.downgradeRisk && (compareSemverStrings(result.after?.version ?? "", POST_CORE_CONFIG_WRITER_MIN_VERSION) ?? -1) < 0) return false;
	return params.installKindChanged === true || isPackageManagerUpdateMode(result.mode) || result.mode === "git";
}
//#endregion
//#region src/cli/update-cli/update-command-resume.ts
async function resumePostCoreUpdate(params) {
	try {
		const env = { ...process.env };
		const runId = env[UPDATE_RUN_ID_ENV]?.trim();
		let parent;
		let parentError;
		if (runId && !params.opts.run) try {
			parent = createManagedHandoffProcessIdentityReader({ env }).processIdentity(process.ppid);
		} catch (error) {
			parentError = error;
		}
		const { opts, parentOwnsCompletion } = await resolvePostCoreUpdateHandoff({
			opts: params.opts,
			resultPath: process.env[POST_CORE_UPDATE_RESULT_PATH_ENV]
		});
		const resumed = {
			...params,
			opts,
			parentOwnsCompletion
		};
		const record = runId && !params.opts.run && !parentOwnsCompletion ? getUpdateRun(runId, { env }) : void 0;
		if (runId && !params.opts.run && !parentOwnsCompletion && !record) throw new UpdateCommandRecoveryPendingError("Post-core update run is unavailable; resume cannot verify its owner.");
		let completed;
		if (runId && record && isUnfencedUpdateDriver(record.before.version)) {
			if (!parent) throw new UpdateCommandRecoveryPendingError("Legacy package parent identity is unavailable.", { cause: parentError });
			const inPostCore = (current) => current?.status === "running" && current.steps.findLast((entry) => entry.step === "openclaw doctor")?.status === "completed" && current.steps.findLast((entry) => entry.step === "post-update verification")?.status === "in_progress";
			const root = resolveUpdateInstallRoot(params.root);
			const executingRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
			if (!inPostCore(record) || !executingRoot || resolveUpdateInstallRoot(executingRoot) !== root) throw new UpdateCommandRecoveryPendingError("Legacy post-core update does not match its running installation.");
			const meta = await readControlPlaneUpdateSentinelMeta(env);
			const managedHandoff = env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" || Boolean(meta?.handoffId || meta?.root);
			if (meta?.runId && meta.runId !== runId || managedHandoff && (!meta?.runId || !meta.handoffId || !meta.root)) throw new UpdateCommandRecoveryPendingError("Legacy managed post-core handoff is incomplete or names another update run.");
			if (meta?.handoffId && meta.root) {
				const { assertManagedServiceUpdateHandoffRoot } = await import("./update-managed-service-handoff-BSESNMoK.mjs");
				await assertManagedServiceUpdateHandoffRoot({
					expectedRoot: meta.root,
					root,
					executingRoot,
					postCore: true
				});
			}
			completed = await withUpdateCommandExecutor(runId, async (executor) => {
				const fence = await executor.enter(root);
				const requester = resolveManagedUpdateRequester(record.origin.requester);
				const requesterAuthority = requester?.authorizationSource?.startsWith("profile:") ? await createManagedUpdateRequesterContinuationAuthority(requester, {
					runId,
					executor: fence
				}, env) : requester ? await createManagedUpdateRequesterAuthority(requester, env) : void 0;
				fence.assertCurrent();
				const current = getUpdateRun(runId, { env });
				if (!inPostCore(current) || current?.createdAtMs !== record.createdAtMs) throw new UpdateCommandRecoveryPendingError("Legacy post-core update changed during admission.");
				return await resumePostCoreUpdateInternal({
					...resumed,
					opts: {
						...opts,
						run: {
							runId,
							env,
							executorFence: fence,
							...requesterAuthority ? { requesterAuthority } : {}
						}
					}
				});
			}, {
				legacyPackageParent: parent,
				...meta?.handoffId && meta.root ? { legacyPackageHandoff: {
					handoffId: meta.handoffId,
					root: meta.root
				} } : {}
			});
		} else completed = await resumePostCoreUpdateInternal(resumed);
		const { pluginUpdate, result, assertRequesterCurrent } = completed;
		assertRequesterCurrent();
		if (process.env["OPENCLAW_UPDATE_POST_CORE_RESULT_PATH"]) await writePostCorePluginUpdateResultFile(process.env[POST_CORE_UPDATE_RESULT_PATH_ENV], pluginUpdate);
		if (params.opts.json && !process.env["OPENCLAW_UPDATE_POST_CORE_RESULT_PATH"]) defaultRuntime.writeJson(result);
	} catch (error) {
		await writePostCoreUpdateFailureFile(process.env[POST_CORE_UPDATE_RESULT_PATH_ENV], error).catch((writeError) => defaultRuntime.error(`Could not save post-update failure: ${String(writeError)}`));
		throw error;
	}
	if (!params.opts.run?.executorFence) defaultRuntime.exit(0);
}
async function resumePostCoreUpdateInternal(params) {
	const runId = process.env[UPDATE_RUN_ID_ENV]?.trim();
	const postCoreUpdate = process.env[POST_CORE_UPDATE_ENV] === "1";
	const { assertCurrent, assertRequesterCurrent } = createUpdateCommandAuthority({ opts: params.opts }, "Post-core update");
	assertCurrent?.();
	if (params.channel !== "stable" && params.channel !== "extended-stable" && params.channel !== "beta" && params.channel !== "dev") throw new Error("Missing post-core update channel context.");
	const channel = params.channel;
	const requestedChannelInput = process.env["OPENCLAW_UPDATE_POST_CORE_REQUESTED_CHANNEL"]?.trim() ?? "";
	const requestedChannel = requestedChannelInput ? normalizeUpdateChannel(requestedChannelInput) : null;
	if (requestedChannelInput && !requestedChannel) throw new Error("Invalid post-core requested update channel context.");
	process.env.OPENCLAW_COMPATIBILITY_HOST_VERSION = await readPackageVersion(params.root) ?? VERSION;
	assertCurrent?.();
	const { parentOwnsCompletion } = params;
	const doctorSteps = [];
	const onDoctorStep = (step) => {
		doctorSteps.push(step);
		const endedAtMs = Date.now();
		for (const row of updateRunStepsFromResultStep(step)) {
			const diagnostic = {
				...row,
				endedAtMs
			};
			defaultRuntime.error(`[update resume] ${JSON.stringify(diagnostic)}`);
			if (runId) try {
				recordUpdateRunStep(runId, diagnostic, { env: params.opts.run?.env ?? process.env });
			} catch (error) {
				defaultRuntime.error(`Post-core Doctor evidence could not be saved: ${formatErrorMessage(error)}`);
			}
		}
	};
	let maintenance;
	let outcome;
	let producedPluginUpdate;
	try {
		outcome = { pluginUpdate: await withCommandProcessScope(async () => {
			const doctorWarnings = [];
			const recordDoctorWarnings = (additionalWarnings = []) => {
				const warnings = [...additionalWarnings, ...doctorWarnings.map((warning) => warning.message)];
				if (!postCoreUpdate || !runId || warnings.length === 0) return;
				try {
					recordPostCoreUpdateEvidence(runId, { warnings });
				} catch (error) {
					defaultRuntime.error(`Post-core update evidence could not be saved: ${formatErrorMessage(error)} Update completion may require Doctor verification.`);
				}
			};
			const onDoctorWarnings = (warnings) => {
				doctorWarnings.push(...warnings.map((message) => ({
					reason: "doctor-advisory",
					message,
					guidance: ["Run `openclaw doctor --fix` after repairing the plugin."]
				})));
				recordDoctorWarnings();
			};
			const doctorOptions = () => ({
				opts: params.opts,
				assertCurrent,
				root: params.root,
				yes: params.opts.yes === true,
				json: params.opts.json === true,
				timeoutMs: params.timeoutMs,
				onWarnings: onDoctorWarnings,
				onDoctorStep
			});
			const { beginDoctorMaintenance } = await import("./doctor-maintenance-eL8AysZq.mjs");
			assertCurrent?.();
			maintenance = await beginDoctorMaintenance({
				root: parentOwnsCompletion ? null : params.root,
				options: {
					repair: true,
					nonInteractive: true,
					json: params.opts.json
				},
				runtime: {
					...defaultRuntime,
					log: defaultRuntime.error
				},
				...params.opts.run ? { assertCurrent } : {}
			});
			await maintenance?.releaseState();
			assertCurrent?.();
			await completeSourceUpdateRuntime({
				root: params.root,
				sourceRuntimePrepared: params.opts.sourceRuntimePrepared,
				timeoutMs: params.timeoutMs,
				assertCurrent
			});
			assertCurrent?.();
			if (!parentOwnsCompletion) {
				const warning = await runUpdateFinalizationDoctorInFreshProcess({
					...doctorOptions(),
					phase: "post-plugin"
				});
				if (warning) {
					doctorWarnings.push(warning);
					recordDoctorWarnings();
				}
			}
			const configSnapshot = await readUpdateConfigFileSnapshot({
				skipPluginValidation: true,
				suppressFutureVersionWarning: true,
				observe: false
			});
			const updateStartedAtMs = parseStrictPositiveInteger(process.env["OPENCLAW_UPDATE_POST_CORE_STARTED_AT_MS"] ?? "");
			const preUpdateSourceConfig = await readPostCorePreUpdateSourceConfig({
				sourceConfigPath: process.env[POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV],
				currentSnapshot: configSnapshot,
				updateStartedAtMs
			});
			const parentPluginInstallRecords = await readPostCorePluginInstallRecordsFile(process.env[POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV]);
			assertCurrent?.();
			let { pluginUpdate } = await convergePostCoreUpdatePlugins({
				...params,
				channel,
				requestedChannel,
				preUpdateConfig: preUpdateSourceConfig,
				parentPluginInstallRecords,
				updateStartedAtMs,
				assertCurrent
			});
			producedPluginUpdate = pluginUpdate;
			if (!parentOwnsCompletion) {
				pluginUpdate = (await completePostCorePluginUpdate({
					...doctorOptions(),
					pluginUpdate
				})).pluginUpdate;
				recordDoctorWarnings(collectPostCorePluginAdvisories(pluginUpdate));
			}
			const finalSnapshot = await readConfigFileSnapshot({ observe: false });
			assertCurrent?.();
			await persistValidatedDowngradeConfig(finalSnapshot, assertCurrent);
			assertCurrent?.();
			return doctorWarnings.length ? {
				...pluginUpdate,
				status: pluginUpdate.status === "error" ? "error" : "warning",
				warnings: [...pluginUpdate.warnings ?? [], ...doctorWarnings]
			} : pluginUpdate;
		}) };
	} catch (error) {
		outcome = error instanceof DoctorMaintenanceRefusalError && error.refusal.kind === "deferred" ? { pluginUpdate: {
			...producedPluginUpdate ?? createPostCorePluginUpdateResult({ status: "warning" }),
			status: "warning",
			warnings: [...producedPluginUpdate?.warnings ?? [], {
				reason: "doctor-advisory",
				message: error.message,
				guidance: ["After other OpenClaw processes release state, run `openclaw doctor --fix`."]
			}]
		} } : { error };
	}
	if (maintenance) {
		const owned = maintenance;
		outcome = await settleUpdateDoctorMaintenance(outcome, async () => owned.finish((await readConfigFileSnapshot({
			skipPluginValidation: true,
			observe: false
		})).config), () => owned.release(), "Post-core update and service restoration failed");
	}
	if ("error" in outcome) throw outcome.error;
	const { pluginUpdate } = outcome;
	assertCurrent?.();
	const result = {
		status: pluginUpdate.status === "error" ? "error" : "ok",
		mode: "unknown",
		root: params.root,
		runId,
		steps: [...doctorSteps, ...pluginUpdate.doctorLint ? [pluginUpdate.doctorLint] : []],
		durationMs: 0,
		postUpdate: { plugins: pluginUpdate }
	};
	if (postCoreUpdate && runId) try {
		recordPostCoreUpdateEvidence(runId, {
			candidate: pluginUpdate.status !== "error" ? await readPackageUpdateIdentity(params.root) : void 0,
			warnings: collectPostCorePluginAdvisories(pluginUpdate),
			doctorLint: pluginUpdate.doctorLint
		});
		if (!parentOwnsCompletion && pluginUpdate.doctorLint) {
			const reportPath = await writeUpdateRunReportArtifact({
				result,
				detached: true,
				report: { markdown: "Post-plugin Doctor diagnostics; update completion is pending with the parent updater." }
			});
			defaultRuntime.error(`Post-plugin Doctor report (update completion pending): ${reportPath}`);
		}
	} catch (error) {
		defaultRuntime.error(`Post-core update evidence could not be saved: ${formatErrorMessage(error)} Update completion may require Doctor verification.`);
	}
	assertCurrent?.();
	return {
		pluginUpdate,
		result,
		assertRequesterCurrent
	};
}
/** Shared plugin producer; entry points retain runtime preparation and completion ownership. */
async function convergePostCoreUpdatePlugins(params) {
	const { assertCurrent } = params;
	assertCurrent?.();
	return await withPluginLifecycleLease({ assertCurrent }, async () => {
		const preparedConfig = await preparePostCorePluginConfig({
			requestedChannel: params.requestedChannel,
			preUpdateConfig: params.preUpdateConfig,
			suppressFutureVersionWarning: true,
			observe: false,
			assertCurrent
		});
		const currentPluginInstallRecords = await loadInstalledPluginIndexInstallRecords();
		const persistedPluginIndex = params.parentPluginInstallRecords ? await readPersistedInstalledPluginIndex() : null;
		assertCurrent?.();
		const pluginInstallRecords = Object.keys(currentPluginInstallRecords).length > 0 || Boolean(persistedPluginIndex && params.updateStartedAtMs !== void 0 && persistedPluginIndex.generatedAtMs >= params.updateStartedAtMs) ? currentPluginInstallRecords : params.parentPluginInstallRecords ?? currentPluginInstallRecords;
		const pluginUpdate = await updatePluginsAfterCoreUpdate({
			root: params.root,
			channel: params.channel,
			...preparedConfig,
			json: params.opts.json,
			acceptCapabilities: params.opts.acceptCapabilities,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: parseUpdateTimeoutMs(params.opts.timeout) ?? null,
			pluginInstallRecords,
			assertCurrent
		});
		assertCurrent?.();
		return {
			pluginUpdate,
			configSnapshot: preparedConfig.configSnapshot
		};
	});
}
//#endregion
//#region src/cli/update-cli/update-command-convergence.ts
async function convergeUpdatePlugins(params) {
	const assertCurrent = params.assertCurrent ?? params.opts.run?.executorFence?.assertCurrent;
	assertCurrent?.();
	const postUpdateRoot = params.result.root ?? params.root;
	const failedTargetRuntime = (result = params.result) => ({
		...result,
		status: "error",
		reason: "post-core-update-failed",
		recovery: result.recovery?.serviceRestartSafe === false ? result.recovery : {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed"
		}
	});
	const preUpdateConfig = capturePreUpdateSourceConfig(params.configSnapshot);
	const postUpdateInstalledVersion = await readPackageVersion(postUpdateRoot);
	assertCurrent?.();
	const versionComparison = postUpdateInstalledVersion && VERSION ? compareSemverStrings(VERSION, postUpdateInstalledVersion) : null;
	const runtimeRootChanged = !updateInstallRootsMatch(params.previousInstallRoot ?? params.root, postUpdateRoot);
	const retainedDifferentRuntime = params.coreAlreadyCurrent === true && (runtimeRootChanged || versionComparison !== null && versionComparison !== 0);
	const shouldResumePostCoreInFreshProcess = (!params.coreAlreadyCurrent || retainedDifferentRuntime) && !params.candidateRuntime && shouldResumePostCoreUpdateInFreshProcess({
		result: retainedDifferentRuntime ? {
			...params.result,
			status: "ok",
			before: {
				...params.result.before,
				version: VERSION
			},
			after: {
				...params.result.after,
				version: postUpdateInstalledVersion
			}
		} : params.result,
		downgradeRisk: params.downgradeRisk || versionComparison !== null && versionComparison > 0,
		installKindChanged: params.installKindChanged || retainedDifferentRuntime && runtimeRootChanged
	});
	let postUpdateConfigSnapshot;
	if (params.requestedChannel && params.configSnapshot.valid && params.requestedChannel !== params.storedChannel && !params.opts.json) {
		const verb = shouldResumePostCoreInFreshProcess ? "will be set" : "set";
		defaultRuntime.log(theme.muted(`Update channel ${verb} to ${params.requestedChannel}.`));
	}
	if (params.opts.run) recordUpdateRunStep(params.opts.run.runId, {
		step: "post-update verification",
		status: "in_progress",
		startedAtMs: Date.now()
	}, { env: params.opts.run.env });
	const compatibilityHostVersion = params.candidateRuntime ? postUpdateInstalledVersion ?? VERSION : versionComparison != null && versionComparison > 0 ? postUpdateInstalledVersion : null;
	const convergenceEnv = {
		...compatibilityHostVersion ? { OPENCLAW_COMPATIBILITY_HOST_VERSION: compatibilityHostVersion } : {},
		[UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV]: params.deferPostActivationInspections === true ? UPDATE_POST_ACTIVATION_INSPECTIONS_REPORT_MODE : "0"
	};
	return await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, () => withUpdateEnv(convergenceEnv, async () => {
		let postCorePluginUpdate;
		let doctorWarnings = [];
		let targetRuntimeConverged = false;
		let maintenanceDeferred = false;
		if (shouldResumePostCoreInFreshProcess) {
			if (retainedDifferentRuntime && params.opts.run?.completionOwner === "gateway-restart") {
				await params.beforeDoctor?.();
				assertCurrent?.();
			}
			const freshProcessResult = await continuePostCoreUpdateInFreshProcess({
				root: postUpdateRoot,
				sourceRuntimePrepared: params.result.sourceRuntimePrepared,
				channel: params.channel,
				requestedChannel: params.requestedChannel,
				opts: params.opts,
				pluginInstallRecords: params.preUpdatePluginInstallRecords,
				updateStartedAtMs: params.startedAt,
				timeoutMs: params.updateStepTimeoutMs,
				nodeRunner: params.packageUpdateNodeRunner,
				preUpdateConfig
			});
			assertCurrent?.();
			if (freshProcessResult.exitCode !== void 0) return {
				resultWithPostUpdate: {
					...failedTargetRuntime(),
					steps: [...params.result.steps, {
						name: "post-update verification",
						command: "openclaw update",
						cwd: postUpdateRoot,
						durationMs: 0,
						exitCode: freshProcessResult.exitCode,
						stderrTail: freshProcessResult.error,
						failureFacts: freshProcessResult.failureFacts?.length ? freshProcessResult.failureFacts : [{
							check: "runtime",
							code: "post-core-update-failed"
						}]
					}]
				},
				detail: freshProcessResult.error,
				cancelled: freshProcessResult.exitCode === 130 || freshProcessResult.exitCode === 143
			};
			targetRuntimeConverged = freshProcessResult.resumed;
			postCorePluginUpdate = freshProcessResult.pluginUpdate;
		}
		if (retainedDifferentRuntime && !params.candidateRuntime && !targetRuntimeConverged) return {
			resultWithPostUpdate: failedTargetRuntime(),
			detail: "The installed target could not resume plugin convergence. Run openclaw update using the installed target executable."
		};
		const runtimeStartedAt = Date.now();
		const runtime = targetRuntimeConverged ? { changed: false } : await completeSourceUpdateRuntime({
			root: postUpdateRoot,
			sourceRuntimePrepared: params.result.sourceRuntimePrepared,
			timeoutMs: params.updateStepTimeoutMs,
			assertCurrent,
			beforePublication: params.beforeRuntimePublication
		});
		const runtimeDurationMs = Math.max(0, Date.now() - runtimeStartedAt);
		assertCurrent?.();
		if (!targetRuntimeConverged) {
			const phase = await convergePostCoreUpdatePlugins({
				root: postUpdateRoot,
				channel: params.channel,
				requestedChannel: params.requestedChannel,
				opts: params.opts,
				timeoutMs: params.updateStepTimeoutMs,
				preUpdateConfig,
				...params.candidateRuntime ? {
					parentPluginInstallRecords: params.preUpdatePluginInstallRecords,
					updateStartedAtMs: params.startedAt
				} : {},
				assertCurrent
			});
			postCorePluginUpdate = phase.pluginUpdate;
			postUpdateConfigSnapshot = phase.configSnapshot;
		}
		assertCurrent?.();
		if (postCorePluginUpdate && (!params.coreAlreadyCurrent || postCorePluginUpdate.changed || hasDeferredUpdateModelRetirement(params.opts.run?.env, params.opts.run?.runId))) {
			const producedPluginUpdate = postCorePluginUpdate;
			const completedPluginUpdate = await completePostCorePluginUpdate({
				root: postUpdateRoot,
				databaseBackup: params.databaseBackup,
				onDoctorStep: (step) => params.result.steps.push(step),
				opts: params.opts,
				...params.candidateRuntime ? { doctorConfigWrites: true } : {},
				pluginUpdate: producedPluginUpdate,
				beforeDoctor: params.beforeDoctor,
				assertCurrent,
				yes: params.opts.yes === true,
				json: params.opts.json === true,
				timeoutMs: params.updateStepTimeoutMs,
				onWarnings: (warnings) => {
					doctorWarnings.push(...warnings);
				},
				...params.packageUpdateNodeRunner ? { nodeRunner: params.packageUpdateNodeRunner } : {}
			}).catch((error) => {
				if (!(error instanceof DoctorMaintenanceRefusalError) || error.refusal.kind !== "deferred") throw error;
				maintenanceDeferred = true;
				postCorePluginUpdate = {
					...producedPluginUpdate,
					status: "warning"
				};
				if (!doctorWarnings.includes(error.message)) doctorWarnings.push(error.message);
			});
			assertCurrent?.();
			if (completedPluginUpdate) {
				postCorePluginUpdate = completedPluginUpdate.pluginUpdate;
				postUpdateConfigSnapshot = completedPluginUpdate.configSnapshot;
				doctorWarnings = await retainCurrentDeferredPluginMigrationWarnings(doctorWarnings, new Set((postCorePluginUpdate.warnings ?? []).flatMap((warning) => warning.reason === "doctor-advisory" && warning.pluginId ? [warning.pluginId] : [])));
			}
		} else if (params.candidateRuntime) postUpdateConfigSnapshot = await readConfigFileSnapshot({ observe: false });
		assertCurrent?.();
		if (!maintenanceDeferred && params.candidateRuntime && postUpdateConfigSnapshot) {
			await persistValidatedDowngradeConfig(postUpdateConfigSnapshot, assertCurrent);
			assertCurrent?.();
		}
		const resultWithPostUpdate = {
			...params.result,
			steps: [...params.result.steps, ...runtime.changed ? [{
				name: "source runtime publication",
				command: "openclaw update",
				cwd: postUpdateRoot,
				durationMs: runtimeDurationMs,
				exitCode: 0
			}] : []],
			...postCorePluginUpdate ? {
				status: postCorePluginUpdate.status === "error" ? "error" : params.result.status,
				...postCorePluginUpdate.status === "error" ? { reason: "post-update-plugins" } : {},
				postUpdate: {
					...params.result.postUpdate,
					plugins: postCorePluginUpdate
				}
			} : {}
		};
		const failureFacts = postCorePluginUpdate ? collectPostCorePluginFailureFacts(postCorePluginUpdate) : [];
		if (failureFacts.length) resultWithPostUpdate.steps.push({
			name: "post-update verification",
			command: "openclaw plugins update",
			cwd: postUpdateRoot,
			durationMs: 0,
			exitCode: 1,
			failureFacts
		});
		const appendAdvisories = (messages, source) => {
			const doctor = source === "doctor";
			const kind = doctor ? "package-post-install-doctor" : "recoverable-maintenance";
			resultWithPostUpdate.steps.push(...messages.map((message, index) => ({
				name: doctor ? `post-plugin-doctor-warning-${index + 1}` : `finalize:plugins:${index}`,
				command: doctor ? "openclaw doctor --fix" : "openclaw plugins update",
				cwd: postUpdateRoot,
				durationMs: 0,
				exitCode: 0,
				advisory: {
					kind,
					message
				}
			})));
		};
		appendAdvisories(normalizeUpdatePostInstallDoctorWarnings(doctorWarnings), "doctor");
		appendAdvisories(collectPostCorePluginAdvisories(postCorePluginUpdate), "plugins");
		if (params.result.gitRuntime) {
			const observed = await readGitRuntimeArtifactIdentity(postUpdateRoot);
			assertCurrent?.();
			const matches = isDeepStrictEqual(params.result.gitRuntime, observed);
			const message = "Activated Git runtime changed before or during post-update verification.";
			resultWithPostUpdate.steps.push({
				name: "post-core runtime verification",
				command: "verify activated Git runtime",
				cwd: postUpdateRoot,
				durationMs: 0,
				exitCode: matches ? 0 : 1,
				diagnostics: [JSON.stringify({
					activated: params.result.gitRuntime,
					observed
				})],
				...!matches ? { failureFacts: [{
					check: "runtime",
					code: "runtime-verification-failed",
					message
				}] } : {}
			});
			if (!matches) return {
				resultWithPostUpdate: failedTargetRuntime(resultWithPostUpdate),
				detail: message
			};
		}
		if (params.coreAlreadyCurrent && resultWithPostUpdate.status !== "error" && (runtime.changed || postCorePluginUpdate?.changed || retainedDifferentRuntime && params.opts.run?.gatewayRestartRequired || params.requestedChannel !== null && params.requestedChannel !== params.storedChannel)) {
			resultWithPostUpdate.status = "ok";
			delete resultWithPostUpdate.reason;
		}
		if (params.opts.run) {
			for (const step of resultWithPostUpdate.steps.flatMap(updateRunStepsFromResultStep)) if (step.step.startsWith("warning:")) recordUpdateRunStep(params.opts.run.runId, step, { env: params.opts.run.env });
			recordUpdateRunStep(params.opts.run.runId, {
				step: "post-update verification",
				status: postCorePluginUpdate?.status === "error" ? "failed" : "completed",
				endedAtMs: Date.now(),
				...failureFacts.length ? { failureFacts } : {}
			}, { env: params.opts.run.env });
		}
		return {
			resultWithPostUpdate,
			postUpdateConfigSnapshot
		};
	}));
}
//#endregion
//#region src/cli/update-cli/update-command-post-activation-inspections.ts
const POST_ACTIVATION_INSPECTIONS_STEP = "post-activation doctor inspections";
/**
* Runs the optional Doctor inspections that the update Doctor deferred out of the
* stopped window. The Gateway is already serving; findings stay advisory.
*/
async function runPostActivationInspections(params) {
	const step = {
		name: POST_ACTIVATION_INSPECTIONS_STEP,
		command: "doctor --lint --json --severity-min info",
		cwd: params.root,
		durationMs: 0,
		exitCode: null
	};
	const startedAt = Date.now();
	const incomplete = (reason) => {
		step.advisory = {
			kind: "recoverable-maintenance",
			message: `Deferred Doctor inspections did not complete after restart (${reason}). Run \`openclaw doctor --lint --all --severity-min info\` to inspect them.`
		};
		defaultRuntime.error(step.advisory.message);
		return {
			...params.result,
			steps: [...params.result.steps, step]
		};
	};
	if (!params.gatewayReady) return incomplete("Gateway readiness was not verified");
	try {
		const inlineReceipt = params.result.postUpdate?.plugins?.doctorLint?.deferredInspectionCheckIds;
		const selectors = UpdateDoctorDeferredInspectionCheckIdsSchema.safeParse(inlineReceipt !== void 0 ? inlineReceipt : params.result.steps.findLast((candidate) => candidate.deferredInspectionCheckIds !== void 0)?.deferredInspectionCheckIds);
		if (!selectors.success) return incomplete("the target Doctor did not report usable deferred inspection selectors");
		const checkIds = selectors.data;
		if (checkIds.length === 0) return params.result;
		const args = [
			"doctor",
			"--lint",
			"--json",
			...checkIds.map((id) => `--only=${id}`),
			"--severity-min",
			"info"
		];
		const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
		step.command = args.map(quote).join(" ");
		const entryPath = await resolveGatewayInstallEntrypoint(params.root);
		if (!entryPath) return incomplete("updated OpenClaw entrypoint not found");
		const execution = await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, () => {
			const baseEnv = stripGatewayServiceMarkerEnv(disableUpdatedPackageCompileCacheEnv(process.env));
			for (const key of [
				UPDATE_IN_PROGRESS_ENV,
				UPDATE_POST_CORE_CONVERGENCE_ENV,
				UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV,
				UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV,
				UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV
			]) delete baseEnv[key];
			return runUtf8CommandWithTimeout([
				params.nodeRunner ?? resolveNodeRunner(),
				entryPath,
				...args
			], {
				cwd: params.root,
				timeoutMs: params.timeoutMs,
				killProcessTree: true,
				requireProcessTreeExtinction: true,
				input: "",
				maxOutputBytes: 4194304,
				outputCapture: "head",
				terminateOnOutputLimit: true,
				baseEnv
			});
		});
		step.exitCode = execution.code;
		step.termination = execution.termination;
		step.signal = execution.signal;
		step.killed = execution.killed;
		step.outputLimitExceeded = execution.outputLimitExceeded;
		const stderr = redactSupportString(execution.stderr, {
			env: process.env,
			stateDir: resolveStateDir()
		}, { maxLength: Number.MAX_SAFE_INTEGER });
		step.stderrTail = formatCommandOutput(stderr, 2e3);
		if (execution.code !== 0 && execution.code !== 1 || execution.termination !== "exit" || execution.outputLimitExceeded) return incomplete(formatCommandResult("Doctor lint", {
			...execution,
			stdout: "",
			stderr: formatCommandOutput(stderr, 384)
		}));
		const report = parseUpdateDoctorLintReport(execution.stdout);
		step.doctorLintFindings = report.doctorLintFindings;
		if (report.checksRun !== new Set(checkIds).size) return incomplete("the target lint did not run every deferred inspection");
		const warnings = report.doctorLintFindings.filter((finding) => finding.severity !== "info").map((finding) => `${finding.checkId}: ${finding.message}`);
		if (warnings.length > 0) step.warnings = warnings;
		if (report.doctorLintFindings.length > 0) step.advisory = {
			kind: "recoverable-maintenance",
			message: `Deferred Doctor inspections reported ${report.doctorLintFindings.length} advisory finding${report.doctorLintFindings.length === 1 ? "" : "s"} after restart. Run \`openclaw doctor --lint --all --severity-min info\` to inspect them.`
		};
		return {
			...params.result,
			steps: [...params.result.steps, step]
		};
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		return incomplete(error instanceof Error ? error.message : String(error));
	} finally {
		step.durationMs = Date.now() - startedAt;
	}
}
//#endregion
//#region src/cli/update-cli/update-command-legacy-service-stop.ts
/**
* A legacy updater (through 2026.9.5) inspects the managed Gateway service with
* its own manager adapter before handing finalization to this candidate. When
* that inspection is unavailable it transfers an unstopped, still-running
* service, so the candidate's Doctor cannot enter maintenance: the predecessor
* Gateway keeps gateway-lifecycle and, being supervised, never releases it on
* its own. The candidate must inspect and stop that service itself.
*/
function needsCandidateManagedServiceStop(params) {
	const transferred = params.preManagedServiceStop;
	return params.shouldRestart && params.mode !== "unknown" && transferred?.serviceUpdateVerdict?.kind === "unavailable" && !transferred.stopped && !transferred.inspected && params.windowsTaskAutoStartSuspended !== true;
}
//#endregion
//#region src/infra/update-candidate-predecessor-stop.ts
/**
* Ledger receipt the delegated Doctor records at the native stop boundary.
* The `finalize:` prefix keeps it through count eviction in both this codec and
* the published parents'; the identity lives in the key because those parents
* strip `detail` from retained steps under the byte limit.
*/
const RECEIPT_PREFIX = "finalize:predecessor-stop:";
function serviceIdentity(state, stoppedAtMs) {
	const verdict = state.serviceUpdateVerdict;
	return {
		...state.servicePid !== void 0 ? { pid: state.servicePid } : {},
		...verdict && "fingerprint" in verdict ? { fingerprint: verdict.fingerprint } : {},
		...state.serviceManagerUid !== void 0 ? { managerUid: state.serviceManagerUid } : {},
		stoppedAtMs
	};
}
function encodeReceipt(identity) {
	const field = (value) => value === void 0 ? "-" : String(value).replaceAll(":", "_");
	return `${RECEIPT_PREFIX}${identity.stoppedAtMs}:${field(identity.managerUid)}:${field(identity.pid)}:${field(identity.fingerprint)}`;
}
function decodeReceipt(step) {
	if (!step.startsWith(RECEIPT_PREFIX)) return;
	const [stoppedAt, managerUid, pid, fingerprint] = step.slice(26).split(":");
	const stoppedAtMs = Number(stoppedAt);
	if (!Number.isFinite(stoppedAtMs)) return;
	const number = (value) => value === void 0 || value === "-" || !/^\d+$/.test(value) ? void 0 : Number(value);
	const identity = { stoppedAtMs };
	const parsedPid = number(pid);
	const parsedUid = number(managerUid);
	if (parsedPid !== void 0) identity.pid = parsedPid;
	if (parsedUid !== void 0) identity.managerUid = parsedUid;
	if (fingerprint && fingerprint !== "-") identity.fingerprint = fingerprint;
	return identity;
}
async function readDoctorStop(runId, ledger) {
	for (const step of (await getUpdateRunAsync(runId, ledger))?.steps ?? []) {
		if (step.status !== "completed") continue;
		const identity = decodeReceipt(step.step);
		if (identity) return identity;
	}
}
/** Attribute this required receipt on the existing ledger writer's own native connection. */
async function recordCapturedPredecessorStop(runId, step, capture, params, env, persist) {
	let cleanupFailed = false;
	try {
		const [{ acquireDoctorGatewayMaintenanceOwner }, { createOpenClawDatabaseMaintenanceScope }, { resolveOpenClawStateSqlitePath }, { withStateDatabaseSchemaMaintenance }, { recordUpdateRunStep }] = await Promise.all([
			import("./doctor-maintenance-foreground-BuccURwc.mjs"),
			import("./openclaw-state-db-async-lifecycle-BqnN_0u7.mjs"),
			import("./openclaw-state-db.paths-DOpcSToL.mjs"),
			import("./state-database-maintenance-DymtIqsL.mjs"),
			import("./update-run-ledger-BNpLktkl.mjs")
		]);
		const pathname = resolveOpenClawStateSqlitePath(env);
		const remaining = params.serviceInspectionBudget?.();
		const owner = await acquireDoctorGatewayMaintenanceOwner(pathname, env, {
			options: { repair: true },
			runtime: defaultRuntime,
			assertCurrent: params.assertCurrent,
			deadlineMs: remaining === void 0 ? void 0 : performance.now() + remaining
		});
		const errors = [];
		let resources;
		let result;
		try {
			resources = createOpenClawDatabaseMaintenanceScope({
				schemaMaintenance: true,
				assertOwnerCurrent: () => owner.assertCurrent(params.assertCurrent),
				assertDatabaseAccess: owner.assertDatabaseAccess
			});
			const scope = resources;
			result = owner.run(() => withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => scope.run(() => capture.run(() => {
				params.assertCurrent();
				return recordUpdateRunStep(runId, step, {
					env,
					attributeUpdateWrite: true
				});
			}))));
		} catch (error) {
			errors.push(error);
		}
		try {
			await resources?.close();
		} catch (error) {
			cleanupFailed = true;
			errors.push(error);
		}
		try {
			await owner.release();
		} catch (error) {
			cleanupFailed = true;
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "Predecessor stop receipt and cleanup failed.");
		return result;
	} catch (error) {
		if (cleanupFailed || hasCommandProcessCleanupError(error) || collectNestedErrorCandidates(error).some((cause) => cause instanceof SqliteCoordinatorError)) throw error;
		try {
			await persist();
		} catch (receiptError) {
			throw createSqliteLifecycleAggregateError([error, receiptError], "Predecessor stop attribution and recovery receipt persistence failed.", error);
		}
		throw error;
	}
}
/**
* A legacy updater (through 2026.9.5) that could not inspect the managed
* service leaves the predecessor Gateway running and then delegates Doctor to
* this candidate. That supervised owner keeps gateway-lifecycle until its
* service manager stops it, so Doctor can never enter maintenance. Stop it
* here with this candidate's adapter and record the stopped service's identity
* at the mutation boundary; finalization restarts the updated service.
*/
async function stopSupervisedPredecessorGateway(input, params) {
	if (!input.repair || process.platform === "win32") return false;
	params.assertCurrent();
	const runId = input.runId;
	const env = cloneEnvWithPlatformSemantics(process.env);
	const context = captureOpenClawStateWorkerContext({ env });
	let recorded = false;
	let receipt;
	const record = (state) => {
		if (receipt) return;
		const stoppedAtMs = state.stoppedAtMs ?? Date.now();
		const step = encodeReceipt(serviceIdentity(state, stoppedAtMs));
		const recordedStep = {
			step,
			status: "completed",
			endedAtMs: stoppedAtMs
		};
		const persist = () => recordUpdateRunStepAsync(runId, recordedStep, {
			env,
			context,
			assertCurrent: params.assertCurrent,
			retainSettlement(completion) {
				const release = registerSignalExitGate(completion);
				completion.then(release, release);
			}
		});
		receipt = (params.databaseWriteCapture ? recordCapturedPredecessorStop(runId, recordedStep, params.databaseWriteCapture, params, env, persist) : persist()).then((result) => {
			if (result?.runId !== runId || result.status !== "running" || !result.steps.some((stored) => stored.step === step && stored.status === "completed")) throw new UpdateCommandRecoveryPendingError("The predecessor Gateway stopped, but its update receipt was not recorded; recovery remains pending.");
			recorded = true;
		});
		const release = registerSignalExitGate(receipt);
		receipt.then(release, release);
	};
	let stopFailure;
	try {
		const doctorRemainingMs = params.serviceInspectionBudget?.();
		params.assertCurrent();
		const state = await maybeStopManagedServiceBeforeMutableUpdate({
			updateInstallKind: "package",
			root: params.root,
			shouldRestart: true,
			jsonMode: true,
			phase: "prepare",
			timeoutMs: doctorRemainingMs === void 0 ? GATEWAY_SERVICE_STOP_TIMEOUT_MS : Math.min(GATEWAY_SERVICE_STOP_TIMEOUT_MS, doctorRemainingMs),
			assertDeadline: params.serviceInspectionBudget,
			onStopped: record,
			assertCurrent: params.assertCurrent,
			warn: params.warn
		});
		if (state.stopped) record(state);
	} catch (error) {
		stopFailure = { error };
	}
	try {
		await receipt;
	} catch (error) {
		if (stopFailure && stopFailure.error !== error) throw createSqliteLifecycleAggregateError([stopFailure.error, error], "Predecessor Gateway stop and receipt persistence failed.", stopFailure.error);
		throw error;
	}
	if (stopFailure) {
		if (!recorded || hasCommandProcessCleanupError(stopFailure.error)) throw stopFailure.error;
		params.warn(`Predecessor Gateway stop reported an error after its native mutation: ${String(stopFailure.error)}`);
	}
	return recorded;
}
/**
* Finalization: adopt a stop the delegated Doctor recorded for this run, or
* perform the candidate's own stop when a legacy parent transferred an
* uninspected service. A recorded stop is adopted only after a mutation-free
* inspection reports the same service identity, and a Gateway the candidate
* itself stopped is never left down under --no-restart.
*/
async function adoptCandidateManagedServiceStop(params) {
	const unchanged = {
		stopped: params.transferred,
		restartRequired: false
	};
	if (process.platform === "win32") return unchanged;
	const startedAt = Date.now();
	const stopStep = (advisory) => ({
		name: "managed-service",
		command: "stop managed gateway service before Doctor (candidate inspection)",
		cwd: params.root,
		durationMs: Date.now() - startedAt,
		exitCode: 0,
		...advisory ? { advisory: {
			kind: "recoverable-maintenance",
			message: advisory
		} } : {}
	});
	const updateInstallKind = params.mode === "git" ? "git" : "package";
	params.assertCurrent();
	const doctorStop = await readDoctorStop(params.runId, params.ledger);
	params.assertCurrent();
	if (doctorStop) {
		let inspected;
		try {
			inspected = await maybeStopManagedServiceBeforeMutableUpdate({
				updateInstallKind,
				root: params.root,
				shouldRestart: true,
				jsonMode: true,
				timeoutMs: params.timeoutMs,
				phase: "inspect",
				assertCurrent: params.assertCurrent
			});
		} catch (cause) {
			if (hasCommandProcessCleanupError(cause) || hasGatewayServiceStopUnsafeError(cause) || findServiceOwnershipRefusal(cause) || collectNestedErrorCandidates(cause).some((error) => error instanceof GatewayServiceAuthorityError)) throw cause;
			try {
				params.assertCurrent();
			} catch {
				throw cause;
			}
			throw new UpdateCommandRecoveryPendingError("Inspection of the Gateway stopped by update Doctor failed; recovery remains pending. Run openclaw gateway status --deep before resuming service recovery.", { cause });
		}
		params.assertCurrent();
		if (!inspected.inspected || !inspected.runtimeInspected) throw new UpdateCommandRecoveryPendingError("The Gateway stopped by update Doctor could not be inspected; recovery remains pending. Run openclaw gateway status --deep before resuming service recovery.");
		const current = serviceIdentity(inspected, doctorStop.stoppedAtMs);
		if (current.fingerprint !== doctorStop.fingerprint || current.managerUid !== doctorStop.managerUid) {
			params.onStep({
				...stopStep("The Gateway service was replaced after update Doctor stopped its predecessor; the recorded stop was not adopted and the current service was left untouched."),
				exitCode: 1
			});
			return unchanged;
		}
		if (inspected.running) return {
			stopped: inspected,
			restartRequired: false
		};
		const restartRequired = !params.shouldRestart;
		params.onStep(stopStep(restartRequired ? "The previous Gateway had to be stopped for update Doctor maintenance; it is restarted on the updated installation despite --no-restart." : void 0));
		return {
			stopped: {
				...inspected,
				stopped: true,
				stoppedAtMs: doctorStop.stoppedAtMs
			},
			restartRequired
		};
	}
	if (params.status !== "ok" || !needsCandidateManagedServiceStop({
		...params,
		preManagedServiceStop: params.transferred
	})) return unchanged;
	let stopped = params.transferred;
	let observedStop = false;
	const state = await maybeStopManagedServiceBeforeMutableUpdate({
		updateInstallKind,
		root: params.root,
		shouldRestart: true,
		jsonMode: true,
		timeoutMs: params.timeoutMs,
		phase: "prepare",
		onStopped: (current) => {
			stopped = current;
			observedStop = true;
			params.onStopped?.(current);
		},
		assertCurrent: params.assertCurrent
	});
	if (state.inspected || state.stopped) stopped = state;
	if (stopped?.stopped) {
		if (!observedStop) params.onStopped?.(stopped);
		params.onStep(stopStep());
	}
	return {
		stopped,
		restartRequired: false
	};
}
//#endregion
//#region src/cli/update-cli/update-command-execution-guards.ts
/** Pin the invocation across parent work and the separately bound Doctor child. */
function createUpdateCommandExecutionGuards(opts, root, owner) {
	const run = opts.run;
	let executor = run?.executorFence;
	const requester = run?.requesterAuthority;
	let stateHandedOff = false;
	const assertInvocation = (phase) => {
		const readStatePolicy = !stateHandedOff && phase !== "restore";
		if (opts.recovery || readStatePolicy) assertUpdateCommandRecoveryState(opts);
		if (readStatePolicy && requester?.isCurrent() === false) throw new UpdateRequesterRevokedError();
	};
	const captureWriteOptions = () => {
		const assertAccepting = () => {
			if (owner?.kind !== "package-compensation" && run?.interrupted) throw new UpdateRequesterRevokedError();
		};
		assertAccepting();
		const capturedEnv = cloneEnvWithPlatformSemantics(run?.env ?? process.env);
		return {
			env: capturedEnv,
			context: captureOpenClawStateWorkerContext({ env: capturedEnv }),
			busyTimeoutMs: 12e4,
			assertAccepting,
			retainSettlement: (completion) => retainMutableUpdateSignalWrite(run, completion),
			...owner || !stateHandedOff ? { requireNoRecovery: true } : {}
		};
	};
	const recordPhase = async (phase, patch) => {
		if (run) {
			owner?.assertCurrent();
			const captured = captureWriteOptions();
			await recordUpdateRunPhaseAsync(run.runId, phase, patch, captured);
			recordMutableUpdateSignalPhase(run, phase);
		}
	};
	if (owner) return { recordPhase };
	return {
		captureWriteOptions,
		recordPhase,
		recordStep: async (step) => {
			if (!run) throw new Error("Update step receipt requires an admitted run.");
			const captured = captureWriteOptions();
			return await recordUpdateRunStepAsync(run.runId, step, captured);
		},
		onStateHandoff: () => {
			stateHandedOff = true;
		},
		admitExecutor: (acquired) => {
			assertInvocation();
			if (!run || executor && acquired !== executor) throw new UpdateRequesterRevokedError();
			if (captureUpdateCommandExecutorAuthority(acquired, run.runId).installKey !== resolveUpdateInstallRoot(root)) throw new UpdateRequesterRevokedError();
			run.executorFence = acquired;
			executor = acquired;
		},
		assertCurrent: (phase) => {
			if (phase !== "restore" && run?.interrupted) throw new UpdateRequesterRevokedError();
			assertInvocation(phase);
			executor?.assertCurrent();
		},
		assertBoundChildCurrent: () => assertInvocation()
	};
}
//#endregion
//#region src/cli/update-cli/update-command-terminal-publication.ts
function captureUpdateFinalization(params) {
	const fence = createUpdateCommandFinalizationFence(params);
	const assertCurrent = params.opts.run?.requesterAuthority ? createUpdateCommandAuthority({
		opts: params.opts,
		assertCurrent: fence
	}).assertCurrent : fence;
	const { recordPhase } = createUpdateCommandExecutionGuards(params.opts, params.root, {
		kind: "current-core-finalization",
		assertCurrent
	});
	return {
		fence,
		assertCurrent,
		recordPhase,
		originalRun: params.opts.run,
		compensate: captureMutableUpdateCompensation(params.opts),
		forward: (work) => withMutableUpdateForwardScope(params.opts, () => withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, work)),
		interruptedResult: (result) => recordMutableUpdateInterruption(params.opts, result),
		beganSuccessfully: params.result.status === "ok",
		sentinelOptions: {
			meta: params.controlPlaneUpdateSentinelMeta,
			jsonMode: Boolean(params.opts.json),
			env: params.opts.run?.env ?? params.ownedManagedUpdateEnv
		}
	};
}
async function withUpdateProgressSettlement(params, settle, finalize) {
	let settledParams = params;
	let failure;
	try {
		if (settle) await settle();
	} catch (cause) {
		if (hasCommandProcessCleanupError(cause)) throw cause;
		failure = { cause };
		const { result } = createPostUpdateExceptionResult(params, cause);
		settledParams = {
			...params,
			result: params.result.status === "error" ? {
				...result,
				reason: params.result.reason
			} : result
		};
	}
	try {
		const result = await finalize(settledParams, failure);
		if (failure) throw new UpdateCommandFailure(result, 1, void 0, { cause: failure.cause });
		return result;
	} catch (cause) {
		if (failure && !collectNestedErrorCandidates(cause).includes(failure.cause)) throw new AggregateError([cause, failure.cause], "Update finalization and progress reporting failed", { cause });
		throw cause;
	}
}
function bindUpdateFinalizationFailure(progressFailure) {
	const createFailure = (result, detail, options, exitCode = resolveManagedServiceUpdateFailureExitCode(result)) => {
		const failureOptions = progressFailure && !collectNestedErrorCandidates(options?.cause).includes(progressFailure.cause) ? { cause: options && "cause" in options ? new AggregateError([options.cause, progressFailure.cause], "Update and progress reporting failed") : progressFailure.cause } : options;
		return new UpdateCommandFailure(result, exitCode, detail, failureOptions);
	};
	return {
		createFailure,
		settleResult: (...args) => {
			if (args[0].status !== "ok") throw createFailure(...args);
			return args[0];
		}
	};
}
function completeUpdateCommandResult(params, result, serviceStop) {
	if (serviceStop?.stopped && serviceStop.serviceMembershipSourceAbsent && !result.steps.some((step) => step.name === "managed-service-membership")) {
		const message = "Service membership unverifiable on this host; using managed stop/update/start.";
		defaultRuntime.error(message);
		result.steps.push({
			name: "managed-service-membership",
			command: "openclaw update",
			cwd: result.root ?? "",
			durationMs: 0,
			exitCode: 0,
			advisory: {
				kind: "recoverable-maintenance",
				message
			}
		});
	}
	return normalizeControlPlaneUpdateResult({
		...result,
		...result.status === "error" && result.reason !== "update-activation-timeout" && params.rollbackBlockedReason ? {
			reason: params.rollbackBlockedReason,
			recovery: unsafeUpdateRecovery(result.recovery, params.rollbackBlockedReason)
		} : {},
		durationMs: Math.max(0, Date.now() - params.startedAt)
	});
}
async function publishSettledUpdateCommandResult(params, state, onTerminalRecord) {
	const settled = await resolveSettledUpdateCommandResult(params, state.pendingResult, state.failure, state.terminalRecord);
	const result = completeUpdateCommandResult(params, settled.result);
	const reporting = state.readReportingState();
	const reportDowntime = !settled.settlementFailed && reporting.pendingRestartAtMs === void 0;
	if (reporting.notify) await reporting.notify(result);
	const { rolledBack, completedDowntimeMs } = state.readReportingState();
	return publishUpdateCommandTerminalResult(params, result, {
		rolledBack: rolledBack && !settled.settlementFailed,
		downtimeMs: reportDowntime ? completedDowntimeMs : void 0,
		captured: settled.captured
	}, onTerminalRecord);
}
function shouldPropagatePostUpdateException(error, activationVerified) {
	return error instanceof UpdateCommandFailure && (!activationVerified || error.result.reason !== "wrapper-retirement-failed") || hasCommandProcessCleanupError(error);
}
function createPostUpdateExceptionResult(params, error, activationVerified = false) {
	const message = formatErrorMessage(error);
	const failureFacts = collectUpdateDoctorFailureFacts(error);
	const refusal = classifyDoctorMaintenanceRefusal(error);
	if (activationVerified && collectNestedErrorCandidates(error).every((cause) => cause instanceof GatewayRestartHealthError || cause instanceof UpdateCommandFailure && cause.result.reason === "wrapper-retirement-failed" && cause.result.recovery?.serviceRestartSafe !== false) && error instanceof Error && params.result.recovery?.serviceRestartSafe !== false) {
		const warning = `Gateway activation verified; post-update maintenance needs attention: ${message}`;
		return {
			message: warning,
			result: {
				...params.result,
				steps: [...params.result.steps, {
					name: "post-update maintenance",
					command: "openclaw update",
					cwd: params.result.root ?? params.root,
					durationMs: Math.max(0, Date.now() - params.startedAt),
					exitCode: 0,
					advisory: {
						kind: "recoverable-maintenance",
						message: warning
					}
				}]
			}
		};
	}
	const version = params.result.after?.version?.trim();
	return {
		message,
		result: {
			...params.result,
			status: "error",
			reason: "post-update-failed",
			recovery: refusal.kind === "data-at-risk" ? {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed",
				dataAtRisk: refusal.reason
			} : isUpdateStateReadContention(error) && version ? params.result.recovery ?? {
				serviceRestartSafe: true,
				version
			} : params.result.recovery,
			steps: [...params.result.steps, {
				name: "post-update verification",
				command: "openclaw update",
				cwd: params.result.root ?? params.root,
				durationMs: Math.max(0, Date.now() - params.startedAt),
				exitCode: 1,
				stderrTail: message,
				...failureFacts.length ? { failureFacts } : {}
			}]
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-command-post-update-maintenance.ts
async function preparePostUpdateService(params, assertCurrent) {
	assertCurrent();
	try {
		if (params.opts.run) {
			const run = params.opts.run;
			const { stopped, restartRequired } = await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, () => adoptCandidateManagedServiceStop({
				transferred: params.preManagedServiceStop,
				shouldRestart: params.shouldRestart,
				mode: params.result.mode,
				status: params.result.status,
				runId: run.runId,
				ledger: { env: run.env },
				root: params.result.root ?? params.root,
				timeoutMs: params.updateStepTimeoutMs,
				assertCurrent,
				onStopped: (observed) => {
					params.preManagedServiceStop = observed;
				},
				onStep: (step) => params.result.steps.push(step)
			}));
			assertCurrent();
			params.preManagedServiceStop = stopped;
			params.shouldRestart ||= restartRequired;
		}
	} catch (error) {
		if (hasCommandProcessCleanupError(error) || hasGatewayServiceStopUnsafeError(error) || findServiceOwnershipRefusal(error) || collectNestedErrorCandidates(error).some((cause) => cause instanceof GatewayServiceAuthorityError)) throw error;
		try {
			assertCurrent();
		} catch (authorityError) {
			if (authorityError === error) throw error;
			throw new AggregateError([error, authorityError], `Service preparation failed (${formatErrorMessage(error)}) and update authority was lost (${formatErrorMessage(authorityError)}).`, { cause: authorityError });
		}
		const cause = params.failure ? new AggregateError([params.failure.cause, error], "Update and service preparation failed", { cause: params.failure.cause }) : error;
		if (error instanceof UpdateCommandRecoveryPendingError) throw new UpdateCommandPendingRecoveryFailure(params.result, formatErrorMessage(cause), { cause });
		const failure = createPostUpdateExceptionResult(params, cause);
		params.result = failure.result;
		params.failure = {
			cause,
			detail: failure.message
		};
	}
	const shouldRestart = prepareUpdateServiceResult(params);
	if (params.opts.restart === false && !params.shouldRestart && params.opts.run) {
		assertCurrent();
		recordUpdateRunStep(params.opts.run.runId, {
			step: "restart",
			status: "skipped",
			endedAtMs: Date.now(),
			detail: "skipped by operator"
		}, { env: params.opts.run.env });
	}
	return shouldRestart;
}
async function parkPostUpdateService(params, context) {
	const { before } = context;
	if (!before) throw new Error("Plugin maintenance lost its update service owner.");
	await before.windowsTaskAutoStartRecovery?.complete(true);
	const stopped = await maybeStopManagedServiceBeforeMutableUpdate({
		updateRun: context.updateRun,
		recordPhase: context.recordPhase,
		assertCurrent: context.assertCurrent,
		updateInstallKind: context.mode === "git" ? "git" : "package",
		root: context.root,
		shouldRestart: true,
		jsonMode: Boolean(params.opts.json),
		expectedService: before,
		phase: "prepare",
		timeoutMs: params.updateStepTimeoutMs,
		onStopped: context.onStopped
	});
	context.assertCurrent();
	context.onPrepared(stopped);
	before.windowsTaskAutoStartRecovery = stopped.windowsTaskAutoStartRecovery;
	if (stopped.blockMessage || !stopped.stopped) throw new Error(stopped.blockMessage ?? "Gateway could not be parked for plugin maintenance.");
	stopped.windowsTaskAutoStartRecovery?.beginMutation();
	return stopped;
}
/** Shell integration changes follow settled restart and health recovery. */
async function completePostUpdateMaintenance(params, result, assertCurrent, context) {
	await tryInstallShellCompletion({
		root: context.root,
		jsonMode: Boolean(params.opts.json),
		skipPrompt: Boolean(params.opts.yes)
	});
	if (!params.installKindChanged || result.mode === "git") return;
	const retirement = await retireStandaloneGitWrapper({
		previousRoot: params.previousInstallRoot ?? params.root,
		assertCurrent
	});
	if (!retirement.error) return;
	defaultRuntime.error(retirement.error);
	if (context.activationVerified) throw new UpdateCommandFailure({
		...result,
		status: "error",
		reason: "wrapper-retirement-failed"
	}, 1, retirement.error);
	await markControlPlaneUpdateRestartSentinelFailureBestEffort({
		...context.sentinel,
		reason: "wrapper-retirement-failed"
	});
	return {
		result: {
			...result,
			status: "error",
			reason: "wrapper-retirement-failed"
		},
		detail: retirement.error
	};
}
async function resumePostUpdateWindowsAutoStart(params, result, readStopped, callbacks) {
	try {
		const stopped = readStopped();
		await stopped?.windowsTaskAutoStartRecovery?.restore(true, createWindowsTaskAutoStartGuard({
			root: result.recovery?.packageRollbackVerified && stopped.serviceUpdateVerdict?.kind === "owned" ? stopped.serviceUpdateVerdict.root : result.root ?? params.root,
			before: stopped,
			timeoutMs: params.updateStepTimeoutMs
		}));
	} catch (cause) {
		if (!callbacks) throw cause;
		await callbacks.onFailure(cause);
	}
}
/** Preserve the initiating failure when final task restoration also fails. */
async function settlePostUpdateWindowsAutoStartFailure(params, finalResult, result, cause, readStopped) {
	let failure = cause;
	try {
		await readStopped()?.windowsTaskAutoStartRecovery?.complete(false);
	} catch (cleanupError) {
		failure = new AggregateError([cause, cleanupError], `Windows task restoration and compensation failed: ${formatErrorMessage(cause)}; ${formatErrorMessage(cleanupError)}`);
	}
	defaultRuntime.error(`Failed to restore Windows Scheduled Task autostart: ${String(failure)}`);
	finalResult.status = "error";
	finalResult.reason = result.status === "error" ? result.reason : "windows-task-autostart-restore-failed";
	finalResult.recovery = unsafeUpdateRecovery(finalResult.recovery);
	finalResult.steps = finalResult.steps.concat({
		name: "windows-task-autostart-recovery",
		command: "openclaw update",
		cwd: finalResult.root ?? params.root,
		durationMs: 0,
		exitCode: 1,
		stderrTail: formatErrorMessage(failure)
	});
	return { cause: failure };
}
//#endregion
//#region src/cli/update-cli/update-command-restart-context.ts
async function prepareUpdateRestart(params, restartConfigSnapshot) {
	let refreshGatewayServiceEnv = false;
	let gatewayServiceEnv;
	let gatewayServiceInstallEnv;
	let serviceManagerUid = params.preManagedServiceStop?.serviceManagerUid;
	let serviceUpdateVerdict = params.preManagedServiceStop?.serviceUpdateVerdict;
	let skipLegacyServiceRestart = serviceUpdateVerdict?.kind === "absent";
	const packageUpdate = isPackageManagerUpdateMode(params.result.mode);
	const serviceStateReadEnv = resolveServiceRefreshEnv(params.result.mode === "git" || packageUpdate ? params.preManagedServiceStop?.serviceEnv ?? process.env : process.env, params.invocationCwd);
	let serviceMutationAllowed = params.preManagedServiceStop?.serviceMutationAllowed !== false && isGatewayServiceManagementAllowedForUpdate(process.env) && isGatewayServiceManagementAllowedForUpdate(serviceStateReadEnv);
	let serviceMutationSkipMessage = !serviceMutationAllowed ? params.preManagedServiceStop?.serviceMutationSkipMessage ?? resolveGatewayServiceManagementBlockMessageForUpdate(process.env) ?? resolveGatewayServiceManagementBlockMessageForUpdate(serviceStateReadEnv) : void 0;
	let serviceStartRefused = false;
	let gatewayPort = await resolveUpdatedGatewayRestartPort({
		config: restartConfigSnapshot.valid ? restartConfigSnapshot.config : void 0,
		processEnv: process.env,
		serviceEnv: params.ownedManagedUpdateEnv
	});
	if (params.shouldRestart && serviceMutationAllowed && !skipLegacyServiceRestart) try {
		const serviceState = await readGatewayServiceStateForUpdate(resolveGatewayService(), serviceStateReadEnv, params.updateStepTimeoutMs, {
			managerUid: serviceManagerUid,
			assertCurrent: params.assertCurrent
		});
		serviceUpdateVerdict = await revalidateManagedGatewayServiceAfterUpdate({
			state: serviceState,
			root: params.result.root ?? params.root,
			preManagedServiceStop: params.preManagedServiceStop,
			allowInstallRootChange: true
		});
		gatewayServiceEnv = serviceState.env;
		serviceManagerUid ??= serviceState.runtime?.systemd?.managerUid;
		const useInstalledState = serviceUpdateVerdict.kind === "owned" && serviceUpdateVerdict.requiresInstallRootRefresh || packageUpdate || params.result.mode === "git" && params.preManagedServiceStop?.stopped;
		skipLegacyServiceRestart = serviceUpdateVerdict.kind === "foreign" || serviceUpdateVerdict.kind === "absent";
		if (serviceUpdateVerdict.kind === "unavailable") {
			serviceMutationAllowed = false;
			serviceMutationSkipMessage = serviceUpdateVerdict.message;
		} else if (serviceUpdateVerdict.kind === "foreign") {
			serviceMutationAllowed = false;
			serviceMutationSkipMessage = "Gateway service management skipped: the service belongs to a different OpenClaw installation and was left untouched.";
		} else if (!skipLegacyServiceRestart && (useInstalledState ? serviceState.installed : serviceState.loadState.status === "loaded" && (params.result.mode !== "git" || serviceUpdateVerdict.kind === "owned"))) {
			gatewayServiceInstallEnv = resolveManagedGatewayServiceProcessEnv(serviceState.command, params.ownedManagedUpdateEnv ?? process.env);
			if (gatewayServiceInstallEnv) gatewayServiceInstallEnv = stripGatewayServiceMarkerEnv(gatewayServiceInstallEnv);
			refreshGatewayServiceEnv = serviceUpdateVerdict.kind === "owned" && serviceUpdateVerdict.refreshDefinition;
			if (serviceUpdateVerdict.kind === "owned" && gatewayServiceInstallEnv === null) {
				refreshGatewayServiceEnv = false;
				serviceUpdateVerdict = {
					...serviceUpdateVerdict,
					refreshDefinition: false
				};
			}
		}
		gatewayPort = await resolveUpdatedGatewayRestartPort({
			config: restartConfigSnapshot.valid ? restartConfigSnapshot.config : void 0,
			serviceEnv: gatewayServiceEnv,
			serviceCommand: serviceUpdateVerdict.kind === "unresolved" || serviceUpdateVerdict.kind === "owned" && (!serviceUpdateVerdict.refreshDefinition || serviceUpdateVerdict.requiresInstallRootRefresh && restartConfigSnapshot.config.gateway?.port === void 0) ? serviceState.command : void 0
		});
	} catch (err) {
		const refusal = err instanceof ServiceStartRefusalError ? err.refusal : err instanceof GatewayServiceUpdateOwnershipError && err.cause instanceof ServiceStartRefusalError ? err.cause.refusal : void 0;
		if (refusal) {
			params.assertCurrent();
			serviceStartRefused = true;
			gatewayServiceEnv = serviceStateReadEnv;
			serviceMutationAllowed = false;
			serviceMutationSkipMessage = `SERVICE-DEFINITION: ${refusal.message} The updated installation is kept; after resolving the service hold, run \`${formatCliCommand("openclaw gateway start", serviceStateReadEnv)}\`. Gateway readiness remains unverified.`;
		} else if (params.preManagedServiceStop?.stopped) {
			const message = err instanceof GatewayServiceUpdateOwnershipError ? formatErrorMessage(err) : "Stopped gateway service could not be revalidated; inspect it before restarting manually.";
			throw new GatewayServiceUpdateOwnershipError(message, err);
		} else {
			serviceMutationAllowed = false;
			serviceMutationSkipMessage = "Code update completed; gateway service management skipped because its current ownership could not be inspected. Run `openclaw gateway status --deep` before restarting it manually.";
		}
	}
	if (params.serviceRuntimeRefreshRequired && !serviceStartRefused && (!serviceMutationAllowed || !refreshGatewayServiceEnv || gatewayServiceInstallEnv === null)) throw new GatewayServiceUpdateOwnershipError("Replacing the unsupported Gateway Node requires a writable service definition and a reproducible service environment. Ask its deployment owner to refresh the service before retrying.", void 0);
	return {
		refreshGatewayServiceEnv,
		gatewayServiceEnv,
		gatewayServiceInstallEnv,
		serviceUpdateVerdict,
		serviceManagerUid,
		skipLegacyServiceRestart,
		serviceMutationAllowed,
		serviceMutationSkipMessage,
		gatewayPort
	};
}
//#endregion
//#region src/cli/update-cli/update-command-database-backup.ts
async function captureUpdateDatabases(params) {
	const assertCurrent = params.assertCurrent;
	const startedAt = Date.now();
	const { execution, context, transaction } = params;
	const env = context?.env ?? execution.opts.run.env;
	params.assertCurrent();
	const source = await readUpdateCandidateSource(env, execution.legacyConfigPlan);
	params.assertCurrent();
	let maintenance = null;
	let unavailable;
	try {
		if (hasActiveGatewayStateOwner(resolveOpenClawStateSqlitePath(env))) throw new Error("This process still owns a running Gateway");
		maintenance = await acquireGatewayLock({
			env,
			role: "sqlite-maintenance",
			allowInTests: true,
			timeoutMs: 0
		});
		if (!maintenance) throw new Error("Exclusive state ownership is unavailable");
	} catch (error) {
		unavailable = formatErrorMessage(error);
	}
	let outcome;
	try {
		const capture = async () => {
			params.assertCurrent();
			if (maintenance) {
				if (process.platform === "win32") try {
					(await prepareOpenClawStateDatabaseRemoval(resolveOpenClawStateSqlitePath(env), params.assertCurrent)).release();
				} catch (error) {
					if (!(error instanceof Error) || error instanceof AggregateError || !isSqliteLockError(error.cause)) throw error;
					unavailable = "another SQLite connection is active";
				}
				else await closeOpenClawStateDatabaseByPathAsync(resolveOpenClawStateSqlitePath(env));
				params.assertCurrent();
				maintenance.assertCurrent();
			}
			let backupRoot = transaction.databaseBackupRoot ?? transaction.backupRoot;
			if (execution.updateInstallKind === "git" && !execution.switchToGit) {
				const artifactRoot = path.join(execution.root, ".artifacts");
				await fs$1.mkdir(artifactRoot, { recursive: true });
				params.assertCurrent();
				backupRoot = path.join(artifactRoot, path.basename(backupRoot));
			}
			const captured = await createUpdateDatabaseBackup({
				backupRoot,
				stateDir: resolveStateDir(env),
				config: source.config,
				env,
				preserveSourceArtifacts: maintenance !== null && unavailable === void 0,
				timeoutMs: execution.updateStepTimeoutMs,
				nodeRunner: execution.packageUpdateNodeRunner,
				postgresOffline: maintenance !== null && unavailable === void 0
			});
			params.assertCurrent();
			maintenance?.assertCurrent();
			return captured;
		};
		outcome = { value: await (maintenance ? maintenance.run(capture) : capture()) };
	} catch (error) {
		outcome = { error };
	}
	if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) throw outcome.error;
	try {
		await maintenance?.release();
	} catch (cleanupError) {
		if ("error" in outcome) throw createSqliteLifecycleAggregateError([outcome.error, cleanupError], "Database backup and ownership cleanup both failed", outcome.error);
		throw cleanupError;
	}
	if ("error" in outcome) throw outcome.error;
	const backup = outcome.value;
	params.assertCurrent();
	const restorable = maintenance !== null && unavailable === void 0 && backup.databases.every((entry) => typeof backup.sourceGenerations[entry.path] === "string");
	if (!restorable) {
		transaction.databaseBackupRoot = void 0;
		backup.warnings.push(`Automatic database restoration is disabled because ${unavailable ? `the Gateway could not be confirmed stopped during capture: ${unavailable}` : "a source database changed or its write generation could not be captured"}. Snapshots remain available at ${backup.directory} even after successful activation; later writes must be preserved.`);
	}
	const step = {
		name: "database snapshot",
		command: "snapshot databases before migrations",
		cwd: resolveStateDir(env),
		durationMs: Date.now() - startedAt,
		exitCode: 0,
		diagnostics: [`Databases snapshotted at ${backup.directory}. ${restorable ? "Verified successful activation removes these snapshots; otherwise retain them with the update's recovery artifacts." : "These snapshots require manual recovery and remain available after successful activation."}`, ...backup.databases.map((entry) => `${entry.path} -> ${entry.snapshotPath}; schema ${entry.userVersion}; ${entry.sizeBytes} bytes; SHA-256 ${entry.sha256}`)],
		warnings: backup.warnings
	};
	await reportUpdateStepCompletion(execution.progress, {
		...step,
		index: 0,
		total: 0
	});
	assertCurrent();
	return {
		backup: restorable ? backup : void 0,
		step
	};
}
/** Called only before this update admits a candidate Gateway, after its child has settled. */
async function restoreFailedUpdateDatabases(params) {
	const assertCurrent = params.assertCurrent;
	const startedAt = Date.now();
	const refuse = async (reason) => {
		params.backup.restoreRefusal ??= reason;
		params.result.reason = "state-migrated-no-rollback";
		if (params.result.recovery?.serviceRestartSafe !== false) params.result.recovery = {
			serviceRestartSafe: false,
			reason: "state-migration-started"
		};
		params.result.recovery.dataAtRisk ??= "state-migrated-no-rollback";
		params.result.rollbackOutcome = {
			status: "not-attempted",
			reason
		};
		const step = {
			name: "database rollback",
			command: "preserve databases changed after snapshot capture",
			cwd: params.backup.directory,
			durationMs: Date.now() - startedAt,
			exitCode: 1,
			stderrTail: `${reason}. Current databases were preserved. Keep the retained snapshots at ${params.backup.directory}; run openclaw doctor from the candidate version to inspect recovery before downgrading.`
		};
		params.result.steps.push(step);
		await reportUpdateStepCompletion(params.progress, {
			...step,
			index: 0,
			total: 0
		});
		assertCurrent();
		return false;
	};
	params.assertCurrent();
	try {
		await params.assertRollbackSafe?.();
	} catch (error) {
		params.assertCurrent();
		if (hasCommandProcessCleanupError(error)) throw error;
		if (params.result.recovery?.serviceRestartSafe === false) params.result.recovery.reason = "source-rollback-failed";
		else params.result.recovery = {
			serviceRestartSafe: false,
			reason: "source-rollback-failed"
		};
		return await refuse(formatErrorMessage(error));
	}
	params.assertCurrent();
	if (params.backup.restoreRefusal) return await refuse(params.backup.restoreRefusal);
	if (params.backup.migration && params.backup.migration.backup !== params.backup.directory) return await refuse("Migration receipt belongs to a different database backup");
	try {
		const migratedPaths = await restoreUpdateDatabaseBackup({
			...params,
			expectedGenerations: params.backup.migration?.to ?? params.backup.sourceGenerations
		});
		if (migratedPaths === null) return await refuse(params.backup.restoreRefusal ?? "databases changed after migration; the writer is unknown");
		params.assertCurrent();
		const step = {
			name: "database rollback",
			command: "restore pre-migration databases",
			cwd: params.backup.directory,
			durationMs: Date.now() - startedAt,
			exitCode: 0,
			diagnostics: [`Restored pre-migration databases from ${params.backup.directory}.`, ...migratedPaths.map((file) => `Migrated database file retained for manual recovery: ${file}`)]
		};
		params.result.steps.push(step);
		await reportUpdateStepCompletion(params.progress, {
			...step,
			index: 0,
			total: 0
		});
		assertCurrent();
		return true;
	} catch (cause) {
		params.result.recovery = {
			serviceRestartSafe: false,
			reason: "state-migration-started",
			dataAtRisk: "rollback-state-unverified"
		};
		throw new UpdateCommandRecoveryPendingError(`Database rollback could not finish (data at risk: rollback-state-unverified); keep the Gateway stopped. Preserve ${params.backup.directory} and <database>.migrated-${params.runId}. Run the compatible candidate's Doctor to inspect recovery before restarting.`, { cause });
	}
}
//#endregion
//#region src/cli/update-cli/update-command-rollback.ts
/** Restores the previous generation only while schemas and activation-owned config stay intact. */
async function rollbackFailedUpdate(params) {
	const { preManagedServiceStop: before, packageTransaction, opts } = params;
	const run = opts.run;
	const executor = run?.executorFence;
	const assertCurrent = () => {
		if (opts.run !== run || run?.executorFence !== executor) throw new Error("Package rollback lost its original executor.");
		executor?.assertCurrent();
	};
	const { recordPhase } = createUpdateCommandExecutionGuards(opts, params.previousRoot, {
		kind: "package-compensation",
		assertCurrent
	});
	const env = before?.serviceEnv ?? opts.run?.env ?? process.env;
	const pendingRecovery = (result, pendingRecoveryReason) => ({
		result: {
			...result,
			status: "error",
			recovery: unsafeUpdateRecovery(result.recovery)
		},
		rolledBack: false,
		pendingRecoveryReason
	});
	if (!opts.recovery) try {
		assertCurrent();
		const targetPath = resolveOpenClawStateSqlitePath(env);
		await assertUpdateRecoveryAdmission({
			env,
			path: targetPath
		});
		assertCurrent();
		if (opts.run && resolveOpenClawStateSqlitePath(opts.run.env) !== targetPath) {
			await assertUpdateRecoveryAdmission({ env: opts.run.env });
			assertCurrent();
		}
	} catch (error) {
		return pendingRecovery(params.result, formatErrorMessage(error));
	}
	if (opts.recovery) return pendingRecovery(params.result, "Full-state checkpoint recovery is deferred; the retained record and artifacts were left unchanged.");
	if (params.originalManagedServiceRuntime) return compensateOriginalManagedService(params, assertCurrent);
	let result = params.result;
	const config = params.configSnapshot.sourceConfigBeforeMigrations ?? params.configSnapshot.sourceConfig;
	const configSnapshot = params.activationConfig ?? {
		path: params.configSnapshot.path,
		raw: params.configSnapshot.raw,
		hash: hashConfigRaw(params.configSnapshot.raw)
	};
	const configFiles = [configSnapshot, ...params.activationConfig?.includedFiles ?? []];
	const expectedConfigHashes = new Map(configFiles.map((file) => [file.path, file.hash]));
	const changedConfigFiles = configFiles.filter((file) => file.hash !== hashConfigRaw(file.raw));
	const recoveryEnv = {
		...env,
		[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV]: "1"
	};
	const port = before?.stopped ? before.servicePort ?? await resolveUpdatedGatewayRestartPort({
		config,
		serviceEnv: env
	}) : void 0;
	const failed = (reason, dataAtRisk) => {
		if (dataAtRisk) result.recovery = unsafeUpdateRecovery(result.recovery, dataAtRisk);
		return {
			result: {
				...result,
				status: "error",
				rollbackOutcome: result.rollbackOutcome ?? {
					status: "not-attempted",
					reason
				},
				reason: result.recovery?.serviceRestartSafe === true && result.recovery.packageRollbackVerified || reason === "service-definition-rollback-unverified" ? params.result.reason ?? "update-failed" : reason
			},
			rolledBack: false,
			stoppedForRollback
		};
	};
	const stateUnchanged = async () => {
		assertCurrent();
		const baseline = params.schemaVersions;
		const current = await readUpdateStateSchemaVersions({
			stateDir: resolveStateDir(env),
			config,
			env,
			root: result.root ?? null,
			nodeRunner: params.nodeRunner,
			timeoutMs: params.timeoutMs
		});
		assertCurrent();
		const sharedPath = resolveOpenClawStateSqlitePath(env);
		if (baseline === void 0 || !updateStateSchemaVersionsMatch(baseline, current, {
			sharedPath,
			candidateSchemaVersions: params.candidateSchemaVersions
		})) return false;
		const baselineVersions = new Map(baseline.map((entry) => [entry.path, resolveUpdateStateContentVersion(entry)]));
		for (const entry of current) {
			const version = resolveUpdateStateContentVersion(entry);
			if (version === null || baselineVersions.get(entry.path) != null) continue;
			const kind = entry.path === sharedPath ? "state" : "agent";
			const supported = params.previousSchemaVersions?.[kind];
			if (supported === void 0 || version > supported) {
				if (params.databaseBackup && run && packageTransaction) return false;
				throw new Error(`Automatic rollback refused: newly created ${kind} database ${entry.path} uses schema ${version}; retained previous package support is ${supported ?? "unknown"}. Keep the update installed.`);
			}
		}
		await assertConfigUnchanged();
		assertCurrent();
		return true;
	};
	let stoppedForRollback;
	let failureReason = "rollback-state-unverified";
	let dataAtRisk = "rollback-state-unverified";
	const assertConfigUnchanged = async () => {
		assertCurrent();
		let unchanged = configFiles.every((file) => file.doctorOwned !== false);
		for (const file of configFiles) {
			if (!unchanged) break;
			try {
				if (file.pathSnapshot) assertConfigFileWritePathSnapshot(file.pathSnapshot, fs);
				unchanged = (await readUpdateConfigSnapshot(file.path)).hash === expectedConfigHashes.get(file.path);
				if (file.pathSnapshot) assertConfigFileWritePathSnapshot(file.pathSnapshot, fs);
			} catch (error) {
				if (!(error instanceof ConfigMutationConflictError)) throw error;
				unchanged = false;
			}
			assertCurrent();
		}
		if (unchanged && params.activationConfig?.includedFiles === void 0 && params.configSnapshot.includedPaths?.length) {
			const deps = normalizeConfigIoDeps({ env: { ...env } });
			const included = resolveConfigIncludesForRead(params.configSnapshot.parsed, params.configSnapshot.path, deps);
			unchanged = isDeepStrictEqual(config, resolveConfigForRead(included, deps.env).resolvedConfigRaw);
		}
		assertCurrent();
		if (!unchanged) {
			failureReason = "state-migrated-no-rollback";
			dataAtRisk = "state-migrated-no-rollback";
			const detail = `Configuration ${configSnapshot.path} or its included files changed after activation; automatic rollback was refused to preserve those edits.`;
			result = {
				...result,
				steps: [...result.steps, {
					name: "config-rollback",
					command: "restore pre-update config",
					cwd: params.previousRoot,
					durationMs: 0,
					exitCode: 1,
					stderrTail: detail
				}]
			};
			throw new Error(detail);
		}
	};
	const stop = async () => {
		assertCurrent();
		failureReason = "service-revalidation-failed";
		const stopped = await withOwnedManagedUpdateEnv(recoveryEnv, () => maybeStopManagedServiceBeforeMutableUpdate({
			updateRun: run,
			recordPhase,
			assertCurrent,
			updateInstallKind: "package",
			root: result.root ?? params.previousRoot,
			shouldRestart: true,
			jsonMode: opts.json === true,
			expectedService: before,
			allowInstallRootChange: packageTransaction !== void 0,
			timeoutMs: params.timeoutMs
		}));
		assertCurrent();
		if (stopped.serviceEnv) {
			stopped.serviceEnv = { ...stopped.serviceEnv };
			delete stopped.serviceEnv[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
		}
		stopped.windowsTaskAutoStartRecovery ??= before?.windowsTaskAutoStartRecovery;
		stoppedForRollback = stopped;
		if (stopped.blockMessage || stopped.serviceMutationAllowed === false || stopped.running && !stopped.stopped) throw new Error(stopped.blockMessage ?? "Update service could not be stopped safely.");
		return stopped;
	};
	try {
		assertCurrent();
		if (params.rollbackBlockedReason) return failed(params.rollbackBlockedReason, params.rollbackBlockedReason);
		if (params.definitionRecovery.unverified) return failed("service-definition-rollback-unverified");
		if (!params.schemaVersions) return failed("rollback-state-unverified", "rollback-state-unverified");
		if (!await stateUnchanged()) {
			if (!params.databaseBackup || !run || !packageTransaction) return failed("state-migrated-no-rollback", "state-migrated-no-rollback");
			let restored;
			try {
				restored = await restoreFailedUpdateDatabases({
					backup: params.databaseBackup,
					result,
					runId: run.runId,
					env,
					assertCurrent,
					assertRollbackSafe: packageTransaction.assertRollbackSafe
				});
			} catch (cause) {
				throw new UpdateCommandPendingRecoveryFailure(result, formatErrorMessage(cause), { cause });
			}
			if (!restored || !await stateUnchanged()) return failed("state-migrated-no-rollback", "state-migrated-no-rollback");
		}
		dataAtRisk = void 0;
		await packageTransaction?.assertRollbackSafe?.();
		assertCurrent();
		const definitionBackup = params.definitionRecovery.backup;
		const restoreGeneration = async (assertNativeCurrent) => {
			const assertRestorationCurrent = () => {
				assertCurrent();
				assertNativeCurrent();
			};
			if (definitionBackup) failureReason = "service-definition-rollback-unverified";
			const command = definitionBackup ? await resolveGatewayService().readCommand(recoveryEnv, { requireEffective: true }) : void 0;
			if (definitionBackup && !command) throw new Error("Service definition cannot be inspected for backup restoration.");
			const definition = definitionBackup && command ? {
				env: recoveryEnv,
				command,
				receipt: definitionBackup,
				assertCurrent: assertRestorationCurrent
			} : void 0;
			if (definition) await verifyGatewayServiceDefinitionBackup(definition);
			assertRestorationCurrent();
			const stopped = before?.stopped ? await stop() : void 0;
			const restore = async () => {
				failureReason = "rollback-state-unverified";
				dataAtRisk = "rollback-state-unverified";
				if (!await stateUnchanged()) return failed("state-migrated-no-rollback", "state-migrated-no-rollback");
				dataAtRisk = void 0;
				failureReason = "source-rollback-failed";
				if (!packageTransaction) throw new Error("The retained package transaction is unavailable.");
				assertRestorationCurrent();
				result.rollbackOutcome = {
					status: "failed",
					reason: "Previous generation restoration did not complete"
				};
				const { activePackageRoot, ...restored } = await packageTransaction.rollback(assertCurrent);
				result = {
					...result,
					root: activePackageRoot ?? void 0,
					after: void 0,
					steps: [...result.steps, restored]
				};
				assertRestorationCurrent();
				if (restored.exitCode === 0) {
					result.after = result.before;
					result.recovery = {
						serviceRestartSafe: false,
						packageRollbackVerified: true,
						reason: "runtime-verification-failed"
					};
				} else if (activePackageRoot) {
					result.after = await readPackageUpdateIdentity(activePackageRoot);
					assertRestorationCurrent();
				}
				if (opts.run) recordUpdateRunStep(opts.run.runId, {
					step: "package rollback",
					status: restored.exitCode === 0 ? "completed" : "failed",
					endedAtMs: Date.now(),
					detail: restored.advisory?.message ?? restored.stderrTail ?? restored.reason
				}, { env: opts.run.env });
				if (restored.exitCode !== 0) return failed(restored.reason ?? "source-rollback-failed");
				failureReason = "rollback-state-unverified";
				dataAtRisk = "rollback-state-unverified";
				await assertConfigUnchanged();
				for (const file of changedConfigFiles.toReversed()) {
					await assertConfigUnchanged();
					assertRestorationCurrent();
					const targetPath = file.pathSnapshot?.targetPath ?? file.path;
					if (file.raw === null) await fs$1.rm(targetPath, { force: true });
					else await replaceFileAtomic({
						filePath: targetPath,
						content: file.raw,
						mode: 384,
						dirMode: readExistingStateRootMode(path.dirname(targetPath), resolveStateDir(env)),
						preserveExistingMode: false,
						beforeRename: async () => {
							await assertConfigUnchanged();
							assertRestorationCurrent();
						}
					});
					expectedConfigHashes.set(file.path, hashConfigRaw(file.raw));
				}
				await assertConfigUnchanged();
				assertRestorationCurrent();
				dataAtRisk = void 0;
			};
			const includeLocks = [...new Set(changedConfigFiles.filter((file) => file !== configSnapshot).map((file) => file.pathSnapshot?.targetPath ?? file.path))].toSorted();
			const restoreWithIncludeLocks = async (index) => index === includeLocks.length ? await restore() : await withConfigMutationLock({
				lockPath: includeLocks[index],
				assertCurrent: assertRestorationCurrent
			}, () => restoreWithIncludeLocks(index + 1));
			const refused = changedConfigFiles.length === 0 ? await restore() : await withOwnedManagedUpdateEnv(env, () => withConfigMutationLock({
				lockPath: configSnapshot.path,
				assertCurrent: assertRestorationCurrent
			}, () => restoreWithIncludeLocks(0)));
			assertRestorationCurrent();
			if (refused) return {
				refused,
				stopped
			};
			if (definition) {
				failureReason = "service-definition-rollback-unverified";
				await restoreGatewayServiceDefinitionBackup(definition);
				assertRestorationCurrent();
			}
			return { stopped };
		};
		const restoration = definitionBackup ? await withGatewayServiceOperationLock(recoveryEnv, restoreGeneration) : await restoreGeneration(assertCurrent);
		if (restoration.refused) return restoration.refused;
		result.rollbackOutcome = {
			status: "succeeded",
			reason: "Previous package and configuration restored"
		};
		const { stopped } = restoration;
		if (!stopped || port === void 0) return {
			result,
			rolledBack: false
		};
		const originalVerdict = before?.serviceUpdateVerdict;
		const restoresDifferentService = originalVerdict?.kind === "owned" && originalVerdict.requiresInstallRootRefresh;
		const serviceRoot = restoresDifferentService ? originalVerdict.root : params.previousRoot;
		const serviceIdentity = restoresDifferentService ? before?.serviceIdentity : result.before;
		if (!params.previousVerified || !serviceIdentity?.version) return failed("previous-version-unverified");
		if (restoresDifferentService && !isDeepStrictEqual(await readPackageUpdateIdentity(serviceRoot), serviceIdentity)) return failed("previous-version-unverified");
		assertCurrent();
		const restoredService = restoresDifferentService ? {
			...stopped,
			serviceUpdateVerdict: {
				...originalVerdict,
				refreshDefinition: false,
				requiresInstallRootRefresh: false
			},
			serviceEnv: before?.serviceEnv,
			serviceNodeRunner: before?.serviceNodeRunner,
			servicePort: before?.servicePort,
			serviceIdentity: before?.serviceIdentity,
			serviceManagerUid: before?.serviceManagerUid
		} : stopped;
		failureReason = "service-revalidation-failed";
		await stopped.windowsTaskAutoStartRecovery?.restore(true, createWindowsTaskAutoStartGuard({
			root: serviceRoot,
			before: restoredService,
			timeoutMs: params.timeoutMs
		}), assertCurrent);
		assertCurrent();
		const nodeRunner = before?.serviceNodeRunner ?? params.nodeRunner;
		const state = await readGatewayServiceStateForUpdate(resolveGatewayService(), recoveryEnv, params.timeoutMs, {
			managerUid: restoredService.serviceManagerUid,
			assertCurrent
		});
		let verdict = await revalidateManagedGatewayServiceAfterUpdate({
			state,
			root: serviceRoot,
			preManagedServiceStop: restoredService
		});
		if (verdict.kind === "owned") verdict = {
			...verdict,
			refreshDefinition: false,
			requiresInstallRootRefresh: false
		};
		assertCurrent();
		stoppedForRollback = {
			...restoredService,
			serviceUpdateVerdict: verdict
		};
		result.recovery = {
			serviceRestartSafe: true,
			packageRollbackVerified: true,
			version: serviceIdentity.version,
			reason: "gateway-verification-incomplete",
			...serviceIdentity.buildId ? { buildId: serviceIdentity.buildId } : {}
		};
		assertCurrent();
		if (opts.run) recordUpdateRunStep(opts.run.runId, {
			step: "previous generation restoration",
			status: "completed",
			endedAtMs: Date.now()
		}, { env: opts.run.env });
		failureReason = "restart-unhealthy";
		let verificationFailure;
		let verifiedAtMs;
		const restartOutcome = await maybeRestartService({
			onGatewayStartAttempted: params.onGatewayStartAttempted,
			shouldRestart: true,
			result,
			opts,
			refreshServiceEnv: false,
			expectedGatewayIdentity: {
				version: serviceIdentity.version,
				...serviceIdentity.buildId ? { buildId: serviceIdentity.buildId } : {}
			},
			serviceUpdateVerdict: verdict,
			serviceManagerUid: before?.serviceManagerUid,
			serviceEnv: recoveryEnv,
			serviceInstallEnv: before?.serviceDefinitionEnv,
			gatewayPort: port,
			requireRunningServiceAfterRestart: true,
			timeoutMs: params.timeoutMs,
			nodeRunner,
			invocationCwd: params.invocationCwd,
			onVerified: (at) => {
				verifiedAtMs = at;
			},
			onVerificationFailure: (reason) => {
				verificationFailure = reason;
			}
		});
		assertCurrent();
		const healthy = restartOutcome === "ok";
		return {
			result: {
				...result,
				recovery: {
					...result.recovery,
					service: healthy ? "healthy" : restartOutcome === "readiness-pending" || verificationFailure === "timeout" ? void 0 : verificationFailure || restartOutcome === "restart-health-failed" ? "failed" : void 0,
					reason: healthy ? void 0 : verificationFailure ?? (restartOutcome === "readiness-pending" ? "gateway-readiness-pending" : restartOutcome === "failed" ? "restart-failed" : "restart-unhealthy")
				}
			},
			rolledBack: healthy,
			stoppedForRollback,
			...verifiedAtMs === void 0 ? {} : { verifiedAtMs }
		};
	} catch (error) {
		if (error instanceof UpdateCommandPendingRecoveryFailure || hasCommandProcessCleanupError(error)) throw error;
		const detail = formatErrorMessage(error);
		try {
			assertCurrent();
		} catch (cause) {
			return {
				...pendingRecovery(result, formatErrorMessage(cause)),
				stoppedForRollback
			};
		}
		if (error instanceof NativePackageRollbackError) failureReason = error.reason;
		assertCurrent();
		const step = {
			name: "package rollback",
			command: "restore previous generation",
			cwd: params.previousRoot,
			durationMs: 0,
			exitCode: 1,
			stderrTail: detail,
			warnings: failureReason === "service-definition-rollback-unverified" ? [detail] : []
		};
		if (step.warnings.length) result.steps.push(step);
		if (run) {
			const endedAtMs = Date.now();
			for (const row of updateRunStepsFromResultStep(step)) recordUpdateRunStep(run.runId, {
				...row,
				detail,
				endedAtMs
			}, { env: run.env });
		}
		return failed(failureReason, dataAtRisk);
	}
}
//#endregion
//#region src/cli/update-cli/update-command-post-update.ts
async function finishUpdate(params, { beforeFinalization, ...options } = {}) {
	const captured = captureUpdateFinalization(params);
	return await withUpdateProgressSettlement(params, beforeFinalization, (settled, failure) => finishSettledUpdate(settled, options, captured, failure));
}
async function finishSettledUpdate(params, { candidateRuntime = false, adoptedFinalization, onGatewayStartAttempted: observeGatewayStartAttempted }, captured, progressFailure) {
	const { fence, assertCurrent, compensate, forward } = captured;
	let gatewayStartAttempted;
	const onGatewayStartAttempted = (action = "restart") => {
		gatewayStartAttempted = gatewayStartAttempted === "restart" ? gatewayStartAttempted : action;
		observeGatewayStartAttempted?.();
	};
	const definitionRecovery = {};
	const parkForegroundOrigin = () => parkForegroundUpdateForActivation(params, assertCurrent);
	assertCurrent();
	await assertUpdateCommandPackageFinalization(params);
	const shouldRestart = progressFailure ? false : await preparePostUpdateService(params, assertCurrent);
	assertCurrent();
	const { createFailure, settleResult } = bindUpdateFinalizationFailure(progressFailure);
	let rollbackAttempted = false;
	let latestServiceStop = params.preManagedServiceStop;
	const currentServiceStop = () => latestServiceStop;
	let rolledBack = false;
	let originalServiceRecoveryHandled = false;
	let completedDowntimeMs = params.coreAlreadyCurrent ? 0 : void 0;
	let pendingRestartAtMs = params.preManagedServiceStop?.stoppedAtMs ?? params.controlPlaneUpdateSentinelMeta?.serviceStoppedAtMs;
	const recordVerifiedDowntime = (verifiedAtMs) => {
		if (pendingRestartAtMs !== void 0) {
			completedDowntimeMs = (completedDowntimeMs ?? 0) + Math.max(0, verifiedAtMs - pendingRestartAtMs);
			pendingRestartAtMs = void 0;
		}
	};
	assertCurrent();
	recordUpdateResultNextAction(params, params.result);
	let pendingResult = params.result;
	let settledResult;
	let terminalRecord;
	let pendingNotify = true;
	const writeRestartSentinel = (result) => writeControlPlaneUpdateRestartSentinelBestEffort({
		...captured.sentinelOptions,
		result
	});
	const publishFinalResult = (failure, onTerminalRecord) => publishSettledUpdateCommandResult(params, {
		pendingResult,
		failure,
		terminalRecord,
		readReportingState: () => ({
			notify: pendingNotify ? writeRestartSentinel : void 0,
			rolledBack,
			pendingRestartAtMs,
			completedDowntimeMs
		})
	}, onTerminalRecord);
	const deferredTerminal = deferUpdateCommandTerminalResult(params.opts.run, publishFinalResult);
	const recoverFailedResult = async (initialResult, initialRecoverService) => {
		fence();
		if (params.databaseBackup?.restoreRefusal) params.rollbackBlockedReason = "state-migrated-no-rollback";
		let result = initialResult;
		if (refuseUnsettledDoctorRecovery(result, result.root ?? params.root, assertCurrent)) return {
			result,
			recoverService: false
		};
		let recoverService = initialRecoverService && !params.rollbackBlockedReason;
		if (result.status === "error" && (params.packageTransaction || params.rollbackBlockedReason || params.originalManagedServiceRuntime) && !rollbackAttempted && !isUpdateGatewayReadinessPending(result)) {
			rollbackAttempted = true;
			const rollback = await compensate(() => withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, () => rollbackFailedUpdate({
				...params,
				result,
				previousRoot: params.root,
				databaseBackup: captured.beganSuccessfully && !gatewayStartAttempted ? params.databaseBackup : void 0,
				allowGatewayRestart: params.shouldRestart,
				onGatewayStartAttempted,
				preManagedServiceStop: currentServiceStop(),
				timeoutMs: params.updateStepTimeoutMs,
				nodeRunner: params.packageUpdateNodeRunner,
				definitionRecovery
			})));
			if (params.originalManagedServiceRuntime && rollback.pendingRecoveryReason) throw new UpdateCommandPendingRecoveryFailure(rollback.result, rollback.pendingRecoveryReason);
			result = rollback.result;
			originalServiceRecoveryHandled = rollback.originalServiceRecovery !== void 0;
			latestServiceStop = rollback.stoppedForRollback ?? currentServiceStop();
			rolledBack = rollback.rolledBack;
			pendingRestartAtMs ??= latestServiceStop?.stoppedAtMs;
			if (rollback.verifiedAtMs !== void 0) recordVerifiedDowntime(rollback.verifiedAtMs);
			recoverService = false;
		}
		if (result.status === "error" && params.rollbackBlockedReason) result = completeUpdateCommandResult(params, result);
		else if (result.status === "error" && params.result.status === "ok" && !params.packageTransaction && params.opts.run) recordUpdateRunStep(params.opts.run.runId, {
			step: "package rollback",
			status: "skipped",
			endedAtMs: Date.now(),
			detail: "No retained previous package transaction is available; automatic package restoration was not attempted."
		}, { env: params.opts.run.env });
		const recoveryParams = {
			...params,
			preManagedServiceStop: currentServiceStop()
		};
		recoverService ||= !gatewayStartAttempted && await admitInstalledGatewayRecovery(recoveryParams, result, assertCurrent);
		if (recoverService) params.rollbackBlockedReason = void 0;
		if (isUpdateGatewayReadinessPending(result)) return {
			result,
			recoverService: false
		};
		return {
			result,
			recoverService
		};
	};
	const reportResult = async (initialResult, initialRecoverService = false, initialRestoreFailure, notify = true) => {
		const input = captured.interruptedResult(initialResult);
		const { result, recoverService } = await recoverFailedResult(input, initialRecoverService);
		assertCurrent();
		let restoreFailure = initialRestoreFailure;
		let finalResult = completeUpdateCommandResult(params, result, currentServiceStop());
		const serviceVerdict = currentServiceStop()?.serviceUpdateVerdict;
		let root = finalResult.recovery?.packageRollbackVerified && serviceVerdict?.kind === "owned" ? serviceVerdict.root : finalResult.root ?? params.root;
		pendingResult = finalResult;
		pendingNotify = notify;
		if (!restoreFailure) try {
			if (!rolledBack && finalResult.status !== "ok" && !isUpdateGatewayReadinessPending(finalResult) && finalResult.recovery?.serviceRestartSafe !== true) {
				if (finalResult.recovery?.serviceRestartSafe === false && finalResult.recovery.dataAtRisk) await currentServiceStop()?.windowsTaskAutoStartRecovery?.complete(false);
			} else await resumePostUpdateWindowsAutoStart(params, finalResult, currentServiceStop);
		} catch (cause) {
			restoreFailure = { cause };
		}
		if (restoreFailure) {
			rolledBack = false;
			restoreFailure = await settlePostUpdateWindowsAutoStartFailure(params, finalResult, result, restoreFailure.cause, currentServiceStop);
		}
		const completedBeforeCleanup = deferredTerminal ? await captureUpdateCommandTerminalRecord(params, finalResult, assertCurrent) : void 0;
		assertCurrent();
		recordUpdateResultNextAction(params, finalResult, completedBeforeCleanup?.record);
		if (notify && recoverService) {
			pendingNotify = false;
			await writeRestartSentinel(finalResult);
		}
		if (recoverService && finalResult.recovery?.serviceRestartSafe === true) {
			const service = await maybeRestartServiceAfterFailedMutableUpdate({
				onGatewayStartAttempted,
				recovery: finalResult.recovery,
				originalManagedServiceRuntime: params.originalManagedServiceRuntime,
				updateRun: params.opts.run,
				preManagedServiceStop: currentServiceStop(),
				jsonMode: Boolean(params.opts.json),
				nodeRunner: params.packageUpdateNodeRunner,
				timeoutMs: params.updateStepTimeoutMs,
				invocationCwd: params.invocationCwd
			});
			if (service && !params.originalManagedServiceRuntime) {
				root = serviceVerdict && "root" in serviceVerdict ? serviceVerdict.root : root;
				finalResult.recovery = {
					...finalResult.recovery,
					service
				};
				if (service === "failed") {
					finalResult.status = "error";
					try {
						await currentServiceStop()?.windowsTaskAutoStartRecovery?.complete(false);
					} catch (cause) {
						return await reportResult(finalResult, false, { cause }, false);
					}
				}
			}
		}
		assertCurrent();
		const cleanupFailure = await recordUpdatePackageCompletion(params, finalResult, assertCurrent);
		assertCurrent();
		finalResult = cleanupFailure?.result ?? finalResult;
		if ((cleanupFailure || !rolledBack && finalResult.status === "error") && !originalServiceRecoveryHandled) {
			finalResult = await verifyUpdateFailureRecovery({
				result: finalResult,
				root,
				opts: params.opts,
				env: currentServiceStop()?.serviceEnv ?? params.ownedManagedUpdateEnv,
				timeoutMs: params.updateStepTimeoutMs,
				mutationStarted: params.mutationStarted,
				preManagedServiceStop: currentServiceStop(),
				gatewayStartAttempted,
				definitionRecovery,
				onGatewayStartAttempted,
				nodeRunner: params.packageUpdateNodeRunner,
				invocationCwd: params.invocationCwd,
				serviceStopped: !rolledBack && currentServiceStop()?.stopped,
				serviceUpdateVerdict: gatewayStartAttempted ? void 0 : currentServiceStop()?.serviceUpdateVerdict,
				waitForStartup: shouldWaitForRecovery(params, currentServiceStop(), rollbackAttempted),
				assertCurrent
			});
			assertCurrent();
			rolledBack &&= isVerifiedUpdateRollback(finalResult);
		}
		try {
			await currentServiceStop()?.windowsTaskAutoStartRecovery?.complete(rolledBack || isUpdateGatewayReadinessPending(finalResult) || finalResult.status === "ok" || finalResult.recovery?.serviceRestartSafe === true && finalResult.recovery.service === "healthy");
		} catch (cause) {
			rolledBack = false;
			restoreFailure = await settlePostUpdateWindowsAutoStartFailure(params, finalResult, result, cause, currentServiceStop);
		}
		pendingResult = completeUpdateCommandResult(params, captured.interruptedResult(finalResult));
		terminalRecord = deferredTerminal ? await captureUpdateCommandTerminalRecord(params, pendingResult, assertCurrent) : void 0;
		assertCurrent();
		const reportedResult = deferredTerminal ? pendingResult : await publishFinalResult();
		if (cleanupFailure) {
			const { detail } = cleanupFailure;
			throw new UpdateCommandFailure(reportedResult, 1, detail, { cause: cleanupFailure });
		}
		if (restoreFailure) {
			const priorDetail = [result.reason, params.failure?.detail].filter(Boolean).join(": ");
			const detail = `${priorDetail ? `${priorDetail}; ` : ""}Windows Scheduled Task autostart recovery failed: ` + formatErrorMessage(restoreFailure.cause);
			const cause = params.failure ? new AggregateError([params.failure.cause, restoreFailure.cause], detail, { cause: restoreFailure.cause }) : restoreFailure.cause;
			throw createFailure(reportedResult, detail, { cause });
		}
		settledResult = reportedResult;
		return reportedResult;
	};
	const restoreWindowsAutoStart = (result) => resumePostUpdateWindowsAutoStart(params, result, currentServiceStop, { onFailure: (cause) => reportResult(result, false, { cause }) });
	let resultWithPostUpdate = params.result;
	let activationVerified = false;
	const runPostUpdate = async () => {
		try {
			if (params.coreAlreadyCurrent && params.deferredMaintenance) {
				defaultRuntime.error(params.deferredMaintenance);
				return params.result;
			}
			if (params.result.status === "error" || params.result.recovery?.serviceRestartSafe === false) {
				const reported = await reportResult({
					...params.result,
					status: "error"
				}, params.result.recovery?.serviceRestartSafe === true);
				return settleResult(reported, params.failure?.detail, params.failure);
			}
			if (params.result.status === "skipped" && !params.coreAlreadyCurrent) {
				const reported = await reportResult(params.result, params.result.recovery?.serviceRestartSafe === true);
				throw createFailure(reported, void 0, void 0, classifyUpdateOutcome(reported) === "failed" ? void 0 : 0);
			}
			const postUpdateRoot = params.result.root ?? params.root;
			const deferPluginConvergence = shouldRestart && params.preManagedServiceStop?.serviceMutationAllowed !== false && params.coreAlreadyCurrent === true && params.preManagedServiceStop?.serviceUpdateVerdict?.kind === "owned";
			const runsPostActivationInspections = shouldRestart && (!params.coreAlreadyCurrent || deferPluginConvergence) && (!candidateRuntime || adoptedFinalization || isUpdateDoctorInspectionReportMode(process.env));
			const convergePlugins = async (beforeDoctor) => {
				const pluginParams = {
					...params,
					beforeDoctor: beforeDoctor ?? parkForegroundOrigin,
					beforeRuntimePublication: parkForegroundOrigin,
					assertCurrent,
					candidateRuntime,
					deferPostActivationInspections: runsPostActivationInspections
				};
				const convergence = await forward(() => convergeUpdatePlugins(pluginParams));
				if (convergence.resultWithPostUpdate.status === "error") {
					const reported = await reportResult(convergence.resultWithPostUpdate);
					throw createFailure(reported, convergence.detail);
				}
				return convergence;
			};
			let postUpdateConfigSnapshot;
			if (!deferPluginConvergence) {
				({resultWithPostUpdate, postUpdateConfigSnapshot} = await convergePlugins());
				if (params.coreAlreadyCurrent) {
					if (params.preManagedServiceStop?.serviceUpdateVerdict?.kind === "absent" && params.preManagedServiceStop.serviceMutationSkipMessage) defaultRuntime.error(params.preManagedServiceStop.serviceMutationSkipMessage);
					else if (params.preManagedServiceStop?.serviceMutationSkipMessage) recordServiceReconciliationWarning(resultWithPostUpdate, params.preManagedServiceStop.serviceEnv ?? process.env, params.preManagedServiceStop.serviceMutationSkipMessage);
					return resultWithPostUpdate;
				}
			}
			const restartConfigSnapshot = postUpdateConfigSnapshot ?? await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, async () => withUpdateStateRead(() => readConfigFileSnapshot({
				observe: false,
				skipPluginValidation: true,
				suppressFutureVersionWarning: true
			}), params.opts.run?.deadline?.remainingMs() ?? params.updateStepTimeoutMs));
			let restartContext;
			try {
				restartContext = await withUpdateStateRead(() => prepareUpdateRestart({
					...params,
					shouldRestart,
					result: resultWithPostUpdate,
					assertCurrent
				}, restartConfigSnapshot), params.opts.run?.deadline?.remainingMs() ?? params.updateStepTimeoutMs);
			} catch (error) {
				const message = error instanceof GatewayServiceUpdateOwnershipError ? error.message : formatErrorMessage(error);
				defaultRuntime.error(message);
				const reported = await reportResult({
					...resultWithPostUpdate,
					status: "error",
					reason: "service-revalidation-failed"
				});
				throw createFailure(reported, message, { cause: error });
			}
			const notifyRestart = () => writeRestartSentinel(buildControlPlaneUpdateRestartHealthPendingResult(resultWithPostUpdate));
			if (!params.coreAlreadyCurrent) {
				await notifyRestart();
				await restoreWindowsAutoStart(resultWithPostUpdate);
			}
			let verificationFailure = "restart-unhealthy";
			const restart = async () => {
				const restarted = await forward(() => maybeRestartService({
					onGatewayStartAttempted,
					originalManagedServiceRuntime: params.originalManagedServiceRuntime,
					shouldRestart: shouldRestart && restartContext.serviceMutationAllowed,
					observePackageReplacement: params.opts.restart === false && currentServiceStop()?.running === true,
					result: resultWithPostUpdate,
					opts: params.opts,
					refreshServiceEnv: restartContext.refreshGatewayServiceEnv,
					definitionRecovery,
					serviceUpdateVerdict: restartContext.serviceUpdateVerdict,
					serviceManagerUid: restartContext.serviceManagerUid,
					serviceRuntimeRefreshRequired: params.serviceRuntimeRefreshRequired,
					serviceEnv: restartContext.gatewayServiceEnv,
					serviceInstallEnv: restartContext.gatewayServiceInstallEnv,
					gatewayPort: restartContext.gatewayPort,
					invocationCwd: params.invocationCwd,
					nodeRunner: params.packageUpdateNodeRunner,
					skipLegacyServiceRestart: restartContext.skipLegacyServiceRestart,
					requireRunningServiceAfterRestart: currentServiceStop()?.stopped === true,
					serviceMutationSkipMessage: restartContext.serviceMutationSkipMessage,
					timeoutMs: params.updateStepTimeoutMs,
					onVerificationFailure: (reason) => {
						verificationFailure = reason;
					},
					onPluginWarnings: (warnings) => {
						resultWithPostUpdate = appendPluginUpdateWarnings(resultWithPostUpdate, warnings);
					},
					onVerified: (verifiedAtMs) => {
						activationVerified = true;
						recordVerifiedDowntime(verifiedAtMs);
					}
				}));
				if (restarted !== "failed" && restarted !== "restart-health-failed") return restarted === "ok";
				if (activationVerified && restarted === "restart-health-failed") throw new GatewayRestartHealthError(`Restart finalization: ${verificationFailure}.`);
				const failure = {
					...resultWithPostUpdate,
					status: "error",
					reason: verificationFailure,
					recovery: unsafeUpdateRecovery(resultWithPostUpdate.recovery)
				};
				const recovered = await recoverFailedResult(failure, false);
				if (recovered.result.status !== "ok") {
					await markControlPlaneUpdateRestartSentinelFailureBestEffort({
						...captured.sentinelOptions,
						reason: recovered.result.reason ?? verificationFailure
					});
					const reported = await reportResult(recovered.result, false, void 0, false);
					return settleResult(reported);
				}
				resultWithPostUpdate = recovered.result;
				return true;
			};
			if (!params.coreAlreadyCurrent) {
				const recovered = await restart();
				if (typeof recovered !== "boolean") return recovered;
			}
			if (deferPluginConvergence) {
				({resultWithPostUpdate, postUpdateConfigSnapshot} = await convergePlugins(async () => {
					const stopped = await parkPostUpdateService(params, {
						before: currentServiceStop(),
						updateRun: captured.originalRun,
						recordPhase: captured.recordPhase,
						assertCurrent,
						mode: resultWithPostUpdate.mode,
						root: postUpdateRoot,
						onStopped: (state) => {
							latestServiceStop = state;
							pendingRestartAtMs ??= state.stoppedAtMs;
						},
						onPrepared: (state) => {
							latestServiceStop = state;
						}
					});
					pendingRestartAtMs ??= stopped.stoppedAtMs;
				}));
				const requiresInstallRootRefresh = restartContext.serviceUpdateVerdict?.kind === "owned" && restartContext.serviceUpdateVerdict.requiresInstallRootRefresh;
				if (resultWithPostUpdate.postUpdate?.plugins?.changed || params.serviceRuntimeRefreshRequired || requiresInstallRootRefresh) {
					restartContext = await prepareUpdateRestart({
						...params,
						result: resultWithPostUpdate,
						shouldRestart,
						preManagedServiceStop: currentServiceStop(),
						assertCurrent
					}, postUpdateConfigSnapshot ?? restartConfigSnapshot);
					pendingRestartAtMs ??= Date.now();
					if (!params.serviceRuntimeRefreshRequired && !requiresInstallRootRefresh) restartContext.refreshGatewayServiceEnv = false;
					await notifyRestart();
					await restoreWindowsAutoStart(resultWithPostUpdate);
					const reconciled = await restart();
					if (typeof reconciled !== "boolean") return reconciled;
					if (requiresInstallRootRefresh && reconciled && resultWithPostUpdate.status === "skipped") {
						resultWithPostUpdate.status = "ok";
						delete resultWithPostUpdate.reason;
					}
				}
			}
			if (resultWithPostUpdate.status === "ok" && runsPostActivationInspections && resultWithPostUpdate.steps.some((step) => step.deferredInspectionCheckIds !== void 0)) {
				assertCurrent();
				resultWithPostUpdate = await forward(() => runPostActivationInspections({
					root: postUpdateRoot,
					result: resultWithPostUpdate,
					gatewayReady: activationVerified,
					timeoutMs: params.updateStepTimeoutMs,
					nodeRunner: params.packageUpdateNodeRunner,
					ownedManagedUpdateEnv: params.ownedManagedUpdateEnv
				}));
			}
			if (deferPluginConvergence) return resultWithPostUpdate;
			const maintenanceFailure = await completePostUpdateMaintenance(params, resultWithPostUpdate, assertCurrent, {
				root: postUpdateRoot,
				sentinel: captured.sentinelOptions,
				activationVerified
			});
			if (maintenanceFailure) {
				const reported = await reportResult(maintenanceFailure.result, false, void 0, false);
				throw createFailure(reported, maintenanceFailure.detail, void 0, 1);
			}
			return resultWithPostUpdate;
		} catch (error) {
			if (params.originalManagedServiceRuntime && error instanceof UpdateCommandRecoveryPendingError) throw new UpdateCommandPendingRecoveryFailure(pendingResult, formatErrorMessage(error), { cause: error });
			if (shouldPropagatePostUpdateException(error, activationVerified)) throw error;
			const { result, message } = createPostUpdateExceptionResult({
				...params,
				result: resultWithPostUpdate
			}, error, activationVerified);
			if (result.status === "ok") {
				assertCurrent();
				defaultRuntime.error(message);
				return result;
			}
			defaultRuntime.error(`Post-update verification failed: ${message}`);
			const reported = await reportResult(result);
			throw createFailure(reported, message, { cause: error });
		}
	};
	const result = await runPostUpdate();
	return settledResult === result ? result : await reportResult(result);
}
//#endregion
export { stopSupervisedPredecessorGateway as a, createUpdateTimeoutHandoff as c, createUpdateCommandExecutionGuards as i, isOmittedUpdateTimeout as l, captureUpdateDatabases as n, resumePostCoreUpdate as o, restoreFailedUpdateDatabases as r, writePostCoreUpdateFailureFile as s, finishUpdate as t };
