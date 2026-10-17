import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { o as resolveAggregateSqliteInspectionTimeoutMs } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import "./update-post-core-context-B2x24New.mjs";
import { i as isPlainCommandExitFailure, n as createSanitizedCommandError, r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { a as runUtf8CommandWithTimeout, n as runExec } from "./exec-DJvyCA0D.mjs";
import { n as truncateUtf8Suffix, t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { i as formatCommandResult, r as formatCommandOutput } from "./command-error-CFVNEvkJ.mjs";
import { a as redactPublicSupportDiagnosticLine, c as redactSupportString } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { a as parseConfigFailureFacts, i as normalizeUpdateFailureFacts, r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { a as UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV, n as UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV, o as UPDATE_POST_CORE_CONVERGENCE_ENV } from "./update-phase-BClSJ17n.mjs";
import { l as readDeferredPluginMigrationsAsync } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { f as isConfiguredPluginPathDiagnosticCode } from "./discovery-Dma3bVNk.mjs";
import { a as UpdateDoctorError, c as collectUpdateDoctorFailureFacts, f as createUpdatePostInstallDoctorResultPath, i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, l as consumeUpdatePostInstallDoctorResult, t as DoctorMaintenanceRefusalError } from "./update-doctor-result-yVslo54h.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { a as parseUpdateDoctorLintReport } from "./update-doctor-lint-kv_-CSRP.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-sTeqCewg.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { p as UpdateCommandRecoveryPendingError } from "./update-command-executor-C94Zye_E.mjs";
import { i as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { a as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CRhfnUxj.mjs";
import { c as parseUpdateTimeoutMs } from "./shared-D-l8dmoD.mjs";
import { t as createUpdateCommandAuthority } from "./update-command-authority-BrcSIUcQ.mjs";
import { c as stripGatewayServiceMarkerEnv, t as disableUpdatedPackageCompileCacheEnv, u as withUpdateEnv } from "./update-command-service-env-lR0aWgPL.mjs";
import { t as hasDeferredUpdateModelRetirement } from "./update-deferred-model-retirement-BYnhH9wq.mjs";
import { i as collectStateDatabasePaths, p as readUpdateStateDatabaseSizes } from "./update-candidate-state-CO0vwfHU.mjs";
import { t as buildUpdateDoctorEnv } from "./update-runner-doctor-BdJj3P99.mjs";
import { r as readUpdateConfigSnapshot } from "./update-command-config-snapshot-BdxE1oYA.mjs";
import { a as recordUpdateDatabaseWrites, i as withUpdateDoctorChild, n as inspectUpdateDoctorChildSupport, r as runUpdateDoctorProcess, t as assertUpdateDoctorChildSucceeded } from "./update-command-doctor-child-Ch113pNK.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
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
function createPostPluginReadinessExecutionFailure(pluginUpdate, reason) {
	return {
		...pluginUpdate,
		status: "error",
		reason: "post-plugin-update-readiness-execution-failed",
		warnings: [...pluginUpdate.warnings ?? [], {
			reason,
			message: "Updated plugin readiness checks could not be completed before restart.",
			guidance: ["Run `openclaw update repair` to retry post-update readiness checks."]
		}]
	};
}
async function applyPostPluginUpdateReadiness(params) {
	const args = [
		params.entryPath,
		"doctor",
		"--lint",
		"--json",
		"--severity-min",
		"error"
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
		return createPostPluginReadinessExecutionFailure(pluginUpdate, executionFailure ?? String(error));
	} finally {
		doctorLint.durationMs = Date.now() - startedAt;
	}
	const completed = execution.termination === "exit" && !execution.outputLimitExceeded;
	doctorLint.doctorLintFindings = report.doctorLintFindings;
	const policyAdvisory = execution.code === 1 && completed && report.advisoryOnly && report.checksRun > 0;
	const passed = (execution.code === 0 && completed && report.ok || policyAdvisory) && report.checksRun > 0 && report.findings.length === 0;
	if (policyAdvisory) doctorLint.advisory = {
		kind: "recoverable-maintenance",
		message: "Doctor security policy findings are advisory during updates."
	};
	if (report.failureFacts.length) doctorLint.failureFacts = report.failureFacts;
	if (report.warnings.length > 0) {
		pluginUpdate.status = pluginUpdate.status === "error" ? "error" : "warning";
		pluginUpdate.warnings = [...pluginUpdate.warnings ?? [], ...report.warnings.map((finding) => readinessWarning(finding, "doctor-advisory"))];
	}
	if (passed) return pluginUpdate;
	if (report.findings.length === 0) return createPostPluginReadinessExecutionFailure(pluginUpdate, report.checksRun === 0 ? "Updated Doctor did not run a declared readiness check." : "Updated Doctor readiness checks failed without a finding.");
	return {
		...pluginUpdate,
		status: "error",
		reason: "post-plugin-update-readiness-failed",
		failureFacts: report.failureFacts,
		warnings: [...pluginUpdate.warnings ?? [], ...report.findings.map((finding) => readinessWarning(finding))]
	};
}
//#endregion
//#region src/cli/update-cli/update-command-post-plugin-validation.ts
const POST_PLUGIN_DOCTOR_EXECUTION_FAILED_REASON = "post-plugin-doctor-execution-failed";
const POST_PLUGIN_CONFIG_VALIDATION_EXECUTION_FAILED_REASON = "post-plugin-config-validation-execution-failed";
function applyPostPluginConfigValidation(pluginUpdate, validation) {
	if (validation.status === "valid") return pluginUpdate;
	const result = validation.failureFacts.length ? {
		...pluginUpdate,
		failureFacts: normalizeUpdateFailureFacts([...pluginUpdate.failureFacts ?? [], ...validation.failureFacts])
	} : pluginUpdate;
	if (pluginUpdate.status === "error" && (pluginUpdate.reason !== "post-plugin-doctor-execution-failed" || validation.status === "execution-failed")) return result;
	const executionFailed = validation.status === "execution-failed";
	return {
		...result,
		status: "error",
		reason: executionFailed ? POST_PLUGIN_CONFIG_VALIDATION_EXECUTION_FAILED_REASON : "post-plugin-doctor-invalid-config",
		warnings: [...pluginUpdate.warnings ?? [], executionFailed ? {
			reason: validation.failureFacts.map((fact) => fact.message).filter(Boolean).join("; "),
			message: "Config validation could not complete; refusing to restart.",
			guidance: ["Resolve the validation command failure, then rerun `openclaw update repair`."]
		} : {
			reason: "Config remained invalid after updated plugin migrations.",
			message: "Post-update plugin migration did not produce a valid config; refusing to restart.",
			guidance: ["Run `openclaw doctor --fix`, then rerun `openclaw update repair`."]
		}]
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
		if (!this.doctor) return;
		return {
			phase: this.doctor.phase,
			stdout: this.doctor.stdout.snapshot(),
			stderr: this.doctor.stderr.snapshot()
		};
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
//#region src/cli/update-cli/update-command-fresh-doctor.ts
async function withPrePluginUpdateDoctorEnv(run) {
	return await withUpdateEnv({
		OPENCLAW_UPDATE_IN_PROGRESS: "1",
		[UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV]: "1",
		[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV]: "1",
		[UPDATE_POST_CORE_CONVERGENCE_ENV]: void 0
	}, run);
}
async function runUpdateFinalizationDoctorInFreshProcess(params) {
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
	assertCurrent();
	try {
		const commandOptions = {
			cwd: params.root,
			timeoutMs: params.opts ? parseUpdateTimeoutMs(params.opts.timeout) : params.timeoutMs,
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
			timeoutMs: params.timeoutMs,
			baseEnv,
			env: commandOptions.env
		}, assertCurrent));
		assertCurrent();
		if (doctorConfigWrites && executorFence && runId) {
			const snapshot = await readUpdateConfigSnapshot(resolveConfigPath());
			assertCurrent();
			const child = await withUpdateDoctorChild({
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
					yes: params.yes,
					workspaceSuggestions: params.workspaceSuggestions === true,
					...params.phase === "post-plugin" && process.env["OPENCLAW_UPDATE_POST_CORE"] === "1" ? { postCoreSchemaRepair: true } : {}
				}
			}, (runCommand) => runCommand([...workerCommand, "--doctor"], commandOptions));
			result = child;
			assertUpdateDoctorChildSucceeded(child);
			assertCurrent();
		} else {
			const child = await runUpdateDoctorProcess({
				root: params.root,
				runId: runId ?? params.runId ?? "",
				onProcessSettlement: (step) => {
					processSettlement = step;
				}
			}, [params.nodeRunner ?? resolveNodeRunner(), ...args], commandOptions);
			result = child;
			assertUpdateDoctorChildSucceeded(child);
			assertCurrent();
		}
	} catch (error) {
		failure = { error };
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
			if (isRecord(error)) result = error;
			if (!(isRecord(error) && error.exitCode === 86 && isPlainCommandExitFailure({
				...error,
				failed: error.failed === true,
				cause: error.cause
			}) && doctorResult?.status === "advisory")) {
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
				if (params.phase === "post-plugin" && !(isRecord(error) && error.isCanceled === true) && failureFacts.every((fact) => fact.check === "doctor" && fact.code === "doctor-failed")) warning = {
					reason: "doctor-advisory",
					message: `Post-update plugin Doctor did not complete${exitCode == null ? "" : ` (exit ${exitCode})`}: ${message}`,
					guidance: ["Run `openclaw update repair` to retry post-update plugin repair."]
				};
				else throw new UpdateDoctorError(message, failureFacts, {
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
		if (params.databaseBackup) {
			const step = {
				name: "database migration writes",
				command: "record Doctor database write fingerprints",
				cwd: params.root,
				durationMs: 0,
				exitCode: 0
			};
			recordUpdateDatabaseWrites(params.databaseBackup, doctorResult?.databaseWrites, step);
			params.onDoctorStep?.(step);
		}
		if (doctorResult?.warnings?.length) params.onWarnings?.(doctorResult.warnings);
		if (typeof result?.stdout === "string" && result.stdout.trim()) defaultRuntime[params.json ? "error" : "log"](result.stdout.trimEnd());
		if (typeof result?.stderr === "string" && result.stderr.trim()) defaultRuntime.error(result.stderr.trimEnd());
	} catch (error) {
		failure = { error: failure ? new AggregateError([failure.error, error], "Doctor result recording failed", { cause: error }) : error };
	}
	if (failure) throw failure.error;
	if (warning) return warning;
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
	if (pluginUpdate.status !== "error") try {
		entryPath = await resolveGatewayInstallEntrypoint(params.root);
		assertCurrent();
		if (!entryPath) throw new Error("Updated OpenClaw entrypoint not found for post-plugin doctor");
		const freshDoctorRequired = params.freshDoctorRequired || hasDeferredUpdateModelRetirement() || (await readDeferredPluginMigrationsAsync()).length > 0;
		assertCurrent();
		if (freshDoctorRequired) {
			await params.beforeDoctor?.();
			const warning = await runUpdateFinalizationDoctorInFreshProcess({
				...params,
				assertCurrent,
				onAuthorityRefused: () => {
					authorityFailed = true;
				},
				entryPath,
				phase: "post-plugin"
			});
			if (warning) pluginUpdate = {
				...pluginUpdate,
				status: "warning",
				reason: POST_PLUGIN_DOCTOR_EXECUTION_FAILED_REASON,
				warnings: [...pluginUpdate.warnings ?? [], warning]
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
