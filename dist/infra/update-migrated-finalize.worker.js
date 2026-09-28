import { r as defaultRuntime } from "../runtime-BC29JSZp.mjs";
import { o as withCliProcessScope, r as retainCliProcessJobUntilExit } from "../runtime-cleanup-scope-C0g6_AIJ.mjs";
import { r as resolveEnvironmentValue } from "../process-env-DlZFJzq6.mjs";
import { a as routeLogsToStderr } from "../console-DwqfhE-H.mjs";
import "../openclaw-state-db-contract-dESpOAuZ.mjs";
import { o as closeOpenClawStateDatabaseAsync } from "../openclaw-state-db-cache-Ci98mtX8.mjs";
import { n as openDoctorStateSchemaReadAdmission } from "../openclaw-state-db-doctor-schema-Cy4xw-oI.mjs";
import "../openclaw-state-db-BFK9cMiV.mjs";
import { g as writeUpdatePostInstallDoctorResult, m as recordUpdateDoctorConfigWriteRefusal, n as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV } from "../update-doctor-result-CoUVRLb-.mjs";
import { o as readGatewayOwnerLease } from "../windows-port-pids-Bid_Huck.mjs";
import "../gateway-shutdown-budget-E5oPIr_h.mjs";
import { D as resolveUpdateInstallRoot } from "../restart-sentinel-KM6PPxhT.mjs";
import { h as recordUpdateRunStep, n as adoptUpdateRun } from "../update-run-ledger-DE3m4CLB.mjs";
import { r as getUpdateRun } from "../update-run-reader-B17V1KuC.mjs";
import { n as createManagedUpdateRequesterAuthority, r as createManagedUpdateRequesterContinuationAuthority, t as UpdateRequesterRevokedError } from "../update-requester-authority-DM9cJimf.mjs";
import "../openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { o as withDelegatedUpdateCommandExecutor, s as withUpdateCommandExecutor } from "../update-command-executor-BQrAUjan.mjs";
import { l as withUpdateCommandTerminalResult } from "../update-command-terminal-3Hu1mJ4t.mjs";
import { s as isOmittedUpdateTimeout, t as finishUpdate } from "../update-command-post-update-BXUIMDzA.mjs";
import { o as createWindowsTaskAutoStartRecovery, r as maybeStopManagedServiceBeforeMutableUpdate, t as createWindowsTaskAutoStartGuard } from "../update-command-service-maintenance-DEAFUd_Y.mjs";
import { c as formatUpdateFinalizationError, n as UpdateCommandFailure } from "../update-command-result-ZgmOI6c9.mjs";
import { t as resolveUpdateFinalizationTimeoutMs } from "../update-finalization-budget-DpdskF7X.mjs";
import path from "node:path";
import fs from "node:fs/promises";
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
/** Ledger step the delegated Doctor records at the native stop boundary. */
const CANDIDATE_PREDECESSOR_STOP_STEP = "managed-service:candidate-stop";
function serviceIdentity(state, stoppedAtMs) {
	const verdict = state.serviceUpdateVerdict;
	return {
		...state.servicePid !== void 0 ? { pid: state.servicePid } : {},
		...verdict && "fingerprint" in verdict ? { fingerprint: verdict.fingerprint } : {},
		...state.serviceManagerUid !== void 0 ? { managerUid: state.serviceManagerUid } : {},
		stoppedAtMs
	};
}
function readDoctorStop(runId, ledger) {
	const step = getUpdateRun(runId, ledger)?.steps?.find((entry) => entry.step === CANDIDATE_PREDECESSOR_STOP_STEP && entry.status === "completed");
	if (!step?.detail) return;
	let parsed;
	try {
		parsed = JSON.parse(step.detail);
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object") return;
	const record = parsed;
	const optionalNumber = (value) => typeof value === "number" ? value : void 0;
	const stoppedAtMs = optionalNumber(record.stoppedAtMs);
	if (stoppedAtMs === void 0) return;
	const identity = { stoppedAtMs };
	const pid = optionalNumber(record.pid);
	const managerUid = optionalNumber(record.managerUid);
	if (pid !== void 0) identity.pid = pid;
	if (managerUid !== void 0) identity.managerUid = managerUid;
	if (typeof record.fingerprint === "string") identity.fingerprint = record.fingerprint;
	return identity;
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
	let owner;
	try {
		owner = readGatewayOwnerLease({
			env: process.env,
			current: true,
			openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission
		});
	} catch {
		return false;
	}
	if (owner?.state !== "live" || owner.mode !== "supervised") return false;
	params.assertCurrent();
	let recorded = false;
	const record = (state) => {
		if (recorded) return;
		recorded = true;
		const stoppedAtMs = state.stoppedAtMs ?? Date.now();
		recordUpdateRunStep(input.runId, {
			step: CANDIDATE_PREDECESSOR_STOP_STEP,
			status: "completed",
			endedAtMs: stoppedAtMs,
			detail: JSON.stringify(serviceIdentity(state, stoppedAtMs))
		});
	};
	try {
		const state = await maybeStopManagedServiceBeforeMutableUpdate({
			updateInstallKind: "package",
			root: params.root,
			shouldRestart: true,
			jsonMode: true,
			phase: "prepare",
			timeoutMs: params.timeoutMs ?? 33e4,
			onStopped: record,
			assertCurrent: params.assertCurrent,
			warn: params.warn
		});
		if (state.stopped) record(state);
	} catch (error) {
		if (!recorded) throw error;
		params.warn(`Predecessor Gateway stop reported an error after its native mutation: ${String(error)}`);
	}
	return recorded;
}
/**
* Finalization from a legacy parent: adopt the candidate's own service
* inspection when the parent transferred an uninspected service, so the
* existing restart path can start the updated service after Doctor. A stop the
* delegated Doctor performed is adopted only for the same service identity, and
* a Gateway the candidate itself stopped is never left down under --no-restart.
*/
async function adoptCandidateManagedServiceStop(params) {
	const unchanged = {
		stopped: params.transferred,
		restartRequired: false
	};
	if (process.platform === "win32") return unchanged;
	const doctorStop = readDoctorStop(params.runId, params.ledger);
	if (!needsCandidateManagedServiceStop({
		...params,
		preManagedServiceStop: params.transferred,
		shouldRestart: params.shouldRestart || doctorStop !== void 0
	})) return unchanged;
	const startedAt = Date.now();
	let stopped = params.transferred;
	const state = await maybeStopManagedServiceBeforeMutableUpdate({
		updateInstallKind: params.mode === "git" ? "git" : "package",
		root: params.root,
		shouldRestart: true,
		jsonMode: true,
		timeoutMs: params.timeoutMs,
		phase: "prepare",
		onStopped: (current) => {
			stopped = current;
		},
		assertCurrent: params.assertCurrent
	});
	if (state.inspected || state.stopped) stopped = state;
	if (!stopped?.inspected) return {
		stopped,
		restartRequired: false
	};
	let restartRequired = false;
	if (!stopped.stopped && doctorStop && !stopped.running) {
		const current = serviceIdentity(stopped, doctorStop.stoppedAtMs);
		if (current.fingerprint === doctorStop.fingerprint && current.managerUid === doctorStop.managerUid) {
			stopped = {
				...stopped,
				stopped: true,
				stoppedAtMs: doctorStop.stoppedAtMs
			};
			restartRequired = !params.shouldRestart;
		}
	}
	if (stopped.stopped) params.onStep({
		name: "managed-service",
		command: "stop managed gateway service before Doctor (candidate inspection)",
		cwd: params.root,
		durationMs: Date.now() - startedAt,
		exitCode: 0,
		...restartRequired ? { advisory: {
			kind: "recoverable-maintenance",
			message: "The previous Gateway had to be stopped for update Doctor maintenance; it is restarted on the updated installation despite --no-restart."
		} } : {}
	});
	return {
		stopped,
		restartRequired
	};
}
//#endregion
//#region src/infra/update-migrated-finalize.worker.ts
async function finalizeMigratedUpdate() {
	if (process.argv[2] === "--check") {
		const { finishUpdateRun } = await import("../cli/daemon-cli.js");
		routeLogsToStderr();
		if (typeof finishUpdateRun !== "function") throw new Error("Update recovery writer is unavailable.");
		process.stdout.write(JSON.stringify({
			executorDelegation: "pid-start-v1",
			retainedOwnerBinding: true,
			doctorConfigWrites: "pid-start-v1",
			gatewayRestartCompletion: true,
			state: 18,
			agent: 23
		}));
		return;
	}
	await withCliProcessScope(retainCliProcessJobUntilExit);
	const chunks = [];
	for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	const text = Buffer.concat(chunks).toString("utf8");
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
		...gatewayRestartPending ? { restartRunId: terminal.runId } : { terminalRunId: terminal.runId },
		executorDelegation: "pid-start-v1",
		automaticTriage: finalized.automaticTriage
	};
	await fs.writeFile(input.resultPath, JSON.stringify(response), { mode: 384 });
}
async function runDelegatedDoctor(input) {
	const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]?.trim();
	if (!resultPath || !input.executor) throw new Error("Update Doctor requires its delegated executor and result path.");
	await withDelegatedUpdateCommandExecutor(input.executor, input.runId, input.root, async (fence) => {
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
		const { runDoctorHealthFlow } = await import("../doctor-health-DrQe7hiA.mjs");
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
	executorFence?.assertCurrent();
	adoptUpdateRun(runIdentity.runId, { env: runIdentity.env });
	const run = {
		...runIdentity,
		...executorFence ? { executorFence } : {},
		...descriptor ? { requesterAuthority: descriptor.requester.authorizationSource?.startsWith("profile:") ? await createManagedUpdateRequesterContinuationAuthority(descriptor.requester, {
			runId: runIdentity.runId,
			executor: executorFence
		}, runIdentity.env) : await createManagedUpdateRequesterAuthority(descriptor.requester, runIdentity.env) } : {}
	};
	executorFence.assertCurrent();
	registerRun(run);
	for (const step of input.bufferedSteps) {
		executorFence?.assertCurrent();
		recordUpdateRunStep(run.runId, step, { env: run.env });
	}
	const { stopped, restartRequired } = await adoptCandidateManagedServiceStop({
		transferred: input.params.preManagedServiceStop,
		shouldRestart: input.params.shouldRestart,
		mode: input.params.result.mode,
		windowsTaskAutoStartSuspended: input.windowsTaskAutoStartSuspended,
		runId: run.runId,
		ledger: { env: run.env },
		root: input.params.result.root ?? input.params.root,
		timeoutMs: input.params.updateStepTimeoutMs,
		assertCurrent: () => {
			executorFence.assertCurrent();
			if (run.requesterAuthority?.isCurrent() === false) throw new UpdateRequesterRevokedError();
		},
		onStep: (step) => input.params.result.steps.push(step)
	});
	if (restartRequired) input.params.shouldRestart = true;
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
		}, { candidateRuntime: true });
	} catch (error) {
		if (!(error instanceof UpdateCommandFailure)) throw error;
		result = error.result;
		exitCode = error.exitCode;
		automaticTriage = error.automaticTriage;
	} finally {
		await windowsRecovery?.complete(result?.status === "ok");
	}
	executorFence.assertCurrent();
	return {
		run,
		result,
		exitCode,
		automaticTriage
	};
}
(async () => {
	try {
		await finalizeMigratedUpdate();
	} finally {
		await closeOpenClawStateDatabaseAsync();
	}
})().catch((error) => {
	process.stderr.write(`${formatUpdateFinalizationError(error)}\n`);
	process.exitCode = 1;
});
//#endregion
export {};
