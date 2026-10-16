import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { f as createUpdatePreflightFailure } from "./service-inspection-error-Bsltcpi4.mjs";
import { l as tryReadJson } from "./json-files-C5mNTScg.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-BquD107I.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { t as canResolveRegistryVersionForPackageTarget } from "./update-global-rkW-mKvG.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { i as prepareOpenClawStateReadSource } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { i as hashConfigRaw } from "./io.read-helpers-Bvdjf9tk.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { i as reportUpdateStepCompletion } from "./update-runner-command-rYXXMsH4.mjs";
import { t as createUpdateDoctorConfigWarningStep } from "./update-doctor-config-BrLAVDg0.mjs";
import { i as isUpdateGatewayReadinessPending, r as isFailedUpdateStep } from "./update-run-step-BDxgGAu8.mjs";
import { a as prepareDeferredPluginMigrationRuntime } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { d as withUpdateCommandExecutorChild, l as requiresRetainedUpdateCommandOwner, p as UpdateCommandRecoveryPendingError } from "./update-command-executor-C94Zye_E.mjs";
import { a as assertUpdateCommandRecovery, f as createUpdateTimeoutHandoff, i as createUpdateCommandExecutionGuards, l as recordUpdateRunStepAsync, n as captureUpdateDatabases, o as createUpdateCommandFinalizationFence, r as restoreFailedUpdateDatabases, s as readOriginalUpdateRecovery, t as finishUpdate, u as resumePostCoreUpdate } from "./update-command-post-update-BVQ18FlY.mjs";
import { n as UpdatePreMutationError, s as normalizeTag, u as resolveGitInstallDir } from "./shared-CiAI6uii.mjs";
import { n as maybeRepairLegacyConfigForUpdateChannel } from "./update-command-config-DVVxubY4.mjs";
import { a as inspectSourceUpdateArtifacts, i as releaseLegacySourceLock } from "./update-command-plugins-D1MpYBtM.mjs";
import { T as ScheduledTaskAutoStartRecoveryError } from "./schtasks-BZ33FXAo.mjs";
import { c as stripGatewayServiceMarkerEnv, l as withOwnedManagedUpdateEnv, s as resolveUpdatedInstallCommandEnv } from "./update-command-service-env-lR0aWgPL.mjs";
import { c as parkForegroundUpdateForActivation, i as UpdateCommandAbort, n as maybeStopManagedServiceBeforeMutableUpdate, o as formatUpdateAncestryBlockMessage, r as mutableUpdateGatewayServiceBlock, s as handoffUpdateFromGateway, t as createWindowsTaskAutoStartGuard } from "./update-command-service-maintenance-Bc6Zm_Kc.mjs";
import { n as GatewayServiceUpdateOwnershipError } from "./update-command-service-plan-_baZk9PF.mjs";
import { r as assertManagedGatewayArtifactPublication } from "./update-command-service-publication-CRHfFdIc.mjs";
import { g as isUpdatedInstallGatewayExecutorSupported, r as verifyPreviousManagedGatewayForUpdate, s as maybeRestartServiceAfterFailedMutableUpdate, u as observeOriginalManagedServiceRuntime } from "./update-command-verification-dRgzET5O.mjs";
import { c as readUpdateStateSchemaVersions, f as updateStateSchemaVersionsMatch, u as resolveUpdateStateContentVersion } from "./update-candidate-state-CO0vwfHU.mjs";
import { a as isCandidateAdmissionContextCovered } from "./schema-preflight-Qw67fuB1.mjs";
import { r as updateGitInstall } from "./update-command-git-DP-t8dyv.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { n as runPackageInstallUpdate } from "./update-command-package-CnC_ZRC5.mjs";
import { _ as resolveMutableUpdateFailure, a as collectServiceInspectionFailureFacts, n as UpdateCommandFailure } from "./update-command-result-4Ha0lQk3.mjs";
import "./update-command-service-B4f5G8Hy.mjs";
import { a as recordUpdatePackageCompletion, x as createPackageUpdateActivationOptions } from "./update-command-terminal-CblG2A7I.mjs";
import { i as readUpdateCandidateSource, n as captureOwnedManagedUpdateContext, o as revalidateUpdateDatabaseContext } from "./update-command-managed-context-BGxFaKOr.mjs";
import { t as resolveUpdateFinalizationTimeoutMs } from "./update-finalization-budget-BqCBETpF.mjs";
import { t as preflightConfiguredNpmPluginTargets } from "./update-command-plugin-preflight-7_dpwD5f.mjs";
import { r as revalidateUpdateDatabaseContexts, t as inspectUpdateDatabaseContexts } from "./update-command-database-context-BapIzTxE.mjs";
import { i as createPackageRuntimeRecovery, o as resolvePackageRuntimePreflight, t as captureUpdateActivationSchemas } from "./update-command-schema-BkWKINiT.mjs";
import "./io.write-yGGbtFFg.mjs";
import { t as validateUpdateCandidateCanary } from "./update-candidate-canary-DBpQXnLL.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/update-cli/update-command-candidate-validation.ts
async function preflightUpdateCandidatePlugins(execution, params) {
	const admission = await params.readAdmission();
	const context = admission.foreground ? admission.contexts[0] : admission.contexts.at(-1);
	if (params.candidateAdmissionChecks?.includes("plugin-availability") && isCandidateAdmissionContextCovered(context.env)) return;
	const { preflightConfiguredNpmPluginTargets } = await import("./update-command-plugin-preflight-BHtzkB2i.mjs");
	const warnings = await preflightConfiguredNpmPluginTargets({
		config: context.configSnapshot.sourceConfig,
		env: context.env,
		targetVersion: params.targetVersion,
		channel: execution.channel,
		timeoutMs: execution.updateStepTimeoutMs
	});
	await params.readAdmission();
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
/** Rehearse each new source generation within one activation budget. */
function createUpdateCandidateConfigRefresh(params) {
	const deadline = Date.now() + params.timeoutMs;
	return async () => {
		const snapshot = await params.read();
		params.assertCurrent();
		const validated = params.getValidated();
		if (!validated || isDeepStrictEqual(snapshot.source, validated.source)) return snapshot;
		if (Date.now() >= deadline) throw new UpdatePreMutationError("invalid-config", "Configuration kept changing throughout the update validation budget; activation cannot safely use an unvalidated configuration.");
		defaultRuntime.error("Warning: Configuration changed during update checks; validating the current configuration before activation.");
		assertUpdateCandidateSteps(await params.validate());
	};
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
//#region src/cli/update-cli/update-command-doctor-context.ts
function preparePackageDoctorContext({ capable, runId, executorFence, inputHash, ...context }) {
	context.assertCurrent();
	if (!capable) return;
	if (!runId || !executorFence || inputHash === void 0) throw new Error("Validated Doctor requires its live update executor and captured config hash.");
	return {
		...context,
		runId,
		executorFence,
		inputHash: inputHash ?? hashConfigRaw(null)
	};
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
	assertReadableGitTarget(target);
}
function assertReadableGitTarget(target) {
	if (target.metadataUnreadable) {
		const failure = createUpdatePreflightFailure("target-git-metadata", target.metadataUnreadable);
		throw new UpdatePreMutationError("target-metadata-preflight", failure.message, { failureFacts: failure.failureFacts });
	}
}
//#endregion
//#region src/cli/update-cli/update-command-execution.ts
async function executeMutableUpdate(params) {
	const { opts, updateStepTimeoutMs } = params;
	const candidateAdmissionChecks = params.updateInstallKind === "package" ? opts.run?.candidateAdmissionChecks : void 0;
	const configValidation = candidateAdmissionChecks?.includes("config") ? "candidate" : void 0;
	const databaseContextOptions = {
		...params,
		updateInstallKind: params.updateInstallKind === "git" ? "git" : "package",
		jsonMode: Boolean(opts.json),
		timeoutMs: updateStepTimeoutMs,
		candidateAdmissionChecks
	};
	const originalRun = opts.run;
	const requesterAuthority = originalRun?.requesterAuthority;
	const { assertCurrent: assertExecutionCurrent, assertBoundChildCurrent, onStateHandoff, admitExecutor, captureWriteOptions, recordPhase } = params.executionGuards;
	let retentionInstallTarget = params.packageInstallTarget;
	const prepareMutableUpdate = async (env, activationTimeoutMs) => {
		assertExecutionCurrent();
		await params.prepareMutableUpdate(env, activationTimeoutMs, admitExecutor, retentionInstallTarget);
		assertExecutionCurrent();
	};
	const mode = params.updateInstallKind === "git" ? "git" : params.packageInstallTarget?.manager ?? "unknown";
	if (opts.recovery) throw new UpdatePreMutationError("rollback-state-unverified", "Full-state checkpoint recovery is deferred.");
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
	};
	const preflightPlugins = (targetVersion) => preflightUpdateCandidatePlugins(params, {
		targetVersion,
		candidateAdmissionChecks,
		readAdmission: async () => {
			await recheckSchemas(admittedTargetSchemaVersions);
			return admission;
		}
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
	let validatedCandidateRoot;
	const getDoctorContext = () => {
		doctorEntered = true;
		return preparePackageDoctorContext({
			capable: doctorConfigWrites,
			runId: originalRun?.runId,
			executorFence: originalRun?.executorFence,
			requester: requesterAuthority?.requester,
			inputHash: validatedConfigSnapshot?.hash,
			changes: doctorConfigChanges,
			databaseBackup: databaseCapture?.backup,
			originalRecoveryCapture: originalRun?.originalRecoveryCapture,
			assertCurrent: assertExecutionCurrent,
			assertBoundChildCurrent,
			onStateHandoff
		});
	};
	const originalRecovery = () => readOriginalUpdateRecovery(params, updateStepTimeoutMs);
	const gitMutationRoots = params.updateInstallKind === "git" ? params.switchToGit ? [params.root, resolveGitInstallDir()] : [params.root] : null;
	const stopManagedServiceBeforeMutableUpdate = async (mutationRoots = [params.root], phase = "prepare") => {
		if (admission?.foreground) return;
		if (params.updateInstallKind !== "package" && params.updateInstallKind !== "git") return;
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
		if (serviceEnvBlock) {
			params.stop();
			throw new UpdatePreMutationError("managed-service-preflight", formatUpdateAncestryBlockMessage(serviceEnvBlock.message), serviceEnvBlock);
		}
		if (preManagedServiceStop?.blockMessage) {
			params.stop();
			throw new UpdatePreMutationError("managed-service-preflight", formatUpdateAncestryBlockMessage(preManagedServiceStop.blockMessage), { failureFacts: preManagedServiceStop.blockFailureFacts ?? collectServiceInspectionFailureFacts(preManagedServiceStop.serviceUpdateVerdict) });
		}
	};
	let result;
	let failure;
	let mutationStarted = false;
	const validateCandidate = async (root) => {
		assertUpdateCommandRecovery(opts);
		const env = ownedManagedUpdateContext?.env ?? opts.run?.env ?? process.env;
		await recordPhase("validating");
		assertExecutionCurrent();
		try {
			if (params.updateInstallKind === "package") await recheckSchemas(parsePackageOpenClawSchemaVersions(await tryReadJson(path.join(root, "package.json"))) ?? admittedTargetSchemaVersions);
			else await recheckSchemas(admittedTargetSchemaVersions);
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
		const snapshot = await readUpdateCandidateSource(env, params.legacyConfigPlan, { configValidation });
		const validation = await validateUpdateCandidateWithProgress({
			root,
			config: snapshot.config,
			env,
			assertCurrent: assertExecutionCurrent,
			writeOptions: captureWriteOptions()
		}, params, originalRun);
		assertExecutionCurrent();
		doctorConfigChanges = [...validation.doctorConfigChanges ?? []];
		if (validation.status === "ok") {
			validatedConfigSnapshot = snapshot;
			validatedCandidateRoot = root;
			candidateSchemaVersions = validation.candidateSchemaVersions;
			gatewayRestartCompletion = validation.gatewayRestartCompletion === true;
			doctorConfigWrites = validation.doctorConfigWrites === true;
			observedGatewayStartupMs = validation.steps.find((step) => step.name === "candidate-gateway-startup" && step.exitCode === 0)?.durationMs;
		}
		candidateFailureReason = validation.status === "error" ? validation.reason : void 0;
		return validation.steps;
	};
	let servicePrepared = false;
	let refreshCandidate;
	const beforeActivate = async (roots = [params.root]) => {
		assertExecutionCurrent();
		if (params.switchToGit && !opts.run?.sourceArtifactLock) {
			await admitSourceUpdateArtifacts(resolveGitInstallDir(), opts.run);
			assertExecutionCurrent();
		}
		const env = ownedManagedUpdateContext?.env ?? opts.run?.env ?? process.env;
		refreshCandidate ??= createUpdateCandidateConfigRefresh({
			read: () => readUpdateCandidateSource(ownedManagedUpdateContext?.env ?? opts.run?.env ?? process.env, params.legacyConfigPlan, { configValidation }),
			getValidated: () => validatedConfigSnapshot,
			validate: () => validateCandidate(validatedCandidateRoot),
			assertCurrent: assertExecutionCurrent,
			timeoutMs: updateStepTimeoutMs
		});
		for (;;) {
			const snapshot = await refreshCandidate();
			if (!snapshot) continue;
			const config = snapshot.config;
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
			await recheckSchemas(admittedTargetSchemaVersions);
			assertExecutionCurrent();
			const activationTimeoutMs = params.timeoutMs === void 0 ? void 0 : await resolveUpdateFinalizationTimeoutMs(updateStepTimeoutMs, {
				env,
				databases: schemaVersions,
				observedStartupMs: observedGatewayStartupMs,
				pluginCount: Object.keys(config.plugins?.entries ?? {}).length,
				nodeRunner: params.packageUpdateNodeRunner
			});
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
			if (!await refreshCandidate()) continue;
			if (!servicePrepared) {
				await stopManagedServiceBeforeMutableUpdate(roots);
				servicePrepared = true;
			}
			await recheckSchemas(admittedTargetSchemaVersions);
			assertExecutionCurrent();
			await assertManagedGatewayArtifactPublication({
				...publication,
				selected: preManagedServiceStop
			});
			if (!await refreshCandidate()) continue;
			if (!mutationStarted) {
				preManagedServiceStop?.windowsTaskAutoStartRecovery?.beginMutation();
				mutationStarted = true;
				params.onActivation?.();
			}
			return;
		}
	};
	const installOptions = {
		root: params.root,
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
		if (params.updateInstallKind === "package" || params.updateInstallKind === "git") admission = await inspectUpdateDatabaseContexts({
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
			await recheckSchemas(params.packageTargetSchemaVersions);
			result = params.stagedPackage ? await params.stagedPackage.run(packageUpdate) : await runPackageInstallUpdate(packageUpdate);
		} else {
			const sourceRuntimePrepared = await admitSourceUpdateArtifacts(params.switchToGit ? resolveGitInstallDir() : params.root, opts.run);
			assertExecutionCurrent();
			result = await updateGitInstall({
				...installOptions,
				sourceRuntimePrepared,
				switchToGit: params.switchToGit,
				timeoutMs: params.timeoutMs,
				channel: params.channel,
				devTarget: params.devTarget,
				inspectGitTarget: async (target, installTarget) => {
					retentionInstallTarget = installTarget;
					await recordInspectedGitTarget(target, recordPhase, assertExecutionCurrent);
					assertExecutionCurrent();
					await recheckSchemas(target.schemaVersions);
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
					assertUpdateCandidateSteps(await validateCandidate(candidateRoot));
				},
				beforeGitMutation: async (target) => {
					assertReadableGitTarget(target);
					admittedTargetSchemaVersions = target.schemaVersions;
					await beforeActivate(gitMutationRoots ?? [params.root]);
				}
			});
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
	if (candidateFailureReason && result.status === "error") result.reason = candidateFailureReason;
	result.steps = databaseCapture ? [databaseCapture.step, ...result.steps] : result.steps;
	const doctorSettled = doctorEntered && !hasCommandProcessCleanupError(failure?.cause);
	if (databaseCapture?.backup && originalRun && result.status === "error" && doctorSettled) await restoreFailedUpdateDatabases({
		backup: databaseCapture.backup,
		result,
		runId: originalRun.runId,
		env: ownedManagedUpdateContext?.env ?? originalRun.env,
		assertCurrent: () => assertExecutionCurrent("restore"),
		assertRollbackSafe: packageTransaction?.assertRollbackSafe,
		progress: params.progress
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
	await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, async () => {
		const result = {
			...params.result,
			after: {
				...params.result.after ?? params.result.before,
				version: params.result.after?.version ?? params.result.before?.version ?? await readPackageVersion(params.root)
			}
		};
		const inspection = {
			...params,
			roots: [params.root],
			updateInstallKind: params.result.mode === "git" ? "git" : "package",
			jsonMode: Boolean(params.opts.json),
			timeoutMs: params.updateStepTimeoutMs,
			expectedForeground: params.opts.run?.completionOwner === "gateway-restart" || void 0
		};
		const admission = await inspectUpdateDatabaseContexts(inspection);
		const service = admission.service;
		let context = admission.foreground ? admission.contexts[0] : admission.contexts.at(-1);
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
				...params,
				result,
				coreAlreadyCurrent: true,
				deferredMaintenance,
				mutationStarted: false,
				installKindChanged: false,
				downgradeRisk: false,
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
		await inspectUpdateDatabaseContexts({
			...inspection,
			expectedServices: admission.services,
			expectedForeground: admission.foreground
		});
		admission.contexts = await Promise.all(admission.contexts.map(revalidateUpdateDatabaseContext));
		context = admission.foreground ? admission.contexts[0] : admission.contexts.at(-1);
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
		const plan = context.legacyConfigPlan?.snapshot.path === configSnapshot.path ? context.legacyConfigPlan : void 0;
		const storedChannel = normalizeUpdateChannel((plan?.config ?? configSnapshot.config).update?.channel);
		const beforeRepair = configSnapshot;
		if (plan) configSnapshot = await withOwnedManagedUpdateEnv(env, () => withPluginLifecycleLease({}, () => maybeRepairLegacyConfigForUpdateChannel({
			configSnapshot,
			plan,
			jsonMode: Boolean(params.opts.json)
		})));
		if (!configSnapshot.valid) throw new Error("Update refused: the selected configuration is still invalid.");
		result.status = beforeRepair.raw !== configSnapshot.raw ? "ok" : "skipped";
		if (result.status === "ok") delete result.reason;
		else result.reason = "already-current";
		params.stop();
		await finishUpdate({
			...params,
			packageUpdateNodeRunner,
			serviceRuntimeRefreshRequired: Boolean(params.managedServiceRoot || runtime.value.replacedNodeRunner),
			result,
			storedChannel,
			coreAlreadyCurrent: true,
			mutationStarted: false,
			installKindChanged: false,
			downgradeRisk: false,
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
		return updateStateSchemaVersionsMatch(schemaVersions, current, {
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
		return "rollback-state-unverified";
	}
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
		const workerEnv = {
			...stripGatewayServiceMarkerEnv(resolveUpdatedInstallCommandEnv({ processEnv: params.ownedManagedUpdateEnv ?? run.env })),
			OPENCLAW_UPDATE_IN_PROGRESS: "1",
			TMPDIR: scratchDir,
			TMP: scratchDir,
			TEMP: scratchDir
		};
		if (run.executorFence || run.completionOwner) {
			assertCurrent();
			const requiresRetainedOwner = run.executorFence ? requiresRetainedUpdateCommandOwner(run.executorFence) : false;
			const check = await runUtf8CommandWithTimeout([...workerCommand, "--check"], {
				cwd: root,
				baseEnv: {},
				env: workerEnv,
				timeoutMs: params.updateStepTimeoutMs,
				killProcessTree: true,
				requireProcessTreeExtinction: true,
				killGraceMs: 500,
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
		const { requesterAuthority, executorFence, sourceArtifactLock: _sourceArtifactLock, ...runIdentity } = run;
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
			cwd: root,
			baseEnv: {},
			env: workerEnv,
			input: JSON.stringify({
				...input,
				...grant ? { executor: grant } : {}
			}),
			beforeInput: bindChild,
			timeoutMs: run.activationTimeoutMs,
			killProcessTree: true,
			requireProcessTreeExtinction: true,
			killGraceMs: 500,
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
			automaticTriage: response.automaticTriage,
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
await prepareDeferredPluginMigrationRuntime();
//#endregion
export { continueMigratedUpdateInFreshProcess, createUpdateCommandExecutionGuards, createUpdateCommandFinalizationFence, executeMutableUpdate, finishAlreadyCurrentUpdate, finishUpdate, inspectActivatedUpdateState, restoreFailedUpdateDatabases, resumePostCoreUpdate };
