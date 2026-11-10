import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { l as tryReadJson } from "./json-files-DYmSFHoN.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { i as prepareOpenClawStateReadSource } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-LfC_CFuw.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-l0GQCX9n.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { i as withConfigWriteLock } from "./write-lock-BlX1pI0w.mjs";
import { a as prepareDeferredPluginMigrationRuntime } from "./deferred-plugin-migrations-CSwavNpj.mjs";
import { t as unsafeUpdateRecovery } from "./update-recovery-BLzKrbsf.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { f as ScheduledTaskAutoStartRecoveryError } from "./schtasks-Cm91eO2_.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { b as UpdatePreMutationError, t as canResolveRegistryVersionForPackageTarget } from "./update-global-BlXQRfes.mjs";
import { i as reportUpdateStepCompletion } from "./update-runner-command-DETznIV7.mjs";
import { t as createUpdateDoctorConfigWarningStep } from "./update-doctor-config-BrLAVDg0.mjs";
import { a as isUpdatePostInstallVerificationDeferred, i as isUpdateGatewayReadinessPending, r as isFailedUpdateStep } from "./update-run-step-Db60sdKj.mjs";
import { a as UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV, s as UPDATE_POST_ACTIVATION_INSPECTIONS_REPORT_MODE } from "./update-phase-M5rvMZiC.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { f as withUpdateCommandExecutorChild, m as UpdateCommandRecoveryPendingError, u as requiresRetainedUpdateCommandOwner } from "./update-command-executor-DUq8yLzH.mjs";
import { c as createUpdateTimeoutHandoff, i as createUpdateCommandExecutionGuards, n as captureUpdateDatabases, o as resumePostCoreUpdate, r as restoreFailedUpdateDatabases, t as finishUpdate } from "./update-command-post-update-D8VLqpuI.mjs";
import { o as normalizeTag, u as resolveGitInstallDir } from "./shared-DRiGAorf.mjs";
import { n as maybeRepairLegacyConfigForUpdateChannel, s as readUpdateChannelConfig } from "./update-command-config-CDBhVGHw.mjs";
import { a as inspectSourceUpdateArtifacts, i as releaseLegacySourceLock } from "./update-command-plugins-Dus0-ODD.mjs";
import { c as stripGatewayServiceMarkerEnv, l as withOwnedManagedUpdateEnv, s as resolveUpdatedInstallCommandEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { o as recordUpdateRunStepAsync } from "./update-run-write.async-c2y7GgO-.mjs";
import { c as handoffUpdateFromGateway, i as UpdateCommandAbort, l as parkForegroundUpdateForActivation, n as maybeStopManagedServiceBeforeMutableUpdate, r as mutableUpdateGatewayServiceBlock, s as formatUpdateAncestryBlockMessage, t as createWindowsTaskAutoStartGuard } from "./update-command-service-maintenance-DvLJF4Bi.mjs";
import { n as GatewayServiceUpdateOwnershipError } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { r as assertManagedGatewayArtifactPublication } from "./update-command-service-publication-Cwq6T0wO.mjs";
import { g as isUpdatedInstallGatewayExecutorSupported, r as verifyPreviousManagedGatewayForUpdate, s as maybeRestartServiceAfterFailedMutableUpdate, u as observeOriginalManagedServiceRuntime } from "./update-command-verification-D_6SIpZK.mjs";
import { c as readUpdateStateSchemaVersions, f as updateStateSchemaVersionsMatch, u as resolveUpdateStateContentVersion } from "./update-candidate-state-fXM6fMqw.mjs";
import { o as isCandidateAdmissionContextCovered, t as assertReadableGitMetadata } from "./schema-preflight-Dfpu1-Iv.mjs";
import { a as assertUpdateCommandRecovery, c as readOriginalUpdateRecovery, r as updateGitInstall, s as createUpdateCommandFinalizationFence } from "./update-command-git-BFD7pJNr.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { n as runPackageInstallUpdate } from "./update-command-package-Cj3ya4Kc.mjs";
import { a as collectServiceInspectionFailureFacts, n as UpdateCommandFailure, v as resolveMutableUpdateFailure } from "./update-command-result-BgqRj9_Z.mjs";
import { r as recordMutableUpdateInterruption, s as withMutableUpdateForwardScope } from "./update-command-mutable-signals-D0wsAuNf.mjs";
import { i as readUpdateCandidateSource, n as captureOwnedManagedUpdateContext } from "./update-command-managed-context-CxkSVUSh.mjs";
import { a as recordUpdatePackageCompletion, x as createPackageUpdateActivationOptions } from "./update-command-terminal-CPGdOHR-.mjs";
import { i as prepareUpdateDatabaseBackupRuntime } from "./update-database-backup-aeI_iiyz.mjs";
import { t as resolveUpdateFinalizationTimeoutMs } from "./update-finalization-budget-DHF5JlHv.mjs";
import { t as preflightConfiguredNpmPluginTargets } from "./update-command-plugin-preflight-BcU5eUJb.mjs";
import { r as revalidateUpdateDatabaseContexts, t as inspectUpdateDatabaseContexts } from "./update-command-database-context-DRSOBnuV.mjs";
import { i as createPackageRuntimeRecovery, s as resolvePackageRuntimePreflight, t as captureUpdateActivationSchemas } from "./update-command-schema-DFPuQCTq.mjs";
import "./io.write-y7RvdKE_.mjs";
import { t as validateUpdateCandidateCanary } from "./update-candidate-canary-TznUhj2G.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/infra/update-database-engine-admission.ts
/** The installed driver checks physical stores before candidate database mutation or publication. */
async function assertUpdateDatabaseEngineContexts(contexts, readTargetEngines) {
	const { discoverBackupDatabasePaths } = await import("./backup-sqlite-snapshot-BsMn1C0h.mjs");
	const { readBackupEngine } = await import("./database-backup-DtIZf0VT.mjs");
	for (const context of contexts) {
		const postgres = (await discoverBackupDatabasePaths({
			...context,
			stateDir: resolveStateDir(context.env)
		})).find((pathname) => readBackupEngine(pathname).engine === "postgres");
		if (!postgres) continue;
		const engines = await readTargetEngines() ?? ["sqlite"];
		if (!Array.isArray(engines) || !engines.includes("postgres")) throw new UpdatePreMutationError("database-engine-preflight", `Update refused: the target does not support the PostgreSQL store at ${postgres}. Reverse-port to SQLite with the current binary before updating, or stay on the current version. See https://docs.openclaw.ai/reference/database-engines.`);
	}
}
//#endregion
//#region src/cli/update-cli/update-command-candidate-validation.ts
async function preflightUpdateCandidatePlugins(execution, params) {
	const admission = await params.readAdmission();
	const context = admission.foreground ? admission.contexts[0] : admission.contexts.at(-1);
	if (params.candidateAdmissionChecks?.includes("plugin-availability") && isCandidateAdmissionContextCovered(context.env)) return;
	const { preflightConfiguredNpmPluginTargets } = await import("./update-command-plugin-preflight-G9u29LUh.mjs");
	const warnings = await preflightConfiguredNpmPluginTargets({
		config: context.configSnapshot.sourceConfig,
		env: context.env,
		targetVersion: params.targetVersion,
		channel: execution.channel,
		timeoutMs: execution.updateStepTimeoutMs
	});
	for (const warning of warnings) defaultRuntime[execution.opts.json ? "error" : "log"](warning.message);
}
async function validateUpdateCandidateWithProgress(params, execution, run) {
	const assertCurrent = params.assertCurrent;
	const writeOptions = run ? { ...params.writeOptions } : void 0;
	const originalContext = writeOptions?.context;
	const source = originalContext ? prepareOpenClawStateReadSource({
		path: originalContext.admission.databasePath,
		env: writeOptions?.env
	}) : void 0;
	if (originalContext && source) {
		const initial = source.current();
		originalContext.admission.assertCurrent();
		if (initial.admission.identity.key !== originalContext.admission.identity.key || initial.admission.identity.birthtime !== originalContext.admission.identity.birthtime || initial.maintenanceScope !== originalContext.maintenanceScope || initial.existingSchemaPath !== originalContext.existingSchemaPath) throw new Error("Candidate progress lost its original state source.");
	}
	const validate = () => validateUpdateCandidateCanary({
		...params,
		sourceBundledPlugins: params.sourcePackageRoot ? {
			packageRoot: params.sourcePackageRoot,
			directory: resolveBundledPluginsDir(params.env)
		} : void 0,
		assertCurrent,
		stateDir: resolveStateDir(params.env),
		nodeRunner: execution.packageUpdateNodeRunner,
		timeoutMs: execution.timeoutMs,
		onProgress: async (step) => {
			assertCurrent();
			if (run) await recordUpdateRunStepAsync(run.runId, step, {
				...writeOptions,
				context: source?.workerContext()
			});
			assertCurrent();
			defaultRuntime[execution.opts.json ? "error" : "log"](`${step.step}: ${step.detail ?? step.status}`);
		},
		onStep: (step) => reportUpdateStepCompletion(execution.progress, {
			...step,
			index: 0,
			total: 0
		})
	});
	const validation = source && run ? await runOpenClawStateWorkerOperation(source.workerContext(), validate, {
		existingOnly: true,
		assertCurrent
	}) : await validate();
	if (!validation) throw new Error("Candidate progress database disappeared before snapshot admission.");
	assertCurrent();
	const changes = validation.doctorConfigChanges ?? [];
	if (validation.status === "ok" && validation.doctorConfigWrites !== true && changes.length) {
		const warning = createUpdateDoctorConfigWarningStep(params.root, changes);
		validation.steps.push(warning);
		await reportUpdateStepCompletion(execution.progress, {
			...warning,
			index: 0,
			total: 0
		});
		assertCurrent();
	}
	return validation;
}
function assertUpdateCandidateSteps(steps) {
	const failed = steps.find(isFailedUpdateStep);
	if (failed) throw new UpdatePreMutationError(failed.name, failed.stderrTail ?? "Update checks failed.", { failureFacts: failed.failureFacts });
}
/** Reject candidates that cannot retain the installed updater's native authority. */
async function assertUpdateCandidateExecutor(params) {
	if (!params.shouldRestart || !params.run || !params.serviceOwned) return;
	params.assertCurrent();
	const executor = params.run.executorFence;
	if (!executor) throw new UpdatePreMutationError("target-native-unsupported", "Starting the update requires its original update process.");
	const supported = await isUpdatedInstallGatewayExecutorSupported({
		root: params.root,
		env: resolveUpdatedInstallCommandEnv({
			processEnv: params.env,
			invocationCwd: params.invocationCwd
		}),
		executor,
		timeoutMs: params.timeoutMs,
		nodeRunner: params.nodeRunner
	});
	params.assertCurrent();
	if (!supported) throw new UpdatePreMutationError("target-native-unsupported", "Target runtime cannot fence update-owned native commands; refusing before Gateway stop or package activation.");
}
//#endregion
//#region src/cli/update-cli/update-command-execution-settlement.ts
async function settleMutableUpdateResult(params, settlement) {
	const { opts } = params;
	const { databaseBackup, databaseCaptureStep, activationSteps, packageTransaction } = settlement;
	const originalRun = settlement.originalRun;
	let result = recordMutableUpdateInterruption(opts, settlement.result);
	if (result.status === "ok" && opts.restart === false && result.steps.some(isUpdatePostInstallVerificationDeferred)) result = {
		...result,
		status: "skipped",
		reason: "gateway-readiness-unverified"
	};
	if (settlement.candidateFailureReason && result.status === "error") result.reason = settlement.candidateFailureReason;
	if (databaseCaptureStep || activationSteps.length) result.steps = [
		...databaseCaptureStep ? [databaseCaptureStep] : [],
		...result.steps,
		...activationSteps
	];
	const doctorSettled = settlement.doctorEntered && !hasCommandProcessCleanupError(settlement.failure?.cause);
	if (databaseBackup && originalRun && result.status === "error" && doctorSettled) await restoreFailedUpdateDatabases({
		backup: databaseBackup,
		result,
		runId: originalRun.runId,
		env: settlement.env ?? originalRun.env,
		assertCurrent: settlement.assertCurrent,
		assertRollbackSafe: packageTransaction?.assertRollbackSafe,
		progress: params.progress
	});
	return result;
}
//#endregion
//#region src/cli/update-cli/update-command-git-admission.ts
async function admitSourceUpdateArtifacts(root, run) {
	try {
		const prepared = await inspectSourceUpdateArtifacts(root);
		if (prepared.lock && !run) {
			await prepared.lock.release();
			throw new Error("Source artifact admission requires an active update run.");
		}
		if (run) run.sourceArtifactLock = prepared.lock;
		return prepared.sourceRuntimePrepared;
	} catch (cause) {
		throw new UpdatePreMutationError("source-artifact-ownership", formatErrorMessage(cause), { cause });
	}
}
async function recordInspectedGitTarget(target, recordPhase, assertCurrent) {
	assertCurrent();
	await recordPhase("staging", { target: {
		kind: "git",
		sha: target.sha,
		version: target.version
	} });
	assertCurrent();
	assertReadableGitMetadata(target.metadataUnreadable);
}
//#endregion
//#region src/cli/update-cli/update-command-execution.ts
async function executeMutableUpdate(params) {
	const { opts, updateStepTimeoutMs } = params;
	const candidateAdmissionChecks = params.updateInstallKind === "package" ? opts.run?.candidateAdmissionChecks : void 0;
	const configValidation = candidateAdmissionChecks?.includes("config") ? "candidate" : void 0;
	const databaseContextOptions = {
		...params,
		jsonMode: Boolean(opts.json),
		timeoutMs: updateStepTimeoutMs,
		candidateAdmissionChecks
	};
	const originalRun = opts.run;
	const requesterAuthority = originalRun?.requesterAuthority;
	const { assertCurrent: assertExecutionCurrent, assertBoundChildCurrent, onStateHandoff, admitExecutor, captureWriteOptions, recordPhase } = params.executionGuards;
	let retentionInstallTarget = params.packageInstallTarget;
	const prepareMutableUpdate = async (env, activationTimeoutMs) => {
		await params.assertPackageRuntimeCurrent?.();
		assertExecutionCurrent();
		await params.prepareMutableUpdate(env, activationTimeoutMs, admitExecutor, retentionInstallTarget);
		assertExecutionCurrent();
	};
	const mode = params.updateInstallKind === "git" ? "git" : params.packageInstallTarget?.manager ?? "unknown";
	if (opts.recovery) throw new UpdatePreMutationError("update-recovery-pending", "Full-state checkpoint recovery is deferred.");
	assertUpdateCommandRecovery(opts);
	const stagedPluginAdmission = params.updateInstallKind === "package" && !canResolveRegistryVersionForPackageTarget(params.packageInstallSpec ?? params.tag);
	let preManagedServiceStop;
	let ownedManagedUpdateContext;
	let admission;
	let gitContextPrepared = false;
	let admittedTargetSchemaVersions = params.packageTargetSchemaVersions;
	const recheckSchemas = async (versions) => {
		admission = await revalidateUpdateDatabaseContexts({
			...databaseContextOptions,
			assertCurrent: preManagedServiceStop?.stopped ? assertExecutionCurrent : void 0
		}, admission, versions);
		admittedTargetSchemaVersions = versions;
		return admission;
	};
	const preflightPlugins = (targetVersion) => preflightUpdateCandidatePlugins(params, {
		targetVersion,
		candidateAdmissionChecks,
		readAdmission: async () => admission
	});
	let recoveryEnv;
	let packageTransaction;
	let databaseCapture;
	const onTransaction = async (transaction) => {
		packageTransaction = transaction;
		if (originalRun) databaseCapture = await captureUpdateDatabases({
			transaction,
			execution: params,
			context: ownedManagedUpdateContext,
			assertCurrent: assertExecutionCurrent
		});
	};
	let schemaVersions;
	let candidateSchemaVersions;
	let gatewayRestartCompletion = false;
	let previousSchemaVersions;
	let previousVerified = false;
	let originalManagedServiceRuntime;
	let observedGatewayStartupMs;
	let activationConfig;
	const onConfigSnapshot = (snapshot) => {
		activationConfig = snapshot;
	};
	let candidateFailureReason;
	let doctorConfigWrites = false;
	let doctorEntered = false;
	let doctorConfigChanges = [];
	let validatedConfigSnapshot;
	const readCandidateConfig = (env) => readUpdateCandidateSource(env, params.legacyConfigPlan, { configValidation });
	const getDoctorContext = () => {
		doctorEntered = true;
		const runId = originalRun?.runId;
		const executorFence = originalRun?.executorFence;
		const requester = requesterAuthority?.requester;
		const inputHash = validatedConfigSnapshot?.hash;
		const context = {
			requester,
			changes: doctorConfigChanges,
			databaseBackup: databaseCapture?.backup,
			originalRecoveryCapture: originalRun?.originalRecoveryCapture,
			assertCurrent: assertExecutionCurrent,
			assertBoundChildCurrent,
			onStateHandoff
		};
		assertExecutionCurrent();
		if (!doctorConfigWrites) return;
		if (!runId || !executorFence || inputHash === void 0) throw new Error("Validated Doctor requires its live update executor and captured config hash.");
		return {
			...context,
			runId,
			executorFence,
			inputHash
		};
	};
	const originalRecovery = () => readOriginalUpdateRecovery(params, updateStepTimeoutMs);
	const gitMutationRoots = params.updateInstallKind === "git" ? params.switchToGit ? [params.root, resolveGitInstallDir()] : [params.root] : null;
	const stopManagedServiceBeforeMutableUpdate = async (mutationRoots = [params.root], phase = "prepare") => {
		if (admission?.foreground) return;
		try {
			for (const mutationRoot of new Set(params.managedServiceRoot ? [params.managedServiceRoot] : mutationRoots)) {
				const serviceIdentity = preManagedServiceStop?.serviceIdentity;
				preManagedServiceStop = await maybeStopManagedServiceBeforeMutableUpdate({
					updateInstallKind: params.updateInstallKind,
					root: mutationRoot,
					handoffRoot: params.managedServiceRoot ? params.root : void 0,
					shouldRestart: params.shouldRestart,
					jsonMode: Boolean(opts.json),
					timeoutMs: updateStepTimeoutMs,
					phase,
					expectedService: admission?.services.get(mutationRoot),
					updateRun: originalRun,
					recordPhase,
					assertCurrent: assertExecutionCurrent,
					recovery: opts.recovery,
					onStopped: (state) => {
						preManagedServiceStop = {
							...state,
							...serviceIdentity ? { serviceIdentity } : {}
						};
					},
					handoffFromGateway: (state) => handoffUpdateFromGateway({
						state,
						root: params.managedServiceRoot ? params.root : mutationRoot,
						opts,
						tag: params.updateInstallKind === "package" && params.channel !== "extended-stable" ? normalizeTag(params.packageInstallSpec) ?? void 0 : void 0,
						mode,
						timeoutMs: updateStepTimeoutMs,
						devTarget: params.devTarget,
						nodeRunner: params.packageUpdateNodeRunner,
						invocationCwd: params.invocationCwd,
						stopProgress: params.stop
					})
				});
				if (serviceIdentity) preManagedServiceStop.serviceIdentity = serviceIdentity;
				if (preManagedServiceStop.windowsTaskAutoStartRecovery) params.recoveryState.windowsTaskAutoStartRecovery = preManagedServiceStop.windowsTaskAutoStartRecovery;
				if (preManagedServiceStop.stopped || preManagedServiceStop.serviceUpdateVerdict?.kind === "owned" || preManagedServiceStop.blockMessage || await mutableUpdateGatewayServiceBlock({
					preManagedServiceStop,
					root: params.managedServiceRoot ? params.root : mutationRoot,
					runId: opts.run?.runId
				}) || !preManagedServiceStop.inspected || !preManagedServiceStop.running || !params.shouldRestart) break;
			}
		} catch (err) {
			if (err instanceof ScheduledTaskAutoStartRecoveryError) {
				recoveryEnv = err.serviceEnv;
				params.recoveryState.triageTarget.env = err.serviceEnv;
				throw err;
			}
			if (err instanceof UpdateCommandAbort || err instanceof UpdatePreMutationError) throw err;
			if (err instanceof GatewayServiceUpdateOwnershipError) throw new UpdatePreMutationError("managed-service-preflight", err.message, { failureFacts: err.failureFacts });
			params.stop();
			throw new UpdatePreMutationError("managed-service-stop-failed", `Failed to stop managed gateway service before update: ${String(err)}`, { cause: err });
		}
		if (phase === "inspect" && preManagedServiceStop?.serviceUpdateVerdict?.kind === "foreign") preManagedServiceStop = void 0;
		try {
			ownedManagedUpdateContext = await captureOwnedManagedUpdateContext({
				stopState: preManagedServiceStop,
				processEnv: process.env,
				invocationCwd: params.invocationCwd
			});
			if (ownedManagedUpdateContext) params.recoveryState.triageTarget.env = ownedManagedUpdateContext.env;
		} catch (err) {
			params.stop();
			await maybeRestartServiceAfterFailedMutableUpdate({
				recovery: await originalRecovery(),
				originalManagedServiceRuntime,
				updateRun: opts.run,
				preManagedServiceStop,
				jsonMode: Boolean(opts.json),
				nodeRunner: params.packageUpdateNodeRunner,
				timeoutMs: updateStepTimeoutMs,
				invocationCwd: params.invocationCwd
			});
			throw new Error(`Failed to capture managed gateway update state: ${String(err)}`, { cause: err });
		}
		const serviceEnvBlock = await mutableUpdateGatewayServiceBlock({
			preManagedServiceStop,
			root: params.root,
			runId: opts.run?.runId
		});
		const blockMessage = serviceEnvBlock?.message ?? preManagedServiceStop?.blockMessage ?? "";
		if (serviceEnvBlock || blockMessage) {
			params.stop();
			throw new UpdatePreMutationError("managed-service-preflight", formatUpdateAncestryBlockMessage(blockMessage), serviceEnvBlock ?? { failureFacts: preManagedServiceStop?.blockFailureFacts ?? collectServiceInspectionFailureFacts(preManagedServiceStop?.serviceUpdateVerdict) });
		}
	};
	let result;
	let failure;
	let mutationStarted = false;
	const validateCandidate = async (root) => {
		await params.assertPackageRuntimeCurrent?.();
		assertUpdateCommandRecovery(opts);
		const env = ownedManagedUpdateContext?.env ?? opts.run?.env ?? process.env;
		await recordPhase("validating");
		assertExecutionCurrent();
		try {
			const manifest = params.updateInstallKind === "package" ? await tryReadJson(path.join(root, "package.json")) : void 0;
			if (params.updateInstallKind === "package") await assertUpdateDatabaseEngineContexts(admission.contexts, async () => asNullableRecord(asNullableRecord(manifest)?.openclaw)?.databaseEngines);
			admittedTargetSchemaVersions = params.updateInstallKind === "package" ? parsePackageOpenClawSchemaVersions(manifest) ?? admittedTargetSchemaVersions : admittedTargetSchemaVersions;
			if (stagedPluginAdmission) {
				await preflightPlugins(await readPackageVersion(root));
				await prepareMutableUpdate(ownedManagedUpdateContext?.env ?? admission?.managedEnv);
			}
			await assertUpdateCandidateExecutor({
				root,
				env,
				run: originalRun,
				shouldRestart: params.shouldRestart,
				serviceOwned: preManagedServiceStop?.serviceUpdateVerdict?.kind === "owned",
				invocationCwd: params.invocationCwd,
				timeoutMs: updateStepTimeoutMs,
				nodeRunner: params.packageUpdateNodeRunner,
				assertCurrent: assertExecutionCurrent
			});
		} catch (error) {
			if (error instanceof UpdatePreMutationError) candidateFailureReason = error.reason;
			throw error;
		}
		const snapshot = await readCandidateConfig(env);
		const validation = await validateUpdateCandidateWithProgress({
			root,
			sourcePackageRoot: params.root,
			config: snapshot.config,
			env,
			assertCurrent: assertExecutionCurrent,
			writeOptions: captureWriteOptions()
		}, params, originalRun);
		assertExecutionCurrent();
		doctorConfigChanges = [...validation.doctorConfigChanges ?? []];
		if (validation.status === "ok") {
			validatedConfigSnapshot = snapshot;
			candidateSchemaVersions = validation.candidateSchemaVersions;
			gatewayRestartCompletion = validation.gatewayRestartCompletion === true;
			doctorConfigWrites = validation.doctorConfigWrites === true;
			observedGatewayStartupMs = validation.steps.find((step) => step.name === "candidate-gateway-startup" && step.exitCode === 0)?.durationMs;
		}
		candidateFailureReason = validation.status === "error" ? validation.reason : void 0;
		return validation.steps;
	};
	let servicePrepared = false;
	const activationSteps = [];
	const beforeActivate = async (roots = [params.root]) => {
		assertExecutionCurrent();
		if (params.switchToGit && !opts.run?.sourceArtifactLock) {
			await admitSourceUpdateArtifacts(resolveGitInstallDir(), opts.run);
			assertExecutionCurrent();
		}
		const env = ownedManagedUpdateContext?.env ?? opts.run?.env ?? process.env;
		const config = (validatedConfigSnapshot ?? await readCandidateConfig(env)).config;
		await recheckSchemas(admittedTargetSchemaVersions);
		const originalServiceVerdict = preManagedServiceStop?.serviceUpdateVerdict;
		const previousRoot = originalServiceVerdict?.kind === "owned" && originalServiceVerdict.requiresInstallRootRefresh ? originalServiceVerdict.root : params.root;
		({previousSchemaVersions, schemaVersions} = await captureUpdateActivationSchemas({
			root: previousRoot,
			env,
			config,
			run: opts.run,
			candidateSchemaVersions,
			gatewayRestartCompletion,
			timeoutMs: params.updateStepTimeoutMs
		}));
		if (preManagedServiceStop?.running && !servicePrepared && preManagedServiceStop.serviceUpdateVerdict?.kind === "owned") await verifyPreviousManagedGatewayForUpdate({
			root: previousRoot,
			config,
			env,
			opts,
			timeoutMs: params.timeoutMs,
			observedStartupMs: observedGatewayStartupMs,
			assertCurrent: assertExecutionCurrent,
			service: preManagedServiceStop,
			onVerification: (verified) => {
				previousVerified = verified;
			}
		});
		if (params.shouldRestart && !servicePrepared) originalManagedServiceRuntime = await observeOriginalManagedServiceRuntime(params, preManagedServiceStop);
		assertExecutionCurrent();
		const activationTimeoutMs = params.opts.run?.deadline?.remainingMs() ?? params.timeoutMs;
		await parkForegroundUpdateForActivation(params, assertExecutionCurrent);
		await prepareMutableUpdate(env, activationTimeoutMs);
		assertExecutionCurrent();
		await recordPhase("activating");
		assertExecutionCurrent();
		const publication = {
			roots,
			env,
			timeoutMs: updateStepTimeoutMs,
			assertCurrent: assertExecutionCurrent,
			updateInstallKind: params.updateInstallKind,
			shouldRestart: params.shouldRestart
		};
		await assertManagedGatewayArtifactPublication({
			...publication,
			selected: preManagedServiceStop,
			phase: "before-stop"
		});
		if (!servicePrepared) {
			await stopManagedServiceBeforeMutableUpdate(roots);
			servicePrepared = true;
		}
		const postStopStartedAt = Date.now();
		assertExecutionCurrent();
		await assertManagedGatewayArtifactPublication({
			...publication,
			selected: preManagedServiceStop
		});
		const postStopStep = {
			name: "post-stop-checks",
			command: "recheck schemas, published artifacts and candidate configuration",
			cwd: params.root,
			durationMs: Date.now() - postStopStartedAt,
			exitCode: 0
		};
		activationSteps.push(postStopStep);
		await reportUpdateStepCompletion(params.progress, {
			...postStopStep,
			index: 0,
			total: 0
		});
		if (!mutationStarted) {
			preManagedServiceStop?.windowsTaskAutoStartRecovery?.beginMutation();
			mutationStarted = true;
			params.onActivation?.();
		}
	};
	const installOptions = {
		root: params.root,
		restart: opts.restart,
		installKind: params.installKind,
		startedAt: params.startedAt,
		progress: params.progress,
		invocationCwd: params.invocationCwd,
		nodeRunner: params.packageUpdateNodeRunner,
		assertCurrent: assertExecutionCurrent,
		onConfigSnapshot,
		getDoctorContext
	};
	try {
		admission = await inspectUpdateDatabaseContexts({
			...databaseContextOptions,
			roots: gitMutationRoots ?? [params.root],
			expectedForeground: opts.run?.completionOwner === "gateway-restart" || void 0
		});
		if (params.updateInstallKind === "package") {
			if (!stagedPluginAdmission) await preflightPlugins(params.packageTargetVersion ?? null);
			await stopManagedServiceBeforeMutableUpdate(void 0, "inspect");
			if (!stagedPluginAdmission) await prepareMutableUpdate(admission?.managedEnv);
			const packageUpdate = {
				...installOptions,
				requirePackageReplacement: params.managedServiceRoot !== void 0,
				reapplyLocalOverrides: opts.reapplyLocalOverrides,
				tag: params.tag,
				installSpec: params.packageInstallSpec ?? void 0,
				timeoutMs: updateStepTimeoutMs,
				workTimeoutMs: params.timeoutMs ?? null,
				honorPackageRoot: params.managedServiceRootRedirect !== null || params.managedServiceRoot !== void 0 || params.managedServiceNodeRunner !== void 0,
				installEnv: params.packageInstallEnv,
				installTarget: params.packageInstallTarget,
				validateCandidate,
				beforeActivate,
				...createPackageUpdateActivationOptions({
					run: opts.run,
					runtime: params.packageActivationRuntime,
					assertCurrent: assertExecutionCurrent
				}),
				managedServiceEnv: preManagedServiceStop?.serviceEnv,
				onTransaction
			};
			await params.assertPackageRuntimeCurrent?.();
			result = await withMutableUpdateForwardScope(opts, () => params.stagedPackage ? params.stagedPackage.run(packageUpdate) : runPackageInstallUpdate(packageUpdate));
		} else {
			const sourceRuntimePrepared = await admitSourceUpdateArtifacts(params.switchToGit ? resolveGitInstallDir() : params.root, opts.run);
			assertExecutionCurrent();
			const gitUpdate = {
				...installOptions,
				sourceRuntimePrepared,
				switchToGit: params.switchToGit,
				timeoutMs: params.timeoutMs,
				channel: params.channel,
				devTarget: params.devTarget,
				inspectGitTarget: async (target, installTarget) => {
					await assertUpdateDatabaseEngineContexts(admission.contexts, async () => target.databaseEngines);
					retentionInstallTarget = installTarget;
					await recordInspectedGitTarget(target, recordPhase, assertExecutionCurrent);
					assertExecutionCurrent();
					admittedTargetSchemaVersions = target.schemaVersions;
					if (!gitContextPrepared) {
						await stopManagedServiceBeforeMutableUpdate(gitMutationRoots ?? void 0, "inspect");
						await prepareMutableUpdate(admission?.managedEnv);
						gitContextPrepared = true;
					}
					if (mutationStarted) await beforeActivate(gitMutationRoots ?? [params.root]);
				},
				onTransaction,
				getManagedServiceEnv: () => ownedManagedUpdateContext?.env,
				getSnapshotSource: async () => {
					const env = ownedManagedUpdateContext?.env ?? admission?.managedEnv ?? opts.run?.env ?? process.env;
					return {
						config: (await readUpdateCandidateSource(env, params.legacyConfigPlan)).config,
						env
					};
				},
				jsonMode: Boolean(opts.json),
				validateCandidate: async (candidateRoot) => {
					const steps = await validateCandidate(candidateRoot);
					assertUpdateCandidateSteps(steps);
					return steps;
				},
				beforeGitMutation: async (target) => {
					assertReadableGitMetadata(target.metadataUnreadable);
					await assertUpdateDatabaseEngineContexts(admission.contexts, async () => target.databaseEngines);
					admittedTargetSchemaVersions = target.schemaVersions;
					await beforeActivate(gitMutationRoots ?? [params.root]);
				}
			};
			await params.assertPackageRuntimeCurrent?.();
			result = await withMutableUpdateForwardScope(opts, () => updateGitInstall(gitUpdate));
		}
	} catch (err) {
		params.stop();
		if (err instanceof UpdateCommandAbort && !hasCommandProcessCleanupError(err)) return null;
		({result, failure} = await resolveMutableUpdateFailure({
			cause: err,
			durationMs: Date.now() - params.startedAt,
			mode,
			root: params.root,
			originalRecovery,
			run: mutationStarted ? void 0 : params.opts.run
		}));
	}
	result = await settleMutableUpdateResult(params, {
		result,
		failure,
		candidateFailureReason,
		databaseBackup: databaseCapture?.backup,
		databaseCaptureStep: databaseCapture?.step,
		activationSteps,
		doctorEntered,
		packageTransaction,
		originalRun,
		env: ownedManagedUpdateContext?.env,
		assertCurrent: () => assertExecutionCurrent("restore")
	});
	return {
		result,
		failure,
		mutationStarted,
		preManagedServiceStop,
		ownedManagedUpdateContext,
		recoveryEnv,
		packageTransaction,
		databaseBackup: databaseCapture?.backup,
		schemaVersions,
		candidateSchemaVersions,
		previousSchemaVersions,
		previousVerified,
		originalManagedServiceRuntime,
		activationConfig
	};
}
//#endregion
//#region src/cli/update-cli/update-command-noop.ts
async function finishAlreadyCurrentUpdate(params) {
	const { assertCurrent } = createUpdateCommandExecutionGuards(params.opts, params.root);
	await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, async () => {
		const result = {
			...params.result,
			after: {
				...params.result.after ?? params.result.before,
				version: params.result.after?.version ?? params.result.before?.version ?? await readPackageVersion(params.root)
			}
		};
		const completion = () => ({
			...params,
			result,
			coreAlreadyCurrent: true,
			mutationStarted: false,
			installKindChanged: false,
			downgradeRisk: false
		});
		const inspection = {
			...params,
			roots: [params.root],
			updateInstallKind: params.result.mode === "git" ? "git" : "package",
			jsonMode: Boolean(params.opts.json),
			timeoutMs: params.updateStepTimeoutMs,
			expectedForeground: params.opts.run?.completionOwner === "gateway-restart" || void 0,
			candidateAdmissionChecks: params.result.mode === "git" ? void 0 : params.opts.run?.candidateAdmissionChecks
		};
		const admission = await inspectUpdateDatabaseContexts(inspection);
		const service = admission.service;
		const context = admission.foreground ? admission.contexts[0] : admission.contexts.at(-1);
		const membership = await mutableUpdateGatewayServiceBlock({
			preManagedServiceStop: service ?? admission.services.get(params.managedServiceRoot ?? params.root),
			root: params.root,
			runId: params.opts.run?.runId
		});
		if (membership) {
			const deferredMaintenance = "Core is already current; plugin, runtime, and service maintenance was deferred. " + (params.requestedChannel && params.requestedChannel !== params.storedChannel ? `Requested channel change to ${params.requestedChannel} was not applied; retry with --channel ${params.requestedChannel}. ` : "") + membership.message;
			result.steps.push({
				name: "current-core-maintenance",
				command: "openclaw update",
				cwd: params.root,
				durationMs: 0,
				exitCode: 0,
				advisory: {
					kind: "recoverable-maintenance",
					message: deferredMaintenance
				}
			});
			params.stop();
			await finishUpdate({
				...completion(),
				deferredMaintenance,
				preManagedServiceStop: service,
				ownedManagedUpdateEnv: context.env,
				configSnapshot: context.configSnapshot,
				preUpdatePluginInstallRecords: {}
			});
			return;
		}
		const canRefreshRuntime = params.shouldRestart && service?.serviceUpdateVerdict?.kind === "owned" && service.serviceUpdateVerdict.refreshDefinition;
		const runtime = await resolvePackageRuntimePreflight({
			...params,
			target: params.runtimeTarget,
			installedRoot: params.root,
			nodeRunner: params.packageUpdateNodeRunner,
			alreadyCurrent: true,
			service: admission.foreground ? void 0 : service ?? admission.services.get(params.root),
			sourceRoot: result.mode === "git" ? params.root : void 0,
			timeoutMs: params.updateStepTimeoutMs,
			runtimeRecovery: !service?.serviceNodeRunner || canRefreshRuntime ? createPackageRuntimeRecovery({
				root: params.root,
				opts: params.opts,
				timeoutMs: params.updateStepTimeoutMs
			}) : void 0
		});
		if (!runtime.ok) throw new UpdatePreMutationError("node-runtime-preflight", runtime.error, {
			failureFacts: runtime.failureFacts,
			recoverySteps: runtime.recoverySteps
		});
		const packageUpdateNodeRunner = runtime.value.nodeRunner;
		const pluginWarnings = await preflightConfiguredNpmPluginTargets({
			config: context.configSnapshot.sourceConfig,
			env: context.env,
			targetVersion: result.after.version,
			channel: params.channel,
			timeoutMs: params.updateStepTimeoutMs
		});
		for (const warning of pluginWarnings) defaultRuntime[params.opts.json ? "error" : "log"](warning.message);
		let stopState = admission.foreground ? void 0 : admission.services.get(params.managedServiceRoot ?? params.root);
		if (process.platform === "linux" && stopState?.serviceUpdateVerdict?.kind === "owned" && !stopState.blockMessage) stopState = await maybeStopManagedServiceBeforeMutableUpdate({
			...inspection,
			root: params.managedServiceRoot ?? params.root,
			handoffRoot: params.managedServiceRoot ? params.root : void 0,
			phase: "refresh",
			expectedService: stopState,
			updateRun: params.opts.run
		});
		await assertOpenClawStateWriteAllowedAtPath({
			databasePath: resolveOpenClawStateSqlitePath(context.env),
			env: context.env
		});
		const owned = await captureOwnedManagedUpdateContext({
			stopState,
			invocationCwd: params.invocationCwd
		});
		const env = owned?.env ?? context.env;
		let configSnapshot = owned?.configSnapshot ?? context.configSnapshot;
		let plan = context.legacyConfigPlan?.snapshot.path === configSnapshot.path ? context.legacyConfigPlan : void 0;
		if (!configSnapshot.valid && !plan && context.configValidation === "candidate") ({configSnapshot, legacyConfigPlan: plan} = await withOwnedManagedUpdateEnv(env, () => readUpdateChannelConfig(true)));
		const storedChannel = normalizeUpdateChannel((plan?.config ?? configSnapshot.config).update?.channel);
		const beforeRepair = configSnapshot;
		if (plan) configSnapshot = await withOwnedManagedUpdateEnv(env, () => withPluginLifecycleLease({ assertCurrent }, () => withConfigWriteLock(configSnapshot.path, () => maybeRepairLegacyConfigForUpdateChannel({
			configSnapshot,
			plan,
			jsonMode: Boolean(params.opts.json)
		}), env, assertCurrent)));
		if (!configSnapshot.valid) throw new Error("Update refused: the selected configuration is still invalid.");
		result.status = beforeRepair.raw !== configSnapshot.raw || plan?.changes.length ? "ok" : "skipped";
		if (result.status === "ok") delete result.reason;
		else result.reason = "already-current";
		params.stop();
		await finishUpdate({
			...completion(),
			packageUpdateNodeRunner,
			serviceRuntimeRefreshRequired: Boolean(params.managedServiceRoot || runtime.value.replacedNodeRunner),
			storedChannel,
			preManagedServiceStop: stopState,
			ownedManagedUpdateEnv: env,
			configSnapshot,
			preUpdatePluginInstallRecords: owned?.pluginInstallRecords ?? {}
		});
	}).catch(async (error) => {
		if (error instanceof UpdatePreMutationError || error instanceof GatewayServiceUpdateOwnershipError) {
			await params.refuseUpdate(error instanceof UpdatePreMutationError ? error.reason : "managed-service-preflight", error.message, error.failureFacts, error instanceof UpdatePreMutationError ? error.recoverySteps : void 0);
			return;
		}
		throw error;
	});
}
//#endregion
//#region src/cli/update-cli/update-command-migrated.ts
/** Inspect private state copies without reopening migrated state through the previous runtime. */
async function inspectActivatedUpdateState(params) {
	const { result, root, schemaVersions, candidateSchemaVersions, env, config } = params;
	if (!schemaVersions) return;
	let blocked;
	try {
		const current = await readUpdateStateSchemaVersions({
			stateDir: resolveStateDir(env),
			config,
			env,
			root: result.root ?? null,
			nodeRunner: params.packageUpdateNodeRunner,
			timeoutMs: params.timeoutMs
		});
		const shared = current.find((entry) => entry.path === resolveOpenClawStateSqlitePath(env));
		const sharedVersion = shared ? resolveUpdateStateContentVersion(shared) : void 0;
		const incompleteAgents = candidateSchemaVersions ? current.filter((entry) => entry !== shared && entry.userVersion !== null && entry.userVersion !== candidateSchemaVersions.agent) : [];
		if (result.status === "ok" && candidateSchemaVersions && (sharedVersion !== candidateSchemaVersions.state || incompleteAgents.length > 0)) {
			result.status = "error";
			result.reason = `${CLI_NAME} doctor`;
			result.steps.push({
				name: `${CLI_NAME} doctor`,
				command: `${CLI_NAME} doctor --fix`,
				cwd: result.root ?? root,
				durationMs: 0,
				exitCode: 1,
				stderrTail: [...sharedVersion !== candidateSchemaVersions.state ? [`Shared state migration did not finish: expected schema ${candidateSchemaVersions.state}, found ${sharedVersion ?? "missing"}.`] : [], ...incompleteAgents.map((entry) => `Agent database migration did not finish: ${entry.path}; expected schema ${candidateSchemaVersions.agent}, found ${entry.userVersion}.`)].join("\n")
			});
		}
		blocked = updateStateSchemaVersionsMatch(schemaVersions, current, {
			sharedPath: resolveOpenClawStateSqlitePath(env),
			candidateSchemaVersions
		}) ? void 0 : "state-migrated-no-rollback";
	} catch (error) {
		result.status = "error";
		result.reason = "rollback-state-unverified";
		result.steps.push({
			name: "state-schema-verification",
			command: "openclaw update",
			cwd: result.root ?? root,
			durationMs: 0,
			exitCode: 1,
			stderrTail: formatErrorMessage(error)
		});
		blocked = "rollback-state-unverified";
	}
	if (blocked && result.status === "error") result.recovery = unsafeUpdateRecovery(result.recovery, blocked);
	return blocked;
}
/** After migration, only candidate code may reopen state or finish the run. */
async function continueMigratedUpdateInFreshProcess(params, bufferedSteps) {
	if (params.opts.recovery) throw new UpdateCommandRecoveryPendingError("Full-state checkpoint recovery is deferred.");
	const run = params.opts.run;
	if (!run) throw new Error("Migrated update continuation requires its admitted run.");
	const assertCurrent = createUpdateCommandFinalizationFence(params);
	assertCurrent();
	const windowsRecovery = params.preManagedServiceStop?.windowsTaskAutoStartRecovery;
	const result = params.result;
	const scratchDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-update-migrated-"));
	try {
		const root = result.root;
		if (!root) throw new Error("The active installation root is unknown; update finalization is unsafe.");
		const workerCommand = [params.packageUpdateNodeRunner ?? resolveNodeRunner(), path.join(root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath)];
		const workerOptions = {
			cwd: root,
			baseEnv: {},
			env: {
				...stripGatewayServiceMarkerEnv(resolveUpdatedInstallCommandEnv({ processEnv: params.ownedManagedUpdateEnv ?? run.env })),
				OPENCLAW_UPDATE_IN_PROGRESS: "1",
				[UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV]: params.shouldRestart ? UPDATE_POST_ACTIVATION_INSPECTIONS_REPORT_MODE : "0",
				TMPDIR: scratchDir,
				TMP: scratchDir,
				TEMP: scratchDir
			},
			killProcessTree: true,
			requireProcessTreeExtinction: true,
			killGraceMs: 500
		};
		if (run.executorFence || run.completionOwner) {
			assertCurrent();
			const requiresRetainedOwner = run.executorFence ? requiresRetainedUpdateCommandOwner(run.executorFence) : false;
			const check = await runUtf8CommandWithTimeout([...workerCommand, "--check"], {
				...workerOptions,
				timeoutMs: params.updateStepTimeoutMs,
				maxOutputBytes: 65536
			});
			assertCurrent();
			let contract;
			try {
				contract = JSON.parse(check.stdout);
			} catch (cause) {
				throw new UpdateCommandRecoveryPendingError("Update live executor delegation capability could not be inspected.", { cause });
			}
			if (check.termination !== "exit" || check.code !== 0 || check.cleanup !== "normal" || !isRecord(contract) || run.executorFence && contract.executorDelegation !== "pid-start-v1" || requiresRetainedOwner && contract.retainedOwnerBinding !== true) throw new UpdateCommandRecoveryPendingError("Update runtime does not support live executor delegation; recovery remains pending.");
			if (run.completionOwner === "gateway-restart" && contract.gatewayRestartCompletion !== true) throw new UpdateCommandRecoveryPendingError("Candidate runtime cannot defer foreground update completion to Gateway restart; recovery remains pending.");
		}
		if (windowsRecovery && params.preManagedServiceStop) windowsRecovery.handoff(createWindowsTaskAutoStartGuard({
			root: result.root ?? params.root,
			before: params.preManagedServiceStop,
			timeoutMs: params.updateStepTimeoutMs
		}));
		const { packageTransaction: _transaction, databaseBackup: _databaseBackup, preManagedServiceStop, ...serializable } = params;
		let stopState;
		if (preManagedServiceStop) {
			const { windowsTaskAutoStartRecovery: _windows, ...serializableStop } = preManagedServiceStop;
			stopState = serializableStop;
		}
		if (params.opts.timeout !== void 0) run.activationTimeoutMs ??= await resolveUpdateFinalizationTimeoutMs(params.updateStepTimeoutMs, {
			env: params.ownedManagedUpdateEnv ?? run.env,
			databases: params.schemaVersions,
			pluginCount: Object.keys(params.preUpdatePluginInstallRecords).length,
			nodeRunner: params.packageUpdateNodeRunner
		});
		const handoff = createUpdateTimeoutHandoff(params.opts.timeout, params.updateStepTimeoutMs);
		assertCurrent();
		const resultPath = path.join(scratchDir, "result.json");
		const { requesterAuthority, executorFence, sourceArtifactLock: _sourceArtifactLock, deadline: _deadline, ...runIdentity } = run;
		const input = {
			...handoff,
			params: {
				...serializable,
				opts: {
					...params.opts,
					timeout: handoff.timeout.serialized,
					run: {
						...runIdentity,
						...requesterAuthority ? { requesterAuthority: { requester: requesterAuthority.requester } } : {}
					}
				},
				rollbackBlockedReason: params.rollbackBlockedReason ?? "state-migrated-no-rollback",
				...preManagedServiceStop ? { preManagedServiceStop: stopState } : {}
			},
			bufferedSteps,
			...windowsRecovery ? { windowsTaskAutoStartSuspended: true } : {},
			resultPath
		};
		const runChild = (grant, bindChild) => runUtf8CommandWithTimeout(workerCommand, {
			...workerOptions,
			input: JSON.stringify({
				...input,
				...grant ? { executor: grant } : {}
			}),
			beforeInput: bindChild,
			timeoutMs: run.deadline?.remainingMs() ?? run.activationTimeoutMs,
			maxOutputBytes: 1048576
		});
		await releaseLegacySourceLock(root, run.sourceArtifactLock);
		const child = executorFence ? await withUpdateCommandExecutorChild(executorFence, root, runChild) : await runChild();
		if (child.stderr) process.stderr.write(child.stderr);
		const response = JSON.parse(await fs.readFile(resultPath, "utf8"));
		if (child.termination !== "exit" || child.code !== 0 || child.cleanup !== "normal" || executorFence && response.executorDelegation !== "pid-start-v1" || response.terminalRunId !== run.runId && !(run.completionOwner === "gateway-restart" && run.gatewayRestartRequired === true && response.restartRunId === run.runId && response.result.status === "ok") || response.result.runId !== run.runId || !Number.isInteger(response.exitCode)) throw new Error("Update finalization did not confirm the admitted run's terminal outcome.");
		const finalization = {
			result: response.result,
			exitCode: response.exitCode,
			candidateStartAttempted: response.candidateStartAttempted
		};
		if (params.databaseBackup !== void 0 && params.packageTransaction !== void 0 && !windowsRecovery && response.result.status === "error" && response.candidateStartAttempted === false && !isUpdateGatewayReadinessPending(response.result)) return {
			...finalization,
			databaseRollbackAvailable: true
		};
		if (child.stdout) process.stdout.write(child.stdout);
		try {
			await windowsRecovery?.complete(response.result.status === "ok" || isUpdateGatewayReadinessPending(response.result) || response.result.recovery?.serviceRestartSafe === true && response.result.recovery.service === "healthy");
		} catch (cause) {
			throw new UpdateCommandFailure(response.result, response.exitCode || 1, `${response.result.reason ?? "Update failed"}; Windows task autostart compensation failed: ${formatErrorMessage(cause)}`, { cause });
		}
		const cleanupFailure = await recordUpdatePackageCompletion(params, response.result, assertCurrent);
		if (cleanupFailure) throw cleanupFailure;
		return finalization;
	} catch (error) {
		if (error instanceof UpdateCommandRecoveryPendingError) throw error;
		try {
			await windowsRecovery?.complete(false);
		} catch (cause) {
			throw new AggregateError([error, cause], `Update finalization failed (${formatErrorMessage(error)}) and Windows task autostart compensation failed (${formatErrorMessage(cause)})`, { cause });
		}
		throw error;
	} finally {
		await fs.rm(scratchDir, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
//#region src/cli/update-cli/update-execution.runtime.ts
await Promise.all([prepareDeferredPluginMigrationRuntime(), prepareUpdateDatabaseBackupRuntime()]);
//#endregion
export { continueMigratedUpdateInFreshProcess, createUpdateCommandExecutionGuards, createUpdateCommandFinalizationFence, executeMutableUpdate, finishAlreadyCurrentUpdate, finishUpdate, inspectActivatedUpdateState, restoreFailedUpdateDatabases, resumePostCoreUpdate };
