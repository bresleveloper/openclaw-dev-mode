import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import { i as getLogger } from "./logger--ALOusOG.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { o as resolveAggregateSqliteInspectionTimeoutMs } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { d as isConfiguredPluginPathDiagnosticCode } from "./discovery-D_5mAUI7.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { d as resolveRegistryUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { i as isTrustedOfficialPluginInstallRecord } from "./official-external-install-records-CwKXyAFm.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { n as getDeferredPluginMigrationConfigFacts, o as setDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { o as redactSupportString, r as redactPublicSupportDiagnosticLine } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { i as parseConfigFailureFacts, n as createUpdateFailureFact, r as normalizeUpdateFailureFacts } from "./update-failure-facts-DiyYJNo1.mjs";
import { l as createUpdatePostInstallDoctorResultPath, n as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, r as UpdateDoctorError, s as consumeUpdatePostInstallDoctorResult } from "./update-doctor-result-CoUVRLb-.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { a as runUtf8CommandWithTimeout, n as runExec } from "./exec-shcN2-sN.mjs";
import { n as truncateUtf8Suffix, t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { i as isPlainCommandExitFailure, n as createSanitizedCommandError, r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cko-Hb6h.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { r as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-BWZUhXdG.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-DM9cJimf.mjs";
import { t as comparePackageUpdateVersions } from "./package-update-utils-Ds9d2bwt.mjs";
import { d as resolveExactNpmSpecVersion, h as resolveNpmSpecPackageName, o as isPluginInstallRecordUpdateSource } from "./update-source-Vnd12AXL.mjs";
import { r as resolveOfficialPluginCohortNpmSpecs } from "./plugin-version-drift-CKIIcvZc.mjs";
import { s as stripGatewayServiceMarkerEnv, t as disableUpdatedPackageCompileCacheEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { t as resolveNodeRunner } from "./node-runner-Cua6MUxg.mjs";
import { a as withoutPluginInstallRecords, i as withPluginInstallRecords } from "./installed-plugin-index-records-Clh203og.mjs";
import { a as parseUpdateDoctorLintReport } from "./update-doctor-lint-BYChkM7H.mjs";
import { d as UpdateCommandRecoveryPendingError } from "./update-command-executor-BQrAUjan.mjs";
import { C as createUpdateCommandAuthority } from "./update-command-terminal-3Hu1mJ4t.mjs";
import { i as formatCommandResult, r as formatCommandOutput } from "./command-error-CLRWADNl.mjs";
import { c as resolveUpdateInstallKind } from "./update-check-CtYi2ZDp.mjs";
import { t as hasDeferredUpdateModelRetirement } from "./update-deferred-model-retirement-DJCYa98D.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { l as parseUpdateTimeoutMs } from "./shared-OuJSSGTT.mjs";
import { c as withUpdateConfigWriteAuthority } from "./update-command-config-DgQs2s0y.mjs";
import { a as UPDATE_POST_CORE_CONVERGENCE_ENV, d as resolvePostCoreConvergenceEnv, i as UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV, t as UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV } from "./update-phase-DiVB4MDN.mjs";
import { d as readUpdateStateDatabaseSizes, r as collectStateDatabasePaths } from "./update-candidate-state-Cd-yslJu.mjs";
import "./update-post-core-context-B2x24New.mjs";
import { t as buildUpdateDoctorEnv } from "./update-runner-doctor-7D6CAY3P.mjs";
import { n as readUpdateConfigSnapshot } from "./update-command-config-snapshot-BI95iCNP.mjs";
import { n as inspectUpdateDoctorChildSupport, r as withUpdateDoctorChild, t as assertUpdateDoctorChildSucceeded } from "./update-command-doctor-child-BUI0zBFW.mjs";
import { c as buildInvalidConfigPostCoreUpdateResult, d as createPluginUpdateWarning, s as assessPluginUpdate } from "./update-command-readiness-yZgWiAm5.mjs";
import { F as attachPluginInstallOwnerMigrations, z as resolvePluginInstallOwnerMigrations } from "./npm-managed-root-7qY5QxhU.mjs";
import { i as restoreDoctorConfigEnvRefs, r as prepareDoctorConfigReferenceSource } from "./config-flow-steps-Dryu__9L.mjs";
import { n as VERSION_BOUND_RUNTIME_PLUGIN_IDS } from "./configured-runtime-plugin-installs-DW1vCQmx.mjs";
import { t as assertInstalledPluginIdRecoveryCurrent } from "./installed-plugin-id-recovery-BnvU17p3.mjs";
import { o as resolveSourceCheckoutBundledPluginIds } from "./bundled-sources-Bi9l5Ik4.mjs";
import { t as collectMissingPluginInstallPayloads } from "./payload-verification-DlThdi1u.mjs";
import { n as updateNpmInstalledPlugins, r as isClawHubTrustSkippedOutcome, t as syncPluginsForUpdateChannel } from "./update-19A9fnkg.mjs";
import { t as runPostCorePluginConvergence } from "./post-core-plugin-convergence-C9BOOCsE.mjs";
import { i as commitPluginInstallRecordsWithConfig } from "./install-record-commit-CuY4htih.mjs";
import { t as listPersistedBundledPluginLocationBridges } from "./location-bridges-CupxxkaU.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-CjDZjO2j.mjs";
import { r as reconcilePluginPackageUpdateConfig, t as capturePluginPackageUpdateSnapshot } from "./plugin-package-update-TBujoH_n.mjs";
import { n as resolvePluginCapabilityConsentCliOptions } from "./plugin-capability-consent-DV06eSCs.mjs";
import { c as withGatewayRuntimeArtifactPublication } from "./update-command-service-maintenance-DEAFUd_Y.mjs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
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
	let entryPath = params.entryPath;
	if (!entryPath) try {
		entryPath = await resolveGatewayInstallEntrypoint(params.root);
	} catch (error) {
		return createPostPluginReadinessExecutionFailure(params.pluginUpdate, String(error));
	}
	if (!entryPath) return createPostPluginReadinessExecutionFailure(params.pluginUpdate, "Updated OpenClaw entrypoint not found for post-plugin readiness checks");
	const args = [
		entryPath,
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
	const previousValues = [
		"OPENCLAW_UPDATE_IN_PROGRESS",
		UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV,
		UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV,
		UPDATE_POST_CORE_CONVERGENCE_ENV
	].map((key) => [key, process.env[key]]);
	process.env.OPENCLAW_UPDATE_IN_PROGRESS = "1";
	process.env[UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV] = "1";
	process.env[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV] = "1";
	delete process.env[UPDATE_POST_CORE_CONVERGENCE_ENV];
	try {
		return await run();
	} finally {
		for (const [key, value] of previousValues) if (value === void 0) delete process.env[key];
		else process.env[key] = value;
	}
}
async function withNormalConfigValidation(run) {
	const previousUpdateInProgress = process.env.OPENCLAW_UPDATE_IN_PROGRESS;
	process.env.OPENCLAW_UPDATE_IN_PROGRESS = "0";
	try {
		return await run();
	} finally {
		if (previousUpdateInProgress === void 0) delete process.env.OPENCLAW_UPDATE_IN_PROGRESS;
		else process.env.OPENCLAW_UPDATE_IN_PROGRESS = previousUpdateInProgress;
	}
}
function createPostPluginDoctorExecutionFailure(pluginUpdate, reason, failureFacts) {
	return {
		...pluginUpdate,
		status: "error",
		reason: POST_PLUGIN_DOCTOR_EXECUTION_FAILED_REASON,
		...failureFacts?.length ? { failureFacts } : {},
		warnings: [...pluginUpdate.warnings ?? [], {
			reason,
			message: `Post-update plugin Doctor did not complete: ${reason}`,
			guidance: ["Run `openclaw update repair` to retry post-update plugin repair."]
		}]
	};
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
	let doctorResult = null;
	let doctorSettled = true;
	let result;
	assertCurrent();
	try {
		const commandOptions = {
			cwd: params.root,
			timeoutMs: params.opts ? parseUpdateTimeoutMs(params.opts.timeout) : params.timeoutMs,
			maxBuffer: 4194304,
			logOutput: false,
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
					assertRequesterCurrent
				},
				input: {
					configInputHash: snapshot.hash,
					repair: true,
					yes: params.yes,
					workspaceSuggestions: params.workspaceSuggestions === true,
					...params.phase === "post-plugin" && process.env["OPENCLAW_UPDATE_POST_CORE"] === "1" ? { postCoreSchemaRepair: true } : {}
				}
			}, (runCommand) => runCommand([...workerCommand, "--doctor"], {
				...commandOptions,
				maxOutputBytes: commandOptions.maxBuffer,
				terminateOnOutputLimit: true
			}));
			result = child;
			assertUpdateDoctorChildSucceeded(child);
			assertCurrent();
		} else {
			result = await runExec(params.nodeRunner ?? resolveNodeRunner(), args, commandOptions);
			assertCurrent();
		}
	} catch (error) {
		if (hasCommandProcessCleanupError(error) || isRecord(error) && error.cleanup === "uncertain") {
			doctorSettled = false;
			throw new CommandProcessCleanupError({ cause: error });
		}
		if (collectNestedErrorCandidates(error).some((cause) => cause instanceof UpdateCommandRecoveryPendingError || cause instanceof UpdateRequesterRevokedError)) refuseAuthority(error);
		assertCurrent();
		doctorResult = await consumeUpdatePostInstallDoctorResult(doctorResultPath);
		if (doctorResult?.configWriteRefusal?.reason === "authority-check-failed" || doctorResult?.configWriteRefusal?.reason === "requester-revoked") refuseAuthority(error);
		if (isRecord(error)) {
			result = error;
			if (error.exitCode === 86 && isPlainCommandExitFailure({
				...error,
				failed: error.failed === true,
				cause: error.cause
			}) && doctorResult?.status === "advisory") return;
		}
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
		if (params.phase === "post-plugin" && !(isRecord(error) && error.isCanceled === true) && failureFacts.every((fact) => fact.check === "doctor" && fact.code === "doctor-failed")) return {
			reason: "doctor-advisory",
			message: `Post-update plugin Doctor did not complete${exitCode == null ? "" : ` (exit ${exitCode})`}: ${message}`,
			guidance: ["Run `openclaw update repair` to retry post-update plugin repair."]
		};
		throw new UpdateDoctorError(message, failureFacts, {
			cause: error,
			exitCode
		});
	} finally {
		if (doctorSettled) doctorResult ??= await consumeUpdatePostInstallDoctorResult(doctorResultPath);
		if (doctorResult?.warnings?.length) params.onWarnings?.(doctorResult.warnings);
		if (typeof result?.stdout === "string" && result.stdout.trim()) defaultRuntime[params.json ? "error" : "log"](result.stdout.trimEnd());
		if (typeof result?.stderr === "string" && result.stderr.trim()) defaultRuntime.error(result.stderr.trimEnd());
	}
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
		if (params.freshDoctorRequired || hasDeferredUpdateModelRetirement()) {
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
		if (authorityFailed || hasCommandProcessCleanupError(err)) throw err;
		assertCurrent();
		pluginUpdate = createPostPluginDoctorExecutionFailure(params.pluginUpdate, String(err), err instanceof UpdateDoctorError ? err.failureFacts : void 0);
	}
	assertCurrent();
	const configSnapshot = await withNormalConfigValidation(() => readConfigFileSnapshot({
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
//#region src/plugins/update-cohort.ts
/** Aligns managed plugin install sources and official packages with one core release cohort. */
async function convergePluginReleaseCohort(params) {
	return await withPluginLifecycleLease({
		env: params.env,
		assertCurrent: params.beforePersistentEffect
	}, () => convergePluginReleaseCohortWithLease(params));
}
async function convergePluginReleaseCohortWithLease(params) {
	const operatorManaged = [];
	const operatorManagedIds = /* @__PURE__ */ new Set();
	if (params.config.plugins?.load?.paths?.length) {
		const index = withPluginCache(createPluginCache(), () => loadInstalledPluginIndex({
			config: params.config,
			installRecords: params.config.plugins?.installs ?? {},
			workspaceDir: params.workspaceDir,
			env: params.env
		}));
		const resolver = createInstalledPluginOwnershipResolver(index, params.env);
		for (const plugin of index.plugins) {
			if (plugin.origin !== "config") continue;
			const resolved = resolver.resolveUpdate(plugin.pluginId);
			if (!resolved.ok) throw new Error(resolved.error);
			if (resolved.value.kind !== "operator-managed") continue;
			const { source, rootDir, shadowedInstallOwner, shadowedInstallRecord } = resolved.value;
			operatorManagedIds.add(plugin.pluginId);
			if (shadowedInstallOwner) operatorManagedIds.add(shadowedInstallOwner);
			const shadowed = shadowedInstallRecord ? ` It shadows the ${shadowedInstallRecord.source} install ${shadowedInstallRecord.spec ?? plugin.pluginId}${shadowedInstallRecord.installPath ? ` at ${shadowedInstallRecord.installPath}` : ""}.` : "";
			const guidance = `This copy was not updated; verify it against ${params.coreVersion ?? "the updated OpenClaw version"} or remove it from plugins.load.paths.`;
			const message = `Plugin "${plugin.pluginId}" is operator-managed by plugins.load.paths. ${guidance} Source: ${rootDir}.${shadowed}`;
			operatorManaged.push({
				pluginId: plugin.pluginId,
				status: "skipped",
				code: "plugin-operator-managed",
				source,
				rootDir,
				shadowedInstallOwner,
				shadowedInstallRecord,
				message,
				guidance: [guidance]
			});
			params.logger?.warn?.(message);
		}
	}
	const sync = await syncPluginsForUpdateChannel({
		config: params.config,
		channel: params.channel,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		coreVersion: params.coreVersion,
		skipIds: operatorManagedIds,
		workspaceDir: params.workspaceDir,
		env: params.env,
		externalizedBundledPluginBridges: params.externalizedBundledPluginBridges,
		logger: params.logger,
		onCapabilityConsent: params.onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect
	});
	params.beforePersistentEffect?.();
	let config = sync.config;
	const npmInstallSpecOverrides = params.coreVersion ? resolveOfficialPluginCohortNpmSpecs({
		gatewayVersion: params.coreVersion,
		installRecords: config.plugins?.installs ?? {},
		config
	}) : void 0;
	let changed = sync.changed;
	let npmChanged = false;
	let installOwners = Object.entries(config.plugins?.installs ?? {}).filter(([id, record]) => !operatorManagedIds.has(id) && isPluginInstallRecordUpdateSource(record)).map(([id]) => id);
	if (installOwners.length > 0) {
		const sourceBundledIds = resolveSourceCheckoutBundledPluginIds({
			config,
			installRecords: config.plugins?.installs ?? {},
			env: params.env
		});
		installOwners = installOwners.filter((id) => !sourceBundledIds.has(id));
	}
	const beforeIndex = installOwners.length ? withPluginCache(createPluginCache(), () => loadInstalledPluginIndex({
		config,
		installRecords: config.plugins?.installs ?? {},
		workspaceDir: params.workspaceDir,
		env: params.env
	})) : void 0;
	const packageUpdateSnapshot = beforeIndex ? capturePluginPackageUpdateSnapshot({
		index: beforeIndex,
		installOwners,
		env: params.env
	}) : void 0;
	if (packageUpdateSnapshot && !packageUpdateSnapshot.ok) throw new Error(packageUpdateSnapshot.error);
	const installOwnerMigrations = {};
	const missingPayloads = (await collectMissingPluginInstallPayloads({
		records: config.plugins?.installs ?? {},
		config,
		skipDisabledPlugins: true,
		syncOfficialPluginInstalls: true,
		env: params.env
	})).filter((entry) => !operatorManagedIds.has(entry.pluginId));
	const repairedMissingPayloadIds = new Set(missingPayloads.map((entry) => entry.pluginId));
	let repairOutcomes = [];
	if (repairedMissingPayloadIds.size > 0) {
		const repair = await updateNpmInstalledPlugins({
			config,
			npmInstallSpecOverrides,
			pluginIds: [...repairedMissingPayloadIds],
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			updateChannel: params.channel,
			coreVersion: params.coreVersion,
			versionBoundPluginIds: params.versionBoundPluginIds,
			skipDisabledPlugins: true,
			syncOfficialPluginInstalls: true,
			retainOnUnavailable: true,
			logger: params.logger,
			onIntegrityDrift: params.onIntegrityDrift,
			onCapabilityConsent: params.onCapabilityConsent,
			beforePersistentEffect: params.beforePersistentEffect
		});
		params.beforePersistentEffect?.();
		config = repair.config;
		changed ||= repair.changed;
		npmChanged ||= repair.changed;
		repairOutcomes = repair.outcomes;
		Object.assign(installOwnerMigrations, resolvePluginInstallOwnerMigrations(repair));
	}
	const update = await updateNpmInstalledPlugins({
		config,
		npmInstallSpecOverrides,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		updateChannel: params.channel,
		coreVersion: params.coreVersion,
		skipIds: /* @__PURE__ */ new Set([
			...operatorManagedIds,
			...sync.summary.switchedToClawHub,
			...sync.summary.switchedToNpm,
			...repairedMissingPayloadIds,
			...Object.values(installOwnerMigrations)
		]),
		versionBoundPluginIds: params.versionBoundPluginIds,
		skipDisabledPlugins: true,
		syncOfficialPluginInstalls: true,
		retainOnUnavailable: true,
		logger: params.logger,
		onIntegrityDrift: params.onIntegrityDrift,
		onCapabilityConsent: params.onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect
	});
	params.beforePersistentEffect?.();
	config = update.config;
	changed ||= update.changed;
	npmChanged ||= update.changed;
	Object.assign(installOwnerMigrations, resolvePluginInstallOwnerMigrations(update));
	if (beforeIndex && packageUpdateSnapshot) {
		const afterIndex = withPluginCache(createPluginCache(), () => loadInstalledPluginIndex({
			config,
			installRecords: config.plugins?.installs ?? {},
			workspaceDir: params.workspaceDir,
			env: params.env
		}));
		const reconciled = reconcilePluginPackageUpdateConfig({
			config,
			beforeIndex,
			afterIndex,
			snapshot: packageUpdateSnapshot.value,
			installOwnerMigrations,
			env: params.env
		});
		if (!reconciled.ok) throw new Error(reconciled.error);
		changed ||= reconciled.config !== config;
		config = reconciled.config;
	}
	const result = {
		config,
		changed,
		npmChanged,
		sync,
		missingPayloads,
		repairedMissingPayloadIds,
		repairOutcomes,
		updateOutcomes: [...operatorManaged, ...update.outcomes.filter((outcome) => !operatorManagedIds.has(outcome.pluginId) && (outcome.status !== "skipped" || !repairedMissingPayloadIds.has(outcome.pluginId)))],
		remainingMissingPayloads: (await collectMissingPluginInstallPayloads({
			records: config.plugins?.installs ?? {},
			config,
			skipDisabledPlugins: true,
			syncOfficialPluginInstalls: true,
			env: params.env
		})).filter((entry) => !operatorManagedIds.has(entry.pluginId))
	};
	return Object.keys(installOwnerMigrations).length > 0 ? attachPluginInstallOwnerMigrations(result, installOwnerMigrations) : result;
}
//#endregion
//#region src/cli/update-cli/update-command-plugins.ts
function formatPluginUpdateWarning(message) {
	return message.includes("╭─") ? message : theme.warn(message);
}
function formatMissingPluginPayloadReason(entry) {
	if (entry.reason === "missing-install-path") return "installPath is missing";
	if (entry.reason === "missing-package-json") return `package.json is missing under ${entry.installPath}`;
	return `package directory is missing: ${entry.installPath}`;
}
function collectPluginChannelFallbackMessages(outcomes) {
	const seen = /* @__PURE__ */ new Set();
	const messages = [];
	for (const outcome of outcomes) {
		const message = outcome.channelFallback?.message;
		if (!message || seen.has(message)) continue;
		seen.add(message);
		messages.push(message);
	}
	return messages;
}
function isDisabledAfterFailureOutcome(outcome) {
	return outcome.status === "skipped" && outcome.message.includes("after plugin update failure");
}
function isActionableSkippedPostUpdateOutcome(outcome) {
	return isDisabledAfterFailureOutcome(outcome) || isClawHubTrustSkippedOutcome(outcome);
}
async function updatePluginsAfterCoreUpdate(params) {
	if (!params.configSnapshot.valid) return await updatePluginsAfterCoreUpdateWithLease(params);
	return await withPluginLifecycleLease({ assertCurrent: params.assertCurrent }, (lease) => updatePluginsAfterCoreUpdateWithLease({
		...params,
		assertCurrent: () => lease.assertOwned()
	}));
}
async function updatePluginsAfterCoreUpdateWithLease(params) {
	params.assertCurrent?.();
	const runtime = params.runtime ?? defaultRuntime;
	const requirements = { ...params.pluginRequirements };
	if (!params.configSnapshot.valid) {
		const invalid = buildInvalidConfigPostCoreUpdateResult();
		if (!params.json) {
			runtime.log(theme.error(invalid.message));
			for (const line of invalid.guidance) runtime.log(theme.muted(`  ${line}`));
		}
		return {
			...invalid.result,
			assessment: {
				kind: "core-critical",
				reason: "invalid-config"
			}
		};
	}
	const referenceSource = prepareDoctorConfigReferenceSource(params.configSnapshot);
	const clawHubTrustNotices = /* @__PURE__ */ new Set();
	const loggedPluginWarnings = /* @__PURE__ */ new Set();
	const pluginLogger = {
		...params.json ? { terminalLinks: false } : {},
		info: (msg) => {
			if (!params.json) runtime.log(msg);
		},
		warn: (msg) => {
			const plain = stripAnsi(msg);
			if (plain.includes("ClawHub Security Audit") && (params.json || plain.includes("Outcome: Review"))) clawHubTrustNotices.add(plain);
			if (!params.json && plain.includes("ClawHub") && plain.includes("╭─") && !loggedPluginWarnings.has(plain)) {
				runtime.log(formatPluginUpdateWarning(msg));
				loggedPluginWarnings.add(plain);
			}
		}
	};
	if (!params.json) {
		runtime.log("");
		runtime.log(theme.heading("Updating plugins..."));
	}
	let warnings = [];
	const capabilityConsent = params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : resolvePluginCapabilityConsentCliOptions({
		acceptCapabilities: params.acceptCapabilities,
		action: "update",
		allowPrompt: !params.json,
		runtime
	});
	const pluginInstallRecords = params.pluginInstallRecords ?? await loadInstalledPluginIndexInstallRecords();
	const coreVersion = await readPackageVersion(params.root);
	const pluginUpdateChannel = resolveRegistryUpdateChannel({
		configChannel: params.channel,
		currentVersion: coreVersion
	});
	const integrityDrifts = [];
	const pluginUpdateOutcomes = [];
	const collectPluginOutcome = (outcome) => {
		if (outcome.status === "skipped" && outcome.code === "plugin-operator-managed") warnings.push({
			pluginId: outcome.pluginId,
			source: outcome.rootDir,
			reason: outcome.code,
			message: outcome.message,
			guidance: outcome.guidance
		});
		if (outcome.status !== "error" && !isActionableSkippedPostUpdateOutcome(outcome)) {
			pluginUpdateOutcomes.push(outcome);
			return;
		}
		const includeWarningInReason = params.json || !outcome.warning || !loggedPluginWarnings.has(stripAnsi(outcome.warning));
		const warning = createPluginUpdateWarning({
			...outcome.pluginId && outcome.pluginId !== "unknown" ? { pluginId: outcome.pluginId } : {},
			reason: outcome.warning && includeWarningInReason ? `${outcome.warning}\n${outcome.message}` : outcome.message
		});
		pluginUpdateOutcomes.push(outcome);
		warnings.push(warning);
	};
	const collectMissingPayloadOutcome = (entry) => {
		const warning = createPluginUpdateWarning({
			pluginId: entry.pluginId,
			reason: `Plugin install payload missing after update: ${formatMissingPluginPayloadReason(entry)}.`,
			kind: "load"
		});
		warnings.push(warning);
		pluginUpdateOutcomes.push({
			pluginId: entry.pluginId,
			status: "error",
			message: warning.message
		});
		return warning;
	};
	const onPluginIntegrityDrift = async (drift) => {
		integrityDrifts.push({
			pluginId: drift.pluginId,
			spec: drift.spec,
			expectedIntegrity: drift.expectedIntegrity,
			actualIntegrity: drift.actualIntegrity,
			...drift.resolvedSpec ? { resolvedSpec: drift.resolvedSpec } : {},
			...drift.resolvedVersion ? { resolvedVersion: drift.resolvedVersion } : {},
			action: "aborted"
		});
		return false;
	};
	const externalizedBundledPluginBridges = await listPersistedBundledPluginLocationBridges({ workspaceDir: params.root });
	params.assertCurrent?.();
	const cohort = await convergePluginReleaseCohort({
		config: withPluginInstallRecords(params.configSnapshot.sourceConfig, pluginInstallRecords),
		channel: pluginUpdateChannel,
		coreVersion: coreVersion ?? void 0,
		versionBoundPluginIds: VERSION_BOUND_RUNTIME_PLUGIN_IDS,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		workspaceDir: params.root,
		externalizedBundledPluginBridges,
		beforePersistentEffect: params.assertCurrent,
		logger: pluginLogger,
		onIntegrityDrift: onPluginIntegrityDrift,
		...capabilityConsent
	});
	params.assertCurrent?.();
	for (const error of cohort.sync.summary.errors) collectPluginOutcome({
		...error,
		status: "error"
	});
	for (const warning of cohort.sync.summary.warnings) getLogger().warn(warning);
	let pluginConfig = cohort.config;
	let pluginsChanged = cohort.changed || params.configChanged === true;
	for (const entry of cohort.missingPayloads) collectMissingPayloadOutcome(entry);
	pluginUpdateOutcomes.push(...cohort.repairOutcomes);
	for (const rawOutcome of cohort.updateOutcomes) collectPluginOutcome(rawOutcome);
	for (const entry of cohort.remainingMissingPayloads) if (!cohort.repairedMissingPayloadIds.has(entry.pluginId)) collectMissingPayloadOutcome(entry);
	const convergenceBaselineRecords = pluginConfig.plugins?.installs ?? {};
	const probedNpmRecords = new Map(cohort.updateOutcomes.map(({ pluginId }) => {
		const record = convergenceBaselineRecords[pluginId];
		return [pluginId, record?.source === "npm" ? { ...record } : void 0];
	}));
	const convergenceEnv = resolvePostCoreConvergenceEnv(process.env, coreVersion ?? void 0);
	const convergence = await runPostCorePluginConvergence({
		cfg: pluginConfig,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		configPersistence: "caller",
		env: convergenceEnv,
		compatibilityHostVersion: coreVersion ?? void 0,
		baselineInstallRecords: convergenceBaselineRecords,
		beforePersistentEffect: params.assertCurrent,
		...capabilityConsent
	});
	params.assertCurrent?.();
	const repairedPluginIds = /* @__PURE__ */ new Set([...[...cohort.repairOutcomes, ...cohort.updateOutcomes].filter((outcome) => outcome.status === "updated" || outcome.status === "unchanged").map((outcome) => outcome.pluginId), ...convergence.repairedPluginIds ?? []]);
	warnings = warnings.filter((warning) => !warning.pluginId || !repairedPluginIds.has(warning.pluginId));
	for (const pluginId of convergence.repairedPluginIds ?? []) {
		const before = convergenceBaselineRecords[pluginId];
		const after = convergence.installRecords[pluginId];
		pluginUpdateOutcomes.push({
			pluginId,
			status: "updated",
			currentVersion: before?.resolvedVersion ?? before?.version,
			nextVersion: after?.resolvedVersion ?? after?.version,
			message: `Repaired plugin "${pluginId}".`
		});
	}
	for (const change of convergence.changes) if (!params.json) runtime.log(theme.muted(change));
	const convergenceWarnings = convergence.warnings.map((warning) => createPluginUpdateWarning({
		...warning,
		kind: warning.kind === "repair" ? "update" : warning.kind
	}));
	const convergenceOutcomes = [...convergence.outcomes ?? [], ...convergence.warnings.flatMap((warning) => warning.pluginId ? [{
		pluginId: warning.pluginId,
		status: "error",
		message: warning.message
	}] : [])];
	for (const warning of [...convergenceWarnings, ...convergence.notices ?? []]) warnings.push(warning);
	for (const outcome of convergenceOutcomes) {
		pluginUpdateOutcomes.push(outcome);
		if (outcome.status === "error" || isActionableSkippedPostUpdateOutcome(outcome)) {
			const warning = createPluginUpdateWarning({
				pluginId: outcome.pluginId,
				reason: outcome.message
			});
			if (!warnings.some((entry) => entry.pluginId === warning.pluginId)) warnings.push(warning);
		}
	}
	pluginConfig = withPluginInstallRecords(convergence.config, convergence.installRecords);
	for (const outcome of cohort.updateOutcomes) {
		const record = convergence.installRecords[outcome.pluginId];
		const probed = probedNpmRecords.get(outcome.pluginId);
		if (outcome.status !== "unchanged" || !outcome.currentVersion || record?.source !== "npm" || record.spec !== probed?.spec) continue;
		const unavailable = outcome.code === "plugin-target-unavailable";
		if (unavailable ? record.installPath !== probed?.installPath || record.version !== probed?.version || record.resolvedVersion !== probed?.resolvedVersion : !outcome.nextVersion || comparePackageUpdateVersions(outcome.nextVersion, outcome.currentVersion) <= 0 || (record.resolvedVersion ?? record.version) !== outcome.currentVersion || resolveExactNpmSpecVersion(record.spec) !== outcome.currentVersion || !isTrustedOfficialPluginInstallRecord({
			pluginId: outcome.pluginId,
			packageName: resolveNpmSpecPackageName(record.spec),
			record
		})) continue;
		const message = unavailable ? outcome.message : `Plugin update retained an official plugin pin: ${outcome.message}`;
		warnings.push({
			pluginId: outcome.pluginId,
			reason: unavailable ? "plugin-target-unavailable" : "retained-plugin-pin",
			message,
			guidance: unavailable ? [formatCliCommand(`openclaw plugins update ${outcome.pluginId}`)] : ["Keep the pin if intentional; replacing it is an explicit operator choice."]
		});
		if (unavailable) getLogger().warn(message);
	}
	if (convergence.changes.length > 0 || convergence.configChanges.length > 0) pluginsChanged = true;
	if (pluginsChanged) {
		const nextInstallRecords = pluginConfig.plugins?.installs ?? {};
		const appliedPluginIdMigrations = Object.fromEntries(Object.entries(resolvePluginInstallOwnerMigrations(cohort) ?? {}).filter(([fromId, toId]) => !Object.hasOwn(nextInstallRecords, fromId) && Object.hasOwn(nextInstallRecords, toId)));
		const installedPluginIdRecovery = convergence.installedPluginIdRecovery;
		let nextConfig = withoutPluginInstallRecords(pluginConfig);
		if (referenceSource) {
			referenceSource.installedPluginIdRecovery = installedPluginIdRecovery;
			nextConfig = restoreDoctorConfigEnvRefs(nextConfig, referenceSource, params.configWriteOptions.explicitSetPaths, { appliedPluginIdMigrations });
		}
		if (params.restoredAuthoredChannels !== void 0) nextConfig = {
			...nextConfig,
			channels: structuredClone(params.restoredAuthoredChannels)
		};
		setDeferredPluginMigrationConfigFacts(nextConfig, getDeferredPluginMigrationConfigFacts(params.configSnapshot.sourceConfig));
		const guardedWriteOptions = withUpdateConfigWriteAuthority(params.configWriteOptions, params.assertCurrent);
		const commit = async (lease) => {
			const assertCurrent = () => {
				guardedWriteOptions.assertCurrent?.();
				lease?.assertOwned();
			};
			assertCurrent();
			await assertInstalledPluginIdRecoveryCurrent(params.configSnapshot.sourceConfig, installedPluginIdRecovery, convergenceEnv);
			assertCurrent();
			await commitPluginInstallRecordsWithConfig({
				beforePersistentEffect: assertCurrent,
				previousInstallRecords: pluginInstallRecords,
				nextInstallRecords,
				nextConfig,
				baseHash: params.configSnapshot.hash,
				writeOptions: {
					...guardedWriteOptions,
					observe: false,
					assertCurrent,
					beforeCommit: async () => {
						assertCurrent();
						await params.configWriteOptions.beforeCommit?.();
						assertCurrent();
						await assertInstalledPluginIdRecoveryCurrent(params.configSnapshot.sourceConfig, installedPluginIdRecovery, convergenceEnv);
						assertCurrent();
					},
					inputBase: "source",
					skipPluginValidation: true
				}
			});
		};
		if (installedPluginIdRecovery.size > 0) await withPluginLifecycleLease({ assertCurrent: params.assertCurrent }, commit);
		else await commit();
		if (!params.json) for (const change of convergence.configChanges) runtime.log(theme.muted(change));
		params.assertCurrent?.();
		await withPluginLifecycleLease({ assertCurrent: params.assertCurrent }, async (lease) => refreshPluginRegistryAfterConfigMutation({
			configPath: params.configSnapshot.path,
			reason: "source-changed",
			workspaceDir: params.root,
			installRecords: nextInstallRecords,
			invalidateRuntimeCache: false,
			logger: pluginLogger,
			lease
		}));
		params.assertCurrent?.();
	}
	for (const notice of clawHubTrustNotices) {
		if (warnings.some((warning) => warning.reason.includes(notice))) continue;
		warnings.push({
			reason: notice,
			message: notice,
			guidance: []
		});
	}
	const assessment = assessPluginUpdate({
		smokeFailures: convergence.smokeFailures,
		disabledPluginIds: [...new Set(pluginUpdateOutcomes.filter((outcome) => isDisabledAfterFailureOutcome(outcome) && pluginConfig.plugins?.entries?.[outcome.pluginId]?.enabled === false).map((outcome) => outcome.pluginId))],
		errored: convergence.errored,
		outcomes: pluginUpdateOutcomes,
		integrityDrift: integrityDrifts.length > 0,
		requirements
	});
	const finalPluginOutcomes = [...new Map(pluginUpdateOutcomes.map((outcome) => [outcome.pluginId, outcome])).values()];
	const result = {
		status: warnings.length > 0 || cohort.sync.summary.warnings.length > 0 || finalPluginOutcomes.some((outcome) => outcome.status === "error") ? "warning" : "ok",
		assessment,
		changed: pluginsChanged,
		warnings,
		sync: {
			changed: cohort.sync.changed,
			switchedToBundled: cohort.sync.summary.switchedToBundled,
			switchedToNpm: cohort.sync.summary.switchedToNpm,
			warnings: cohort.sync.summary.warnings,
			errors: cohort.sync.summary.errors.map((error) => error.message)
		},
		npm: {
			changed: cohort.npmChanged,
			outcomes: pluginUpdateOutcomes
		},
		integrityDrifts
	};
	if (params.json) return result;
	const summarizeList = (list) => {
		if (list.length <= 6) return list.join(", ");
		return `${list.slice(0, 6).join(", ")} +${list.length - 6} more`;
	};
	if (cohort.sync.summary.switchedToBundled.length > 0) runtime.log(theme.muted(`Switched to bundled plugins: ${summarizeList(cohort.sync.summary.switchedToBundled)}.`));
	if (cohort.sync.summary.switchedToNpm.length > 0) runtime.log(theme.muted(`Restored plugins: ${summarizeList(cohort.sync.summary.switchedToNpm)}.`));
	for (const warning of cohort.sync.summary.warnings) if (!loggedPluginWarnings.has(stripAnsi(warning))) {
		runtime.log(formatPluginUpdateWarning(warning));
		loggedPluginWarnings.add(stripAnsi(warning));
	}
	const updated = finalPluginOutcomes.filter((entry) => entry.status === "updated").length;
	const unchanged = finalPluginOutcomes.filter((entry) => entry.status === "unchanged").length;
	const failed = finalPluginOutcomes.filter((entry) => entry.status === "error").length;
	const skipped = finalPluginOutcomes.filter((entry) => entry.status === "skipped").length;
	if (pluginUpdateOutcomes.length === 0 && warnings.length === 0) runtime.log(theme.muted("No plugin updates needed."));
	else if (pluginUpdateOutcomes.length > 0) {
		const parts = [`${updated} updated`, `${unchanged} unchanged`];
		if (failed > 0) parts.push(`${failed} to retry`);
		if (skipped > 0) parts.push(`${skipped} skipped`);
		runtime.log(theme.muted(`Plugin updates: ${parts.join(", ")}.`));
	}
	for (const message of collectPluginChannelFallbackMessages(pluginUpdateOutcomes)) runtime.log(theme.warn(message));
	for (const warning of warnings) {
		const message = stripAnsi(warning.message);
		if (!loggedPluginWarnings.has(message)) {
			runtime.log(formatPluginUpdateWarning(warning.message));
			loggedPluginWarnings.add(message);
		}
	}
	return result;
}
//#endregion
//#region src/cli/update-cli/update-command-runtime.ts
function isSourceRuntimeStaging(value) {
	return isRecord(value) && typeof value.prepareBundledPluginRuntime === "function";
}
function isSourceArtifactOwnership(value) {
	return isRecord(value) && typeof value.withDistArtifactOwnership === "function";
}
/** Complete source-install artifacts before the target loads plugin configuration. */
async function completeSourceUpdateRuntime(params) {
	params.lease.assertOwned();
	if (await resolveUpdateInstallKind(params.root, {
		signal: params.lease.signal,
		timeoutMs: params.timeoutMs
	}) !== "git") {
		params.lease.assertOwned();
		return { changed: false };
	}
	const root = await fs.realpath(params.root);
	params.lease.assertOwned();
	const stagingFile = path.join(root, "scripts", "stage-bundled-plugin-runtime.mts");
	const stagingPresent = await fs.lstat(stagingFile).then(() => true, (error) => {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	});
	params.lease.assertOwned();
	if (!stagingPresent) return { changed: false };
	const staging = await import(pathToFileURL(stagingFile).href);
	params.lease.assertOwned();
	if (isRecord(staging) && staging.prepareBundledPluginRuntime === void 0 && typeof staging.stageBundledPluginRuntime === "function") return { changed: false };
	if (!isSourceRuntimeStaging(staging)) throw new Error("The installed source checkout cannot complete its runtime artifacts.");
	const ownership = await import(pathToFileURL(path.join(root, "scripts", "lib", "dist-artifact-ownership.mts")).href);
	params.lease.assertOwned();
	if (!isSourceArtifactOwnership(ownership)) throw new Error("The installed source checkout cannot complete its runtime artifacts.");
	return await ownership.withDistArtifactOwnership(root, async () => {
		params.lease.assertOwned();
		const prepared = staging.prepareBundledPluginRuntime({ repoRoot: root });
		try {
			params.lease.assertOwned();
			if (prepared.changed) {
				await params.beforePublication?.();
				params.lease.assertOwned();
				await withGatewayRuntimeArtifactPublication({
					root,
					env: process.env,
					timeoutMs: params.timeoutMs,
					assertCurrent: () => params.lease.assertOwned()
				}, async (assertPublicationCurrent) => {
					await prepared.publish(async () => {
						await params.beforePersistentEffect?.();
						await assertPublicationCurrent();
						params.lease.assertOwned();
					});
				});
			}
		} catch (error) {
			try {
				await prepared.cleanup();
			} catch (cleanupError) {
				throw new AggregateError([error, cleanupError], "Runtime completion and staging cleanup failed.", { cause: cleanupError });
			}
			throw error;
		}
		await prepared.cleanup();
		return { changed: prepared.changed };
	});
}
//#endregion
export { withPrePluginUpdateDoctorEnv as a, runUpdateFinalizationDoctorInFreshProcess as i, updatePluginsAfterCoreUpdate as n, UpdateFinalizationOutput as o, completePostCorePluginUpdate as r, completeSourceUpdateRuntime as t };
