import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { c as redactSupportString } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { a as resolveDebugProxySettings } from "./env-ZuG6CRvK.mjs";
import { n as readUpdateRunDriver } from "./update-run-driver-CPVdsIOp.mjs";
import { b as UpdatePreMutationError, t as canResolveRegistryVersionForPackageTarget } from "./update-global-BlXQRfes.mjs";
import { o as updateRunStepsFromResultStep } from "./update-run-step-Db60sdKj.mjs";
import { o as captureUpdateCommandExecutorAuthority, t as withUpdateCommandExecutor } from "./update-command-executor-DUq8yLzH.mjs";
import { g as usesCandidateUpdateAdmission } from "./shared-DRiGAorf.mjs";
import { s as readUpdateChannelConfig } from "./update-command-config-CDBhVGHw.mjs";
import { d as withUpdateInProgressEnv, l as withOwnedManagedUpdateEnv, o as resolveUpdateTargetEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { t as createUpdateProgress } from "./progress-rcOXmnPk.mjs";
import { t as UnreportedUpdateAdmissionOutcome } from "./update-command-result-BgqRj9_Z.mjs";
import { b as assertUpdatePackageActivationAdmission, l as withUpdateCommandTerminalResult, s as reportUnreportedUpdateAdmissionOutcome, v as recordUpdateCommandTarget } from "./update-command-terminal-CPGdOHR-.mjs";
import { a as withUpdateInitializationCleanup, n as confirmFreshUpdateDowngrade, r as initializeUpdateStateFromTarget, t as acquireLegacyUpdateInitializationFence } from "./update-command-initialization-D-4aI5MI.mjs";
import { n as withPrivateStagedPackageInstall } from "./update-command-artifact-CVKkHa6F.mjs";
import { t as prepareUpdateCommandFailureTriage } from "./update-command-triage-BoqzxDpM.mjs";
import { a as inspectStagedUpdateCandidateAdmission, i as createUpdateCandidateAdmissionReport, n as resolveUpdateCommandTarget, r as applyUpdateCandidateAdmission, t as resolveFreshUpdateMetadata } from "./update-command-target-BnTQqG6I.mjs";
import { a as preparePackageUpdateRuntime, n as preflightUpdateCommandSchemas, r as previewUpdateCommand } from "./update-command-schema-DFPuQCTq.mjs";
import { randomUUID } from "node:crypto";
//#region src/cli/update-cli/update-command-initialization-run.ts
async function initializeAndRunUpdate(opts, prepared, recoveryState, invocationCwd, env, runInitialized, policy, executorOptions) {
	const targetEnv = resolveUpdateTargetEnv({
		baseEnv: env,
		nodeRunner: process.execPath
	});
	const runId = env.OPENCLAW_UPDATE_RUN_ID?.trim() || randomUUID();
	let handleFailure;
	let disposePresentation;
	try {
		await withUpdateCommandTerminalResult((registerRun) => withUpdateInProgressEnv(invocationCwd, () => withUpdateCommandExecutor(runId, async (executor) => {
			const selection = await withOwnedManagedUpdateEnv(targetEnv, () => resolveUpdateCommandTarget(opts, recoveryState, invocationCwd, prepared, executor, prepared.timeoutMs ?? 18e5)).then((target) => target ? { target } : void 0, (error) => {
				if (policy.needsInitialization || hasCommandProcessCleanupError(error) || !(error instanceof UnreportedUpdateAdmissionOutcome)) throw error;
				return { refusal: error };
			});
			if (!selection) return;
			const selectedTarget = selection.target;
			const assertSelectedRuntimeCurrent = async () => {
				if (!selectedTarget) return;
				try {
					await selectedTarget.assertPackageRuntimeCurrent?.();
				} catch (error) {
					if (hasCommandProcessCleanupError(error) || !(error instanceof UpdatePreMutationError)) throw error;
					await selectedTarget.refuseUpdate(error.reason, error.message, error.failureFacts, error.recoverySteps);
				}
			};
			const candidateAdmissionEnabled = selectedTarget?.updateInstallKind === "package" && usesCandidateUpdateAdmission(opts, prepared.installKind);
			const callerLegacyConfigPlan = selectedTarget && !selectedTarget.managedServiceRootRedirect && !candidateAdmissionEnabled && opts.channel && resolveConfigPath(env) !== resolveConfigPath() ? (await readUpdateChannelConfig(true)).legacyConfigPlan : void 0;
			const { root, serviceRoot } = selection.refusal ? selection.refusal.report : {
				root: selection.target.root,
				serviceRoot: selection.target.managedServiceRoot
			};
			const packageAdmission = {
				serviceRoot,
				dryRun: opts.dryRun
			};
			const originalCaptureWarnings = [];
			const initialization = {
				...selection,
				env,
				runId,
				executor,
				callerLegacyConfigPlan,
				registerRun: async (run, dispose) => {
					registerRun(run);
					disposePresentation = dispose;
					const recordCompletedStep = (step, detail) => recordUpdateCommandTarget(run, { step: {
						step,
						status: "completed",
						detail
					} });
					for (const result of selectedTarget?.preflightSteps ?? []) for (const step of updateRunStepsFromResultStep(result)) recordUpdateCommandTarget(run, { step });
					if (selectedTarget?.inspectionWarning) recordCompletedStep("warning:installation-inspection", selectedTarget.inspectionWarning);
					if (initialization.originalRecoveryCapture) recordCompletedStep("original-state-capture", `Original state retained for manual recovery at ${initialization.originalRecoveryCapture.directory}.`);
					for (const [index, detail] of originalCaptureWarnings.entries()) recordCompletedStep(`warning:original-state-capture:${index + 1}`, detail);
					handleFailure = await prepareUpdateCommandFailureTriage({
						...opts,
						invocationCwd,
						run
					}, recoveryState.triageTarget);
				},
				databasePath: resolvePathViaExistingAncestorSync(resolveOpenClawStateSqlitePath(env)),
				configPath: resolvePathViaExistingAncestorSync(resolveConfigPath(env))
			};
			let originalCaptureAttempted = false;
			const captureOriginal = async () => {
				if (!policy.captureOriginal || originalCaptureAttempted) return;
				if (selectedTarget?.downgradeRisk && !initialization.downgradeConfirmed) {
					await confirmFreshUpdateDowngrade({
						target: selectedTarget,
						opts,
						controlPlaneUpdateSentinelMeta: prepared.controlPlaneUpdateSentinelMeta
					});
					initialization.downgradeConfirmed = true;
				}
				const fence = await executor.enter(root, {
					preflight: true,
					...packageAdmission
				});
				const authority = captureUpdateCommandExecutorAuthority(fence, runId);
				const assertCurrent = () => {
					fence.assertCurrent();
					assertUpdatePackageActivationAdmission(root, packageAdmission);
				};
				const warn = (message) => {
					const detail = redactSupportString(message, {
						env,
						stateDir: resolveStateDir(env)
					}, { maxLength: 1e3 });
					originalCaptureWarnings.push(detail);
					defaultRuntime.error(`Warning: ${detail}`);
				};
				originalCaptureAttempted = true;
				try {
					const { captureUpdateRecoveryBaseline } = await import("./update-recovery-baseline-capture-CQviHFig.mjs");
					assertCurrent();
					const driver = readUpdateRunDriver();
					if (!driver) throw new Error("The original update process identity is unavailable.");
					const captured = await captureUpdateRecoveryBaseline({
						runId,
						installRoot: authority.installKey,
						env,
						drivers: [driver],
						assertCurrent,
						nodeRunner: selectedTarget?.packageUpdateNodeRunner,
						timeoutMs: prepared.timeoutMs ?? 18e5
					});
					assertCurrent();
					initialization.originalRecoveryCapture = captured.ref;
					for (const message of [...captured.warnings.map((warning) => warning.message), ...captured.diagnostics.databaseWarnings].slice(0, 32)) warn(message);
				} catch (error) {
					assertCurrent();
					if (hasCommandProcessCleanupError(error)) throw error;
					warn(`Original state capture is unavailable; the update continues without it. A running Gateway or another active writer changing state during capture is expected to cause this. Database rollback uses the pre-migration snapshots taken after the Gateway stops. A completed update does not need to be restarted because of this warning. Cause: ${formatErrorMessage(error)}`);
				}
				assertCurrent();
				if (resolveDebugProxySettings(env).enabled) warn("Debug HTTP capture is disabled in this updater process. Doctor may enable capture in its own process after schema readiness is confirmed.");
			};
			const runCapturedInitialization = async () => {
				await assertSelectedRuntimeCurrent();
				await captureOriginal();
				await runInitialized(initialization);
			};
			if (initialization.refusal) return await runCapturedInitialization();
			const target = initialization.target;
			if (opts.dryRun) return await previewUpdateCommand({
				target,
				prepared,
				opts,
				runId,
				invocationCwd,
				updateStepTimeoutMs: prepared.timeoutMs ?? 18e5
			});
			const artifact = target.updateInstallKind === "package" && !canResolveRegistryVersionForPackageTarget(target.packageInstallSpec ?? target.tag);
			const stageParams = (presentation) => ({
				reapplyLocalOverrides: opts.reapplyLocalOverrides,
				root: target.root,
				installKind: prepared.installKind,
				tag: target.tag,
				installSpec: target.packageInstallSpec ?? void 0,
				timeoutMs: prepared.timeoutMs ?? 18e5,
				workTimeoutMs: prepared.timeoutMs ?? null,
				startedAt: prepared.startedAt,
				progress: presentation.progress,
				managedServiceEnv: env,
				invocationCwd,
				honorPackageRoot: target.managedServiceRootRedirect !== null || target.managedServiceNodeRunner !== void 0,
				nodeRunner: target.packageUpdateNodeRunner,
				installEnv: resolveUpdateTargetEnv({
					baseEnv: target.packageInstallEnv,
					serviceEnv: env,
					invocationCwd
				}),
				installTarget: target.packageInstallTarget,
				requirePackageReplacement: target.managedServiceRoot !== void 0,
				...candidateAdmissionEnabled ? {
					resolveLifecycleNodeRunner: () => target.packageUpdateNodeRunner,
					beforeVerifyCandidate: async (candidateRoot) => {
						const fence = await executor.enter(target.root, {
							preflight: true,
							serviceRoot: target.managedServiceRoot
						});
						const assertCurrent = () => {
							fence.assertCurrent();
							assertUpdatePackageActivationAdmission(target.root, packageAdmission);
						};
						try {
							initialization.candidateAdmission = await inspectStagedUpdateCandidateAdmission({
								target,
								prepared,
								opts,
								timeoutMs: prepared.timeoutMs ?? 18e5,
								invocationCwd,
								presentation,
								candidateRoot,
								runId,
								env,
								assertCurrent
							});
							applyUpdateCandidateAdmission({
								target,
								opts,
								result: initialization.candidateAdmission
							});
						} catch (error) {
							if (!(error instanceof UpdatePreMutationError)) throw error;
							throw new UnreportedUpdateAdmissionOutcome(createUpdateCandidateAdmissionReport({
								target,
								opts,
								prepared
							}, error));
						}
					}
				} : {}
			});
			const runSelectedTarget = async () => {
				assertUpdatePackageActivationAdmission(target.root, packageAdmission);
				if (target.updateInstallKind !== "package") return await runCapturedInitialization();
				const metadata = await resolveFreshUpdateMetadata(target);
				if (!metadata) return;
				const { version: targetVersion, schemaVersions: schemas } = metadata;
				if (schemas.state >= 22 && !artifact) return await runCapturedInitialization();
				const timeoutMs = prepared.timeoutMs ?? 18e5;
				const candidateAdmissionChecks = initialization.candidateAdmission?.verdict?.verdict === "admit" ? initialization.candidateAdmission.verdict.facts.checks.map((check) => check.name) : void 0;
				const checkSchemas = async () => {
					const config = await withOwnedManagedUpdateEnv(env, () => readUpdateChannelConfig(Boolean(opts.channel), { tolerateReadFailure: candidateAdmissionChecks?.includes("config") }));
					Object.assign(target, config);
					return await preflightUpdateCommandSchemas({
						...target,
						callerLegacyConfigPlan,
						shouldRestart: prepared.shouldRestart,
						updateStepTimeoutMs: timeoutMs,
						invocationCwd,
						packageTargetVersion: target.targetVersion ?? void 0,
						opts,
						candidateAdmissionChecks,
						expectedForeground: prepared.controlPlaneUpdateSentinelMeta?.completionOwner === "gateway-restart" || void 0
					});
				};
				const schemaPreflight = await checkSchemas();
				if (!schemaPreflight) return;
				await confirmFreshUpdateDowngrade({
					target,
					opts,
					controlPlaneUpdateSentinelMeta: prepared.controlPlaneUpdateSentinelMeta
				});
				initialization.downgradeConfirmed = true;
				await captureOriginal();
				const runtime = await preparePackageUpdateRuntime({
					...target,
					assertPackageRuntimeCurrent: assertSelectedRuntimeCurrent,
					managedService: schemaPreflight.service,
					shouldRestart: prepared.shouldRestart,
					opts,
					executor,
					timeoutMs
				});
				if (!runtime.ok) return await target.refuseUpdate("node-runtime-preflight", runtime.error, runtime.failureFacts, runtime.recoverySteps);
				target.packageUpdateNodeRunner = runtime.value.nodeRunner;
				if (schemas.state >= 22) return await runCapturedInitialization();
				const fence = await executor.enter(target.root, {
					preflight: true,
					serviceRoot: target.managedServiceRoot
				});
				const { stagePackageInstallUpdate } = await import("./update-command-package-CdsQrSs6.mjs");
				fence.assertCurrent();
				assertUpdatePackageActivationAdmission(target.root, packageAdmission);
				const legacyFence = acquireLegacyUpdateInitializationFence({
					env,
					targetVersion,
					targetSchemas: schemas
				});
				let initializationStage;
				const assertCurrent = () => {
					fence.assertCurrent();
					assertUpdatePackageActivationAdmission(target.root, packageAdmission);
					legacyFence?.assertCurrent();
				};
				await withUpdateInitializationCleanup(async () => {
					const initialize = async () => {
						const presentation = createUpdateProgress(!opts.json);
						try {
							await checkSchemas();
							assertCurrent();
							if (!target.packageAlreadyCurrent && !initialization.stagedPackage) {
								await assertSelectedRuntimeCurrent();
								initializationStage = await stagePackageInstallUpdate(stageParams(presentation));
								initialization.stagedPackage = initializationStage;
							}
							assertCurrent();
							await initializeUpdateStateFromTarget({
								root: initialization.stagedPackage?.root ?? target.root,
								env,
								timeoutMs,
								workTimeoutMs: prepared.timeoutMs ?? null,
								nodeRunner: target.packageUpdateNodeRunner,
								invocationCwd,
								progress: presentation.progress,
								assertCurrent,
								checkSchemas: async () => void await checkSchemas()
							});
						} finally {
							presentation.dispose();
						}
					};
					await withUpdateInitializationCleanup(() => legacyFence ? legacyFence.run(initialize) : initialize(), () => legacyFence?.release());
					await runCapturedInitialization();
				}, () => initializationStage?.close());
			};
			const runWithSelectedProfile = async () => {
				if (!policy.needsInitialization) return await runCapturedInitialization();
				if (artifact) {
					const { runFreshUpdateArtifact } = await import("./update-command-artifact-sa4ITgHj.mjs");
					return await runFreshUpdateArtifact({
						initialization,
						stageParams,
						json: Boolean(opts.json)
					}, runSelectedTarget);
				}
				if (candidateAdmissionEnabled && target.packageTargetSchemaVersions && target.packageTargetSchemaVersions.state < 22) {
					const presentation = createUpdateProgress(!opts.json);
					try {
						await assertSelectedRuntimeCurrent();
						return await withPrivateStagedPackageInstall(stageParams(presentation), async ({ stage }) => {
							initialization.stagedPackage = stage;
							return await runSelectedTarget();
						});
					} finally {
						presentation.dispose();
					}
				}
				return await runSelectedTarget();
			};
			return candidateAdmissionEnabled ? await withOwnedManagedUpdateEnv(env, () => withUpdateInProgressEnv(invocationCwd, runWithSelectedProfile)) : await runWithSelectedProfile();
		}, executorOptions)), opts);
	} catch (error) {
		if (!handleFailure) return await reportUnreportedUpdateAdmissionOutcome(error);
		await handleFailure(error);
	} finally {
		disposePresentation?.();
	}
}
//#endregion
export { initializeAndRunUpdate };
