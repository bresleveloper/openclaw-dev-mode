import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { R as timestampMsToIsoString } from "./number-coercion-CkhMiRw8.mjs";
import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { p as sanitizeAgentId } from "./session-key-CSDERtm3.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { a as normalizeCronToolsAllowExecTarget, d as snapshotOwnCronRecord, i as normalizeCronScheduledToolPolicy, o as normalizeCronToolsAllowExecTargetRequirement } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { i as resolveCronCurrentSessionTarget, t as assertSafeCronSessionTargetId } from "./session-target-d98pYOqN.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-B3paXGEX.mjs";
import { a as normalizeCronStreamBatching } from "./stream-schedule-C4dQJNrH.mjs";
import { t as isSystemOwnedCronPayloadKind } from "./types--MeiGb_d.mjs";
import { n as shouldDefaultCronDeliveryToAnnounce } from "./delivery-defaults-BZP2TvGw.mjs";
import { a as TimeoutSecondsFieldSchema, c as parseOptionalField, o as TrimmedNonEmptyStringFieldSchema, s as parseDeliveryInput, t as inferCronJobName } from "./normalize-CgAHjzjT.mjs";
import { n as normalizeCronRuntimeAuthority } from "./runtime-authority-D95eqvkj.mjs";
import { t as coerceFiniteScheduleNumber } from "./schedule-number-Dx0UqxJq.mjs";
import { r as resolveDefaultCronStaggerMs, t as normalizeCronStaggerMs } from "./stagger-BWhos2vh.mjs";
import { n as normalizeCronToolsAllowProvenance } from "./tools-allow-provenance-DDhQ9uVg.mjs";
//#region src/cron/inference-binding.ts
/** Stored bindings are private scheduler state, never accepted from public job input. */
function normalizeCronInferenceBinding(value) {
	if (value === void 0) return;
	if (!isRecord(value)) throw new Error("Invalid automation inference binding.");
	const binding = value;
	if (binding.version !== 1 || typeof binding.provider !== "string" || !binding.provider.trim() || typeof binding.profileId !== "string" || !binding.profileId.trim() || typeof binding.authorizationId !== "string" || !/^[a-f0-9]{64}$/.test(binding.authorizationId) || binding.authRequirement !== "api-key" && binding.authRequirement !== "subscription" || binding.source !== "auto" && binding.source !== "user") throw new Error("Invalid automation inference binding; explicitly select an account again.");
	return {
		version: 1,
		provider: binding.provider,
		profileId: binding.profileId,
		authorizationId: binding.authorizationId,
		authRequirement: binding.authRequirement,
		source: binding.source
	};
}
//#endregion
//#region src/cron/normalize-payload.ts
function normalizeTrimmedStringArray(value) {
	if (Array.isArray(value)) {
		const normalized = normalizeTrimmedStringList(value);
		if (normalized.length === 0 && value.length > 0) return;
		return normalized;
	}
	return value === null ? null : void 0;
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
	else if (kindRaw) next.kind = kindRaw;
	for (const field of ["message", "text"]) if (typeof next[field] === "string") next[field] = normalizeOptionalString(next[field]) ?? "";
	if (typeof next.script === "string") next.script = next.script.trim();
	for (const field of ["model", "thinking"]) if (field in next && next[field] !== null) {
		const value = parseOptionalField(TrimmedNonEmptyStringFieldSchema, next[field]);
		if (value !== void 0) next[field] = value;
		else delete next[field];
	}
	if ("timeoutSeconds" in next && next.timeoutSeconds !== null) {
		const timeoutSeconds = parseOptionalField(TimeoutSecondsFieldSchema, next.timeoutSeconds);
		if (timeoutSeconds !== void 0) next.timeoutSeconds = timeoutSeconds;
		else delete next.timeoutSeconds;
	}
	for (const field of ["fallbacks", "toolsAllow"]) if (field in next) {
		const value = normalizeTrimmedStringArray(next[field]);
		if (value !== void 0) next[field] = value;
		else delete next[field];
	}
	if ("argv" in next) {
		const argv = normalizeCronCommandArgv(next.argv);
		if (argv) next.argv = argv;
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
	const kind = next.kind;
	if (kind === "systemEvent" || kind === "agentTurn" || kind === "command" || kind === "script") {
		if (kind !== "systemEvent") delete next.text;
		else delete next.timeoutSeconds;
		if (kind !== "agentTurn") {
			delete next.message;
			delete next.model;
			delete next.fallbacks;
			delete next.thinking;
			delete next.lightContext;
			delete next.allowUnsafeExternalContent;
		}
		if (kind !== "command") {
			delete next.argv;
			delete next.cwd;
			delete next.env;
			delete next.input;
			delete next.noOutputTimeoutSeconds;
			delete next.outputMaxBytes;
		}
		if (kind !== "script") {
			delete next.script;
			delete next.toolBudget;
		}
	}
	return { ...next };
}
//#endregion
//#region src/cron/normalize.ts
/** Normalizes cron create/patch payloads before validation and persistence. */
function coerceSchedule(schedule) {
	const next = snapshotOwnCronRecord(schedule);
	const rawKind = normalizeLowercaseStringOrEmpty(next.kind);
	const kind = rawKind === "at" || rawKind === "every" || rawKind === "cron" || rawKind === "on-exit" || rawKind === "stream" || rawKind === "event" ? rawKind : void 0;
	const exprRaw = normalizeOptionalString(next.expr) ?? "";
	const timezone = normalizeOptionalString(next.tz);
	const commandRaw = readNonBlankString(next.command) ?? "";
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
	} else if (next.kind === "on-exit" || next.kind === "stream" || next.kind === "event") {
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
	if (next.kind !== "event") {
		delete next.source;
		delete next.options;
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
	for (const field of [
		"channel",
		"to",
		"threadId",
		"accountId"
	]) {
		if (next[field] === null) continue;
		if (parsed[field] !== void 0) next[field] = parsed[field];
		else delete next[field];
	}
	if ("failureDestination" in next && next.failureDestination !== null) {
		if (isRecord(next.failureDestination)) next.failureDestination = coerceFailureDestination(next.failureDestination);
		else delete next.failureDestination;
	}
	if ("completionDestination" in next && next.completionDestination !== null) {
		const completionDestination = isRecord(next.completionDestination) ? coerceCompletionDestination(next.completionDestination) : null;
		if (completionDestination) next.completionDestination = completionDestination;
		else delete next.completionDestination;
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
	for (const [field, normalize] of [
		["channel", normalizeOptionalLowercaseString],
		["to", normalizeOptionalString],
		["accountId", normalizeOptionalString]
	]) {
		if (next[field] == null) continue;
		const normalized = normalize(next[field]);
		if (normalized) next[field] = normalized;
		else delete next[field];
	}
	if (next.mode != null) {
		const mode = normalizeOptionalLowercaseString(next.mode);
		if (mode === "announce" || mode === "webhook") next.mode = mode;
		else delete next.mode;
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
	const trimmed = normalizeOptionalLowercaseString(raw);
	if (trimmed === "now" || trimmed === "next-heartbeat") return trimmed;
}
/** Normalizes raw cron job input without deciding whether create-time defaults apply. */
function normalizeCronJobInput(raw, options = { applyDefaults: false }) {
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
	for (const [field, normalize] of [
		["scheduledToolPolicy", normalizeCronScheduledToolPolicy],
		["toolsAllowProvenance", normalizeCronToolsAllowProvenance],
		["toolsAllowExecTarget", normalizeCronToolsAllowExecTarget],
		["toolsAllowExecTargetRequirement", normalizeCronToolsAllowExecTargetRequirement],
		["runtimeAuthority", normalizeCronRuntimeAuthority],
		["inferenceBinding", normalizeCronInferenceBinding]
	]) {
		if (!(field in base)) continue;
		const value = normalize(base[field]);
		if (value) next[field] = value;
		else delete next[field];
	}
	if (base.runtimeAuthorityRecoveryRequired === true) next.runtimeAuthorityRecoveryRequired = true;
	else delete next.runtimeAuthorityRecoveryRequired;
	for (const field of ["agentId", "sessionKey"]) if (typeof base[field] === "string") {
		const trimmed = base[field].trim();
		if (trimmed) next[field] = field === "agentId" ? sanitizeAgentId(trimmed) : trimmed;
		else delete next[field];
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
	if ("trigger" in base && base.trigger !== null) {
		if (isRecord(base.trigger)) next.trigger = coerceTrigger(base.trigger);
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
export { normalizeCronJobInput as n, normalizeCronJobPatch as r, normalizeCronJobCreate as t };
