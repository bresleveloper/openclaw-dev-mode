import { r as resolveOpenClawPackageRootSync } from "../openclaw-root-CBoxhfke.mjs";
import { r as defaultRuntime } from "../runtime-DlO3PTAd.mjs";
import { r as resolveEnvironmentValue } from "../process-env-DlZFJzq6.mjs";
import { t as finalizeActiveDebugProxyCaptures } from "../runtime-cleanup-CDxMLsqE.mjs";
import { i as routeLogsToStderr } from "../console-BnFs8ZzT.mjs";
import { s as throwSqliteLifecycleErrors } from "../sqlite-lifecycle-errors-DuOygjcn.mjs";
import "../openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as POST_CORE_UPDATE_RESULT_PATH_ENV } from "../update-post-core-context-B2x24New.mjs";
import { r as hasCommandProcessCleanupError } from "../exec-result-s7WOth0N.mjs";
import { t as resolveUpdateInstallRoot } from "../update-install-root-DH-onosx.mjs";
import { a as closeOpenClawStateDatabaseAsync } from "../openclaw-state-db-cache-BKCnj4of.mjs";
import "../openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { r as cloneEnvWithPlatformSemantics } from "../config-env-vars-DjPHKieF.mjs";
import { r as captureOpenClawStateWorkerContext } from "../openclaw-state-worker-context-DRG_I6tz.mjs";
import "../openclaw-state-db-D1jWDzK3.mjs";
import { b as writeUpdatePostInstallDoctorResult, i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, v as recordUpdateDoctorConfigWriteRefusal } from "../update-doctor-result-yVslo54h.mjs";
import { n as adoptUpdateRun } from "../update-run-ledger-jBhhLo0P.mjs";
import { i as getUpdateRun } from "../update-run-reader-B7x8dkVs.mjs";
import { n as createManagedUpdateRequesterAuthority, r as createManagedUpdateRequesterContinuationAuthority, t as UpdateRequesterRevokedError } from "../update-requester-authority-sTeqCewg.mjs";
import { o as withCliProcessScope, r as retainCliProcessJobUntilExit } from "../runtime-cleanup-scope-Dno3Ssrr.mjs";
import { n as withDelegatedUpdateCommandExecutor, o as captureUpdateCommandExecutorAuthority, t as withUpdateCommandExecutor } from "../update-command-executor-C94Zye_E.mjs";
import "../update-control-plane-sentinel-Du9790-7.mjs";
import { b as POST_CORE_MUTATION_PROTOCOL, y as POST_CORE_EXECUTOR_CAPABILITY } from "../package-update-activation-B8eAkK7X.mjs";
import { c as stopSupervisedPredecessorGateway, d as writePostCoreUpdateFailureFile, l as recordUpdateRunStepAsync, p as isOmittedUpdateTimeout, t as finishUpdate } from "../update-command-post-update-DopYo-d_.mjs";
import { a as createWindowsTaskAutoStartRecovery, t as createWindowsTaskAutoStartGuard } from "../update-command-service-maintenance-ClkdH7ec.mjs";
import { c as formatUpdateFinalizationError, n as UpdateCommandFailure } from "../update-command-result-hCfuj3eW.mjs";
import { l as withUpdateCommandTerminalResult } from "../update-command-terminal-CpPTmwiB.mjs";
import { t as resolveUpdateFinalizationTimeoutMs } from "../update-finalization-budget-BqCBETpF.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/update-migrated-finalize.worker.ts
async function finalizeMigratedUpdate() {
	if (process.argv[2] === "--check") {
		const { finishUpdateRun } = await import("../cli/daemon-cli.js");
		routeLogsToStderr();
		if (typeof finishUpdateRun !== "function") throw new Error("Update recovery writer is unavailable.");
		process.stdout.write(JSON.stringify({
			executorDelegation: "pid-start-v1",
			postCoreExecutor: POST_CORE_EXECUTOR_CAPABILITY,
			mutationProtocol: POST_CORE_MUTATION_PROTOCOL,
			retainedOwnerBinding: true,
			doctorConfigWrites: "pid-start-v1",
			gatewayRestartCompletion: true,
			state: 20,
			agent: 24
		}));
		return;
	}
	await withCliProcessScope(retainCliProcessJobUntilExit);
	const chunks = [];
	for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	const text = Buffer.concat(chunks).toString("utf8");
	if (process.argv[2] === "--post-core") return await runDelegatedPostCore(JSON.parse(text));
	if (process.argv[2] === "--doctor") return await runDelegatedDoctor(JSON.parse(text));
	const input = JSON.parse(text);
	if (input.params.opts.json) routeLogsToStderr();
	if (input.recoveryHandoff) throw new Error("Full-state checkpoint recovery is deferred; retained state was left unchanged.");
	const omittedOperatorTimeout = isOmittedUpdateTimeout(input.params.opts.timeout, input);
	if (omittedOperatorTimeout) input.params.opts.timeout = void 0;
	const activationTimeoutMs = input.params.opts.run?.activationTimeoutMs ?? (omittedOperatorTimeout ? void 0 : await resolveUpdateFinalizationTimeoutMs(input.params.updateStepTimeoutMs, {
		env: input.params.ownedManagedUpdateEnv ?? input.params.opts.run?.env,
		databases: input.params.schemaVersions,
		pluginCount: Object.keys(input.params.preUpdatePluginInstallRecords).length
	}));
	let publishedRecord;
	const finalized = await withUpdateCommandTerminalResult(async (registerRun) => {
		if (input.executor) return await withDelegatedUpdateCommandExecutor(input.executor, input.params.opts.run?.runId ?? "", input.params.result.root ?? input.params.root, async (fence) => finalizeInput(input, fence, registerRun), activationTimeoutMs === void 0 ? void 0 : { activationTimeoutMs });
		const admissionEnv = input.params.ownedManagedUpdateEnv ?? input.params.opts.run?.env;
		if (!admissionEnv) throw new Error("Grantless finalization requires its captured update environment.");
		const meta = input.params.controlPlaneUpdateSentinelMeta;
		const runId = input.params.opts.run?.runId ?? "";
		const scratch = path.dirname(input.resultPath);
		const legacyManagedParent = input.params.result.before?.version === "2026.9.3" && admissionEnv.OPENCLAW_UPDATE_RUN_HANDOFF === "1" && admissionEnv.OPENCLAW_UPDATE_RUN_ID === runId && meta?.runId === runId && meta.handoffId && meta.root && meta.root === resolveUpdateInstallRoot(input.params.result.root ?? input.params.root) && path.basename(scratch).startsWith("openclaw-update-migrated-") && path.basename(input.resultPath) === "result.json" && [
			"TMPDIR",
			"TMP",
			"TEMP"
		].every((name) => resolveEnvironmentValue(process.env, name) === scratch) ? {
			runId,
			handoffId: meta.handoffId,
			root: meta.root
		} : void 0;
		for (const name of [
			"TMPDIR",
			"TMP",
			"TEMP"
		]) {
			const value = resolveEnvironmentValue(admissionEnv, name);
			if (value === void 0) delete process.env[name];
			else process.env[name] = value;
		}
		return await withUpdateCommandExecutor(runId, async (executor) => {
			const fence = await executor.enter(input.params.result.root ?? input.params.root, { activationTimeoutMs });
			return await finalizeInput(input, fence, registerRun);
		}, legacyManagedParent ? { legacyManagedParent } : void 0);
	}, {
		...input.params.opts,
		onTerminalRecord: (record) => {
			publishedRecord = record;
		}
	});
	const terminal = publishedRecord ?? getUpdateRun(finalized.run.runId, { env: finalized.run.env });
	const gatewayRestartPending = finalized.run.completionOwner === "gateway-restart" && finalized.run.gatewayRestartRequired === true && finalized.result.status === "ok" && terminal?.status === "running" && terminal.phase === "restarting";
	if (!terminal || terminal.runId !== finalized.run.runId || terminal.status === "running" && !gatewayRestartPending) throw new Error("Update finalization left the update run nonterminal.");
	const response = {
		result: finalized.result,
		exitCode: finalized.exitCode,
		candidateStartAttempted: finalized.candidateStartAttempted || gatewayRestartPending,
		...gatewayRestartPending ? { restartRunId: terminal.runId } : { terminalRunId: terminal.runId },
		executorDelegation: "pid-start-v1",
		automaticTriage: finalized.automaticTriage
	};
	await fs.writeFile(input.resultPath, JSON.stringify(response), { mode: 384 });
}
async function runDelegatedPostCore(input) {
	const resultPath = process.env[POST_CORE_UPDATE_RESULT_PATH_ENV]?.trim();
	const executingRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	if (!resultPath || !input.executor || process.env["OPENCLAW_UPDATE_POST_CORE"] !== "1" || process.env["OPENCLAW_UPDATE_RUN_ID"] !== input.runId || !executingRoot || resolveUpdateInstallRoot(executingRoot) !== resolveUpdateInstallRoot(input.root)) throw new Error("Post-core update does not match its delegated run and installed runtime.");
	if (input.opts.json) routeLogsToStderr();
	process.env[POST_CORE_UPDATE_RESULT_PATH_ENV] = `${resultPath}.pending`;
	try {
		await withDelegatedUpdateCommandExecutor(input.executor, input.runId, input.root, async (fence) => {
			const requesterAuthority = input.requester?.authorizationSource?.startsWith("profile:") ? await createManagedUpdateRequesterContinuationAuthority(input.requester, {
				runId: input.runId,
				executor: fence
			}) : input.requester ? await createManagedUpdateRequesterAuthority(input.requester) : void 0;
			const { updateCommand } = await import("../update-command-DTI3wKPM.mjs");
			fence.assertCurrent();
			if (requesterAuthority?.isCurrent() === false) throw new UpdateRequesterRevokedError();
			await updateCommand({
				...input.opts,
				run: {
					runId: input.runId,
					originalRecoveryCapture: input.originalRecoveryCapture,
					env: { ...process.env },
					executorFence: fence,
					...requesterAuthority ? { requesterAuthority } : {}
				}
			});
		});
		await fs.rename(`${resultPath}.pending`, resultPath);
	} catch (error) {
		if (!hasCommandProcessCleanupError(error)) await writePostCoreUpdateFailureFile(resultPath, error);
		throw error;
	}
}
async function runDelegatedDoctor(input) {
	const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]?.trim();
	if (!resultPath || !input.executor) throw new Error("Update Doctor requires its delegated executor and result path.");
	await withDelegatedUpdateCommandExecutor(input.executor, input.runId, input.root, async (fence, commandAuthority) => {
		const requester = input.requester?.authorizationSource?.startsWith("profile:") ? await createManagedUpdateRequesterContinuationAuthority(input.requester, {
			runId: input.runId,
			executor: fence
		}) : input.requester ? await createManagedUpdateRequesterAuthority(input.requester) : void 0;
		const assertCurrent = () => {
			try {
				fence.assertCurrent();
				if (requester?.isCurrent() === false) throw new UpdateRequesterRevokedError();
			} catch (error) {
				recordUpdateDoctorConfigWriteRefusal({
					reason: error instanceof UpdateRequesterRevokedError ? error.code : "authority-check-failed",
					message: formatUpdateFinalizationError(error),
					keys: []
				});
				throw error;
			}
		};
		try {
			assertCurrent();
		} catch (error) {
			if (!(error instanceof UpdateRequesterRevokedError)) throw error;
			fence.assertCurrent();
			await writeUpdatePostInstallDoctorResult({
				resultPath,
				result: {
					status: "error",
					configWriteRefusal: {
						reason: error.code,
						message: error.message,
						keys: []
					}
				}
			});
			process.exitCode = 1;
			return;
		}
		const { runDoctorHealthFlow } = await import("../doctor-health-DYToTFSy.mjs");
		assertCurrent();
		await stopSupervisedPredecessorGateway(input, {
			root: input.root,
			assertCurrent,
			warn: (message) => process.stderr.write(`${message}\n`)
		});
		assertCurrent();
		await runDoctorHealthFlow({
			...defaultRuntime,
			exit: (code) => {
				process.exitCode = code;
			}
		}, {
			repair: input.repair,
			nonInteractive: true,
			...input.yes !== void 0 ? { yes: input.yes } : {},
			...input.workspaceSuggestions !== void 0 ? { workspaceSuggestions: input.workspaceSuggestions } : {}
		}, {
			inputHash: input.configInputHash,
			assertCurrent,
			commandAuthority,
			originalRecoveryCapture: {
				runId: input.runId,
				installRoot: captureUpdateCommandExecutorAuthority(fence, input.runId).installKey,
				ref: input.originalRecoveryCapture
			},
			...input.databaseGenerations ? { databaseGenerations: input.databaseGenerations } : {},
			...input.postCoreSchemaRepair === true ? { postCoreSchemaRepair: {
				runId: input.runId,
				assertCurrent
			} } : {}
		});
	});
}
async function finalizeInput(input, executorFence, registerRun) {
	const transferredRun = input.params.opts.run;
	if (!transferredRun || "executorFence" in transferredRun || !input.recoveryHandoff && input.params.rollbackBlockedReason !== "state-migrated-no-rollback" && input.params.rollbackBlockedReason !== "rollback-state-unverified") throw new Error("Update finalization requires its migrated update run.");
	const { requesterAuthority: descriptor, ...runIdentity } = transferredRun;
	executorFence.assertCurrent();
	adoptUpdateRun(runIdentity.runId, { env: runIdentity.env });
	const run = {
		...runIdentity,
		executorFence,
		...descriptor ? { requesterAuthority: descriptor.requester.authorizationSource?.startsWith("profile:") ? await createManagedUpdateRequesterContinuationAuthority(descriptor.requester, {
			runId: runIdentity.runId,
			executor: executorFence
		}, runIdentity.env) : await createManagedUpdateRequesterAuthority(descriptor.requester, runIdentity.env) } : {}
	};
	executorFence.assertCurrent();
	registerRun(run);
	if (input.bufferedSteps.length > 0) {
		const env = cloneEnvWithPlatformSemantics(run.env ?? process.env);
		const context = captureOpenClawStateWorkerContext({ env });
		const requester = run.requesterAuthority;
		const assertCurrent = () => {
			executorFence.assertCurrent();
			if (requester?.isCurrent() === false) throw new UpdateRequesterRevokedError();
		};
		for (const step of input.bufferedSteps) await recordUpdateRunStepAsync(run.runId, step, {
			env,
			context,
			assertCurrent
		});
	}
	const stopped = input.params.preManagedServiceStop;
	if (input.windowsTaskAutoStartSuspended && !stopped?.serviceEnv) throw new Error("Transferred Windows task suspension is missing its stopped service owner.");
	const windowsRecovery = input.windowsTaskAutoStartSuspended && stopped?.serviceEnv ? createWindowsTaskAutoStartRecovery({
		serviceEnv: stopped.serviceEnv,
		updateRun: run,
		alreadySuspended: true,
		assertCurrentService: createWindowsTaskAutoStartGuard({
			root: input.params.result.root ?? input.params.root,
			before: stopped,
			timeoutMs: input.params.updateStepTimeoutMs
		}),
		assertCurrent: () => {
			run.executorFence?.assertCurrent();
			if (getUpdateRun(run.runId, { env: run.env })?.status !== "running") throw new Error("Update run no longer owns Windows task activation.");
		}
	}) : void 0;
	let result;
	let exitCode = 0;
	let candidateStartAttempted = false;
	let automaticTriage;
	try {
		result = await finishUpdate({
			...input.params,
			result: {
				...input.params.result,
				runId: run.runId
			},
			opts: {
				...input.params.opts,
				run
			},
			...stopped ? { preManagedServiceStop: {
				...stopped,
				windowsTaskAutoStartRecovery: windowsRecovery
			} } : {}
		}, {
			candidateRuntime: true,
			onGatewayStartAttempted: () => {
				candidateStartAttempted = true;
			}
		});
	} catch (error) {
		if (!(error instanceof UpdateCommandFailure)) throw error;
		result = error.result;
		exitCode = error.exitCode;
		automaticTriage = error.automaticTriage;
	} finally {
		await windowsRecovery?.complete(result?.status === "ok" || result?.recovery?.serviceRestartSafe === true && result.recovery.service === "healthy");
	}
	executorFence.assertCurrent();
	return {
		run,
		result,
		exitCode,
		automaticTriage,
		candidateStartAttempted
	};
}
(async () => {
	const errors = [];
	for (const finalize of [
		finalizeMigratedUpdate,
		finalizeActiveDebugProxyCaptures,
		closeOpenClawStateDatabaseAsync
	]) try {
		await finalize();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Update finalization and resource cleanup failed.");
})().catch((error) => {
	process.stderr.write(`${formatUpdateFinalizationError(error)}\n`);
	process.exitCode = 1;
});
//#endregion
export {};
