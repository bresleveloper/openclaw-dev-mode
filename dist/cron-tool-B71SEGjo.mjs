import { R as timestampMsToIsoString, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as CRON_TOOL_DISPLAY_SUMMARY } from "./tool-description-presets-CT4WhVkI.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { t as isStringOption } from "./string-readers-Dkx3Z36w.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import "./client-CpsABkfT.mjs";
import { $l as CronJobSchema, Yl as CronAddResultSchema, Zl as CronDeliveryPreviewSchema, nu as CronRunLogEntrySchema } from "./src-BRUl7oDv.mjs";
import { t as GatewayClientRequestError } from "./request-error-DXOPJLBU.mjs";
import { g as recordCronNextCheckProposal } from "./agent-run-registry-DO6Dg2r0.mjs";
import { n as resolveCronListPageNextOffset, t as readCanonicalCronListPage } from "./list-page-validation-myXdxCmr.mjs";
import { r as normalizeCronJobPatch, t as normalizeCronJobCreate } from "./normalize-_k1oAXPq.mjs";
import { t as parseCronPacingBounds } from "./pacing-DuamEQSm.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam, l as readNonNegativeIntegerParam } from "./common-XfKigJno.mjs";
import { n as extractTextFromChatContent } from "./chat-content-DNdfeXZh.mjs";
import { s as setToolTerminalPresentation } from "./agent-tool-metadata-COcr-3AD.mjs";
import { i as getGatewayToolCallerIdentity, o as withGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { t as extractDeliveryInfo } from "./delivery-info-DQ_vEN9Q.mjs";
import { t as CRON_MANAGEMENT_METHODS } from "./cron-creator-authority-grant-C15WEDjs.mjs";
import { n as readGatewayCallOptions, t as callGatewayTool } from "./gateway-fiwofDIl.mjs";
import { a as optionalNonNegativeIntegerSchema, c as stringEnum, o as optionalPositiveIntegerSchema, s as optionalStringEnum } from "./typebox-DIBvVmm8.mjs";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey } from "./sessions-helpers-Cb0fH5Ru.mjs";
import { a as bindCronRequesterGrant, i as bindCronManagementGrant } from "./cron-creator-authority-context-DhhZn7kB.mjs";
import { n as defineToolOutputSchema } from "./tool-output-schema-DALtkl0-.mjs";
import { t as gatewayCallOptionSchemaProperties } from "./gateway-schema-DTqBHBsM.mjs";
import { t as assertCronDeliveryInputNonBlankFields } from "./delivery-target-validation-D5dmr1ev.mjs";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BqkZLKq3.mjs";
import { c as cronCreateRequiresCreatorAuthority, f as resolveCronCreatorExecToolTarget, i as assertInheritedCronToolCaptureReady, l as isCronCreatorToolCaptureComplete, n as INCOMPLETE_CRON_CREATOR_AUTHORITY_MESSAGE, o as capCronJobToolsAllowOnCreate, t as CRON_CREATOR_AUTHORITY_RECOVERY_MESSAGE, u as planCronJobUpdatePatch } from "./cron-tool-creator-cap-CrhAXfqG.mjs";
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
/**
* Cron tool argument canonicalization.
*
* Recovers flat or partial model/tool inputs into the structured cron job/patch shape.
*/
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
function isCronScheduleKind(value) {
	return isStringOption(value, CRON_SCHEDULE_KINDS$1);
}
function isCronPayloadKind(value) {
	return isStringOption(value, CRON_PAYLOAD_KINDS$1);
}
function isStringArrayOrNull(value) {
	return value === null || Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function moveDefinedField(params) {
	if (params.source[params.from] === void 0) return false;
	params.target[params.to ?? params.from] = params.source[params.from];
	delete params.source[params.from];
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
}
function canonicalizeCronToolSchedule(value) {
	const schedule = isRecord(value.schedule) ? { ...value.schedule } : {};
	let hasSchedule = isRecord(value.schedule);
	if (schedule.atMs !== void 0) {
		setScheduleAtMs(schedule, schedule.atMs);
		delete schedule.atMs;
		if (!isCronScheduleKind(schedule.kind)) schedule.kind = "at";
	}
	if (schedule.everyMs === void 0 && schedule.every !== void 0) {
		schedule.everyMs = schedule.every;
		delete schedule.every;
	}
	if (schedule.expr === void 0 && schedule.cron !== void 0) {
		schedule.expr = schedule.cron;
		delete schedule.cron;
	}
	if (schedule.staggerMs === void 0 && schedule.stagger !== void 0) {
		schedule.staggerMs = schedule.stagger;
		delete schedule.stagger;
	}
	if (schedule.exact === true && schedule.staggerMs === void 0) schedule.staggerMs = 0;
	delete schedule.exact;
	if (isCronScheduleKind(value.kind) && !isCronScheduleKind(schedule.kind)) {
		schedule.kind = value.kind;
		delete value.kind;
		hasSchedule = true;
	}
	if (moveDefinedField({
		source: value,
		target: schedule,
		from: "at"
	}) && !isCronScheduleKind(schedule.kind)) schedule.kind = "at";
	if (value.atMs !== void 0) {
		setScheduleAtMs(schedule, value.atMs);
		delete value.atMs;
		if (!isCronScheduleKind(schedule.kind)) schedule.kind = "at";
		hasSchedule = true;
	}
	if ((moveDefinedField({
		source: value,
		target: schedule,
		from: "everyMs"
	}) || moveDefinedField({
		source: value,
		target: schedule,
		from: "every",
		to: "everyMs"
	})) && !isCronScheduleKind(schedule.kind)) schedule.kind = "every";
	if ((moveDefinedField({
		source: value,
		target: schedule,
		from: "cron",
		to: "expr"
	}) || moveDefinedField({
		source: value,
		target: schedule,
		from: "expr"
	})) && !isCronScheduleKind(schedule.kind)) schedule.kind = "cron";
	if (moveDefinedField({
		source: value,
		target: schedule,
		from: "command"
	}) && !isCronScheduleKind(schedule.kind)) schedule.kind = "on-exit";
	for (const key of [
		"anchorMs",
		"tz",
		"staggerMs",
		"cwd",
		"mode",
		"match",
		"batchMs",
		"maxBatchBytes"
	]) hasSchedule = moveDefinedField({
		source: value,
		target: schedule,
		from: key
	}) || hasSchedule;
	hasSchedule = moveDefinedField({
		source: value,
		target: schedule,
		from: "stagger",
		to: "staggerMs"
	}) || hasSchedule;
	if (value.exact === true && schedule.staggerMs === void 0) {
		schedule.staggerMs = 0;
		hasSchedule = true;
	}
	delete value.exact;
	if (!isCronScheduleKind(schedule.kind)) {
		if (schedule.at !== void 0) schedule.kind = "at";
		else if (schedule.everyMs !== void 0) schedule.kind = "every";
		else if (schedule.expr !== void 0) schedule.kind = "cron";
		else if (schedule.command !== void 0) schedule.kind = "on-exit";
	}
	if (hasSchedule || Object.keys(schedule).length > 0) value.schedule = schedule;
}
function canonicalizeCronToolPayload(value) {
	const payload = isRecord(value.payload) ? { ...value.payload } : {};
	let hasPayload = isRecord(value.payload);
	for (const key of CRON_FLAT_PAYLOAD_KEYS) hasPayload = moveDefinedField({
		source: value,
		target: payload,
		from: key
	}) || hasPayload;
	if (isCronPayloadKind(value.kind) && !isCronPayloadKind(payload.kind)) {
		payload.kind = value.kind;
		delete value.kind;
		hasPayload = true;
	}
	if (!isCronPayloadKind(payload.kind)) {
		if (hasNonEmptyString(payload.script)) payload.kind = "script";
		else if (hasNonEmptyString(payload.message) || hasNonEmptyString(payload.model) || payload.model === null || hasNonEmptyString(payload.thinking) || typeof payload.timeoutSeconds === "number" && hasNonEmptyString(payload.text) || typeof payload.lightContext === "boolean" || typeof payload.allowUnsafeExternalContent === "boolean" || payload.fallbacks !== void 0 && isStringArrayOrNull(payload.fallbacks)) payload.kind = "agentTurn";
		else if (hasNonEmptyString(payload.text)) payload.kind = "systemEvent";
	}
	if (hasPayload || Object.keys(payload).length > 0) value.payload = payload;
}
/**
* Normalizes whitespace-padded cron object keys. Some tool-call
* extraction/serialization pipelines can produce keys with trailing spaces
* (e.g. "schedule " instead of "schedule"), which causes strict gateway
* validation to reject the job with "unexpected property" errors.
*
* Only recognized CRON_RECOVERABLE_OBJECT_KEYS are trimmed — arbitrary keys
* (including special ones like "__proto__") are never mutated.
*
* If both the padded and canonical form of a key exist (e.g. "schedule " and
* "schedule"), the padded key is preserved so strict gateway validation
* rejects the ambiguous input rather than silently picking one value.
*/
function repairPaddedCronKeys(value) {
	for (const key of Object.keys(value)) {
		const trimmed = key.trim();
		if (trimmed !== key && CRON_RECOVERABLE_OBJECT_KEYS.has(trimmed)) {
			if (!(trimmed in value)) {
				value[trimmed] = value[key];
				delete value[key];
			}
		}
	}
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
	return Type.Optional(Type.Unsafe({
		type: "object",
		properties: {
			after: optionalPositiveIntegerSchema({ description: "Consecutive execution failures before alert; delivery failures bypass this threshold" }),
			channel: Type.Optional(Type.String({ description: "Alert channel" })),
			to: Type.Optional(Type.String({ description: "Alert target" })),
			cooldownMs: optionalNonNegativeIntegerSchema({ description: "Alert cooldown ms" }),
			includeSkipped: Type.Optional(Type.Boolean({ description: "Count skipped runs." })),
			mode: optionalStringEnum(["announce", "webhook"]),
			accountId: Type.Optional(Type.String())
		},
		additionalProperties: true,
		description: "Failure alert policy/route override. Route-backed jobs default to after=2 for execution failures and cooldownMs=3600000 for all failure alerts; false disables execution/delivery alerts but not the auto-disable safety notice."
	}));
}
function createCronToolSchema(options) {
	const triggersEnabled = options?.triggersEnabled !== false;
	const management = Boolean(options?.management);
	const managementOnly = options?.management === "only";
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
		action: stringEnum(managementOnly ? CRON_MANAGEMENT_METHODS.map((method) => method.slice(5)) : CRON_ACTIONS),
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
		contextMessages: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: 10
		})),
		agentId: Type.Optional(Type.String({ description: managementOnly ? "Agent filter for action=\"list\"." : "List filter for `action: \"list\"`; wake target override for `action: \"wake\"` (defaults to the calling agent when omitted on wake)" })),
		sessionKey: Type.Optional(Type.String({ description: "Wake target override for `action: \"wake\"`: route the event to another session owned by the calling agent. Defaults to the resolved calling-session key when omitted." }))
	}, { additionalProperties: true });
	return managementOnly ? Type.Omit(schema, [
		"in",
		"text",
		"mode",
		"contextMessages",
		"sessionKey"
	]) : schema;
}
//#endregion
//#region src/agents/tools/cron-tool-context.ts
/** Reminder-context projection for cron tool job creation. */
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
	const role = typeof message.role === "string" ? message.role : "";
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
	const { mainKey, alias } = resolveMainSessionAlias(cfg);
	const resolvedKey = resolveInternalSessionKey({
		key: sessionKey,
		alias,
		mainKey
	});
	try {
		const res = await params.callGatewayTool("chat.history", params.gatewayOpts, {
			sessionKey: resolvedKey,
			agentId: params.agentId,
			limit: maxMessages
		});
		const recent = (Array.isArray(res?.messages) ? res.messages : []).map((msg) => extractMessageText(msg)).filter((msg) => Boolean(msg)).slice(-maxMessages);
		if (recent.length === 0) return [];
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
		processInstanceId
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
	if (!isRecord(result) || !Array.isArray(result.jobs)) throw new Error("cron.list returned an invalid inventory page");
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
function cronListPageHasJob(result, jobId) {
	return result.jobs.some((job) => isRecord(job) && job.id === jobId);
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
			if (cronListPageHasJob(page, params.jobId) || nextOffset === null) return filterCronListResultToJobId(page, params.jobId);
			offset = nextOffset;
		}
		if (!snapshotChanged) throw new Error("cron.list pagination exceeded maximum pages while reading current automation");
		if (restart === CRON_SELF_LIST_MAX_SNAPSHOT_RESTARTS) throw new Error("cron.list inventory changed repeatedly while reading current automation");
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
			creatorAuthorityComplete: true
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
			resolveCreatorToolAuthority,
			operationSignal: params.operationSignal
		});
		if (callerIncludedPayloadPatch && !params.adminManagement) assertNoCronShellExecution(prepared.patch);
		const payload = isRecord(prepared.patch.payload) ? prepared.patch.payload : void 0;
		const captureSource = prepared.resolvedAuthority ? prepared.resolvedAuthority.provenance.source : params.creatorToolAllowlistCaptureRef?.value?.source;
		if (payload?.toolsAllowIsDefault === true && (prepared.resolvedAuthority || params.creatorToolAllowlistCaptureRef) && captureSource !== "final-executable-surface") throw new Error(INCOMPLETE_CRON_CREATOR_AUTHORITY_MESSAGE);
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
/**
* cron built-in tool.
*
* Manages scheduled jobs, wake/run actions, delivery context, and reminder-style payload normalization.
*/
function isMissingOrEmptyObject(value) {
	return !value || isRecord(value) && Object.keys(value).length === 0;
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
function readCronSelfRemoveOnlyJobId(opts) {
	return opts?.selfRemoveOnlyJobId?.trim() || void 0;
}
function isCronSelfIntrospectionAction(action) {
	return action === "status" || action === "list";
}
function assertCronSelfRemoveScope(opts, action, params) {
	const selfRemoveOnlyJobId = readCronSelfRemoveOnlyJobId(opts);
	if (!selfRemoveOnlyJobId || isCronSelfIntrospectionAction(action)) return;
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
function filterCronStatusResultForSelfScope(result) {
	return { enabled: isRecord(result) && result.enabled === true };
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
function isOlderGatewayWithoutCompactCronList(error) {
	return error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" && error.message.includes("invalid cron.list params") && error.message.includes("unexpected property 'compact'");
}
function buildCronToolDescription(params) {
	const streamScheduleLine = params.triggersEnabled ? "\n- {kind:\"stream\",command:[argv]}: fires on supervised process output; disabled only when cron.triggers.enabled=false." : "";
	const scriptPayloadLine = params.triggersEnabled ? "\n- {kind:\"script\",script}: main|isolated only; disabled only when cron.triggers.enabled=false." : "";
	const triggerSection = params.triggersEnabled ? `TRIGGER (condition watcher on every/cron): {script}; available unless cron.triggers.enabled=false — if off, say so; never model-poll instead. Quiet headless check, no model; 30s/5 tool calls/16KB state. Read frozen trigger.state, return json({fire,message?,state?}) with NEW state; dedupe via state, never memory. fire:false saves state only. fire:true runs payload; message is that run's entire context — self-contained. Fire on failures/timeouts too; success-only watchers look healthy when broken. Script stays read-only; actions belong in payload. once:true disables after first fire. Code Mode: await exec({command:"..."}).` : `TRIGGERS DISABLED (cron.triggers.enabled=false): condition triggers, script payloads, and stream schedules are unavailable here. Omit trigger; use plain time-based schedules. If the user asks for a conditional watcher, say it is unsupported — never model-poll instead, and never silently create an unconditional job in its place.`;
	const silentWatcherCue = params.triggersEnabled ? " Silent watcher=>mode:\"none\"." : "";
	return `Gateway scheduler: reminders, delayed self-wakeups, loops, recurring work${params.triggersEnabled ? ", event watchers" : ""}. Never exec sleep/poll as timer.

ACTIONS: status | list [includeDisabled,limit?,offset?] (compact summaries with timing; use nextOffset for the next page) | get jobId (full schedule, payload, and delivery details) | add job | update jobId job (partial: only supplied fields change; null clears) | remove jobId | run jobId (runMode "force"=now) | runs jobId = history | next_check in:"30m" (own paced run only) | wake text mode?:"now"|"next-heartbeat"(default) nudges a caller-owned lane (sessionKey/agentId to pick another).

SCOPE: Authenticated configured channel owner and Control UI administrator turns can list/get/update/run/remove any Gateway automation. Other turns see only caller-visible jobs; totals/counts and hasMore describe that scoped view, not global inventory. In that restricted view, an empty list or failed list/get/update/remove (including not-found) does not establish global absence, whatever the source of a known job id (including your own history). Never recreate or replace a known automation to satisfy an update/remove or reconciliation request solely because of these results. Report that you cannot establish global absence and ask an authorized administrator to check through a fresh authenticated configured channel owner or Control UI administrator turn or the Automations page; do not bypass caller scope. Genuinely new, requested automations can still be created.

ADD: job requires schedule+payload.

SCHEDULE:
- {kind:"at",at:"ISO-8601"} one-shot; no tz=UTC; auto-deletes after successful completion: delivery confirmed, not requested, intentionally silent, or explicitly bestEffort. Failed/unknown required delivery retains it disabled.
- {kind:"every",everyMs}.
- {kind:"cron",expr,tz?:"IANA"}: expr is wall time in tz; never pre-convert to UTC; no tz=gateway host local. 18:00 Shanghai => {expr:"0 18 * * *",tz:"Asia/Shanghai"}.${streamScheduleLine}

TARGET+PAYLOAD:
- "current" (agentTurn default) = this conversation: the run stays detached, reads bounded chat context, then commits its final visible assistant result to this conversation's durable history. Self-wakeup/"continue later"/loop = at|every + agentTurn + current.
- "isolated" = fresh detached session (shows in \`openclaw tasks\`); standalone background work.
- "main" = heartbeat lane; payload {kind:"systemEvent",text} (systemEvent default target).
- "session:<key>" = named session.
- {kind:"agentTurn",message}; timeoutSeconds 0=none.
- Inherited configured MCP authority includes only model-callable tools; interactive app-view-only capabilities are excluded from headless jobs.${scriptPayloadLine}

PACED LOOP: recurring job + pacing{min?,max?} durations ("15m","4h"; at least one). Inside its run, job calls next_check in:"<dur>" to set the next delay (clamped to bounds, measured from run end; failed runs keep normal backoff). Adaptive polling: tighten when active, back off when quiet.

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
	const tool = {
		label: "Automations",
		name: AUTOMATIONS_TOOL_NAME,
		displaySummary: CRON_TOOL_DISPLAY_SUMMARY,
		description: managementAuthority?.managementOnly ? "Manage any existing automation on this Gateway with the admitted automation management authority. Actions: list [includeDisabled,limit,offset] (compact summaries with timing; follow nextOffset); get jobId (full schedule, payload, and delivery details); update jobId job (partial patch, null clears); run jobId (runMode:\"force\" runs now); remove jobId. Creator attribution and scheduled execution policy stay intact. Use the Automations page for other actions." : buildCronToolDescription({ triggersEnabled }),
		outputSchema: CronToolOutputSchema,
		parameters: createCronToolSchema({
			agentSessionKey: opts?.agentSessionKey,
			triggersEnabled,
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
						return jsonResult(readCronSelfRemoveOnlyJobId(opts) ? filterCronStatusResultForSelfScope(result) : result);
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
								if (!useCompactList || !isOlderGatewayWithoutCompactCronList(error)) throw error;
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
					case "get": {
						const id = requireCronJobIdParam(params);
						return jsonResult(await callGateway("cron.get", gatewayOpts, { id }));
					}
					case "add": {
						if (isMissingOrEmptyObject(params.job)) {
							const synthetic = recoverCronObjectFromFlatParams(params);
							if (synthetic.found && hasCronCreateSignal(synthetic.value)) params.job = synthetic.value;
						}
						if (!params.job || typeof params.job !== "object") throw new Error("job required");
						const canonicalJob = stripCronCreateNullClears(canonicalizeCronToolObject(params.job));
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
						capCronJobToolsAllowOnCreate(job, creatorToolAllowlist);
						assertInheritedCronToolCaptureReady(job, creatorToolAllowlistCaptureRef);
						if (job && typeof job === "object") {
							const { mainKey, alias } = resolveMainSessionAlias(runtimeConfig);
							const resolvedSessionKey = opts?.agentSessionKey ? resolveInternalSessionKey({
								key: opts.agentSessionKey,
								alias,
								mainKey
							}) : void 0;
							const sessionTarget = normalizeLowercaseStringOrEmpty(job.sessionTarget);
							if (!("sessionKey" in job) && resolvedSessionKey && sessionTarget !== "isolated") job.sessionKey = resolvedSessionKey;
						}
						if ((opts?.agentSessionKey || opts?.currentDeliveryContext) && job && typeof job === "object" && "payload" in job && job.payload?.kind === "agentTurn") {
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
						if (job && typeof job === "object" && "payload" in job && job.payload?.kind === "systemEvent") {
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
						let recoveredFlatPatch = false;
						if (isMissingOrEmptyObject(params.job)) {
							const synthetic = recoverCronObjectFromFlatParams(params);
							if (synthetic.found) {
								params.job = synthetic.value;
								recoveredFlatPatch = true;
							}
						}
						if (!params.job || typeof params.job !== "object") throw new Error("job required");
						const canonicalPatch = canonicalizeCronToolObject(params.job);
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
					case "remove": {
						const id = requireCronJobIdParam(params);
						return jsonResult(await callGateway("cron.remove", gatewayOpts, { id }));
					}
					case "run": {
						const id = requireCronJobIdParam(params);
						const runMode = params.runMode === "due" || params.runMode === "force" ? params.runMode : "due";
						return jsonResult(await callGateway("cron.run", gatewayOpts, {
							id,
							mode: runMode
						}));
					}
					case "runs": {
						const id = requireCronJobIdParam(params);
						return jsonResult(await callGateway("cron.runs", gatewayOpts, { id }));
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
						const { mainKey, alias } = resolveMainSessionAlias(runtimeConfig);
						const explicitSessionKey = readToolStringParam(params, "sessionKey");
						const explicitAgentId = readToolStringParam(params, "agentId");
						const inferredSessionKey = opts?.agentSessionKey ? resolveInternalSessionKey({
							key: opts.agentSessionKey,
							alias,
							mainKey
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
export { resolveCronStoredDeliveryContext as n, createCronTool as t };
