import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { n as createNonExitingRuntime, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as getPendingCliDisposers } from "./runtime-cleanup-CiSdbQbb.mjs";
import { i as watchCliExitAfterOutput, t as exitCliAfterOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { n as formatConsoleDiagnosticLine } from "./json-console-line-DIE6i1JG.mjs";
import { i as getLogger } from "./logger-Mnn26Jj7.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { o as resolveAggregateSqliteInspectionTimeoutMs } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import "./update-post-core-context-B2x24New.mjs";
import { n as readUpdateRunDriver } from "./update-run-driver-k0LVIIq0.mjs";
import { a as UPDATE_RUN_HEARTBEAT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { l as withCommandProcessScope, n as resolveCommandProcessSignal } from "./exec-spawn-IxJJNQFo.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { n as readInstallOwner } from "./install-owner-ImshV9Dw.mjs";
import { c as normalizeUpdateChannel, i as UPDATE_EFFECTIVE_CHANNEL_ENV } from "./update-channels-BquD107I.mjs";
import { c as resolveUpdateInstallKind } from "./update-check-CWEQyown.mjs";
import { s as redactSupportDiagnosticLine } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { a as updateRunStepsFromResultStep } from "./update-run-step-BDxgGAu8.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { a as UpdateDoctorError, c as collectUpdateDoctorFailureFacts, m as normalizeUpdatePostInstallDoctorWarnings, t as DoctorMaintenanceRefusalError } from "./update-doctor-result-yVslo54h.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-6uPuICvJ.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { t as formatUpdateRunOwnership } from "./update-run-activity-CykyDahG.mjs";
import { c as recordUpdateRunDiagnostic, d as recordUpdateRunRepairContinuation, f as recordUpdateRunStep, h as reconcileAbandonedUpdateRunsAsync, l as recordUpdateRunPhase, n as adoptUpdateRun, o as heartbeatUpdateRun, r as createUpdateRun, t as acknowledgeAbandonedUpdateRun } from "./update-run-ledger-jBhhLo0P.mjs";
import { i as finishUpdateRun } from "./update-run-write-DdGOnqyV.mjs";
import { i as getUpdateRun } from "./update-run-reader-B7x8dkVs.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import "./installed-plugin-index-records-VCj98mZ6.mjs";
import { n as hasCliProcessScope, r as retainCliProcessJobUntilExit } from "./runtime-cleanup-scope-Dno3Ssrr.mjs";
import { r as createUpdateOperationDeadline } from "./update-command-executor-C94Zye_E.mjs";
import { i as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { c as parseUpdateTimeoutMs, h as tryWriteCompletionCache, p as resolveUpdateRoot } from "./shared-D-l8dmoD.mjs";
import { a as preparePostCorePluginConfig, i as persistValidatedDowngradeConfig, o as readPostCorePreUpdateSourceConfig, r as persistRequestedUpdateChannel, t as capturePreUpdateSourceConfig } from "./update-command-config-BUAszwT_.mjs";
import { n as settleUpdateDoctorMaintenance, r as completeSourceUpdateRuntime, t as updatePluginsAfterCoreUpdate } from "./update-command-plugins-DBbtqF31.mjs";
import { d as withUpdateInProgressEnv, i as resolveServiceRefreshEnv } from "./update-command-service-env-lR0aWgPL.mjs";
import { p as readUpdateStateDatabaseSizes } from "./update-candidate-state-CO0vwfHU.mjs";
import { n as createUpdateConfigSnapshot } from "./update-command-config-snapshot-BdxE1oYA.mjs";
import { i as UpdateFinalizationOutput, n as runUpdateFinalizationDoctorInFreshProcess, r as withPrePluginUpdateDoctorEnv, t as completePostCorePluginUpdate } from "./update-command-fresh-doctor-D41a_79v.mjs";
import { a as collectPostCorePluginFailureFacts, i as collectPostCorePluginAdvisories } from "./update-command-plugins-internals-CR2JjHB2.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-DzSs7LNY.mjs";
import { n as UpdateCommandFailure, o as createUpdateCommandFailureResult, r as UpdateCommandFinalizedRecoveryFailure, v as withUpdateAdmissionReporting } from "./update-command-result-hCfuj3eW.mjs";
import { S as suppressDeprecations, o as reportPreMutationUpdateResult } from "./update-command-terminal-CpPTmwiB.mjs";
import { n as reportHostOwnedUpdate, t as refuseHostOwnedUpdate } from "./host-owned-DHQI8WGZ.mjs";
import { t as readRetiredDeferredPluginMigrationWarnings } from "./deferred-plugin-migration-warnings-Bi1cLcKC.mjs";
import { t as refuseImmutableUpdateActivation } from "./update-command-immutable-CPENt4_e.mjs";
import { n as withUpdateFailureTriage } from "./update-command-triage-BJqWwzbl.mjs";
import { readlinkSync, writeSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
//#region src/cli/update-cli/update-finalization-processes.ts
const MAX_CHILD_PROCESSES = 8;
const MAX_COMMAND_LENGTH = 64;
/** Inspect names, never argv or environment, only when finalization is already stalled. */
function inspectUpdateFinalizationChildren() {
	const windows = process.platform === "win32";
	const inspector = windows ? path.win32.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "WindowsPowerShell", "v1.0", "powershell.exe") : "/bin/ps";
	const args = windows ? [
		"-NoProfile",
		"-NonInteractive",
		"-Command",
		"Get-CimInstance Win32_Process | ForEach-Object { \"{0} {1} {2}\" -f $_.ProcessId,$_.ParentProcessId,$_.Name }"
	] : ["-axo", process.platform === "linux" ? "pid=,ppid=" : "pid=,ppid=,ucomm="];
	const result = spawnSync(inspector, args, {
		encoding: "utf8",
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		],
		timeout: 1e3,
		killSignal: "SIGKILL",
		maxBuffer: 1048576,
		windowsHide: true
	});
	if (result.error || result.status !== 0 || !result.stdout) return {
		childProcesses: [],
		childProcessInspection: "unavailable",
		childProcessesTruncated: false
	};
	const processes = result.stdout.split("\n").flatMap((line) => {
		const match = /^\s*(\d+)\s+(\d+)(?:\s+(.+?))?\s*$/u.exec(line);
		if (!match) return [];
		const [, pid, parentPid, command = ""] = match;
		if (!pid || !parentPid || process.platform !== "linux" && !command) return [];
		return [{
			pid: Number(pid),
			parentPid: Number(parentPid),
			command
		}];
	});
	const childrenByParent = /* @__PURE__ */ new Map();
	for (const child of processes) {
		const children = childrenByParent.get(child.parentPid) ?? [];
		children.push(child);
		childrenByParent.set(child.parentPid, children);
	}
	const parents = /* @__PURE__ */ new Set([process.pid]);
	const pending = [process.pid];
	const childProcesses = [];
	for (const parentPid of pending) for (const child of childrenByParent.get(parentPid) ?? []) {
		if (parents.has(child.pid) || child.pid === result.pid) continue;
		parents.add(child.pid);
		pending.push(child.pid);
		childProcesses.push(child);
	}
	return {
		childProcesses: childProcesses.toSorted((a, b) => a.pid - b.pid).slice(0, MAX_CHILD_PROCESSES).map((child) => {
			let executable = child.command;
			if (process.platform === "linux") try {
				executable = readlinkSync(`/proc/${child.pid}/exe`);
			} catch {
				return {
					pid: child.pid,
					parentPid: child.parentPid,
					command: null
				};
			}
			return {
				pid: child.pid,
				parentPid: child.parentPid,
				command: (windows ? path.win32 : path.posix).basename(executable).slice(0, MAX_COMMAND_LENGTH)
			};
		}),
		childProcessInspection: "complete",
		childProcessesTruncated: childProcesses.length > MAX_CHILD_PROCESSES
	};
}
//#endregion
//#region src/cli/update-cli/update-finalization-lifecycle.ts
var UpdateFinalizationLifecycle = class {
	constructor(json, timeoutMs, stopChildren) {
		this.json = json;
		this.timeoutMs = timeoutMs;
		this.stopChildren = stopChildren;
		this.startedAt = performance.now();
		this.phaseTimings = [];
		this.ownsRun = false;
		this.ownsRepairRun = false;
		this.warnedHeartbeat = false;
		this.completed = false;
		this.recordedWarningCounts = /* @__PURE__ */ new Map();
	}
	get ownsUpdateRun() {
		return this.ownsRun;
	}
	attachLedger(repair = false) {
		this.driver = readUpdateRunDriver();
		const inherited = process.env[UPDATE_RUN_ID_ENV]?.trim();
		this.ledgerOptions = { env: { ...process.env } };
		const admissionOptions = {
			...this.ledgerOptions,
			busyTimeoutMs: this.budget("preflight")
		};
		this.runId = createUpdateRun({
			runId: inherited || void 0,
			trigger: "cli"
		}, admissionOptions).runId;
		this.ownsRun = !inherited;
		adoptUpdateRun(this.runId, admissionOptions);
		this.handoff?.bindRun(this.runId);
		this.ownsRepairRun = repair && this.ownsRun;
		if (this.ownsRepairRun) recordUpdateRunRepairContinuation(this.runId, this.runId, admissionOptions);
		if (this.active) recordUpdateRunStep(this.runId, {
			step: this.active.step,
			status: "in_progress",
			startedAtMs: this.active.startedAtMs
		}, admissionOptions);
		return this.runId;
	}
	recordInstallKind(installKind, version) {
		if (this.runId && this.ownsRun && installKind !== "unknown") recordUpdateRunPhase(this.runId, "requested", {
			target: {
				kind: installKind,
				...version ? { version } : {}
			},
			...version ? { after: { version } } : {},
			...installKind === "package" && this.ledgerOptions?.env["OPENCLAW_UPDATE_POST_CORE"] !== "1" ? { step: {
				step: "finalize:package-rollback-not-needed",
				status: "skipped",
				endedAtMs: Date.now(),
				detail: "No package mutation during standalone finalization."
			} } : {}
		}, this.ledgerOptions);
	}
	record(name, status, at, detail, failureFacts, exitCode) {
		const failureReason = failureFacts?.find((fact) => fact.code.trim() && fact.code !== "finalization-failed")?.code;
		const step = {
			step: name,
			status,
			...detail ? { detail } : {},
			...failureFacts?.length ? { failureFacts } : {},
			...exitCode !== void 0 ? { exitCode } : {},
			...status === "failed" ? { reason: failureReason ?? name } : {},
			...status === "in_progress" ? { startedAtMs: at } : { endedAtMs: at }
		};
		const message = `[update finalize] ${JSON.stringify(step)}`;
		if (status === "failed") {
			this.failureReason = failureReason;
			defaultRuntime.error(message);
		} else if (name.startsWith("warning:")) console.warn(message);
		else {
			getLogger().info(message);
			process.stderr.write(`${formatConsoleDiagnosticLine({
				level: "info",
				message
			})}\n`);
		}
		if (this.runId) try {
			recordUpdateRunStep(this.runId, step, this.ledgerOptions);
		} catch {
			defaultRuntime.error("[update finalize] Could not persist phase diagnostic.");
		}
	}
	/** Records the phase's complete current warning list, retiring rows a shorter list drops. */
	recordWarnings(warnings, phase = "doctor") {
		warnings.forEach((detail, index) => {
			this.record(`warning:finalize:${phase}:${index}`, "completed", Date.now(), detail);
		});
		const recorded = this.recordedWarningCounts.get(phase) ?? 0;
		this.recordedWarningCounts.set(phase, warnings.length);
		if (!this.runId) return;
		for (let index = warnings.length; index < recorded; index += 1) try {
			recordUpdateRunStep(this.runId, {
				step: `warning:finalize:${phase}:${index}`,
				status: "skipped",
				endedAtMs: Date.now(),
				detail: "Settled or superseded later in this update."
			}, this.ledgerOptions);
		} catch {
			defaultRuntime.error("[update finalize] Could not retire a settled warning.");
		}
	}
	recordDoctorStep(step) {
		const endedAtMs = Date.now();
		for (const row of updateRunStepsFromResultStep(step)) this.record(row.step, row.status === "failed" ? "failed" : "completed", endedAtMs, row.detail, row.failureFacts, row.exitCode);
	}
	budget(phase) {
		const budgetMs = this.timeoutMs ?? (phase === "doctor" || phase === "targetConfigConvergence" ? void 0 : phase === "plugins" ? 12e5 : this.stateBudgetMs ?? resolveAggregateSqliteInspectionTimeoutMs("update finalization", []));
		return budgetMs === void 0 ? void 0 : Math.min(budgetMs, 2147483647);
	}
	async run(phase, run, outcome, custody) {
		this.stateBudgetMs ??= this.timeoutMs ?? resolveAggregateSqliteInspectionTimeoutMs("update finalization", await readUpdateStateDatabaseSizes([resolveOpenClawStateSqlitePath(process.env)], {
			nodeRunner: process.execPath,
			sourceEnv: { ...process.env },
			stagingRoot: os.tmpdir()
		}));
		const startedAt = performance.now();
		const startedAtMs = Date.now();
		const budgetMs = phase === "plugins" && this.timeoutMs === void 0 ? void 0 : this.budget(phase);
		const active = {
			step: `finalize:${phase}`,
			startedAtMs
		};
		this.active = active;
		this.record(active.step, "in_progress", startedAtMs);
		const output = new UpdateFinalizationOutput();
		const heartbeat = phase === "doctor" || phase === "targetConfigConvergence" ? void 0 : setInterval(() => {
			try {
				if (this.runId) heartbeatUpdateRun(this.runId, this.driver, this.ledgerOptions);
			} catch (error) {
				if (!this.warnedHeartbeat) {
					this.warnedHeartbeat = true;
					console.warn(`[update finalize] Could not refresh the update heartbeat; continuing: ${formatErrorMessage(error).slice(0, 500)}`);
				}
			}
		}, UPDATE_RUN_HEARTBEAT_MS);
		heartbeat?.unref();
		const end = (result, detail, failureFacts, exitCode) => {
			this.phaseTimings.push({
				phase,
				startedOffsetMs: Math.max(0, Math.round(startedAt - this.startedAt)),
				durationMs: Math.max(0, Math.round(performance.now() - startedAt)),
				outcome: result
			});
			this.record(active.step, result === "failed" ? "failed" : result === "deferred" ? "skipped" : "completed", Date.now(), detail, failureFacts, exitCode);
		};
		let stopPhaseChildren = () => {};
		let doctorOutput;
		const deadline = createUpdateOperationDeadline((failure) => {
			let diagnostics = {
				childProcesses: [],
				childProcessInspection: "unavailable",
				childProcessesTruncated: false
			};
			try {
				diagnostics = inspectUpdateFinalizationChildren();
			} catch {}
			doctorOutput = output.snapshot();
			stopPhaseChildren();
			this.reportTimeout = () => {
				writeSync(2, `${failure.message}\n`);
				if (doctorOutput) writeSync(2, `[update finalize] Doctor output: ${JSON.stringify(doctorOutput)}\n`);
				writeSync(2, `[update finalize] Stalled phase children: ${JSON.stringify(diagnostics)}\n`);
				this.recordDiagnostic(JSON.stringify(diagnostics));
				if (this.json) defaultRuntime.writeJson({
					status: "failed",
					mode: "finalize",
					root: this.root,
					restart: false,
					stuckPhase: phase,
					elapsedMs: Math.round(performance.now() - this.startedAt),
					error: failure.message,
					phaseTimings: this.phaseTimings,
					...diagnostics,
					...doctorOutput ? { doctorOutput } : {}
				});
			};
		});
		const scope = {
			signal: resolveCommandProcessSignal(deadline.signal) ?? deadline.signal,
			assertCurrent: () => {
				this.handoff?.assertCurrent();
				deadline.assertCurrent();
				scope.signal.throwIfAborted();
			}
		};
		try {
			await withCommandProcessScope(async () => {
				this.handoff?.assertCurrent();
				await custody?.enter?.();
			});
			if (budgetMs !== void 0 && hasCliProcessScope()) {
				const failure = new UpdateCommandFinalizedRecoveryFailure({
					status: "error",
					mode: "unknown",
					root: this.root,
					reason: "finalization-timeout",
					steps: [],
					durationMs: Math.round(performance.now() - this.startedAt)
				});
				failure.message = `Update finalization timed out in ${phase} after ${budgetMs}ms`;
				deadline.start(failure, budgetMs);
			}
			const result = await deadline.run(() => withCommandProcessScope(async (stop) => {
				stopPhaseChildren = stop;
				scope.assertCurrent();
				return await output.run(() => run(scope));
			}, scope.signal));
			await withCommandProcessScope(async () => {
				await custody?.restore?.(result);
			});
			const completed = outcome?.(result) ?? "completed";
			end(typeof completed === "string" ? completed : completed.outcome, void 0, typeof completed === "string" ? void 0 : completed.failureFacts);
			return result;
		} catch (error) {
			const failure = deadline.failure;
			if (failure) this.record(`warning:finalize:${phase}:deadline`, "completed", Date.now(), failure.message);
			const doctorFailure = collectNestedErrorCandidates(error).find((cause) => cause instanceof UpdateDoctorError);
			const facts = failure ? [createUpdateFailureFact({
				check: phase,
				code: "finalization-timeout",
				message: failure.message
			})] : doctorFailure ? collectUpdateDoctorFailureFacts(error) : [createUpdateFailureFact({
				check: phase,
				code: extractErrorCode(error) ?? "finalization-failed",
				message: formatErrorMessage(error)
			})];
			const deferred = !failure && error instanceof DoctorMaintenanceRefusalError && error.refusal.kind === "deferred";
			end(deferred ? "deferred" : "failed", doctorOutput ? formatDoctorOutputDetail(doctorOutput) : redactSupportDiagnosticLine(formatErrorMessage(error), {
				env: process.env,
				stateDir: resolveStateDir(process.env)
			}), deferred ? void 0 : facts, deferred ? void 0 : doctorFailure?.exitCode);
			throw error;
		} finally {
			clearInterval(heartbeat);
			this.active = void 0;
			output.close();
		}
	}
	async observeFailure(error) {
		if (!this.root || !this.runId || !this.ledgerOptions || hasCommandProcessCleanupError(error)) return;
		const { env } = this.ledgerOptions;
		const { verifyUpdateFailureRecovery } = await import("./update-command-failure-recovery-DrHWJHy8.mjs");
		const result = error instanceof UpdateCommandFailure ? error.result : createUpdateCommandFailureResult({
			mode: "unknown",
			root: this.root,
			failure: { cause: error },
			durationMs: Math.round(performance.now() - this.startedAt)
		});
		if (result.reason === "update-failed") result.reason = this.failureReason ?? (this.ownsRepairRun ? "repair-failed" : result.reason);
		try {
			this.failureObservation = await verifyUpdateFailureRecovery({
				result,
				root: this.root,
				opts: {
					json: this.json,
					run: {
						runId: this.runId,
						env
					}
				},
				env,
				timeoutMs: this.timeoutMs,
				serviceUpdateVerdict: this.serviceUpdateVerdict,
				waitForStartup: this.phaseTimings.some(({ phase }) => phase === "doctor")
			});
			return this.failureObservation;
		} catch (recoveryError) {
			if (hasCommandProcessCleanupError(recoveryError) && recoveryError !== error) throw new AggregateError([error, recoveryError], "Update failure recovery did not settle", { cause: recoveryError });
			throw recoveryError;
		}
	}
	finishLedger(exitCode, deferredMaintenance) {
		if (this.runId && this.ownsRun) try {
			finishUpdateRun(this.runId, {
				status: exitCode ? "failed" : deferredMaintenance ? "skipped" : "succeeded",
				reason: deferredMaintenance ? "doctor-maintenance-pending" : this.failureObservation?.reason === "repair-failed" ? "repair-failed" : void 0,
				nextAction: deferredMaintenance,
				diagnostics: this.failureObservation
			}, this.ledgerOptions);
		} catch {
			defaultRuntime.error("[update finalize] Could not persist final outcome.");
		}
	}
	recordDiagnostic(diagnostic) {
		if (this.runId) try {
			recordUpdateRunDiagnostic(this.runId, diagnostic, this.ledgerOptions);
		} catch {}
	}
	fail() {
		if (this.reportTimeout) {
			this.complete(1);
			return;
		}
		this.finishLedger(1);
	}
	finishRecovery() {
		const watch = this.deferredExitWatch;
		this.deferredExitWatch = void 0;
		watch?.();
	}
	complete(exitCode, deferredMaintenance) {
		if (this.completed) return;
		this.completed = true;
		this.finishLedger(exitCode, deferredMaintenance);
		this.reportTimeout?.();
		if (!hasCliProcessScope()) return;
		this.deferredExitWatch = () => watchCliExitAfterOutput(exitCode, () => {
			const diagnostic = JSON.stringify({
				activeResources: [...new Set(process.getActiveResourcesInfo())].toSorted(),
				unsettledDisposers: getPendingCliDisposers(),
				...inspectUpdateFinalizationChildren()
			});
			writeSync(2, `[update finalize] Process still alive after terminal output: ${diagnostic}\n`);
			this.recordDiagnostic(diagnostic);
			this.stopChildren();
		});
	}
};
function formatDoctorOutputDetail(output) {
	return [`Doctor ${output.phase} received output:`, ...["stdout", "stderr"].map((name) => {
		const stream = output[name];
		return `${name} ${stream.receivedBytes} bytes, last ${stream.lastOutputAgeMs ?? "none"}ms: ${"omitted" in stream ? `[omitted: ${stream.omitted}]` : stream.excerpt}`;
	})].join("\n");
}
//#endregion
//#region src/cli/update-cli/update-command-finalize.ts
async function updateFinalizeCommand(opts, recoveryRunIds, handoff) {
	await assertUpdateRecoveryAdmission({ env: process.env });
	const discoveredRoot = await resolveUpdateRoot();
	await refuseHostOwnedUpdate(discoveredRoot, opts);
	await refuseImmutableUpdateActivation(discoveredRoot, opts);
	const invocationCwd = tryProcessCwd();
	suppressDeprecations();
	const timeoutMs = parseUpdateTimeoutMs(opts.timeout);
	const requestedChannel = normalizeUpdateChannel(opts.channel);
	if (opts.channel !== void 0 && !requestedChannel) {
		defaultRuntime.error(`--channel must be "stable", "extended-stable", "beta", or "dev" (got "${opts.channel}")`);
		defaultRuntime.exit(1);
		return;
	}
	let exitCode;
	await withCommandProcessScope(async (stopChildren) => {
		const lifecycle = new UpdateFinalizationLifecycle(Boolean(opts.json), timeoutMs, stopChildren);
		lifecycle.handoff = handoff;
		try {
			const { root, installKind, runId } = await withUpdateAdmissionReporting(opts, () => withCommandProcessScope(() => withUpdateInProgressEnv(invocationCwd, () => lifecycle.run("preflight", async (phase) => {
				await assertUpdateRecoveryAdmission({ env: process.env });
				assertConfigWriteAllowedInCurrentMode();
				await assertOpenClawStateWriteAllowedAtPath({
					databasePath: resolveOpenClawStateSqlitePath(process.env),
					recoverOrphanedSidecars: false
				});
				await retainCliProcessJobUntilExit();
				phase.assertCurrent();
				const admittedRunId = lifecycle.attachLedger(recoveryRunIds !== void 0);
				const resolvedRoot = await resolveUpdateRoot();
				const resolvedInstallKind = await resolveUpdateInstallKind(resolvedRoot, { timeoutMs: lifecycle.budget("preflight") });
				if (resolvedInstallKind === "host") reportHostOwnedUpdate(await readInstallOwner(resolvedRoot), opts);
				if (resolvedInstallKind === "immutable") throw new Error("Use openclaw update recover --root <installation-root> for immutable activation recovery.");
				lifecycle.recordInstallKind(resolvedInstallKind, await readPackageVersion(resolvedRoot));
				return {
					root: resolvedRoot,
					installKind: resolvedInstallKind,
					runId: admittedRunId
				};
			}))), recoveryRunIds === void 0 ? "finalize" : "unknown");
			lifecycle.root = root;
			const nodeRunner = resolveNodeRunner();
			const target = {
				root,
				nodeRunner,
				env: {
					...resolveServiceRefreshEnv(process.env, invocationCwd),
					[UPDATE_RUN_ID_ENV]: runId
				}
			};
			await withUpdateFailureTriage({
				...opts,
				invocationCwd,
				run: {
					runId,
					env: target.env
				}
			}, target, () => withUpdateInProgressEnv(invocationCwd, async () => {
				try {
					await (await withCommandProcessScope(async () => {
						return await updateFinalizeCommandInternal(opts, {
							...await lifecycle.run("targetConfigValidation", (phase) => prepareUpdateFinalization(opts, root, installKind, requestedChannel, phase)),
							nodeRunner
						}, lifecycle, recoveryRunIds ?? [], runId, recoveryRunIds !== void 0 || lifecycle.ownsUpdateRun);
					}))();
				} catch (error) {
					if (hasCommandProcessCleanupError(error)) throw error;
					if (error instanceof DoctorMaintenanceRefusalError && error.refusal.kind === "deferred") {
						const nextAction = `Stop the Gateway through its service owner, stop other OpenClaw processes using this state, then rerun \`${formatCliCommand("openclaw update repair")}\`.`;
						const warnings = normalizeUpdatePostInstallDoctorWarnings([`Doctor and plugin maintenance remain pending. ${nextAction} ${error.message}`]);
						lifecycle.recordWarnings(warnings);
						defaultRuntime.error(warnings[0]);
						if (opts.json) defaultRuntime.writeJson({
							status: "warning",
							nextAction,
							mode: "finalize",
							root,
							restart: false,
							phaseTimings: lifecycle.phaseTimings,
							postUpdate: { doctor: {
								status: "warning",
								warnings
							} }
						});
						else defaultRuntime.log(theme.warn(`Doctor maintenance remains pending. ${nextAction}`));
						lifecycle.complete(0, nextAction);
						return;
					}
					if (!lifecycle.completed) target.failureResult = await lifecycle.observeFailure(error);
					if (error instanceof UpdateCommandFailure) lifecycle.complete(error.exitCode);
					else lifecycle.fail();
					throw error;
				}
			}));
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) throw error;
			if (error instanceof UpdateCommandFinalizedRecoveryFailure) {
				lifecycle.complete(error.exitCode);
				exitCode = error.exitCode;
				return;
			}
			if (!lifecycle.completed) lifecycle.fail();
			throw error;
		} finally {
			lifecycle.finishRecovery();
		}
	});
	if (exitCode !== void 0) exitCliAfterOutput(defaultRuntime, exitCode);
}
async function prepareUpdateFinalization(opts, root, installKind, requestedChannel, phase) {
	await assertOpenClawStateWriteAllowedAtPath({ databasePath: resolveOpenClawStateSqlitePath(process.env) });
	const configSnapshot = await readConfigFileSnapshot({
		skipPluginValidation: true,
		observe: false
	});
	const preFinalizeConfig = await readPostCorePreUpdateSourceConfig({
		sourceConfigPath: process.env["OPENCLAW_UPDATE_POST_CORE_SOURCE_CONFIG_PATH"],
		currentSnapshot: configSnapshot
	}) ?? capturePreUpdateSourceConfig(configSnapshot);
	if (requestedChannel === "extended-stable" && installKind === "git") await reportPreMutationUpdateResult({
		root,
		installKind,
		reason: "unsupported_git_channel",
		opts,
		controlPlaneUpdateSentinelMeta: null
	});
	const storedChannel = configSnapshot.valid ? normalizeUpdateChannel(configSnapshot.config.update?.channel) : null;
	const effectiveChannel = normalizeUpdateChannel(process.env[UPDATE_EFFECTIVE_CHANNEL_ENV]?.trim());
	const channel = requestedChannel ?? storedChannel ?? effectiveChannel ?? "stable";
	if (requestedChannel) await withPluginLifecycleLease(phase, async () => {
		const snapshot = await readConfigFileSnapshot({
			skipPluginValidation: true,
			observe: false
		});
		return await persistRequestedUpdateChannel({
			configSnapshot: snapshot,
			requestedChannel,
			assertCurrent: phase.assertCurrent
		});
	});
	return {
		root,
		installKind,
		preFinalizeConfig,
		requestedChannel,
		storedChannel,
		effectiveChannel,
		channel
	};
}
async function updateFinalizeCommandInternal(opts, prepared, lifecycle, recoveryRunIds, invokingRunId, ownsMaintenance) {
	const { root, nodeRunner, preFinalizeConfig, requestedChannel, storedChannel, effectiveChannel, channel } = prepared;
	let doctorWarnings = [];
	const onDoctorWarnings = (warnings) => {
		doctorWarnings = normalizeUpdatePostInstallDoctorWarnings([.../* @__PURE__ */ new Set([...doctorWarnings, ...warnings])]);
		lifecycle.recordWarnings(doctorWarnings);
	};
	let maintenance;
	const restoreMaintenance = async (cfg) => {
		const owned = maintenance;
		maintenance = void 0;
		await owned?.finish(cfg);
		if (owned?.warnings?.length) onDoctorWarnings(owned.warnings);
	};
	let outcome;
	try {
		if (prepared.installKind === "git") await withPluginLifecycleLease({}, async (lease) => {
			await withCommandProcessScope(() => completeSourceUpdateRuntime({
				root,
				timeoutMs: lifecycle.budget("plugins"),
				lease
			}));
		});
		const initialPluginUpdate = await withPrePluginUpdateDoctorEnv(async () => {
			await lifecycle.run("configSnapshot", () => createUpdateConfigSnapshot());
			await lifecycle.run("doctor", () => runUpdateFinalizationDoctorInFreshProcess({
				phase: "pre-plugin",
				root,
				nodeRunner,
				runId: invokingRunId,
				yes: opts.yes === true,
				json: opts.json === true,
				workspaceSuggestions: true,
				timeoutMs: lifecycle.budget("doctor"),
				onWarnings: onDoctorWarnings,
				onDoctorStep: (step) => lifecycle.recordDoctorStep(step)
			}), void 0, { enter: async () => {
				if (!ownsMaintenance) return;
				const { beginDoctorMaintenance } = await import("./doctor-maintenance-BDID5iqH.mjs");
				maintenance = await beginDoctorMaintenance({
					root,
					runId: invokingRunId,
					options: {
						repair: true,
						nonInteractive: true,
						json: opts.json
					},
					runtime: {
						...defaultRuntime,
						log: defaultRuntime.error
					}
				});
				lifecycle.serviceUpdateVerdict = maintenance?.serviceUpdateVerdict;
				await maintenance?.releaseState();
			} });
			return await lifecycle.run("plugins", (phase) => withPluginLifecycleLease(phase, () => withCommandProcessScope(async () => {
				const preparedConfig = await preparePostCorePluginConfig({
					requestedChannel,
					preUpdateConfig: preFinalizeConfig,
					assertCurrent: phase.assertCurrent
				});
				const { configSnapshot } = preparedConfig;
				const postDoctorStoredChannel = configSnapshot.valid ? normalizeUpdateChannel(configSnapshot.config.update?.channel) : null;
				const postDoctorChannel = requestedChannel ?? postDoctorStoredChannel ?? storedChannel ?? effectiveChannel ?? "stable";
				const pluginInstallRecords = await loadInstalledPluginIndexInstallRecords();
				return await updatePluginsAfterCoreUpdate({
					root,
					channel: postDoctorChannel,
					...preparedConfig,
					json: opts.json,
					acceptCapabilities: opts.acceptCapabilities,
					timeoutMs: lifecycle.budget("plugins"),
					workTimeoutMs: parseUpdateTimeoutMs(opts.timeout) ?? null,
					pluginInstallRecords,
					assertCurrent: phase.assertCurrent,
					runtime: createNonExitingRuntime()
				});
			})), pluginOutcome);
		});
		const completedPluginUpdate = await lifecycle.run("targetConfigConvergence", async (phase) => {
			const result = await completePostCorePluginUpdate({
				root,
				nodeRunner,
				runId: invokingRunId,
				pluginUpdate: initialPluginUpdate,
				freshDoctorRequired: initialPluginUpdate.changed,
				yes: opts.yes === true,
				json: opts.json === true,
				timeoutMs: lifecycle.budget("targetConfigConvergence"),
				onWarnings: onDoctorWarnings,
				onDoctorStep: (step) => lifecycle.recordDoctorStep(step)
			});
			const retiredWarnings = await readRetiredDeferredPluginMigrationWarnings(doctorWarnings);
			phase.assertCurrent();
			if (retiredWarnings.size > 0) {
				doctorWarnings = doctorWarnings.filter((warning) => !retiredWarnings.has(warning));
				lifecycle.recordWarnings(doctorWarnings);
			}
			await persistValidatedDowngradeConfig(result.configSnapshot, phase.assertCurrent);
			return result;
		}, (result) => pluginOutcome(result.pluginUpdate), { restore: (result) => restoreMaintenance(result.configSnapshot.config) });
		const pluginUpdate = completedPluginUpdate.pluginUpdate;
		lifecycle.recordWarnings(collectPostCorePluginAdvisories(pluginUpdate), "plugins");
		const { configSnapshot } = completedPluginUpdate;
		const completionBudget = lifecycle.budget("completionCache");
		const completionTimeout = completionBudget - Math.min(1e3, completionBudget / 2);
		await lifecycle.run("completionCache", async () => opts.deferCompletionCache ? "deferred" : await tryWriteCompletionCache(root, Boolean(opts.json), completionTimeout, nodeRunner), (result) => result);
		const reconciledRuns = [];
		const result = {
			status: pluginUpdate.status === "error" ? "error" : pluginUpdate.status === "warning" || doctorWarnings.length > 0 ? "warning" : "ok",
			mode: "finalize",
			root,
			channel: requestedChannel ?? (configSnapshot.valid ? normalizeUpdateChannel(configSnapshot.config.update?.channel) : null) ?? channel,
			restart: false,
			...recoveryRunIds.length ? { reconciledRuns } : {},
			phaseTimings: lifecycle.phaseTimings,
			postUpdate: {
				doctor: {
					status: doctorWarnings.length > 0 ? "warning" : "ok",
					...doctorWarnings.length > 0 ? { warnings: doctorWarnings } : {}
				},
				plugins: pluginUpdate
			}
		};
		outcome = { complete: async () => {
			if (result.status !== "error" && recoveryRunIds.length) {
				await reconcileAbandonedUpdateRunsAsync({
					explicit: true,
					runIds: recoveryRunIds
				});
				const unresolved = recoveryRunIds.map((runId) => getUpdateRun(runId)).find((run) => run?.status === "running");
				if (unresolved) throw new Error(formatUpdateRunOwnership(unresolved));
				for (const runId of recoveryRunIds) if (acknowledgeAbandonedUpdateRun(runId)) reconciledRuns.push(runId);
			}
			const failure = result.status === "error" ? new UpdateCommandFailure({
				status: "error",
				mode: "unknown",
				root,
				reason: "post-update-plugins",
				postUpdate: { plugins: pluginUpdate },
				steps: [],
				durationMs: Math.round(performance.now() - lifecycle.startedAt)
			}) : void 0;
			const observed = failure ? await lifecycle.observeFailure(failure) : void 0;
			if (!failure) lifecycle.handoff?.complete(invokingRunId);
			if (opts.json) defaultRuntime.writeJson({
				...result,
				...observed ? {
					recovery: observed.recovery,
					verification: observed.verification
				} : {}
			});
			else if (result.status === "ok") defaultRuntime.log(theme.muted("Update finalization completed."));
			else if (result.status === "warning") defaultRuntime.log(theme.warn("Update finalization completed with warnings."));
			else defaultRuntime.log(theme.error("Update finalization failed."));
			lifecycle.complete(result.status === "error" ? 1 : 0);
			if (failure) throw failure;
		} };
	} catch (error) {
		outcome = { error };
	}
	if (maintenance) {
		const owned = maintenance;
		outcome = await settleUpdateDoctorMaintenance(outcome, async () => restoreMaintenance((await readConfigFileSnapshot({
			skipPluginValidation: true,
			observe: false
		})).config), () => owned.release(), "Update finalization and service restoration failed");
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.complete;
}
function pluginOutcome(result) {
	return {
		outcome: result.status === "error" ? "failed" : result.status === "warning" ? "warning" : "completed",
		...result.status === "error" ? { failureFacts: collectPostCorePluginFailureFacts(result) } : {}
	};
}
//#endregion
export { updateFinalizeCommand as t };
