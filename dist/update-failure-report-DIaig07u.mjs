import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { n as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BuT3Q1bJ.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { p as updatePreflightDetailMessage } from "./service-inspection-error-Bsltcpi4.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-BquD107I.mjs";
import { a as redactPublicSupportDiagnosticLine, c as redactSupportString, i as redactPublicSupportConfigKey, o as redactPublicSupportVersion, s as redactSupportDiagnosticLine } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { S as reserveUpdateFailureReportReceipt, a as completeUpdateFailureReportReceiptCleanup, b as refreshUpdateFailureReportReceiptPreparation, d as hasUpdateFailureReportArtifactSweepLease, f as markUpdateFailureReportReceiptPending, n as beginUpdateFailureReportReceiptCleanup, o as finalizeUpdateFailureReportReceipt, p as markUpdateFailureReportReceiptPrepared, r as claimUpdateFailureReportArtifactSweep, t as beginStaleUpdateFailureReportReceiptCleanup, v as readUpdateFailureReportReceipt, x as releaseUpdateFailureReportArtifactSweep } from "./restart-sentinel-CWHFSDjo.mjs";
import { s as classifyUpdateOutcome } from "./update-outcome-BHX5xsqd.mjs";
import { n as isPublicUpdateFailureCode, t as CANARY_CHECKS } from "./update-failure-public-codes-C2YOHbsK.mjs";
import { i as normalizeUpdateFailureFacts } from "./update-failure-facts-CetdnXr-.mjs";
import { o as formatNpmFailureFacts } from "./update-runner-command-rYXXMsH4.mjs";
import { t as LEGACY_UPDATE_RUN_ADVISORY } from "./update-run-legacy-expiry-BU1v4N5g.mjs";
import { o as updateRunWarningMessages, r as isFailedUpdateStep } from "./update-run-step-BDxgGAu8.mjs";
import { p as updateRunStepKey } from "./update-run-write-DdGOnqyV.mjs";
import { i as normalizeUpdateDoctorLintFindings } from "./update-doctor-lint-kv_-CSRP.mjs";
import { n as selectUpdateFailureReportSteps, r as UPDATE_DESTINATION_RECOVERY, t as formatUpdateFailureFact } from "./update-failure-facts-format-Uhxv535Y.mjs";
import { c as updateRunReportInputFromResult, n as formatUpdateRunIdentity, r as formatUpdateRunRecovery, t as formatUpdateRunCurrentHealth } from "./update-run-report-C8yK_gib.mjs";
import { a as publishPreparedUpdateFailureReport, c as savePreparedUpdateFailureReport, i as listRetiredUpdateFailureReportArtifacts, n as discardSavedUpdateFailureReport, r as discardSavedUpdateFailureReportBestEffort, s as removeRetiredUpdateFailureReportArtifacts, t as bindSavedReportArtifact } from "./update-failure-report-artifact-DSFBsmLj.mjs";
import { t as readUpdateRunReportHealth } from "./update-run-report-health-Dg9paCEi.mjs";
import { t as resolvePublicUpdateStepId } from "./update-step-identity-D3BfuJRQ.mjs";
import { i as submitGithubIssue, n as prepareGithubIssue, r as reconcileGithubIssue, t as browserFallbackResult } from "./github-issue-B2MuaGR_.mjs";
import path from "node:path";
import { constants } from "node:os";
import { isIP } from "node:net";
import { randomUUID } from "node:crypto";
import { valid } from "semver";
//#region src/infra/update-failure-public-identifiers.ts
const NATIVE_CHECKS = /* @__PURE__ */ new Set([
	...UPDATE_RUN_PHASES,
	...CANARY_CHECKS,
	"doctor",
	"lint",
	"config-write",
	"preflight",
	"installation-inspection",
	"target-resolution",
	"git update",
	"update",
	"targetConfigValidation",
	"configSnapshot",
	"targetConfigConvergence",
	"completionCache",
	"readyz",
	"startupz",
	"versionMatch",
	"service",
	"pluginErrors",
	"channelsReady",
	"settled",
	"gateway-recovery",
	"node-runtime",
	"managed-service",
	"managed-service-preflight",
	"package-install",
	"package-swap",
	"package-runtime",
	"plugin-update",
	"plugin-sync",
	"plugin-convergence",
	"build",
	"openclaw doctor",
	"post-install verification",
	"package rollback",
	"global install verify",
	"global install swap",
	"npm lifecycle policy preflight"
]);
let publicPluginIds;
let publicDoctorCheckIds;
function loadPublicPluginIds() {
	publicPluginIds ??= Promise.all([import("./official-external-plugin-bundled-catalogs-CsFzA7aa.mjs"), import("./official-external-plugin-catalog-source-Dc11MtD3.mjs")]).then(([catalogs, identities]) => {
		const ids = /* @__PURE__ */ new Set();
		for (const entry of catalogs.BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES) {
			const id = identities.resolveOfficialExternalPluginId(entry);
			if (id) ids.add(id);
		}
		return ids;
	});
	return publicPluginIds;
}
function loadPublicDoctorCheckIds() {
	publicDoctorCheckIds ??= import("./doctor-health-contributions-DYEd7giY.mjs").then((doctor) => doctor.resolveDoctorContributionHealthChecks()).then((checks) => new Set(checks.map((check) => check.id)));
	return publicDoctorCheckIds;
}
/** Capture catalogs before an interactive update can replace their code. */
async function preparePublicUpdateFailureIdentifiers() {
	await Promise.allSettled([loadPublicDoctorCheckIds(), loadPublicPluginIds()]);
}
/** Only source-defined public identities leave the local diagnostic report. */
async function projectPublicUpdateFailureIdentifiers(fact) {
	const nativeCheck = NATIVE_CHECKS.has(fact.check) || resolvePublicUpdateStepId(fact.check) === fact.check || isPublicUpdateFailureCode(fact.check);
	const [doctorIds, pluginIds] = await Promise.all([nativeCheck ? void 0 : loadPublicDoctorCheckIds().catch(() => void 0), fact.pluginId ? loadPublicPluginIds().catch(() => void 0) : void 0]);
	return {
		check: nativeCheck || doctorIds?.has(fact.check) ? fact.check : "[redacted-check]",
		code: isPublicUpdateFailureCode(fact.code) ? fact.code : fact.errorName ? isPublicUpdateFailureCode(fact.errorName) ? fact.errorName : "[redacted-error-class]" : "[redacted-code]",
		...fact.pluginId ? { pluginId: pluginIds?.has(fact.pluginId) ? fact.pluginId : "[redacted-plugin]" } : {}
	};
}
//#endregion
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
		if (delayMs > 0) await sleep(delayMs);
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
			detail: step.detail,
			termination: step.termination,
			signal: step.signal,
			stderrTail: step.stderrTail
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
		const signal = step.signal && Object.hasOwn(constants.signals, step.signal) ? step.signal : null;
		const termination = step.termination ? `, termination ${step.termination}${signal ? ` (${signal})` : ""}` : "";
		const message = [
			...(step.failureFacts ?? []).flatMap((fact) => [fact.message, fact.code]),
			step.detail,
			step.stderrTail
		].filter(Boolean).join("\n");
		const facts = normalizeUpdateFailureFacts(step.failureFacts ?? [], context.env);
		const npm = facts.find((fact) => (fact.check === "npm" || fact.check === "bun") && fact.npmErrorCode);
		const diagnostic = npm ? [npm.npmErrorCode, npm.packageSpec].filter(Boolean).join(" ") : redactPublicSupportDiagnosticLine(message, context);
		const exit = `exit ${step.exitCode ?? "unknown"}`;
		const detail = diagnostic === "[redacted-diagnostic]" ? exit : step.exitCode == null ? diagnostic : `${exit} (${diagnostic})`;
		diagnostics.push(`Failed phase ${phase}: ${detail}${termination}`);
		diagnostics.push(...formatNpmFailureFacts(facts, context));
		diagnostics.push(...await Promise.all(facts.filter((fact) => fact.check !== "npm" && fact.check !== "bun").map(async (fact) => formatUpdateFailureFact({
			...await projectPublicUpdateFailureIdentifiers(fact),
			...fact.location ? { location: fact.location } : {},
			...fact.destination ? { destination: fact.destination } : {},
			...fact.affectedKey ? { affectedKey: redactPublicSupportConfigKey(fact.affectedKey) } : {},
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
	const reconciliationMarker = `openclaw-update-report:${sha256Hex(`${input.attemptId}\0${bodyWithoutMarker}`)}`;
	const body = truncateUtf8Prefix(bodyWithoutMarker.replace("This report was explicitly reviewed and confirmed in OpenClaw.\n", `This report was explicitly reviewed and confirmed in OpenClaw.\n\n<!-- ${reconciliationMarker} -->\n`), UPDATE_REPORT_BODY_MAX_BYTES);
	const title = truncateUtf8Prefix(`Update failure: ${phase} (${version})`, 200).replace(/\s+/gu, " ");
	const issue = prepareGithubIssue({
		title,
		body
	});
	return {
		...issue,
		attemptId: input.attemptId,
		previewDigest: sha256Hex(issue.body),
		savedReportPath: path.join(stateDir, "update-reports", `${sha256Hex(input.attemptId)}.md`),
		...issue.browserFallback.status === "available" ? { url: issue.browserFallback.url } : {}
	};
}
//#endregion
//#region src/infra/update-failure-report.ts
/** Privacy-bounded, consent-gated reporting for one terminal update failure. */
function resultFromExistingReceipt(receipt, prepared, savedReportPath = receipt ? bindSavedReportArtifact(prepared, receipt.reservationId, receipt.previewDigest).savedReportPath : prepared.savedReportPath) {
	if (receipt && (receipt.status === "pending" || receipt.status === "preparing" || receipt.status === "prepared" || receipt.status === "retryable")) return {
		message: {
			pending: "This update attempt already has a report submission in progress.",
			preparing: "This update attempt already has a report preparation in progress.",
			prepared: "This update attempt already has a report publication in progress.",
			retryable: "No GitHub issue submission was started. This report can be retried."
		}[receipt.status],
		savedReportPath,
		status: receipt.status === "pending" ? "pending" : "retryable"
	};
	const previewMatches = receipt?.previewDigest === prepared.previewDigest;
	const matchingFallbackUrl = previewMatches && receipt?.status === "fallback" && receipt.fallbackUrl === prepared.url ? receipt.fallbackUrl : void 0;
	return {
		status: "duplicate",
		savedReportPath,
		...previewMatches && receipt?.url ? { url: receipt.url } : {},
		...matchingFallbackUrl ? { fallbackUrl: matchingFallbackUrl } : {},
		message: receipt && !previewMatches ? "This update attempt has a report result for a different reviewed preview." : receipt?.status === "fallback" && !matchingFallbackUrl ? "This update attempt has a report handoff for a different reviewed preview." : receipt ? "This update attempt was already reported." : "This update attempt already has a report reservation."
	};
}
function receiptMatchesBestEffort(readReceipt, expected) {
	try {
		const receipt = readReceipt();
		return receipt?.reservationId === expected.reservationId && receipt.status === expected.status && receipt.previewDigest === expected.previewDigest && receipt.cleanup === expected.cleanup && receipt.url === expected.url && receipt.fallbackUrl === expected.fallbackUrl;
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
	const recordCreatedIssue = async (url, reservationId) => {
		const receipt = {
			cleanup: "pending",
			previewDigest: prepared.previewDigest,
			reservationId,
			status: "created",
			url
		};
		if (!retryUpdateReportStateWrite(() => finalizeReceipt(prepared.attemptId, receipt, stateEnv)) && !receiptMatchesBestEffort(() => readReceipt(prepared.attemptId, stateEnv), receipt)) return;
		await cleanOwnedReportArtifact(prepared, receipt, stateEnv, options.artifactSweepHooks);
		return receipt;
	};
	const persistKnownNoStartReceipt = async (receipt) => await retryUpdateReportStateWriteAfterNoStart(() => {
		try {
			if (finalizeReceipt(prepared.attemptId, receipt, stateEnv)) return true;
		} catch {}
		return receiptMatchesBestEffort(() => readReceipt(prepared.attemptId, stateEnv), receipt);
	});
	const existingResult = async (receipt) => {
		if (receipt?.status === "created") await discardSavedUpdateFailureReportBestEffort(bindSavedReportArtifact(prepared, receipt.reservationId, receipt.previewDigest), {
			reportCreated: false,
			reportDirCreated: false,
			stagedReportCreated: false
		}, true);
		return resultFromExistingReceipt(receipt, prepared);
	};
	let existingReceipt = readReceipt(prepared.attemptId, stateEnv);
	if (existingReceipt?.cleanup === "pending") {
		await cleanOwnedReportArtifact(prepared, existingReceipt, stateEnv, options.artifactSweepHooks);
		existingReceipt = readReceipt(prepared.attemptId, stateEnv);
	}
	if (existingReceipt?.status === "pending" && options.publicationMode !== "browser" && existingReceipt.previewDigest === prepared.previewDigest) {
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
		if (reconciled.status === "created") existingReceipt = await recordCreatedIssue(reconciled.url, existingReceipt.reservationId) ?? existingReceipt;
	}
	if (existingReceipt?.artifactSweep && existingReceipt.cleanup === void 0 && existingReceipt.status !== "preparing" && existingReceipt.status !== "prepared" && existingReceipt.status !== "retryable") await cleanRetiredUpdateFailureReportArtifacts(prepared, existingReceipt, stateEnv, true, options.artifactSweepHooks);
	if (!existingReceipt && options.publicationMode === "reconcile") return {
		message: "The report's submission status could not be verified. No new issue was submitted.",
		savedReportPath: prepared.savedReportPath,
		status: "pending"
	};
	if (existingReceipt && (options.publicationMode === "reconcile" || existingReceipt.status !== "preparing" && existingReceipt.status !== "prepared" && existingReceipt.status !== "retryable")) return existingResult(existingReceipt);
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
		if (!await cleanRetiredUpdateFailureReportArtifacts(prepared, existingReceipt, stateEnv, false, options.artifactSweepHooks)) return resultFromExistingReceipt(readReceipt(prepared.attemptId, stateEnv), prepared);
	}
	const reservationId = randomUUID();
	const reservation = reserveUpdateFailureReportReceipt(prepared.attemptId, reservationId, prepared.previewDigest, stateEnv);
	if (!reservation.reserved) return existingResult(reservation.receipt);
	const ownedPrepared = bindSavedReportArtifact(prepared, reservationId);
	const saved = {
		reportCreated: false,
		reportDirCreated: false,
		stagedReportCreated: false
	};
	const currentResult = () => resultFromExistingReceipt(readReceipt(prepared.attemptId, stateEnv), prepared, ownedPrepared.savedReportPath);
	const cleanupOwnedPreparation = async () => {
		return retryUpdateReportStateWrite(() => beginUpdateFailureReportReceiptCleanup(prepared.attemptId, reservationId, stateEnv)) ? await cleanOwnedReportArtifact(prepared, {
			previewDigest: prepared.previewDigest,
			reservationId
		}, stateEnv, options.artifactSweepHooks) : false;
	};
	try {
		await savePreparedUpdateFailureReport(ownedPrepared, saved, options.hasCurrentAuthority);
		if (options.validateCurrentAttempt && !await options.validateCurrentAttempt()) {
			if (!await cleanupOwnedPreparation()) return currentResult();
			return {
				message: "This failed update attempt is stale or unavailable.",
				savedReportPath: ownedPrepared.savedReportPath,
				status: "stale"
			};
		}
		if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new Error("Update report submission requires a current authenticated client.");
		if (!retryUpdateReportStateWrite(() => markUpdateFailureReportReceiptPrepared(prepared.attemptId, reservationId, prepared.previewDigest, stateEnv))) {
			await discardSavedUpdateFailureReportBestEffort(ownedPrepared, saved, true);
			return currentResult();
		}
		await publishPreparedUpdateFailureReport(ownedPrepared, saved);
	} catch (error) {
		try {
			await cleanupOwnedPreparation();
		} catch {}
		throw error;
	}
	const assertCurrentPreCreateState = () => assertUpdateReportPreCreateState(options);
	let publicationAdmitted = false;
	const beforeIssueCreate = async () => {
		await assertCurrentPreCreateState();
		return () => {
			if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new UpdateReportPreCreateGuardError("Update report submission requires a current authenticated client.", "authority");
			if (!(options.markPending ?? markUpdateFailureReportReceiptPending)(prepared.attemptId, reservationId, prepared.previewDigest, stateEnv)) throw new UpdateReportPreCreateGuardError("Update report preparation is no longer owned by this request.", "reservation");
			publicationAdmitted = true;
		};
	};
	const createIssue = options.createIssue ?? ((issue, hooks) => submitGithubIssue(issue, void 0, hooks));
	let created;
	try {
		if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new UpdateReportPreCreateGuardError("Update report submission requires a current authenticated client.", "authority");
		if (options.publicationMode === "browser") {
			await assertCurrentPreCreateState();
			created = browserFallbackResult(prepared, "browser-requested");
		} else try {
			created = await createIssue(prepared, {
				afterAuthPreflight: assertCurrentPreCreateState,
				beforeIssueCreate,
				beforeIssueLookup: () => {
					if (options.hasCurrentAuthority && !options.hasCurrentAuthority()) throw new Error("Update report reconciliation requires a current authenticated client.");
				}
			});
		} catch (error) {
			if (!publicationAdmitted || error instanceof UpdateReportPreCreateGuardError) throw error;
			created = {
				reason: "creation-outcome-unknown",
				status: "outcome-unknown"
			};
		}
	} catch (error) {
		if (!(error instanceof UpdateReportPreCreateGuardError)) throw error;
		if (error.reason === "reservation") {
			await discardSavedUpdateFailureReportBestEffort(ownedPrepared, saved, true);
			return currentResult();
		}
		if (!await cleanupOwnedPreparation()) return currentResult();
		if (error.reason === "stale") return {
			message: error.message,
			savedReportPath: ownedPrepared.savedReportPath,
			status: "stale"
		};
		throw error;
	}
	if (created.status === "created") return {
		...!await recordCreatedIssue(created.url, reservationId) ? { message: "GitHub issue was created, but its canonical receipt is still pending. Do not submit this report again." } : {},
		savedReportPath: ownedPrepared.savedReportPath,
		status: "created",
		url: created.url
	};
	if (created.status === "outcome-unknown") return {
		message: "GitHub issue submission may have completed, but confirmation was unavailable. Do not submit this report again.",
		savedReportPath: ownedPrepared.savedReportPath,
		status: "pending"
	};
	if (created.status === "fallback-unavailable" || created.status === "browser-fallback" && options.allowBrowserFallback === false) {
		if (!await persistKnownNoStartReceipt({
			previewDigest: prepared.previewDigest,
			reservationId,
			status: "retryable"
		})) return {
			message: "GitHub issue creation did not start, but retry state could not be saved. Do not retry this report yet.",
			savedReportPath: ownedPrepared.savedReportPath,
			status: "pending"
		};
		const unavailable = (created.status === "fallback-unavailable" ? created.cause : created.reason) === "authentication-unavailable" ? "GitHub authentication is unavailable." : "GitHub submission is unavailable.";
		return {
			message: options.allowBrowserFallback === false ? `${unavailable} No issue was submitted. Fix the problem, then choose Report update failure to retry.\nSaved sanitized report: ${ownedPrepared.savedReportPath}` : "The sanitized report was saved, but it is too large for a browser handoff.",
			savedReportPath: ownedPrepared.savedReportPath,
			status: "retryable"
		};
	}
	const message = created.reason === "browser-requested" ? "Review and submit the prefilled issue using your own GitHub account in your browser. No issue has been submitted by the Gateway." : created.reason === "authentication-unavailable" ? "GitHub authentication is unavailable. Review and submit the prefilled issue in your browser." : "GitHub submission is unavailable. Review and submit the prefilled issue in your browser.";
	if (!retryUpdateReportStateWrite(() => (options.refreshPreparation ?? refreshUpdateFailureReportReceiptPreparation)(prepared.attemptId, reservationId, stateEnv))) {
		let replacement = null;
		try {
			replacement = readReceipt(prepared.attemptId, stateEnv);
		} catch {}
		return resultFromExistingReceipt(replacement, prepared, replacement ? void 0 : ownedPrepared.savedReportPath);
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
	try {
		await assertCurrentPreCreateState();
	} catch (error) {
		if (error instanceof UpdateReportPreCreateGuardError && error.reason === "stale") return {
			message: error.message,
			savedReportPath: ownedPrepared.savedReportPath,
			status: "stale"
		};
		throw error;
	}
	return {
		fallbackUrl: created.url,
		message,
		savedReportPath: ownedPrepared.savedReportPath,
		status: "fallback"
	};
}
//#endregion
export { prepareUpdateFailureReport as n, preparePublicUpdateFailureIdentifiers as r, submitUpdateFailureReport as t };
