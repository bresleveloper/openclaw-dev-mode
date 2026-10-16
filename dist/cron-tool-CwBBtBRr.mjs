import { o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { R as timestampMsToIsoString, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-DgZn2dLu.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { u as CRON_TOOL_DISPLAY_SUMMARY } from "./tool-catalog-DyHnjiiS.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-DWHChhWM.mjs";
import { r as createToolPolicyMatcher } from "./tool-policy-match-Dn8gpf-E.mjs";
import { o as expandPolicyWithPluginGroups, r as buildPluginToolGroups } from "./tool-policy-BKvvmcQR.mjs";
import { t as isStringOption } from "./string-readers-V5CfgPTP.mjs";
import { v as recordCronNextCheckProposal } from "./agent-run-registry-BaxMDLZF.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-B3vfipkP.mjs";
import { Ou as CronRunLogEntrySchema, Tu as CronJobSchema, xu as CronDeliveryPreviewSchema, yu as CronAddResultSchema } from "./src-l2dWvEsN.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { n as resolveCronListPageNextOffset, t as readCanonicalCronListPage } from "./list-page-validation-gRErNGAY.mjs";
import { r as normalizeCronJobPatch, t as normalizeCronJobCreate } from "./normalize-Lu86QQtC.mjs";
import { t as parseCronPacingBounds } from "./pacing-BQDaWZD6.mjs";
import "./client-CrrkVIh8.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import { H as extractTextFromChatContent } from "./user-facing-text-DC1sCo4O.mjs";
import { f as readCronScheduledToolProjection, l as setToolTerminalPresentation } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { c as readNonNegativeIntegerParam, m as readToolStringParam, u as readPositiveIntegerParam } from "./common-Dyxcwsy8.mjs";
import { a as getGatewayToolCallerIdentity, d as withGatewayToolCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
import { t as extractDeliveryInfo } from "./delivery-info-COt2T8KL.mjs";
import { t as CRON_MANAGEMENT_METHODS } from "./cron-creator-authority-grant-B3kDRd63.mjs";
import { n as readGatewayCallOptions, t as callGatewayTool } from "./gateway-w2F8o2pH.mjs";
import { a as optionalNonNegativeIntegerSchema, c as optionalStringEnum, l as stringEnum, o as optionalPositiveIntegerSchema } from "./typebox-X-jU33BZ.mjs";
import { n as defineToolOutputSchema } from "./tool-output-schema-Bc4BKbzN.mjs";
import { a as bindCronRequesterGrant, i as bindCronManagementGrant } from "./cron-creator-authority-context-aezDQHzt.mjs";
import { t as gatewayCallOptionSchemaProperties } from "./gateway-schema-CKX1iL47.mjs";
import { a as resolveInternalSessionKey, o as resolveMainSessionAlias } from "./sessions-resolution-ZZ7dnwCs.mjs";
import "./sessions-helpers-BhYHEF2P.mjs";
import { t as assertCronDeliveryInputNonBlankFields } from "./delivery-target-validation-D5dmr1ev.mjs";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BqkZLKq3.mjs";
import { Type } from "typebox";
//#region src/cron/delivery-context.ts
/** Converts live or stored session routing into cron delivery config. */
function isInternalDeliveryContext(context) {
	const channel = context?.channel?.trim().toLowerCase();
	return Boolean(channel && (channel === "webchat" || isInternalNonDeliveryChannel(channel)));
}
/** Converts an active delivery context into cron announce delivery config. */
function cronDeliveryFromContext(context) {
	const normalized = normalizeDeliveryContext(context);
	if (!normalized?.to) return null;
	if (isInternalDeliveryContext(normalized)) return null;
	const delivery = {
		mode: "announce",
		to: normalized.to
	};
	if (normalized.channel) delivery.channel = normalized.channel;
	if (normalized.accountId) delivery.accountId = normalized.accountId;
	if (normalized.threadId != null) delivery.threadId = normalized.threadId;
	return delivery;
}
/** Recovers delivery context from a stored session key captured when the cron job was created. */
function resolveCronStoredDeliveryContext(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	const { deliveryContext, threadId } = extractDeliveryInfo(sessionKey, { cfg: params.cfg });
	if (deliveryContext && threadId) return {
		...deliveryContext,
		threadId
	};
	return deliveryContext;
}
/** Resolves initial cron delivery, preferring the live context before falling back to session storage. */
function resolveCronCreationDelivery(params) {
	if (isInternalDeliveryContext(params.currentDeliveryContext)) return null;
	return cronDeliveryFromContext(params.currentDeliveryContext) ?? cronDeliveryFromContext(resolveCronStoredDeliveryContext({
		cfg: params.cfg,
		sessionKey: params.agentSessionKey
	}));
}
//#endregion
//#region src/agents/tools/cron-tool-canonicalize.ts
const CRON_SCHEDULE_KINDS$1 = [
	"at",
	"every",
	"cron",
	"on-exit",
	"stream"
];
const CRON_PAYLOAD_KINDS$1 = [
	"systemEvent",
	"agentTurn",
	"script",
	"command"
];
const CRON_FLAT_PAYLOAD_KEYS = [
	"message",
	"text",
	"script",
	"model",
	"fallbacks",
	"toolsAllow",
	"thinking",
	"timeoutSeconds",
	"toolBudget",
	"lightContext",
	"allowUnsafeExternalContent"
];
const CRON_FLAT_SCHEDULE_KEYS = [
	"kind",
	"at",
	"atMs",
	"every",
	"everyMs",
	"anchorMs",
	"cron",
	"expr",
	"tz",
	"stagger",
	"staggerMs",
	"exact",
	"command",
	"cwd",
	"mode",
	"match",
	"batchMs",
	"maxBatchBytes"
];
const CRON_RECOVERABLE_OBJECT_KEYS = /* @__PURE__ */ new Set([
	"name",
	"declarationKey",
	"displayName",
	"owner",
	"schedule",
	"pacing",
	"trigger",
	"sessionTarget",
	"wakeMode",
	"payload",
	"delivery",
	"enabled",
	"description",
	"deleteAfterRun",
	"agentId",
	"sessionKey",
	"failureAlert",
	"namePayload",
	"scheduleKind",
	"sessionTargetName",
	...CRON_FLAT_PAYLOAD_KEYS,
	...CRON_FLAT_SCHEDULE_KEYS
]);
const CRON_NESTABLE_OBJECT_KEYS = /* @__PURE__ */ new Set([
	"delivery",
	"failureAlert",
	"owner",
	"pacing",
	"payload",
	"schedule",
	"trigger"
]);
/** Path segments that would reach Object.prototype when assigned while nesting. */
const CRON_UNSAFE_KEY_SEGMENTS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function isCronScheduleKind(value) {
	return isStringOption(value, CRON_SCHEDULE_KINDS$1);
}
function isCronPayloadKind(value) {
	return isStringOption(value, CRON_PAYLOAD_KINDS$1);
}
function isStringArrayOrNull(value) {
	return value === null || Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function moveDefinedField(source, target, from, to = from) {
	if (source[from] === void 0) return false;
	target[to] = source[from];
	delete source[from];
	return true;
}
function repairConcatenatedCronToolKeys(value) {
	if (!isRecord(value.payload) && isRecord(value.namePayload)) value.payload = { ...value.namePayload };
	const rawScheduleKind = value.scheduleKind;
	if (!isRecord(value.schedule)) {
		if (isRecord(rawScheduleKind)) value.schedule = { ...rawScheduleKind };
		else if (isCronScheduleKind(rawScheduleKind)) value.schedule = { kind: rawScheduleKind };
	} else if (isCronScheduleKind(rawScheduleKind) && !isCronScheduleKind(value.schedule.kind)) value.schedule = {
		...value.schedule,
		kind: rawScheduleKind
	};
	if (!hasNonEmptyString(value.name) && hasNonEmptyString(value.sessionTargetName)) value.name = value.sessionTargetName;
	delete value.namePayload;
	delete value.scheduleKind;
	delete value.sessionTargetName;
}
function setScheduleAtMs(schedule, value) {
	const atMs = typeof value === "number" ? value : Number(value);
	schedule.at = Number.isFinite(atMs) ? timestampMsToIsoString(Math.floor(atMs)) ?? value : value;
	if (!isCronScheduleKind(schedule.kind)) schedule.kind = "at";
}
function canonicalizeCronToolSchedule(value) {
	const schedule = isRecord(value.schedule) ? { ...value.schedule } : {};
	if (schedule.atMs !== void 0) {
		setScheduleAtMs(schedule, schedule.atMs);
		delete schedule.atMs;
	}
	for (const [from, to] of [
		["every", "everyMs"],
		["cron", "expr"],
		["stagger", "staggerMs"]
	]) if (schedule[to] === void 0) moveDefinedField(schedule, schedule, from, to);
	if (schedule.exact === true && schedule.staggerMs === void 0) schedule.staggerMs = 0;
	delete schedule.exact;
	if (isCronScheduleKind(value.kind) && !isCronScheduleKind(schedule.kind)) {
		schedule.kind = value.kind;
		delete value.kind;
	}
	if (moveDefinedField(value, schedule, "at") && !isCronScheduleKind(schedule.kind)) schedule.kind = "at";
	if (value.atMs !== void 0) {
		setScheduleAtMs(schedule, value.atMs);
		delete value.atMs;
	}
	for (const [kind, target, sources] of [
		[
			"every",
			"everyMs",
			["everyMs", "every"]
		],
		[
			"cron",
			"expr",
			["cron", "expr"]
		],
		[
			"on-exit",
			"command",
			["command"]
		]
	]) if (sources.some((source) => moveDefinedField(value, schedule, source, target)) && !isCronScheduleKind(schedule.kind)) schedule.kind = kind;
	for (const key of [
		"anchorMs",
		"tz",
		"staggerMs",
		"cwd",
		"mode",
		"match",
		"batchMs",
		"maxBatchBytes"
	]) moveDefinedField(value, schedule, key);
	moveDefinedField(value, schedule, "stagger", "staggerMs");
	if (value.exact === true && schedule.staggerMs === void 0) schedule.staggerMs = 0;
	delete value.exact;
	if (!isCronScheduleKind(schedule.kind)) {
		if (schedule.at !== void 0) schedule.kind = "at";
		else if (schedule.everyMs !== void 0) schedule.kind = "every";
		else if (schedule.expr !== void 0) schedule.kind = "cron";
		else if (schedule.command !== void 0) schedule.kind = "on-exit";
	}
	if (isRecord(value.schedule) || Object.keys(schedule).length > 0) value.schedule = schedule;
}
function canonicalizeCronToolPayload(value) {
	const payload = isRecord(value.payload) ? { ...value.payload } : {};
	for (const key of CRON_FLAT_PAYLOAD_KEYS) moveDefinedField(value, payload, key);
	if (isCronPayloadKind(value.kind) && !isCronPayloadKind(payload.kind)) {
		payload.kind = value.kind;
		delete value.kind;
	}
	if (!isCronPayloadKind(payload.kind)) {
		if (hasNonEmptyString(payload.script)) payload.kind = "script";
		else if (hasNonEmptyString(payload.message) || hasNonEmptyString(payload.model) || payload.model === null || hasNonEmptyString(payload.thinking) || typeof payload.timeoutSeconds === "number" && hasNonEmptyString(payload.text) || typeof payload.lightContext === "boolean" || typeof payload.allowUnsafeExternalContent === "boolean" || payload.fallbacks !== void 0 && isStringArrayOrNull(payload.fallbacks)) payload.kind = "agentTurn";
		else if (hasNonEmptyString(payload.text)) payload.kind = "systemEvent";
	}
	if (isRecord(value.payload) || Object.keys(payload).length > 0) value.payload = payload;
}
function repairPaddedCronKeys(value) {
	for (const key of Object.keys(value)) {
		const trimmed = key.trim();
		if (trimmed !== key && CRON_RECOVERABLE_OBJECT_KEYS.has(trimmed) && !(trimmed in value)) {
			value[trimmed] = value[key];
			delete value[key];
		}
	}
}
function stripCronKeyQuotes(segment) {
	if (segment.length >= 2) {
		const first = segment[0];
		if ((first === "\"" || first === "'") && segment.endsWith(first)) return segment.slice(1, -1);
	}
	return segment;
}
function nestDottedCronKey(value, key, entry, canonicalRoots) {
	const segments = stripCronKeyQuotes(key.trim()).split(".").map((segment) => segment.trim());
	if (segments[0] === "job") segments.shift();
	const [root, ...rest] = segments;
	if (rest.length === 0 || !root || !CRON_NESTABLE_OBJECT_KEYS.has(root)) return "ignored";
	if (segments.some((segment) => !segment || CRON_UNSAFE_KEY_SEGMENTS.has(segment))) return "ignored";
	let cursor = value;
	for (const [index, segment] of segments.entries()) {
		const last = index === segments.length - 1;
		if (segment in cursor) {
			if (last) return "conflict";
			const child = cursor[segment];
			if (!isRecord(child)) return "conflict";
			if (canonicalRoots.has(root)) return "recovered";
			cursor = child;
			continue;
		}
		if (last) {
			cursor[segment] = entry;
			return "recovered";
		}
		const child = {};
		cursor[segment] = child;
		cursor = child;
	}
	return "recovered";
}
/** Converts model-friendly cron tool shorthands into the nested gateway job/patch shape. */
function canonicalizeCronToolObject(value) {
	const next = { ...isRecord(value.data) ? value.data : isRecord(value.job) ? value.job : value };
	repairPaddedCronKeys(next);
	repairConcatenatedCronToolKeys(next);
	canonicalizeCronToolSchedule(next);
	canonicalizeCronToolPayload(next);
	return next;
}
const CRON_CREATE_NULLABLE_TOP_LEVEL_KEYS = /* @__PURE__ */ new Set(["agentId", "sessionKey"]);
function deleteNullFields(record, keep) {
	for (const [key, entry] of Object.entries(record)) if (entry === null && !keep?.has(key)) delete record[key];
	else if (isRecord(entry)) deleteNullFields(entry);
}
/**
* Drops null-valued fields from a create job in place. The model-facing job
* schema is shared with update, where null means "clear this field"; on create
* there is nothing to clear, and the strict gateway cron.add contract rejects
* the nulls its update patch accepts.
*/
function stripCronCreateNullClears(value) {
	deleteNullFields(value, CRON_CREATE_NULLABLE_TOP_LEVEL_KEYS);
	return value;
}
/** Detects recovered update patches that contain no meaningful cron fields after normalization. */
function isEmptyRecoveredCronPatch(value) {
	if (!isRecord(value)) return true;
	const keys = Object.keys(value);
	return keys.length === 0 || keys.length === 1 && keys[0] === "payload" && isRecord(value.payload) && Object.keys(value.payload).length === 0;
}
/** Recovers cron job or patch fields that a model flattened beside the action arguments. */
function recoverCronObjectFromFlatParams(params) {
	const value = {};
	let found = false;
	for (const key of Object.keys(params)) if (CRON_RECOVERABLE_OBJECT_KEYS.has(key) && params[key] !== void 0) {
		value[key] = params[key];
		found = true;
	}
	const canonicalRoots = new Set(Object.keys(value));
	for (const key of Object.keys(params)) {
		if (CRON_RECOVERABLE_OBJECT_KEYS.has(key) || params[key] === void 0) continue;
		const outcome = nestDottedCronKey(value, key, params[key], canonicalRoots);
		if (outcome === "recovered") found = true;
		else if (outcome === "conflict") {
			value[key] = params[key];
			found = true;
		}
	}
	return {
		found,
		value: canonicalizeCronToolObject(value)
	};
}
/** Checks whether a recovered flat object has enough schedule/payload signal to create a job. */
function hasCronCreateSignal(value) {
	return value.schedule !== void 0 || value.at !== void 0 || value.atMs !== void 0 || value.everyMs !== void 0 || value.cron !== void 0 || value.expr !== void 0 || value.payload !== void 0 || value.message !== void 0 || value.text !== void 0;
}
const CRON_ACTIONS = [
	"status",
	"list",
	"get",
	"add",
	"update",
	"remove",
	"run",
	"runs",
	"next_check",
	"wake"
];
const CRON_SELF_ACTIONS = [
	"status",
	"list",
	"get",
	"remove",
	"runs",
	"next_check"
];
const CRON_SCHEDULE_KINDS = [
	"at",
	"every",
	"cron",
	"stream"
];
const CRON_SCHEDULE_KINDS_TRIGGERS_DISABLED = [
	"at",
	"every",
	"cron"
];
const CRON_WAKE_MODES = ["now", "next-heartbeat"];
const CRON_PAYLOAD_KINDS = [
	"systemEvent",
	"agentTurn",
	"script"
];
const CRON_PAYLOAD_KINDS_TRIGGERS_DISABLED = ["systemEvent", "agentTurn"];
const CRON_DELIVERY_MODES = [
	"none",
	"announce",
	"webhook"
];
const CRON_RUN_MODES = ["due", "force"];
function nullableStringSchema(description) {
	return Type.Optional(Type.Union([Type.String(), Type.Null()], { description }));
}
function nullableStringArraySchema(description) {
	return Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()], { description }));
}
function deliveryStringSchema(description) {
	return nullableStringSchema(`${description}, or null to clear`);
}
function createCronScheduleSchema(params) {
	return Type.Optional(Type.Object({
		kind: optionalStringEnum([...params.triggersEnabled ? CRON_SCHEDULE_KINDS : CRON_SCHEDULE_KINDS_TRIGGERS_DISABLED, ...params.management ? ["on-exit"] : []], { description: "Schedule kind" }),
		at: Type.Optional(Type.String({ description: "ISO-8601 time (kind=at)" })),
		everyMs: optionalPositiveIntegerSchema({
			description: "Interval ms (kind=every)",
			maximum: MAX_DATE_TIMESTAMP_MS
		}),
		anchorMs: optionalNonNegativeIntegerSchema({
			description: "Start anchor ms (kind=every)",
			maximum: MAX_DATE_TIMESTAMP_MS
		}),
		expr: Type.Optional(Type.String({ description: "Cron wall-time expr; never UTC-convert. Missing tz=Gateway local. Example \"0 18 * * *\", \"Asia/Shanghai\"." })),
		tz: Type.Optional(Type.String({ description: "IANA timezone for wall-clock fields; missing=Gateway host local timezone. Example \"Asia/Shanghai\"." })),
		staggerMs: optionalNonNegativeIntegerSchema({
			description: "Jitter ms (kind=cron)",
			maximum: MAX_DATE_TIMESTAMP_MS
		}),
		...params.triggersEnabled || params.management ? {
			command: Type.Optional(Type.Union([Type.Array(Type.String({ minLength: 1 }), { minItems: 1 }), ...params.management ? [Type.String()] : []], { description: "Supervised source argv (kind=stream; disabled when cron.triggers.enabled=false)" })),
			cwd: Type.Optional(Type.String({ description: "Working directory (kind=stream)" })),
			mode: optionalStringEnum(["line", "match"]),
			match: Type.Optional(Type.String({ description: "Regex source (stream match mode)" })),
			batchMs: optionalNonNegativeIntegerSchema(),
			maxBatchBytes: optionalNonNegativeIntegerSchema()
		} : {}
	}, { additionalProperties: true }));
}
function createCronPacingSchema() {
	const pacing = Type.Object({
		min: Type.Optional(Type.String({ description: "Minimum dynamic delay" })),
		max: Type.Optional(Type.String({ description: "Maximum dynamic delay" }))
	}, {
		additionalProperties: false,
		description: "Dynamic-cadence bounds; at least one of min or max is required"
	});
	return Type.Optional(Type.Union([pacing, Type.Null()]));
}
function assertCronPacingInput(value) {
	if (value === void 0 || value === null) return;
	if (!isRecord(value)) throw new Error("cron pacing must be an object");
	parseCronPacingBounds(value);
}
function createCronPayloadSchema(params) {
	return Type.Optional(Type.Object({
		kind: optionalStringEnum([...params.triggersEnabled ? CRON_PAYLOAD_KINDS : CRON_PAYLOAD_KINDS_TRIGGERS_DISABLED, ...params.management ? ["command"] : []], { description: "Payload kind" }),
		text: Type.Optional(Type.String({ description: "systemEvent text" })),
		message: Type.Optional(Type.String({ description: "agentTurn prompt" })),
		...params.management ? { argv: Type.Optional(Type.Array(Type.String(), { description: "Existing command job argv" })) } : {},
		...params.triggersEnabled ? { script: Type.Optional(Type.String({ description: "Headless code-mode script" })) } : {},
		model: nullableStringSchema("Model override, or null to clear"),
		thinking: Type.Optional(Type.String({ description: "Thinking override" })),
		timeoutSeconds: Type.Optional(Type.Union([Type.Number({ minimum: 0 }), Type.Null()], { description: "Timeout seconds; null restores the default on update (omission preserves it)" })),
		...params.triggersEnabled ? { toolBudget: optionalPositiveIntegerSchema({ description: "Maximum script tool calls" }) } : {},
		lightContext: Type.Optional(Type.Boolean({ description: "Lightweight bootstrap context (skip full workspace context)" })),
		allowUnsafeExternalContent: Type.Optional(Type.Boolean({ description: "Allow untrusted external content in prompt" })),
		fallbacks: nullableStringArraySchema("Fallback models, or null to clear"),
		toolsAllow: nullableStringArraySchema("Allowed tool ids, or null to clear")
	}, { additionalProperties: true }));
}
function createCronTriggerSchema() {
	const trigger = Type.Object({
		script: Type.String({
			minLength: 1,
			maxLength: 65536
		}),
		once: Type.Optional(Type.Boolean())
	}, { additionalProperties: false });
	return Type.Optional(Type.Union([trigger, Type.Null()]));
}
function createCronDeliverySchema() {
	const failureDestinationObject = Type.Object({
		channel: deliveryStringSchema("Failure delivery channel"),
		to: deliveryStringSchema("Failure delivery target"),
		accountId: deliveryStringSchema("Failure delivery account"),
		mode: Type.Optional(Type.Union([
			Type.Literal("announce"),
			Type.Literal("webhook"),
			Type.Null()
		]))
	}, { additionalProperties: true });
	const completionDestinationObject = Type.Object({
		mode: Type.Literal("webhook"),
		to: Type.String({
			minLength: 1,
			description: "Completion webhook target; only valid with delivery.mode=announce"
		})
	}, { additionalProperties: true });
	return Type.Optional(Type.Object({
		mode: optionalStringEnum(CRON_DELIVERY_MODES, { description: "Delivery mode" }),
		channel: deliveryStringSchema("Delivery channel"),
		to: deliveryStringSchema("Delivery target"),
		threadId: Type.Optional(Type.Union([
			Type.String(),
			Type.Number(),
			Type.Null()
		], { description: "Thread/topic id" })),
		bestEffort: Type.Optional(Type.Boolean({ description: "Omitted/false requires requested delivery for successful completion; true lets successful execution complete and delete a one-shot despite failed/unknown delivery. Intentional silence succeeds in either mode." })),
		accountId: deliveryStringSchema("Delivery account"),
		failureDestination: Type.Optional(Type.Union([failureDestinationObject, Type.Null()], { description: "Failure-alert route override; required-delivery failures bypass after but share the execution-alert cooldown; null clears." })),
		completionDestination: Type.Optional(Type.Union([completionDestinationObject, Type.Null()], { description: "Completion webhook; requires delivery.mode=announce; null clears." }))
	}, { additionalProperties: true }));
}
function createCronFailureAlertSchema() {
	return Type.Optional(Type.Union([
		Type.Object({
			after: optionalPositiveIntegerSchema({ description: "Consecutive execution failures before alert; delivery failures bypass this threshold" }),
			channel: Type.Optional(Type.String({ description: "Alert channel" })),
			to: Type.Optional(Type.String({ description: "Alert target" })),
			cooldownMs: optionalNonNegativeIntegerSchema({ description: "Alert cooldown ms" }),
			includeSkipped: Type.Optional(Type.Boolean({ description: "Count skipped runs." })),
			mode: optionalStringEnum(["announce", "webhook"]),
			accountId: Type.Optional(Type.String())
		}, { additionalProperties: true }),
		Type.Literal(false),
		Type.Null()
	], { description: "Failure alert policy/route override; null clears. Route-backed jobs default to after=2 for execution failures and cooldownMs=3600000 for all failure alerts; false disables execution/delivery alerts but not the auto-disable safety notice." }));
}
function createCronToolSchema(options) {
	const triggersEnabled = options?.triggersEnabled !== false;
	const management = Boolean(options?.management);
	const managementOnly = options?.management === "only";
	const actions = managementOnly ? CRON_MANAGEMENT_METHODS.map((method) => method.slice(5)) : CRON_ACTIONS;
	const job = Type.Optional(Type.Object({
		name: Type.Optional(Type.String({ description: "Job name" })),
		declarationKey: Type.Optional(Type.String({
			description: "Idempotent declaration key (add only).",
			minLength: 1,
			maxLength: 200
		})),
		displayName: Type.Optional(Type.Union([Type.String({ maxLength: 200 }), Type.Null()], { description: "Human-readable label; null clears it" })),
		owner: Type.Optional(Type.Object({
			agentId: Type.Optional(Type.String()),
			sessionKey: Type.Optional(Type.String())
		}, { additionalProperties: false })),
		schedule: createCronScheduleSchema({
			triggersEnabled,
			management
		}),
		pacing: createCronPacingSchema(),
		...triggersEnabled ? { trigger: createCronTriggerSchema() } : {},
		sessionTarget: Type.Optional(Type.String({ description: "main | isolated | current (agentTurn default) | session:<id>" })),
		wakeMode: optionalStringEnum(CRON_WAKE_MODES, { description: "Wake timing" }),
		payload: createCronPayloadSchema({
			triggersEnabled,
			management
		}),
		delivery: createCronDeliverySchema(),
		...management || !options?.agentSessionKey?.trim() ? { agentId: nullableStringSchema("Agent id, or null to clear it") } : {},
		description: Type.Optional(Type.String({ description: "Human description" })),
		enabled: Type.Optional(Type.Boolean()),
		deleteAfterRun: Type.Optional(Type.Boolean({ description: "Delete one-shot after successful completion: delivery confirmed, not requested, intentionally silent, or explicitly bestEffort. Failed/unknown required delivery retains it disabled." })),
		sessionKey: nullableStringSchema("Explicit session key, or null to clear it"),
		failureAlert: createCronFailureAlertSchema()
	}, {
		additionalProperties: true,
		description: managementOnly ? "Partial update: only supplied fields change; null clears." : "Job fields. action=\"add\": full job. action=\"update\": partial patch — only supplied fields change; null clears."
	}));
	const schema = Type.Object({
		action: stringEnum(options?.selfRemoveOnly ? actions.filter((action) => CRON_SELF_ACTIONS.some((allowed) => allowed === action)) : actions),
		...gatewayCallOptionSchemaProperties(),
		includeDisabled: Type.Optional(Type.Boolean()),
		limit: optionalPositiveIntegerSchema({
			maximum: 200,
			description: "Maximum jobs returned by action=\"list\""
		}),
		offset: optionalNonNegativeIntegerSchema({ description: "Job offset for action=\"list\"; use nextOffset to load the next page" }),
		job: managementOnly ? Type.Optional(Type.Omit(job, ["declarationKey", "owner"])) : job,
		jobId: Type.Optional(Type.String()),
		id: Type.Optional(Type.String()),
		in: Type.Optional(Type.String({ description: "Relative duration for action=\"next_check\" (for example, \"15m\")" })),
		text: Type.Optional(Type.String({ description: "systemEvent text for action=\"wake\"" })),
		mode: optionalStringEnum(CRON_WAKE_MODES, { description: "Wake mode for action=\"wake\" (default next-heartbeat)" }),
		runMode: optionalStringEnum(CRON_RUN_MODES, { description: "Run mode for action=\"run\": omitted defaults to \"due\"; use \"force\" to trigger now." }),
		runId: Type.Optional(Type.String({ description: "Run id from action=\"run\" to read with action=\"runs\"" })),
		contextMessages: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: 10
		})),
		agentId: Type.Optional(Type.String({ description: managementOnly ? "Agent filter for action=\"list\"." : "List filter for `action: \"list\"`; wake target override for `action: \"wake\"` (defaults to the calling agent when omitted on wake)" })),
		sessionKey: Type.Optional(Type.String({ description: "Wake target override for `action: \"wake\"`: route the event to another session owned by the calling agent. Defaults to the resolved calling-session key when omitted." }))
	}, { additionalProperties: true });
	if (options?.selfRemoveOnly) return Type.Pick(schema, [
		"action",
		"gatewayUrl",
		"gatewayToken",
		"timeoutMs",
		"includeDisabled",
		"jobId",
		"id",
		...managementOnly ? [] : ["in", "runId"]
	]);
	return managementOnly ? Type.Omit(schema, [
		"in",
		"text",
		"mode",
		"contextMessages",
		"sessionKey",
		"runId"
	]) : schema;
}
//#endregion
//#region src/agents/tools/cron-tool-context.ts
const REMINDER_CONTEXT_PER_MESSAGE_MAX = 220;
const REMINDER_CONTEXT_TOTAL_MAX = 700;
const REMINDER_CONTEXT_MARKER = "\n\nRecent context:\n";
function stripExistingContext(text) {
	const index = text.indexOf(REMINDER_CONTEXT_MARKER);
	if (index === -1) return text;
	return text.slice(0, index).trim();
}
function truncateText(input, maxLen) {
	return truncateWithMarker(input, maxLen, {
		marker: "...",
		reserve: 3,
		trimEnd: true
	});
}
function extractMessageText(message) {
	const role = message.role;
	if (role !== "user" && role !== "assistant") return null;
	const text = extractTextFromChatContent(message.content);
	return text ? {
		role,
		text
	} : null;
}
async function buildReminderContextLines(params) {
	const maxMessages = Math.min(10, Math.max(0, Math.floor(params.contextMessages)));
	if (maxMessages <= 0) return [];
	const sessionKey = params.agentSessionKey?.trim();
	if (!sessionKey) return [];
	const cfg = getRuntimeConfig();
	const { alias } = resolveMainSessionAlias(cfg);
	const resolvedKey = resolveInternalSessionKey({
		key: sessionKey,
		alias
	});
	try {
		const res = await params.callGatewayTool("chat.history", params.gatewayOpts, {
			sessionKey: resolvedKey,
			agentId: params.agentId,
			limit: maxMessages
		});
		const recent = (Array.isArray(res?.messages) ? res.messages : []).map((msg) => extractMessageText(msg)).filter((msg) => Boolean(msg)).slice(-maxMessages);
		const lines = [];
		let total = 0;
		for (const entry of recent) {
			const line = `- ${entry.role === "user" ? "User" : "Assistant"}: ${truncateText(entry.text, REMINDER_CONTEXT_PER_MESSAGE_MAX)}`;
			total += line.length;
			if (total > REMINDER_CONTEXT_TOTAL_MAX) break;
			lines.push(line);
		}
		return lines;
	} catch {
		return [];
	}
}
//#endregion
//#region src/agents/tools/cron-tool-creator-cap.ts
/**
* Closed core-owned vocabulary a CLI backend may project its native tools into.
* Anything else is a backend contract bug and fails closed at capture time so a
* raw harness tool name can never become a persisted cron capability.
*/
const NATIVE_CRON_CREATOR_CAPABILITIES = /* @__PURE__ */ new Set([
	"read",
	"write",
	"edit",
	"apply_patch",
	"exec",
	"process",
	"web_search",
	"web_fetch"
]);
/** Fails closed on any backend-projected name outside the exact canonical vocabulary. */
function assertNativeCronCreatorCapabilities(names) {
	for (const name of names) if (!NATIVE_CRON_CREATOR_CAPABILITIES.has(name)) throw new Error(`cron creator authority rejected non-canonical native capability ${JSON.stringify(name)}`);
}
const CRON_CREATOR_AUTHORITY_RECOVERY_MESSAGE = "Retry from a fresh authenticated direct-local operator turn, or create/edit via the CLI or Gateway with an explicit finite toolsAllow list containing only currently visible tools; no automation changes were saved.";
const INCOMPLETE_CRON_CREATOR_AUTHORITY_MESSAGE = `Configured MCP authority is unavailable because this turn did not capture the complete model-callable tool surface. ${CRON_CREATOR_AUTHORITY_RECOVERY_MESSAGE}`;
/** No capture marker means this runtime has no deferred configured-MCP surface. */
function isCronCreatorToolCaptureComplete(captureRef) {
	return captureRef === void 0 || captureRef.value?.source === "final-executable-surface";
}
function assertInheritedCronToolCaptureReady(value, captureRef) {
	if ((isRecord(value) && isRecord(value.payload) ? value.payload : void 0)?.toolsAllowIsDefault !== true || isCronCreatorToolCaptureComplete(captureRef)) return;
	throw new Error(INCOMPLETE_CRON_CREATOR_AUTHORITY_MESSAGE);
}
function replaceWithEffectiveCronCreatorToolAllowlist(target, tools, toolMeta, options = {}) {
	target.length = 0;
	const captured = /* @__PURE__ */ new Map();
	for (const tool of tools) {
		const projection = readCronScheduledToolProjection(tool);
		const name = normalizeToolPolicyName(projection ? projection.targetTool : tool.name);
		if (!name) continue;
		const aliasName = projection ? normalizeToolPolicyName(tool.name) : void 0;
		const existing = captured.get(name);
		if (existing !== void 0) {
			if (aliasName && !existing.aliasName) existing.aliasName = aliasName;
			if (existing.execTarget && !projection?.execTarget) delete existing.execTarget;
			else if (existing.execTarget?.ask === "always" && projection?.execTarget?.ask !== "always") delete existing.execTarget.ask;
			continue;
		}
		const meta = toolMeta?.(tool);
		const pluginId = typeof meta?.pluginId === "string" ? normalizeToolPolicyName(meta.pluginId) : void 0;
		captured.set(name, {
			name,
			...pluginId ? { pluginId } : {},
			...aliasName && aliasName !== name ? { aliasName } : {},
			...projection?.execTarget ? { execTarget: { ...projection.execTarget } } : {}
		});
	}
	assertNativeCronCreatorCapabilities(options.canonicalToolNames ?? []);
	for (const name of options.canonicalToolNames ?? []) {
		if (captured.has(name)) continue;
		captured.set(name, name === "exec" && options.nativeExecTarget ? {
			name,
			execTarget: { ...options.nativeExecTarget }
		} : { name });
	}
	target.push(...captured.values());
}
/** Records the creator cap only after every runtime policy and schema quarantine has run. */
function captureFinalEffectiveCronCreatorToolAllowlist(target, captureRef, tools, toolMeta, options = {}) {
	replaceWithEffectiveCronCreatorToolAllowlist(target, tools, toolMeta, options);
	captureRef.value = {
		version: 1,
		source: "final-executable-surface"
	};
}
function normalizeCronCreatorToolsAllow(values) {
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of values) {
		const tool = typeof entry === "string" ? { name: entry } : entry;
		const name = normalizeToolPolicyName(tool.name);
		if (!name || seen.has(name)) continue;
		seen.add(name);
		const pluginId = typeof tool.pluginId === "string" ? normalizeToolPolicyName(tool.pluginId) : void 0;
		const aliasName = typeof tool.aliasName === "string" ? normalizeToolPolicyName(tool.aliasName) : void 0;
		const execTarget = tool.execTarget?.host === "gateway" ? {
			host: "gateway",
			...tool.execTarget.ask === "always" ? { ask: "always" } : {}
		} : void 0;
		normalized.push({
			name,
			...pluginId ? { pluginId } : {},
			...aliasName && aliasName !== name ? { aliasName } : {},
			...execTarget ? { execTarget } : {}
		});
	}
	return normalized;
}
/** Restrict-only exec target present only when the creator's exec grant is host-pinned. */
function resolveCronCreatorExecToolTarget(entries) {
	const execEntry = normalizeCronCreatorToolsAllow(entries ?? []).find((tool) => tool.name === "exec");
	return execEntry?.execTarget ? { ...execEntry.execTarget } : void 0;
}
function hasCronTriggerScript(value) {
	return isRecord(value) && typeof value.script === "string" && value.script.trim().length > 0;
}
function classifyExplicitToolsAllow(payload) {
	if (!payload || !Object.hasOwn(payload, "toolsAllow")) return "absent";
	if (!Array.isArray(payload.toolsAllow)) return "resolved";
	const values = payload.toolsAllow.filter((entry) => typeof entry === "string");
	if (values.length === 0) return "empty";
	return values.some((entry) => {
		const normalized = normalizeToolPolicyName(entry);
		return normalized === "*" || normalized.startsWith("group:");
	}) ? "resolved" : "finite";
}
function explicitFiniteToolsNeedResolution(payload, creatorToolAllowlist) {
	if (classifyExplicitToolsAllow(payload) !== "finite") return false;
	const toolsAllow = payload?.toolsAllow;
	if (!Array.isArray(toolsAllow)) return false;
	const creatorNames = new Set(normalizeCronCreatorToolsAllow(creatorToolAllowlist ?? []).flatMap((tool) => tool.aliasName ? [tool.name, tool.aliasName] : [tool.name]));
	return expandToolGroups(toolsAllow.filter((entry) => typeof entry === "string")).some((name) => !creatorNames.has(name));
}
/** Whether an add needs the creator's complete authority rather than an explicit empty cap. */
function cronCreateRequiresCreatorAuthority(value, creatorToolAllowlist) {
	if (!isRecord(value)) return false;
	const payload = isRecord(value.payload) ? value.payload : void 0;
	const explicitToolsAllow = classifyExplicitToolsAllow(payload);
	if (explicitToolsAllow === "empty") return false;
	if (explicitToolsAllow === "finite") return explicitFiniteToolsNeedResolution(payload, creatorToolAllowlist);
	return hasCronTriggerScript(value.trigger) || payload?.kind === "agentTurn" || payload?.kind === "script" || explicitToolsAllow === "resolved";
}
function capCronJobToolsAllow(params) {
	const writesToolsAllow = Object.hasOwn(params.payload, "toolsAllow");
	if (params.payload.kind !== "agentTurn" && params.payload.kind !== "script" && !hasCronTriggerScript(params.trigger) && !writesToolsAllow) return;
	const creatorToolsAllow = normalizeCronCreatorToolsAllow(params.creatorToolAllowlist);
	const requestedRaw = writesToolsAllow ? params.payload.toolsAllow : params.defaultToolsAllow;
	const requestedToolsAllow = Array.isArray(requestedRaw) ? expandToolGroups(requestedRaw.filter((entry) => typeof entry === "string")) : ["*"];
	if (requestedToolsAllow.includes("*")) {
		if (params.payload.kind === "agentTurn" && !hasCronTriggerScript(params.trigger) && !params.creatorHoldsRuntimeAuthority) {
			params.payload.toolsAllow = ["*"];
			delete params.payload.toolsAllowIsDefault;
		} else {
			params.payload.toolsAllow = creatorToolsAllow.map((tool) => tool.name);
			params.payload.toolsAllowIsDefault = true;
		}
		return;
	}
	if (requestedToolsAllow.length === 0 || creatorToolsAllow.length === 0) {
		params.payload.toolsAllow = [];
		delete params.payload.toolsAllowIsDefault;
		return;
	}
	const pluginGroups = buildPluginToolGroups({
		tools: creatorToolsAllow,
		toolMeta: (tool) => tool.pluginId ? { pluginId: tool.pluginId } : void 0
	});
	const requestedPolicy = expandPolicyWithPluginGroups({ allow: requestedToolsAllow }, pluginGroups);
	const matches = createToolPolicyMatcher(requestedPolicy);
	params.payload.toolsAllow = creatorToolsAllow.filter((tool) => matches(tool.name) || tool.aliasName !== void 0 && matches(tool.aliasName)).map((tool) => tool.name);
	delete params.payload.toolsAllowIsDefault;
}
function capCronJobToolsAllowOnCreate(value, creatorToolAllowlist, creatorHoldsRuntimeAuthority) {
	if (!isRecord(value) || !isRecord(value.payload) || !creatorToolAllowlist) return;
	capCronJobToolsAllow({
		payload: value.payload,
		trigger: value.trigger,
		creatorToolAllowlist,
		creatorHoldsRuntimeAuthority
	});
}
function readCronPayloadKind(value) {
	return isRecord(value) && typeof value.kind === "string" ? value.kind : void 0;
}
/** Purely derives the agent-tool patch; current job state is requested only when required. */
function planCronJobUpdatePatch(params) {
	const patch = structuredClone(params.patch);
	const payload = isRecord(patch.payload) ? patch.payload : void 0;
	const explicitPayloadKind = readCronPayloadKind(payload);
	const explicitToolsAllow = classifyExplicitToolsAllow(payload);
	if (payload === void 0 && !Object.hasOwn(patch, "trigger")) return {
		kind: "ready",
		patch
	};
	if (explicitPayloadKind !== void 0 && explicitToolsAllow === "absent" && params.creatorAuthorityComplete !== false && !params.creatorToolAllowlist && !Object.hasOwn(patch, "trigger")) return {
		kind: "ready",
		patch
	};
	if (params.creatorAuthorityComplete === false && explicitFiniteToolsNeedResolution(payload, params.creatorToolAllowlist)) return { kind: "needs-creator-authority" };
	if (params.creatorToolAllowlist && (explicitToolsAllow === "empty" || explicitToolsAllow === "finite") && explicitPayloadKind !== void 0) {
		capCronJobToolsAllow({
			payload,
			trigger: patch.trigger,
			creatorToolAllowlist: params.creatorToolAllowlist
		});
		return {
			kind: "ready",
			patch
		};
	}
	if (!params.currentJob) return { kind: "needs-current-job" };
	const existingPayload = params.currentJob.payload;
	const existingPayloadRecord = isRecord(existingPayload) ? existingPayload : void 0;
	const existingPayloadKind = readCronPayloadKind(existingPayload);
	const payloadKind = explicitPayloadKind ?? existingPayloadKind;
	if (payload && payloadKind !== void 0) {
		payload.kind = payloadKind;
		patch.payload = payload;
	}
	const trigger = Object.hasOwn(patch, "trigger") ? patch.trigger : params.currentJob.trigger;
	const startsToolPayload = explicitPayloadKind !== void 0 && explicitPayloadKind !== existingPayloadKind && (payloadKind === "agentTurn" || payloadKind === "script");
	const startsToolTrigger = Object.hasOwn(patch, "trigger") && hasCronTriggerScript(trigger) && !hasCronTriggerScript(params.currentJob.trigger);
	const reusesDefaultAuthority = explicitToolsAllow === "absent" && (startsToolPayload || startsToolTrigger) && (existingPayloadRecord?.toolsAllowIsDefault === true || !Array.isArray(existingPayloadRecord?.toolsAllow) || existingPayloadRecord.toolsAllow.includes("*") && (payloadKind === "script" || startsToolTrigger));
	const needsResolvedAuthority = explicitToolsAllow === "resolved" || reusesDefaultAuthority || explicitFiniteToolsNeedResolution(payload, params.creatorToolAllowlist);
	if (needsResolvedAuthority && params.creatorAuthorityComplete === false) return { kind: "needs-creator-authority" };
	if (!needsResolvedAuthority && (explicitToolsAllow === "empty" || explicitToolsAllow === "finite") && params.creatorToolAllowlist) {
		capCronJobToolsAllow({
			payload,
			trigger,
			creatorToolAllowlist: params.creatorToolAllowlist
		});
		return {
			kind: "ready",
			patch
		};
	}
	if (!needsResolvedAuthority || !params.creatorToolAllowlist) return {
		kind: "ready",
		patch
	};
	const nextPayload = payload ?? {};
	if (payloadKind !== void 0) nextPayload.kind = payloadKind;
	patch.payload = nextPayload;
	capCronJobToolsAllow({
		payload: nextPayload,
		trigger,
		creatorToolAllowlist: params.creatorToolAllowlist,
		defaultToolsAllow: existingPayloadRecord && existingPayloadRecord.toolsAllowIsDefault !== true ? existingPayloadRecord.toolsAllow : void 0,
		creatorHoldsRuntimeAuthority: params.creatorHoldsRuntimeAuthority
	});
	return {
		kind: "ready",
		patch
	};
}
//#endregion
//#region src/agents/tools/cron-tool-output-schema.ts
const nullableNumber = Type.Union([Type.Number(), Type.Null()]);
const nullableString = Type.Union([Type.String(), Type.Null()]);
const job = CronJobSchema.properties;
const CompactCronJobSchema = Type.Object({
	id: job.id,
	name: job.name,
	agentId: job.agentId,
	updatedAtMs: Type.Optional(job.updatedAtMs),
	declarationKey: job.declarationKey,
	displayName: job.displayName,
	owner: job.owner,
	enabled: job.enabled,
	effectiveAgentId: Type.Optional(nullableString),
	nextRunAt: nullableString,
	nextRunAtMs: nullableNumber,
	scheduleKind: Type.Union([
		Type.Literal("at"),
		Type.Literal("every"),
		Type.Literal("cron"),
		Type.Literal("on-exit"),
		Type.Literal("stream")
	]),
	schedule: Type.Optional(Type.Union(job.schedule.anyOf.filter((schema) => [
		"at",
		"every",
		"cron"
	].includes(schema.properties.kind.const)))),
	trigger: Type.Optional(Type.Literal(true)),
	lastRunAt: nullableString,
	lastRunAtMs: nullableNumber,
	lastRunStatus: Type.Union([...job.lastRunStatus.anyOf, Type.Null()]),
	lastRunError: nullableString,
	runningAtMs: job.state.properties.runningAtMs,
	autoDisabled: job.state.properties.autoDisabled,
	lastDelivered: job.lastDelivered,
	lastDeliveryStatus: job.lastDeliveryStatus,
	lastDeliveryError: job.lastDeliveryError,
	deliverySuppressionReason: job.deliverySuppressionReason,
	lastFailureNotificationDelivered: job.lastFailureNotificationDelivered,
	lastFailureNotificationDeliveryStatus: job.lastFailureNotificationDeliveryStatus,
	lastFailureNotificationDeliveryError: job.lastFailureNotificationDeliveryError
}, { additionalProperties: false });
const FullCronListJobSchema = Type.Object({
	...job,
	effectiveAgentId: Type.Optional(nullableString)
}, { additionalProperties: false });
const page = {
	total: Type.Integer({ minimum: 0 }),
	offset: Type.Integer({ minimum: 0 }),
	limit: Type.Integer({ minimum: 0 }),
	hasMore: Type.Boolean(),
	nextOffset: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])
};
const CronListOutputSchema = Type.Object({
	jobs: Type.Array(Type.Union([CompactCronJobSchema, FullCronListJobSchema])),
	...page,
	snapshotRevision: Type.Optional(Type.String()),
	scope: Type.Optional(Type.Union([Type.Literal("caller"), Type.Literal("gateway")])),
	scopeHint: Type.Optional(Type.String()),
	deliveryPreviews: Type.Optional(Type.Object({}, { additionalProperties: CronDeliveryPreviewSchema }))
}, { additionalProperties: false });
const CronStatusOutputSchema = Type.Object({
	enabled: Type.Boolean(),
	triggersEnabled: Type.Optional(Type.Boolean()),
	storePath: Type.Optional(Type.String()),
	storage: Type.Optional(Type.Literal("sqlite")),
	sqlitePath: Type.Optional(Type.String()),
	jobs: Type.Optional(Type.Integer({ minimum: 0 })),
	nextWakeAtMs: Type.Optional(nullableNumber)
}, { additionalProperties: false });
const runEntry = CronRunLogEntrySchema.properties;
const processInstanceId = Type.Optional(Type.String());
const CronRunOutputSchema = Type.Union([
	Type.Object({
		ok: Type.Literal(false),
		processInstanceId
	}, { additionalProperties: false }),
	Type.Object({
		ok: Type.Literal(true),
		ran: Type.Literal(true),
		processInstanceId
	}, { additionalProperties: false }),
	Type.Object({
		ok: Type.Literal(true),
		enqueued: Type.Literal(true),
		runId: Type.String(),
		processInstanceId,
		run: Type.Optional(Type.Object({
			runId: runEntry.runId,
			status: runEntry.status,
			completionStatus: runEntry.completionStatus,
			error: runEntry.error,
			summary: runEntry.summary,
			deliveryStatus: runEntry.deliveryStatus,
			deliveryError: runEntry.deliveryError,
			durationMs: runEntry.durationMs
		}, { additionalProperties: true })),
		finished: Type.Optional(Type.Literal(true)),
		note: Type.Optional(Type.String())
	}, { additionalProperties: false }),
	Type.Object({
		ok: Type.Literal(true),
		ran: Type.Literal(false),
		reason: Type.Union([
			Type.Literal("disabled"),
			Type.Literal("not-due"),
			Type.Literal("already-running"),
			Type.Literal("invalid-spec"),
			Type.Literal("stopped"),
			Type.Literal("ownerless")
		]),
		processInstanceId
	}, { additionalProperties: false })
]);
/** Every non-throwing automations result, reusing the canonical job/history contracts. */
const CronToolOutputSchema = defineToolOutputSchema({
	inputProperty: "action",
	variants: {
		status: CronStatusOutputSchema,
		list: CronListOutputSchema,
		get: CronJobSchema,
		add: CronAddResultSchema,
		update: CronJobSchema,
		remove: Type.Union([Type.Object({
			ok: Type.Literal(true),
			removed: Type.Boolean(),
			activeRunCancellationRequested: Type.Optional(Type.Literal(true)),
			sessionCleanup: Type.Optional(Type.Literal("pending"))
		}, { additionalProperties: false }), Type.Object({
			ok: Type.Literal(false),
			removed: Type.Literal(false)
		}, { additionalProperties: false })]),
		run: CronRunOutputSchema,
		runs: Type.Object({
			entries: Type.Array(CronRunLogEntrySchema),
			...page
		}, { additionalProperties: false }),
		next_check: Type.Object({
			ok: Type.Literal(true),
			delayMs: Type.Number({ exclusiveMinimum: 0 })
		}, { additionalProperties: false }),
		wake: Type.Union([Type.Object({ ok: Type.Literal(true) }, { additionalProperties: false }), Type.Object({
			ok: Type.Literal(false),
			reason: Type.Optional(Type.Literal("unwakeable-session-key"))
		}, { additionalProperties: false })])
	}
});
//#endregion
//#region src/agents/tools/cron-tool-self-list.ts
const CRON_SELF_LIST_MAX_PAGES = 50;
const CRON_SELF_LIST_MAX_SNAPSHOT_RESTARTS = 3;
function filterDeliveryPreviewsByJobId(previews, jobId) {
	if (!isRecord(previews)) return previews;
	return Object.hasOwn(previews, jobId) ? { [jobId]: previews[jobId] } : {};
}
function filterCronListResultToJobId(result, jobId) {
	const jobs = result.jobs.filter((job) => isRecord(job) && job.id === jobId);
	const filteredResult = {
		...result,
		jobs,
		total: jobs.length,
		offset: 0,
		limit: jobs.length,
		hasMore: false,
		nextOffset: null,
		...Object.hasOwn(result, "deliveryPreviews") ? { deliveryPreviews: filterDeliveryPreviewsByJobId(result.deliveryPreviews, jobId) } : {}
	};
	delete filteredResult.snapshotRevision;
	return filteredResult;
}
async function listCronSelfJob(params) {
	for (let restart = 0; restart <= CRON_SELF_LIST_MAX_SNAPSHOT_RESTARTS; restart += 1) {
		let offset = 0;
		let snapshotRevision;
		let total;
		let snapshotChanged = false;
		for (let pageNumber = 0; pageNumber < CRON_SELF_LIST_MAX_PAGES; pageNumber += 1) {
			const page = readCanonicalCronListPage(await params.requestPage({
				limit: params.pageSize,
				offset
			}), params.pageSize);
			if (snapshotRevision !== void 0 && page.snapshotRevision !== snapshotRevision || total !== void 0 && page.total !== total) {
				snapshotChanged = true;
				break;
			}
			snapshotRevision ??= page.snapshotRevision;
			total ??= page.total;
			const nextOffset = resolveCronListPageNextOffset(page, offset);
			if (page.jobs.some((job) => isRecord(job) && job.id === params.jobId) || nextOffset === null) return filterCronListResultToJobId(page, params.jobId);
			offset = nextOffset;
		}
		if (!snapshotChanged) throw new Error("cron.list pagination exceeded maximum pages while reading current automation");
	}
	throw new Error("cron.list inventory changed repeatedly while reading current automation");
}
//#endregion
//#region src/agents/tools/cron-tool-write.ts
function assertNoCronShellExecution(value) {
	if (!isRecord(value)) return;
	const payload = isRecord(value.payload) ? value.payload : void 0;
	if (normalizeLowercaseStringOrEmpty(payload?.kind) === "command") throw new Error("automation command payloads cannot be created or edited through the agent automations tool; use the CLI or Gateway API.");
	if ((isRecord(value.schedule) ? value.schedule : void 0)?.kind === "on-exit") throw new Error("automation on-exit schedules cannot be created or edited through the agent automations tool; use the CLI or Gateway API.");
}
function assertCronCreatorAuthorityResolutionAvailable(params) {
	if (!params.required || params.resolveCreatorToolAuthority) return;
	if (params.unavailableReason === "queued-local-operator-configured-mcp" || !isCronCreatorToolCaptureComplete(params.creatorToolAllowlistCaptureRef)) throw new Error(params.unavailableReason === "queued-local-operator-configured-mcp" ? `Configured MCP authority is unavailable because this local operator turn was queued. ${CRON_CREATOR_AUTHORITY_RECOVERY_MESSAGE}` : INCOMPLETE_CRON_CREATOR_AUTHORITY_MESSAGE);
}
async function prepareCronJobUpdateForGateway(params) {
	params.operationSignal?.throwIfAborted();
	const initialPlan = planCronJobUpdatePatch({
		patch: params.patch,
		creatorToolAllowlist: params.creatorToolAllowlist,
		creatorAuthorityComplete: params.creatorAuthorityComplete
	});
	if (initialPlan.kind === "ready") return { patch: initialPlan.patch };
	const existing = await params.callGateway("cron.get", params.gatewayOpts, { id: params.id });
	params.operationSignal?.throwIfAborted();
	const existingRecord = isRecord(existing) ? existing : void 0;
	const expectedConfigRevision = existingRecord?.configRevision;
	if (typeof expectedConfigRevision !== "string" || expectedConfigRevision.length === 0) throw new Error("cron.get response is missing configRevision; restart the Gateway before retrying this update");
	let resolvedAuthority;
	let finalPlan = planCronJobUpdatePatch({
		patch: params.patch,
		creatorToolAllowlist: params.creatorToolAllowlist,
		currentJob: existingRecord,
		creatorAuthorityComplete: params.creatorAuthorityComplete
	});
	if (finalPlan.kind === "needs-creator-authority") {
		assertCronCreatorAuthorityResolutionAvailable({
			required: true,
			resolveCreatorToolAuthority: params.resolveCreatorToolAuthority,
			creatorToolAllowlistCaptureRef: params.creatorToolAllowlistCaptureRef,
			unavailableReason: params.creatorAuthorityUnavailableReason
		});
		if (!params.resolveCreatorToolAuthority) throw new Error("cron update requires complete creator tool authority");
		resolvedAuthority = await params.resolveCreatorToolAuthority({ signal: params.operationSignal });
		params.operationSignal?.throwIfAborted();
		finalPlan = planCronJobUpdatePatch({
			patch: params.patch,
			creatorToolAllowlist: resolvedAuthority.tools,
			currentJob: existingRecord,
			creatorAuthorityComplete: true,
			creatorHoldsRuntimeAuthority: resolvedAuthority.holdsRuntimeAuthority
		});
	}
	if (finalPlan.kind !== "ready") throw new Error("cron update patch planning did not use the loaded job");
	return {
		patch: finalPlan.patch,
		expectedConfigRevision,
		resolvedAuthority
	};
}
function isCronJobConfigRevisionConflict(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
	return (isRecord(error.details) ? error.details : void 0)?.code === "CRON_JOB_CHANGED";
}
async function updateCronJobFromAgentTool(params) {
	const callerIncludedPayloadPatch = isRecord(params.patch.payload);
	let creatorAuthorityPromise;
	const resolveCreatorToolAuthority = params.resolveCreatorToolAuthority ? (options) => creatorAuthorityPromise ??= params.resolveCreatorToolAuthority(options) : void 0;
	for (let attempt = 0; attempt < 2; attempt += 1) {
		params.operationSignal?.throwIfAborted();
		const prepared = await prepareCronJobUpdateForGateway({
			...params,
			creatorAuthorityComplete: isCronCreatorToolCaptureComplete(params.creatorToolAllowlistCaptureRef) && resolveCreatorToolAuthority === void 0 && params.creatorAuthorityUnavailableReason === void 0,
			resolveCreatorToolAuthority
		});
		if (callerIncludedPayloadPatch && !params.adminManagement) assertNoCronShellExecution(prepared.patch);
		assertInheritedCronToolCaptureReady(prepared.patch, prepared.resolvedAuthority ? { value: prepared.resolvedAuthority.provenance } : params.creatorToolAllowlistCaptureRef);
		if (prepared.resolvedAuthority && !params.withCreatorAuthorityProvenance) throw new Error("fresh configured MCP cron authority requires an authenticated local agent run");
		try {
			const write = async () => {
				params.operationSignal?.throwIfAborted();
				return await params.callGateway("cron.update", params.gatewayOpts, {
					id: params.id,
					patch: prepared.patch,
					...prepared.expectedConfigRevision ? { expectedConfigRevision: prepared.expectedConfigRevision } : {}
				});
			};
			return prepared.resolvedAuthority && params.withCreatorAuthorityProvenance ? await params.withCreatorAuthorityProvenance(prepared.resolvedAuthority, write) : await write();
		} catch (error) {
			if (attempt === 0 && isCronJobConfigRevisionConflict(error)) continue;
			throw error;
		}
	}
	throw new Error("cron update retry exhausted");
}
//#endregion
//#region src/agents/tools/cron-tool.ts
function readCronToolJob(params, action) {
	let recovered = false;
	if (!params.job || isRecord(params.job) && Object.keys(params.job).length === 0) {
		const synthetic = recoverCronObjectFromFlatParams(params);
		if (synthetic.found && (action === "update" || hasCronCreateSignal(synthetic.value))) {
			params.job = synthetic.value;
			recovered = true;
		}
	}
	if (!params.job || typeof params.job !== "object") throw new Error("job required");
	return {
		job: canonicalizeCronToolObject(params.job),
		recovered
	};
}
function readCronJobIdParam(params) {
	return readToolStringParam(params, "jobId") ?? readToolStringParam(params, "id");
}
function requireCronJobIdParam(params) {
	const id = readCronJobIdParam(params);
	if (!id) throw new Error("jobId required (id accepted for backward compatibility)");
	return id;
}
const CRON_SELF_REMOVE_SCOPE_ERROR = "Automations tool is restricted to the current automation.";
const CRON_RUN_MAX_WAIT_MS = 6e5;
const CRON_RUN_ENQUEUE_TIMEOUT_MS = 6e4;
function readCronSelfRemoveOnlyJobId(opts) {
	return opts?.selfRemoveOnlyJobId?.trim() || void 0;
}
function assertCronSelfRemoveScope(opts, action, params) {
	const selfRemoveOnlyJobId = readCronSelfRemoveOnlyJobId(opts);
	if (!selfRemoveOnlyJobId || action === "status" || action === "list") return;
	if ([
		"next_check",
		"get",
		"remove",
		"runs"
	].includes(action)) {
		const id = readCronJobIdParam(params);
		if (id === selfRemoveOnlyJobId || action === "next_check" && !id) return;
	}
	throw new Error(CRON_SELF_REMOVE_SCOPE_ERROR);
}
function formatCronTerminalPresentation(params, result) {
	if (!isRecord(params) || !isRecord(result) || !isRecord(result.details)) return;
	switch (params.action) {
		case "status": return { text: `Automations scheduler status.\nEnabled: ${result.details.enabled === true ? "yes" : "no"}` };
		case "list": {
			const count = (typeof result.details.total === "number" && Number.isFinite(result.details.total) && result.details.total >= 0 ? Math.floor(result.details.total) : void 0) ?? (Array.isArray(result.details.jobs) ? result.details.jobs.length : void 0);
			return count === void 0 ? { text: "Automations listed." } : { text: `Automations listed.\nCount: ${count}` };
		}
		case "get": return { text: "Automation loaded." };
		case "runs": {
			const entries = Array.isArray(result.details.entries) ? result.details.entries.length : void 0;
			return entries === void 0 ? { text: "Automation run history loaded." } : { text: `Automation run history loaded.\nCount: ${entries}` };
		}
		default: return;
	}
}
function isOlderGatewayRejectingParam(error, method, param) {
	return error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" && error.message.includes(`invalid ${method} params`) && error.message.includes(`unexpected property '${param}'`);
}
function buildCronToolDescription(params) {
	const streamScheduleLine = params.triggersEnabled ? "\n- {kind:\"stream\",command:[argv]}: fires on supervised process output; disabled only when cron.triggers.enabled=false." : "";
	const scriptPayloadLine = params.triggersEnabled ? "\n- {kind:\"script\",script}: main|isolated only; disabled only when cron.triggers.enabled=false." : "";
	const triggerSection = params.triggersEnabled ? `TRIGGER (condition watcher on every/cron): {script}; available unless cron.triggers.enabled=false — if off, say so; never model-poll instead. Quiet headless check, no model; 30s/5 tool calls/16KB state. Read frozen trigger.state, return json({fire,message?,state?}) with NEW state; dedupe via state, never memory. fire:false saves state only. fire:true runs payload; message is that run's entire context — self-contained. Fire on failures/timeouts too; success-only watchers look healthy when broken. Script stays read-only; actions belong in payload. once:true disables after first fire. Code Mode: await exec({command:"..."}).` : `TRIGGERS DISABLED (cron.triggers.enabled=false): condition triggers, script payloads, and stream schedules are unavailable here. Omit trigger; use plain time-based schedules. If the user asks for a conditional watcher, say it is unsupported — never model-poll instead, and never silently create an unconditional job in its place.`;
	const silentWatcherCue = params.triggersEnabled ? " Silent watcher=>mode:\"none\"." : "";
	const scriptCue = params.triggersEnabled ? " When a script can decide there is nothing to do, use a trigger or script payload so quiet fires skip the model; scripts reach MCP only for servers named in toolsAllow (<server>__tool or <server>__*). When a run fails, throw from the script so the run records the failure (returning {error} still succeeds); only the failure alert waits for consecutive failures, run output still follows the job's delivery." : "";
	return `Gateway scheduler: reminders, delayed self-wakeups, loops, recurring work${params.triggersEnabled ? ", event watchers" : ""}. Never exec sleep/poll as timer.

ACTIONS: status | list [includeDisabled,limit?,offset?] (compact summaries with timing; use nextOffset for the next page) | get jobId (full schedule, payload, and delivery details) | add job | update jobId job (partial: only supplied fields change; null clears) | remove jobId (operator removal requests cancellation of an active run; the result reports activeRunCancellationRequested:true) | run jobId (runMode "force"=now; waits up to timeoutMs, default 60s, and returns the finished run: status, error, deliveryStatus, summary; a longer run, or a main-session job that starts after this turn, returns runId — check it later with runs jobId runId, never with a scheduled verify job) | runs jobId runId? = history | next_check in:"30m" (own paced run only) | wake text mode?:"now"|"next-heartbeat"(default) nudges a caller-owned lane (sessionKey/agentId to pick another).

SCOPE: Authenticated configured channel owner and Control UI administrator turns can list/get/update/run/remove any Gateway automation. Other turns see only caller-visible jobs; totals/counts and hasMore describe that scoped view, not global inventory. In that restricted view, an empty list or failed list/get/update/remove (including not-found) does not establish global absence, whatever the source of a known job id (including your own history). Never recreate or replace a known automation to satisfy an update/remove or reconciliation request solely because of these results. Report that you cannot establish global absence and ask an authorized administrator to check through a fresh authenticated configured channel owner or Control UI administrator turn or the Automations page. Genuinely new, requested automations can still be created.

ADD: job requires schedule+payload.

SCHEDULE:
- {kind:"at",at:"ISO-8601"} one-shot; no tz=UTC; auto-deletes after successful completion: delivery confirmed, not requested, intentionally silent, or explicitly bestEffort. Failed/unknown required delivery retains it disabled.
- {kind:"every",everyMs}.
- {kind:"cron",expr,tz?:"IANA"}: expr is wall time in tz; never pre-convert to UTC; no tz=gateway host local. 18:00 Shanghai => {expr:"0 18 * * *",tz:"Asia/Shanghai"}.${streamScheduleLine}

TARGET+PAYLOAD:
- "current" (agentTurn default) = this conversation: the run stays detached, reads bounded chat context, then commits its final visible assistant result to this conversation's durable history. Delayed work/loop = at|every + agentTurn + current. This is not a resumed parent turn: it uses the scheduled agent workspace with its own session identity, not the conversation worktree or cloud worker placement. In-flight turns sent through the job's stable cron key are canceled if that key is reassigned. Verify required checkout/tool access before delegating repository work; result delivery alone does not resume the original agent.
- "isolated" = fresh detached session; standalone background work recorded in cron run history.
- "main" = heartbeat lane; payload {kind:"systemEvent",text} (systemEvent default target).
- "session:<key>" = named session.
- {kind:"agentTurn",message}; timeoutSeconds 0=none.
- Inherited configured MCP authority includes only model-callable tools; interactive app-view-only capabilities are excluded from headless jobs.${scriptPayloadLine}

PACED LOOP: recurring job + pacing{min?,max?} durations ("15m","4h"; at least one). Inside its run, job calls next_check in:"<dur>" to set the next delay (clamped to bounds, measured from run end; failed runs keep normal backoff). Adaptive polling: tighten when active, back off when quiet.

AUTHORING (recurring): every fire re-runs the same instructions; keep the model for judgment only. Put repeatable logic (listing/diffing, dedupe, checkpoints/watermarks) in a workspace script the payload runs in one exec; keep detailed instructions in a workspace file beside it that the message references ("Follow scripts/<job>.md"), so fixes need only file edits. Message names exact tool ids + argument shapes; cap toolsAllow to what the run needs.${scriptCue}

${triggerSection}

DELIVERY: where detached run output goes. Omitted=announce (current=>canonical session commit, plus one normal channel send for external chats; isolated=>last route; set channel/to for a specific chat — no messaging tool inside the run). A current announce succeeds only after its history commit; WebChat observes that commit live and after reconnect without another user message.${silentWatcherCue} webhook posts finished-run event (successful empty summary is intentional silence, no POST) to URL in \`to\`. To keep announce delivery and also POST completion, use mode:"announce" with completionDestination:{mode:"webhook",to:"https://..."}.

FAILURE ALERTS: jobs with a failure route default to alerting after 2 consecutive execution failures with a 1h cooldown. Route order: job failureAlert fields, delivery.failureDestination over global cron.failureAlert destination fields, then primary announce. failureAlert:false disables execution/delivery alerts, not the auto-disable safety notice; a failureAlert object activates/tunes. bestEffort suppresses inherited execution alerts. Required completion-delivery failure uses only an alternate route, bypasses after, and shares the execution-alert cooldown from the first failure; it does not increment the execution streak.

Job wakeMode (main jobs): "now"(default)|"next-heartbeat". Restricted automation-run sessions: self status/list/get/runs/remove + own next_check only. jobId canonical (id=compat). contextMessages 0-10 embeds recent chat lines into reminder text.`;
}
function createCronTool(opts, deps) {
	const gatewayCall = deps?.callGatewayTool ?? callGatewayTool;
	const managementAuthority = bindCronManagementGrant(opts?.runId);
	const requesterAuthority = bindCronRequesterGrant(opts?.runId);
	const triggersEnabled = opts?.config?.cron?.triggers?.enabled !== false;
	const selfRemoveOnly = Boolean(readCronSelfRemoveOnlyJobId(opts));
	const tool = {
		label: "Automations",
		name: AUTOMATIONS_TOOL_NAME,
		displaySummary: CRON_TOOL_DISPLAY_SUMMARY,
		description: selfRemoveOnly ? managementAuthority?.managementOnly ? "Inspect or remove only the current automation. Actions: list [includeDisabled], get jobId, remove jobId. Use the current job ID; other jobs and management actions are unavailable." : "Inspect or remove only the current automation. Actions: status; list [includeDisabled]; get/runs/remove jobId; next_check in:\"15m\" for this paced run. Use the current job ID. To stop a finished job, remove it; creating/updating/running jobs and waking sessions are unavailable. Return the task result; the scheduler owns delivery." : managementAuthority?.managementOnly ? "Manage any existing automation on this Gateway with the admitted automation management authority. Actions: list [includeDisabled,limit,offset] (compact summaries with timing; follow nextOffset); get jobId (full schedule, payload, and delivery details); update jobId job (partial patch, null clears); run jobId (runMode:\"force\" runs now; waits up to timeoutMs, default 60s, and returns the finished run, or its runId if still running); remove jobId (operator removal requests cancellation of an active run; the result reports activeRunCancellationRequested:true). Creator attribution and scheduled execution policy stay intact. Use the Automations page for other actions." : buildCronToolDescription({ triggersEnabled }),
		outputSchema: CronToolOutputSchema,
		parameters: createCronToolSchema({
			agentSessionKey: opts?.agentSessionKey,
			triggersEnabled,
			selfRemoveOnly,
			management: managementAuthority ? managementAuthority.managementOnly ? "only" : "also" : void 0
		}),
		execute: async (_toolCallId, args, operationSignal) => {
			operationSignal?.throwIfAborted();
			const callGateway = async (...request) => {
				const identity = getGatewayToolCallerIdentity();
				const grant = managementAuthority?.mint(request[0], operationSignal);
				const requesterGrant = !grant && !identity?.cronCreatorAuthorityGrant && (request[0] === "cron.add" || request[0] === "cron.update") ? (requesterAuthority ?? identity?.mintCronRequesterGrant)?.(operationSignal) : void 0;
				if ((grant || requesterGrant) && !identity) throw new Error("Automation management requires the active configured channel owner or Control UI administrator turn.");
				return (grant || requesterGrant) && identity ? await withGatewayToolCallerIdentity({
					...identity,
					...grant ? { cronManagementGrant: grant } : {},
					...requesterGrant ? { cronCreatorAuthorityGrant: requesterGrant } : {}
				}, () => gatewayCall(...request)) : await gatewayCall(...request);
			};
			const params = args;
			const action = readToolStringParam(params, "action", { required: true });
			if (managementAuthority?.managementOnly && !CRON_MANAGEMENT_METHODS.some((method) => method === `cron.${action}`)) throw new Error("This turn can only list, get, update, run, or remove automations. Use the Automations page for other actions.");
			assertCronSelfRemoveScope(opts, action, params);
			const parsedGatewayOpts = readGatewayCallOptions(params);
			const gatewayOpts = {
				...parsedGatewayOpts,
				timeoutMs: parsedGatewayOpts.timeoutMs ?? 6e4
			};
			const runtimeConfig = getRuntimeConfig();
			const callerAgentId = opts?.agentSessionKey?.trim() ? resolveSessionAgentId({
				sessionKey: opts.agentSessionKey,
				config: runtimeConfig,
				agentId: opts.agentId
			}) : void 0;
			const creatorExecToolTarget = resolveCronCreatorExecToolTarget(opts?.creatorToolAllowlist);
			const callerIdentity = callerAgentId && opts?.agentSessionKey?.trim() ? {
				agentId: callerAgentId,
				sessionKey: opts.agentSessionKey.trim(),
				turnSourceAccountId: opts.agentAccountId,
				...readCronSelfRemoveOnlyJobId(opts) ? { cronSelfManagementJobId: readCronSelfRemoveOnlyJobId(opts) } : {},
				...opts?.creatorToolAllowlistCaptureRef?.value?.version === 1 && opts.creatorToolAllowlistCaptureRef.value.source === "final-executable-surface" ? {
					cronToolsAllowCapture: "final-executable-surface",
					...creatorExecToolTarget ? { cronExecToolTarget: creatorExecToolTarget } : {}
				} : {}
			} : void 0;
			const withCreatorAuthorityProvenance = async (authority, run) => {
				if (!authority) return await run();
				if (!callerIdentity) throw new Error("fresh configured MCP cron authority requires an authenticated local agent run");
				const cronExecToolTarget = resolveCronCreatorExecToolTarget(authority.tools);
				return await withGatewayToolCallerIdentity({
					...callerIdentity,
					cronToolsAllowCapture: "final-executable-surface",
					...cronExecToolTarget ? { cronExecToolTarget } : {},
					cronCreatorAuthorityGrant: authority.grant
				}, run);
			};
			return await withGatewayToolCallerIdentity(callerIdentity, async () => {
				switch (action) {
					case "status": {
						const result = await callGateway("cron.status", gatewayOpts, {});
						return jsonResult(readCronSelfRemoveOnlyJobId(opts) ? { enabled: isRecord(result) && result.enabled === true } : result);
					}
					case "list": {
						const selfRemoveOnlyJobId = readCronSelfRemoveOnlyJobId(opts);
						const listAgentId = readToolStringParam(params, "agentId");
						const includeDisabled = Boolean(params.includeDisabled);
						const requestedLimit = selfRemoveOnlyJobId ? void 0 : readPositiveIntegerParam(params, "limit", {
							max: 200,
							message: `limit must be a positive integer no greater than 200`
						});
						const requestedOffset = selfRemoveOnlyJobId ? void 0 : readNonNegativeIntegerParam(params, "offset");
						let useCompactList = true;
						const requestListPage = async (pageParams) => {
							for (;;) try {
								return await callGateway("cron.list", gatewayOpts, {
									includeDisabled,
									...useCompactList ? { compact: true } : {},
									...listAgentId ? { agentId: listAgentId } : {},
									...pageParams
								});
							} catch (error) {
								if (!useCompactList || !isOlderGatewayRejectingParam(error, "cron.list", "compact")) throw error;
								useCompactList = false;
							}
						};
						if (!selfRemoveOnlyJobId) {
							const result = await requestListPage({
								...requestedLimit !== void 0 ? { limit: requestedLimit } : {},
								...requestedOffset !== void 0 ? { offset: requestedOffset } : {}
							});
							return jsonResult({
								...result,
								scope: managementAuthority ? "gateway" : "caller",
								...!managementAuthority ? { scopeHint: "Restricted automation inventory. For Gateway-wide management, use a fresh authenticated configured channel owner or Control UI administrator turn or the Automations page." } : {}
							});
						}
						return jsonResult(await listCronSelfJob({
							jobId: selfRemoveOnlyJobId,
							pageSize: 200,
							requestPage: requestListPage
						}));
					}
					case "get":
					case "remove":
					case "runs": {
						const id = requireCronJobIdParam(params);
						const runId = action === "runs" ? readToolStringParam(params, "runId") : void 0;
						return jsonResult(await callGateway(`cron.${action}`, gatewayOpts, {
							id,
							...runId ? { runId } : {}
						}));
					}
					case "add": {
						const canonicalJob = stripCronCreateNullClears(readCronToolJob(params, "add").job);
						assertNoCronShellExecution(canonicalJob);
						assertCronDeliveryInputNonBlankFields(canonicalJob.delivery);
						assertCronPacingInput(canonicalJob.pacing);
						if (typeof canonicalJob.declarationKey === "string" && canonicalJob.declarationKey.trim().length === 0) throw new Error("declarationKey must be a non-empty string");
						if (typeof canonicalJob.displayName === "string" && canonicalJob.displayName.trim().length === 0) throw new Error("displayName must be a non-empty string");
						const enabledExplicit = typeof canonicalJob.enabled === "boolean";
						const job = normalizeCronJobCreate(canonicalJob, { sessionContext: { sessionKey: opts?.agentSessionKey } }) ?? canonicalJob;
						if (typeof job.declarationKey === "string" && job.declarationKey.length > 0 && !enabledExplicit) delete job.enabled;
						const requiresCreatorAuthority = cronCreateRequiresCreatorAuthority(job, opts?.creatorToolAllowlist);
						assertCronCreatorAuthorityResolutionAvailable({
							required: requiresCreatorAuthority,
							resolveCreatorToolAuthority: opts?.resolveCreatorToolAuthority,
							creatorToolAllowlistCaptureRef: opts?.creatorToolAllowlistCaptureRef,
							unavailableReason: opts?.creatorAuthorityUnavailableReason
						});
						const resolvedAuthority = requiresCreatorAuthority && opts?.resolveCreatorToolAuthority ? await opts.resolveCreatorToolAuthority({ signal: operationSignal }) : void 0;
						operationSignal?.throwIfAborted();
						const creatorToolAllowlist = resolvedAuthority?.tools ?? opts?.creatorToolAllowlist;
						const creatorToolAllowlistCaptureRef = resolvedAuthority ? { value: resolvedAuthority.provenance } : opts?.creatorToolAllowlistCaptureRef;
						capCronJobToolsAllowOnCreate(job, creatorToolAllowlist, resolvedAuthority?.holdsRuntimeAuthority);
						assertInheritedCronToolCaptureReady(job, creatorToolAllowlistCaptureRef);
						const { alias } = resolveMainSessionAlias(runtimeConfig);
						const resolvedSessionKey = opts?.agentSessionKey ? resolveInternalSessionKey({
							key: opts.agentSessionKey,
							alias
						}) : void 0;
						const sessionTarget = normalizeLowercaseStringOrEmpty(job.sessionTarget);
						if (!("sessionKey" in job) && resolvedSessionKey && sessionTarget !== "isolated") job.sessionKey = resolvedSessionKey;
						if ((opts?.agentSessionKey || opts?.currentDeliveryContext) && "payload" in job && job.payload?.kind === "agentTurn") {
							const deliveryValue = job.delivery;
							const delivery = isRecord(deliveryValue) ? deliveryValue : void 0;
							const modeRaw = typeof delivery?.mode === "string" ? delivery.mode : "";
							const mode = normalizeLowercaseStringOrEmpty(modeRaw);
							if (mode === "webhook") {
								const webhookUrl = normalizeHttpWebhookUrl(delivery?.to);
								if (!webhookUrl) throw new Error("delivery.mode=\"webhook\" requires delivery.to to be a valid http(s) URL");
								if (delivery) delivery.to = webhookUrl;
							}
							const hasTarget = typeof delivery?.channel === "string" && delivery.channel.trim() || typeof delivery?.to === "string" && delivery.to.trim();
							if ((deliveryValue == null || delivery) && (mode === "" || mode === "announce") && !hasTarget) {
								const inferred = resolveCronCreationDelivery({
									cfg: runtimeConfig,
									currentDeliveryContext: opts.currentDeliveryContext,
									agentSessionKey: opts.agentSessionKey
								});
								if (inferred) job.delivery = {
									...inferred,
									...delivery
								};
							}
						}
						const contextMessages = readNonNegativeIntegerParam(params, "contextMessages") ?? 0;
						if ("payload" in job && job.payload?.kind === "systemEvent") {
							const payload = job.payload;
							if (typeof payload.text === "string" && payload.text.trim()) {
								const contextLines = await buildReminderContextLines({
									agentSessionKey: opts?.agentSessionKey,
									agentId: callerAgentId,
									gatewayOpts,
									contextMessages,
									callGatewayTool: callGateway
								});
								if (contextLines.length > 0) payload.text = `${stripExistingContext(payload.text)}${REMINDER_CONTEXT_MARKER}${contextLines.join("\n")}`;
							}
						}
						return jsonResult(await withCreatorAuthorityProvenance(resolvedAuthority, () => callGateway("cron.add", gatewayOpts, job)));
					}
					case "update": {
						const id = requireCronJobIdParam(params);
						const { job: canonicalPatch, recovered: recoveredFlatPatch } = readCronToolJob(params, "update");
						if (!managementAuthority) assertNoCronShellExecution(canonicalPatch);
						assertCronDeliveryInputNonBlankFields(canonicalPatch.delivery);
						assertCronPacingInput(canonicalPatch.pacing);
						if (typeof canonicalPatch.displayName === "string" && canonicalPatch.displayName.trim().length === 0) throw new Error("displayName must be a non-empty string or null");
						const patch = normalizeCronJobPatch(canonicalPatch) ?? canonicalPatch;
						if (recoveredFlatPatch && isEmptyRecoveredCronPatch(patch)) throw new Error("job required");
						const creatorOptions = managementAuthority ? void 0 : opts;
						return jsonResult(await updateCronJobFromAgentTool({
							id,
							patch,
							adminManagement: Boolean(managementAuthority),
							creatorToolAllowlist: creatorOptions?.creatorToolAllowlist,
							creatorToolAllowlistCaptureRef: creatorOptions?.creatorToolAllowlistCaptureRef,
							resolveCreatorToolAuthority: creatorOptions?.resolveCreatorToolAuthority,
							withCreatorAuthorityProvenance: !managementAuthority && callerIdentity ? withCreatorAuthorityProvenance : void 0,
							gatewayOpts,
							callGateway,
							operationSignal,
							creatorAuthorityUnavailableReason: creatorOptions?.creatorAuthorityUnavailableReason
						}));
					}
					case "run": {
						const id = requireCronJobIdParam(params);
						const runMode = params.runMode === "due" || params.runMode === "force" ? params.runMode : "due";
						const waitTimeoutMs = Math.min(parsedGatewayOpts.timeoutMs ?? 6e4, CRON_RUN_MAX_WAIT_MS);
						let result;
						try {
							result = await callGateway("cron.run", {
								...gatewayOpts,
								timeoutMs: waitTimeoutMs + CRON_RUN_ENQUEUE_TIMEOUT_MS
							}, {
								id,
								mode: runMode,
								waitTimeoutMs
							});
						} catch (error) {
							if (!isOlderGatewayRejectingParam(error, "cron.run", "waitTimeoutMs")) throw error;
							result = await callGateway("cron.run", gatewayOpts, {
								id,
								mode: runMode
							});
						}
						if (result.enqueued !== true || result.run) return jsonResult(result);
						const followUp = managementAuthority?.managementOnly ? "check it later on the Automations page" : "check it later with runs jobId runId";
						return jsonResult({
							...result,
							note: result.finished ? `Finished, but its run history is not visible to this turn (a one-shot may have deleted itself after succeeding); ${followUp} if needed.` : `Not finished yet: it is still running, or it runs in this session and starts after this turn. Its delivery follows the job settings; ${followUp}. Do not schedule a verification job.`
						});
					}
					case "next_check": {
						const jobId = readCronSelfRemoveOnlyJobId(opts);
						const runId = opts?.runId?.trim();
						if (!jobId || !runId) throw new Error("cron next_check is only available to the currently running job");
						const rawDuration = readToolStringParam(params, "in", { required: true });
						let delayMs;
						try {
							delayMs = parseDurationMs(rawDuration);
						} catch {
							throw new Error("cron next_check in must be a positive duration");
						}
						if (delayMs <= 0) throw new Error("cron next_check in must be a positive duration");
						recordCronNextCheckProposal(runId, jobId, delayMs);
						return jsonResult({
							ok: true,
							delayMs
						});
					}
					case "wake": {
						const text = readToolStringParam(params, "text", { required: true });
						const mode = params.mode === "now" || params.mode === "next-heartbeat" ? params.mode : "next-heartbeat";
						const { alias } = resolveMainSessionAlias(runtimeConfig);
						const explicitSessionKey = readToolStringParam(params, "sessionKey");
						const explicitAgentId = readToolStringParam(params, "agentId");
						const inferredSessionKey = opts?.agentSessionKey ? resolveInternalSessionKey({
							key: opts.agentSessionKey,
							alias
						}) : void 0;
						const sessionKey = explicitSessionKey ?? inferredSessionKey;
						const agentIdFromExplicitSessionKey = explicitSessionKey ? parseAgentSessionKey(explicitSessionKey)?.agentId : void 0;
						const agentId = explicitAgentId ?? (explicitSessionKey ? agentIdFromExplicitSessionKey : callerAgentId);
						return jsonResult(await callGateway("wake", gatewayOpts, {
							mode,
							text,
							...sessionKey ? { sessionKey } : {},
							...agentId ? { agentId } : {}
						}, { expectFinal: false }));
					}
					default: throw new Error(`Unknown action: ${action}`);
				}
			});
		}
	};
	return setToolTerminalPresentation(tool, formatCronTerminalPresentation);
}
//#endregion
export { resolveCronStoredDeliveryContext as a, replaceWithEffectiveCronCreatorToolAllowlist as i, assertNativeCronCreatorCapabilities as n, captureFinalEffectiveCronCreatorToolAllowlist as r, createCronTool as t };
