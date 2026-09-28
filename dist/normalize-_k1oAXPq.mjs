import { R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { p as sanitizeAgentId } from "./session-key-CBvmC8zz.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { c as parseDeliveryInput, l as parseOptionalField, o as TimeoutSecondsFieldSchema, s as TrimmedNonEmptyStringFieldSchema, t as inferCronJobName } from "./normalize-tfeRpKhn.mjs";
import { a as normalizeCronToolsAllowExecTarget, d as snapshotOwnCronRecord, i as normalizeCronScheduledToolPolicy, o as normalizeCronToolsAllowExecTargetRequirement } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BCmwDHWH.mjs";
import { n as normalizeCronToolsAllowProvenance, o as normalizeCronRuntimeAuthority } from "./tools-allow-provenance-CBVsstVi.mjs";
import { t as coerceFiniteScheduleNumber } from "./schedule-number-sXnjd9Sk.mjs";
import { i as resolveCronCurrentSessionTarget, t as assertSafeCronSessionTargetId } from "./session-target-DJsUULzX.mjs";
import { r as resolveDefaultCronStaggerMs, t as normalizeCronStaggerMs } from "./stagger-wESOTFE0.mjs";
import { t as isSystemOwnedCronPayloadKind } from "./types--MeiGb_d.mjs";
import { randomUUID } from "node:crypto";
//#region src/cron/delivery-defaults.ts
/** Shared create- and run-time defaults for cron result delivery. */
/**
* Keep create-time normalization, direct service persistence, and run-time
* planning on one target policy; disagreement silently drops cron results.
*/
function shouldDefaultCronDeliveryToAnnounce(params) {
	if (params.payloadKind !== "agentTurn" && params.payloadKind !== "command" && params.payloadKind !== "script") return false;
	return params.sessionTarget === "isolated" || params.sessionTarget === "current" || typeof params.sessionTarget === "string" && params.sessionTarget.startsWith("session:");
}
//#endregion
//#region src/cron/normalize-payload.ts
function normalizeTrimmedStringArray(value, options) {
	if (Array.isArray(value)) {
		const normalized = normalizeTrimmedStringList(value);
		if (normalized.length === 0 && value.length > 0) return;
		return normalized;
	}
	if (options?.allowNull && value === null) return null;
}
function normalizeCommandEnv(value) {
	if (!isRecord(value)) throw new Error("command env must be an object with non-blank keys and string values");
	const entries = [];
	for (const [rawKey, rawValue] of Object.entries(value)) {
		const key = normalizeOptionalString(rawKey);
		if (!key || typeof rawValue !== "string") throw new Error("command env must be an object with non-blank keys and string values");
		entries.push([key, rawValue]);
	}
	return Object.fromEntries(entries);
}
function normalizeCronCommandArgv(value) {
	if (!Array.isArray(value) || value.length === 0) return;
	if (value.some((entry) => typeof entry !== "string" || entry.length === 0)) return;
	return [...value];
}
function hasAgentTurnOnlyPayloadHint(payload) {
	return "model" in payload || "fallbacks" in payload || "thinking" in payload || "timeoutSeconds" in payload || typeof payload.lightContext === "boolean" || typeof payload.allowUnsafeExternalContent === "boolean";
}
function normalizeCronPayload(payload) {
	const next = snapshotOwnCronRecord(payload);
	const kindRaw = normalizeLowercaseStringOrEmpty(next.kind);
	if (kindRaw === "agentturn") next.kind = "agentTurn";
	else if (kindRaw === "systemevent") next.kind = "systemEvent";
	else if (kindRaw === "command") next.kind = "command";
	else if (kindRaw === "script") next.kind = "script";
	else if (kindRaw) next.kind = kindRaw;
	for (const field of ["message", "text"]) if (typeof next[field] === "string") next[field] = normalizeOptionalString(next[field]) ?? "";
	if (typeof next.script === "string") next.script = next.script.trim();
	for (const field of ["model", "thinking"]) if (field in next) {
		if (next[field] === null) next[field] = null;
		else {
			const value = parseOptionalField(TrimmedNonEmptyStringFieldSchema, next[field]);
			if (value !== void 0) next[field] = value;
			else delete next[field];
		}
	}
	if ("timeoutSeconds" in next && next.timeoutSeconds !== null) {
		const timeoutSeconds = parseOptionalField(TimeoutSecondsFieldSchema, next.timeoutSeconds);
		if (timeoutSeconds !== void 0) next.timeoutSeconds = timeoutSeconds;
		else delete next.timeoutSeconds;
	}
	for (const field of ["fallbacks", "toolsAllow"]) if (field in next) {
		const value = normalizeTrimmedStringArray(next[field], { allowNull: true });
		if (value !== void 0) next[field] = value;
		else delete next[field];
	}
	if ("argv" in next) {
		const argv = normalizeCronCommandArgv(next.argv);
		if (Array.isArray(argv) && argv.length > 0) next.argv = argv;
		else delete next.argv;
	}
	if ("cwd" in next) {
		const cwd = parseOptionalField(TrimmedNonEmptyStringFieldSchema, next.cwd);
		if (cwd !== void 0) next.cwd = cwd;
		else delete next.cwd;
	}
	if ("env" in next) next.env = normalizeCommandEnv(next.env);
	if ("input" in next && typeof next.input !== "string") delete next.input;
	if ("noOutputTimeoutSeconds" in next) {
		const noOutputTimeoutSeconds = parseOptionalField(TimeoutSecondsFieldSchema, next.noOutputTimeoutSeconds);
		if (noOutputTimeoutSeconds !== void 0) next.noOutputTimeoutSeconds = noOutputTimeoutSeconds;
		else delete next.noOutputTimeoutSeconds;
	}
	for (const field of ["outputMaxBytes", "toolBudget"]) if (field in next) {
		const value = parseOptionalField(TimeoutSecondsFieldSchema, next[field]);
		if (value !== void 0 && value > 0) next[field] = Math.floor(value);
		else delete next[field];
	}
	if ("allowUnsafeExternalContent" in next && typeof next.allowUnsafeExternalContent !== "boolean") delete next.allowUnsafeExternalContent;
	if (!("kind" in next) && typeof next.text === "string" && hasAgentTurnOnlyPayloadHint(next)) {
		next.kind = "agentTurn";
		next.message = next.text;
	}
	if (next.kind === "systemEvent") {
		delete next.message;
		delete next.model;
		delete next.fallbacks;
		delete next.thinking;
		delete next.timeoutSeconds;
		delete next.lightContext;
		delete next.allowUnsafeExternalContent;
		delete next.argv;
		delete next.cwd;
		delete next.env;
		delete next.input;
		delete next.noOutputTimeoutSeconds;
		delete next.outputMaxBytes;
		delete next.script;
		delete next.toolBudget;
	} else if (next.kind === "agentTurn") {
		delete next.text;
		delete next.argv;
		delete next.cwd;
		delete next.env;
		delete next.input;
		delete next.noOutputTimeoutSeconds;
		delete next.outputMaxBytes;
		delete next.script;
		delete next.toolBudget;
	} else if (next.kind === "command") {
		delete next.text;
		delete next.message;
		delete next.model;
		delete next.fallbacks;
		delete next.thinking;
		delete next.lightContext;
		delete next.allowUnsafeExternalContent;
		delete next.script;
		delete next.toolBudget;
	} else if (next.kind === "script") {
		delete next.text;
		delete next.message;
		delete next.model;
		delete next.fallbacks;
		delete next.thinking;
		delete next.lightContext;
		delete next.allowUnsafeExternalContent;
		delete next.argv;
		delete next.cwd;
		delete next.env;
		delete next.input;
		delete next.noOutputTimeoutSeconds;
		delete next.outputMaxBytes;
	}
	return { ...next };
}
//#endregion
//#region src/cron/stream-schedule.ts
const DEFAULT_CRON_STREAM_BATCH_MS = 250;
const MIN_CRON_STREAM_BATCH_MS = 50;
const MAX_CRON_STREAM_BATCH_MS = 5e3;
const DEFAULT_CRON_STREAM_MAX_BATCH_BYTES = 16384;
const MIN_CRON_STREAM_MAX_BATCH_BYTES = 1024;
const MAX_CRON_STREAM_MAX_BATCH_BYTES = 65536;
const CRON_STREAM_TRUNCATED_MARKER = "[truncated]";
/** Opaque identity for one logical stream source across child-process restarts. */
function createCronStreamSourceIdentity() {
	return randomUUID();
}
function clampInteger(value, fallback, min, max) {
	if (value === void 0) return fallback;
	if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error("stream schedule batching values must be integers");
	return Math.max(min, Math.min(max, value));
}
/** Resolve stream batching defaults without rewriting omitted public fields. */
function resolveCronStreamBatching(schedule) {
	return {
		batchMs: clampInteger(schedule.batchMs, DEFAULT_CRON_STREAM_BATCH_MS, MIN_CRON_STREAM_BATCH_MS, MAX_CRON_STREAM_BATCH_MS),
		maxBatchBytes: clampInteger(schedule.maxBatchBytes, DEFAULT_CRON_STREAM_MAX_BATCH_BYTES, MIN_CRON_STREAM_MAX_BATCH_BYTES, MAX_CRON_STREAM_MAX_BATCH_BYTES)
	};
}
/** Stable key for the source definition, with omitted defaults resolved. */
function cronStreamScheduleKey(schedule) {
	const batching = resolveCronStreamBatching(schedule);
	return JSON.stringify({
		command: schedule.command,
		cwd: schedule.cwd,
		mode: schedule.mode ?? "line",
		match: schedule.match,
		batchMs: batching.batchMs,
		maxBatchBytes: batching.maxBatchBytes
	});
}
/** Clamp explicitly supplied stream batching fields during create/update normalization. */
function normalizeCronStreamBatching(schedule) {
	if (schedule.batchMs !== void 0) {
		if (typeof schedule.batchMs !== "number" || !Number.isSafeInteger(schedule.batchMs)) throw new Error("stream schedule batchMs must be an integer");
		schedule.batchMs = clampInteger(schedule.batchMs, DEFAULT_CRON_STREAM_BATCH_MS, MIN_CRON_STREAM_BATCH_MS, MAX_CRON_STREAM_BATCH_MS);
	}
	if (schedule.maxBatchBytes !== void 0) {
		if (typeof schedule.maxBatchBytes !== "number" || !Number.isSafeInteger(schedule.maxBatchBytes)) throw new Error("stream schedule maxBatchBytes must be an integer");
		schedule.maxBatchBytes = clampInteger(schedule.maxBatchBytes, DEFAULT_CRON_STREAM_MAX_BATCH_BYTES, MIN_CRON_STREAM_MAX_BATCH_BYTES, MAX_CRON_STREAM_MAX_BATCH_BYTES);
	}
}
function renderTruncatedCronStreamBatch(text, maxBytes) {
	const markerBytes = Buffer.byteLength(CRON_STREAM_TRUNCATED_MARKER, "utf8");
	const contentBudget = Math.max(0, maxBytes - markerBytes);
	let low = 0;
	let high = text.length;
	while (low < high) {
		const mid = Math.ceil((low + high) / 2);
		const candidate = truncateUtf16Safe(text, mid);
		if (Buffer.byteLength(candidate, "utf8") <= contentBudget) low = mid;
		else high = mid - 1;
	}
	return `${truncateUtf16Safe(text, low)}${CRON_STREAM_TRUNCATED_MARKER}`;
}
/** Render known-truncated source text without exposing the marker to match filters. */
function markCronStreamBatchTruncated(text, maxBytes) {
	return renderTruncatedCronStreamBatch(text, maxBytes);
}
/** Keep a UTF-8 batch inside its byte budget and reserve room for the marker. */
function truncateCronStreamBatch(text, maxBytes) {
	return Buffer.byteLength(text, "utf8") <= maxBytes ? text : renderTruncatedCronStreamBatch(text, maxBytes);
}
/** Append event text through the same payload seam used by trigger messages. */
function appendCronPayloadText(payload, text) {
	if (payload.kind === "systemEvent") return {
		...payload,
		text: `${payload.text}\n\n${text}`
	};
	if (payload.kind === "agentTurn") return {
		...payload,
		message: `${payload.message}\n\n${text}`
	};
	return payload;
}
//#endregion
//#region src/cron/normalize.ts
/** Normalizes cron create/patch payloads before validation and persistence. */
const DEFAULT_OPTIONS = { applyDefaults: false };
function coerceSchedule(schedule) {
	const next = snapshotOwnCronRecord(schedule);
	const rawKind = normalizeLowercaseStringOrEmpty(next.kind);
	const kind = rawKind === "at" || rawKind === "every" || rawKind === "cron" || rawKind === "on-exit" || rawKind === "stream" ? rawKind : void 0;
	const exprRaw = normalizeOptionalString(next.expr) ?? "";
	const timezone = normalizeOptionalString(next.tz);
	const commandRaw = normalizeOptionalString(next.command) ?? "";
	const streamCommand = normalizeCronCommandArgv(next.command);
	const cwdRaw = normalizeOptionalString(next.cwd) ?? "";
	const streamMode = normalizeOptionalLowercaseString(next.mode);
	const streamMatch = typeof next.match === "string" ? next.match : void 0;
	const everyMs = coerceFiniteScheduleNumber(next.everyMs);
	const anchorMs = coerceFiniteScheduleNumber(next.anchorMs);
	const atString = normalizeOptionalString(next.at) ?? "";
	const parsedAtMs = atString ? parseAbsoluteTimeMs(atString) : null;
	if (kind) next.kind = kind;
	const parsedAtIso = parsedAtMs !== null ? timestampMsToIsoString(parsedAtMs) : void 0;
	if (atString) next.at = parsedAtIso ?? atString;
	else if (parsedAtIso !== void 0) next.at = parsedAtIso;
	if (exprRaw) next.expr = exprRaw;
	else if ("expr" in next) delete next.expr;
	if (timezone) next.tz = timezone;
	else if ("tz" in next) delete next.tz;
	if (everyMs !== void 0 && everyMs >= 1) next.everyMs = Math.floor(everyMs);
	if (anchorMs !== void 0 && anchorMs >= 0) next.anchorMs = Math.floor(anchorMs);
	if (kind === "stream" && streamCommand) next.command = streamCommand;
	else if (commandRaw) next.command = commandRaw;
	else if ("command" in next) delete next.command;
	if (cwdRaw) next.cwd = cwdRaw;
	else if ("cwd" in next) delete next.cwd;
	if (kind === "stream") {
		if (streamMode === "line" || streamMode === "match") next.mode = streamMode;
		else if ("mode" in next) delete next.mode;
		if (streamMatch !== void 0) next.match = streamMatch;
		else if ("match" in next) delete next.match;
		normalizeCronStreamBatching(next);
	}
	const staggerMs = normalizeCronStaggerMs(next.staggerMs);
	if (staggerMs !== void 0) next.staggerMs = staggerMs;
	else if (next.kind === "cron" && next.staggerMs !== void 0) throw new TypeError("schedule.staggerMs must be a valid number or non-negative integer string");
	else if ("staggerMs" in next) delete next.staggerMs;
	if (next.kind === "at") {
		delete next.everyMs;
		delete next.anchorMs;
		delete next.expr;
		delete next.tz;
		delete next.staggerMs;
	} else if (next.kind === "every") {
		delete next.at;
		delete next.expr;
		delete next.tz;
		delete next.staggerMs;
	} else if (next.kind === "cron") {
		delete next.at;
		delete next.everyMs;
		delete next.anchorMs;
		delete next.command;
		delete next.cwd;
	} else if (next.kind === "on-exit") {
		delete next.at;
		delete next.everyMs;
		delete next.anchorMs;
		delete next.expr;
		delete next.tz;
		delete next.staggerMs;
		delete next.mode;
		delete next.match;
		delete next.batchMs;
		delete next.maxBatchBytes;
	} else if (next.kind === "stream") {
		delete next.at;
		delete next.everyMs;
		delete next.anchorMs;
		delete next.expr;
		delete next.tz;
		delete next.staggerMs;
	}
	if (next.kind !== "on-exit" && next.kind !== "stream") {
		delete next.command;
		delete next.cwd;
	}
	if (next.kind !== "stream") {
		delete next.mode;
		delete next.match;
		delete next.batchMs;
		delete next.maxBatchBytes;
	}
	return { ...next };
}
function coerceTrigger(trigger) {
	const input = snapshotOwnCronRecord(trigger);
	const script = typeof input.script === "string" ? input.script.trim() : "";
	const once = parseBoolean(input.once);
	return {
		script,
		...once !== void 0 ? { once } : {}
	};
}
function coerceDelivery(delivery) {
	const next = snapshotOwnCronRecord(delivery);
	const parsed = parseDeliveryInput(next);
	if (parsed.mode !== void 0) next.mode = parsed.mode;
	else if ("mode" in next) delete next.mode;
	if ("channel" in next && next.channel === null) next.channel = null;
	else if (parsed.channel !== void 0) next.channel = parsed.channel;
	else if ("channel" in next) delete next.channel;
	if ("to" in next && next.to === null) next.to = null;
	else if (parsed.to !== void 0) next.to = parsed.to;
	else if ("to" in next) delete next.to;
	if ("threadId" in next && next.threadId === null) next.threadId = null;
	else if (parsed.threadId !== void 0) next.threadId = parsed.threadId;
	else if ("threadId" in next) delete next.threadId;
	if ("accountId" in next && next.accountId === null) next.accountId = null;
	else if (parsed.accountId !== void 0) next.accountId = parsed.accountId;
	else if ("accountId" in next) delete next.accountId;
	if ("failureDestination" in next) {
		if (next.failureDestination === null) next.failureDestination = null;
		else if (isRecord(next.failureDestination)) next.failureDestination = coerceFailureDestination(next.failureDestination);
		else delete next.failureDestination;
	}
	if ("completionDestination" in next) {
		if (next.completionDestination === null) next.completionDestination = null;
		else {
			const completionDestination = isRecord(next.completionDestination) ? coerceCompletionDestination(next.completionDestination) : null;
			if (completionDestination) next.completionDestination = completionDestination;
			else delete next.completionDestination;
		}
	}
	return { ...next };
}
function coerceCompletionDestination(value) {
	const input = snapshotOwnCronRecord(value);
	const mode = normalizeOptionalLowercaseString(input.mode);
	const to = normalizeOptionalString(input.to);
	if (mode !== "webhook") return null;
	return {
		mode,
		...to ? { to } : {}
	};
}
function coerceFailureDestination(value) {
	const next = snapshotOwnCronRecord(value);
	if ("channel" in next) {
		if (next.channel === null) next.channel = null;
		else if (next.channel === void 0) next.channel = void 0;
		else {
			const channel = normalizeOptionalLowercaseString(next.channel);
			if (channel) next.channel = channel;
			else delete next.channel;
		}
	}
	if ("to" in next) {
		if (next.to === null) next.to = null;
		else if (next.to === void 0) next.to = void 0;
		else {
			const to = normalizeOptionalString(next.to);
			if (to) next.to = to;
			else delete next.to;
		}
	}
	if ("accountId" in next) {
		if (next.accountId === null) next.accountId = null;
		else if (next.accountId === void 0) next.accountId = void 0;
		else {
			const accountId = normalizeOptionalString(next.accountId);
			if (accountId) next.accountId = accountId;
			else delete next.accountId;
		}
	}
	if ("mode" in next) {
		if (next.mode === null) next.mode = null;
		else if (next.mode === void 0) next.mode = void 0;
		else {
			const mode = normalizeOptionalLowercaseString(next.mode);
			if (mode === "announce" || mode === "webhook") next.mode = mode;
			else delete next.mode;
		}
	}
	return { ...next };
}
function normalizeSessionTarget(raw) {
	if (typeof raw !== "string") return;
	const trimmed = raw.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower === "main" || lower === "isolated" || lower === "current") return lower;
	if (lower.startsWith("session:")) return `session:${assertSafeCronSessionTargetId(trimmed.slice(8))}`;
}
function normalizeWakeMode(raw) {
	if (typeof raw !== "string") return;
	const trimmed = normalizeOptionalLowercaseString(raw);
	if (trimmed === "now" || trimmed === "next-heartbeat") return trimmed;
}
/** Normalizes raw cron job input without deciding whether create-time defaults apply. */
function normalizeCronJobInput(raw, options = DEFAULT_OPTIONS) {
	if (!isRecord(raw)) return null;
	const base = snapshotOwnCronRecord(raw);
	const next = snapshotOwnCronRecord(base);
	for (const field of ["declarationKey", "displayName"]) if (field in base && typeof base[field] === "string") {
		const trimmed = base[field].trim();
		if (trimmed) next[field] = trimmed;
		else delete next[field];
	}
	if (isRecord(base.owner)) {
		const owner = snapshotOwnCronRecord(base.owner);
		const agentId = normalizeOptionalString(owner.agentId);
		const sessionKey = normalizeOptionalString(owner.sessionKey);
		const accountId = normalizeOptionalAccountId(typeof owner.accountId === "string" ? owner.accountId : void 0);
		if (agentId || sessionKey || accountId) next.owner = {
			...agentId ? { agentId: sanitizeAgentId(agentId) } : {},
			...sessionKey ? { sessionKey } : {},
			...accountId ? { accountId } : {}
		};
		else delete next.owner;
	}
	if ("scheduledToolPolicy" in base) {
		const scheduledToolPolicy = normalizeCronScheduledToolPolicy(base.scheduledToolPolicy);
		if (scheduledToolPolicy) next.scheduledToolPolicy = scheduledToolPolicy;
		else delete next.scheduledToolPolicy;
	}
	if ("toolsAllowProvenance" in base) {
		const provenance = normalizeCronToolsAllowProvenance(base.toolsAllowProvenance);
		if (provenance) next.toolsAllowProvenance = provenance;
		else delete next.toolsAllowProvenance;
	}
	if ("toolsAllowExecTarget" in base) {
		const execTarget = normalizeCronToolsAllowExecTarget(base.toolsAllowExecTarget);
		if (execTarget) next.toolsAllowExecTarget = execTarget;
		else delete next.toolsAllowExecTarget;
	}
	if ("toolsAllowExecTargetRequirement" in base) {
		const requirement = normalizeCronToolsAllowExecTargetRequirement(base.toolsAllowExecTargetRequirement);
		if (requirement) next.toolsAllowExecTargetRequirement = requirement;
		else delete next.toolsAllowExecTargetRequirement;
	}
	if ("runtimeAuthority" in base) {
		const runtimeAuthority = normalizeCronRuntimeAuthority(base.runtimeAuthority);
		if (runtimeAuthority) next.runtimeAuthority = runtimeAuthority;
		else delete next.runtimeAuthority;
	}
	if (base.runtimeAuthorityRecoveryRequired === true) next.runtimeAuthorityRecoveryRequired = true;
	else delete next.runtimeAuthorityRecoveryRequired;
	if ("agentId" in base) {
		const agentId = base.agentId;
		if (agentId === null) next.agentId = null;
		else if (typeof agentId === "string") {
			const trimmed = agentId.trim();
			if (trimmed) next.agentId = sanitizeAgentId(trimmed);
			else delete next.agentId;
		}
	}
	if ("sessionKey" in base) {
		const sessionKey = base.sessionKey;
		if (sessionKey === null) next.sessionKey = null;
		else if (typeof sessionKey === "string") {
			const trimmed = sessionKey.trim();
			if (trimmed) next.sessionKey = trimmed;
			else delete next.sessionKey;
		}
	}
	if ("enabled" in base) {
		const enabled = parseBoolean(base.enabled);
		if (enabled !== void 0) next.enabled = enabled;
	}
	if ("sessionTarget" in base) {
		const normalized = normalizeSessionTarget(base.sessionTarget);
		if (normalized) next.sessionTarget = normalized;
		else delete next.sessionTarget;
	}
	if ("wakeMode" in base) {
		const normalized = normalizeWakeMode(base.wakeMode);
		if (normalized) next.wakeMode = normalized;
		else delete next.wakeMode;
	}
	if (isRecord(base.schedule)) next.schedule = coerceSchedule(base.schedule);
	if (isRecord(base.payload)) next.payload = normalizeCronPayload(base.payload);
	if ("trigger" in base) {
		if (base.trigger === null) next.trigger = null;
		else if (isRecord(base.trigger)) next.trigger = coerceTrigger(base.trigger);
		else delete next.trigger;
	}
	if (isRecord(base.delivery)) next.delivery = coerceDelivery(base.delivery);
	if (options.applyDefaults) {
		if (!next.wakeMode) next.wakeMode = "now";
		if (typeof next.enabled !== "boolean") next.enabled = true;
		if ((typeof next.name !== "string" || !next.name.trim()) && isRecord(next.schedule) && isRecord(next.payload)) next.name = inferCronJobName({
			schedule: next.schedule,
			payload: next.payload
		});
		else if (typeof next.name === "string") {
			const trimmed = next.name.trim();
			if (trimmed) next.name = trimmed;
		}
		if (!next.sessionTarget && isRecord(next.payload)) {
			const kind = typeof next.payload.kind === "string" ? next.payload.kind : "";
			if (kind === "systemEvent" || isSystemOwnedCronPayloadKind(kind)) next.sessionTarget = "main";
			else if (kind === "agentTurn") next.sessionTarget = "current";
			else if (kind === "command" || kind === "script") next.sessionTarget = "isolated";
		}
		const normalizedSessionTarget = typeof next.sessionTarget === "string" ? next.sessionTarget : void 0;
		const resolvedCurrentSessionKey = options.sessionContext?.sessionKey ?? (typeof next.sessionKey === "string" ? next.sessionKey : void 0);
		const resolvedSessionTarget = resolveCronCurrentSessionTarget({
			sessionTarget: normalizedSessionTarget,
			sessionKey: resolvedCurrentSessionKey
		});
		if (resolvedSessionTarget !== void 0) {
			next.sessionTarget = resolvedSessionTarget;
			if (next.sessionTarget !== "isolated" && normalizedSessionTarget === "current" && resolvedCurrentSessionKey?.trim()) next.sessionKey = assertSafeCronSessionTargetId(resolvedCurrentSessionKey);
		} else delete next.sessionTarget;
		if ("schedule" in next && isRecord(next.schedule) && next.schedule.kind === "at" && !("deleteAfterRun" in next)) next.deleteAfterRun = true;
		if ("schedule" in next && isRecord(next.schedule) && next.schedule.kind === "cron") {
			const schedule = next.schedule;
			const explicit = normalizeCronStaggerMs(schedule.staggerMs);
			if (explicit !== void 0) schedule.staggerMs = explicit;
			else {
				const expr = typeof schedule.expr === "string" ? schedule.expr : "";
				const defaultStaggerMs = resolveDefaultCronStaggerMs(expr);
				if (defaultStaggerMs !== void 0) schedule.staggerMs = defaultStaggerMs;
			}
		}
		const payload = isRecord(next.payload) ? next.payload : null;
		const payloadKind = payload && typeof payload.kind === "string" ? payload.kind : "";
		const sessionTarget = typeof next.sessionTarget === "string" ? next.sessionTarget : "";
		if (!("delivery" in next && next.delivery !== void 0) && shouldDefaultCronDeliveryToAnnounce({
			payloadKind,
			sessionTarget
		})) next.delivery = { mode: "announce" };
	}
	return { ...next };
}
/** Normalizes a raw cron create request and applies create-time defaults. */
function normalizeCronJobCreate(raw, options) {
	return normalizeCronJobInput(raw, {
		applyDefaults: true,
		...options
	});
}
/** Normalizes a raw cron patch request without filling omitted fields. */
function normalizeCronJobPatch(raw, options) {
	return normalizeCronJobInput(raw, {
		applyDefaults: false,
		...options
	});
}
//#endregion
export { createCronStreamSourceIdentity as a, resolveCronStreamBatching as c, appendCronPayloadText as i, truncateCronStreamBatch as l, normalizeCronJobInput as n, cronStreamScheduleKey as o, normalizeCronJobPatch as r, markCronStreamBatchTruncated as s, normalizeCronJobCreate as t, shouldDefaultCronDeliveryToAnnounce as u };
