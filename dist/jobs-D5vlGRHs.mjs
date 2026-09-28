import { d as normalizeOptionalThreadValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { b as uniqueValues } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { c as normalizeOptionalAgentId } from "./session-key-CBvmC8zz.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { $ as compileSafeRegexDetailed } from "./redact-B5EGyLvV.mjs";
import { Ft as isCronDeliveryStatus, It as isCronRunStatus, Mt as cronTaskRecordToRunLogEntry, jt as cronTaskRecordStoreKey } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { n as parseCodeModeScriptSyntax } from "./code-mode-script-syntax-DZwdESO8.mjs";
import { a as createCronStreamSourceIdentity, u as shouldDefaultCronDeliveryToAnnounce } from "./normalize-_k1oAXPq.mjs";
import { r as normalizeRequiredName } from "./normalize-tfeRpKhn.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BCmwDHWH.mjs";
import { t as assertSafeCronSessionTargetId } from "./session-target-DJsUULzX.mjs";
import { r as resolveDefaultCronStaggerMs, t as normalizeCronStaggerMs } from "./stagger-wESOTFE0.mjs";
import { t as isSystemOwnedCronPayloadKind } from "./types--MeiGb_d.mjs";
import { t as assertCronJobStateTimestamps } from "./persisted-shape-C0aWTtcm.mjs";
import { t as parseCronPacingBounds } from "./pacing-DuamEQSm.mjs";
import { n as cronJobUsesToolRuntime, t as applyDefaultCronToolsAllow } from "./tools-allow-BSqnFkMT.mjs";
import { i as listTaskRegistryRecordsByRuntimeSourceIdFromSqlite } from "./task-registry.store.sqlite-nRmuK0pg.mjs";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BqkZLKq3.mjs";
import { m as normalizeStreamScheduleBounds, n as computeJobNextRunAtMs, y as resolveEveryAnchorMs } from "./jobs-scheduling-BuJ7Yxlw.mjs";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.mjs";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-D6XdUIQv.mjs";
import { o as reconcileToolsAllowAuthority } from "./jobs-tool-policy-DBCUJ2uk.mjs";
import crypto from "node:crypto";
//#region src/cron/service/jobs-validation.ts
/** Validation helpers for cron schedules, targets, payloads, and delivery. */
async function resolveConfiguredChannelsForValidation(state) {
	try {
		return await state.deps.listConfiguredChannels?.();
	} catch {
		state.deps.log.debug({}, "cron: configured channel validation skipped");
		return;
	}
}
function assertCronScriptSyntax(script, subject) {
	if (!script.trim()) throw new Error(`cron ${subject} must not be empty`);
	const parsed = parseCodeModeScriptSyntax(script);
	if (!parsed.ok) throw new Error(`cron ${subject} has a syntax error: ${parsed.message} (line ${parsed.line}, column ${parsed.column})`);
}
/** Validates that session target and payload kind form a supported cron job shape. */
function assertSupportedJobSpec(job) {
	if (typeof job.sessionTarget !== "string") throw new Error("cron job is missing sessionTarget; expected \"main\", \"isolated\", \"current\", or \"session:<id>\"");
	const isIsolatedLike = job.sessionTarget === "isolated" || job.sessionTarget === "current" || job.sessionTarget.startsWith("session:");
	if (job.sessionTarget.startsWith("session:")) assertSafeCronSessionTargetId(job.sessionTarget.slice(8));
	if (job.sessionTarget === "main" && job.payload.kind !== "systemEvent" && job.payload.kind !== "script" && !isSystemOwnedCronPayloadKind(job.payload.kind)) throw new Error("main cron jobs require payload.kind=\"systemEvent\" or \"script\"");
	if (job.payload.kind === "script" && job.sessionTarget !== "main" && job.sessionTarget !== "isolated") throw new Error("script cron jobs require sessionTarget=\"main\" or \"isolated\"");
	if (isIsolatedLike && job.payload.kind !== "agentTurn" && job.payload.kind !== "command" && !(job.sessionTarget === "isolated" && job.payload.kind === "script")) throw new Error("isolated cron jobs require payload.kind=\"agentTurn\", \"command\", or \"script\"; script payloads do not support current/session targets");
}
function assertScriptPayloadSupport(job, opts) {
	if (job.payload.kind !== "script") return;
	if (opts?.validateSyntax !== false) assertCronScriptSyntax(job.payload.script, "script payload");
	else if (!job.payload.script.trim()) throw new Error("cron script payload must not be empty");
	if (job.trigger) throw new Error("cron script payloads cannot be combined with a condition trigger");
	if (opts?.requireEnabled && opts.cronConfig?.triggers?.enabled === false) throw new Error("cron script payloads are disabled because the operator set cron.triggers.enabled: false; remove it or set it to true to allow unattended scripts");
}
function assertTriggerSupport(job, opts) {
	if (!job.trigger) return;
	if (opts?.validateAuthoredTrigger && opts.cronConfig?.triggers?.enabled === false) throw new Error("cron triggers are disabled because the operator set cron.triggers.enabled: false; remove it or set it to true");
	if (job.schedule.kind !== "every" && job.schedule.kind !== "cron" && job.schedule.kind !== "stream") throw new Error("cron triggers require an every, cron, or stream schedule");
	const minIntervalMs = resolveCronTriggerMinIntervalMs();
	if (job.schedule.kind === "every" && job.schedule.everyMs < minIntervalMs) throw new Error(`cron trigger every interval must be at least ${minIntervalMs}ms`);
	if (opts?.validateAuthoredTrigger) assertCronScriptSyntax(job.trigger.script, "trigger script");
}
function assertPacingSupport(job) {
	if (job.pacing === void 0) return;
	parseCronPacingBounds(job.pacing);
	if (job.schedule.kind !== "every" && job.schedule.kind !== "cron") throw new Error("cron pacing requires an every or cron schedule");
}
function assertStreamScheduleSupport(job, opts) {
	if (job.schedule.kind !== "stream") return;
	if (opts?.requireEnabled && opts.cronConfig?.triggers?.enabled === false) throw new Error("cron stream schedules are disabled because the operator set cron.triggers.enabled: false; remove it or set it to true");
	const { command, mode = "line", match } = job.schedule;
	if (!Array.isArray(command) || command.length === 0 || command.some((entry) => typeof entry !== "string" || entry.length === 0)) throw new Error("cron stream schedule requires a non-empty command argv array");
	if (mode !== "line" && mode !== "match") throw new Error("cron stream mode must be \"line\" or \"match\"");
	if (mode === "match") {
		if (typeof match !== "string" || !match) throw new Error("cron stream match is required when mode=\"match\"");
		const compiled = compileSafeRegexDetailed(match);
		if (!compiled.regex) throw new Error(`cron stream match is not a safe regular expression (${compiled.reason})`);
	} else if (match !== void 0) throw new Error("cron stream match requires mode=\"match\"");
	if (job.payload.kind === "command") throw new Error("cron stream schedules cannot use command payloads");
}
function assertTimeScheduleSatisfiable(job, nowMs, computeJobNextRunAtMs) {
	if (job.schedule.kind === "at") {
		if (parseAbsoluteTimeMs(job.schedule.at) === null) throw new Error("cron at schedule must contain a Date-valid absolute timestamp");
		return;
	}
	if (job.schedule.kind !== "cron" && job.schedule.kind !== "every") return;
	if (computeJobNextRunAtMs({
		...job,
		enabled: true
	}, nowMs) !== void 0) return;
	if (job.schedule.kind === "every") throw new Error("cron every schedule has no upcoming run time and would never fire");
	throw new Error(`cron expression "${job.schedule.expr}" has no upcoming run time and would never fire`);
}
function assertMainSessionAgentId(job, defaultAgentId, patch) {
	if (patch && !("agentId" in patch) && !("sessionTarget" in patch) && patch.payload?.kind === void 0) return;
	if (job.sessionTarget !== "main") return;
	if (!job.agentId) return;
	if (job.payload.kind === "script" || isSystemOwnedCronPayloadKind(job.payload.kind)) return;
	if (normalizeAgentId(job.agentId) !== normalizeAgentId(defaultAgentId)) throw new Error(`cron: sessionTarget "main" is only valid for the default agent. Use sessionTarget "isolated" with payload.kind "agentTurn" for non-default agents (agentId: ${job.agentId})`);
}
function assertDeliverySupport(job) {
	if (!job.delivery) return;
	if (job.delivery.mode === "none" && !job.delivery.completionDestination) return;
	if (job.delivery.mode === "webhook") {
		const target = normalizeHttpWebhookUrl(job.delivery.to);
		if (!target) throw new Error("cron webhook delivery requires delivery.to to be a valid http(s) URL");
		job.delivery.to = target;
	}
	if (job.delivery.completionDestination?.mode === "webhook") {
		if (job.delivery.mode !== "announce") throw new Error("cron completion destination webhook is only supported with delivery.mode=\"announce\"");
		const target = normalizeHttpWebhookUrl(job.delivery.completionDestination.to);
		if (!target) throw new Error("cron completion destination webhook requires delivery.completionDestination.to to be a valid http(s) URL");
		job.delivery.completionDestination.to = target;
	}
	if (job.delivery.mode === "none") return;
	if (job.delivery.mode === "webhook") return;
	if (!(job.sessionTarget === "isolated" || job.sessionTarget === "current" || job.sessionTarget.startsWith("session:"))) throw new Error("cron channel delivery config is only supported for sessionTarget=\"isolated\"");
}
function assertAnnounceDeliveryChannelSupport(job, configuredChannels, patch) {
	if (patch && !cronPatchTouchesDeliveryResolution(patch)) return;
	const plan = resolveCronDeliveryPlan(job);
	const channels = [...new Set(configuredChannels ?? [])].toSorted();
	const targetMaySelectChannel = /^[a-z][a-z0-9_-]*:/i.test(plan.to ?? "");
	if (job.sessionTarget !== "isolated" || job.sessionKey?.trim() || plan.mode !== "announce" || plan.channel !== void 0 && plan.channel !== "last" || targetMaySelectChannel || job.delivery?.bestEffort === true || channels.length < 2) return;
	throw new Error(`cron announce delivery requires an explicit channel when multiple channels are configured (${channels.join(", ")}): set --channel <id> or use --best-effort-deliver`);
}
function cronPatchTouchesDeliveryResolution(patch) {
	return patch.delivery !== void 0 || patch.sessionTarget !== void 0 || "agentId" in patch || "sessionKey" in patch;
}
function hasConcreteFailureDestination(destination) {
	return Boolean(destination && (destination.channel !== void 0 || destination.to !== void 0 || destination.accountId !== void 0 || destination.mode !== void 0));
}
function assertFailureDestinationSupport(job) {
	const failureDestination = job.delivery?.failureDestination;
	if (!failureDestination) return;
	if (!hasConcreteFailureDestination(failureDestination)) return;
	if (job.sessionTarget === "main" && job.delivery?.mode !== "webhook") throw new Error("cron delivery.failureDestination is only supported for sessionTarget=\"isolated\" unless delivery.mode=\"webhook\"");
	if (failureDestination.mode === "webhook") {
		const target = normalizeHttpWebhookUrl(failureDestination.to);
		if (!target) throw new Error("cron failure destination webhook requires delivery.failureDestination.to to be a valid http(s) URL");
		failureDestination.to = target;
	}
}
//#endregion
//#region src/cron/task-run-history.ts
/** Cron run-history reads backed by authoritative task-ledger rows. */
const INVALID_CRON_TASK_RUN_JOB_ID_MESSAGE = "invalid cron task run job id";
function normalizeCronTaskRunJobId(jobId) {
	const trimmed = jobId.trim();
	if (!trimmed || trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes("\0")) throw new Error(INVALID_CRON_TASK_RUN_JOB_ID_MESSAGE);
	return trimmed;
}
function isInvalidCronTaskRunJobIdError(error) {
	return error instanceof Error && error.message === INVALID_CRON_TASK_RUN_JOB_ID_MESSAGE;
}
function normalizeStatusFilter(values, fallback, predicate) {
	if (values?.length) {
		const validValues = values.filter(predicate);
		if (validValues.length > 0) return uniqueValues(validValues);
	}
	return predicate(fallback) ? [fallback] : null;
}
function queryText(entry, jobNameById) {
	return [
		entry.summary ?? "",
		entry.error ?? "",
		entry.errorReason ?? "",
		entry.diagnostics?.summary ?? "",
		...(entry.diagnostics?.entries ?? []).map((diagnostic) => diagnostic.message),
		entry.jobId,
		jobNameById?.[entry.jobId] ?? "",
		entry.delivery?.intended?.channel ?? "",
		entry.delivery?.resolved?.channel ?? "",
		...(entry.delivery?.messageToolSentTo ?? []).map((target) => target.channel)
	].join(" ");
}
function compareHistoryRows(left, right, direction) {
	const multiplier = direction === "asc" ? 1 : -1;
	return multiplier * (left.entry.ts - right.entry.ts) || multiplier * (left.task.createdAt - right.task.createdAt) || multiplier * left.task.taskId.localeCompare(right.task.taskId);
}
function attachJobNames(entries, jobNameById) {
	for (const entry of entries) {
		const jobName = jobNameById?.[entry.jobId];
		if (jobName) entry.jobName = jobName;
	}
}
/** Reads and filters cron task rows with the legacy run-history paging contract. */
function readCronTaskRunHistoryPage(options) {
	const jobId = options.jobId ? normalizeCronTaskRunJobId(options.jobId) : void 0;
	const limit = Math.max(1, Math.min(200, Math.floor(options.limit ?? 50)));
	const offset = Math.max(0, Math.floor(options.offset ?? 0));
	const statuses = normalizeStatusFilter(options.statuses, options.status, isCronRunStatus);
	const deliveryStatuses = normalizeStatusFilter(options.deliveryStatuses, options.deliveryStatus, isCronDeliveryStatus);
	const runId = normalizeOptionalString(options.runId);
	const agentId = options.agentId ? normalizeAgentId(options.agentId) : void 0;
	const query = normalizeLowercaseStringOrEmpty(options.query);
	const sortDir = options.sortDir === "asc" ? "asc" : "desc";
	const rows = listTaskRegistryRecordsByRuntimeSourceIdFromSqlite({
		runtime: "cron",
		sourceId: jobId
	}).filter((task) => cronTaskRecordStoreKey(task) === options.storeKey).filter((task) => !agentId || task.agentId === agentId).map((task) => ({
		task,
		entry: cronTaskRecordToRunLogEntry(task)
	})).filter((row) => row.entry !== null).filter(({ entry }) => {
		if (runId && entry.runId !== runId) return false;
		if (statuses && (!entry.status || !statuses.includes(entry.status))) return false;
		if (deliveryStatuses && !deliveryStatuses.includes(entry.deliveryStatus ?? "not-requested")) return false;
		return (!query || normalizeLowercaseStringOrEmpty(queryText(entry, options.jobNameById)).includes(query)) && (!options.entryFilter || options.entryFilter(entry));
	}).toSorted((left, right) => compareHistoryRows(left, right, sortDir));
	const total = rows.length;
	const boundedOffset = Math.min(total, offset);
	const entries = rows.slice(boundedOffset, boundedOffset + limit).map(({ entry }) => entry);
	attachJobNames(entries, options.jobNameById);
	const nextOffset = boundedOffset + entries.length;
	return {
		entries,
		total,
		offset: boundedOffset,
		limit,
		hasMore: nextOffset < total,
		nextOffset: nextOffset < total ? nextOffset : null
	};
}
//#endregion
//#region src/cron/service/jobs-declarative.ts
const CRON_DECLARATIVE_LABEL_MAX_LENGTH = 200;
function normalizeDeclarativeLabel(value, field, nullable = false) {
	const normalized = normalizeOptionalString(value);
	if (!(nullable && value == null) && value !== void 0 && !normalized) throw new Error(`cron ${field} must not be blank`);
	if (normalized && normalized.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH) throw new Error(`cron ${field} must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`);
	return normalized;
}
function declarativeFields(job, includeEnabled) {
	return {
		schedule: job.schedule,
		pacing: job.pacing,
		trigger: job.trigger,
		payload: job.payload,
		scheduledToolPolicy: job.scheduledToolPolicy,
		toolsAllowProvenance: job.toolsAllowProvenance,
		toolsAllowExecTarget: job.toolsAllowExecTarget,
		runtimeAuthority: job.runtimeAuthority,
		runtimeAuthorityRecoveryRequired: job.runtimeAuthorityRecoveryRequired,
		delivery: job.delivery,
		displayName: job.displayName,
		...includeEnabled ? {
			enabled: job.enabled,
			autoDisabled: job.state.autoDisabled,
			streamRestartExhausted: job.state.streamRestartExhausted
		} : {}
	};
}
function clampPositiveInteger(value, fallback, maximum) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return fallback;
	return Math.min(maximum, Math.max(1, Math.floor(value)));
}
/** Applies the persisted defaults and hard caps for unattended script payloads. */
function normalizeCronScriptPayload(payload) {
	return {
		...payload,
		script: payload.script.trim(),
		timeoutSeconds: clampPositiveInteger(payload.timeoutSeconds, 300, 900),
		toolBudget: clampPositiveInteger(payload.toolBudget, 50, 200)
	};
}
//#endregion
//#region src/cron/service/initial-delivery.ts
/** Resolves create-time default delivery for new cron jobs. */
/**
* Resolves default cron delivery for new jobs when callers omit explicit delivery config.
* This is the direct-service contract: supported creation paths (gateway `cron.add`,
* agent cron tool) already fill delivery in `normalizeCronJobCreate`, so this default
* only governs callers that reach `CronService.add`/declarative convergence directly.
* The shared predicate keeps this contract consistent across write-time,
* read-time, and service-bypass paths.
*/
function resolveInitialCronDelivery(input) {
	if (input.delivery) return input.delivery;
	if (shouldDefaultCronDeliveryToAnnounce({
		payloadKind: input.payload.kind,
		sessionTarget: input.sessionTarget
	})) return { mode: "announce" };
}
//#endregion
//#region src/cron/service/payload-merge.ts
function applyToolsAllowPatch(payload, patch, existing) {
	if (Array.isArray(patch.toolsAllow)) {
		payload.toolsAllow = patch.toolsAllow;
		const existingDefaultUnchanged = existing?.toolsAllowIsDefault === true && toolsAllowEqual(existing, patch);
		const installsDefault = patch.toolsAllowIsDefault === true && existing?.toolsAllowIsDefault !== true;
		if (existingDefaultUnchanged || installsDefault) payload.toolsAllowIsDefault = true;
		else delete payload.toolsAllowIsDefault;
	} else if (patch.toolsAllow === null) {
		delete payload.toolsAllow;
		delete payload.toolsAllowIsDefault;
	}
}
function toolsAllowEqual(left, right) {
	const rightToolsAllow = right.toolsAllow;
	return Array.isArray(left.toolsAllow) && Array.isArray(rightToolsAllow) && left.toolsAllow.length === rightToolsAllow.length && left.toolsAllow.every((toolName, index) => toolName === rightToolsAllow[index]);
}
function mergeCronPayload(existing, patch) {
	if (patch.kind !== existing.kind) {
		const next = buildPayloadFromPatch(patch);
		if (patch.toolsAllow === void 0 && Array.isArray(existing.toolsAllow)) {
			next.toolsAllow = [...existing.toolsAllow];
			if (existing.toolsAllowIsDefault === true) next.toolsAllowIsDefault = true;
		}
		return next;
	}
	if (patch.kind === "systemEvent" && existing.kind === "systemEvent") {
		const text = typeof patch.text === "string" ? patch.text : existing.text;
		const next = {
			...existing,
			text
		};
		applyToolsAllowPatch(next, patch, existing);
		return next;
	}
	if (patch.kind === "command" && existing.kind === "command") {
		const next = { ...existing };
		if (Array.isArray(patch.argv)) next.argv = patch.argv;
		if (typeof patch.cwd === "string") next.cwd = patch.cwd;
		if (patch.env && typeof patch.env === "object" && !Array.isArray(patch.env)) next.env = patch.env;
		if (typeof patch.input === "string") next.input = patch.input;
		if (typeof patch.timeoutSeconds === "number") next.timeoutSeconds = patch.timeoutSeconds;
		else if (patch.timeoutSeconds === null) delete next.timeoutSeconds;
		if (typeof patch.noOutputTimeoutSeconds === "number") next.noOutputTimeoutSeconds = patch.noOutputTimeoutSeconds;
		if (typeof patch.outputMaxBytes === "number") next.outputMaxBytes = patch.outputMaxBytes;
		applyToolsAllowPatch(next, patch, existing);
		return next;
	}
	if (patch.kind === "script" && existing.kind === "script") {
		const next = { ...existing };
		if (typeof patch.script === "string") next.script = patch.script;
		if (typeof patch.timeoutSeconds === "number") next.timeoutSeconds = patch.timeoutSeconds;
		else if (patch.timeoutSeconds === null) delete next.timeoutSeconds;
		if (typeof patch.toolBudget === "number") next.toolBudget = patch.toolBudget;
		applyToolsAllowPatch(next, patch, existing);
		return next;
	}
	if (patch.kind !== "agentTurn" || existing.kind !== "agentTurn") return buildPayloadFromPatch(patch);
	const next = { ...existing };
	if (typeof patch.message === "string") next.message = patch.message;
	if (typeof patch.model === "string") next.model = patch.model;
	else if (patch.model === null) delete next.model;
	if (Array.isArray(patch.fallbacks)) next.fallbacks = patch.fallbacks;
	else if (patch.fallbacks === null) delete next.fallbacks;
	applyToolsAllowPatch(next, patch, existing);
	if (typeof patch.thinking === "string") next.thinking = patch.thinking;
	else if (patch.thinking === null) delete next.thinking;
	if (typeof patch.timeoutSeconds === "number") next.timeoutSeconds = patch.timeoutSeconds;
	else if (patch.timeoutSeconds === null) delete next.timeoutSeconds;
	if (typeof patch.lightContext === "boolean") next.lightContext = patch.lightContext;
	if (typeof patch.allowUnsafeExternalContent === "boolean") next.allowUnsafeExternalContent = patch.allowUnsafeExternalContent;
	return next;
}
function buildPayloadFromPatch(patch) {
	if (patch.kind === "systemEvent") {
		if (typeof patch.text !== "string" || patch.text.length === 0) throw new Error("cron.update payload.kind=\"systemEvent\" requires text");
		const next = {
			kind: "systemEvent",
			text: patch.text
		};
		applyToolsAllowPatch(next, patch);
		return next;
	}
	if (patch.kind === "command") {
		if (!Array.isArray(patch.argv) || patch.argv.length === 0) throw new Error("cron.update payload.kind=\"command\" requires argv");
		const next = {
			kind: "command",
			argv: patch.argv,
			...patch.cwd !== void 0 ? { cwd: patch.cwd } : {},
			...patch.env !== void 0 ? { env: patch.env } : {},
			...patch.input !== void 0 ? { input: patch.input } : {},
			...typeof patch.timeoutSeconds === "number" ? { timeoutSeconds: patch.timeoutSeconds } : {},
			...patch.noOutputTimeoutSeconds !== void 0 ? { noOutputTimeoutSeconds: patch.noOutputTimeoutSeconds } : {},
			...patch.outputMaxBytes !== void 0 ? { outputMaxBytes: patch.outputMaxBytes } : {}
		};
		applyToolsAllowPatch(next, patch);
		return next;
	}
	if (patch.kind === "script") {
		if (typeof patch.script !== "string" || patch.script.trim().length === 0) throw new Error("cron.update payload.kind=\"script\" requires script");
		const next = {
			kind: "script",
			script: patch.script,
			...typeof patch.timeoutSeconds === "number" ? { timeoutSeconds: patch.timeoutSeconds } : {},
			...patch.toolBudget !== void 0 ? { toolBudget: patch.toolBudget } : {}
		};
		applyToolsAllowPatch(next, patch);
		return next;
	}
	if (patch.kind !== "agentTurn") return { kind: patch.kind };
	if (typeof patch.message !== "string" || patch.message.length === 0) throw new Error("cron.update payload.kind=\"agentTurn\" requires message");
	const next = {
		kind: "agentTurn",
		message: patch.message,
		...typeof patch.model === "string" ? { model: patch.model } : {},
		...Array.isArray(patch.fallbacks) ? { fallbacks: patch.fallbacks } : {},
		...typeof patch.thinking === "string" ? { thinking: patch.thinking } : {},
		...typeof patch.timeoutSeconds === "number" ? { timeoutSeconds: patch.timeoutSeconds } : {},
		...patch.lightContext !== void 0 ? { lightContext: patch.lightContext } : {},
		...patch.allowUnsafeExternalContent !== void 0 ? { allowUnsafeExternalContent: patch.allowUnsafeExternalContent } : {}
	};
	applyToolsAllowPatch(next, patch);
	return next;
}
//#endregion
//#region src/cron/service/jobs.ts
/** Cron job scheduling, validation, creation, and patch helpers. */
function resetJobFailureState(job) {
	delete job.state.autoDisabled;
	job.state.consecutiveErrors = 0;
	job.state.scheduleErrorCount = 0;
	if (job.schedule.kind === "stream") {
		job.state.streamRestartExhausted = void 0;
		job.state.streamConsecutiveFailures = 0;
		job.state.streamError = void 0;
	}
}
function normalizeJobSchedule(schedule, context) {
	if (schedule.kind === "every") {
		if (context.kind === "patch") return schedule;
		if (context.kind === "create") return {
			...schedule,
			anchorMs: resolveEveryAnchorMs({
				schedule,
				fallbackAnchorMs: context.nowMs
			})
		};
		if (schedule.anchorMs !== void 0) return schedule;
		const anchorMs = context.previous.kind === "every" && context.previous.everyMs === schedule.everyMs ? resolveEveryAnchorMs({
			schedule: context.previous,
			fallbackAnchorMs: context.fallbackAnchorMs
		}) : context.nowMs;
		return {
			...schedule,
			anchorMs
		};
	}
	if (schedule.kind === "cron") {
		const explicitStaggerMs = normalizeCronStaggerMs(schedule.staggerMs);
		if (explicitStaggerMs !== void 0) return {
			...schedule,
			staggerMs: explicitStaggerMs
		};
		if (context.kind !== "create" && context.previous.kind === "cron" && context.previous.expr === schedule.expr) return {
			...schedule,
			staggerMs: context.previous.staggerMs
		};
		const defaultStaggerMs = resolveDefaultCronStaggerMs(schedule.expr);
		if (defaultStaggerMs !== void 0) return {
			...schedule,
			staggerMs: defaultStaggerMs
		};
		return context.kind === "declarative" ? { ...schedule } : schedule;
	}
	const input = context.kind === "declarative" ? structuredClone(schedule) : schedule;
	return normalizeStreamScheduleBounds(input);
}
function validateFullJob(job, context, configuredChannels) {
	const cronConfig = context.cronConfig;
	const triggerTouched = context.kind === "create" ? job.trigger !== void 0 : context.kind === "patch" ? context.patch.trigger != null : context.input.trigger !== void 0;
	const scriptTouched = context.kind === "create" ? job.payload.kind === "script" : context.kind === "patch" ? context.patch.payload?.kind === "script" : context.input.payload.kind === "script";
	const streamTouched = context.kind !== "patch" || context.patch.enabled === true || context.patch.schedule?.kind === "stream";
	const validateCapabilities = () => {
		assertTriggerSupport(job, {
			cronConfig,
			validateAuthoredTrigger: triggerTouched
		});
		assertScriptPayloadSupport(job, {
			cronConfig,
			requireEnabled: scriptTouched,
			...context.kind === "patch" ? { validateSyntax: context.patch.payload !== void 0 } : {}
		});
		assertStreamScheduleSupport(job, {
			cronConfig,
			requireEnabled: streamTouched
		});
	};
	if (context.kind === "declarative") validateCapabilities();
	assertSupportedJobSpec(job);
	assertPacingSupport(job);
	if (context.kind !== "declarative") validateCapabilities();
	assertMainSessionAgentId(job, context.defaultAgentId, context.kind === "patch" ? context.patch : void 0);
	assertDeliverySupport(job);
	assertAnnounceDeliveryChannelSupport(job, configuredChannels, context.kind === "patch" ? context.patch : void 0);
	assertFailureDestinationSupport(job);
	const scheduleTouched = context.kind !== "patch" || context.patch.schedule !== void 0 || context.patch.enabled === true;
	if (context.nowMs !== void 0 && scheduleTouched) assertTimeScheduleSatisfiable(job, context.nowMs, computeJobNextRunAtMs);
}
/** Creates a normalized cron job row from public add input and computes its initial schedule. */
function createJob(state, input, opts) {
	const now = state.deps.nowMs();
	const id = normalizeOptionalString(input.id) ?? crypto.randomUUID();
	const schedule = normalizeJobSchedule(input.schedule, {
		kind: "create",
		nowMs: now
	});
	const deleteAfterRun = typeof input.deleteAfterRun === "boolean" ? input.deleteAfterRun : schedule.kind === "at" ? true : void 0;
	const enabled = typeof input.enabled === "boolean" ? input.enabled : true;
	const declarationKey = normalizeDeclarativeLabel(input.declarationKey, "declarationKey");
	const displayName = normalizeDeclarativeLabel(input.displayName, "displayName");
	const ownerAgentId = normalizeOptionalAgentId(input.owner?.agentId);
	const ownerSessionKey = normalizeOptionalString(input.owner?.sessionKey);
	const ownerAccountId = normalizeOptionalAccountId(input.owner?.accountId);
	const initialState = { ...input.state };
	delete initialState.scheduleActivatedAtMs;
	delete initialState.runningScheduleChangeId;
	delete initialState.autoDisabled;
	assertCronJobStateTimestamps(initialState);
	const job = {
		id,
		...declarationKey ? { declarationKey } : {},
		...displayName ? { displayName } : {},
		...ownerAgentId || ownerSessionKey || ownerAccountId ? { owner: {
			...ownerAgentId ? { agentId: ownerAgentId } : {},
			...ownerSessionKey ? { sessionKey: ownerSessionKey } : {},
			...ownerAccountId ? { accountId: ownerAccountId } : {}
		} } : {},
		agentId: normalizeOptionalAgentId(input.agentId),
		sessionKey: normalizeOptionalString(input.sessionKey),
		name: normalizeRequiredName(input.name),
		description: normalizeOptionalString(input.description),
		enabled,
		deleteAfterRun,
		createdAtMs: now,
		updatedAtMs: now,
		schedule,
		...input.pacing !== void 0 ? { pacing: structuredClone(input.pacing) } : {},
		sessionTarget: input.sessionTarget,
		wakeMode: input.wakeMode,
		payload: input.payload.kind === "script" ? normalizeCronScriptPayload(structuredClone(input.payload)) : structuredClone(input.payload),
		delivery: resolveInitialCronDelivery(input),
		failureAlert: input.failureAlert,
		...input.trigger ? { trigger: structuredClone(input.trigger) } : {},
		state: {
			...initialState,
			...schedule.kind === "stream" ? { streamSourceIdentity: createCronStreamSourceIdentity() } : {}
		}
	};
	applyDefaultCronToolsAllow(job);
	reconcileToolsAllowAuthority({
		job,
		previouslyUsedToolRuntime: false,
		explicitlyMutatesToolsAllow: true,
		scheduledToolPolicy: opts?.scheduledToolPolicy,
		toolsAllowProvenance: opts?.toolsAllowProvenance,
		toolsAllowExecTarget: opts?.toolsAllowExecTarget
	});
	validateFullJob(job, {
		kind: "create",
		cronConfig: state.deps.cronConfig,
		defaultAgentId: state.deps.defaultAgentId,
		nowMs: now
	}, opts?.configuredChannels);
	job.state.nextRunAtMs = computeJobNextRunAtMs(job, now);
	return job;
}
/** Applies a public cron patch in-place, preserving omitted nested fields and validating the result. */
function applyJobPatch(job, patch, opts) {
	const previouslyUsedToolRuntime = cronJobUsesToolRuntime(job);
	const explicitlyClearsToolsAllow = patch.payload?.toolsAllow === null;
	const previousScheduleKind = job.schedule.kind;
	if ("name" in patch) job.name = normalizeRequiredName(patch.name);
	if ("description" in patch) job.description = normalizeOptionalString(patch.description);
	if ("displayName" in patch) {
		const displayName = normalizeDeclarativeLabel(patch.displayName, "displayName", true);
		if (displayName) job.displayName = displayName;
		else delete job.displayName;
	}
	if (typeof patch.enabled === "boolean") job.enabled = patch.enabled;
	if (typeof patch.deleteAfterRun === "boolean") job.deleteAfterRun = patch.deleteAfterRun;
	else if (patch.schedule?.kind === "at" && (previousScheduleKind === "every" || previousScheduleKind === "cron")) job.deleteAfterRun = true;
	else if (previousScheduleKind === "at" && (patch.schedule?.kind === "every" || patch.schedule?.kind === "cron")) delete job.deleteAfterRun;
	if (patch.schedule) job.schedule = normalizeJobSchedule(patch.schedule, {
		kind: "patch",
		previous: job.schedule
	});
	if ("trigger" in patch) {
		if (patch.trigger === null || patch.trigger === void 0) delete job.trigger;
		else job.trigger = structuredClone(patch.trigger);
	}
	if ("pacing" in patch) {
		if (patch.pacing === null || patch.pacing === void 0) delete job.pacing;
		else job.pacing = structuredClone(patch.pacing);
	}
	if (patch.sessionTarget) job.sessionTarget = patch.sessionTarget;
	if (patch.wakeMode) job.wakeMode = patch.wakeMode;
	if (patch.payload) {
		job.payload = mergeCronPayload(job.payload, patch.payload);
		if (job.payload.kind === "script") job.payload = normalizeCronScriptPayload(job.payload);
	}
	if (cronJobUsesToolRuntime(job) && (!previouslyUsedToolRuntime || explicitlyClearsToolsAllow)) applyDefaultCronToolsAllow(job);
	reconcileToolsAllowAuthority({
		job,
		previouslyUsedToolRuntime,
		explicitlyMutatesToolsAllow: patch.payload !== void 0 && Object.hasOwn(patch.payload, "toolsAllow"),
		scheduledToolPolicy: opts?.scheduledToolPolicy,
		toolsAllowProvenance: opts?.toolsAllowProvenance,
		toolsAllowExecTarget: opts?.toolsAllowExecTarget
	});
	if (patch.delivery) {
		const implicitMode = resolveCronDeliveryPlan(job).mode;
		job.delivery = mergeCronDelivery(job.delivery, patch.delivery, implicitMode);
	}
	if ("failureAlert" in patch) job.failureAlert = mergeCronFailureAlert(job.failureAlert, patch.failureAlert);
	if (job.sessionTarget === "main" && job.delivery?.mode !== "webhook") {
		assertFailureDestinationSupport(job);
		const authoredDelivery = patch.delivery && mergeCronDelivery(void 0, patch.delivery, "announce");
		if (authoredDelivery && (patch.delivery?.mode !== void 0 || authoredDelivery.channel !== void 0 || authoredDelivery.to !== void 0 || authoredDelivery.threadId !== void 0 || authoredDelivery.accountId !== void 0 || authoredDelivery.completionDestination !== void 0)) assertDeliverySupport({
			sessionTarget: job.sessionTarget,
			delivery: authoredDelivery
		});
		const failureDestination = job.delivery?.failureDestination;
		job.delivery = failureDestination ? {
			mode: "none",
			failureDestination
		} : void 0;
	}
	if (patch.state) {
		const statePatch = { ...patch.state };
		delete statePatch.scheduleActivatedAtMs;
		delete statePatch.runningScheduleChangeId;
		delete statePatch.autoDisabled;
		assertCronJobStateTimestamps(statePatch);
		job.state = {
			...job.state,
			...statePatch
		};
	}
	if (patch.enabled === true) resetJobFailureState(job);
	if ("agentId" in patch) job.agentId = normalizeOptionalAgentId(patch.agentId);
	if ("sessionKey" in patch) job.sessionKey = normalizeOptionalString(patch.sessionKey);
	if (previousScheduleKind === "stream" && job.schedule.kind !== "stream") {
		job.state.streamStatus = void 0;
		job.state.streamError = void 0;
		job.state.streamConsecutiveFailures = void 0;
		job.state.streamRestartExhausted = void 0;
		job.state.streamSourceIdentity = void 0;
		job.state.streamDroppedBatches = void 0;
		job.state.streamCoalescedBatches = void 0;
		job.state.streamLastStartedAtMs = void 0;
		job.state.streamLastExitAtMs = void 0;
	}
	validateFullJob(job, {
		kind: "patch",
		patch,
		defaultAgentId: opts?.defaultAgentId,
		nowMs: opts?.scheduleValidationNowMs,
		cronConfig: opts?.cronConfig
	}, opts?.configuredChannels);
}
/** Converges the declared schedule, payload, delivery, and display label only. */
function applyDeclarativeJobSpec(job, input, opts) {
	const previouslyUsedToolRuntime = cronJobUsesToolRuntime(job);
	const explicitlyDeclaresToolsAllow = input.payload.toolsAllow !== void 0;
	const previousToolsAllow = job.payload.toolsAllow;
	const previousToolsAllowIsDefault = job.payload.toolsAllowIsDefault;
	const displayName = normalizeDeclarativeLabel(input.displayName, "displayName");
	if (displayName) job.displayName = displayName;
	else delete job.displayName;
	job.schedule = normalizeJobSchedule(input.schedule, {
		kind: "declarative",
		previous: job.schedule,
		nowMs: opts.nowMs,
		fallbackAnchorMs: job.createdAtMs
	});
	if (input.pacing !== void 0) job.pacing = structuredClone(input.pacing);
	else delete job.pacing;
	job.payload = input.payload.kind === "script" ? normalizeCronScriptPayload(structuredClone(input.payload)) : structuredClone(input.payload);
	if (input.trigger) job.trigger = structuredClone(input.trigger);
	else delete job.trigger;
	if (cronJobUsesToolRuntime(job) && job.payload.toolsAllow === void 0) {
		if (previousToolsAllow !== void 0) {
			job.payload.toolsAllow = [...previousToolsAllow];
			if (previousToolsAllowIsDefault === true) job.payload.toolsAllowIsDefault = true;
		} else if (!previouslyUsedToolRuntime) applyDefaultCronToolsAllow(job);
	}
	reconcileToolsAllowAuthority({
		job,
		previouslyUsedToolRuntime,
		explicitlyMutatesToolsAllow: explicitlyDeclaresToolsAllow,
		scheduledToolPolicy: opts.scheduledToolPolicy,
		toolsAllowProvenance: opts.toolsAllowProvenance,
		toolsAllowExecTarget: opts.toolsAllowExecTarget
	});
	const delivery = resolveInitialCronDelivery(input);
	if (delivery) job.delivery = structuredClone(delivery);
	else delete job.delivery;
	if (opts.enabledExplicit) {
		if (input.enabled && (!job.enabled || job.state.autoDisabled || job.state.streamRestartExhausted)) resetJobFailureState(job);
		job.enabled = input.enabled;
	}
	assertCronJobStateTimestamps(input.state ?? {});
	validateFullJob(job, {
		kind: "declarative",
		input,
		defaultAgentId: opts.defaultAgentId,
		nowMs: opts.nowMs,
		cronConfig: opts.cronConfig
	}, opts.configuredChannels);
}
function mergeCronDelivery(existing, patch, implicitMode) {
	const hasCompletionDestinationPatch = "completionDestination" in patch;
	const next = {
		mode: existing?.mode ?? implicitMode,
		channel: existing?.channel,
		to: existing?.to,
		threadId: existing?.threadId,
		accountId: existing?.accountId,
		bestEffort: existing?.bestEffort,
		completionDestination: existing?.completionDestination,
		failureDestination: existing?.failureDestination
	};
	if (typeof patch.mode === "string") {
		const previousMode = next.mode;
		next.mode = patch.mode === "deliver" ? "announce" : patch.mode;
		if (previousMode !== next.mode && (previousMode === "webhook" || next.mode === "webhook")) next.to = void 0;
		if (next.mode === "webhook") {
			next.channel = void 0;
			next.threadId = void 0;
			next.accountId = void 0;
		}
		if (!hasCompletionDestinationPatch && (next.mode === "none" || next.mode === "webhook")) next.completionDestination = void 0;
	}
	if ("channel" in patch) next.channel = normalizeOptionalString(patch.channel);
	if ("to" in patch) next.to = normalizeOptionalString(patch.to);
	if ("threadId" in patch) next.threadId = normalizeOptionalThreadValue(patch.threadId);
	if ("accountId" in patch) next.accountId = normalizeOptionalString(patch.accountId);
	if (typeof patch.bestEffort === "boolean") next.bestEffort = patch.bestEffort;
	if (hasCompletionDestinationPatch) {
		if (patch.completionDestination == null) next.completionDestination = void 0;
		else {
			const to = normalizeOptionalString(patch.completionDestination.to);
			next.completionDestination = {
				mode: "webhook",
				...to ? { to } : {}
			};
		}
	}
	if ("failureDestination" in patch) {
		if (patch.failureDestination == null) next.failureDestination = void 0;
		else {
			const existingFd = next.failureDestination;
			const patchFd = patch.failureDestination;
			const nextFd = {};
			if (existingFd) {
				if (Object.hasOwn(existingFd, "channel")) nextFd.channel = existingFd.channel;
				if (Object.hasOwn(existingFd, "to")) nextFd.to = existingFd.to;
				if (Object.hasOwn(existingFd, "accountId")) nextFd.accountId = existingFd.accountId;
				if (Object.hasOwn(existingFd, "mode")) nextFd.mode = existingFd.mode;
			}
			if (patchFd) {
				if ("channel" in patchFd) {
					const channel = normalizeOptionalString(patchFd.channel) ?? "";
					nextFd.channel = channel ? channel : void 0;
				}
				if ("to" in patchFd) {
					const to = normalizeOptionalString(patchFd.to) ?? "";
					nextFd.to = to ? to : void 0;
				}
				if ("accountId" in patchFd) {
					const accountId = normalizeOptionalString(patchFd.accountId) ?? "";
					nextFd.accountId = accountId ? accountId : void 0;
				}
				if ("mode" in patchFd) {
					const mode = normalizeOptionalString(patchFd.mode) ?? "";
					nextFd.mode = mode === "announce" || mode === "webhook" ? mode : void 0;
				}
			}
			next.failureDestination = Object.hasOwn(nextFd, "channel") || Object.hasOwn(nextFd, "to") || Object.hasOwn(nextFd, "accountId") || Object.hasOwn(nextFd, "mode") ? nextFd : void 0;
		}
	}
	if (existing === void 0 && !("mode" in patch) && next.channel === void 0 && next.to === void 0 && next.threadId === void 0 && next.accountId === void 0 && next.bestEffort === void 0 && next.completionDestination === void 0 && next.failureDestination === void 0) return;
	return next;
}
function mergeCronFailureAlert(existing, patch) {
	if (patch === false) return false;
	if (patch === null) return;
	if (patch === void 0) return existing;
	const next = { ...existing === false || existing === void 0 ? {} : existing };
	if ("after" in patch) {
		const after = typeof patch.after === "number" && Number.isFinite(patch.after) ? patch.after : 0;
		next.after = after > 0 ? Math.floor(after) : void 0;
	}
	if ("channel" in patch) next.channel = normalizeOptionalString(patch.channel);
	if ("to" in patch) next.to = normalizeOptionalString(patch.to);
	if ("cooldownMs" in patch) {
		const cooldownMs = typeof patch.cooldownMs === "number" && Number.isFinite(patch.cooldownMs) ? patch.cooldownMs : -1;
		next.cooldownMs = cooldownMs >= 0 ? Math.floor(cooldownMs) : void 0;
	}
	if ("includeSkipped" in patch) next.includeSkipped = typeof patch.includeSkipped === "boolean" ? patch.includeSkipped : void 0;
	if ("mode" in patch) {
		const mode = normalizeOptionalString(patch.mode) ?? "";
		next.mode = mode === "announce" || mode === "webhook" ? mode : void 0;
	}
	if ("accountId" in patch) {
		const accountId = normalizeOptionalString(patch.accountId) ?? "";
		next.accountId = accountId ? accountId : void 0;
	}
	return next;
}
/**
* Covers both durable reservations and the process marker that survives mutable job state.
* Every timer/manual admission path must use this or disable/re-enable can duplicate a run.
*/
//#endregion
export { isInvalidCronTaskRunJobIdError as a, assertSupportedJobSpec as c, resolveConfiguredChannelsForValidation as d, declarativeFields as i, assertTimeScheduleSatisfiable as l, applyJobPatch as n, normalizeCronTaskRunJobId as o, createJob as r, readCronTaskRunHistoryPage as s, applyDeclarativeJobSpec as t, cronPatchTouchesDeliveryResolution as u };
