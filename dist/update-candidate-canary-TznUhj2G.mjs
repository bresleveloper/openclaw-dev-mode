import { d as toErrorObject, n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { n as UPDATE_CANARY_PROGRESS_PREFIX, r as isUpdateCanaryStartupMilestone, t as UPDATE_CANARY_PROGRESS_ARGS } from "./update-candidate-canary-progress-YZ66-D3c.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { s as resolveSqliteInspectionBudget } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-DaL1xmcH.mjs";
import { c as redactSupportString, s as redactSupportDiagnosticLine } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { o as parseConfigFailureFacts, r as createUpdateFailureFact, t as createUpdateCanaryFailureFacts } from "./update-failure-facts-3t5Fm3wV.mjs";
import { i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, p as createUpdatePostInstallDoctorResultPath, u as consumeUpdatePostInstallDoctorResult } from "./update-doctor-result-oZ38327j.mjs";
import { t as logDebug } from "./logger-DHVmYOKs.mjs";
import { r as getActiveManagedProxyUrl, t as getActiveManagedProxyLoopbackMode } from "./active-proxy-state-ieQfaB9-.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { a as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CiE2knkN.mjs";
import { t as parseOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { a as parseUpdateDoctorLintReport, n as applyUpdateDoctorLintReport } from "./update-doctor-lint-BSXy6tAC.mjs";
import { t as UpdateSnapshotCapacityError } from "./update-snapshot-capacity-CfHFqLMd.mjs";
import { n as cleanupUpdateTemporaryDirectory } from "./update-maintenance-H05X8e5F.mjs";
import { t as createUpdateDoctorSectionTiming } from "./update-doctor-section-timing-BWwM1Ehw.mjs";
import { n as resolveUpdateDoctorExecutionPolicy } from "./update-runner-doctor-CqKjyCJ3.mjs";
import { r as registerManagedProxyGatewayLoopbackBypass } from "./proxy-lifecycle-hAKSje34.mjs";
import { i as waitBounded, n as stopCanary, t as launchCanary } from "./update-candidate-canary-process-DQ3BqGc7.mjs";
import { t as prepareUpdateCandidateRehearsal } from "./update-candidate-rehearsal-D4ZOh-nJ.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual, stripVTControlCharacters } from "node:util";
import { setTimeout } from "node:timers/promises";
import JSON5 from "json5";
//#region src/infra/update-candidate-canary-commands.ts
function buildUpdateCanaryCommands(params) {
	const runtime = {
		phase: "runtime",
		name: "candidate-recovery",
		entry: params.continuationEntry,
		args: ["--check"]
	};
	if (params.migrationPolicy === "startup-only") return [runtime];
	return [
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
		runtime
	];
}
//#endregion
//#region src/infra/update-candidate-canary-readiness.ts
function observeUpdateCandidateStartup(params) {
	const milestones = /* @__PURE__ */ new Map();
	return {
		milestones,
		onLine: (line) => {
			if (!line.startsWith("openclaw-update-canary-progress: ")) return;
			const milestone = line.slice(UPDATE_CANARY_PROGRESS_PREFIX.length);
			if (!isUpdateCanaryStartupMilestone(milestone)) logDebug(redactSupportString(`Ignoring unknown candidate startup milestone: ${JSON.stringify(milestone)}`, params));
			else if (!milestones.has(milestone)) milestones.set(milestone, Date.now());
		}
	};
}
/** Poll candidate control-plane endpoints under the existing managed loopback policy. */
async function waitForUpdateCandidateReadiness(params) {
	const deadline = new AbortController();
	const waitStarted = Date.now();
	const stallBudgetMs = Math.max(1, params.workDeadline - waitStarted);
	const hardDeadline = waitStarted + 4 * stallBudgetMs;
	let workDeadline = params.workDeadline;
	const milestones = /* @__PURE__ */ new Set();
	let lastProgress;
	let deadlineFailure;
	let warned = false;
	let warningPending;
	const recordProgress = (milestone, completedAt) => {
		if (milestones.has(milestone)) return;
		milestones.add(milestone);
		if (!lastProgress || completedAt >= lastProgress.completedAt) {
			lastProgress = {
				milestone,
				completedAt
			};
			workDeadline = Math.min(hardDeadline, Math.max(workDeadline, completedAt + stallBudgetMs));
		}
	};
	const refreshDeadline = () => {
		if (deadline.signal.aborted) return;
		for (const [milestone, completedAt] of params.startupProgress) recordProgress(milestone, completedAt);
		if (!warned && Date.now() >= params.workDeadline && Date.now() < workDeadline) {
			warned = true;
			warningPending = Promise.resolve(params.onWarning(`Candidate Gateway startup is still progressing after ${Date.now() - params.started}ms; continuing to wait while startup milestones advance.`)).catch((error) => {
				deadlineFailure = toErrorObject(error, "Candidate startup warning could not be recorded");
				deadline.abort();
			});
		}
	};
	let cancelDeadline = () => {};
	const checkDeadline = () => {
		try {
			params.signal?.throwIfAborted();
			params.assertCurrent?.();
			refreshDeadline();
			if (Date.now() >= workDeadline) deadline.abort();
			else cancelDeadline = scheduleAbsoluteDeadline(workDeadline, checkDeadline);
		} catch (error) {
			deadlineFailure ??= toErrorObject(error, "Candidate startup wait failed");
			deadline.abort();
		}
	};
	cancelDeadline = scheduleAbsoluteDeadline(workDeadline, checkDeadline);
	const signal = AbortSignal.any([
		deadline.signal,
		params.processExitSignal,
		...params.signal ? [params.signal] : []
	]);
	const assertRunning = () => {
		if (deadlineFailure !== void 0) throw deadlineFailure;
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		if (params.hasExited()) throw new Error(params.getExitReason() ?? "The updated Gateway exited before it was ready");
		if (Date.now() >= hardDeadline) throw new Error(`Candidate still starting after ${(Date.now() - waitStarted) / 1e3} s; milestones reached: ${[...milestones].join(", ") || "none"}`);
	};
	let probeFailure;
	let operationFailure;
	try {
		endpoints: for (const endpoint of ["startupz", "readyz"]) {
			params.onEndpoint(endpoint);
			const url = `http://127.0.0.1:${params.port}/${endpoint}`;
			const releaseBypass = registerManagedProxyGatewayLoopbackBypass(url);
			const proxy = getActiveManagedProxyLoopbackMode() === "proxy" ? getActiveManagedProxyUrl() : void 0;
			let failure;
			let candidatePending = false;
			try {
				while (true) {
					assertRunning();
					refreshDeadline();
					if (warningPending) {
						await warningPending;
						assertRunning();
					}
					if (Date.now() >= workDeadline) {
						if (lastProgress && (candidatePending || !proxy)) throw new Error(`Candidate Gateway startup stalled for ${stallBudgetMs}ms after ${lastProgress.milestone}`);
						if (!failure) throw new Error("Update validation deadline exceeded");
						params.capture(failure.message);
						probeFailure = failure;
						break endpoints;
					}
					let outcome = "";
					let ready = false;
					try {
						const response = await fetch(url, { signal });
						outcome = `HTTP ${response.status}`;
						if (response.status === 200 || response.status === 503) {
							const payload = await response.json();
							ready = response.status === 200 && (endpoint === "readyz" || isRecord(payload) && payload.status === "started");
							candidatePending = isRecord(payload) && (endpoint === "startupz" ? payload.status === "starting" : payload.ready === false);
							outcome += " (startup response not ready within the validation budget)";
						} else {
							candidatePending = false;
							await response.body?.cancel();
						}
					} catch (error) {
						if (!deadline.signal.aborted) candidatePending = false;
						outcome = `${outcome ? `${outcome}: ` : ""}${formatErrorMessageWithCode(error)}`;
					}
					assertRunning();
					refreshDeadline();
					if (warningPending) {
						await warningPending;
						assertRunning();
					}
					if (ready && Date.now() < workDeadline) {
						params.capture(`${endpoint}: ${endpoint === "startupz" ? "started" : "ready"} (${Date.now() - params.started}ms)`);
						lastProgress = {
							milestone: endpoint,
							completedAt: Date.now()
						};
						break;
					}
					if (!deadline.signal.aborted || !failure) {
						const detail = redactSupportDiagnosticLine(outcome, params);
						const nextStep = "Check Gateway logs and proxy.loopbackMode; rerun openclaw update.";
						failure = {
							message: redactSupportString(`Readiness check ${url} failed: ${detail}${proxy ? ` (via proxy ${proxy.origin})` : ""}. ${nextStep}`, params),
							fact: createUpdateFailureFact({
								check: endpoint,
								code: "candidate-readiness-probe-failed",
								message: `Readiness check ${endpoint} failed: ${detail}. ${nextStep}`
							}, params.env)
						};
					}
					if (Date.now() >= workDeadline) continue;
					await setTimeout(Math.min(100, workDeadline - Date.now()), void 0, { signal: params.signal });
				}
			} finally {
				releaseBypass?.();
			}
		}
	} catch (error) {
		operationFailure = toErrorObject(error, "Candidate startup wait failed");
	} finally {
		cancelDeadline();
		await warningPending;
	}
	if (deadlineFailure && hasCommandProcessCleanupError(deadlineFailure)) {
		if (operationFailure && operationFailure !== deadlineFailure) throw new AggregateError([operationFailure, deadlineFailure], "Candidate readiness and warning recording failed", { cause: operationFailure });
		throw deadlineFailure;
	}
	if (operationFailure) throw operationFailure;
	return probeFailure;
}
//#endregion
//#region src/infra/update-candidate-canary.ts
/** Rehearse the exact candidate against private SQLite snapshots while the serving generation stays up. */
async function validateUpdateCandidateCanary(params) {
	const started = Date.now();
	let rehearsal;
	let cleanupUncertain = false;
	const sourceEnv = params.env ?? process.env;
	const logTail = [];
	const stepLogTail = [];
	const startupWarnings = [];
	let activeStep = {
		name: "candidate-runtime",
		command: "Checking update runtime"
	};
	let stepStartedAt = started;
	let activeLintStep;
	const steps = [];
	const currentStep = (exitCode) => ({
		...activeStep,
		cwd: params.root,
		durationMs: Date.now() - stepStartedAt,
		exitCode
	});
	const { onStep, onProgress } = params;
	let receiptFailed = false;
	const reportReceipt = async (callback, value) => {
		try {
			await callback?.(value);
		} catch (error) {
			receiptFailed = true;
			throw error;
		}
	};
	const beginStep = async (step) => {
		activeStep = step;
		stepStartedAt = Date.now();
		stepLogTail.length = 0;
		await reportReceipt(onProgress, {
			step: step.name,
			status: "in_progress",
			startedAtMs: stepStartedAt,
			detail: step.command
		});
	};
	const recordStep = async (step) => {
		steps.push(step);
		await reportReceipt(onStep, step);
	};
	const cleanupRehearsal = async () => {
		if (!rehearsal) return;
		for (const directory of rehearsal.cleanupDirectories) await cleanupUpdateTemporaryDirectory({
			directory,
			root: params.root,
			name: directory === rehearsal.stateDir ? "candidate-state-cleanup" : "candidate-plugin-inventory-cleanup",
			onProgress: params.onProgress,
			onWarning: recordStep,
			onRemoved: recordStep
		});
	};
	let candidateSchemaVersions;
	let gatewayRestartCompletion = false;
	let doctorConfigWrites = false;
	let doctorConfigChanges = [];
	let listenerIsolation;
	const progress = { phase: "runtime" };
	const finish = (outcome, phase = progress.phase) => ({
		...outcome,
		phase,
		durationMs: Date.now() - started,
		logTail,
		candidateSchemaVersions,
		gatewayRestartCompletion,
		...outcome.status === "ok" && doctorConfigWrites ? { doctorConfigWrites } : {},
		...doctorConfigChanges.length ? { doctorConfigChanges } : {},
		listenerIsolation,
		steps
	});
	let env = { ...sourceEnv };
	const capture = (chunk) => {
		const safe = redactSupportString(String(chunk), {
			env,
			stateDir: params.stateDir
		}, { maxLength: Number.MAX_SAFE_INTEGER });
		const lines = safe.split(/\r?\n/u).filter(Boolean).map((line) => sliceUtf16Safe(line, -512));
		for (const tail of [logTail, stepLogTail]) {
			tail.push(...lines);
			tail.splice(0, Math.max(0, tail.length - 40));
		}
		return safe;
	};
	const launch = (entry, args, observers = {}) => {
		params.signal?.throwIfAborted();
		return launchCanary({
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
	};
	try {
		const entry = await resolveGatewayInstallEntrypoint(params.root);
		if (!entry) throw new Error("The update is missing its Gateway executable");
		const continuationEntry = path.join(params.root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath);
		try {
			await fs.lstat(continuationEntry);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
			if (params.migrationPolicy === "startup-only") throw new Error("The candidate lacks the runtime required to prove preserved-input startup", { cause: error });
			const message = "This version uses the current updater to finish installation";
			await recordStep({
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
			});
			return {
				status: "ok",
				phase: "runtime",
				durationMs: Date.now() - started,
				logTail,
				steps
			};
		}
		if (params.migrationPolicy !== "startup-only") {
			if (!resolveUpdateDoctorExecutionPolicy({
				targetVersion: await readPackageVersion(params.root),
				allowGatewayServiceRepair: false
			}).fix) throw new Error("Cannot check migrations without changing the running service");
		}
		progress.phase = "snapshot";
		await beginStep({
			name: "candidate-state-snapshot",
			command: "Preparing update checks"
		});
		rehearsal = await prepareUpdateCandidateRehearsal({
			candidateRoot: params.root,
			sourceBundledPlugins: params.sourceBundledPlugins,
			config: params.config,
			stateDir: params.stateDir,
			env: sourceEnv,
			nodeRunner: params.nodeRunner,
			timeoutMs: params.timeoutMs,
			signal: params.signal,
			assertCurrent: params.assertCurrent,
			onProgress: params.onProgress,
			migrationPolicy: params.migrationPolicy
		});
		await recordStep({
			...currentStep(0),
			snapshotCapacity: rehearsal.snapshotCapacity,
			diagnostics: rehearsal.snapshotDiagnostics,
			warnings: rehearsal.snapshotWarnings
		});
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
		const commands = buildUpdateCanaryCommands({
			continuationEntry,
			migrationPolicy: params.migrationPolicy
		});
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
		const operatorTrace = env.OPENCLAW_GATEWAY_STARTUP_TRACE;
		for (const command of commands) {
			const { phase } = command;
			progress.phase = phase;
			activeLintStep = void 0;
			env.OPENCLAW_UPDATE_IN_PROGRESS = phase === "doctor" ? "1" : "0";
			env.OPENCLAW_GATEWAY_STARTUP_TRACE = operatorTrace;
			const sectionTiming = phase === "doctor" ? createUpdateDoctorSectionTiming(env) : void 0;
			Object.assign(env, sectionTiming?.env);
			await beginStep({
				name: command.name,
				command: command.args.join(" ")
			});
			startBudget();
			remaining();
			const doctorResultPath = phase === "doctor" ? createUpdatePostInstallDoctorResultPath(doctorResultOptions) : void 0;
			env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV] = doctorResultPath;
			const configBeforeDoctor = doctorResultPath ? JSON5.parse(await fs.readFile(rehearsal.configPath, "utf8")) : void 0;
			let checksCompletedAt;
			const disposalWarnings = [];
			const running = launch(command.entry ?? entry, command.args, {
				hidesLine: sectionTiming?.hidesLine,
				onLine: (line) => {
					sectionTiming?.observeLine(line);
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
			let signal = null;
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
				signal = outcome.status === "completed" ? running.child.signalCode : null;
				timedOut = outcome.status === "deadline";
				if (timedOut) {
					const elapsed = Date.now() - stepStartedAt;
					const lintReport = phase === "lint" && checksCompletedAt !== void 0 && !running.outputExceeded() ? parseUpdateDoctorLintReport(running.stdout(), env) : void 0;
					const completed = checksCompletedAt !== void 0 && (phase === "doctor" || lintReport);
					timeoutMessage = `candidate-migration-rehearsal: ${phase} exceeded budget after ${Math.ceil(elapsed / 1e3)} s (${stepLogTail.at(-1) ?? "no progress output"})`;
					if (completed && checksCompletedAt !== void 0) {
						exitWarning = `Update ${phase} exit phase timed out after ${Date.now() - checksCompletedAt}ms (${elapsed}ms total); checks completed; ${running.processExited() ? "output pipes stayed open" : "process did not exit"}. Continuing with recorded check results.`;
						code = phase === "doctor" || lintReport && (lintReport.ok || lintReport.advisoryOnly) && !lintReport.failureFacts.length ? 0 : 1;
					}
				}
			} finally {
				await stopCanary({
					running,
					name: command.name,
					root: params.root,
					deadline,
					recordStep
				});
				if (doctorResultPath) {
					doctorReceipt = await consumeUpdatePostInstallDoctorResult(doctorResultPath, doctorResultOptions);
					if (doctorReceipt?.status === "error" && !signal) code = 1;
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
				...currentStep(running.child.exitCode),
				signal: running.child.signalCode,
				stderrTail: signal ? running.stderrTail() : void 0,
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
				...currentStep(timedOut ? null : code),
				...phase === "doctor" && checksCompletedAt !== void 0 ? { stdoutTail: "Doctor complete." } : {},
				...timedOut ? { termination: "timeout" } : signal ? {
					termination: "signal",
					signal,
					stderrTail: running.stderrTail()
				} : {}
			};
			sectionTiming?.annotate(step);
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
				step.failureFacts = createUpdateCanaryFailureFacts({
					phase,
					name: command.name,
					signal,
					timedOut,
					exitWarning,
					failureMessage,
					diagnostic: running.stderrDiagnostic(),
					findings,
					env
				});
			}
			steps.push(step);
			if (code !== 0 && !doctorAdvisory) throw new Error(failureMessage);
			await reportReceipt(onStep, step);
		}
		if (!candidateSchemaVersions) throw new Error("The update did not report its supported database versions");
		progress.phase = "startup";
		await beginStep({
			name: "candidate-gateway-startup",
			command: "gateway run"
		});
		startBudget();
		await rehearsal.prepareRuntime(remaining);
		const args = [
			"gateway",
			"run",
			...UPDATE_CANARY_PROGRESS_ARGS,
			"--bind",
			"loopback"
		];
		const startupProgress = observeUpdateCandidateStartup({
			env,
			stateDir: params.stateDir
		});
		const processExit = new AbortController();
		const running = launch(entry, [
			...args,
			"--port",
			String(port)
		], { onLine: startupProgress.onLine });
		const abortExited = () => processExit.abort();
		running.child.once("exit", abortExited);
		running.child.once("error", abortExited);
		let startupFailure;
		try {
			const probeFailure = await waitForUpdateCandidateReadiness({
				port,
				workDeadline,
				started,
				signal: params.signal,
				processExitSignal: processExit.signal,
				assertCurrent: params.assertCurrent,
				hasExited: () => running.processExited() || running.hasExited(),
				getExitReason: running.stderrDiagnostic,
				startupProgress: startupProgress.milestones,
				onWarning: async (message) => {
					startupWarnings.push(message);
					capture(message);
					await params.onProgress?.({
						step: "warning:candidate-gateway-startup",
						status: "completed",
						detail: message
					});
				},
				env,
				stateDir: params.stateDir,
				onEndpoint: (endpoint) => {
					progress.phase = endpoint === "startupz" ? "startup" : "readiness";
				},
				capture
			});
			if (probeFailure) capture("Update checks reached their time limit; Gateway readiness remains unverified.");
			await recordStep({
				...currentStep(probeFailure ? null : 0),
				...startupWarnings.length ? { warnings: startupWarnings } : {},
				...probeFailure ? {
					advisory: {
						kind: "candidate-runtime-unavailable",
						message: probeFailure.message
					},
					failureFacts: [probeFailure.fact]
				} : {}
			});
		} catch (error) {
			startupFailure = error;
			throw error;
		} finally {
			await stopCanary({
				running,
				name: "candidate-gateway-startup",
				root: params.root,
				deadline: Math.max(deadline, Date.now() + Math.min(2e3, Math.floor(budget / 10))),
				recordStep,
				primaryFailure: startupFailure
			});
		}
		return finish({ status: "ok" });
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) {
			cleanupUncertain = true;
			throw error;
		}
		if (receiptFailed) throw error;
		const { phase } = progress;
		const durationMs = Date.now() - stepStartedAt;
		const displayPhase = phase === "lint" ? "health" : phase;
		const failureLine = capture(`${displayPhase}: ${coerceErrorMessage(error)} (${durationMs}ms)`);
		let failed = steps.at(-1);
		if (!failed || failed.exitCode === 0 && failed !== activeLintStep || failed.advisory) {
			failed = activeLintStep ?? currentStep(1);
			steps.push(failed);
		}
		if (error instanceof UpdateSnapshotCapacityError) failed.snapshotCapacity = error.capacity;
		if (startupWarnings.length) failed.warnings = startupWarnings;
		failed.failureFacts ??= [createUpdateFailureFact({
			check: phase === "readiness" ? "readyz" : phase === "startup" ? "startupz" : phase,
			code: phase === "doctor" || phase === "lint" ? "doctor-failed" : `candidate-${phase}-failed`,
			message: coerceErrorMessage(error)
		}, env)];
		const repeatsFact = failed.termination !== "timeout" && failed.failureFacts.some((fact) => failureLine === `${displayPhase}: ${fact.message} (${durationMs}ms)`);
		failed.stderrTail ??= stepLogTail.slice(0, repeatsFact ? -1 : void 0).join("\n");
		try {
			await reportReceipt(onStep, failed);
		} catch (recordingError) {
			cleanupUncertain = hasCommandProcessCleanupError(recordingError);
			throw recordingError;
		}
		return finish({
			status: "error",
			reason: failed.failureFacts.some((fact) => fact.code === "candidate-checks-timeout") ? "candidate-checks-timeout" : phase === "doctor" || phase === "lint" ? "doctor-failed" : phase === "snapshot" ? "candidate-snapshot-failed" : "runtime-verification-failed"
		}, phase);
	} finally {
		if (!cleanupUncertain) await cleanupRehearsal();
	}
}
//#endregion
export { validateUpdateCandidateCanary as t };
