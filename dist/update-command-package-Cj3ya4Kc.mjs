import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { a as normalizeUpdateFailureFacts, r as createUpdateFailureFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, p as createUpdatePostInstallDoctorResultPath, u as consumeUpdatePostInstallDoctorResult } from "./update-doctor-result-oZ38327j.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { n as resolveInstallWorkTimeoutMs } from "./install-mode-options-C9VDc932.mjs";
import { i as readPackageVersion, r as readPackageName } from "./package-json-B0xzRYh1.mjs";
import { a as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CiE2knkN.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-S2Kgafdv.mjs";
import { b as UpdatePreMutationError, d as resolveGlobalInstallTarget, g as createGlobalInstallEnv, h as verifyPackageUpdateRecovery, u as resolveGlobalInstallSpec } from "./update-global-BlXQRfes.mjs";
import { i as reportUpdateStepCompletion, r as normalizeFallbackFailureReason } from "./update-runner-command-DETznIV7.mjs";
import { i as getUpdateDoctorConfigFailureReason, r as formatUpdateDoctorConfigWriteRefusal } from "./update-doctor-config-BrLAVDg0.mjs";
import { a as UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV, s as UPDATE_POST_ACTIVATION_INSPECTIONS_REPORT_MODE } from "./update-phase-M5rvMZiC.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { d as resolveGlobalManager, m as runUpdateStep } from "./shared-DRiGAorf.mjs";
import { o as resolveUpdateTargetEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { t as createDoctorServiceInspectionBudget } from "./update-doctor-deadline-CYXeKJpA.mjs";
import { t as createUpdateDoctorSectionTiming } from "./update-doctor-section-timing-BWwM1Ehw.mjs";
import { n as resolveUpdateDoctorExecutionPolicy, t as buildUpdateDoctorEnv } from "./update-runner-doctor-CqKjyCJ3.mjs";
import { n as createUpdateConfigSnapshot, r as readUpdateConfigSnapshot, t as captureUpdateConfigSnapshot } from "./update-command-config-snapshot-tEb-vXUT.mjs";
import { t as recordUpdateDatabaseWrites } from "./update-command-database-receipts-CpweMiFK.mjs";
import { i as withUpdateDoctorChild } from "./update-command-doctor-child-C43avymO.mjs";
import { t as readPackageUpdateIdentity } from "./update-command-package-identity-DsYk7vPy.mjs";
import { a as PackageUpdateActivationError, i as markPackagePostInstallDoctorAdvisory, n as deferPackageStateVerification, r as failedPackageVerificationStep, t as runGlobalPackageUpdateSteps } from "./package-update-steps-CyYbYiYK.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import path from "node:path";
//#region src/cli/update-cli/update-command-doctor-completion.ts
function createPackageUpdateDoctorCompletion(params) {
	const { context, configSnapshot, sectionTiming, assertCurrent, doctorProgressInfo } = params;
	return async (doctorStep, doctorResult, failure) => {
		let completionFailure = failure;
		sectionTiming.annotate(doctorStep);
		const databaseReceipt = context?.databaseBackup ? recordUpdateDatabaseWrites(context.databaseBackup, doctorResult?.databaseWrites, doctorStep) : void 0;
		if (databaseReceipt) params.results.unshift(databaseReceipt);
		try {
			const refusal = doctorResult?.configWriteRefusal;
			const configWriteRefusal = refusal ? {
				...refusal,
				keys: [.../* @__PURE__ */ new Set([...refusal.keys, ...context?.changes.flatMap((change) => change.kind === "key" ? [change.key] : []) ?? []])].toSorted()
			} : void 0;
			Object.assign(doctorStep, markPackagePostInstallDoctorAdvisory({
				...doctorStep,
				deferredInspectionCheckIds: doctorResult?.deferredInspectionCheckIds ?? null,
				...doctorResult?.configChanges?.length ? { configChanges: doctorResult.configChanges } : {},
				...doctorResult?.warnings?.length ? { warnings: doctorResult.warnings } : {},
				...configWriteRefusal ? {
					configWriteRefusal,
					stderrTail: formatUpdateDoctorConfigWriteRefusal(configWriteRefusal)
				} : {}
			}, doctorResult));
			if (configSnapshot?.doctorOwned === false) doctorStep.warnings = [...doctorStep.warnings ?? [], "The config include graph could not be captured before Doctor; automatic config rollback is unavailable for this update."];
			if (configWriteRefusal) {
				doctorStep.failureFacts = normalizeUpdateFailureFacts([createUpdateFailureFact({
					check: "config",
					code: configWriteRefusal.reason,
					message: formatUpdateDoctorConfigWriteRefusal(configWriteRefusal)
				}), ...doctorStep.failureFacts ?? []]);
				delete doctorStep.advisory;
			}
			if (configSnapshot) {
				const { hash } = await readUpdateConfigSnapshot(configSnapshot.path);
				const doctorHash = doctorResult?.configHash;
				const doctorInputHash = doctorResult?.configInputHash;
				const capturedPaths = /* @__PURE__ */ new Set([configSnapshot.pathSnapshot?.targetPath ?? configSnapshot.path, ...(configSnapshot.includedFiles ?? []).map((file) => file.pathSnapshot?.targetPath ?? file.path)]);
				const writesCaptured = Object.keys(doctorResult?.configFileWrites ?? {}).every((file) => capturedPaths.has(file));
				const includedFiles = [];
				for (const file of configSnapshot.includedFiles ?? []) {
					const current = await readUpdateConfigSnapshot(file.path);
					const receipt = doctorResult?.configFileWrites?.[file.pathSnapshot?.targetPath ?? file.path];
					includedFiles.push({
						...file,
						hash: current.hash,
						doctorOwned: receipt?.inputHash === void 0 ? current.hash === file.hash : receipt.inputHash === file.hash && current.hash === receipt.hash
					});
				}
				params.onConfigSnapshot?.({
					...configSnapshot,
					hash,
					...configSnapshot.includedFiles ? { includedFiles } : {},
					doctorOwned: configSnapshot.doctorOwned !== false && writesCaptured && (doctorInputHash === void 0 ? hash === configSnapshot.hash : doctorInputHash === configSnapshot.hash && hash === (doctorHash === "unchanged" ? doctorInputHash : doctorHash))
				});
			}
		} catch (error) {
			completionFailure = { error: completionFailure ? new AggregateError([completionFailure.error, error], "Doctor config attribution failed", { cause: error }) : error };
		}
		if (completionFailure) {
			Object.assign(doctorStep, failedPackageVerificationStep(params.root, completionFailure.error, doctorStep));
			delete doctorStep.advisory;
		}
		const reportCompletion = async (step) => {
			try {
				await (completionFailure ? params.progress?.onStepComplete?.(step) : reportUpdateStepCompletion(params.progress, step));
			} catch (error) {
				if (completionFailure) throw new AggregateError([completionFailure.error, error], "Doctor progress reporting failed", { cause: error });
				throw error;
			}
		};
		if (databaseReceipt) {
			await reportCompletion({
				...databaseReceipt,
				index: 0,
				total: 0
			});
			assertCurrent();
		}
		await reportCompletion({
			...doctorProgressInfo,
			durationMs: doctorStep.durationMs,
			exitCode: doctorStep.exitCode,
			stdoutTail: doctorStep.stdoutTail,
			stderrTail: doctorStep.stderrTail,
			signal: doctorStep.signal,
			killed: doctorStep.killed,
			outputLimitExceeded: doctorStep.outputLimitExceeded,
			termination: doctorStep.termination,
			advisory: doctorStep.advisory,
			warnings: doctorStep.warnings,
			diagnostics: doctorStep.diagnostics,
			failureFacts: doctorStep.failureFacts,
			doctorLintFindings: doctorStep.doctorLintFindings,
			deferredInspectionCheckIds: doctorStep.deferredInspectionCheckIds,
			configChanges: doctorStep.configChanges,
			configWriteRefusal: doctorStep.configWriteRefusal
		});
		assertCurrent();
		if (completionFailure) throw completionFailure.error;
		return doctorStep;
	};
}
//#endregion
//#region src/cli/update-cli/update-command-package.ts
async function runPackageUpdateDoctor(params) {
	const doctorTimeoutMs = resolveInstallWorkTimeoutMs(params.workTimeoutMs, params.timeoutMs);
	const remaining = createDoctorServiceInspectionBudget(doctorTimeoutMs === void 0 ? void 0 : Date.now() + doctorTimeoutMs);
	const assertRequesterCurrent = params.assertCurrent;
	const context = params.getDoctorContext?.();
	const assertCurrent = () => {
		assertRequesterCurrent?.();
		context?.assertCurrent();
	};
	context?.assertCurrent();
	const entryPath = await resolveGatewayInstallEntrypoint(params.root);
	if (!entryPath) return null;
	const doctorEnv = resolveUpdateTargetEnv({
		serviceEnv: params.managedServiceEnv,
		invocationCwd: params.invocationCwd
	});
	await createUpdateConfigSnapshot(doctorEnv);
	const candidateHostVersion = await readPackageVersion(params.root);
	const doctorResultPath = createUpdatePostInstallDoctorResultPath();
	const sectionTiming = createUpdateDoctorSectionTiming();
	const doctorPolicy = resolveUpdateDoctorExecutionPolicy({
		targetVersion: candidateHostVersion,
		allowGatewayServiceRepair: false
	});
	const doctorArgv = [params.nodeRunner ?? resolveNodeRunner(), ...context ? [path.join(params.root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath), "--doctor"] : [
		entryPath,
		"doctor",
		"--non-interactive",
		...doctorPolicy.fix ? ["--fix"] : []
	]];
	const doctorProgressInfo = {
		name: `${CLI_NAME} doctor`,
		command: doctorArgv.join(" "),
		index: 0,
		total: 0
	};
	let configSnapshot;
	try {
		configSnapshot = params.onConfigSnapshot ? await captureUpdateConfigSnapshot(resolveConfigPath(doctorEnv), doctorEnv) : void 0;
	} catch (error) {
		assertCurrent();
		return await deferPackageStateVerification({
			...params,
			assertCurrent,
			migrationRecorded: Boolean(context?.databaseBackup?.migration)
		}, error);
	}
	await params.progress?.onStepStart?.(doctorProgressInfo);
	assertCurrent();
	const completedSteps = [];
	const completeDoctorStep = createPackageUpdateDoctorCompletion({
		root: params.root,
		progress: params.progress,
		results: completedSteps,
		onConfigSnapshot: params.onConfigSnapshot,
		context,
		configSnapshot,
		sectionTiming,
		assertCurrent,
		doctorProgressInfo
	});
	let processSettlement;
	const runDoctor = (runCommand) => runUpdateStep({
		name: `${CLI_NAME} doctor`,
		results: completedSteps,
		argv: doctorArgv,
		cwd: params.root,
		env: {
			...doctorEnv,
			...buildUpdateDoctorEnv({
				allowGatewayServiceRepair: false,
				allowGatewayActivation: false,
				deferConfiguredPluginInstallRepair: true,
				serviceRepairPolicy: doctorPolicy.serviceRepairPolicy,
				compatibilityHostVersion: candidateHostVersion
			}),
			...sectionTiming.env,
			[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]: doctorResultPath,
			[UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV]: params.restart === false ? "0" : UPDATE_POST_ACTIVATION_INSPECTIONS_REPORT_MODE
		},
		timeoutMs: remaining(),
		runCommand: sectionTiming.wrap(runCommand ?? runCommandWithTimeout)
	});
	let outcome;
	try {
		outcome = { step: context ? await withUpdateDoctorChild({
			root: params.root,
			context: {
				...context,
				assertRequesterCurrent: context.assertBoundChildCurrent,
				onProcessSettlement: (step) => {
					processSettlement = step;
				}
			},
			input: {
				configInputHash: context.inputHash,
				repair: doctorPolicy.fix,
				databaseGenerations: context.databaseBackup?.sourceGenerations,
				originalRecoveryCapture: context.originalRecoveryCapture,
				get serviceInspectionDeadlineAtMs() {
					const budget = remaining();
					return budget === void 0 ? void 0 : Date.now() + budget;
				}
			}
		}, runDoctor) : await runDoctor() };
		context?.assertCurrent();
	} catch (error) {
		outcome = { error };
	}
	try {
		if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) throw outcome.error;
		const doctorResult = await consumeUpdatePostInstallDoctorResult(doctorResultPath);
		if ("error" in outcome) {
			const recorded = completedSteps.at(-1);
			if (!recorded) throw outcome.error;
			outcome = { step: await completeDoctorStep(recorded, doctorResult, outcome) };
		} else outcome = { step: await completeDoctorStep(outcome.step, doctorResult) };
	} catch (error) {
		outcome = { error };
	}
	try {
		params.results?.push(...processSettlement ? [processSettlement] : [], ...completedSteps);
		if (processSettlement) {
			await params.progress?.onStepComplete?.({
				...processSettlement,
				index: 0,
				total: 0
			});
			assertCurrent();
		}
	} catch (error) {
		if ("error" in outcome) throw new AggregateError([outcome.error, error], "Doctor settlement recording failed", { cause: error });
		throw error;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.step;
}
/** Keep package staging open until its source owner publishes the validated checkout. */
async function prepareGitPackageExposure(params) {
	const prepared = createDeferredCore();
	const activation = createDeferredCore();
	const cancellation = /* @__PURE__ */ new Error("Source activation cancelled before global exposure");
	const completed = runGlobalPackageUpdateSteps({
		...params,
		beforeActivate: async () => {
			prepared.resolve();
			if (!await activation.promise) throw cancellation;
		}
	});
	const outcome = await Promise.race([prepared.promise.then(() => null), completed]);
	if (outcome) {
		const failure = outcome.failedStep;
		throw new UpdatePreMutationError(outcome.reason ?? (failure ? normalizeFallbackFailureReason(failure.name) : "source-exposure-preparation-failed"), failure?.stderrTail ?? "Global source exposure did not reach the activation gate", {
			failureFacts: failure?.failureFacts,
			stepResult: {
				steps: outcome.steps,
				failedStep: failure ?? void 0
			}
		});
	}
	return {
		activate: () => {
			activation.resolve(true);
			return completed;
		},
		cancel: async () => {
			activation.resolve(false);
			try {
				return await completed;
			} catch (error) {
				if (error !== cancellation) throw error;
				return {
					steps: [],
					recovery: await verifyPackageUpdateRecovery(params.installTarget.packageRoot)
				};
			}
		}
	};
}
/** Retain one staged target while its runtime initializes a fresh profile. */
async function stagePackageInstallUpdate(params) {
	const staged = createDeferredCore();
	const continuation = createDeferredCore();
	let continued = false;
	let deliveredFailure;
	let active;
	const requireActive = () => {
		if (!active) throw new Error("Staged update has not been admitted for activation.");
		return active;
	};
	const retainCandidate = async (root) => {
		staged.resolve(root);
		active = await continuation.promise;
		if (!active) throw new Error("Staged update stopped before package activation.");
	};
	const completed = runPackageInstallUpdate({
		...params,
		get requirePackageReplacement() {
			return !params.pauseBeforeVerification || requireActive().requirePackageReplacement;
		},
		beforeVerifyCandidate: params.pauseBeforeVerification || params.beforeVerifyCandidate ? async (root) => {
			try {
				await params.beforeVerifyCandidate?.(root);
			} catch (error) {
				throw new PackageUpdateActivationError(error);
			}
			if (params.pauseBeforeVerification) await retainCandidate(root);
		} : void 0,
		resolveLifecycleNodeRunner: () => active?.nodeRunner ?? params.resolveLifecycleNodeRunner?.() ?? params.nodeRunner,
		progress: {
			onStepStart: (step) => (active?.progress ?? params.progress)?.onStepStart?.(step),
			onStepComplete: (step) => (active?.progress ?? params.progress)?.onStepComplete?.(step),
			onHeartbeat: () => (active?.progress ?? params.progress)?.onHeartbeat?.()
		},
		validateCandidate: async (root) => {
			if (!params.pauseBeforeVerification) await retainCandidate(root);
			return await requireActive().validateCandidate(root);
		},
		beforeActivate: () => requireActive().beforeActivate(),
		assertCurrent: () => requireActive().assertCurrent?.(),
		reserveInstallSlot: (root) => requireActive().reserveInstallSlot?.(root),
		getActivation: () => requireActive().getActivation?.(),
		onTransaction: (transaction) => requireActive().onTransaction(transaction),
		onConfigSnapshot: (snapshot) => requireActive().onConfigSnapshot?.(snapshot)
	}, () => requireActive());
	const ready = await Promise.race([staged.promise.then((root) => ({ root })), completed.then((result) => ({ result }))]);
	if ("result" in ready) throw new UpdatePreMutationError(ready.result.reason ?? "package-staging-failed", ready.result.failedStep?.stderrTail ?? "Package staging did not produce a target runtime.", {
		failureFacts: ready.result.failedStep?.failureFacts,
		stepResult: ready.result
	});
	return {
		root: ready.root,
		async run(next) {
			if (continued) throw new Error("A staged update can be activated only once.");
			continued = true;
			continuation.resolve(next);
			try {
				return await completed;
			} catch (error) {
				deliveredFailure = { error };
				throw error;
			}
		},
		async close() {
			if (!continued) {
				continued = true;
				continuation.resolve(void 0);
			}
			try {
				await completed;
			} catch (error) {
				if (!deliveredFailure || deliveredFailure.error !== error || hasCommandProcessCleanupError(error)) throw error;
			}
		}
	};
}
async function runPackageInstallUpdate(params, resolveDoctorOptions = () => params) {
	let installTarget = params.installTarget;
	if (!installTarget) {
		const manager = await resolveGlobalManager({
			root: params.root,
			installKind: params.installKind,
			timeoutMs: params.timeoutMs
		});
		installTarget = await resolveGlobalInstallTarget({
			manager,
			runCommand: runCommandWithTimeout,
			timeoutMs: params.timeoutMs,
			pkgRoot: params.root,
			honorPackageRoot: params.honorPackageRoot === true
		});
	}
	const installEnv = params.installEnv ?? await createGlobalInstallEnv(void 0, installTarget);
	const pkgRoot = installTarget.packageRoot;
	const packageName = await readPackageName(pkgRoot || params.root) ?? "openclaw";
	const installSpec = params.installSpec ?? resolveGlobalInstallSpec({
		packageName,
		tag: params.tag,
		env: installEnv
	});
	const before = pkgRoot ? await readPackageUpdateIdentity(pkgRoot) : { version: null };
	const doctorReceipts = [];
	const packageUpdate = await runGlobalPackageUpdateSteps({
		localOverrides: {
			reapply: params.reapplyLocalOverrides === true,
			env: resolveUpdateTargetEnv({
				serviceEnv: params.managedServiceEnv,
				invocationCwd: params.invocationCwd
			})
		},
		validateCandidate: params.validateCandidate,
		beforeVerifyCandidate: params.beforeVerifyCandidate,
		resolveLifecycleNodeRunner: params.resolveLifecycleNodeRunner ?? (() => params.nodeRunner),
		beforeActivate: params.beforeActivate,
		assertCurrent: params.assertCurrent,
		reserveInstallSlot: params.reserveInstallSlot,
		onTransaction: params.onTransaction,
		getActivation: params.getActivation,
		installTarget,
		installSpec,
		installCwd: params.invocationCwd,
		packageName,
		packageRoot: pkgRoot,
		get requirePackageReplacement() {
			return params.requirePackageReplacement === true || params.installKind === "git";
		},
		runCommand: runCommandWithTimeout,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		...installEnv === void 0 ? {} : { env: installEnv },
		runStep: (stepParams) => runUpdateStep({
			...stepParams,
			progress: params.progress
		}),
		postVerifyStep: async (root, results) => {
			try {
				return await runPackageUpdateDoctor({
					...resolveDoctorOptions(),
					root,
					results
				});
			} finally {
				doctorReceipts.push(...results?.filter((result) => result.name === "doctor process settlement" || result.name === "database migration writes") ?? []);
			}
		}
	});
	const afterBuildId = packageUpdate.activePackageRoot ? await readBuiltGatewayBuildId(packageUpdate.activePackageRoot) : null;
	return {
		status: packageUpdate.reason === "already-current" ? "skipped" : packageUpdate.failedStep ? "error" : "ok",
		mode: installTarget.manager,
		root: packageUpdate.activePackageRoot ?? void 0,
		reason: getUpdateDoctorConfigFailureReason(packageUpdate.failedStep?.configWriteRefusal) ?? packageUpdate.reason ?? (packageUpdate.failedStep ? normalizeFallbackFailureReason(packageUpdate.failedStep.name) : void 0),
		before,
		after: {
			version: packageUpdate.afterVersion,
			...afterBuildId ? { buildId: afterBuildId } : {}
		},
		steps: [...packageUpdate.steps, ...doctorReceipts],
		failedStep: packageUpdate.failedStep ?? void 0,
		recovery: packageUpdate.recovery,
		localOverrides: packageUpdate.localOverrides,
		durationMs: Date.now() - params.startedAt
	};
}
//#endregion
export { stagePackageInstallUpdate as i, runPackageInstallUpdate as n, runPackageUpdateDoctor as r, prepareGitPackageExposure as t };
