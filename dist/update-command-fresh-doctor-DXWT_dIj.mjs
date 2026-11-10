import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { o as resolveAggregateSqliteInspectionTimeoutMs } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as truncateUtf8Suffix, t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { i as isPlainCommandExitFailure, n as createSanitizedCommandError, o as readCommandProcessFailure, r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { a as isConfiguredPluginPathDiagnosticCode } from "./discovery-availability-CEoTdFoo.mjs";
import { l as readDeferredPluginMigrationsAsync, r as formatDeferredPluginMigration } from "./deferred-plugin-migrations-CSwavNpj.mjs";
import { a as redactPublicSupportDiagnosticLine, c as redactSupportString } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { a as normalizeUpdateFailureFacts, o as parseConfigFailureFacts, r as createUpdateFailureFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { a as UpdateDoctorDeferredInspectionCheckIdsSchema, i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, l as collectUpdateDoctorFailureFacts, n as PACKAGE_POST_INSTALL_DOCTOR_ADVISORY, o as UpdateDoctorError, p as createUpdatePostInstallDoctorResultPath, t as DoctorMaintenanceRefusalError, u as consumeUpdatePostInstallDoctorResult } from "./update-doctor-result-oZ38327j.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import { i as formatCommandResult, r as formatCommandOutput } from "./command-error-B2V3e5UN.mjs";
import "./config-B3oiWDlr.mjs";
import { a as runUtf8CommandWithTimeout, n as runExec } from "./exec-Bf6uhUA7.mjs";
import { a as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CiE2knkN.mjs";
import "./update-post-core-context-D3kte0je.mjs";
import { c as UPDATE_POST_CORE_CONVERGENCE_ENV, d as isUpdateDoctorInspectionReportMode, n as UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV, o as UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV } from "./update-phase-M5rvMZiC.mjs";
import { a as parseUpdateDoctorLintReport } from "./update-doctor-lint-BSXy6tAC.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-BP771TSP.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { m as UpdateCommandRecoveryPendingError } from "./update-command-executor-DUq8yLzH.mjs";
import { i as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { c as parseUpdateTimeoutMs } from "./shared-DRiGAorf.mjs";
import { t as createUpdateCommandAuthority } from "./update-command-authority-BUaM9lV-.mjs";
import { c as stripGatewayServiceMarkerEnv, t as disableUpdatedPackageCompileCacheEnv, u as withUpdateEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { t as hasDeferredUpdateModelRetirement } from "./update-deferred-model-retirement-BmVkte5n.mjs";
import { i as collectStateDatabasePaths, p as readUpdateStateDatabaseSizes } from "./update-candidate-state-fXM6fMqw.mjs";
import { t as createDoctorServiceInspectionBudget } from "./update-doctor-deadline-CYXeKJpA.mjs";
import { t as createUpdateDoctorSectionTiming } from "./update-doctor-section-timing-BWwM1Ehw.mjs";
import { t as buildUpdateDoctorEnv } from "./update-runner-doctor-CqKjyCJ3.mjs";
import { r as readUpdateConfigSnapshot } from "./update-command-config-snapshot-tEb-vXUT.mjs";
import { t as recordUpdateDatabaseWrites } from "./update-command-database-receipts-CpweMiFK.mjs";
import { i as withUpdateDoctorChild, n as inspectUpdateDoctorChildSupport, r as runUpdateDoctorProcess, t as assertUpdateDoctorChildSucceeded } from "./update-command-doctor-child-C43avymO.mjs";
import { n as POST_PLUGIN_DOCTOR_EXECUTION_FAILED_REASON, r as applyPostPluginConfigValidation, t as POST_PLUGIN_CONFIG_VALIDATION_EXECUTION_FAILED_REASON } from "./update-command-post-plugin-validation-DVVGd91J.mjs";
import os from "node:os";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/cli/update-cli/update-command-post-plugin-readiness.ts
function readinessWarning(finding, reason = finding.checkId) {
	const pathReason = isConfiguredPluginPathDiagnosticCode(finding.requirement) ? finding.requirement : void 0;
	return {
		reason: pathReason ?? reason,
		message: finding.message,
		...finding.errorCode ? { errorCode: finding.errorCode } : {},
		guidance: [finding.fixHint ?? `Resolve this finding, then rerun \`openclaw doctor --lint --only ${finding.checkId}\`.`],
		...finding.source ? pathReason ? { source: finding.source } : { pluginId: finding.source } : {}
	};
}
function createPostPluginReadinessExecutionWarning(pluginUpdate, reason) {
	const warning = {
		reason: "doctor-advisory",
		message: `Updated plugin readiness checks could not be completed before restart. ${redactSupportString(reason, {
			env: process.env,
			stateDir: resolveStateDir()
		}, { maxLength: 500 })}`,
		guidance: ["Run `openclaw update repair` to retry post-update readiness checks."]
	};
	if (pluginUpdate.doctorLint) pluginUpdate.doctorLint.advisory = {
		kind: "recoverable-maintenance",
		message: warning.message
	};
	return {
		...pluginUpdate,
		status: pluginUpdate.status === "error" ? "error" : "warning",
		reason: pluginUpdate.reason ?? "post-plugin-update-readiness-execution-failed",
		warnings: [...pluginUpdate.warnings ?? [], warning]
	};
}
async function applyPostPluginUpdateReadiness(params) {
	const args = [
		params.entryPath,
		"doctor",
		"--lint",
		"--json",
		"--severity-min",
		params.includeOptionalInspections ? "info" : "error",
		...params.includeOptionalInspections ? ["--all"] : []
	];
	const baseEnv = stripGatewayServiceMarkerEnv(disableUpdatedPackageCompileCacheEnv(process.env));
	delete baseEnv[UPDATE_POST_CORE_CONVERGENCE_ENV];
	const startedAt = Date.now();
	const doctorLint = {
		name: "post-plugin-doctor-lint",
		command: args.slice(1).join(" "),
		cwd: params.root,
		durationMs: 0,
		exitCode: null,
		doctorLintFindings: []
	};
	const pluginUpdate = {
		...params.pluginUpdate,
		doctorLint
	};
	let execution;
	let executionFailure;
	let report;
	try {
		execution = await runUtf8CommandWithTimeout([params.nodeRunner ?? resolveNodeRunner(), ...args], {
			cwd: params.root,
			timeoutMs: params.timeoutMs,
			killProcessTree: true,
			requireProcessTreeExtinction: true,
			input: "",
			maxOutputBytes: 4194304,
			outputCapture: "head",
			terminateOnOutputLimit: true,
			baseEnv,
			env: {
				OPENCLAW_UPDATE_IN_PROGRESS: "1",
				[UPDATE_POST_CORE_CONVERGENCE_ENV]: "1"
			}
		});
		if (execution.cleanup === "uncertain") throw new CommandProcessCleanupError();
		doctorLint.exitCode = execution.code;
		doctorLint.termination = execution.termination;
		doctorLint.signal = execution.signal;
		doctorLint.killed = execution.killed;
		doctorLint.outputLimitExceeded = execution.outputLimitExceeded;
		const stderr = redactSupportString(execution.stderr, {
			env: process.env,
			stateDir: resolveStateDir()
		}, { maxLength: Number.MAX_SAFE_INTEGER });
		doctorLint.stderrTail = formatCommandOutput(stderr, 2e3);
		if (execution.code !== 0 || execution.termination !== "exit" || execution.outputLimitExceeded) executionFailure = formatCommandResult("Post-plugin Doctor readiness", {
			...execution,
			stdout: "",
			stderr: formatCommandOutput(stderr, 384)
		});
		report = parseUpdateDoctorLintReport(execution.stdout);
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		if (readCommandProcessFailure(error)?.cleanup === "uncertain") throw new CommandProcessCleanupError({ cause: error });
		return createPostPluginReadinessExecutionWarning(pluginUpdate, executionFailure ?? String(error));
	} finally {
		doctorLint.durationMs = Date.now() - startedAt;
	}
	const completed = execution.termination === "exit" && !execution.outputLimitExceeded;
	doctorLint.doctorLintFindings = report.doctorLintFindings;
	const inspectionAdvisories = params.includeOptionalInspections ? report.findings.filter((finding) => finding.severity === "info" || finding.severity === "warning") : [];
	const readinessFindings = report.findings.filter((finding) => !inspectionAdvisories.includes(finding));
	const advisoryOnly = execution.code === 1 && completed && (report.advisoryOnly || inspectionAdvisories.length > 0) && readinessFindings.length === 0 && report.checksRun > 0;
	const passed = (execution.code === 0 && completed && report.ok || advisoryOnly) && report.checksRun > 0 && readinessFindings.length === 0;
	if (advisoryOnly) doctorLint.advisory = {
		kind: "recoverable-maintenance",
		message: inspectionAdvisories.length > 0 ? "Doctor inspection findings are advisory during updates." : "Doctor security policy findings are advisory during updates."
	};
	if (report.failureFacts.length) doctorLint.failureFacts = report.failureFacts;
	const warnings = [...report.warnings, ...inspectionAdvisories.filter((finding) => finding.severity !== "info")];
	if (warnings.length > 0) {
		pluginUpdate.status = pluginUpdate.status === "error" ? "error" : "warning";
		pluginUpdate.warnings = [...pluginUpdate.warnings ?? [], ...warnings.map((finding) => readinessWarning(finding, "doctor-advisory"))];
	}
	if (passed) {
		if (params.includeOptionalInspections) doctorLint.deferredInspectionCheckIds = [];
		return pluginUpdate;
	}
	if (readinessFindings.length === 0) return createPostPluginReadinessExecutionWarning(pluginUpdate, report.checksRun === 0 ? "Updated Doctor did not run a declared readiness check." : "Updated Doctor readiness checks failed without a finding.");
	return {
		...pluginUpdate,
		status: "error",
		reason: "post-plugin-update-readiness-failed",
		failureFacts: report.failureFacts,
		warnings: [...pluginUpdate.warnings ?? [], ...readinessFindings.map((finding) => readinessWarning(finding))]
	};
}
//#endregion
//#region src/cli/update-cli/update-finalization-output.ts
const MAX_CAPTURE_BYTES = 65536;
const MAX_EXCERPT_BYTES = 256;
const outputScope = new AsyncLocalStorage();
var CapturedStream = class {
	constructor() {
		this.receivedBytes = 0;
	}
	append(chunk) {
		if (chunk.length === 0) return;
		const offset = this.receivedBytes;
		this.receivedBytes = Math.min(Number.MAX_SAFE_INTEGER, offset + chunk.length);
		this.lastOutputAt = performance.now();
		if (this.receivedBytes > MAX_CAPTURE_BYTES) {
			this.buffer = void 0;
			return;
		}
		this.buffer ??= Buffer.alloc(MAX_CAPTURE_BYTES);
		chunk.copy(this.buffer, offset);
	}
	snapshot() {
		const facts = {
			receivedBytes: this.receivedBytes,
			lastOutputAgeMs: this.lastOutputAt === void 0 ? null : Math.max(0, Math.round(performance.now() - this.lastOutputAt))
		};
		if (this.receivedBytes > MAX_CAPTURE_BYTES) return {
			...facts,
			omitted: "capture-limit"
		};
		const text = this.buffer?.subarray(0, this.receivedBytes).toString("utf8") ?? "";
		if (text.replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/gu, "").includes("PRIVATE KEY-----")) return {
			...facts,
			omitted: "incomplete-private-key"
		};
		try {
			const redacted = redactSupportString(text, {
				env: process.env,
				stateDir: resolveStateDir()
			}, { maxLength: Number.MAX_SAFE_INTEGER });
			const excerpt = Buffer.byteLength(redacted) <= MAX_EXCERPT_BYTES ? redacted : `${truncateUtf8Prefix(redacted, 160)}\n...\n${truncateUtf8Suffix(redacted, 91)}`;
			return {
				...facts,
				excerpt
			};
		} catch {
			return {
				...facts,
				omitted: "redaction-failed"
			};
		}
	}
};
/** Diagnostic custody only. This scope never cancels work or authorizes rollback. */
var UpdateFinalizationOutput = class {
	constructor() {
		this.closed = false;
	}
	run(run) {
		return outputScope.run(this, run);
	}
	captureDoctor(phase) {
		const doctor = {
			phase,
			stdout: new CapturedStream(),
			stderr: new CapturedStream()
		};
		this.doctor = doctor;
		return (chunk, stream) => {
			if (!this.closed && this.doctor === doctor) doctor[stream].append(chunk);
		};
	}
	snapshot() {
		return this.doctor ? {
			phase: this.doctor.phase,
			stdout: this.doctor.stdout.snapshot(),
			stderr: this.doctor.stderr.snapshot()
		} : void 0;
	}
	close() {
		this.closed = true;
		this.doctor = void 0;
	}
};
function captureUpdateFinalizationDoctorOutput(phase) {
	return outputScope.getStore()?.captureDoctor(phase);
}
//#endregion
//#region src/cli/update-cli/update-command-fresh-doctor-env.ts
async function withPrePluginUpdateDoctorEnv(run) {
	return await withUpdateEnv({
		OPENCLAW_UPDATE_IN_PROGRESS: "1",
		[UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV]: "1",
		[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV]: "1",
		[UPDATE_POST_CORE_CONVERGENCE_ENV]: void 0
	}, run);
}
//#endregion
//#region src/cli/update-cli/update-command-fresh-doctor.ts
const servesOlderUpdater = () => Reflect.get(globalThis, Symbol.for("openclaw.updateCompat.olderUpdater")) === true;
async function runUpdateFinalizationDoctorInFreshProcess(params) {
	const requestedTimeoutMs = parseUpdateTimeoutMs(params.opts?.timeout) ?? params.timeoutMs;
	const serviceInspectionDeadlineAtMs = params.serviceInspectionDeadlineAtMs ?? (requestedTimeoutMs === void 0 ? void 0 : Date.now() + requestedTimeoutMs);
	const remaining = createDoctorServiceInspectionBudget(serviceInspectionDeadlineAtMs);
	const { run, executorFence, runId, requester, assertCurrent, assertRequesterCurrent, refuseAuthority } = createUpdateCommandAuthority(params, "Fresh Doctor");
	assertCurrent();
	const entryPath = params.entryPath ?? await resolveGatewayInstallEntrypoint(params.root);
	if (!entryPath) throw new Error("Updated OpenClaw entrypoint not found for post-plugin doctor");
	assertCurrent();
	const args = [
		entryPath,
		"doctor",
		"--repair",
		"--non-interactive",
		...params.workspaceSuggestions ? [] : ["--no-workspace-suggestions"],
		...params.yes ? ["--yes"] : []
	];
	const baseEnv = stripGatewayServiceMarkerEnv(disableUpdatedPackageCompileCacheEnv(process.env));
	delete baseEnv[UPDATE_POST_CORE_CONVERGENCE_ENV];
	const doctorResultPath = createUpdatePostInstallDoctorResultPath();
	let doctorResult;
	let doctorSettled = true;
	let processSettlement;
	let result;
	let warning;
	let failure;
	const sectionTiming = createUpdateDoctorSectionTiming();
	let doctorStep;
	let doctorStartedAt;
	assertCurrent();
	try {
		const commandOptions = {
			cwd: params.root,
			timeoutMs: remaining(),
			maxOutputBytes: 4194304,
			terminateOnOutputLimit: true,
			onOutputChunk: captureUpdateFinalizationDoctorOutput(params.phase),
			baseEnv,
			env: {
				[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]: doctorResultPath,
				...runId ?? params.runId ? { [UPDATE_RUN_ID_ENV]: runId ?? params.runId } : {},
				...buildUpdateDoctorEnv({
					allowGatewayServiceRepair: false,
					allowGatewayActivation: false,
					serviceRepairPolicy: "external",
					deferConfiguredPluginInstallRepair: true
				}),
				...params.phase === "post-plugin" ? { [UPDATE_POST_CORE_CONVERGENCE_ENV]: "1" } : {}
			}
		};
		const workerCommand = [params.nodeRunner ?? resolveNodeRunner(), path.join(params.root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath)];
		const doctorConfigWrites = run && (params.doctorConfigWrites ?? await inspectUpdateDoctorChildSupport(workerCommand, {
			cwd: params.root,
			timeoutMs: remaining(),
			baseEnv,
			env: commandOptions.env
		}, assertCurrent));
		assertCurrent();
		const doctorOptions = {
			...commandOptions,
			env: {
				...commandOptions.env,
				...sectionTiming.env
			}
		};
		const doctorArgv = doctorConfigWrites && executorFence && runId && !servesOlderUpdater() ? [...workerCommand, "--doctor"] : [params.nodeRunner ?? resolveNodeRunner(), ...args];
		doctorStartedAt = Date.now();
		doctorStep = {
			name: `${params.phase} doctor`,
			command: doctorArgv.join(" "),
			cwd: params.root,
			durationMs: 0,
			exitCode: null
		};
		let child;
		if (doctorConfigWrites && executorFence && runId && !servesOlderUpdater()) {
			const snapshot = await readUpdateConfigSnapshot(resolveConfigPath());
			assertCurrent();
			child = await withUpdateDoctorChild({
				root: params.root,
				context: {
					runId,
					executorFence,
					requester: requester?.requester,
					assertRequesterCurrent,
					onProcessSettlement: (step) => {
						processSettlement = step;
					}
				},
				input: {
					configInputHash: snapshot.hash,
					originalRecoveryCapture: run?.originalRecoveryCapture,
					repair: true,
					databaseGenerations: params.databaseBackup?.migration?.to ?? params.databaseBackup?.sourceGenerations,
					get serviceInspectionDeadlineAtMs() {
						const budget = remaining();
						return budget === void 0 ? void 0 : Date.now() + budget;
					},
					yes: params.yes,
					workspaceSuggestions: params.workspaceSuggestions === true,
					...params.phase === "post-plugin" && process.env["OPENCLAW_UPDATE_POST_CORE"] === "1" ? { postCoreSchemaRepair: true } : {}
				}
			}, (runCommand) => sectionTiming.wrap(runCommand)(doctorArgv, {
				...doctorOptions,
				timeoutMs: remaining()
			}));
		} else child = await sectionTiming.wrap((argv, options) => runUpdateDoctorProcess({
			root: params.root,
			runId: runId ?? params.runId ?? "",
			onProcessSettlement: (step) => {
				processSettlement = step;
			}
		}, argv, options))(doctorArgv, {
			...doctorOptions,
			timeoutMs: remaining()
		});
		result = child;
		doctorStep.exitCode = child.code;
		assertUpdateDoctorChildSucceeded(child);
		assertCurrent();
	} catch (error) {
		failure = { error };
		if (doctorStep && isRecord(error) && typeof error.exitCode === "number") doctorStep.exitCode = error.exitCode;
	} finally {
		if (doctorStep && doctorStartedAt !== void 0) doctorStep.durationMs = Date.now() - doctorStartedAt;
	}
	const commandFailure = failure;
	if (failure) {
		const error = failure.error;
		failure = void 0;
		try {
			if (hasCommandProcessCleanupError(error) || isRecord(error) && error.cleanup === "uncertain") {
				doctorSettled = false;
				throw new CommandProcessCleanupError({ cause: error });
			}
			if (collectNestedErrorCandidates(error).some((cause) => cause instanceof UpdateCommandRecoveryPendingError || cause instanceof UpdateRequesterRevokedError)) refuseAuthority(error);
			assertCurrent();
			doctorResult = await consumeUpdatePostInstallDoctorResult(doctorResultPath);
			if (doctorResult?.configWriteRefusal?.reason === "authority-check-failed" || doctorResult?.configWriteRefusal?.reason === "requester-revoked") refuseAuthority(error);
			if (isRecord(error)) result = {
				...error,
				...typeof error.stderr === "string" ? { stderr: sectionTiming.stripTrace(error.stderr) } : {}
			};
			const deferred = isRecord(error) && error.exitCode === 86 && isPlainCommandExitFailure({
				...error,
				failed: error.failed === true,
				cause: error.cause
			}) && doctorResult?.status === "advisory";
			if (deferred && doctorStep) doctorStep.advisory = PACKAGE_POST_INSTALL_DOCTOR_ADVISORY;
			if (!deferred) {
				const exitCode = isRecord(error) && typeof error.exitCode === "number" ? error.exitCode : null;
				const redaction = {
					env: process.env,
					stateDir: resolveStateDir()
				};
				const failureFacts = doctorResult?.configWriteRefusal ? [createUpdateFailureFact({
					check: "config-write",
					code: doctorResult.configWriteRefusal.reason,
					message: doctorResult.configWriteRefusal.message
				})] : doctorResult?.failureFacts?.length ? doctorResult.failureFacts : [createUpdateFailureFact({
					check: "doctor",
					code: "doctor-failed",
					message: typeof result?.stderr === "string" && result.stderr.trim() ? result.stderr : error instanceof Error ? error.message : String(error)
				})];
				const details = ["stderr", "stdout"].flatMap((stream) => {
					const output = result?.[stream];
					if (typeof output !== "string" || !output.trim()) return [];
					const redacted = redactSupportString(output, redaction, { maxLength: Number.MAX_SAFE_INTEGER });
					const formatted = formatCommandOutput(redacted, 384);
					let excerpt = formatted;
					if (Buffer.byteLength(redacted) > 384 || Buffer.byteLength(formatted) > 384) {
						const beginning = formatCommandOutput(truncateUtf8Prefix(redacted, 256), 256);
						excerpt = `${truncateUtf8Prefix(beginning, 256)}\n...\n${truncateUtf8Suffix(formatted, 123)}`;
					}
					return excerpt ? [`${stream}: ${excerpt}`] : [];
				});
				const message = details.length ? `Updated ${params.phase} Doctor failed:\n${details.join("\n")}` : error instanceof Error ? error.message : String(error);
				if (doctorResult?.status === "error" && doctorResult.maintenanceRefusal?.kind === "data-at-risk") throw new DoctorMaintenanceRefusalError(message, doctorResult.maintenanceRefusal, {
					cause: error,
					failureFacts
				});
				if (params.phase === "post-plugin" && !(isRecord(error) && error.isCanceled === true) && failureFacts.every((fact) => fact.check === "doctor" && fact.code === "doctor-failed")) {
					warning = {
						reason: "doctor-advisory",
						message: `Post-update plugin Doctor did not complete${exitCode == null ? "" : ` (exit ${exitCode})`}: ${message}`,
						guidance: ["Run `openclaw update repair` to retry post-update plugin repair."]
					};
					if (doctorStep) doctorStep.advisory = {
						kind: "recoverable-maintenance",
						message: warning.message
					};
				} else throw new UpdateDoctorError(message, failureFacts, {
					cause: error,
					exitCode
				});
			}
		} catch (classificationError) {
			failure = { error: classificationError };
		}
	}
	try {
		if (doctorSettled && doctorResult === void 0) doctorResult = await consumeUpdatePostInstallDoctorResult(doctorResultPath);
		if (doctorResult?.status === "ok" && doctorResult.maintenanceRefusal) {
			const refusal = new DoctorMaintenanceRefusalError(doctorResult.warnings?.[0] ?? "Doctor maintenance remains pending; run openclaw doctor --fix.", doctorResult.maintenanceRefusal, {
				cause: commandFailure?.error,
				failureFacts: doctorResult.failureFacts
			});
			failure = { error: failure ? new AggregateError([failure.error, refusal], "Doctor maintenance remains refused", { cause: failure.error }) : refusal };
		}
		if (processSettlement) params.onDoctorStep?.(processSettlement);
		if (doctorStep) {
			sectionTiming.annotate(doctorStep);
			doctorStep.deferredInspectionCheckIds = doctorResult?.deferredInspectionCheckIds ?? null;
			params.onDoctorStep?.(doctorStep);
		}
		if (params.databaseBackup) {
			const receipt = recordUpdateDatabaseWrites(params.databaseBackup, doctorResult?.databaseWrites, { name: `${params.phase} doctor` });
			params.onDoctorStep?.(receipt);
		}
		if (doctorResult?.warnings?.length) params.onWarnings?.(doctorResult.warnings);
		if (typeof result?.stdout === "string" && result.stdout.trim()) defaultRuntime[params.json ? "error" : "log"](result.stdout.trimEnd());
		if (typeof result?.stderr === "string" && result.stderr.trim()) defaultRuntime.error(result.stderr.trimEnd());
	} catch (error) {
		failure = { error: failure ? new AggregateError([failure.error, error], "Doctor result recording failed", { cause: error }) : error };
	}
	if (failure) throw failure.error;
	return warning;
}
async function validatePostPluginConfigInFreshProcess(params) {
	try {
		await runExec(params.nodeRunner ?? resolveNodeRunner(), [
			params.entryPath,
			"config",
			"validate",
			"--json"
		], {
			cwd: params.root,
			timeoutMs: params.timeoutMs,
			maxBuffer: 4194304,
			logOutput: false,
			baseEnv: stripGatewayServiceMarkerEnv(disableUpdatedPackageCompileCacheEnv(process.env)),
			env: { OPENCLAW_UPDATE_IN_PROGRESS: "0" }
		});
		return { status: "valid" };
	} catch (error) {
		const result = isRecord(error) ? error : {};
		const cleanupUncertain = result.cleanup === "uncertain" || hasCommandProcessCleanupError(error);
		const issues = !cleanupUncertain && isPlainCommandExitFailure({
			...result,
			failed: result.failed === true,
			cause: result.cause
		}) && typeof result.stdout === "string" ? parseConfigFailureFacts(result.stdout, process.env) : [];
		if (issues.length) return {
			status: "invalid",
			failureFacts: issues
		};
		const summary = [
			createSanitizedCommandError(result).message,
			...typeof result.signal === "string" ? [`signal=${result.signal}`] : [],
			...cleanupUncertain ? ["cleanup=uncertain"] : []
		].join("; ");
		return {
			status: "execution-failed",
			failureFacts: normalizeUpdateFailureFacts([{
				check: "config",
				code: POST_PLUGIN_CONFIG_VALIDATION_EXECUTION_FAILED_REASON,
				message: summary
			}, ...["stderr", "stdout"].flatMap((stream) => {
				const output = result[stream];
				if (typeof output !== "string" || !output.trim()) return [];
				const diagnostic = redactPublicSupportDiagnosticLine(output, {
					env: process.env,
					stateDir: resolveStateDir()
				});
				return [{
					check: "config",
					code: "command-failed",
					message: `${stream}: ${diagnostic === "[redacted-diagnostic]" ? output : diagnostic}`
				}];
			})])
		};
	}
}
async function completePostCorePluginUpdate(params) {
	let authorityFailed = false;
	const assertCurrent = () => {
		try {
			params.assertCurrent?.();
		} catch (error) {
			authorityFailed = true;
			throw error;
		}
	};
	assertCurrent();
	let pluginUpdate = params.pluginUpdate;
	let entryPath;
	let freshConfigValidation;
	let includeOptionalInspections = false;
	if (pluginUpdate.status !== "error") try {
		entryPath = await resolveGatewayInstallEntrypoint(params.root);
		assertCurrent();
		if (!entryPath) throw new Error("Updated OpenClaw entrypoint not found for post-plugin doctor");
		const freshDoctorRequired = pluginUpdate.changed || hasDeferredUpdateModelRetirement(params.opts?.run?.env, params.opts?.run?.runId ?? params.runId) || (await readDeferredPluginMigrationsAsync()).length > 0;
		assertCurrent();
		if (freshDoctorRequired) {
			await params.beforeDoctor?.();
			let inspectionCheckIds;
			const warning = await runUpdateFinalizationDoctorInFreshProcess({
				...params,
				onDoctorStep: (step) => {
					if (step.deferredInspectionCheckIds !== void 0) inspectionCheckIds = step.deferredInspectionCheckIds;
					params.onDoctorStep?.(step);
				},
				assertCurrent,
				onAuthorityRefused: () => {
					authorityFailed = true;
				},
				entryPath,
				phase: "post-plugin"
			});
			includeOptionalInspections = isUpdateDoctorInspectionReportMode(process.env) && !UpdateDoctorDeferredInspectionCheckIdsSchema.safeParse(inspectionCheckIds).success;
			if (warning) pluginUpdate = {
				...pluginUpdate,
				status: "warning",
				reason: POST_PLUGIN_DOCTOR_EXECUTION_FAILED_REASON,
				warnings: [...pluginUpdate.warnings ?? [], warning]
			};
			const pending = await readDeferredPluginMigrationsAsync();
			assertCurrent();
			if (pending.length > 0) pluginUpdate = {
				...pluginUpdate,
				status: "warning",
				warnings: [...pluginUpdate.warnings ?? [], ...pending.map((migration) => ({
					pluginId: migration.pluginId,
					reason: "doctor-advisory",
					message: formatDeferredPluginMigration(migration, {}),
					guidance: [`Run "${migration.command}" to finish the plugin data/settings upgrade.`]
				}))]
			};
		}
	} catch (err) {
		if (authorityFailed || hasCommandProcessCleanupError(err) || collectNestedErrorCandidates(err).some((cause) => cause instanceof DoctorMaintenanceRefusalError)) throw err;
		assertCurrent();
		const failedUpdate = params.pluginUpdate;
		const reason = String(err);
		const failureFacts = collectUpdateDoctorFailureFacts(err);
		pluginUpdate = {
			...failedUpdate,
			status: "error",
			reason: POST_PLUGIN_DOCTOR_EXECUTION_FAILED_REASON,
			...failureFacts.length ? { failureFacts } : {},
			warnings: [...failedUpdate.warnings ?? [], {
				reason,
				message: `Post-update plugin Doctor did not complete: ${reason}`,
				guidance: ["Run `openclaw update repair` to retry post-update plugin repair."]
			}]
		};
	}
	assertCurrent();
	const configSnapshot = await withUpdateEnv({ OPENCLAW_UPDATE_IN_PROGRESS: "0" }, () => readConfigFileSnapshot({
		observe: false,
		suppressFutureVersionWarning: true
	}));
	assertCurrent();
	if (entryPath) {
		let checkTimeoutMs = params.timeoutMs;
		if (checkTimeoutMs === void 0) {
			const env = { ...process.env };
			const databases = await collectStateDatabasePaths({
				stateDir: resolveStateDir(env),
				config: configSnapshot.sourceConfig,
				env
			}, { includeUnconfiguredAgents: false });
			assertCurrent();
			checkTimeoutMs = resolveAggregateSqliteInspectionTimeoutMs("post-plugin checks", await readUpdateStateDatabaseSizes(Array.from(databases.values(), (database) => database.spellings[0]), {
				nodeRunner: process.execPath,
				sourceEnv: env,
				stagingRoot: os.tmpdir()
			}));
		}
		assertCurrent();
		freshConfigValidation = !configSnapshot.exists && configSnapshot.valid ? { status: "valid" } : await validatePostPluginConfigInFreshProcess({
			...params,
			entryPath,
			timeoutMs: checkTimeoutMs
		});
		assertCurrent();
		if (freshConfigValidation.status === "valid") pluginUpdate = await applyPostPluginUpdateReadiness({
			root: params.root,
			entryPath,
			pluginUpdate,
			timeoutMs: checkTimeoutMs,
			includeOptionalInspections,
			...params.nodeRunner ? { nodeRunner: params.nodeRunner } : {}
		});
	}
	assertCurrent();
	if (freshConfigValidation) pluginUpdate = applyPostPluginConfigValidation(pluginUpdate, freshConfigValidation);
	return {
		pluginUpdate,
		configSnapshot
	};
}
//#endregion
export { UpdateFinalizationOutput as i, runUpdateFinalizationDoctorInFreshProcess as n, withPrePluginUpdateDoctorEnv as r, completePostCorePluginUpdate as t };
