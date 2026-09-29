import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { a as redactSupportDiagnosticLine, i as redactPublicSupportVersion, o as redactSupportString, r as redactPublicSupportDiagnosticLine } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { s as classifyUpdateOutcome } from "./update-outcome-ZpL2Kt9B.mjs";
import { a as isPublicUpdateFailureCode, c as resolvePublicUpdateStepId, r as normalizeUpdateFailureFacts, s as projectPublicUpdateFailureIdentifiers, u as updatePreflightDetailMessage } from "./update-failure-facts-THF-vx3i.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { S as reserveUpdateFailureReportReceipt, a as completeUpdateFailureReportReceiptCleanup, b as refreshUpdateFailureReportReceiptPreparation, d as hasUpdateFailureReportArtifactSweepLease, f as markUpdateFailureReportReceiptPending, n as beginUpdateFailureReportReceiptCleanup, o as finalizeUpdateFailureReportReceipt, p as markUpdateFailureReportReceiptPrepared, r as claimUpdateFailureReportArtifactSweep, t as beginStaleUpdateFailureReportReceiptCleanup, v as readUpdateFailureReportReceipt, x as releaseUpdateFailureReportArtifactSweep } from "./restart-sentinel-KM6PPxhT.mjs";
import { d as updateRunStepKey } from "./update-run-write-rAL063vt.mjs";
import { s as LEGACY_UPDATE_RUN_ADVISORY } from "./update-run-record-B5xSBZMw.mjs";
import { a as updateRunWarningMessages, n as isFailedUpdateStep } from "./update-run-step-ijjXM1mH.mjs";
import { a as formatNpmFailureFacts } from "./update-runner-command-DJ8Zpaha.mjs";
import { i as normalizeUpdateDoctorLintFindings } from "./update-doctor-lint-BRvmoWQ9.mjs";
import { a as publishPreparedUpdateFailureReport, i as listRetiredUpdateFailureReportArtifacts, n as discardSavedUpdateFailureReport, o as removeRetiredUpdateFailureReportArtifacts, r as discardSavedUpdateFailureReportBestEffort, s as savePreparedUpdateFailureReport, t as bindSavedReportArtifact } from "./update-failure-report-artifact-DFDox9ie.mjs";
import { n as selectUpdateFailureReportSteps, r as UPDATE_DESTINATION_RECOVERY, t as formatUpdateFailureFact } from "./update-failure-facts-format-Uhxv535Y.mjs";
import { n as formatUpdateRunIdentity, r as formatUpdateRunRecovery, s as updateRunReportInputFromResult, t as formatUpdateRunCurrentHealth } from "./update-run-report-Dh57tzMI.mjs";
import { t as readUpdateRunReportHealth } from "./update-run-report-health-CZRthy8u.mjs";
import { n as reconcileGithubIssue, r as submitGithubIssue, t as prepareGithubIssue } from "./github-issue-DeOhthiD.mjs";
import path from "node:path";
import { isIP } from "node:net";
import { createHash, randomUUID } from "node:crypto";
import { valid } from "semver";
//#region src/infra/update-failure-report-precreate.ts
var UpdateReportPreCreateGuardError = class extends Error {
	constructor(message, reason, options) {
		super(message, options);
		this.reason = reason;
		this.name = "UpdateReportPreCreateGuardError";
	}
};
function retryUpdateReportStateWrite(write) {
	for (let attempt = 0; attempt < 2; attempt += 1) try {
		if (write()) return true;
	} catch {}
	return false;
}
/** Gives a proven no-transport outcome time to outlive transient SQLite contention. */
async function retryUpdateReportStateWriteAfterNoStart(write) {
	for (const delayMs of [
		0,
		25,
		100,
		250,
		500
	]) {
		if (delayMs > 0) await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		try {
			if (write()) return true;
		} catch {}
	}
	return false;
}
async function assertUpdateReportPreCreateState(options) {
	if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new UpdateReportPreCreateGuardError("Update report submission requires a current authenticated client.", "authority");
	if (options.validateCurrentAttempt) {
		let currentAttempt;
		try {
			currentAttempt = await options.validateCurrentAttempt();
		} catch (error) {
			throw new UpdateReportPreCreateGuardError("Update report status could not be rechecked before submission.", "validation", { cause: error });
		}
		if (!currentAttempt) throw new UpdateReportPreCreateGuardError("This failed update attempt is stale or unavailable.", "stale");
	}
	if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new UpdateReportPreCreateGuardError("Update report submission requires a current authenticated client.", "authority");
}
//#endregion
//#region src/infra/update-failure-report-artifact-sweep.ts
/** Fenced cleanup for non-authoritative update-report body artifacts. */
/** Deletes one immutable candidate set while the exact SQLite lease generation remains current. */
async function cleanRetiredUpdateFailureReportArtifacts(prepared, receipt, stateEnv, keepCurrent = true, hooks = {}) {
	const sweepOwnerId = randomUUID();
	const sweepGeneration = randomUUID();
	if (!retryUpdateReportStateWrite(() => claimUpdateFailureReportArtifactSweep(prepared.attemptId, receipt.reservationId, sweepOwnerId, sweepGeneration, stateEnv))) return false;
	const keep = !keepCurrent || receipt.replacementReady ? void 0 : bindSavedReportArtifact(prepared, receipt.reservationId, receipt.previewDigest);
	let swept = false;
	try {
		await hooks.beforeList?.();
		if (!hasUpdateFailureReportArtifactSweepLease(prepared.attemptId, receipt.reservationId, sweepOwnerId, sweepGeneration, stateEnv)) return false;
		const candidates = await (hooks.listCandidates ?? listRetiredUpdateFailureReportArtifacts)(prepared, keep);
		if (!hasUpdateFailureReportArtifactSweepLease(prepared.attemptId, receipt.reservationId, sweepOwnerId, sweepGeneration, stateEnv)) return false;
		await removeRetiredUpdateFailureReportArtifacts(candidates);
		swept = true;
	} finally {
		const released = retryUpdateReportStateWrite(() => releaseUpdateFailureReportArtifactSweep(prepared.attemptId, receipt.reservationId, sweepOwnerId, sweepGeneration, stateEnv));
		swept &&= released;
	}
	return swept;
}
//#endregion
//#region src/infra/update-failure-report-prepare.ts
/** Sanitizes and prepares one explicitly reviewed update-failure report. */
const UPDATE_REPORT_BODY_MAX_BYTES = 16e3;
const UPDATE_REPORT_FIELD_MAX_BYTES = 512;
function redactDiagnosticLines(value) {
	const privatePathLine = /\$OPENCLAW_STATE_DIR[\\/]|(?:^|[^\p{L}\p{N}._~-])(?:\/+|\\+|[A-Za-z]:[\\/]|~[\\/])/u;
	return value.split(/(\r\n|[\n\r\u2028\u2029])/u).map((line) => {
		if (/^(?:\r\n|[\n\r\u2028\u2029])$/u.test(line)) return line;
		if (privatePathLine.test(line)) return "[redacted-path]";
		return /[\s"'`;$|&<>(){}[\]*?\\]/u.test(line.trim()) ? "[redacted-command]" : line;
	}).join("");
}
function sanitizeReportField(value, context, maxBytes = UPDATE_REPORT_FIELD_MAX_BYTES) {
	const redacted = redactSupportString(redactDiagnosticLines(typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" ? String(value) : "unknown"), {
		env: context.env,
		stateDir: context.stateDir
	});
	return truncateUtf8Prefix(redacted.trim(), maxBytes);
}
function sanitizeFactIdentifier(value, context) {
	const stepId = resolvePublicUpdateStepId(value);
	if (stepId) return stepId;
	return isIP(value) || /^(?:[\p{L}\p{N}-]+\.)+[\p{L}][\p{L}\p{N}-]*(?::\d+)?$/u.test(value) && !valid(value) ? "[redacted-host]" : sanitizeReportField(value, context);
}
function sanitizeFactConfigKey(value) {
	const anchor = /^(mcp\.servers|models\.providers|plugins\.entries|skills\.entries|auth\.profiles|cron\.jobs|agents\.list|hooks\.internal\.entries|engines\.node)(?:\.|$)/u.exec(value)?.[1] ?? /^(agents|auth|channels|commands|cron|engines|gateway|hooks|mcp|messages|models|plugins|session|skills|stateDir|tools)(?:\.|$)/u.exec(value)?.[1];
	return anchor ? value === anchor ? anchor : `${anchor}.*` : "[redacted-key]";
}
function resolveFailedSteps(input) {
	const direct = new Map(input.result.steps.map((step) => [updateRunStepKey(step.name), step]));
	const recorded = input.recordedRun?.runId === input.attemptId ? input.recordedRun.steps : [];
	const recordedNames = new Set(recorded.map((step) => updateRunStepKey(step.step)));
	return [...Array.from(direct.values()).filter((step) => isFailedUpdateStep(step) && !recordedNames.has(updateRunStepKey(step.name))), ...recorded.flatMap((step) => {
		const measured = direct.get(updateRunStepKey(step.step));
		if (measured) return isFailedUpdateStep(measured) ? [{
			...measured,
			failureFacts: measured.failureFacts ?? step.failureFacts
		}] : [];
		return step.status === "failed" ? [{
			name: step.step,
			exitCode: step.exitCode ?? null,
			failureFacts: step.failureFacts,
			detail: step.detail
		}] : [];
	})];
}
function resolveUpdateTarget(input, context) {
	const explicit = input.target?.trim() || input.recordedRun?.target?.sha || input.recordedRun?.target?.version || input.recordedRun?.target?.tag || input.recordedRun?.target?.channel;
	if (explicit) {
		const version = explicit.startsWith("version ") ? explicit.slice(8) : null;
		if (version && !/\s/u.test(version) && valid(version)) return `version ${sanitizeReportField(version, context)}`;
		const channel = explicit.endsWith(" channel") ? normalizeUpdateChannel(explicit.slice(0, -8)) : null;
		if (channel) return `${channel} channel`;
		return sanitizeReportField(explicit, context);
	}
	return truncateUtf8Prefix(`exact target unavailable; mode: ${sanitizeReportField(resolveUpdateMode(input), context)}`, UPDATE_REPORT_FIELD_MAX_BYTES);
}
function resolveUpdateMode(input) {
	return input.result.mode === "unknown" ? input.recordedRun?.target?.kind ?? "unknown" : input.result.mode;
}
function resolveRecoveryOutcome(input, context) {
	const { verification, steps } = updateRunReportInputFromResult(input.result, input.recordedRun);
	const recovery = verification.recovery;
	const observation = steps.findLast((step) => step.step === "gateway recovery verification");
	return formatUpdateRunRecovery({
		...verification,
		recovery: recovery?.serviceRestartSafe ? {
			...recovery,
			version: redactPublicSupportVersion(recovery.version)
		} : recovery,
		runningVersion: verification.runningVersion ? redactPublicSupportVersion(verification.runningVersion) : void 0
	}, observation && {
		exitCode: observation.exitCode,
		failureFacts: observation.failureFacts?.map((fact) => ({
			check: fact.check,
			code: isPublicUpdateFailureCode(fact.code) ? fact.code : "gateway-probe-failed"
		}))
	}, sanitizeReportField(recovery?.reason ?? "not-recorded", context, 96)) ?? (steps.some((step) => step.step === "finalize:package-rollback-not-needed" && step.status === "skipped") ? "package rollback not needed: no package mutation" : "not recorded");
}
async function renderBoundedDiagnostics(input, context, steps) {
	const diagnostics = [
		`Result: ${input.result.status}`,
		`Update mode: ${sanitizeReportField(resolveUpdateMode(input), context)}`,
		`Reason code: ${sanitizeReportField(input.result.reason ?? "unknown", context)}`
	];
	if (input.result.reason === "legacy-driver-expired") diagnostics.push(`Advisory: ${LEGACY_UPDATE_RUN_ADVISORY}`);
	if (input.result.reason === "global-install-foreign-destination") diagnostics.push(`Next step: ${UPDATE_DESTINATION_RECOVERY}`);
	for (const finding of normalizeUpdateDoctorLintFindings(input.result.steps.flatMap((step) => step.doctorLintFindings ?? []), context.env)) {
		const { check } = await projectPublicUpdateFailureIdentifiers({
			check: finding.checkId,
			code: "doctor-failed"
		});
		const severity = finding.severity === "warning" || finding.severity === "info" ? finding.severity : "error";
		diagnostics.push(`Doctor lint ${severity} [${check}]: ${redactPublicSupportDiagnosticLine([finding.requirement, finding.message].filter(Boolean).join(": "), context)}`);
	}
	for (const [label, identity] of [["Before", input.result.before], ["After", input.result.after]]) for (const field of ["version", "sha"]) if (identity?.[field]) diagnostics.push(`${label} ${field}: ${sanitizeReportField(identity[field], context)}`);
	if (input.result.after?.buildId) diagnostics.push(`After build: ${sanitizeReportField(input.result.after.buildId, context)}`);
	for (const step of selectUpdateFailureReportSteps(steps)) {
		const phase = sanitizeFactIdentifier(step.name, context);
		const termination = step.termination ? `, termination ${step.termination}` : "";
		const message = [
			...(step.failureFacts ?? []).flatMap((fact) => [fact.message, fact.code]),
			step.detail,
			step.stderrTail
		].filter(Boolean).join("\n");
		const diagnostic = redactPublicSupportDiagnosticLine(message, context);
		const exit = `exit ${step.exitCode ?? "unknown"}`;
		const detail = diagnostic === "[redacted-diagnostic]" ? exit : step.exitCode == null ? diagnostic : `${exit} (${diagnostic})`;
		diagnostics.push(`Failed phase ${phase}: ${detail}${termination}`);
		diagnostics.push(...formatNpmFailureFacts(step.failureFacts ?? [], context));
		diagnostics.push(...await Promise.all(normalizeUpdateFailureFacts(step.failureFacts ?? [], context.env).filter((fact) => fact.check !== "npm").map(async (fact) => formatUpdateFailureFact({
			...await projectPublicUpdateFailureIdentifiers(fact),
			...fact.location ? { location: fact.location } : {},
			...fact.destination ? { destination: fact.destination } : {},
			...fact.affectedKey ? { affectedKey: sanitizeFactConfigKey(fact.affectedKey) } : {},
			...fact.message ? { message: updatePreflightDetailMessage(fact.code) ?? (fact.errorName ? redactSupportDiagnosticLine(fact.message, context) : redactPublicSupportDiagnosticLine(fact.message, context)) } : {}
		}))));
	}
	return diagnostics;
}
/** Builds the exact sanitized body the user must review before submission. */
async function prepareUpdateFailureReport(request, options = {}) {
	if (!request.attemptId.trim()) throw new Error("Update report attempt identity is required.");
	if (classifyUpdateOutcome(request.result) !== "failed") throw new Error("Only a final failed update can be reported.");
	const recordedRun = request.recordedRun?.runId === request.attemptId ? request.recordedRun : void 0;
	const input = {
		...request,
		recordedRun,
		result: {
			...request.result,
			reason: request.result.reason ?? recordedRun?.reason ?? void 0,
			after: request.result.after ?? recordedRun?.after
		}
	};
	const env = options.env ?? process.env;
	const stateDir = options.stateDir ?? resolveStateDir(env);
	const context = {
		env,
		stateDir
	};
	const version = sanitizeReportField(VERSION, context);
	const platform = sanitizeReportField(`${process.platform}/${process.arch}`, context);
	const target = resolveUpdateTarget(input, context);
	const steps = resolveFailedSteps(input);
	const phase = sanitizeFactIdentifier(steps.at(-1)?.name ?? "not-recorded", context);
	const recovery = resolveRecoveryOutcome(input, context);
	const rollback = input.result.rollbackOutcome ?? recordedRun?.verification?.rollbackOutcome;
	const action = recordedRun?.trigger ?? input.action;
	const installation = recordedRun?.target?.installationMethod;
	const projection = input.result.verification || recordedRun?.verification ? updateRunReportInputFromResult(input.result, recordedRun) : void 0;
	const verification = projection?.verification;
	const identity = projection ? formatUpdateRunIdentity(projection.verification, projection.after) : void 0;
	const currentHealth = verification ? await readUpdateRunReportHealth(verification, { env }) : void 0;
	const warnings = [.../* @__PURE__ */ new Set([...await Promise.all((input.result.postUpdate?.plugins?.warnings ?? []).slice(-3).map(async (warning) => {
		const { code, pluginId } = await projectPublicUpdateFailureIdentifiers({
			check: "plugin-convergence",
			code: warning.reason,
			pluginId: warning.pluginId
		});
		const diagnostic = redactPublicSupportDiagnosticLine([warning.errorCode, warning.message].filter(Boolean).join("\n"), context);
		return `Plugin convergence (${code})${pluginId ? `; plugin ${pluginId}` : ""}: ${diagnostic}`;
	})), ...updateRunWarningMessages([...recordedRun?.steps ?? [], ...updateRunReportInputFromResult(input.result).steps]).slice(-3).map((message) => redactPublicSupportDiagnosticLine(message, context))])];
	const bodyWithoutMarker = [
		"# OpenClaw update failure report",
		"",
		"This report was explicitly reviewed and confirmed in OpenClaw.",
		"",
		`- OpenClaw version: ${version}`,
		`- Platform: ${platform}`,
		`- Node version: ${sanitizeReportField(process.versions.node ?? "unknown", context)}`,
		...action ? [`- Update action: ${action === "cli" ? "CLI command: openclaw update" : action === "campaign" ? "automatic update campaign" : `Gateway RPC: update.run (${action})`}`] : [],
		...installation ? [`- Installation method: ${installation}`] : [],
		`- Update target: ${target}`,
		`- Failed phase: ${phase}`,
		...rollback ? [`- Rollback outcome: ${{
			"not-needed": "not needed",
			"not-attempted": "not attempted",
			succeeded: "attempted; succeeded",
			failed: "attempted; failed"
		}[rollback.status]} — ${redactSupportDiagnosticLine(rollback.reason, context)}`] : [],
		...recovery !== "not recorded" || !rollback ? [`- Recovery outcome: ${recovery}`] : [],
		...identity ? [`- Recorded verification: ${identity}`] : [],
		...currentHealth ? [`- ${formatUpdateRunCurrentHealth(currentHealth.kind === "responding" ? {
			...currentHealth,
			version: redactPublicSupportVersion(currentHealth.version)
		} : currentHealth)}`, "- Recovery and verification above describe the update attempt, not a current instruction to stop or restart the Gateway."] : [],
		...warnings.length ? [
			"",
			"## Warnings",
			"",
			...warnings.map((line) => `- ${line}`)
		] : [],
		"",
		"## Bounded diagnostics",
		"",
		...(await renderBoundedDiagnostics(input, context, steps)).map((line) => `- ${line}`),
		""
	].join("\n");
	const reconciliationMarker = `openclaw-update-report:${createHash("sha256").update(`${input.attemptId}\0${bodyWithoutMarker}`).digest("hex")}`;
	const body = truncateUtf8Prefix(bodyWithoutMarker.replace("This report was explicitly reviewed and confirmed in OpenClaw.\n", `This report was explicitly reviewed and confirmed in OpenClaw.\n\n<!-- ${reconciliationMarker} -->\n`), UPDATE_REPORT_BODY_MAX_BYTES);
	const title = truncateUtf8Prefix(`Update failure: ${phase} (${version})`, 200).replace(/\s+/gu, " ");
	const issue = prepareGithubIssue({
		title,
		body
	});
	return {
		...issue,
		attemptId: input.attemptId,
		previewDigest: createHash("sha256").update(issue.body).digest("hex"),
		savedReportPath: path.join(stateDir, "update-reports", `${createHash("sha256").update(input.attemptId).digest("hex")}.md`),
		...issue.browserFallback.status === "available" ? { url: issue.browserFallback.url } : {}
	};
}
//#endregion
//#region src/infra/update-failure-report.ts
/** Privacy-bounded, consent-gated reporting for one terminal update failure. */
function resultFromExistingReceipt(receipt, savedReportPath, expectedPreviewDigest, expectedFallbackUrl) {
	if (receipt?.status === "pending") return {
		message: "This update attempt already has a report submission in progress.",
		savedReportPath,
		status: "pending"
	};
	if (receipt?.status === "preparing") return {
		message: "This update attempt already has a report preparation in progress.",
		savedReportPath,
		status: "retryable"
	};
	if (receipt?.status === "prepared") return {
		message: "This update attempt already has a report publication in progress.",
		savedReportPath,
		status: "retryable"
	};
	if (receipt?.status === "retryable") return {
		message: "No GitHub issue submission was started. This report can be retried.",
		savedReportPath,
		status: "retryable"
	};
	const previewMatches = receipt?.previewDigest === expectedPreviewDigest;
	const matchingFallbackUrl = previewMatches && receipt?.status === "fallback" && receipt.fallbackUrl === expectedFallbackUrl ? receipt.fallbackUrl : void 0;
	return {
		status: "duplicate",
		savedReportPath,
		...previewMatches && receipt?.url ? { url: receipt.url } : {},
		...matchingFallbackUrl ? { fallbackUrl: matchingFallbackUrl } : {},
		message: receipt && !previewMatches ? "This update attempt has a report result for a different reviewed preview." : receipt?.status === "fallback" && !matchingFallbackUrl ? "This update attempt has a report handoff for a different reviewed preview." : receipt ? "This update attempt was already reported." : "This update attempt already has a report reservation."
	};
}
function receiptMatches(receipt, expected) {
	return receipt?.reservationId === expected.reservationId && receipt.status === expected.status && receipt.previewDigest === expected.previewDigest && receipt.cleanup === expected.cleanup && receipt.url === expected.url && receipt.fallbackUrl === expected.fallbackUrl;
}
function receiptMatchesBestEffort(readReceipt, expected) {
	try {
		return receiptMatches(readReceipt(), expected);
	} catch {
		return false;
	}
}
async function cleanOwnedReportArtifact(prepared, receipt, stateEnv, sweepHooks) {
	if (receipt.artifactSweep && !await cleanRetiredUpdateFailureReportArtifacts(prepared, receipt, stateEnv, false, sweepHooks)) return false;
	const ownedPrepared = bindSavedReportArtifact(prepared, receipt.reservationId, receipt.previewDigest);
	try {
		await discardSavedUpdateFailureReport(ownedPrepared, {
			reportCreated: false,
			reportDirCreated: false,
			stagedReportCreated: false
		}, true);
	} catch {
		return false;
	}
	return retryUpdateReportStateWrite(() => completeUpdateFailureReportReceiptCleanup(prepared.attemptId, receipt.reservationId, stateEnv));
}
/** Consumes one reviewed preview and invokes the shared GitHub issue creator at most once. */
async function submitUpdateFailureReport(prepared, previewDigest, options = {}) {
	if (previewDigest !== prepared.previewDigest) throw new Error("The update report preview is stale. Review it again before submitting.");
	const env = options.env ?? process.env;
	const stateDir = options.stateDir ?? resolveStateDir(env);
	const stateEnv = {
		...env,
		OPENCLAW_STATE_DIR: stateDir
	};
	if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new Error("Update report submission requires a current authenticated client.");
	const finalizeReceipt = options.finalizeReceipt ?? finalizeUpdateFailureReportReceipt;
	const readReceipt = options.readReceipt ?? readUpdateFailureReportReceipt;
	const persistKnownNoStartReceipt = async (receipt) => await retryUpdateReportStateWriteAfterNoStart(() => {
		try {
			if (finalizeReceipt(prepared.attemptId, receipt, stateEnv)) return true;
		} catch {}
		return receiptMatchesBestEffort(() => readReceipt(prepared.attemptId, stateEnv), receipt);
	});
	let existingReceipt = readReceipt(prepared.attemptId, stateEnv);
	if (existingReceipt?.cleanup === "pending") {
		await cleanOwnedReportArtifact(prepared, existingReceipt, stateEnv, options.artifactSweepHooks);
		existingReceipt = readReceipt(prepared.attemptId, stateEnv);
	}
	if (existingReceipt?.status === "pending" && existingReceipt.previewDigest === prepared.previewDigest) {
		const ensureCurrentAuthority = () => {
			if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new Error("Update report reconciliation requires a current authenticated client.");
		};
		const reconcileIssue = options.reconcileIssue ?? ((issue, hooks) => reconcileGithubIssue(issue, void 0, hooks));
		let reconciled;
		try {
			reconciled = await reconcileIssue(prepared, { beforeIssueLookup: ensureCurrentAuthority });
			ensureCurrentAuthority();
		} catch {
			reconciled = { status: "unavailable" };
		}
		if (reconciled.status === "created") {
			const receipt = {
				cleanup: "pending",
				previewDigest: prepared.previewDigest,
				reservationId: existingReceipt.reservationId,
				status: "created",
				url: reconciled.url
			};
			if (retryUpdateReportStateWrite(() => finalizeReceipt(prepared.attemptId, receipt, stateEnv)) || receiptMatchesBestEffort(() => readReceipt(prepared.attemptId, stateEnv), receipt)) {
				await cleanOwnedReportArtifact(prepared, receipt, stateEnv, options.artifactSweepHooks);
				existingReceipt = receipt;
			}
		}
	}
	if (existingReceipt?.artifactSweep && existingReceipt.cleanup === void 0 && existingReceipt.status !== "preparing" && existingReceipt.status !== "prepared" && existingReceipt.status !== "retryable") await cleanRetiredUpdateFailureReportArtifacts(prepared, existingReceipt, stateEnv, true, options.artifactSweepHooks);
	if (existingReceipt && existingReceipt.status !== "preparing" && existingReceipt.status !== "prepared" && existingReceipt.status !== "retryable") {
		if (existingReceipt.status === "created") await discardSavedUpdateFailureReportBestEffort(bindSavedReportArtifact(prepared, existingReceipt.reservationId, existingReceipt.previewDigest), {
			reportCreated: false,
			reportDirCreated: false,
			stagedReportCreated: false
		}, true);
		return resultFromExistingReceipt(existingReceipt, bindSavedReportArtifact(prepared, existingReceipt.reservationId, existingReceipt.previewDigest).savedReportPath, prepared.previewDigest, prepared.url);
	}
	if (options.validateCurrentAttempt && !await options.validateCurrentAttempt()) return {
		message: "This failed update attempt is stale or unavailable.",
		savedReportPath: prepared.savedReportPath,
		status: "stale"
	};
	if (existingReceipt?.status === "preparing" || existingReceipt?.status === "prepared") {
		const preparingReceipt = existingReceipt;
		if (retryUpdateReportStateWrite(() => beginStaleUpdateFailureReportReceiptCleanup(prepared.attemptId, preparingReceipt.reservationId, stateEnv))) await cleanOwnedReportArtifact(prepared, preparingReceipt, stateEnv, options.artifactSweepHooks);
		existingReceipt = readReceipt(prepared.attemptId, stateEnv);
	}
	if (existingReceipt?.status === "retryable" && existingReceipt.replacementReady !== true) {
		const retryableReceipt = existingReceipt;
		if (retryUpdateReportStateWrite(() => beginUpdateFailureReportReceiptCleanup(prepared.attemptId, retryableReceipt.reservationId, stateEnv))) await cleanOwnedReportArtifact(prepared, retryableReceipt, stateEnv, options.artifactSweepHooks);
	}
	if (existingReceipt?.status === "retryable" && existingReceipt.replacementReady === true) {
		if (!await cleanRetiredUpdateFailureReportArtifacts(prepared, existingReceipt, stateEnv, false, options.artifactSweepHooks)) {
			const currentReceipt = readReceipt(prepared.attemptId, stateEnv);
			return resultFromExistingReceipt(currentReceipt, currentReceipt ? bindSavedReportArtifact(prepared, currentReceipt.reservationId, currentReceipt.previewDigest).savedReportPath : prepared.savedReportPath, prepared.previewDigest, prepared.url);
		}
	}
	const reservationId = randomUUID();
	const reservation = reserveUpdateFailureReportReceipt(prepared.attemptId, reservationId, prepared.previewDigest, stateEnv);
	if (!reservation.reserved) {
		if (reservation.receipt?.status === "created") await discardSavedUpdateFailureReportBestEffort(bindSavedReportArtifact(prepared, reservation.receipt.reservationId, reservation.receipt.previewDigest), {
			reportCreated: false,
			reportDirCreated: false,
			stagedReportCreated: false
		}, true);
		return resultFromExistingReceipt(reservation.receipt, reservation.receipt ? bindSavedReportArtifact(prepared, reservation.receipt.reservationId, reservation.receipt.previewDigest).savedReportPath : prepared.savedReportPath, prepared.previewDigest, prepared.url);
	}
	const ownedPrepared = bindSavedReportArtifact(prepared, reservationId);
	const saved = {
		reportCreated: false,
		reportDirCreated: false,
		stagedReportCreated: false
	};
	const cleanupOwnedPreparation = async () => {
		return retryUpdateReportStateWrite(() => beginUpdateFailureReportReceiptCleanup(prepared.attemptId, reservationId, stateEnv)) ? await cleanOwnedReportArtifact(prepared, {
			previewDigest: prepared.previewDigest,
			reservationId
		}, stateEnv, options.artifactSweepHooks) : false;
	};
	try {
		await savePreparedUpdateFailureReport(ownedPrepared, saved, options.hasCurrentAuthority);
		if (options.validateCurrentAttempt && !await options.validateCurrentAttempt()) {
			if (!await cleanupOwnedPreparation()) return resultFromExistingReceipt(readReceipt(prepared.attemptId, stateEnv), ownedPrepared.savedReportPath, prepared.previewDigest, prepared.url);
			return {
				message: "This failed update attempt is stale or unavailable.",
				savedReportPath: ownedPrepared.savedReportPath,
				status: "stale"
			};
		}
		if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new Error("Update report submission requires a current authenticated client.");
		if (!retryUpdateReportStateWrite(() => markUpdateFailureReportReceiptPrepared(prepared.attemptId, reservationId, prepared.previewDigest, stateEnv))) {
			await discardSavedUpdateFailureReportBestEffort(ownedPrepared, saved, true);
			return resultFromExistingReceipt(readReceipt(prepared.attemptId, stateEnv), ownedPrepared.savedReportPath, prepared.previewDigest, prepared.url);
		}
		await publishPreparedUpdateFailureReport(ownedPrepared, saved);
	} catch (error) {
		try {
			await cleanupOwnedPreparation();
		} catch {}
		throw error;
	}
	const assertCurrentPreCreateState = () => assertUpdateReportPreCreateState(options);
	const afterAuthPreflight = assertCurrentPreCreateState;
	const beforeIssueCreate = async () => {
		await assertCurrentPreCreateState();
		return () => {
			if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new UpdateReportPreCreateGuardError("Update report submission requires a current authenticated client.", "authority");
			if (!(options.markPending ?? markUpdateFailureReportReceiptPending)(prepared.attemptId, reservationId, prepared.previewDigest, stateEnv)) throw new UpdateReportPreCreateGuardError("Update report preparation is no longer owned by this request.", "reservation");
		};
	};
	const createIssue = options.createIssue ?? ((issue, hooks) => submitGithubIssue(issue, void 0, hooks));
	let created;
	try {
		created = await createIssue(prepared, {
			afterAuthPreflight,
			beforeIssueCreate,
			beforeIssueLookup: () => {
				if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new Error("Update report reconciliation requires a current authenticated client.");
			}
		});
	} catch (error) {
		if (!(error instanceof UpdateReportPreCreateGuardError)) throw error;
		if (error.reason === "reservation") {
			await discardSavedUpdateFailureReportBestEffort(ownedPrepared, saved, true);
			return resultFromExistingReceipt(readReceipt(prepared.attemptId, stateEnv), ownedPrepared.savedReportPath, prepared.previewDigest, prepared.url);
		}
		if (!await cleanupOwnedPreparation()) return resultFromExistingReceipt(readReceipt(prepared.attemptId, stateEnv), ownedPrepared.savedReportPath, prepared.previewDigest, prepared.url);
		if (error.reason === "stale") return {
			message: error.message,
			savedReportPath: ownedPrepared.savedReportPath,
			status: "stale"
		};
		throw error;
	}
	if (created.status === "created") {
		const receipt = {
			cleanup: "pending",
			previewDigest: prepared.previewDigest,
			reservationId,
			status: "created",
			url: created.url
		};
		const terminalRecorded = retryUpdateReportStateWrite(() => finalizeReceipt(prepared.attemptId, receipt, stateEnv)) || receiptMatchesBestEffort(() => readReceipt(prepared.attemptId, stateEnv), receipt);
		if (terminalRecorded) await cleanOwnedReportArtifact(prepared, receipt, stateEnv, options.artifactSweepHooks);
		return {
			...!terminalRecorded ? { message: "GitHub issue was created, but its canonical receipt is still pending. Do not submit this report again." } : {},
			savedReportPath: ownedPrepared.savedReportPath,
			status: "created",
			url: created.url
		};
	}
	if (created.status === "outcome-unknown") return {
		message: "GitHub issue submission may have completed, but confirmation was unavailable. Do not submit this report again.",
		savedReportPath: ownedPrepared.savedReportPath,
		status: "pending"
	};
	if (created.status === "fallback-unavailable") {
		if (!await persistKnownNoStartReceipt({
			previewDigest: prepared.previewDigest,
			reservationId,
			status: "retryable"
		})) return {
			message: "GitHub issue creation did not start, but retry state could not be saved. Do not retry this report yet.",
			savedReportPath: ownedPrepared.savedReportPath,
			status: "pending"
		};
		return {
			message: "The sanitized report was saved, but it is too large for a browser handoff.",
			savedReportPath: ownedPrepared.savedReportPath,
			status: "retryable"
		};
	}
	const message = created.reason === "authentication-unavailable" ? "GitHub authentication is unavailable. Review and submit the prefilled issue in your browser." : "GitHub submission is unavailable. Review and submit the prefilled issue in your browser.";
	if (!retryUpdateReportStateWrite(() => (options.refreshPreparation ?? refreshUpdateFailureReportReceiptPreparation)(prepared.attemptId, reservationId, stateEnv))) {
		let replacement = null;
		try {
			replacement = readReceipt(prepared.attemptId, stateEnv);
		} catch {}
		return resultFromExistingReceipt(replacement, replacement ? bindSavedReportArtifact(prepared, replacement.reservationId, replacement.previewDigest).savedReportPath : ownedPrepared.savedReportPath, prepared.previewDigest, prepared.url);
	}
	if (!await persistKnownNoStartReceipt({
		fallbackUrl: created.url,
		previewDigest: prepared.previewDigest,
		reservationId,
		status: "fallback"
	})) return {
		message: "The browser report handoff could not be saved safely. No issue submission was started; retry this action later.",
		savedReportPath: ownedPrepared.savedReportPath,
		status: "retryable"
	};
	return {
		fallbackUrl: created.url,
		message,
		savedReportPath: ownedPrepared.savedReportPath,
		status: "fallback"
	};
}
//#endregion
export { prepareUpdateFailureReport as n, submitUpdateFailureReport as t };
