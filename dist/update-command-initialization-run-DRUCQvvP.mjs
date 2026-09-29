import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { a as resolveUpdateTargetEnv, c as withOwnedManagedUpdateEnv, l as withUpdateInProgressEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { o as canResolveRegistryVersionForPackageTarget } from "./update-runner-command-DJ8Zpaha.mjs";
import { s as withUpdateCommandExecutor } from "./update-command-executor-DDhDn9_F.mjs";
import { f as assertUpdatePackageActivationAdmission, l as withUpdateCommandTerminalResult, s as reportUnreportedUpdateAdmissionOutcome, v as recordUpdateCommandTarget } from "./update-command-terminal-BKnIanMQ.mjs";
import { t as createUpdateProgress } from "./progress-e3kXKPyp.mjs";
import { a as withUpdateInitializationCleanup, n as confirmFreshUpdateDowngrade, r as initializeUpdateStateFromTarget, t as acquireLegacyUpdateInitializationFence } from "./update-command-initialization-DGVE3fkf.mjs";
import { t as prepareUpdateCommandFailureTriage } from "./update-command-triage-Dgp_7SIM.mjs";
import { a as preparePackageUpdateRuntime, n as preflightUpdateCommandSchemas, r as previewUpdateCommand } from "./update-command-schema-BfSsrLEA.mjs";
import { n as resolveUpdateCommandTarget, t as resolveFreshUpdateMetadata } from "./update-command-target-mAAATXD6.mjs";
import { randomUUID } from "node:crypto";
//#region src/cli/update-cli/update-command-initialization-run.ts
async function initializeAndRunUpdate(opts, prepared, recoveryState, invocationCwd, env, runInitialized) {
	const targetEnv = resolveUpdateTargetEnv({
		baseEnv: env,
		nodeRunner: process.execPath
	});
	const runId = env.OPENCLAW_UPDATE_RUN_ID?.trim() || randomUUID();
	let handleFailure;
	try {
		await withUpdateCommandTerminalResult((registerRun) => withUpdateInProgressEnv(invocationCwd, () => withUpdateCommandExecutor(runId, async (executor) => {
			const target = await withOwnedManagedUpdateEnv(targetEnv, () => resolveUpdateCommandTarget(opts, recoveryState, invocationCwd, prepared, executor, prepared.timeoutMs ?? 18e5));
			if (!target) return;
			const packageAdmission = { serviceRoot: target.managedServiceRoot };
			const initialization = {
				env,
				runId,
				executor,
				registerRun: async (run) => {
					registerRun(run);
					if (target.inspectionWarning) recordUpdateCommandTarget(run, { step: {
						step: "warning:installation-inspection",
						status: "completed",
						detail: target.inspectionWarning
					} });
					handleFailure = await prepareUpdateCommandFailureTriage({
						...opts,
						invocationCwd,
						run
					}, recoveryState.triageTarget);
				},
				target,
				databasePath: resolvePathViaExistingAncestorSync(resolveOpenClawStateSqlitePath(env)),
				configPath: resolvePathViaExistingAncestorSync(resolveConfigPath(env))
			};
			if (opts.dryRun) return await previewUpdateCommand({
				target,
				prepared,
				opts,
				runId,
				invocationCwd,
				updateStepTimeoutMs: prepared.timeoutMs ?? 18e5
			});
			const artifact = target.updateInstallKind === "package" && !canResolveRegistryVersionForPackageTarget(target.packageInstallSpec ?? target.tag);
			const stageParams = (progress) => ({
				reapplyLocalOverrides: opts.reapplyLocalOverrides,
				root: target.root,
				installKind: prepared.installKind,
				tag: target.tag,
				installSpec: target.packageInstallSpec ?? void 0,
				timeoutMs: prepared.timeoutMs ?? 18e5,
				startedAt: prepared.startedAt,
				progress,
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
				requirePackageReplacement: target.managedServiceRoot !== void 0
			});
			const runSelectedTarget = async () => {
				assertUpdatePackageActivationAdmission(target.root, packageAdmission);
				if (target.updateInstallKind !== "package") return await runInitialized(initialization);
				const metadata = await resolveFreshUpdateMetadata(target);
				if (!metadata) return;
				const { version: targetVersion, schemaVersions: schemas } = metadata;
				if (schemas.state >= 18 && !artifact) return await runInitialized(initialization);
				const timeoutMs = prepared.timeoutMs ?? 18e5;
				const selectedStoredChannel = target.storedChannel;
				const checkSchemas = async () => {
					const { readUpdateChannelConfig } = await import("./update-command-config-Dj5LpUjV.mjs");
					const config = await withOwnedManagedUpdateEnv(env, () => readUpdateChannelConfig(Boolean(opts.channel)));
					if (!opts.channel && config.storedChannel !== selectedStoredChannel) await target.refuseUpdate("update-channel-changed", "Stored update channel changed after target selection. Rerun the update, or specify --channel explicitly.");
					Object.assign(target, config);
					return await preflightUpdateCommandSchemas({
						...target,
						shouldRestart: prepared.shouldRestart,
						updateStepTimeoutMs: timeoutMs,
						invocationCwd,
						packageTargetVersion: target.targetVersion ?? void 0,
						opts,
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
				const runtime = await preparePackageUpdateRuntime({
					...target,
					managedService: schemaPreflight.service,
					shouldRestart: prepared.shouldRestart,
					opts,
					executor,
					timeoutMs
				});
				if (!runtime.ok) return await target.refuseUpdate("node-runtime-preflight", runtime.error, runtime.failureFacts, runtime.recoverySteps);
				target.packageUpdateNodeRunner = runtime.value.nodeRunner;
				if (schemas.state >= 18) return await runInitialized(initialization);
				const fence = await executor.enter(target.root, {
					preflight: true,
					serviceRoot: target.managedServiceRoot
				});
				const assertCurrent = () => {
					fence.assertCurrent();
					assertUpdatePackageActivationAdmission(target.root, packageAdmission);
				};
				const { stagePackageInstallUpdate } = await import("./update-command-package-DEaY8LfG.mjs");
				assertCurrent();
				const legacyFence = acquireLegacyUpdateInitializationFence({
					env,
					targetVersion,
					targetSchemas: schemas
				});
				await withUpdateInitializationCleanup(async () => {
					await withUpdateInitializationCleanup(async () => {
						const presentation = createUpdateProgress(!opts.json);
						try {
							await checkSchemas();
							assertCurrent();
							if (!target.packageAlreadyCurrent && !initialization.stagedPackage) initialization.stagedPackage = await stagePackageInstallUpdate(stageParams(presentation.progress));
							assertCurrent();
							await initializeUpdateStateFromTarget({
								root: initialization.stagedPackage?.root ?? target.root,
								env,
								timeoutMs,
								nodeRunner: target.packageUpdateNodeRunner,
								invocationCwd,
								progress: presentation.progress,
								assertCurrent,
								checkSchemas: async () => void await checkSchemas()
							});
						} finally {
							presentation.dispose();
						}
					}, () => legacyFence?.release());
					await runInitialized(initialization);
				}, () => artifact ? void 0 : initialization.stagedPackage?.close());
			};
			if (!artifact) return await runSelectedTarget();
			const { runFreshUpdateArtifact } = await import("./update-command-artifact-BIADu7En.mjs");
			return await runFreshUpdateArtifact({
				initialization,
				stageParams,
				json: Boolean(opts.json)
			}, runSelectedTarget);
		})), opts);
	} catch (error) {
		if (!handleFailure) return await reportUnreportedUpdateAdmissionOutcome(error);
		await handleFailure(error);
	}
}
//#endregion
export { initializeAndRunUpdate };
