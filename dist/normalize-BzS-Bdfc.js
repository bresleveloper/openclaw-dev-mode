import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord } from "./utils-BApvfmPs.js";
import { g as sanitizeAgentId } from "./session-key-pTKRJb0m.js";
import { An as preprocess, Rn as string, Xn as union, wn as number, yt as _enum } from "./schemas-6cH6bZ7o.js";
import { i as parseAbsoluteTimeMs, r as resolveDefaultCronStaggerMs, t as normalizeCronStaggerMs } from "./stagger-q3jv0Ns2.js";
import { r as resolveCronCurrentSessionTarget, s as inferCronJobName, t as assertSafeCronSessionTargetId, u as coerceFiniteScheduleNumber } from "./session-target-BoV6mLXy.js";
import path from "node:path";
//#region src/cron/store/key.ts
/** Cron store key normalization for SQLite partitions. */
/** Returns the canonical per-file SQLite partition key for cron store rows. */
function cronStoreKey(storePath) {
	return path.resolve(storePath);
}
//#endregion
//#region src/cron/delivery-field-schemas.ts
/** Parses user-provided cron delivery fields into narrow runtime values. */
const trimStringPreprocess = (value) => typeof value === "string" ? value.trim() : value;
const trimLowercaseStringPreprocess = (value) => normalizeOptionalLowercaseString(value) ?? value;
const DeliveryModeFieldSchema = preprocess(trimLowercaseStringPreprocess, _enum([
	"deliver",
	"announce",
	"none",
	"webhook"
])).transform((value) => value === "deliver" ? "announce" : value);
/** Accepts non-empty string fields after trimming and lowercasing user-provided delivery input. */
const LowercaseNonEmptyStringFieldSchema = preprocess(trimLowercaseStringPreprocess, string().min(1));
/** Accepts non-empty string fields after trimming delivery input without changing case. */
const TrimmedNonEmptyStringFieldSchema = preprocess(trimStringPreprocess, string().min(1));
/** Accepts delivery thread identifiers as either trimmed strings or finite numeric ids. */
const DeliveryThreadIdFieldSchema = union([TrimmedNonEmptyStringFieldSchema, number().finite()]);
/** Accepts non-negative finite timeout seconds from cron delivery payloads. */
const TimeoutSecondsFieldSchema = number().finite().nonnegative();
/** Parses optional cron delivery fields while dropping invalid values instead of throwing. */
function parseDeliveryInput(input) {
	return {
		mode: parseOptionalField(DeliveryModeFieldSchema, input.mode),
		channel: parseOptionalField(LowercaseNonEmptyStringFieldSchema, input.channel),
		to: parseOptionalField(TrimmedNonEmptyStringFieldSchema, input.to),
		threadId: parseOptionalField(DeliveryThreadIdFieldSchema, input.threadId),
		accountId: parseOptionalField(TrimmedNonEmptyStringFieldSchema, input.accountId)
	};
}
/** Returns a parsed field value only when the supplied schema accepts it. */
function parseOptionalField(schema, value) {
	const parsed = schema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
//#endregion
//#region src/cron/normalize.ts
/** Normalizes cron create/patch payloads before validation and persistence. */
const DEFAULT_OPTIONS = { applyDefaults: false };
function normalizeTrimmedStringArray(value, options) {
	if (Array.isArray(value)) {
		const normalized = normalizeTrimmedStringList(value);
		if (normalized.length === 0 && value.length > 0) return;
		return normalized;
	}
	if (options?.allowNull && value === null) return null;
}
function normalizeTrimmedStringRecord(value) {
	if (!isRecord(value)) return;
	const entries = [];
	for (const [rawKey, rawValue] of Object.entries(value)) {
		const key = normalizeOptionalString(rawKey);
		const val = typeof rawValue === "string" ? rawValue : void 0;
		if (!key || val === void 0) return;
		entries.push([key, val]);
	}
	return Object.fromEntries(entries);
}
function normalizeCommandArgv(value) {
	if (!Array.isArray(value) || value.length === 0) return;
	if (value.some((entry) => typeof entry !== "string" || entry.length === 0)) return;
	return [...value];
}
function hasAgentTurnOnlyPayloadHint(payload) {
	return "model" in payload || "fallbacks" in payload || "thinking" in payload || "timeoutSeconds" in payload || "toolsAllow" in payload || typeof payload.lightContext === "boolean" || typeof payload.allowUnsafeExternalContent === "boolean";
}
function coerceSchedule(schedule) {
	const next = { ...schedule };
	const rawKind = normalizeLowercaseStringOrEmpty(schedule.kind);
	const kind = rawKind === "at" || rawKind === "every" || rawKind === "cron" ? rawKind : void 0;
	const exprRaw = normalizeOptionalString(schedule.expr) ?? "";
	const everyMs = coerceFiniteScheduleNumber(schedule.everyMs);
	const anchorMs = coerceFiniteScheduleNumber(schedule.anchorMs);
	const atString = normalizeOptionalString(schedule.at) ?? "";
	const parsedAtMs = atString ? parseAbsoluteTimeMs(atString) : null;
	if (kind) next.kind = kind;
	const parsedAtIso = parsedAtMs !== null ? timestampMsToIsoString(parsedAtMs) : void 0;
	if (atString) next.at = parsedAtIso ?? atString;
	else if (parsedAtIso !== void 0) next.at = parsedAtIso;
	if (exprRaw) next.expr = exprRaw;
	else if ("expr" in next) delete next.expr;
	if (everyMs !== void 0 && everyMs >= 1) next.everyMs = Math.floor(everyMs);
	if (anchorMs !== void 0 && anchorMs >= 0) next.anchorMs = Math.floor(anchorMs);
	const staggerMs = normalizeCronStaggerMs(schedule.staggerMs);
	if (staggerMs !== void 0) next.staggerMs = staggerMs;
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
	}
	return next;
}
function coercePayload(payload) {
	const next = { ...payload };
	const kindRaw = normalizeLowercaseStringOrEmpty(next.kind);
	if (kindRaw === "agentturn") next.kind = "agentTurn";
	else if (kindRaw === "systemevent") next.kind = "systemEvent";
	else if (kindRaw === "command") next.kind = "command";
	else if (kindRaw) next.kind = kindRaw;
	if (typeof next.message === "string") {
		const trimmed = normalizeOptionalString(next.message) ?? "";
		if (trimmed) next.message = trimmed;
		else next.message = "";
	}
	if (typeof next.text === "string") {
		const trimmed = normalizeOptionalString(next.text) ?? "";
		if (trimmed) next.text = trimmed;
		else next.text = "";
	}
	if ("model" in next) if (next.model === null) next.model = null;
	else {
		const model = parseOptionalField(TrimmedNonEmptyStringFieldSchema, next.model);
		if (model !== void 0) next.model = model;
		else delete next.model;
	}
	if ("thinking" in next) {
		const thinking = parseOptionalField(TrimmedNonEmptyStringFieldSchema, next.thinking);
		if (thinking !== void 0) next.thinking = thinking;
		else delete next.thinking;
	}
	if ("timeoutSeconds" in next) {
		const timeoutSeconds = parseOptionalField(TimeoutSecondsFieldSchema, next.timeoutSeconds);
		if (timeoutSeconds !== void 0) next.timeoutSeconds = timeoutSeconds;
		else delete next.timeoutSeconds;
	}
	if ("fallbacks" in next) {
		const fallbacks = normalizeTrimmedStringArray(next.fallbacks, { allowNull: true });
		if (fallbacks !== void 0) next.fallbacks = fallbacks;
		else delete next.fallbacks;
	}
	if ("toolsAllow" in next) {
		const toolsAllow = normalizeTrimmedStringArray(next.toolsAllow, { allowNull: true });
		if (toolsAllow !== void 0) next.toolsAllow = toolsAllow;
		else delete next.toolsAllow;
	}
	if ("argv" in next) {
		const argv = normalizeCommandArgv(next.argv);
		if (Array.isArray(argv) && argv.length > 0) next.argv = argv;
		else delete next.argv;
	}
	if ("cwd" in next) {
		const cwd = parseOptionalField(TrimmedNonEmptyStringFieldSchema, next.cwd);
		if (cwd !== void 0) next.cwd = cwd;
		else delete next.cwd;
	}
	if ("env" in next) {
		const env = normalizeTrimmedStringRecord(next.env);
		if (env !== void 0) next.env = env;
		else delete next.env;
	}
	if ("input" in next && typeof next.input !== "string") delete next.input;
	if ("noOutputTimeoutSeconds" in next) {
		const noOutputTimeoutSeconds = parseOptionalField(TimeoutSecondsFieldSchema, next.noOutputTimeoutSeconds);
		if (noOutputTimeoutSeconds !== void 0) next.noOutputTimeoutSeconds = noOutputTimeoutSeconds;
		else delete next.noOutputTimeoutSeconds;
	}
	if ("outputMaxBytes" in next) {
		const outputMaxBytes = parseOptionalField(TimeoutSecondsFieldSchema, next.outputMaxBytes);
		if (outputMaxBytes !== void 0 && outputMaxBytes > 0) next.outputMaxBytes = Math.floor(outputMaxBytes);
		else delete next.outputMaxBytes;
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
		delete next.toolsAllow;
		delete next.argv;
		delete next.cwd;
		delete next.env;
		delete next.input;
		delete next.noOutputTimeoutSeconds;
		delete next.outputMaxBytes;
	} else if (next.kind === "agentTurn") {
		delete next.text;
		delete next.argv;
		delete next.cwd;
		delete next.env;
		delete next.input;
		delete next.noOutputTimeoutSeconds;
		delete next.outputMaxBytes;
	} else if (next.kind === "command") {
		delete next.text;
		delete next.message;
		delete next.model;
		delete next.fallbacks;
		delete next.thinking;
		delete next.lightContext;
		delete next.allowUnsafeExternalContent;
		delete next.toolsAllow;
	}
	return next;
}
function coerceDelivery(delivery) {
	const next = { ...delivery };
	const parsed = parseDeliveryInput(delivery);
	if (parsed.mode !== void 0) next.mode = parsed.mode;
	else if ("mode" in next) delete next.mode;
	if ("channel" in delivery && delivery.channel === null) next.channel = null;
	else if (parsed.channel !== void 0) next.channel = parsed.channel;
	else if ("channel" in next) delete next.channel;
	if ("to" in delivery && delivery.to === null) next.to = null;
	else if (parsed.to !== void 0) next.to = parsed.to;
	else if ("to" in next) delete next.to;
	if ("threadId" in delivery && delivery.threadId === null) next.threadId = null;
	else if (parsed.threadId !== void 0) next.threadId = parsed.threadId;
	else if ("threadId" in next) delete next.threadId;
	if ("accountId" in delivery && delivery.accountId === null) next.accountId = null;
	else if (parsed.accountId !== void 0) next.accountId = parsed.accountId;
	else if ("accountId" in next) delete next.accountId;
	if ("failureDestination" in next) if (next.failureDestination === null) next.failureDestination = null;
	else if (isRecord(next.failureDestination)) next.failureDestination = coerceFailureDestination(next.failureDestination);
	else delete next.failureDestination;
	if ("completionDestination" in next) if (next.completionDestination === null) next.completionDestination = null;
	else {
		const completionDestination = isRecord(next.completionDestination) ? coerceCompletionDestination(next.completionDestination) : null;
		if (completionDestination) next.completionDestination = completionDestination;
		else delete next.completionDestination;
	}
	return next;
}
function coerceCompletionDestination(value) {
	const mode = normalizeOptionalLowercaseString(value.mode);
	const to = normalizeOptionalString(value.to);
	if (mode !== "webhook") return null;
	return {
		mode,
		...to ? { to } : {}
	};
}
function coerceFailureDestination(value) {
	const next = { ...value };
	if ("channel" in next) if (next.channel === null) next.channel = null;
	else if (next.channel === void 0) next.channel = void 0;
	else {
		const channel = normalizeOptionalLowercaseString(next.channel);
		if (channel) next.channel = channel;
		else delete next.channel;
	}
	if ("to" in next) if (next.to === null) next.to = null;
	else if (next.to === void 0) next.to = void 0;
	else {
		const to = normalizeOptionalString(next.to);
		if (to) next.to = to;
		else delete next.to;
	}
	if ("accountId" in next) if (next.accountId === null) next.accountId = null;
	else if (next.accountId === void 0) next.accountId = void 0;
	else {
		const accountId = normalizeOptionalString(next.accountId);
		if (accountId) next.accountId = accountId;
		else delete next.accountId;
	}
	if ("mode" in next) if (next.mode === null) next.mode = null;
	else if (next.mode === void 0) next.mode = void 0;
	else {
		const mode = normalizeOptionalLowercaseString(next.mode);
		if (mode === "announce" || mode === "webhook") next.mode = mode;
		else delete next.mode;
	}
	return next;
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
	const base = raw;
	const next = { ...base };
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
		const enabled = base.enabled;
		if (typeof enabled === "boolean") next.enabled = enabled;
		else if (typeof enabled === "string") {
			const trimmed = normalizeOptionalLowercaseString(enabled);
			if (trimmed === "true") next.enabled = true;
			if (trimmed === "false") next.enabled = false;
		}
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
	if (isRecord(base.payload)) next.payload = coercePayload(base.payload);
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
			if (kind === "systemEvent") next.sessionTarget = "main";
			else if (kind === "agentTurn" || kind === "command") next.sessionTarget = "isolated";
		}
		const resolvedSessionTarget = resolveCronCurrentSessionTarget({
			sessionTarget: typeof next.sessionTarget === "string" ? next.sessionTarget : void 0,
			sessionKey: options.sessionContext?.sessionKey
		});
		if (resolvedSessionTarget !== void 0) next.sessionTarget = resolvedSessionTarget;
		else delete next.sessionTarget;
		if ("schedule" in next && isRecord(next.schedule) && next.schedule.kind === "at" && !("deleteAfterRun" in next)) next.deleteAfterRun = true;
		if ("schedule" in next && isRecord(next.schedule) && next.schedule.kind === "cron") {
			const schedule = next.schedule;
			const explicit = normalizeCronStaggerMs(schedule.staggerMs);
			if (explicit !== void 0) schedule.staggerMs = explicit;
			else {
				const defaultStaggerMs = resolveDefaultCronStaggerMs(typeof schedule.expr === "string" ? schedule.expr : "");
				if (defaultStaggerMs !== void 0) schedule.staggerMs = defaultStaggerMs;
			}
		}
		const payload = isRecord(next.payload) ? next.payload : null;
		const payloadKind = payload && typeof payload.kind === "string" ? payload.kind : "";
		const sessionTarget = typeof next.sessionTarget === "string" ? next.sessionTarget : "";
		const isDetachedDeliveryJob = sessionTarget === "isolated" || sessionTarget === "current" || sessionTarget.startsWith("session:") || sessionTarget === "" && (payloadKind === "agentTurn" || payloadKind === "command");
		if (!("delivery" in next && next.delivery !== void 0) && isDetachedDeliveryJob && (payloadKind === "agentTurn" || payloadKind === "command")) next.delivery = { mode: "announce" };
	}
	return next;
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
export { LowercaseNonEmptyStringFieldSchema as a, cronStoreKey as c, DeliveryThreadIdFieldSchema as i, normalizeCronJobInput as n, TrimmedNonEmptyStringFieldSchema as o, normalizeCronJobPatch as r, parseOptionalField as s, normalizeCronJobCreate as t };
