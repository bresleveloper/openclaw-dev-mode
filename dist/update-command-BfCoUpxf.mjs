import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { n as createUpdateErrorFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { a as resolveDebugProxySettings } from "./env-ZuG6CRvK.mjs";
import { n as withDeferredDebugProxyCapture } from "./runtime-deferral-Bdhp4T3g.mjs";
import { l as withGatewayServiceUpdateAuthority } from "./service-update-authority-Ddw1lcTH.mjs";
import { i as reportUpdateStepCompletion } from "./update-runner-command-DETznIV7.mjs";
import { o as finishUpdateRun } from "./update-run-write-Dd5ORe9V.mjs";
import { l as recordUpdateRunPhase } from "./update-run-ledger-C3oL-g8r.mjs";
import { t as UpdateRecoveryRequiredError } from "./update-run-recovery-schema-DparDBZU.mjs";
import { m as UpdateCommandRecoveryPendingError, o as captureUpdateCommandExecutorAuthority, p as UpdateActivationTimeoutError, t as withUpdateCommandExecutor } from "./update-command-executor-DUq8yLzH.mjs";
import "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { n as confirmUpdateDowngrade, u as resolveGitInstallDir } from "./shared-DRiGAorf.mjs";
import { d as withUpdateInProgressEnv, i as resolveServiceRefreshEnv, l as withOwnedManagedUpdateEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { t as createUpdateProgress } from "./progress-rcOXmnPk.mjs";
import { t as createUpdateConfigFailure } from "./update-command-config-failure-D1j4PRpI.mjs";
import { n as createGatewayRestartDeadline } from "./restart-health-deadline-W160VriR.mjs";
import "./update-run-recovery-BUElUFkd.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-CPjoG803.mjs";
import { d as mergeWindowsTaskRecoveryFailure, i as UpdateCommandPendingRecoveryFailure, n as UpdateCommandFailure, o as createUpdateCommandFailureResult, r as UpdateCommandFinalizedRecoveryFailure, y as withUpdateAdmissionReporting } from "./update-command-result-BgqRj9_Z.mjs";
import { t as admitUpdateRequesterContinuation } from "./update-command-managed-context-CxkSVUSh.mjs";
import { _ as resolveUpdateCommandAdmissionRoot, b as assertUpdatePackageActivationAdmission, d as admitUpdateCommandRun, f as completeUpdateCommandRun, g as resolveUpdateCommandAdmissionEnv, h as prepareUpdateCommand, l as withUpdateCommandTerminalResult, m as prepareMutableUpdateRuntime, n as hasDeferredUpdateCommandTerminalResult, o as reportPreMutationUpdateResult, p as createUpdateRunProgress, r as prepareUnexpectedUpdateCommandFailure, t as deferUpdateCommandTerminalResult, y as withUpdatePreviewSignals } from "./update-command-terminal-CPGdOHR-.mjs";
import { n as withUpdateFailureTriage } from "./update-command-triage-BoqzxDpM.mjs";
import { n as resolveUpdateCommandTarget, o as withUpdateCandidateAdmission } from "./update-command-target-BnTQqG6I.mjs";
import { a as preparePackageUpdateRuntime, n as preflightUpdateCommandSchemas, r as previewUpdateCommand } from "./update-command-schema-DFPuQCTq.mjs";
import { r as assertForkUpdateAllowed } from "./fork-update-block-BNpONrZP.mjs";
//#region src/cli/update-cli/update-command-unwind.ts
/** Unwind only legacy updates; pending publication cannot authorize compensation or diagnostics. */
async function withUpdateCommandRecoveryUnwind(opts, recoveryState, operation) {
	const run = opts.run;
	const primaryResult = (error) => error instanceof UpdateCommandFailure ? error.result : recoveryState.triageTarget.failureResult ?? {
		...createUpdateCommandFailureResult({
			mode: "unknown",
			root: recoveryState.triageTarget.root,
			durationMs: 0,
			failure: {
				cause: error,
				detail: createUpdateErrorFact("update", error, run.env).message
			}
		}),
		runId: run.runId
	};
	const pendingFailure = (cause, original) => new UpdateCommandPendingRecoveryFailure(primaryResult(original), formatErrorMessage(cause), { cause });
	const settlePending = async (error) => {
		if (opts.recovery) return error;
		try {
			await recoveryState.windowsTaskAutoStartRecovery?.complete(false, { preserveState: true });
			return error;
		} catch (cause) {
			return new UpdateCommandPendingRecoveryFailure(error.result, `${formatErrorMessage(error)}; Windows suspension settlement failed: ${formatErrorMessage(cause)}`, { cause: new AggregateError([error, cause], "Pending update cleanup failed", { cause: error }) });
		}
	};
	let failure;
	try {
		await withCommandProcessScope(operation);
		run.executorFence?.assertCurrent();
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw await settlePending(pendingFailure(error, error));
		try {
			run.executorFence?.assertCurrent();
		} catch (cause) {
			throw await settlePending(new UpdateCommandPendingRecoveryFailure(primaryResult(error), formatErrorMessage(cause), { cause: new AggregateError([error, cause], "Update executor was lost", { cause: error }) }));
		}
		if (error instanceof UpdateCommandPendingRecoveryFailure || error instanceof UpdateCommandFinalizedRecoveryFailure) throw await settlePending(error);
		if (error instanceof UpdateCommandRecoveryPendingError || error instanceof UpdateRecoveryRequiredError || opts.recovery) throw await settlePending(pendingFailure(error, error));
		failure = { error };
	}
	if (opts.recovery) return;
	if (recoveryState.ledgerHandoffOwned && !recoveryState.ledgerHandoffCompleted) {
		let cause = failure?.error ?? /* @__PURE__ */ new Error("Update finalization has no confirmed outcome.");
		try {
			await recoveryState.windowsTaskAutoStartRecovery?.complete(false);
		} catch (error) {
			cause = new AggregateError([cause, error], "Migrated handoff recovery remains pending", { cause });
		}
		throw pendingFailure(cause, failure?.error ?? cause);
	}
	if (!recoveryState.ledgerHandoffOwned) {
		const admitRecovery = async () => {
			const paths = /* @__PURE__ */ new Set();
			for (const env of [run.env, recoveryState.triageTarget.env]) {
				const file = resolveOpenClawStateSqlitePath(env);
				if (paths.has(file)) continue;
				paths.add(file);
				await assertUpdateRecoveryAdmission({ env });
			}
		};
		try {
			await admitRecovery();
		} catch (error) {
			const pending = pendingFailure(error, failure?.error ?? error);
			if (failure && !(failure.error instanceof UpdateCommandFailure) && !run.executorFence && !recoveryState.windowsTaskAutoStartRecovery && !hasDeferredUpdateCommandTerminalResult(run)) {
				const original = failure.error;
				deferUpdateCommandTerminalResult(run, async (settlementFailure, onTerminalRecord) => {
					if (settlementFailure !== pending) throw settlementFailure;
					try {
						await admitRecovery();
					} catch (cause) {
						throw pendingFailure(cause, original);
					}
					const recorded = await prepareUnexpectedUpdateCommandFailure(original, opts, onTerminalRecord);
					if (recorded instanceof UpdateCommandPendingRecoveryFailure) throw recorded;
					return recorded.result;
				});
			}
			throw await settlePending(pending);
		}
	}
	try {
		await recoveryState.windowsTaskAutoStartRecovery?.restore();
		await recoveryState.windowsTaskAutoStartRecovery?.complete();
	} catch (restoreError) {
		let error = restoreError;
		try {
			await recoveryState.windowsTaskAutoStartRecovery?.complete(false);
		} catch (compensationError) {
			error = new AggregateError([error, compensationError], `Windows task autostart recovery failed: ${formatErrorMessage(error)}; ${formatErrorMessage(compensationError)}`, { cause: error });
		}
		failure = mergeWindowsTaskRecoveryFailure(failure, error);
	}
	if (failure) {
		if (failure.error instanceof ExitError) throw failure.error;
		if (!recoveryState.ledgerHandoffOwned && !hasDeferredUpdateCommandTerminalResult(run)) {
			if (failure.error instanceof UpdateCommandFailure) completeUpdateCommandRun(failure.error.result, run);
			else failure.error = await prepareUnexpectedUpdateCommandFailure(failure.error, opts);
		}
		throw failure.error;
	}
}
//#endregion
//#region src/cli/update-cli/update-command-admitted.ts
async function runAdmittedUpdate(inputOpts, prepared, recoveryState, invocationCwd, executeUpdate, initialization, executorOptions) {
	const refusal = initialization?.refusal;
	const serviceRoot = initialization ? initialization.refusal ? initialization.refusal.report.serviceRoot : initialization.target.managedServiceRoot : prepared.servicePlan?.serviceRoot;
	let initializedFence;
	let assertInitializationCurrent;
	if (initialization) {
		const root = initialization.refusal ? initialization.refusal.report.root : initialization.target.root;
		const fence = await initialization.executor.enter(root, {
			preflight: true,
			serviceRoot
		});
		initializedFence = fence;
		assertInitializationCurrent = () => {
			fence.assertCurrent();
			assertUpdatePackageActivationAdmission(root, {
				serviceRoot,
				dryRun: inputOpts.dryRun
			});
		};
	}
	const run = await admitUpdateCommandRun({
		opts: inputOpts,
		root: resolveUpdateCommandAdmissionRoot(prepared),
		serviceRoot,
		invocationCwd,
		initialization,
		assertCurrent: assertInitializationCurrent,
		pkgOwnership: prepared.pkgOwnership,
		expectedForeground: prepared.controlPlaneUpdateSentinelMeta?.completionOwner === "gateway-restart" || void 0,
		installKind: prepared.installKind
	});
	const deadline = !inputOpts.dryRun && inputOpts.timeout !== void 0 && prepared.timeoutMs !== void 0 ? createGatewayRestartDeadline({
		timeoutMs: prepared.timeoutMs,
		timeoutError: new UpdateActivationTimeoutError(resolveUpdateCommandAdmissionRoot(prepared), prepared.timeoutMs)
	}) : void 0;
	run.deadline = deadline;
	const opts = {
		...inputOpts,
		run
	};
	prepared.controlPlaneUpdateSentinelMeta = {
		...prepared.controlPlaneUpdateSentinelMeta,
		runId: run.runId
	};
	recoveryState.triageTarget.root = prepared.discoveredRoot;
	let disposePresentation;
	let executionStarted = false;
	try {
		assertInitializationCurrent?.();
		run.executorFence = initializedFence;
		await initialization?.registerRun(run, () => disposePresentation?.());
		const presentation = createUpdateProgress(!opts.json, run);
		disposePresentation = presentation.dispose;
		const executeWith = (executor) => withUpdatePreviewSignals(opts, async () => {
			await admitUpdateRequesterContinuation(run, executor, resolveUpdateCommandAdmissionRoot(prepared), serviceRoot);
			if (deadline) run.executorFence = await executor.enter(resolveUpdateCommandAdmissionRoot(prepared), {
				preflight: true,
				serviceRoot,
				activationTimeoutMs: Math.max(1, deadline.remainingMs())
			});
			const execute = () => {
				executionStarted = true;
				if (refusal) {
					assertInitializationCurrent?.();
					throw refusal;
				}
				return withUpdateCommandRecoveryUnwind(opts, recoveryState, () => withCommandProcessScope(async () => {
					deadline?.signal.throwIfAborted();
					await executeUpdate(opts, presentation, executor);
					deadline?.signal.throwIfAborted();
				}, deadline?.signal));
			};
			if (inputOpts.dryRun || !prepared.controlPlaneUpdateSentinelMeta?.handoffId) return execute();
			const fence = run.executorFence ?? await executor.enter(prepared.servicePlan?.rootRedirect?.root ?? prepared.discoveredRoot, {
				preflight: true,
				serviceRoot: prepared.servicePlan?.serviceRoot
			});
			run.executorFence = fence;
			const runId = run.runId;
			const assertCurrent = () => {
				if (opts.run !== run || run.runId !== runId || run.executorFence !== fence) throw new UpdateCommandRecoveryPendingError("Managed updater lost its admitted executor.");
				captureUpdateCommandExecutorAuthority(fence, runId);
			};
			return withGatewayServiceUpdateAuthority(assertCurrent, execute, { originalRoot: captureUpdateCommandExecutorAuthority(fence, runId).installKey });
		});
		await (initialization ? () => executeWith(initialization.executor) : () => withUpdateFailureTriage({
			...opts,
			invocationCwd
		}, recoveryState.triageTarget, () => withUpdateInProgressEnv(invocationCwd, () => withUpdateCommandTerminalResult((registerRun) => {
			registerRun(run);
			return withUpdateCommandExecutor(run.runId, executeWith, executorOptions);
		}, opts))))();
	} catch (error) {
		if (!executionStarted) throw await prepareUnexpectedUpdateCommandFailure(error, opts);
		throw error;
	} finally {
		deadline?.dispose();
		if (!initialization) disposePresentation?.();
	}
}
//#endregion
//#region src/cli/update-cli/update-command.ts
async function updateCommand(inputOpts, executorOptions) {
	assertForkUpdateAllowed();
	return await withDeferredDebugProxyCapture(async () => {
		const { tryRunImmutableUpdateCommand } = await import("./update-command-immutable-D83H3MMS.mjs");
		if (await tryRunImmutableUpdateCommand(inputOpts)) return;
		const { withRetainedUpdateRuntime } = await import("./update-retained-runtime-Bx6YkXuK.mjs");
		return await withRetainedUpdateRuntime(import.meta.url, (retainRuntime) => updateCommandWithRuntime(inputOpts, retainRuntime, executorOptions));
	});
}
async function updateCommandWithRuntime(inputOpts, retainRuntime, executorOptions) {
	const invocationCwd = tryProcessCwd();
	const recoveryState = { triageTarget: { env: resolveServiceRefreshEnv(process.env, invocationCwd) } };
	const prepared = await withUpdateAdmissionReporting(inputOpts, () => withUpdateInProgressEnv(invocationCwd, () => prepareUpdateCommand(inputOpts)));
	if (prepared.postCoreUpdateResume) return await withUpdateInProgressEnv(invocationCwd, async () => (await import("./update-execution.runtime.js")).resumePostCoreUpdate({
		root: prepared.discoveredRoot,
		channel: prepared.postCoreUpdateChannel,
		opts: inputOpts,
		timeoutMs: prepared.timeoutMs ?? 18e5
	}));
	return await withUpdateAdmissionReporting(inputOpts, async () => {
		const root = prepared.servicePlan?.rootRedirect?.root ?? prepared.discoveredRoot;
		const serviceRoot = prepared.servicePlan?.serviceRoot;
		const env = await resolveUpdateCommandAdmissionEnv({
			opts: inputOpts,
			root: resolveUpdateCommandAdmissionRoot(prepared),
			invocationCwd,
			pkgOwnership: prepared.pkgOwnership,
			expectedForeground: prepared.controlPlaneUpdateSentinelMeta?.completionOwner === "gateway-restart" || void 0
		});
		if (inputOpts.dryRun && resolveDebugProxySettings(env).enabled) defaultRuntime.error("Warning: Debug HTTP capture is disabled during update dry runs.");
		const { updateStateNeedsInitialization } = await import("./update-command-initialization-BIz0KjL1.mjs");
		assertUpdatePackageActivationAdmission(root, {
			serviceRoot,
			dryRun: inputOpts.dryRun
		});
		const needsInitialization = await updateStateNeedsInitialization(env);
		const captureOriginal = !inputOpts.dryRun && !inputOpts.run && !inputOpts.recovery && !executorOptions && !env["OPENCLAW_UPDATE_RUN_ID"]?.trim() && env.OPENCLAW_UPDATE_RUN_HANDOFF !== "1";
		const execute = (initialization) => runAdmittedUpdate(inputOpts, prepared, recoveryState, invocationCwd, (opts, presentation, executor) => updateCommandInternal(opts, recoveryState, invocationCwd, prepared, presentation, executor, retainRuntime, initialization), initialization, executorOptions);
		if (needsInitialization || captureOriginal) {
			const { initializeAndRunUpdate } = await import("./update-command-initialization-run-BmCmvLXL.mjs");
			return await initializeAndRunUpdate(inputOpts, prepared, recoveryState, invocationCwd, env, execute, {
				needsInitialization,
				captureOriginal
			}, executorOptions);
		}
		return await execute();
	});
}
async function updateCommandInternal(opts, recoveryState, invocationCwd, prepared, presentation, executor, retainRuntime, initialization) {
	const admittedRun = opts.run;
	const admissionStepTimeoutMs = prepared.timeoutMs ?? admittedRun.defaultStepTimeoutMs ?? 18e5;
	let target = initialization?.target;
	const selectTarget = () => resolveUpdateCommandTarget(opts, recoveryState, invocationCwd, prepared, executor, admissionStepTimeoutMs);
	if (!target) target = initialization ? await withOwnedManagedUpdateEnv(initialization.env, selectTarget) : await selectTarget();
	if (!target) return;
	const runResolvedUpdate = async (stagedPackage) => {
		const { startedAt, timeoutMs, shouldRestart, requestedChannel, controlPlaneUpdateSentinelMeta, discoveredRoot, installKind } = prepared;
		const run = opts.run;
		const updateStepTimeoutMs = timeoutMs ?? run.defaultStepTimeoutMs ?? 18e5;
		const { root, mode, updateInstallKind, configSnapshot, legacyConfigPlan, storedChannel, channel, switchToGit, switchToPackage, tag, currentVersion, targetVersion, downgradeRisk, packageInstallTarget, packageAlreadyCurrent, packageRuntimeTarget, managedServiceRootRedirect, managedServiceRoot, managedServiceNodeRunner } = target;
		let { packageUpdateNodeRunner } = target;
		let packageActivationRuntime;
		const refuseUpdate = async (reason, message, failureFacts, recoverySteps) => {
			await stagedPackage?.close();
			return await reportPreMutationUpdateResult({
				root,
				mode,
				installKind: updateInstallKind,
				opts,
				controlPlaneUpdateSentinelMeta,
				reason,
				message,
				failureFacts,
				recoverySteps
			});
		};
		recordUpdateRunPhase(run.runId, "staging", {
			target: {
				channel,
				tag,
				kind: updateInstallKind,
				...targetVersion ? { version: targetVersion } : {}
			},
			before: { version: currentVersion ?? VERSION }
		}, { env: run.env });
		if (opts.channel && !configSnapshot.valid && !legacyConfigPlan && !run.candidateAdmissionChecks?.includes("config")) {
			const failure = createUpdateConfigFailure(configSnapshot);
			return await refuseUpdate(failure.reason, failure.message, failure.failureFacts);
		}
		await target.assertPackageRuntimeCurrent?.();
		const schemaPreflight = await preflightUpdateCommandSchemas({
			...target,
			callerLegacyConfigPlan: initialization?.callerLegacyConfigPlan,
			shouldRestart,
			updateStepTimeoutMs,
			invocationCwd,
			packageTargetVersion: targetVersion ?? void 0,
			opts,
			refuseUpdate
		});
		if (!schemaPreflight) return;
		if (opts.dryRun) {
			finishUpdateRun(run.runId, {
				status: "skipped",
				reason: "dry-run"
			}, { env: run.env });
			return await previewUpdateCommand({
				target,
				prepared,
				opts,
				runId: run.runId,
				updateStepTimeoutMs,
				invocationCwd,
				preflight: schemaPreflight
			});
		}
		const finalizationContext = {
			opts,
			root,
			previousInstallRoot: discoveredRoot,
			requestedChannel,
			storedChannel,
			channel,
			shouldRestart,
			updateStepTimeoutMs,
			invocationCwd,
			startedAt,
			controlPlaneUpdateSentinelMeta
		};
		const currentCoreFinalization = {
			...finalizationContext,
			legacyConfigPlan,
			callerLegacyConfigPlan: initialization?.callerLegacyConfigPlan,
			packageUpdateNodeRunner: packageUpdateNodeRunner ?? managedServiceNodeRunner,
			runtimeTarget: packageRuntimeTarget,
			managedServiceRootRedirect,
			managedServiceRoot,
			stop: presentation.stop,
			refuseUpdate
		};
		const activateCurrentCore = async () => {
			run.executorFence = await executor.enter(root, {
				preflight: true,
				serviceRoot: managedServiceRoot,
				activationTimeoutMs: run.deadline?.remainingMs() ?? run.activationTimeoutMs
			});
			run.executorFence.assertCurrent();
			assertUpdatePackageActivationAdmission(root, { serviceRoot: managedServiceRoot });
		};
		if (packageAlreadyCurrent) {
			await activateCurrentCore();
			const { finishAlreadyCurrentUpdate } = await import("./update-execution.runtime.js");
			return await finishAlreadyCurrentUpdate({
				...currentCoreFinalization,
				result: {
					status: "skipped",
					mode: packageInstallTarget?.manager ?? "unknown",
					root,
					reason: "already-current",
					before: { version: currentVersion },
					after: { version: currentVersion },
					steps: [],
					durationMs: Date.now() - startedAt
				}
			});
		}
		if (downgradeRisk && !opts.yes && !initialization?.downgradeConfirmed && !await confirmUpdateDowngrade({
			opts,
			currentVersion,
			targetVersion,
			tag
		})) return;
		if (updateInstallKind === "git" && opts.tag && !opts.json) defaultRuntime.log(theme.muted("Note: --tag applies to npm installs only; git updates ignore it."));
		if (updateInstallKind === "package") {
			const runtimePreflight = await preparePackageUpdateRuntime({
				...target,
				managedService: schemaPreflight.service,
				shouldRestart,
				opts,
				executor,
				timeoutMs: updateStepTimeoutMs
			});
			if (!runtimePreflight.ok) return await refuseUpdate("node-runtime-preflight", runtimePreflight.error, runtimePreflight.failureFacts, runtimePreflight.recoverySteps);
			packageUpdateNodeRunner = runtimePreflight.value.nodeRunner;
			packageActivationRuntime = runtimePreflight.value.activationRuntime;
			recoveryState.triageTarget.nodeRunner = packageUpdateNodeRunner;
		}
		const { executeMutableUpdate, finishUpdate, finishAlreadyCurrentUpdate, continueMigratedUpdateInFreshProcess, inspectActivatedUpdateState, restoreFailedUpdateDatabases, createUpdateCommandFinalizationFence, createUpdateCommandExecutionGuards } = await import("./update-execution.runtime.js");
		const executionGuards = createUpdateCommandExecutionGuards(opts, root);
		const progress = createUpdateRunProgress(run, presentation.progress, executionGuards.recordStep);
		let preUpdatePluginInstallRecords = {};
		let mutableUpdatePrepared = false;
		let retainedRuntimeStep;
		const prepareMutableUpdate = async (env, activationTimeoutMs, admitExecutor, installTarget) => {
			if (!mutableUpdatePrepared) assertUpdatePackageActivationAdmission(root, { serviceRoot: managedServiceRoot });
			const fence = await executor.enter(root, {
				serviceRoot: managedServiceRoot,
				activationTimeoutMs: run.deadline?.remainingMs() ?? activationTimeoutMs
			});
			admitExecutor(fence);
			run.activationTimeoutMs ??= activationTimeoutMs;
			fence.assertCurrent();
			if (mutableUpdatePrepared) {
				if (managedServiceRoot) assertUpdatePackageActivationAdmission(managedServiceRoot);
				return;
			}
			const installKey = captureUpdateCommandExecutorAuthority(fence).installKey;
			assertUpdatePackageActivationAdmission(installKey, { serviceRoot: managedServiceRoot });
			preUpdatePluginInstallRecords = await prepareMutableUpdateRuntime(env, fence);
			const retentionStep = {
				name: "updater-runtime-retention",
				command: "retain running updater runtime",
				index: 0,
				total: 0
			};
			const retentionStartedAt = Date.now();
			await progress.onStepStart?.(retentionStep);
			const retention = await retainRuntime({
				mutationRoots: [root, ...switchToGit ? [resolveGitInstallDir()] : []],
				installTarget,
				env,
				timeoutMs: updateStepTimeoutMs,
				assertCurrent: () => fence.assertCurrent()
			});
			retainedRuntimeStep = {
				name: retentionStep.name,
				command: retentionStep.command,
				cwd: root,
				durationMs: Date.now() - retentionStartedAt,
				exitCode: 0,
				diagnostics: retention ? [JSON.stringify(retention)] : void 0
			};
			await reportUpdateStepCompletion(progress, {
				...retentionStep,
				...retainedRuntimeStep
			});
			mutableUpdatePrepared = true;
		};
		const execution = await executeMutableUpdate({
			...target,
			callerLegacyConfigPlan: initialization?.callerLegacyConfigPlan,
			installKind,
			timeoutMs,
			updateStepTimeoutMs,
			startedAt,
			progress,
			executionGuards,
			stop: presentation.stop,
			opts,
			shouldRestart,
			stagedPackage,
			packageTargetVersion: targetVersion ?? void 0,
			packageUpdateNodeRunner,
			packageActivationRuntime,
			managedServiceNodeRunner,
			managedServiceRootRedirect,
			managedServiceRoot,
			invocationCwd,
			recoveryState,
			prepareMutableUpdate,
			onActivation: () => {
				presentation.suspend();
				progress.deferLedgerWrites();
			}
		});
		run.executorFence?.assertCurrent();
		if (!execution) return;
		const { ownedManagedUpdateContext, recoveryEnv, ...executionState } = execution;
		const { result } = executionState;
		if (retainedRuntimeStep) result.steps.unshift(retainedRuntimeStep);
		result.runId = run.runId;
		if (result.status === "skipped" && result.reason === "already-current") {
			await activateCurrentCore();
			presentation.stop();
			return await finishAlreadyCurrentUpdate({
				...currentCoreFinalization,
				root: result.root ?? root,
				result,
				ownedManagedUpdateEnv: ownedManagedUpdateContext?.env,
				packageUpdateNodeRunner: packageUpdateNodeRunner ?? managedServiceNodeRunner
			});
		}
		recoveryState.triageTarget.root = result.root ?? root;
		recoveryState.triageTarget.failureResult = result;
		recoveryState.triageTarget.env = recoveryEnv ?? ownedManagedUpdateContext?.env ?? recoveryState.triageTarget.env;
		presentation.stop();
		const finalization = {
			...executionState,
			...finalizationContext,
			expectedVersion: targetVersion ?? void 0,
			installKindChanged: switchToGit || switchToPackage,
			configSnapshot: ownedManagedUpdateContext?.configSnapshot ?? configSnapshot,
			downgradeRisk,
			ownedManagedUpdateEnv: ownedManagedUpdateContext?.env,
			preUpdatePluginInstallRecords: ownedManagedUpdateContext?.pluginInstallRecords ?? preUpdatePluginInstallRecords,
			packageUpdateNodeRunner
		};
		const rollbackBlockedReason = opts.recovery ? void 0 : await inspectActivatedUpdateState({
			result,
			root,
			packageUpdateNodeRunner,
			schemaVersions: execution.schemaVersions,
			candidateSchemaVersions: execution.candidateSchemaVersions,
			config: finalization.configSnapshot.config,
			env: ownedManagedUpdateContext?.env ?? run.env,
			timeoutMs: updateStepTimeoutMs
		});
		run.executorFence?.assertCurrent();
		if (opts.recovery || rollbackBlockedReason) {
			recoveryState.ledgerHandoffOwned = true;
			const assertRollbackCurrent = createUpdateCommandFinalizationFence(finalization);
			const continued = await continueMigratedUpdateInFreshProcess({
				...finalization,
				rollbackBlockedReason
			}, progress.pendingSteps);
			if (continued.databaseRollbackAvailable && finalization.databaseBackup) {
				if (!await restoreFailedUpdateDatabases({
					backup: finalization.databaseBackup,
					result: continued.result,
					runId: run.runId,
					env: ownedManagedUpdateContext?.env ?? run.env,
					assertCurrent: assertRollbackCurrent,
					progress
				})) throw new UpdateCommandPendingRecoveryFailure(continued.result, continued.result.steps.at(-1)?.stderrTail ?? void 0);
				await finishUpdate({
					...finalization,
					result: continued.result
				}, { beforeFinalization: async () => {
					await progress.flushLedgerWrites();
					recoveryState.ledgerHandoffOwned = false;
					presentation.resume();
				} });
				return;
			}
			recoveryState.ledgerHandoffCompleted = true;
			opts.onResult?.(continued.result);
			if (continued.exitCode !== 0) throw new UpdateCommandFailure(continued.result, continued.exitCode);
			return;
		}
		await finishUpdate(finalization, { beforeFinalization: async () => {
			await progress.flushLedgerWrites();
			presentation.resume();
		} });
	};
	return await withUpdateCandidateAdmission({
		target,
		prepared,
		opts,
		timeoutMs: admissionStepTimeoutMs,
		invocationCwd,
		presentation,
		stagedPackage: initialization?.stagedPackage,
		candidateAdmission: initialization?.candidateAdmission
	}, runResolvedUpdate);
}
//#endregion
export { updateCommand };
