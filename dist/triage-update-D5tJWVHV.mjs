import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, lr as uuid, or as union } from "./schemas-BOYIvvln.mjs";
import { s as readFileDescriptorBounded } from "./boundary-file-read-D-Aa04On.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { n as UpdateFailureFactSchema } from "./update-run-schema-BIZkdmqf.mjs";
import { o as redactSupportString } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { s as classifyUpdateOutcome } from "./update-outcome-ZpL2Kt9B.mjs";
import { r as normalizeUpdateFailureFacts } from "./update-failure-facts-DiyYJNo1.mjs";
import { n as truncateUtf8Suffix, t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { n as isFailedUpdateStep, t as formatUpdateDoctorLintReceipt } from "./update-run-step-ijjXM1mH.mjs";
import { i as normalizeUpdateDoctorLintFindings, o as UpdateDoctorLintFindingSchema } from "./update-doctor-lint-BYChkM7H.mjs";
import fs from "node:fs/promises";
//#region src/commands/triage-update.ts
const UPDATE_FAILURE_MAX_BYTES = 8192;
const UPDATE_FAILURE_PROMPT_MAX_BYTES = 4096;
const updateIdentitySchema = object({
	sha: string().nullish(),
	version: string().nullish()
});
const createUpdateFailureSchema = (stepFields) => union([object({
	result: object({
		runId: uuid().optional().catch(void 0),
		status: _enum([
			"ok",
			"error",
			"skipped"
		]),
		mode: _enum([
			"git",
			"pnpm",
			"bun",
			"npm",
			"unknown"
		]),
		root: string().optional(),
		reason: string().optional(),
		before: updateIdentitySchema.optional(),
		after: updateIdentitySchema.optional(),
		steps: array(object({
			name: string(),
			exitCode: number().int().nullable(),
			stdoutTail: string().nullish(),
			stderrTail: string().nullish(),
			failureFacts: array(UpdateFailureFactSchema).max(5).optional(),
			termination: _enum([
				"exit",
				"timeout",
				"no-output-timeout",
				"signal"
			]).optional(),
			advisory: object({
				kind: _enum([
					"package-post-install-doctor",
					"candidate-runtime-unavailable",
					"recoverable-maintenance"
				]),
				message: string(),
				details: array(string()).optional()
			}).optional(),
			...stepFields
		})),
		recovery: object({
			serviceRestartSafe: boolean(),
			reason: string().optional(),
			packageRollbackVerified: boolean().optional(),
			version: string().optional(),
			buildId: string().optional(),
			service: _enum(["healthy", "failed"]).optional()
		}).optional(),
		postUpdate: object({ plugins: object({
			status: _enum([
				"ok",
				"warning",
				"skipped",
				"error"
			]),
			reason: string().optional(),
			sync: object({ errors: array(string()) }).optional(),
			npm: object({ outcomes: array(object({
				pluginId: string(),
				status: _enum([
					"updated",
					"unchanged",
					"skipped",
					"error"
				]),
				message: string()
			})) }).optional(),
			integrityDrifts: array(object({
				pluginId: string(),
				spec: string(),
				expectedIntegrity: string(),
				actualIntegrity: string()
			})).optional(),
			warnings: array(object({
				pluginId: string().optional(),
				reason: string(),
				message: string()
			})).optional()
		}).optional() }).optional()
	}),
	error: string().trim().min(1).optional(),
	omittedDetails: number().int().nonnegative().optional()
}), object({
	error: string().trim().min(1),
	omittedDetails: number().int().nonnegative().optional()
}).strict()]).refine((failure) => Boolean(failure.error) || "result" in failure && classifyUpdateOutcome(failure.result) === "failed");
const updateFailureSchema = createUpdateFailureSchema({});
const updateFailureArtifactSchema = createUpdateFailureSchema({
	doctorLintFindings: array(UpdateDoctorLintFindingSchema).optional(),
	signal: string().max(32).nullable().optional(),
	killed: boolean().optional(),
	outputLimitExceeded: boolean().optional()
});
function sanitizeTriageUpdateFailure(input, redaction, format = "prompt") {
	const parsed = updateFailureArtifactSchema.safeParse(input);
	if (!parsed.success) throw new Error("Invalid update failure diagnostics: expected a failed result or error.");
	const failure = parsed.data;
	function text(value, maxBytes, excerpt = "head") {
		if (value == null) return;
		const redacted = redactSupportString(sanitizeForLog(value.replace(/\s+/gu, " ")), redaction, { maxLength: Number.MAX_SAFE_INTEGER });
		if (Buffer.byteLength(JSON.stringify(redacted)) <= maxBytes) return redacted;
		let budget = maxBytes - 5;
		for (;;) {
			const headBytes = Math.floor(budget / 2);
			const bounded = excerpt === "tail" ? `...${truncateUtf8Suffix(redacted, budget)}` : excerpt === "ends" ? `${truncateUtf8Prefix(redacted, headBytes)}...${truncateUtf8Suffix(redacted, budget - headBytes)}` : `${truncateUtf8Prefix(redacted, budget)}...`;
			const bytes = Buffer.byteLength(JSON.stringify(bounded));
			if (bytes <= maxBytes) return bounded;
			budget = Math.floor(budget * (maxBytes - 5) / (bytes - 5));
		}
	}
	let error = text(failure.error, 768, "ends");
	if (!("result" in failure)) {
		if (!error) throw new Error("Update failure diagnostics contain no readable error.");
		return {
			error,
			...failure.omittedDetails ? { omittedDetails: failure.omittedDetails } : {}
		};
	}
	const result = failure.result;
	const lintReceipt = (step) => formatUpdateDoctorLintReceipt({
		...step,
		signal: step.signal === null ? null : text(step.signal, 32),
		doctorLintFindings: step.doctorLintFindings ? normalizeUpdateDoctorLintFindings(step.doctorLintFindings, redaction.env) : void 0
	}, 384);
	if (format === "artifact") {
		const lint = result.steps.findLast((step) => step.doctorLintFindings && isFailedUpdateStep(step)) ?? result.steps.findLast((step) => step.doctorLintFindings);
		if (lint) {
			const receipt = ` Doctor lint receipt: ${lintReceipt(lint)}`;
			error = `${text(error ?? result.reason ?? "Update failed", 768 - Buffer.byteLength(JSON.stringify(receipt)), "ends")}${receipt}`;
		}
	}
	const preserveFindings = format !== "prompt" && result.steps.some((step) => step.doctorLintFindings !== void 0);
	const identity = (value) => value ? {
		sha: text(value.sha, 48),
		version: text(value.version, 48)
	} : void 0;
	let omittedDetails = failure.omittedDetails ?? 0;
	let remainingPluginErrors = 3;
	const removePluginDetails = [];
	const takePluginErrors = (values, latest = false, into) => {
		const selected = values ? latest ? values.slice(Math.max(0, values.length - remainingPluginErrors)) : values.slice(0, remainingPluginErrors) : void 0;
		remainingPluginErrors -= selected?.length ?? 0;
		omittedDetails += (values?.length ?? 0) - (selected?.length ?? 0);
		const output = into ?? selected;
		if (into && selected) {
			if (latest) into.unshift(...selected);
			else into.push(...selected);
		}
		for (const _ of selected ?? []) removePluginDetails.push(() => {
			if (latest) output?.shift();
			else output?.pop();
		});
		return output;
	};
	const plugins = result.postUpdate?.plugins;
	const pluginWarnings = plugins?.status === "error" ? plugins.warnings?.map((warning) => ({
		pluginId: text(warning.pluginId, 48),
		reason: text(warning.reason, 768, "ends"),
		message: text(warning.message, 64, "ends")
	})) : void 0;
	const warnings = takePluginErrors(pluginWarnings?.slice(-1));
	const postUpdate = plugins ? { plugins: {
		status: plugins.status,
		reason: text(plugins.reason, 96),
		warnings,
		sync: plugins.sync ? { errors: takePluginErrors(plugins.sync.errors.map((message) => text(message, 192, "ends"))) ?? [] } : void 0,
		npm: plugins.npm ? { outcomes: takePluginErrors(plugins.npm.outcomes.filter((outcome) => outcome.status === "error").map((outcome) => ({
			pluginId: text(outcome.pluginId, 48),
			status: outcome.status,
			message: text(outcome.message, 192, "ends")
		}))) ?? [] } : void 0,
		integrityDrifts: takePluginErrors(plugins.integrityDrifts?.map((drift) => ({
			pluginId: text(drift.pluginId, 48),
			spec: text(drift.spec, 64),
			expectedIntegrity: text(drift.expectedIntegrity, 64),
			actualIntegrity: text(drift.actualIntegrity, 64)
		})))
	} } : void 0;
	takePluginErrors(pluginWarnings?.slice(0, -1), true, warnings);
	const failedSteps = result.steps.filter(isFailedUpdateStep);
	const latest = new Set(failedSteps.slice(-3));
	const retained = new Set(result.steps.filter((step) => latest.has(step) || preserveFindings && step.doctorLintFindings !== void 0));
	omittedDetails += failedSteps.filter((step) => !retained.has(step)).length;
	const sanitized = {
		...error ? { error } : {},
		result: {
			...result.runId ? { runId: result.runId } : {},
			status: result.status,
			mode: result.mode,
			reason: text(result.reason, 128),
			postUpdate,
			root: text(result.root, 96),
			before: identity(result.before),
			after: identity(result.after),
			recovery: result.recovery ? {
				serviceRestartSafe: result.recovery.serviceRestartSafe,
				reason: text(result.recovery.reason, 96),
				packageRollbackVerified: result.recovery.packageRollbackVerified,
				...result.recovery.serviceRestartSafe ? {
					version: text(result.recovery.version, 48),
					buildId: text(result.recovery.buildId, 96),
					service: result.recovery.service
				} : {}
			} : void 0,
			steps: Array.from(retained, (step) => ({
				name: text(step.name, 64),
				exitCode: step.exitCode,
				termination: step.termination,
				signal: format !== "prompt" ? step.signal === null ? null : text(step.signal, 32) : void 0,
				killed: format !== "prompt" ? step.killed : void 0,
				outputLimitExceeded: format !== "prompt" ? step.outputLimitExceeded : void 0,
				stderrTail: format === "artifact" && step.doctorLintFindings ? lintReceipt(step) : text(step.stderrTail, 384, "ends"),
				stdoutTail: text(step.stdoutTail, 160, "tail"),
				failureFacts: step.failureFacts?.length ? normalizeUpdateFailureFacts(step.failureFacts, redaction.env) : void 0,
				doctorLintFindings: format === "inventory" && step.doctorLintFindings ? normalizeUpdateDoctorLintFindings(step.doctorLintFindings, redaction.env) : void 0,
				advisory: preserveFindings && step.advisory ? {
					kind: step.advisory.kind,
					message: text(step.advisory.message, 500)
				} : void 0
			}))
		},
		omittedDetails
	};
	if (format === "inventory" && preserveFindings) return sanitized;
	const maxBytes = format === "artifact" ? 8191 : UPDATE_FAILURE_PROMPT_MAX_BYTES;
	while (Buffer.byteLength(JSON.stringify(sanitized)) > maxBytes) {
		if (sanitized.result.steps.length > 1) sanitized.result.steps.shift();
		else if (removePluginDetails.length > 1) removePluginDetails.pop()?.();
		else if ((sanitized.result.steps[0]?.failureFacts?.length ?? 0) > 1) sanitized.result.steps[0]?.failureFacts?.pop();
		else throw new Error(`Update failure diagnostics exceed the ${maxBytes}-byte limit.`);
		sanitized.omittedDetails += 1;
	}
	return sanitized;
}
async function readTriageUpdateFailure(inputPath, redaction) {
	const file = await fs.open(inputPath, "r");
	try {
		if (!(await file.stat()).isFile()) throw new Error("Update failure diagnostics must be a regular file.");
		const raw = await readFileDescriptorBounded(file.fd, UPDATE_FAILURE_MAX_BYTES);
		let input;
		try {
			input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(raw));
		} catch {
			throw new Error("Invalid update failure diagnostics JSON.");
		}
		return sanitizeTriageUpdateFailure(input, redaction, "artifact");
	} finally {
		await file.close();
	}
}
async function readPendingTriageUpdateFailure(env, redaction) {
	const { readRestartSentinelReadOnly } = await import("./restart-sentinel-C_TGGs5l.mjs");
	const sentinel = await readRestartSentinelReadOnly(env);
	if (sentinel?.payload.kind !== "update") return;
	const { payload } = sentinel;
	const stats = payload.stats;
	if (classifyUpdateOutcome({
		status: payload.status,
		reason: stats?.reason ?? void 0
	}) !== "failed") return;
	return sanitizeTriageUpdateFailure({ result: {
		...stats?.runId ? { runId: stats.runId } : {},
		status: payload.status,
		mode: stats?.mode ?? "unknown",
		root: stats?.root,
		reason: stats?.reason ?? void 0,
		before: stats?.before ?? void 0,
		after: stats?.after ?? void 0,
		recovery: stats?.recovery,
		steps: (stats?.steps ?? []).map((step) => ({
			name: step.name,
			exitCode: step.log?.exitCode ?? null,
			stderrTail: step.log?.stderrTail,
			stdoutTail: step.log?.stdoutTail,
			failureFacts: step.failureFacts
		}))
	} }, redaction);
}
//#endregion
export { updateFailureSchema as i, readTriageUpdateFailure as n, sanitizeTriageUpdateFailure as r, readPendingTriageUpdateFailure as t };
