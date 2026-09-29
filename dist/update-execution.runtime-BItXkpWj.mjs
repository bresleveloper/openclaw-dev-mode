import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as signalProcessTree } from "./kill-tree-BGQdx374.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as formatErrorMessageWithCode, t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { s as resolveSqliteInspectionBudget } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { o as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { a as redactSupportDiagnosticLine, o as redactSupportString } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { i as parseConfigFailureFacts, l as createUpdatePreflightFailure, n as createUpdateFailureFact } from "./update-failure-facts-THF-vx3i.mjs";
import { l as createUpdatePostInstallDoctorResultPath, n as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, s as consumeUpdatePostInstallDoctorResult } from "./update-doctor-result-C3mikR6I.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-BXzjx6E8.mjs";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cko-Hb6h.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { D as resolveUpdateInstallRoot } from "./restart-sentinel-KM6PPxhT.mjs";
import { t as createUpdateDoctorConfigWarningStep } from "./update-doctor-config-BrLAVDg0.mjs";
import { n as isFailedUpdateStep, r as isUpdateGatewayReadinessPending } from "./update-run-step-ijjXM1mH.mjs";
import { f as recordUpdateRunPhase } from "./update-run-ledger-CwAEg-5V.mjs";
import { f as ScheduledTaskAutoStartRecoveryError } from "./schtasks-D2U0K9JA.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-DOtkGjU8.mjs";
import { r as getActiveManagedProxyUrl, t as getActiveManagedProxyLoopbackMode } from "./active-proxy-state-e8AvA0BH.mjs";
import { r as registerManagedProxyGatewayLoopbackBypass } from "./proxy-lifecycle-3OdXp5Uu.mjs";
import { n as parsePackageOpenClawSchemaVersions, t as parseOpenClawSchemaVersions } from "./openclaw-schema-versions-PVhojTxP.mjs";
import { c as withOwnedManagedUpdateEnv, o as resolveUpdatedInstallCommandEnv, s as stripGatewayServiceMarkerEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { C as verifyPackageUpdateRecovery, o as canResolveRegistryVersionForPackageTarget } from "./update-runner-command-DJ8Zpaha.mjs";
import { t as readCurrentGitUpdateRecovery } from "./update-runner-git-recovery-BbC1zqVE.mjs";
import { t as resolveNodeRunner } from "./node-runner-Cua6MUxg.mjs";
import { a as parseUpdateDoctorLintReport, n as applyUpdateDoctorLintReport } from "./update-doctor-lint-BRvmoWQ9.mjs";
import { a as requiresRetainedUpdateCommandOwner, c as withUpdateCommandExecutorChild, d as UpdateCommandRecoveryPendingError, r as captureUpdateCommandExecutorAuthority } from "./update-command-executor-DDhDn9_F.mjs";
import { a as recordUpdatePackageCompletion } from "./update-command-terminal-BKnIanMQ.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { d as resolveGitInstallDir, n as UpdatePreMutationError, s as normalizeTag } from "./shared-Ca2ebFXK.mjs";
import { t as maybeRepairLegacyConfigForUpdateChannel } from "./update-command-config-_VhT8oD-.mjs";
import { c as resolveUpdateStateContentVersion, o as readUpdateStateSchemaVersions, u as updateStateSchemaVersionsMatch } from "./update-candidate-state-Cd-yslJu.mjs";
import { n as resolveUpdateDoctorExecutionPolicy } from "./update-runner-doctor-C5DUA3xw.mjs";
import { a as resumePostCoreUpdate, i as createUpdateCommandFinalizationFence, n as assertUpdateCommandRecovery, o as createUpdateTimeoutHandoff, r as assertUpdateCommandRecoveryState, t as finishUpdate } from "./update-command-post-update-BRQIG6Fs.mjs";
import { i as verifyPreviousManagedGatewayForUpdate, l as observeOriginalManagedServiceRuntime, p as isUpdatedInstallGatewayExecutorSupported, s as maybeRestartServiceAfterFailedMutableUpdate } from "./update-command-verification-DaTCD33B.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { t as UpdateSnapshotCapacityError } from "./update-snapshot-capacity-ChVb8DDY.mjs";
import { i as runPackageInstallUpdate, n as preparePackageDoctorContext } from "./update-command-package-DkD1M1ur.mjs";
import { i as parkForegroundUpdateForActivation, r as handoffUpdateFromGateway, t as formatUpdateAncestryBlockMessage } from "./update-command-handoff-DDmZ8LRL.mjs";
import { f as resolvePackageRuntimePreflight, n as GatewayServiceUpdateOwnershipError } from "./update-command-service-plan-B89pDfz8.mjs";
import { a as UpdateCommandAbort, i as shouldBlockMutableUpdateFromGatewayServiceEnv, r as maybeStopManagedServiceBeforeMutableUpdate, t as createWindowsTaskAutoStartGuard } from "./update-command-service-maintenance-DeciiZGR.mjs";
import { i as cleanupUpdateTemporaryDirectory, r as updateGitInstall } from "./update-command-git-CMCSyG9W.mjs";
import { _ as resolveMutableUpdateFailure, a as collectServiceInspectionFailureFacts, n as UpdateCommandFailure } from "./update-command-result-BL-5x2xq.mjs";
import "./update-command-service-DsNlwCK0.mjs";
import { a as revalidateUpdateDatabaseContext, i as readUpdateCandidateSource, n as captureOwnedManagedUpdateContext } from "./update-command-managed-context-C83YdWj9.mjs";
import { t as resolveUpdateFinalizationTimeoutMs } from "./update-finalization-budget-DpdskF7X.mjs";
import { n as revalidateUpdateDatabaseContexts, t as inspectUpdateDatabaseContexts } from "./update-command-database-context-szXsIfLy.mjs";
import { i as createPackageRuntimeRecovery, t as captureUpdateActivationSchemas } from "./update-command-schema-BfSsrLEA.mjs";
import { t as preflightConfiguredNpmPluginTargets } from "./update-command-plugin-preflight-BdgHxuUk.mjs";
import "./io.write-BBEEMbza.mjs";
import { t as prepareUpdateCandidateRehearsal } from "./update-candidate-rehearsal-Dj9xpghF.mjs";
import { isDeepStrictEqual, stripVTControlCharacters } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import JSON5 from "json5";
//#region src/infra/update-candidate-canary-process.ts
function launchCanary(params) {
	const { entry, args, env, capture } = params;
	params.assertCurrent?.();
	const child = spawn(params.nodeRunner ?? process.execPath, [entry, ...args], {
		cwd: params.root,
		env,
		detached: process.platform !== "win32",
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		windowsHide: true
	});
	let stdout = "";
	let firstStderrLine;
	let cliReason;
	const captureStderr = (line) => {
		if (!line.trim()) return;
		const safe = redactSupportDiagnosticLine(line, {
			env,
			stateDir: params.stateDir
		});
		firstStderrLine ??= safe;
		if (line.startsWith("[openclaw] Reason: ")) cliReason ??= safe.replace(/^\[openclaw\] Reason: /u, "");
	};
	let stdoutBytes = 0;
	let outputExceeded = false;
	const flushers = [child.stdout, child.stderr].map((stream) => {
		stream.setEncoding("utf8");
		let pending = "";
		let droppingLine = false;
		stream.on("data", (chunk) => {
			let text = chunk;
			if (droppingLine) {
				const newline = text.indexOf("\n");
				if (newline < 0) return;
				text = text.slice(newline + 1);
				droppingLine = false;
			}
			pending += text;
			const lines = pending.split(/\r?\n/u);
			pending = lines.pop() ?? "";
			for (const line of lines) {
				if (stream === child.stderr) captureStderr(line);
				capture(line);
				params.onLine?.(line);
			}
			if (pending.length > 65536) {
				pending = "";
				droppingLine = true;
				if (stream === child.stderr) firstStderrLine ??= "[oversized log line omitted]";
				capture("[oversized log line omitted]");
			}
		});
		return () => {
			if (pending) {
				if (stream === child.stderr) captureStderr(pending);
				capture(pending);
				params.onLine?.(pending);
				pending = "";
			}
		};
	});
	child.stdout.on("data", (chunk) => {
		stdoutBytes += Buffer.byteLength(chunk);
		if (stdoutBytes <= 1048576) {
			stdout += chunk;
			params.onStdout?.(stdout);
		} else outputExceeded = true;
	});
	let exited = false;
	let processExited = false;
	return {
		child,
		result: new Promise((resolve) => {
			child.once("exit", (code) => {
				processExited = true;
				if (code !== 0) resolve(code);
			});
			child.once("error", (error) => {
				captureStderr(error.message);
				capture(error.message);
				exited = true;
				resolve(null);
			});
			child.once("close", (code) => {
				for (const flush of flushers) flush();
				exited = true;
				resolve(code);
			});
		}),
		closed: new Promise((resolve) => {
			child.once("close", () => resolve());
		}),
		hasExited: () => exited,
		processExited: () => processExited,
		stdout: () => stdout,
		firstStderrLine: () => cliReason ?? firstStderrLine,
		outputExceeded: () => outputExceeded
	};
}
async function waitBounded(promise, milliseconds, signal) {
	let timer;
	let abort;
	try {
		return await Promise.race([promise.then((value) => ({
			status: "completed",
			value
		})), new Promise((resolve) => {
			timer = setTimeout(() => resolve({ status: "deadline" }), Math.max(0, milliseconds));
			abort = () => resolve({ status: "aborted" });
			signal?.addEventListener("abort", abort, { once: true });
			if (signal?.aborted) abort();
		})]);
	} finally {
		clearTimeout(timer);
		if (abort) signal?.removeEventListener("abort", abort);
	}
}
async function terminateCanary(child, closed, deadline) {
	if (!child.pid) return true;
	const options = { detached: process.platform !== "win32" };
	const signal = (kind) => new Promise((resolve) => {
		signalProcessTree(child.pid, kind, {
			...options,
			onComplete: resolve
		});
	});
	const term = signal("SIGTERM");
	await waitBounded(Promise.all([term, closed]), Math.min(1e3, Math.max(0, deadline - Date.now())));
	return (await waitBounded(Promise.all([
		term,
		signal("SIGKILL"),
		closed
	]), Math.min(1e3, Math.max(0, deadline - Date.now())))).status === "completed";
}
//#endregion
//#region src/infra/update-candidate-canary-readiness.ts
/** Poll candidate control-plane endpoints under the existing managed loopback policy. */
async function waitForUpdateCandidateReadiness(params) {
	const deadline = new AbortController();
	const cancelDeadline = scheduleAbsoluteDeadline(params.workDeadline, () => deadline.abort());
	const signal = AbortSignal.any([deadline.signal, ...params.signal ? [params.signal] : []]);
	const assertRunning = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		if (params.hasExited()) throw new Error(params.getExitReason() ?? "The updated Gateway exited before it was ready");
	};
	try {
		for (const endpoint of ["startupz", "readyz"]) {
			params.onEndpoint(endpoint);
			const url = `http://127.0.0.1:${params.port}/${endpoint}`;
			const releaseBypass = registerManagedProxyGatewayLoopbackBypass(url);
			const proxy = getActiveManagedProxyLoopbackMode() === "proxy" ? getActiveManagedProxyUrl() : void 0;
			let failure;
			try {
				while (true) {
					assertRunning();
					if (Date.now() >= params.workDeadline) {
						if (!failure) throw new Error("Update validation deadline exceeded");
						params.capture(failure.message);
						return failure;
					}
					let outcome = "";
					let ready = false;
					try {
						const response = await fetch(url, { signal });
						outcome = `HTTP ${response.status}`;
						if (response.status === 200) {
							const payload = await response.json();
							ready = endpoint === "readyz" || isRecord(payload) && payload.status === "started";
							outcome += " (startup response not ready within the validation budget)";
						} else await response.body?.cancel();
					} catch (error) {
						outcome = `${outcome ? `${outcome}: ` : ""}${formatErrorMessageWithCode(error)}`;
					}
					assertRunning();
					if (ready && Date.now() < params.workDeadline) {
						params.capture(`${endpoint}: ${endpoint === "startupz" ? "started" : "ready"} (${Date.now() - params.started}ms)`);
						break;
					}
					if (!deadline.signal.aborted || !failure) {
						const detail = redactSupportDiagnosticLine(outcome, params);
						const nextStep = "Check Gateway logs and proxy.loopbackMode; rerun openclaw update.";
						failure = {
							message: redactSupportString(`Readiness probe ${url} failed: ${detail}${proxy ? ` (via proxy ${proxy.origin})` : ""}. ${nextStep}`, params),
							fact: createUpdateFailureFact({
								check: endpoint,
								code: "candidate-readiness-probe-failed",
								message: `Readiness probe ${endpoint} failed: ${detail}. ${nextStep}`
							}, params.env)
						};
					}
					await setTimeout$1(Math.min(100, Math.max(1, params.workDeadline - Date.now())), void 0, { signal: params.signal });
				}
			} finally {
				releaseBypass?.();
			}
		}
		return;
	} finally {
		cancelDeadline();
	}
}
//#endregion
//#region src/infra/update-candidate-canary.ts
/** Rehearse the exact candidate against private SQLite snapshots while the serving generation stays up. */
async function validateUpdateCandidateCanary(params) {
	const started = Date.now();
	let rehearsal;
	const sourceEnv = params.env ?? process.env;
	const logTail = [];
	const stepLogTail = [];
	let activeStep = {
		name: "candidate-runtime",
		command: "Checking update runtime"
	};
	let stepStartedAt = started;
	let activeLintStep;
	const steps = [];
	const cleanupRehearsal = async () => {
		if (!rehearsal) return;
		for (const directory of rehearsal.cleanupDirectories) await cleanupUpdateTemporaryDirectory({
			directory,
			root: params.root,
			name: directory === rehearsal.stateDir ? "candidate-state-cleanup" : "candidate-plugin-inventory-cleanup",
			onWarning: (step) => {
				steps.push(step);
				params.onStep?.(step);
			}
		});
	};
	let candidateSchemaVersions;
	let gatewayRestartCompletion = false;
	let doctorConfigWrites = false;
	let doctorConfigChanges = [];
	let listenerIsolation;
	let phase = "runtime";
	let env = { ...sourceEnv };
	const capture = (chunk) => {
		const safe = redactSupportString(String(chunk), {
			env,
			stateDir: params.stateDir
		}, { maxLength: 2e4 });
		const lines = safe.split(/\r?\n/u).filter(Boolean).map((line) => line.slice(-512));
		for (const tail of [logTail, stepLogTail]) {
			tail.push(...lines);
			tail.splice(0, Math.max(0, tail.length - 40));
		}
		return safe;
	};
	const launch = (entry, args, observers = {}) => launchCanary({
		...observers,
		entry,
		args,
		root: params.root,
		env,
		nodeRunner: params.nodeRunner,
		stateDir: params.stateDir,
		assertCurrent: params.assertCurrent,
		capture
	});
	const stopCanary = async (running, name, deadline) => {
		const cleanupStarted = Date.now();
		if (await terminateCanary(running.child, running.closed, deadline)) return true;
		const step = {
			name: `${name}-cleanup`,
			command: "SIGTERM, SIGKILL",
			cwd: params.root,
			durationMs: Date.now() - cleanupStarted,
			exitCode: null,
			advisory: {
				kind: "recoverable-maintenance",
				message: "Update cleanup deadline elapsed before process close and termination requests both completed. Update validation results are unchanged."
			}
		};
		steps.push(step);
		params.onStep?.(step);
		return false;
	};
	try {
		const entry = await resolveGatewayInstallEntrypoint(params.root);
		if (!entry) throw new Error("The update is missing its Gateway executable");
		const continuationEntry = path.join(params.root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath);
		try {
			await fs.lstat(continuationEntry);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
			const message = "This version uses the current updater to finish installation";
			const step = {
				name: "candidate-recovery",
				command: "--check",
				cwd: params.root,
				durationMs: Date.now() - started,
				exitCode: null,
				stdoutTail: message,
				advisory: {
					kind: "candidate-runtime-unavailable",
					message
				}
			};
			steps.push(step);
			params.onStep?.(step);
			return {
				status: "ok",
				phase,
				durationMs: Date.now() - started,
				logTail,
				steps
			};
		}
		if (!resolveUpdateDoctorExecutionPolicy({
			targetVersion: await readPackageVersion(params.root),
			allowGatewayServiceRepair: false
		}).fix) throw new Error("Cannot check migrations without changing the running service");
		phase = "snapshot";
		activeStep = {
			name: "candidate-state-snapshot",
			command: "Preparing update checks"
		};
		stepStartedAt = Date.now();
		rehearsal = await prepareUpdateCandidateRehearsal({
			candidateRoot: params.root,
			config: params.config,
			stateDir: params.stateDir,
			env: sourceEnv,
			nodeRunner: params.nodeRunner,
			timeoutMs: params.timeoutMs,
			signal: params.signal
		});
		const snapshotDuration = Date.now() - stepStartedAt;
		const snapshotStep = {
			...activeStep,
			cwd: params.root,
			durationMs: snapshotDuration,
			exitCode: 0,
			snapshotCapacity: rehearsal.snapshotCapacity
		};
		steps.push(snapshotStep);
		params.onStep?.(snapshotStep);
		env = { ...rehearsal.env };
		const { port, stateDir: copiedStateDir } = rehearsal;
		const doctorResultOptions = { tmpdir: () => copiedStateDir };
		listenerIsolation = {
			gateway: {
				host: "127.0.0.1",
				port
			},
			mcpAppSandbox: "disabled"
		};
		const commands = [
			{
				phase: "doctor",
				name: "candidate-doctor",
				args: [
					"doctor",
					"--fix",
					"--non-interactive",
					"--no-workspace-suggestions"
				]
			},
			{
				phase: "lint",
				name: "candidate-doctor-lint",
				args: [
					"doctor",
					"--lint",
					"--json",
					"--severity-min",
					"error"
				]
			},
			{
				phase: "config",
				name: "candidate-config",
				args: [
					"config",
					"validate",
					"--json"
				]
			},
			{
				phase: "plugins",
				name: "candidate-plugins",
				args: [
					"plugins",
					"list",
					"--json"
				]
			},
			{
				phase: "runtime",
				name: "candidate-recovery",
				entry: continuationEntry,
				args: ["--check"]
			}
		];
		const processBudget = resolveSqliteInspectionBudget("update validation", copiedStateDir, rehearsal.snapshotCapacity.sqliteBytes + (rehearsal.snapshotCapacity.pluginBytes ?? 0)).timeoutMs;
		const budget = Math.max(1, params.timeoutMs ?? processBudget);
		let deadline = 0;
		let workDeadline = 0;
		const startBudget = () => {
			deadline = Date.now() + budget;
			workDeadline = deadline - Math.min(2e3, Math.floor(budget / 10));
		};
		const remaining = () => {
			params.signal?.throwIfAborted();
			params.assertCurrent?.();
			const milliseconds = workDeadline - Date.now();
			if (milliseconds <= 0) throw new Error("Update validation deadline exceeded");
			return milliseconds;
		};
		for (const command of commands) {
			phase = command.phase;
			activeLintStep = void 0;
			env.OPENCLAW_UPDATE_IN_PROGRESS = phase === "doctor" ? "1" : "0";
			activeStep = {
				name: command.name,
				command: command.args.join(" ")
			};
			stepStartedAt = Date.now();
			stepLogTail.length = 0;
			startBudget();
			remaining();
			const doctorResultPath = phase === "doctor" ? createUpdatePostInstallDoctorResultPath(doctorResultOptions) : void 0;
			env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV] = doctorResultPath;
			const configBeforeDoctor = doctorResultPath ? JSON5.parse(await fs.readFile(rehearsal.configPath, "utf8")) : void 0;
			let checksCompletedAt;
			const disposalWarnings = [];
			const running = launch(command.entry ?? entry, command.args, {
				onLine: (line) => {
					const plain = stripVTControlCharacters(line).trim();
					if (phase === "lint" && plain.startsWith("[warning] Doctor disposal")) disposalWarnings.push(redactSupportString(plain, {
						env,
						stateDir: params.stateDir
					}));
					if (phase === "doctor" && /^(?:└\s*)?Doctor complete\.$/u.test(plain)) checksCompletedAt ??= Date.now();
				},
				onStdout: (stdout) => {
					if (phase === "lint") try {
						parseUpdateDoctorLintReport(stdout);
						checksCompletedAt ??= Date.now();
					} catch {
						checksCompletedAt = void 0;
					}
				}
			});
			let code = null;
			let doctorAdvisory;
			let doctorReceipt = null;
			const pluginFailures = [];
			const pluginObservations = [];
			let timedOut = false;
			let timeoutMessage;
			let exitWarning;
			try {
				const outcome = await waitBounded(running.result, remaining(), params.signal);
				code = outcome.status === "completed" ? outcome.value : 1;
				timedOut = outcome.status === "deadline";
				if (timedOut) {
					const elapsed = Date.now() - stepStartedAt;
					const lintReport = phase === "lint" && checksCompletedAt !== void 0 && !running.outputExceeded() ? parseUpdateDoctorLintReport(running.stdout(), env) : void 0;
					const completed = checksCompletedAt !== void 0 && (phase === "doctor" || lintReport);
					timeoutMessage = `Update ${phase} checks phase timed out (${elapsed}ms)`;
					if (completed && checksCompletedAt !== void 0) {
						exitWarning = `Update ${phase} exit phase timed out after ${Date.now() - checksCompletedAt}ms (${elapsed}ms total); checks completed; ${running.processExited() ? "output pipes stayed open" : "process did not exit"}. Continuing with recorded check results.`;
						code = phase === "doctor" || lintReport && (lintReport.ok || lintReport.advisoryOnly) && !lintReport.failureFacts.length ? 0 : 1;
					}
				}
			} finally {
				await stopCanary(running, command.name, deadline);
				if (doctorResultPath) {
					doctorReceipt = await consumeUpdatePostInstallDoctorResult(doctorResultPath, doctorResultOptions);
					if (doctorReceipt?.status === "error") code = 1;
					doctorConfigChanges = doctorReceipt?.configChanges ?? [];
					if (!doctorReceipt?.configChanges && isRecord(configBeforeDoctor)) {
						const after = JSON5.parse(await fs.readFile(rehearsal.configPath, "utf8"));
						if (isRecord(after)) doctorConfigChanges = [.../* @__PURE__ */ new Set([...Object.keys(configBeforeDoctor), ...Object.keys(after)])].filter((key) => !isDeepStrictEqual(configBeforeDoctor[key], after[key])).toSorted().map((key) => ({
							kind: "key",
							key
						}));
					}
					if (code === 86 && doctorReceipt?.status === "advisory") doctorAdvisory = {
						kind: "recoverable-maintenance",
						message: doctorReceipt.advisory.details.join("\n")
					};
				}
			}
			activeLintStep = phase === "lint" ? {
				...activeStep,
				cwd: params.root,
				durationMs: Date.now() - stepStartedAt,
				exitCode: running.child.exitCode,
				signal: running.child.signalCode,
				killed: running.child.killed,
				termination: timedOut ? "timeout" : running.child.signalCode ? "signal" : "exit",
				outputLimitExceeded: running.outputExceeded(),
				doctorLintFindings: []
			} : void 0;
			params.signal?.throwIfAborted();
			const lintReport = activeLintStep ? applyUpdateDoctorLintReport(activeLintStep, running.stdout(), code, env) : void 0;
			doctorAdvisory ??= activeLintStep?.advisory;
			if (code === 0 && phase === "plugins") {
				const fail = (message) => {
					code = 1;
					capture(message);
					if (pluginFailures.length < 5) {
						const fact = {
							check: "plugins",
							code: "candidate-plugins-failed",
							message
						};
						pluginFailures.push(createUpdateFailureFact(fact, env));
					}
				};
				const inventory = running.outputExceeded() ? void 0 : JSON.parse(running.stdout());
				const plugins = isRecord(inventory) && Array.isArray(inventory.plugins) ? inventory.plugins : void 0;
				const registry = isRecord(inventory) && isRecord(inventory.registry) ? inventory.registry : void 0;
				const diagnostics = [...isRecord(inventory) && Array.isArray(inventory.diagnostics) ? inventory.diagnostics : [], ...Array.isArray(registry?.diagnostics) ? registry.diagnostics : []];
				const failedPluginIds = /* @__PURE__ */ new Set();
				if (!plugins || plugins.some((plugin) => !isRecord(plugin) || typeof plugin.id !== "string")) fail("Plugin checks returned an invalid inventory");
				else {
					for (const plugin of plugins) if (isRecord(plugin) && plugin.status === "error" && typeof plugin.id === "string") failedPluginIds.add(plugin.id);
					for (const diagnostic of diagnostics) if (isRecord(diagnostic) && diagnostic.level === "error") {
						if (typeof diagnostic.pluginId !== "string") fail(typeof diagnostic.message === "string" ? diagnostic.message : "Plugin registry reported an unattributed error");
						else failedPluginIds.add(diagnostic.pluginId);
					}
					for (const pluginId of failedPluginIds) {
						const message = `Plugin "${pluginId}" could not be loaded during the update preview.`;
						pluginObservations.push(message);
						capture(message);
					}
				}
			}
			if (code === 0 && phase === "runtime") {
				const contract = running.outputExceeded() ? void 0 : JSON.parse(running.stdout());
				candidateSchemaVersions = parseOpenClawSchemaVersions(contract);
				gatewayRestartCompletion = isRecord(contract) && contract.gatewayRestartCompletion === true;
				doctorConfigWrites = isRecord(contract) && contract.doctorConfigWrites === "pid-start-v1";
				if (!candidateSchemaVersions) {
					code = 1;
					capture("The update did not report its supported database versions");
				}
			}
			const step = activeLintStep ?? {
				...activeStep,
				cwd: params.root,
				durationMs: Date.now() - stepStartedAt,
				exitCode: timedOut ? null : code,
				...timedOut ? { termination: "timeout" } : {}
			};
			if (doctorAdvisory) step.advisory = doctorAdvisory;
			else if (exitWarning && code === 0) step.advisory = {
				kind: "recoverable-maintenance",
				message: exitWarning
			};
			const lintWarnings = [...disposalWarnings, ...exitWarning ? [exitWarning] : []];
			if (lintWarnings.length) step.warnings = [...step.warnings ?? [], ...lintWarnings];
			if (code === 0 && pluginObservations.length > 0) step.stdoutTail = pluginObservations.join("\n");
			const failureMessage = timeoutMessage && !exitWarning ? timeoutMessage : `Update ${phase === "lint" ? "health check" : phase} failed`;
			if (code !== 0 && !doctorAdvisory) {
				let findings = doctorReceipt?.status === "error" ? doctorReceipt.failureFacts : pluginFailures;
				if (!findings?.length && lintReport) findings = lintReport.failureFacts;
				if (!findings?.length && phase === "config" && !running.outputExceeded()) findings = parseConfigFailureFacts(running.stdout(), env);
				step.failureFacts = findings?.length ? findings : [createUpdateFailureFact({
					check: phase,
					code: timedOut && !exitWarning ? "candidate-checks-timeout" : phase === "doctor" || phase === "lint" ? "doctor-failed" : `candidate-${phase}-failed`,
					message: timedOut ? failureMessage : running.firstStderrLine() ?? failureMessage
				}, env)];
			}
			steps.push(step);
			if (code !== 0 && !doctorAdvisory) throw new Error(failureMessage);
			params.onStep?.(step);
		}
		if (!candidateSchemaVersions) throw new Error("The update did not report its supported database versions");
		phase = "startup";
		activeStep = {
			name: "candidate-gateway-startup",
			command: "gateway run"
		};
		stepStartedAt = Date.now();
		stepLogTail.length = 0;
		startBudget();
		remaining();
		const running = launch(entry, [
			...[
				"gateway",
				"run",
				"--update-canary",
				"--bind",
				"loopback"
			],
			"--port",
			String(port)
		]);
		try {
			const probeFailure = await waitForUpdateCandidateReadiness({
				port,
				workDeadline,
				started,
				signal: params.signal,
				assertCurrent: params.assertCurrent,
				hasExited: running.hasExited,
				getExitReason: running.firstStderrLine,
				env,
				stateDir: params.stateDir,
				onEndpoint: (endpoint) => {
					phase = endpoint === "startupz" ? "startup" : "readiness";
				},
				capture
			});
			if (probeFailure) capture("Update checks reached their time limit; Gateway readiness remains unverified.");
			const step = {
				...activeStep,
				cwd: params.root,
				durationMs: Date.now() - stepStartedAt,
				exitCode: probeFailure ? null : 0,
				...probeFailure ? {
					advisory: {
						kind: "candidate-runtime-unavailable",
						message: probeFailure.message
					},
					failureFacts: [probeFailure.fact]
				} : {}
			};
			steps.push(step);
			params.onStep?.(step);
		} finally {
			await stopCanary(running, "candidate-gateway-startup", deadline);
		}
		return {
			status: "ok",
			phase,
			durationMs: Date.now() - started,
			logTail,
			candidateSchemaVersions,
			gatewayRestartCompletion,
			...doctorConfigWrites ? { doctorConfigWrites } : {},
			...doctorConfigChanges.length ? { doctorConfigChanges } : {},
			listenerIsolation,
			steps
		};
	} catch (error) {
		const durationMs = Date.now() - stepStartedAt;
		const displayPhase = phase === "lint" ? "health" : phase;
		const failureLine = capture(`${displayPhase}: ${error instanceof Error ? error.message : String(error)} (${durationMs}ms)`);
		let failed = steps.at(-1);
		if (!failed || failed.exitCode === 0 && failed !== activeLintStep || failed.advisory) {
			failed = activeLintStep ?? {
				...activeStep,
				cwd: params.root,
				durationMs: Date.now() - stepStartedAt,
				exitCode: 1
			};
			steps.push(failed);
		}
		if (error instanceof UpdateSnapshotCapacityError) failed.snapshotCapacity = error.capacity;
		failed.failureFacts ??= [createUpdateFailureFact({
			check: phase === "readiness" ? "readyz" : phase === "startup" ? "startupz" : phase,
			code: phase === "doctor" || phase === "lint" ? "doctor-failed" : `candidate-${phase}-failed`,
			message: error instanceof Error ? error.message : String(error)
		}, env)];
		const repeatsFact = failed.termination !== "timeout" && failed.failureFacts.some((fact) => failureLine === `${displayPhase}: ${fact.message} (${durationMs}ms)`);
		failed.stderrTail = stepLogTail.slice(0, repeatsFact ? -1 : void 0).join("\n");
		params.onStep?.(failed);
		return {
			status: "error",
			reason: failed.failureFacts.some((fact) => fact.code === "candidate-checks-timeout") ? "candidate-checks-timeout" : phase === "doctor" || phase === "lint" ? "doctor-failed" : "runtime-verification-failed",
			phase,
			durationMs: Date.now() - started,
			logTail,
			candidateSchemaVersions,
			gatewayRestartCompletion,
			...doctorConfigChanges.length ? { doctorConfigChanges } : {},
			listenerIsolation,
			steps
		};
	} finally {
		await cleanupRehearsal();
	}
}
//#endregion
//#region src/cli/update-cli/update-command-execution-guards.ts
/** Pin the invocation across parent work and the separately bound Doctor child. */
function createUpdateCommandExecutionGuards(opts, root) {
	const run = opts.run;
	const runId = run?.runId;
	let executor = run?.executorFence;
	const requester = run?.requesterAuthority;
	let stateHandedOff = false;
	const assertInvocation = () => {
		if (opts.recovery || !stateHandedOff) assertUpdateCommandRecoveryState(opts);
		if (opts.run !== run || run?.runId !== runId || run?.executorFence !== executor || run?.requesterAuthority !== requester || !stateHandedOff && requester?.isCurrent() === false) throw new UpdateRequesterRevokedError();
	};
	return {
		onStateHandoff: () => {
			stateHandedOff = true;
		},
		admitExecutor: (acquired) => {
			assertInvocation();
			if (!run || executor && acquired !== executor) throw new UpdateRequesterRevokedError();
			if (captureUpdateCommandExecutorAuthority(acquired, run.runId).installKey !== resolveUpdateInstallRoot(root)) throw new UpdateRequesterRevokedError();
			assertUpdateCommandRecoveryState(opts);
			run.executorFence = acquired;
			executor = acquired;
		},
		assertCurrent: () => {
			assertInvocation();
			executor?.assertCurrent();
		},
		assertBoundChildCurrent: assertInvocation
	};
}
//#endregion
//#region src/cli/update-cli/update-command-git-admission.ts
function recordInspectedGitTarget(run, target, assertCurrent) {
	assertCurrent();
	if (run) recordUpdateRunPhase(run.runId, "staging", { target: {
		kind: "git",
		sha: target.sha,
		version: target.version
	} }, { env: run.env });
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
	const inspectContexts = (roots) => inspectUpdateDatabaseContexts({
		...params,
		roots,
		expectedForeground: opts.run?.completionOwner === "gateway-restart" || void 0,
		updateInstallKind: params.updateInstallKind === "git" ? "git" : "package",
		jsonMode: Boolean(opts.json),
		timeoutMs: updateStepTimeoutMs
	});
	const originalRun = opts.run;
	const requesterAuthority = originalRun?.requesterAuthority;
	const { assertCurrent: assertExecutionCurrent, assertBoundChildCurrent, onStateHandoff, admitExecutor } = createUpdateCommandExecutionGuards(opts, params.root);
	const prepareMutableUpdate = async (env, activationTimeoutMs) => {
		assertExecutionCurrent();
		await params.prepareMutableUpdate(env, activationTimeoutMs, admitExecutor);
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
			...params,
			updateInstallKind: params.updateInstallKind === "git" ? "git" : "package",
			jsonMode: Boolean(opts.json),
			timeoutMs: updateStepTimeoutMs
		}, admission, versions);
		admittedTargetSchemaVersions = versions;
	};
	const preflightPlugins = async (targetVersion) => {
		await recheckSchemas(admittedTargetSchemaVersions);
		const { preflightConfiguredNpmPluginTargets } = await import("./update-command-plugin-preflight-DzRt-ujV.mjs");
		const context = admission.foreground ? admission.contexts[0] : admission.contexts.at(-1);
		const warnings = await preflightConfiguredNpmPluginTargets({
			config: context.configSnapshot.sourceConfig,
			env: context.env,
			targetVersion,
			channel: params.channel,
			timeoutMs: params.updateStepTimeoutMs
		});
		await recheckSchemas(admittedTargetSchemaVersions);
		for (const warning of warnings) defaultRuntime[opts.json ? "error" : "log"](warning.message);
	};
	let recoveryEnv;
	let packageTransaction;
	const onTransaction = (transaction) => {
		packageTransaction = transaction;
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
	const doctorConfigChanges = [];
	let validatedConfigSnapshot;
	const getDoctorContext = () => preparePackageDoctorContext({
		capable: doctorConfigWrites,
		runId: originalRun?.runId,
		executorFence: originalRun?.executorFence,
		requester: requesterAuthority?.requester,
		inputHash: validatedConfigSnapshot?.hash,
		changes: doctorConfigChanges,
		assertCurrent: assertExecutionCurrent,
		assertBoundChildCurrent,
		onStateHandoff
	});
	const originalRecovery = () => params.installKind === "git" ? readCurrentGitUpdateRecovery(params.root, updateStepTimeoutMs) : verifyPackageUpdateRecovery(params.root);
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
					updateRun: opts.run,
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
				if (preManagedServiceStop.stopped || preManagedServiceStop.serviceUpdateVerdict?.kind === "owned" || preManagedServiceStop.blockMessage || shouldBlockMutableUpdateFromGatewayServiceEnv({ preManagedServiceStop }) || !preManagedServiceStop.inspected || !preManagedServiceStop.running || !params.shouldRestart) break;
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
		const inspectionFailure = { failureFacts: collectServiceInspectionFailureFacts(preManagedServiceStop?.serviceUpdateVerdict) };
		if (shouldBlockMutableUpdateFromGatewayServiceEnv({ preManagedServiceStop })) {
			params.stop();
			throw new UpdatePreMutationError("managed-service-preflight", [
				`${params.updateInstallKind === "git" ? "Git updates" : "Package updates"} cannot run from inside the gateway service process.`,
				"That path replaces the active OpenClaw dist tree while the live gateway may still lazy-load old chunks.",
				`Run \`${formatCliCommand("openclaw update")}\` from a terminal outside the gateway service.`
			].join("\n"), inspectionFailure);
		}
		if (preManagedServiceStop?.blockMessage) {
			params.stop();
			throw new UpdatePreMutationError("managed-service-preflight", formatUpdateAncestryBlockMessage(preManagedServiceStop.blockMessage), inspectionFailure);
		}
	};
	let result;
	let failure;
	let mutationStarted = false;
	const validateCandidate = async (root) => {
		assertUpdateCommandRecovery(opts);
		const env = ownedManagedUpdateContext?.env ?? opts.run?.env ?? process.env;
		if (opts.run) recordUpdateRunPhase(opts.run.runId, "validating", void 0, { env: opts.run.env });
		const validate = async () => {
			try {
				if (params.updateInstallKind === "package") await recheckSchemas(parsePackageOpenClawSchemaVersions(await tryReadJson(path.join(root, "package.json"))) ?? admittedTargetSchemaVersions);
				if (stagedPluginAdmission) {
					await preflightPlugins(await readPackageVersion(root));
					await prepareMutableUpdate(ownedManagedUpdateContext?.env ?? admission?.managedEnv);
				}
			} catch (error) {
				if (error instanceof UpdatePreMutationError) candidateFailureReason = error.reason;
				throw error;
			}
			if (params.shouldRestart && opts.run && preManagedServiceStop?.serviceUpdateVerdict?.kind === "owned") {
				const executor = opts.run.executorFence;
				if (!executor) throw new UpdatePreMutationError("target-native-unsupported", "Starting the update requires its original update process.");
				const supported = await isUpdatedInstallGatewayExecutorSupported({
					root,
					env: resolveUpdatedInstallCommandEnv({
						processEnv: env,
						invocationCwd: params.invocationCwd
					}),
					executor,
					timeoutMs: updateStepTimeoutMs,
					nodeRunner: params.packageUpdateNodeRunner
				});
				assertExecutionCurrent();
				if (!supported) {
					candidateFailureReason = "target-native-unsupported";
					throw new UpdatePreMutationError(candidateFailureReason, "Target runtime cannot fence update-owned native commands; refusing before Gateway stop or package activation.");
				}
			}
			const snapshot = validatedConfigSnapshot ?? await readUpdateCandidateSource(env, params.legacyConfigPlan);
			const validation = await validateUpdateCandidateCanary({
				root,
				config: snapshot.config,
				stateDir: resolveStateDir(env),
				env,
				assertCurrent: assertExecutionCurrent,
				nodeRunner: params.packageUpdateNodeRunner,
				timeoutMs: params.timeoutMs,
				onStep: (step) => params.progress?.onStepComplete?.({
					...step,
					index: 0,
					total: 0
				})
			});
			assertExecutionCurrent();
			doctorConfigChanges.push(...validation.doctorConfigChanges ?? []);
			if (validation.status === "ok") {
				validatedConfigSnapshot = snapshot;
				candidateSchemaVersions = validation.candidateSchemaVersions;
				gatewayRestartCompletion = validation.gatewayRestartCompletion === true;
				doctorConfigWrites = validation.doctorConfigWrites === true;
				observedGatewayStartupMs = validation.steps.find((step) => step.name === "candidate-gateway-startup" && step.exitCode === 0)?.durationMs;
			}
			return validation;
		};
		const validation = await validate();
		candidateFailureReason = validation.status === "error" ? validation.reason : void 0;
		if (validation.status === "ok" && !doctorConfigWrites && doctorConfigChanges.length) {
			const warning = createUpdateDoctorConfigWarningStep(root, doctorConfigChanges);
			validation.steps.push(warning);
			params.progress?.onStepComplete?.({
				...warning,
				index: 0,
				total: 0
			});
		}
		return validation.steps;
	};
	const beforeActivate = async (roots = [params.root]) => {
		assertExecutionCurrent();
		const env = ownedManagedUpdateContext?.env ?? opts.run?.env ?? process.env;
		const snapshot = await readUpdateCandidateSource(env, params.legacyConfigPlan);
		if (validatedConfigSnapshot?.hash !== void 0 && snapshot.hash !== validatedConfigSnapshot.hash) throw new UpdatePreMutationError("invalid-config", "Config changed during update checks; rerun the update before activating.");
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
		if (preManagedServiceStop?.running && preManagedServiceStop.serviceUpdateVerdict?.kind === "owned") await verifyPreviousManagedGatewayForUpdate({
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
		originalManagedServiceRuntime = params.shouldRestart ? await observeOriginalManagedServiceRuntime(params, preManagedServiceStop) : void 0;
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
		if (opts.run) recordUpdateRunPhase(opts.run.runId, "activating", void 0, { env: opts.run.env });
		await stopManagedServiceBeforeMutableUpdate(roots);
		await recheckSchemas(admittedTargetSchemaVersions);
		assertExecutionCurrent();
		preManagedServiceStop?.windowsTaskAutoStartRecovery?.beginMutation();
		mutationStarted = true;
		params.onActivation?.();
	};
	try {
		if (params.updateInstallKind === "package" || params.updateInstallKind === "git") admission = await inspectContexts(gitMutationRoots ?? [params.root]);
		if (params.updateInstallKind === "package") {
			if (!stagedPluginAdmission) await preflightPlugins(params.packageTargetVersion ?? null);
			await stopManagedServiceBeforeMutableUpdate(void 0, "inspect");
			if (!stagedPluginAdmission) await prepareMutableUpdate(admission?.managedEnv);
			const packageUpdate = {
				requirePackageReplacement: params.managedServiceRoot !== void 0,
				reapplyLocalOverrides: opts.reapplyLocalOverrides,
				root: params.root,
				installKind: params.installKind,
				tag: params.tag,
				installSpec: params.packageInstallSpec ?? void 0,
				timeoutMs: updateStepTimeoutMs,
				startedAt: params.startedAt,
				progress: params.progress,
				invocationCwd: params.invocationCwd,
				honorPackageRoot: params.managedServiceRootRedirect !== null || params.managedServiceRoot !== void 0 || params.managedServiceNodeRunner !== void 0,
				nodeRunner: params.packageUpdateNodeRunner,
				installEnv: params.packageInstallEnv,
				installTarget: params.packageInstallTarget,
				validateCandidate,
				beforeActivate,
				assertCurrent: assertExecutionCurrent,
				managedServiceEnv: preManagedServiceStop?.serviceEnv,
				onTransaction,
				onConfigSnapshot,
				getDoctorContext
			};
			await recheckSchemas(params.packageTargetSchemaVersions);
			result = params.stagedPackage ? await params.stagedPackage.run(packageUpdate) : await runPackageInstallUpdate(packageUpdate);
		} else result = await updateGitInstall({
			root: params.root,
			switchToGit: params.switchToGit,
			installKind: params.installKind,
			timeoutMs: params.timeoutMs,
			startedAt: params.startedAt,
			progress: params.progress,
			channel: params.channel,
			devTarget: params.devTarget,
			assertCurrent: assertExecutionCurrent,
			inspectGitTarget: async (target) => {
				recordInspectedGitTarget(opts.run, target, assertExecutionCurrent);
				await recheckSchemas(target.schemaVersions);
				if (!gitContextPrepared) {
					await stopManagedServiceBeforeMutableUpdate(gitMutationRoots ?? void 0, "inspect");
					await prepareMutableUpdate(admission?.managedEnv);
					gitContextPrepared = true;
				}
			},
			onTransaction,
			onConfigSnapshot,
			getDoctorContext,
			getManagedServiceEnv: () => ownedManagedUpdateContext?.env,
			getSnapshotSource: async () => {
				const env = ownedManagedUpdateContext?.env ?? admission?.managedEnv ?? opts.run?.env ?? process.env;
				return {
					config: (await readUpdateCandidateSource(env, params.legacyConfigPlan)).config,
					env
				};
			},
			jsonMode: Boolean(opts.json),
			invocationCwd: params.invocationCwd,
			nodeRunner: params.packageUpdateNodeRunner,
			validateCandidate: async (candidateRoot) => {
				const failed = (await validateCandidate(candidateRoot)).find(isFailedUpdateStep);
				if (failed) throw new UpdatePreMutationError(failed.name, failed.stderrTail ?? "Update checks failed.", { failureFacts: failed.failureFacts });
			},
			beforeGitMutation: async (target) => {
				assertReadableGitTarget(target);
				admittedTargetSchemaVersions = target.schemaVersions;
				await beforeActivate(gitMutationRoots ?? [params.root]);
			}
		});
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
	return {
		result,
		failure,
		mutationStarted,
		preManagedServiceStop,
		ownedManagedUpdateContext,
		recoveryEnv,
		packageTransaction,
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
		const context = admission.foreground ? admission.contexts[0] : admission.contexts.at(-1);
		const pluginWarnings = await preflightConfiguredNpmPluginTargets({
			config: context.configSnapshot.sourceConfig,
			env: context.env,
			targetVersion: result.after.version,
			channel: params.channel,
			timeoutMs: params.updateStepTimeoutMs
		});
		for (const warning of pluginWarnings) if (params.opts.json) defaultRuntime.error(warning.message);
		else defaultRuntime.log(warning.message);
		await inspectUpdateDatabaseContexts({
			...inspection,
			expectedServices: admission.services,
			expectedForeground: admission.foreground
		});
		await Promise.all(admission.contexts.map(revalidateUpdateDatabaseContext));
		let stopState;
		try {
			stopState = admission.foreground ? void 0 : await maybeStopManagedServiceBeforeMutableUpdate({
				...inspection,
				root: params.managedServiceRoot ?? params.root,
				handoffRoot: params.managedServiceRoot ? params.root : void 0,
				phase: "inspect",
				expectedService: admission.services.get(params.managedServiceRoot ?? params.root),
				updateRun: params.opts.run,
				handoffFromGateway: (state) => handoffUpdateFromGateway({
					state,
					root: params.root,
					mode: params.result.mode,
					opts: params.opts,
					tag: params.channel === "extended-stable" ? void 0 : params.packageInstallSpec && !canResolveRegistryVersionForPackageTarget(params.packageInstallSpec) ? params.packageInstallSpec : result.after.version ?? void 0,
					timeoutMs: params.updateStepTimeoutMs,
					nodeRunner: packageUpdateNodeRunner,
					invocationCwd: params.invocationCwd,
					stopProgress: params.stop
				})
			});
		} catch (error) {
			if (error instanceof UpdateCommandAbort) return;
			throw error;
		}
		if (process.platform === "linux" && stopState?.serviceUpdateVerdict?.kind === "owned" && !stopState.blockMessage) stopState = await maybeStopManagedServiceBeforeMutableUpdate({
			...inspection,
			root: params.managedServiceRoot ?? params.root,
			handoffRoot: params.managedServiceRoot ? params.root : void 0,
			phase: "refresh",
			expectedService: stopState,
			updateRun: params.opts.run
		});
		if (stopState && (stopState.blockMessage || shouldBlockMutableUpdateFromGatewayServiceEnv({ preManagedServiceStop: stopState }))) throw new UpdatePreMutationError("managed-service-preflight", formatUpdateAncestryBlockMessage(stopState.blockMessage ?? "Run openclaw update from a terminal outside the Gateway service before changing installed plugins."), { failureFacts: collectServiceInspectionFailureFacts(stopState.serviceUpdateVerdict) });
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
		const plan = params.legacyConfigPlan?.snapshot.path === configSnapshot.path ? params.legacyConfigPlan : void 0;
		const storedChannel = normalizeUpdateChannel((plan?.config ?? configSnapshot.config).update?.channel);
		const beforeRepair = configSnapshot;
		if (params.opts.channel && plan) configSnapshot = await withOwnedManagedUpdateEnv(env, () => withPluginLifecycleLease({}, () => maybeRepairLegacyConfigForUpdateChannel({
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
		if (result.status === "ok" && candidateSchemaVersions && sharedVersion !== candidateSchemaVersions.state) {
			result.status = "error";
			result.reason = `${CLI_NAME} doctor`;
			result.steps.push({
				name: `${CLI_NAME} doctor`,
				command: `${CLI_NAME} doctor --fix`,
				cwd: result.root ?? root,
				durationMs: 0,
				exitCode: 1,
				stderrTail: `Shared state migration did not finish: expected schema ${candidateSchemaVersions.state}, found ${sharedVersion ?? "missing"}.`
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
		const { packageTransaction: _transaction, preManagedServiceStop, ...serializable } = params;
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
		const { requesterAuthority, executorFence, ...runIdentity } = run;
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
		const child = executorFence ? await withUpdateCommandExecutorChild(executorFence, root, runChild) : await runChild();
		if (child.stdout) process.stdout.write(child.stdout);
		if (child.stderr) process.stderr.write(child.stderr);
		const response = JSON.parse(await fs.readFile(resultPath, "utf8"));
		if (child.termination !== "exit" || child.code !== 0 || child.cleanup !== "normal" || executorFence && response.executorDelegation !== "pid-start-v1" || response.terminalRunId !== run.runId && !(run.completionOwner === "gateway-restart" && run.gatewayRestartRequired === true && response.restartRunId === run.runId && response.result.status === "ok") || response.result.runId !== run.runId || !Number.isInteger(response.exitCode)) throw new Error("Update finalization did not confirm the admitted run's terminal outcome.");
		try {
			await windowsRecovery?.complete(response.result.status === "ok" || isUpdateGatewayReadinessPending(response.result));
		} catch (cause) {
			throw new UpdateCommandFailure(response.result, response.exitCode || 1, `${response.result.reason ?? "Update failed"}; Windows task autostart compensation failed: ${formatErrorMessage(cause)}`, { cause });
		}
		const cleanupFailure = await recordUpdatePackageCompletion(params, response.result, assertCurrent);
		if (cleanupFailure) throw cleanupFailure;
		return {
			result: response.result,
			exitCode: response.exitCode,
			automaticTriage: response.automaticTriage
		};
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
export { continueMigratedUpdateInFreshProcess, executeMutableUpdate, finishAlreadyCurrentUpdate, finishUpdate, inspectActivatedUpdateState, resumePostCoreUpdate };
