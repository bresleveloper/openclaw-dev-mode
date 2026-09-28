import { c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import "./sqlite-transaction-DKSXLQhb.mjs";
import { r as tableExists, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import "./audit-activity-YfkV8ffO.mjs";
import { n as validateExecutionIdentityContextV1 } from "./audit-run-validators-DIyIA-46.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-DBVCGotT.mjs";
import { a as parseExecutionIdentityAdmissionEnvelope, c as executionIdentitySpawnAdmission, l as sortUniqueExecutionIdentityEntries, o as parseExecutionIdentityAdmissionToken, s as parseExecutionIdentityAdmissionWork } from "./execution-identity-admission-3hhMmAVK.mjs";
import "./execution-owner-lifecycle-binding-store-CzRkIAqs.mjs";
import { a as pseudonymizeAuditIdentity, i as loadOrCreateAuditIdentityKey, o as pseudonymizeExecutionIdentityRef, r as clearAuditIdentityKeyCacheForDatabase } from "./execution-decision-facts--8ty_5Z3.mjs";
import { t as parsePositiveAuditCursor } from "./audit-cursor-x-Oiyo9y.mjs";
import "./operator-approval-store-ZXCDEDUV.mjs";
import { randomUUID } from "node:crypto";
//#region src/audit/audit-event-queries.ts
function createAuditEventQueries(db) {
	const database = getNodeSqliteKysely(db);
	return {
		insert: prepareSqliteQueryTakeFirstSync(db, (parameter) => database.insertInto("audit_events").values({
			event_id: parameter((value) => value.event_id),
			source_id: parameter((value) => value.source_id),
			source_sequence: parameter((value) => value.source_sequence),
			schema_version: parameter((value) => value.schema_version),
			occurred_at: parameter((value) => value.occurred_at),
			kind: parameter((value) => value.kind),
			action: parameter((value) => value.action),
			status: parameter((value) => value.status),
			error_code: parameter((value) => value.error_code),
			actor_type: parameter((value) => value.actor_type),
			actor_id: parameter((value) => value.actor_id),
			agent_id: parameter((value) => value.agent_id),
			session_key: parameter((value) => value.session_key),
			session_id: parameter((value) => value.session_id),
			run_id: parameter((value) => value.run_id),
			tool_call_id: parameter((value) => value.tool_call_id),
			tool_name: parameter((value) => value.tool_name),
			direction: parameter((value) => value.direction),
			channel: parameter((value) => value.channel),
			conversation_kind: parameter((value) => value.conversation_kind),
			message_outcome: parameter((value) => value.message_outcome),
			reason_code: parameter((value) => value.reason_code),
			delivery_kind: parameter((value) => value.delivery_kind),
			failure_stage: parameter((value) => value.failure_stage),
			duration_ms: parameter((value) => value.duration_ms),
			result_count: parameter((value) => value.result_count),
			account_ref: parameter((value) => value.account_ref),
			conversation_ref: parameter((value) => value.conversation_ref),
			message_ref: parameter((value) => value.message_ref),
			target_ref: parameter((value) => value.target_ref)
		}).onConflict((conflict) => conflict.column("source_id").doNothing()).returning((eb) => eb.cast("sequence", "text").as("sequence"))),
		read: prepareSqliteQueryTakeFirstSync(db, (parameter) => database.selectFrom("audit_events").selectAll().where("sequence", "=", parameter((sequence) => sequence)))
	};
}
const auditEventQueries = /* @__PURE__ */ new WeakMap();
function getAuditEventQueries(db) {
	let queries = auditEventQueries.get(db);
	if (!queries) {
		queries = createAuditEventQueries(db);
		auditEventQueries.set(db, queries);
	}
	return queries;
}
//#endregion
//#region src/audit/audit-event-types.ts
const AUDIT_INBOUND_MESSAGE_COMPLETED_REASONS = [
	"fast_abort",
	"plugin_bound_handled",
	"plugin_bound_unavailable",
	"plugin_bound_declined",
	"before_dispatch_handled",
	"acp_dispatch_completed",
	"acp_dispatch_empty",
	"active_run_injected"
];
const AUDIT_INBOUND_MESSAGE_SKIPPED_REASONS = [
	"duplicate",
	"reply_operation_active",
	"reply_operation_aborted",
	"acp_dispatch_aborted"
];
const AUDIT_OUTBOUND_MESSAGE_SUPPRESSED_REASONS = [
	"cancelled_by_message_sending_hook",
	"cancelled_by_reply_payload_sending_hook",
	"empty_after_message_sending_hook",
	"empty_after_reply_payload_sending_hook",
	"no_visible_payload"
];
function isOutboundMessageProgressInput(input) {
	return input.kind === "message" && input.direction === "outbound" && (input.action === "message.outbound.queued" || input.action === "message.outbound.platform-started");
}
//#endregion
//#region src/audit/message-execution-binding.ts
const ensuredTerminalBindingDatabases = /* @__PURE__ */ new WeakSet();
function terminalBindingSchemaSql() {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS outbound_message_execution_bindings (");
	const indexStart = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE INDEX IF NOT EXISTS outbound_message_execution_bindings_execution_event_idx", start);
	const end = indexStart >= 0 ? OPENCLAW_STATE_SCHEMA_SQL.indexOf(";", indexStart) : -1;
	if (start < 0 || end < 0) throw new Error("canonical outbound message execution binding schema is missing");
	return OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 1);
}
/** Install the terminal binding companion only when an exact producer first uses it. */
function ensureTerminalMessageExecutionBindingSchema(options) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredTerminalBindingDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(terminalBindingSchemaSql());
	}, {
		...options,
		database
	}, { operationLabel: "audit.outbound-message.execution-binding.schema.ensure" });
	ensuredTerminalBindingDatabases.add(database.db);
}
/** Validate queue-loaded token bytes before entering a synchronous write transaction. */
function planMessageExecutionBinding(token, runId) {
	if (!token) return;
	const planned = parseExecutionIdentityAdmissionToken(token);
	if (!runId || planned.runId !== runId) throw new Error("outbound message execution binding disagrees with the admitted run");
	return planned;
}
/** Confirm the exact retained admission row; run correlation alone never binds a receipt. */
function confirmMessageExecutionBinding(db, token) {
	if (!token || !tableExists(db, "execution_identity_contexts")) return;
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("execution_identity_contexts").select("context_id").where("context_id", "=", token.contextId).where("execution_id", "=", token.executionId).where("run_id", "=", token.runId).where("created_at", "=", token.createdAt)) ? {
		contextId: token.contextId,
		executionId: token.executionId
	} : void 0;
}
function recordTerminalMessageExecutionBinding(db, params) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("outbound_message_execution_bindings").values({
		event_id: params.eventId,
		context_id: params.contextId,
		execution_id: params.executionId,
		run_id: params.runId
	}));
}
function recordConfirmedTerminalMessageExecutionBinding(db, params) {
	if (!params.eventId) return;
	const binding = confirmMessageExecutionBinding(db, params.token);
	if (binding && params.token) recordTerminalMessageExecutionBinding(db, {
		eventId: params.eventId,
		runId: params.token.runId,
		...binding
	});
}
//#endregion
//#region src/audit/audit-event-store.ts
/** SQLite persistence and stable cursor queries for metadata-only audit events. */
const AUDIT_EVENT_RETENTION_MS = 2592e6;
const AUDIT_EVENT_MAX_ROWS = 1e5;
const AUDIT_EVENT_PRUNE_BATCH_ROWS = 1024;
const auditEventRowCounts = /* @__PURE__ */ new WeakMap();
function getAuditKysely(db) {
	return getNodeSqliteKysely(db);
}
const RUN_ACTIONS = ["agent.run.started", "agent.run.finished"];
const TOOL_ACTIONS = ["tool.action.started", "tool.action.finished"];
const CONVERSATION_KINDS = [
	"direct",
	"group",
	"channel",
	"unknown"
];
const DELIVERY_KINDS = [
	"text",
	"media",
	"other"
];
const FAILURE_STAGES = [
	"platform_send",
	"queue",
	"unknown"
];
const AUDIT_HMAC_REF_RE$1 = /^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$/u;
const MESSAGE_COLUMNS = [
	"direction",
	"channel",
	"conversation_kind",
	"message_outcome",
	"reason_code",
	"delivery_kind",
	"failure_stage",
	"duration_ms",
	"result_count",
	"account_ref",
	"conversation_ref",
	"message_ref",
	"target_ref"
];
function corruptAuditRow(row, problem) {
	const sequence = normalizeSqliteNumber(row.sequence);
	const location = sequence === void 0 ? "" : ` ${sequence}`;
	throw new Error(`corrupt audit event row${location}: ${problem}`);
}
function requiredInteger(row, value, field, minimum) {
	const normalized = normalizeSqliteNumber(value);
	if (normalized === void 0 || !Number.isSafeInteger(normalized) || normalized < minimum) corruptAuditRow(row, `invalid ${field}`);
	return normalized;
}
function optionalInteger(row, value, field, minimum) {
	if (value === null) return;
	return requiredInteger(row, value, field, minimum);
}
function requiredText$1(row, value, field) {
	if (typeof value !== "string" || value.length === 0) corruptAuditRow(row, `invalid ${field}`);
	return value;
}
function optionalText$1(row, value, field) {
	if (value === null || value === void 0) return;
	return requiredText$1(row, value, field);
}
function requiredEnum(row, value, field, allowed) {
	for (const candidate of allowed) if (value === candidate) return candidate;
	return corruptAuditRow(row, `invalid ${field}`);
}
function optionalEnum(row, value, field, allowed) {
	if (value === null || value === void 0) return;
	return requiredEnum(row, value, field, allowed);
}
function requiredHmacRef(row, value, field) {
	const ref = requiredText$1(row, value, field);
	if (!AUDIT_HMAC_REF_RE$1.test(ref)) corruptAuditRow(row, `invalid ${field}`);
	return ref;
}
function optionalHmacRef$1(row, value, field) {
	if (value === null || value === void 0) return;
	return requiredHmacRef(row, value, field);
}
function requireNull(row, field) {
	if (row[field] !== null) corruptAuditRow(row, `unexpected ${field}`);
}
function requireNullColumns(row, fields) {
	for (const field of fields) requireNull(row, field);
}
function parseAuditRecordBase(row) {
	const schemaVersion = requiredInteger(row, row.schema_version, "schemaVersion", 1);
	if (schemaVersion !== 1) corruptAuditRow(row, `unsupported schemaVersion ${schemaVersion}`);
	return {
		schemaVersion,
		sequence: requiredInteger(row, row.sequence, "sequence", 1),
		eventId: requiredText$1(row, row.event_id, "eventId"),
		sourceSequence: requiredInteger(row, row.source_sequence, "sourceSequence", 1),
		occurredAt: requiredInteger(row, row.occurred_at, "occurredAt", 0),
		redaction: "metadata_only"
	};
}
function parseAgentRecordFields(row) {
	requireNullColumns(row, MESSAGE_COLUMNS);
	return {
		...parseAuditRecordBase(row),
		actorType: requiredEnum(row, row.actor_type, "actorType", ["agent", "system"]),
		actorId: requiredText$1(row, row.actor_id, "actorId"),
		agentId: requiredText$1(row, row.agent_id, "agentId"),
		...optionalText$1(row, row.session_key, "sessionKey") !== void 0 ? { sessionKey: requiredText$1(row, row.session_key, "sessionKey") } : {},
		...optionalText$1(row, row.session_id, "sessionId") !== void 0 ? { sessionId: requiredText$1(row, row.session_id, "sessionId") } : {},
		runId: requiredText$1(row, row.run_id, "runId")
	};
}
function parseAgentRunRow(row) {
	requireNull(row, "tool_call_id");
	requireNull(row, "tool_name");
	const common = {
		...parseAgentRecordFields(row),
		kind: "agent_run"
	};
	const action = requiredEnum(row, row.action, "action", RUN_ACTIONS);
	if (action === "agent.run.started") {
		requiredEnum(row, row.status, "status", ["started"]);
		requireNull(row, "error_code");
		return {
			...common,
			action,
			status: "started"
		};
	}
	if (row.status === "succeeded") {
		requireNull(row, "error_code");
		return {
			...common,
			action,
			status: "succeeded"
		};
	}
	const terminal = row.status === "failed" ? {
		status: "failed",
		errorCode: "run_failed"
	} : row.status === "cancelled" ? {
		status: "cancelled",
		errorCode: "run_cancelled"
	} : row.status === "timed_out" ? {
		status: "timed_out",
		errorCode: "run_timed_out"
	} : row.status === "blocked" ? {
		status: "blocked",
		errorCode: "run_blocked"
	} : corruptAuditRow(row, "invalid run terminal status");
	requiredEnum(row, row.error_code, "errorCode", [terminal.errorCode]);
	return {
		...common,
		action,
		...terminal
	};
}
function parseToolActionRow(row) {
	const toolCallId = optionalText$1(row, row.tool_call_id, "toolCallId");
	const toolName = optionalText$1(row, row.tool_name, "toolName");
	const common = {
		...parseAgentRecordFields(row),
		kind: "tool_action",
		...toolCallId ? { toolCallId } : {},
		...toolName ? { toolName } : {}
	};
	const action = requiredEnum(row, row.action, "action", TOOL_ACTIONS);
	if (action === "tool.action.started") {
		requiredEnum(row, row.status, "status", ["started"]);
		requireNull(row, "error_code");
		return {
			...common,
			action,
			status: "started"
		};
	}
	if (row.status === "succeeded") {
		requireNull(row, "error_code");
		return {
			...common,
			action,
			status: "succeeded"
		};
	}
	const terminal = row.status === "failed" ? {
		status: "failed",
		errorCode: "tool_failed"
	} : row.status === "cancelled" ? {
		status: "cancelled",
		errorCode: "tool_cancelled"
	} : row.status === "timed_out" ? {
		status: "timed_out",
		errorCode: "tool_timed_out"
	} : row.status === "blocked" ? {
		status: "blocked",
		errorCode: "tool_blocked"
	} : row.status === "unknown" ? {
		status: "unknown",
		errorCode: "tool_outcome_unknown"
	} : corruptAuditRow(row, "invalid tool terminal status");
	requiredEnum(row, row.error_code, "errorCode", [terminal.errorCode]);
	return {
		...common,
		action,
		...terminal
	};
}
function parseMessageRecordFields(row) {
	requireNullColumns(row, [
		"session_key",
		"session_id",
		"tool_call_id",
		"tool_name"
	]);
	const agentId = optionalText$1(row, row.agent_id, "agentId");
	const runId = optionalText$1(row, row.run_id, "runId");
	const durationMs = optionalInteger(row, row.duration_ms, "durationMs", 0);
	const resultCount = optionalInteger(row, row.result_count, "resultCount", 0);
	const accountRef = optionalHmacRef$1(row, row.account_ref, "accountRef");
	const conversationRef = optionalHmacRef$1(row, row.conversation_ref, "conversationRef");
	const messageRef = optionalHmacRef$1(row, row.message_ref, "messageRef");
	const targetRef = optionalHmacRef$1(row, row.target_ref, "targetRef");
	return {
		...parseAuditRecordBase(row),
		kind: "message",
		channel: requiredText$1(row, row.channel, "channel"),
		conversationKind: requiredEnum(row, row.conversation_kind, "conversationKind", CONVERSATION_KINDS),
		...agentId ? { agentId } : {},
		...runId ? { runId } : {},
		...durationMs !== void 0 ? { durationMs } : {},
		...resultCount !== void 0 ? { resultCount } : {},
		...accountRef ? { accountRef } : {},
		...conversationRef ? { conversationRef } : {},
		...messageRef ? { messageRef } : {},
		...targetRef ? { targetRef } : {}
	};
}
function parseInboundMessageRow(row) {
	requiredEnum(row, row.action, "action", ["message.inbound.processed"]);
	requiredEnum(row, row.direction, "direction", ["inbound"]);
	requireNull(row, "delivery_kind");
	requireNull(row, "failure_stage");
	const actorType = requiredEnum(row, row.actor_type, "actorType", ["channel_sender", "system"]);
	const actorId = actorType === "channel_sender" ? requiredHmacRef(row, row.actor_id, "actorId") : requiredText$1(row, row.actor_id, "actorId");
	const common = {
		...parseMessageRecordFields(row),
		action: "message.inbound.processed",
		direction: "inbound",
		actorType,
		actorId
	};
	if (row.status === "succeeded") {
		requiredEnum(row, row.message_outcome, "outcome", ["completed"]);
		requireNull(row, "error_code");
		const reasonCode = optionalEnum(row, row.reason_code, "reasonCode", AUDIT_INBOUND_MESSAGE_COMPLETED_REASONS);
		return {
			...common,
			status: "succeeded",
			outcome: "completed",
			...reasonCode ? { reasonCode } : {}
		};
	}
	if (row.status === "blocked") {
		requiredEnum(row, row.message_outcome, "outcome", ["skipped"]);
		requireNull(row, "error_code");
		const reasonCode = optionalEnum(row, row.reason_code, "reasonCode", AUDIT_INBOUND_MESSAGE_SKIPPED_REASONS);
		return {
			...common,
			status: "blocked",
			outcome: "skipped",
			...reasonCode ? { reasonCode } : {}
		};
	}
	if (row.status === "failed") {
		requiredEnum(row, row.message_outcome, "outcome", ["failed"]);
		requiredEnum(row, row.error_code, "errorCode", ["message_processing_failed"]);
		const reasonCode = optionalEnum(row, row.reason_code, "reasonCode", ["acp_dispatch_failed", "plugin_bound_error"]);
		return {
			...common,
			status: "failed",
			outcome: "failed",
			errorCode: "message_processing_failed",
			...reasonCode ? { reasonCode } : {}
		};
	}
	return corruptAuditRow(row, "invalid inbound status");
}
function parseOutboundMessageRow(row) {
	const action = requiredEnum(row, row.action, "action", [
		"message.outbound.queued",
		"message.outbound.platform-started",
		"message.outbound.finished"
	]);
	requiredEnum(row, row.direction, "direction", ["outbound"]);
	const actorType = requiredEnum(row, row.actor_type, "actorType", ["agent", "system"]);
	const actorId = requiredText$1(row, row.actor_id, "actorId");
	const common = {
		...parseMessageRecordFields(row),
		action,
		direction: "outbound",
		actorType,
		actorId
	};
	if (row.status === "started") {
		requireNull(row, "delivery_kind");
		requireNullColumns(row, [
			"error_code",
			"reason_code",
			"failure_stage"
		]);
		if (action === "message.outbound.queued") {
			requiredEnum(row, row.message_outcome, "outcome", ["queued"]);
			return {
				...common,
				action,
				status: "started",
				outcome: "queued"
			};
		}
		if (action === "message.outbound.platform-started") {
			requiredEnum(row, row.message_outcome, "outcome", ["platform_started"]);
			return {
				...common,
				action,
				status: "started",
				outcome: "platform_started"
			};
		}
		return corruptAuditRow(row, "invalid outbound lifecycle action");
	}
	requiredEnum(row, action, "action", ["message.outbound.finished"]);
	const terminalCommon = {
		...common,
		action: "message.outbound.finished"
	};
	if (row.status === "succeeded") {
		const deliveryKind = optionalEnum(row, row.delivery_kind, "deliveryKind", DELIVERY_KINDS);
		requiredEnum(row, row.message_outcome, "outcome", ["sent"]);
		requireNullColumns(row, [
			"error_code",
			"reason_code",
			"failure_stage"
		]);
		return {
			...terminalCommon,
			status: "succeeded",
			outcome: "sent",
			...deliveryKind ? { deliveryKind } : {}
		};
	}
	if (row.status === "blocked") {
		requireNull(row, "delivery_kind");
		requiredEnum(row, row.message_outcome, "outcome", ["suppressed"]);
		requireNullColumns(row, ["error_code", "failure_stage"]);
		const reasonCode = requiredEnum(row, row.reason_code, "reasonCode", AUDIT_OUTBOUND_MESSAGE_SUPPRESSED_REASONS);
		return {
			...terminalCommon,
			status: "blocked",
			outcome: "suppressed",
			reasonCode
		};
	}
	if (row.status === "failed") {
		const deliveryKind = optionalEnum(row, row.delivery_kind, "deliveryKind", DELIVERY_KINDS);
		requiredEnum(row, row.message_outcome, "outcome", ["failed"]);
		requireNull(row, "reason_code");
		const errorCode = requiredEnum(row, row.error_code, "errorCode", ["message_delivery_failed", "message_delivery_partial_failure"]);
		const failureStage = requiredEnum(row, row.failure_stage, "failureStage", FAILURE_STAGES);
		return {
			...terminalCommon,
			status: "failed",
			outcome: "failed",
			errorCode,
			failureStage,
			...deliveryKind ? { deliveryKind } : {}
		};
	}
	if (row.status === "unknown") {
		requireNull(row, "delivery_kind");
		requiredEnum(row, row.message_outcome, "outcome", ["unknown"]);
		requireNullColumns(row, ["error_code", "reason_code"]);
		const failureStage = requiredEnum(row, row.failure_stage, "failureStage", FAILURE_STAGES);
		return {
			...terminalCommon,
			status: "unknown",
			outcome: "unknown",
			failureStage
		};
	}
	return corruptAuditRow(row, "invalid outbound status");
}
function rowToAuditEvent(row) {
	if (row.kind === "agent_run") return parseAgentRunRow(row);
	if (row.kind === "tool_action") return parseToolActionRow(row);
	if (row.kind !== "message") corruptAuditRow(row, "invalid kind");
	if (row.direction === "inbound") return parseInboundMessageRow(row);
	if (row.direction === "outbound") return parseOutboundMessageRow(row);
	return corruptAuditRow(row, "invalid message direction");
}
function projectMessageIdentities(db, input) {
	const identity = loadOrCreateAuditIdentityKey(db);
	const conversationId = input.conversationId ?? (input.direction === "outbound" ? input.targetId : void 0);
	const ref = (kind, value) => pseudonymizeAuditIdentity({
		identity,
		kind,
		channel: input.channel,
		...kind !== "account" && input.accountId !== void 0 ? { accountId: input.accountId } : {},
		...kind === "message" && conversationId !== void 0 ? { conversationId } : {},
		value
	});
	return {
		actorId: input.actorType === "channel_sender" ? ref("actor", input.actorId) : input.actorId,
		accountRef: ref("account", input.accountId),
		conversationRef: ref("conversation", conversationId),
		messageRef: ref("message", input.messageId),
		targetRef: ref("target", input.targetId)
	};
}
function bindAuditEvent(db, input) {
	const message = input.kind === "message" ? projectMessageIdentities(db, input) : void 0;
	return {
		event_id: randomUUID(),
		source_id: input.sourceId,
		source_sequence: input.sourceSequence,
		schema_version: 1,
		occurred_at: input.occurredAt,
		kind: input.kind,
		action: input.action,
		status: input.status,
		error_code: input.errorCode ?? null,
		actor_type: input.actorType,
		actor_id: message?.actorId ?? input.actorId,
		agent_id: input.agentId ?? null,
		session_key: input.kind === "message" ? null : input.sessionKey ?? null,
		session_id: input.kind === "message" ? null : input.sessionId ?? null,
		run_id: input.runId ?? null,
		tool_call_id: input.kind === "tool_action" ? input.toolCallId ?? null : null,
		tool_name: input.kind === "tool_action" ? input.toolName : null,
		direction: input.kind === "message" ? input.direction : null,
		channel: input.kind === "message" ? input.channel : null,
		conversation_kind: input.kind === "message" ? input.conversationKind : null,
		message_outcome: input.kind === "message" ? input.outcome : null,
		reason_code: input.kind === "message" ? input.reasonCode ?? null : null,
		delivery_kind: input.kind === "message" ? input.deliveryKind ?? null : null,
		failure_stage: input.kind === "message" ? input.failureStage ?? null : null,
		duration_ms: input.kind === "message" ? input.durationMs ?? null : null,
		result_count: input.kind === "message" ? input.resultCount ?? null : null,
		account_ref: message?.accountRef ?? null,
		conversation_ref: message?.conversationRef ?? null,
		message_ref: message?.messageRef ?? null,
		target_ref: message?.targetRef ?? null
	};
}
function countAuditEvents(db) {
	const row = executeSqliteQueryTakeFirstSync(db, getAuditKysely(db).selectFrom("audit_events").select((expression) => expression.fn.countAll().as("count")));
	return normalizeSqliteNumber(row?.count ?? null) ?? 0;
}
function deleteExpiredAuditEvents(db, now) {
	const kysely = getAuditKysely(db);
	const expiredSequences = kysely.selectFrom("audit_events").select("sequence").where("occurred_at", "<", now - AUDIT_EVENT_RETENTION_MS).orderBy("occurred_at", "asc").orderBy("sequence", "asc").limit(AUDIT_EVENT_PRUNE_BATCH_ROWS);
	return executeSqliteQuerySync(db, kysely.deleteFrom("audit_events").where("sequence", "in", expiredSequences));
}
function pruneAuditEventsAfterInsert(db, now) {
	const kysely = getAuditKysely(db);
	const expired = deleteExpiredAuditEvents(db, now);
	const cachedCount = auditEventRowCounts.get(db);
	let rowCount = cachedCount === void 0 ? countAuditEvents(db) : Math.max(0, cachedCount + 1 - Number(expired.numAffectedRows ?? 0n));
	if (rowCount <= AUDIT_EVENT_MAX_ROWS) {
		auditEventRowCounts.set(db, rowCount);
		return;
	}
	const retainedRows = Math.max(0, 98976);
	const overflowRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("audit_events").select("sequence").orderBy("sequence", "desc").offset(retainedRows).limit(1));
	const sequenceCutoff = overflowRow ? normalizeSqliteNumber(overflowRow.sequence) : void 0;
	if (sequenceCutoff !== void 0) {
		const pruned = executeSqliteQuerySync(db, kysely.deleteFrom("audit_events").where("sequence", "<=", sequenceCutoff));
		rowCount = Math.max(0, rowCount - Number(pruned.numAffectedRows ?? 0n));
	}
	auditEventRowCounts.set(db, rowCount);
}
/** Persist one projected event idempotently and prune fixed retention bounds. */
function recordAuditEventInDatabase(input, options) {
	if (isOutboundMessageProgressInput(input)) throw new Error("outbound message progress belongs to its companion store");
	const executionToken = input.kind === "message" && input.direction === "outbound" ? planMessageExecutionBinding(input.executionIdentityToken, input.runId) : void 0;
	if (executionToken) ensureTerminalMessageExecutionBindingSchema(options);
	let countCacheDatabase;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			countCacheDatabase = db;
			const values = bindAuditEvent(db, input);
			const queries = getAuditEventQueries(db);
			const insert = queries.insert(values);
			if (insert === void 0) return;
			const insertedSequence = Number(insert.sequence);
			if (!Number.isSafeInteger(insertedSequence) || insertedSequence < 1) throw new Error("audit event sequence is outside the supported integer range");
			pruneAuditEventsAfterInsert(db, Date.now());
			const row = queries.read(insertedSequence);
			recordConfirmedTerminalMessageExecutionBinding(db, {
				eventId: row?.event_id,
				token: executionToken
			});
			return row ? rowToAuditEvent(row) : void 0;
		}, options);
	} catch (error) {
		if (countCacheDatabase) {
			auditEventRowCounts.delete(countCacheDatabase);
			clearAuditIdentityKeyCacheForDatabase(countCacheDatabase);
		}
		throw error;
	}
}
/** List newest-first records using the shared state worker and a stable sequence cursor. */
async function listAuditEvents(params) {
	const input = {
		limit: params.limit,
		now: params.now ?? Date.now(),
		...params.cursor !== void 0 ? { cursor: params.cursor } : {},
		...params.filters ? { filters: { ...params.filters } } : {}
	};
	const context = captureOpenClawStateWorkerContext(params.database);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	return executeOpenClawStateWorker(context, {
		type: "audit.events.list",
		input
	});
}
/** Delete one bounded batch during Gateway startup and periodic audit maintenance. */
function pruneExpiredAuditEventsInDatabase(params) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const deleted = deleteExpiredAuditEvents(db, params.now ?? Date.now());
		auditEventRowCounts.delete(db);
		return Number(deleted.numAffectedRows ?? 0n);
	}, params.database);
}
//#endregion
//#region src/audit/message-delivery-progress-store.ts
/** Lazy owner-native persistence for nonterminal outbound message progress. */
const OUTBOUND_MESSAGE_PROGRESS_RETENTION_MS = 2592e6;
const OUTBOUND_MESSAGE_PROGRESS_MAX_ROWS = 2e5;
const OUTBOUND_MESSAGE_PROGRESS_PRUNE_BATCH_ROWS = 1024;
const AUDIT_HMAC_REF_RE = /^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$/u;
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const progressRowCounts = /* @__PURE__ */ new WeakMap();
function progressSchemaSql() {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS outbound_message_progress (");
	const finalIndex = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE INDEX IF NOT EXISTS outbound_message_progress_run_occurred_idx", start);
	const end = finalIndex >= 0 ? OPENCLAW_STATE_SCHEMA_SQL.indexOf(";", finalIndex) : -1;
	if (start < 0 || end < 0) throw new Error("canonical outbound message progress schema is missing");
	return OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 1);
}
function progressDb(db) {
	return getNodeSqliteKysely(db);
}
function ensureProgressSchema(options) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(progressSchemaSql());
		ensureColumn(db, "outbound_message_progress", "context_id TEXT");
		ensureColumn(db, "outbound_message_progress", "execution_id TEXT");
	}, options, { operationLabel: "audit.outbound-message-progress.schema.ensure" });
	ensuredDatabases.add(database.db);
}
function projectProgressIdentities(db, input) {
	const identity = loadOrCreateAuditIdentityKey(db);
	const conversationId = input.conversationId ?? input.targetId;
	const ref = (kind, value) => pseudonymizeAuditIdentity({
		identity,
		kind,
		channel: input.channel,
		...kind !== "account" && input.accountId !== void 0 ? { accountId: input.accountId } : {},
		value
	});
	return {
		accountRef: ref("account", input.accountId),
		conversationRef: ref("conversation", conversationId),
		targetRef: ref("target", input.targetId)
	};
}
function bindProgressRow(db, input, executionBinding) {
	const refs = projectProgressIdentities(db, input);
	return {
		progress_id: randomUUID(),
		source_id: input.sourceId,
		source_sequence: input.sourceSequence,
		schema_version: 1,
		occurred_at: input.occurredAt,
		action: input.action,
		outcome: input.outcome,
		actor_type: input.actorType,
		actor_id: input.actorId,
		agent_id: input.agentId ?? null,
		run_id: input.runId ?? null,
		context_id: executionBinding?.contextId ?? null,
		execution_id: executionBinding?.executionId ?? null,
		channel: input.channel,
		conversation_kind: input.conversationKind,
		duration_ms: input.durationMs ?? null,
		account_ref: refs.accountRef ?? null,
		conversation_ref: refs.conversationRef ?? null,
		target_ref: refs.targetRef ?? null
	};
}
function requiredText(value, field) {
	if (typeof value !== "string" || value.length === 0) throw new Error(`corrupt outbound message progress row: invalid ${field}`);
	return value;
}
function optionalText(value, field) {
	if (value === null || value === void 0) return;
	return requiredText(value, field);
}
function optionalHmacRef(value, field) {
	const ref = optionalText(value, field);
	if (ref !== void 0 && !AUDIT_HMAC_REF_RE.test(ref)) throw new Error(`corrupt outbound message progress row: invalid ${field}`);
	return ref;
}
function rowToProgressEvent(row) {
	const sequence = normalizeSqliteNumber(row.sequence);
	const sourceSequence = normalizeSqliteNumber(row.source_sequence);
	const occurredAt = normalizeSqliteNumber(row.occurred_at);
	const durationMs = normalizeSqliteNumber(row.duration_ms);
	if (sequence === void 0 || sequence < 1 || sourceSequence === void 0 || sourceSequence < 1 || occurredAt === void 0 || occurredAt < 0 || row.schema_version !== 1 || durationMs !== void 0 && durationMs < 0) throw new Error("corrupt outbound message progress row: invalid numeric field");
	if (row.action === "message.outbound.queued" && row.outcome !== "queued" || row.action === "message.outbound.platform-started" && row.outcome !== "platform_started" || row.action !== "message.outbound.queued" && row.action !== "message.outbound.platform-started") throw new Error("corrupt outbound message progress row: invalid lifecycle field");
	const actorType = row.actor_type === "agent" ? "agent" : row.actor_type === "system" ? "system" : void 0;
	if (!actorType) throw new Error("corrupt outbound message progress row: invalid actor type");
	const conversationKind = row.conversation_kind === "direct" ? "direct" : row.conversation_kind === "group" ? "group" : row.conversation_kind === "channel" ? "channel" : row.conversation_kind === "unknown" ? "unknown" : void 0;
	if (!conversationKind) throw new Error("corrupt outbound message progress row: invalid conversation kind");
	const common = {
		schemaVersion: 1,
		sequence,
		eventId: requiredText(row.progress_id, "progressId"),
		sourceSequence,
		occurredAt,
		redaction: "metadata_only",
		kind: "message",
		actorType,
		actorId: requiredText(row.actor_id, "actorId"),
		...optionalText(row.agent_id, "agentId") !== void 0 ? { agentId: row.agent_id } : {},
		...optionalText(row.run_id, "runId") !== void 0 ? { runId: row.run_id } : {},
		direction: "outbound",
		channel: requiredText(row.channel, "channel"),
		conversationKind,
		...durationMs !== void 0 ? { durationMs } : {},
		resultCount: 0,
		...optionalHmacRef(row.account_ref, "accountRef") !== void 0 ? { accountRef: row.account_ref } : {},
		...optionalHmacRef(row.conversation_ref, "conversationRef") !== void 0 ? { conversationRef: row.conversation_ref } : {},
		...optionalHmacRef(row.target_ref, "targetRef") !== void 0 ? { targetRef: row.target_ref } : {}
	};
	return row.action === "message.outbound.queued" ? {
		...common,
		action: row.action,
		status: "started",
		outcome: "queued"
	} : {
		...common,
		action: row.action,
		status: "started",
		outcome: "platform_started"
	};
}
function countProgressRows(db) {
	const row = executeSqliteQueryTakeFirstSync(db, progressDb(db).selectFrom("outbound_message_progress").select((expression) => expression.fn.countAll().as("count")));
	return normalizeSqliteNumber(row?.count ?? null) ?? 0;
}
function deleteExpiredProgressRows(db, now, limit) {
	const kysely = progressDb(db);
	const expiredSequences = kysely.selectFrom("outbound_message_progress").select("sequence").where("occurred_at", "<", now - OUTBOUND_MESSAGE_PROGRESS_RETENTION_MS).orderBy("occurred_at", "asc").orderBy("sequence", "asc").limit(limit);
	return executeSqliteQuerySync(db, kysely.deleteFrom("outbound_message_progress").where("sequence", "in", expiredSequences));
}
function pruneProgressAfterInsert(db, now) {
	const kysely = progressDb(db);
	const expired = deleteExpiredProgressRows(db, now, OUTBOUND_MESSAGE_PROGRESS_PRUNE_BATCH_ROWS);
	const cachedCount = progressRowCounts.get(db);
	let rowCount = cachedCount === void 0 ? countProgressRows(db) : Math.max(0, cachedCount + 1 - Number(expired.numAffectedRows ?? 0n));
	if (rowCount <= OUTBOUND_MESSAGE_PROGRESS_MAX_ROWS) {
		progressRowCounts.set(db, rowCount);
		return;
	}
	const retainedRows = Math.max(0, 198976);
	const overflow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("outbound_message_progress").select("sequence").orderBy("sequence", "desc").offset(retainedRows).limit(1));
	const cutoff = overflow ? normalizeSqliteNumber(overflow.sequence) : void 0;
	if (cutoff !== void 0) {
		const pruned = executeSqliteQuerySync(db, kysely.deleteFrom("outbound_message_progress").where("sequence", "<=", cutoff));
		rowCount = Math.max(0, rowCount - Number(pruned.numAffectedRows ?? 0n));
	}
	progressRowCounts.set(db, rowCount);
}
/** Persist one progress fact idempotently; first use installs only this owner table. */
function recordOutboundMessageProgressInDatabase(input, options) {
	const executionToken = planMessageExecutionBinding(input.executionIdentityToken, input.runId);
	ensureProgressSchema(options);
	let cacheDatabase;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			cacheDatabase = db;
			const executionBinding = confirmMessageExecutionBinding(db, executionToken);
			const insert = executeSqliteQuerySync(db, progressDb(db).insertInto("outbound_message_progress").values(bindProgressRow(db, input, executionBinding)).onConflict((conflict) => conflict.column("source_id").doNothing()));
			if (insert.insertId === void 0) return;
			const sequence = Number(insert.insertId);
			if (!Number.isSafeInteger(sequence) || sequence < 1) throw new Error("outbound message progress sequence is outside the supported range");
			pruneProgressAfterInsert(db, Date.now());
			const row = executeSqliteQueryTakeFirstSync(db, progressDb(db).selectFrom("outbound_message_progress").selectAll().where("sequence", "=", sequence));
			return row ? rowToProgressEvent(row) : void 0;
		}, options);
	} catch (error) {
		if (cacheDatabase) {
			progressRowCounts.delete(cacheDatabase);
			clearAuditIdentityKeyCacheForDatabase(cacheDatabase);
		}
		throw error;
	}
}
/** Prune existing progress without creating its lazy table. */
function pruneExpiredOutboundMessageProgressInDatabase(params) {
	const database = openOpenClawStateDatabase(params.database);
	if (!tableExists(database.db, "outbound_message_progress")) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const deleted = deleteExpiredProgressRows(db, params.now ?? Date.now(), OUTBOUND_MESSAGE_PROGRESS_PRUNE_BATCH_ROWS);
		progressRowCounts.delete(db);
		return Number(deleted.numAffectedRows ?? 0n);
	}, params.database);
}
//#endregion
//#region src/audit/execution-decision-receipts.ts
var ExecutionDecisionCursorError = class extends Error {
	constructor(message = "invalid execution decision cursor") {
		super(message);
		this.name = "ExecutionDecisionCursorError";
	}
};
function parseDecisionCursor(value) {
	if (value === void 0) return;
	const offset = parsePositiveAuditCursor(value);
	if (offset !== null && offset !== void 0) return { offset };
	const match = /^([amgctf]):(0|[1-9]\d*):(0|[1-9]\d*)$/.exec(value);
	if (!match) return null;
	const occurredAt = Number(match[2]);
	const rowId = Number(match[3]);
	if (!Number.isSafeInteger(occurredAt) || !Number.isSafeInteger(rowId)) return null;
	return {
		stage: match[1] === "a" ? "approval" : match[1] === "m" ? "message" : match[1] === "g" ? "generic" : match[1] === "c" ? "cron" : match[1] === "t" ? "task" : "flow",
		...occurredAt === 0 && rowId === 0 ? {} : { after: {
			occurredAt,
			rowId
		} }
	};
}
function isExecutionDecisionCursor(value) {
	return parseDecisionCursor(value) !== null;
}
//#endregion
//#region src/audit/execution-identity-context-build.ts
const EXECUTION_IDENTITY_CONTEXT_MAX_BYTES$1 = 16384;
function ensureBoundedExecutionIdentityRef(value, label, maxLength = 256) {
	if (!value || value.length > maxLength) throw new Error(`${label} must be between 1 and ${String(maxLength)} characters`);
	return value;
}
function ensureRawRef(value, label) {
	return ensureBoundedExecutionIdentityRef(value, label, 4096);
}
function freezeExecutionIdentityContext(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object" || seen.has(value)) return value;
	seen.add(value);
	for (const nested of Object.values(value)) freezeExecutionIdentityContext(nested, seen);
	return Object.freeze(value);
}
function hmacRef(db, kind, scope, value) {
	return pseudonymizeExecutionIdentityRef({
		db,
		kind,
		scope: ensureBoundedExecutionIdentityRef(scope, "HMAC scope"),
		value: ensureRawRef(value, "HMAC value")
	});
}
function buildExecutionIdentityContext(db, envelope, fixed) {
	const runId = ensureBoundedExecutionIdentityRef(envelope.runId, "run id");
	const executionId = ensureBoundedExecutionIdentityRef(envelope.executionId, "execution id");
	const agentId = ensureBoundedExecutionIdentityRef(envelope.agentId, "agent id");
	const contextId = ensureBoundedExecutionIdentityRef(fixed.contextId, "context id");
	const domainRef = hmacRef(db, "domain", "gateway-cell", "gateway-cell");
	const runtimeRef = hmacRef(db, "runtime", domainRef, ensureRawRef(envelope.runtimeInstanceId, "runtime instance id"));
	const invoker = envelope.invoker?.state === "present" ? {
		state: "present",
		principal: {
			kind: envelope.invoker.kind,
			domainRef,
			principalRef: hmacRef(db, "principal", `${domainRef}:${envelope.invoker.kind}`, envelope.invoker.rawPrincipalRef),
			...envelope.invoker.displayLabel !== void 0 ? { displayLabel: envelope.invoker.displayLabel } : {}
		}
	} : envelope.invoker?.state === "unknown" ? { state: "unknown" } : { state: "absent" };
	const assurance = sortUniqueExecutionIdentityEntries(envelope.assurance.map((item) => ({
		kind: item.kind,
		evidenceRef: hmacRef(db, "evidence", `${domainRef}:${item.kind}`, item.rawEvidenceRef),
		strength: item.strength
	})), (item) => `${item.kind}\0${item.evidenceRef}\0${item.strength}`);
	const applicableGrants = sortUniqueExecutionIdentityEntries(envelope.applicableGrants.map((grant) => ({
		grantRef: hmacRef(db, "grant", domainRef, grant.rawGrantRef),
		state: grant.state
	})), (grant) => `${grant.grantRef}\0${grant.state}`);
	const serializedSpawnFacts = executionIdentitySpawnAdmission({
		operation: "read",
		value: envelope
	});
	const [lineageFacts, spawnMissingEvidence] = serializedSpawnFacts ? executionIdentitySpawnAdmission({
		operation: "parse",
		value: serializedSpawnFacts
	}) : [void 0, []];
	const lineage = lineageFacts ? {
		...typeof lineageFacts.parentContextId === "string" ? { parentContextId: lineageFacts.parentContextId } : {},
		...typeof lineageFacts.parentExecutionId === "string" ? { parentExecutionId: lineageFacts.parentExecutionId } : {},
		...typeof lineageFacts.parentRunId === "string" ? { parentRunId: lineageFacts.parentRunId } : {},
		parentAgentPrincipal: {
			kind: "agent",
			domainRef,
			principalRef: lineageFacts.parentAgentId
		},
		delegationRef: hmacRef(db, "grant", `${domainRef}:delegation`, JSON.stringify([
			lineageFacts.relation,
			lineageFacts.rawRequesterRef,
			lineageFacts.rawControllerRef,
			lineageFacts.localPolicyRefs,
			lineageFacts.targetPolicyRefs
		])),
		depth: lineageFacts.depth
	} : void 0;
	const missingEvidence = sortUniqueExecutionIdentityEntries([...envelope.invoker?.state === "present" ? [] : ["invoker.principal"], ...spawnMissingEvidence], (item) => item);
	const context = {
		schemaVersion: 1,
		contextId,
		executionId,
		runId,
		createdAt: fixed.createdAt,
		trustDomain: {
			kind: "gateway-cell",
			domainRef,
			state: "present"
		},
		invoker,
		ingress: {
			kind: envelope.ingress.kind,
			boundary: ensureBoundedExecutionIdentityRef(envelope.ingress.boundary, "ingress boundary"),
			state: envelope.ingress.state,
			...envelope.ingress.rawSourceRef ? { sourceRef: hmacRef(db, "principal", `${domainRef}:ingress:${envelope.ingress.kind}`, envelope.ingress.rawSourceRef) } : {}
		},
		agentPrincipal: {
			kind: "agent",
			domainRef,
			principalRef: agentId
		},
		agentDefinition: {
			definitionRef: agentId,
			state: "present"
		},
		runtimeInstance: {
			runtimeRef,
			kind: envelope.runtime.kind,
			state: "present"
		},
		applicableGrants,
		assurance,
		...lineage ? { lineage } : {},
		coverageState: lineage ? "attribution-only" : envelope.invoker?.state === "present" ? "attribution-only" : envelope.invoker?.state === "unknown" ? "unknown" : "unattributed",
		missingEvidence
	};
	if (!validateExecutionIdentityContextV1(context)) throw new Error("prepared execution identity context violates the V1 contract");
	const encoded = JSON.stringify(context);
	if (Buffer.byteLength(encoded, "utf8") > EXECUTION_IDENTITY_CONTEXT_MAX_BYTES$1) throw new Error("prepared execution identity context exceeds 16 KiB");
	return freezeExecutionIdentityContext(context);
}
//#endregion
//#region src/audit/execution-identity-context.ts
const EXECUTION_IDENTITY_CONTEXT_MAX_BYTES = 16384;
const EXECUTION_IDENTITY_CONTEXT_RETENTION_MS = 2592e6;
const EXECUTION_IDENTITY_CONTEXT_MAX_ROWS = 1e5;
const EXECUTION_IDENTITY_CONTEXT_PRUNE_BATCH_ROWS = 1024;
const EXECUTION_IDENTITY_HMAC_REF_RE = /^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$/u;
const ensureExecutionIdentityContextSchema = createOpenClawStateSchemaEnsurer({
	table: "execution_identity_contexts",
	endMarker: "  ON execution_identity_contexts (run_id, created_at, execution_id);\n",
	operationLabel: "audit.execution-identity.schema.ensure"
});
function executionIdentityDb(db) {
	return getNodeSqliteKysely(db);
}
function parseExecutionIdentityRow(row) {
	if (typeof row.context_json !== "string" || Buffer.byteLength(row.context_json, "utf8") !== normalizeSqliteNumber(row.context_bytes) || Buffer.byteLength(row.context_json, "utf8") > EXECUTION_IDENTITY_CONTEXT_MAX_BYTES) throw new Error("invalid context payload bounds");
	const parsed = JSON.parse(row.context_json);
	if (!validateExecutionIdentityContextV1(parsed)) throw new Error("invalid context payload schema");
	if (parsed.contextId !== row.context_id || parsed.executionId !== row.execution_id || parsed.runId !== row.run_id || parsed.createdAt !== normalizeSqliteNumber(row.created_at) || parsed.coverageState !== row.coverage_state || JSON.stringify(parsed) !== row.context_json || !EXECUTION_IDENTITY_HMAC_REF_RE.test(parsed.trustDomain.domainRef) || !EXECUTION_IDENTITY_HMAC_REF_RE.test(parsed.runtimeInstance.runtimeRef)) throw new Error("context payload disagrees with indexed columns");
	return freezeExecutionIdentityContext(parsed);
}
function readRowByExecutionId(db, executionId) {
	return executeSqliteQueryTakeFirstSync(db, executionIdentityDb(db).selectFrom("execution_identity_contexts").selectAll().where("execution_id", "=", executionId));
}
function deleteExpiredExecutionIdentityContexts(db, now, limit) {
	const kysely = executionIdentityDb(db);
	const expiredIds = kysely.selectFrom("execution_identity_contexts").select("context_id").where("created_at", "<", now - EXECUTION_IDENTITY_CONTEXT_RETENTION_MS).orderBy("created_at", "asc").orderBy("context_id", "asc").limit(limit);
	return executeSqliteQuerySync(db, kysely.deleteFrom("execution_identity_contexts").where("context_id", "in", expiredIds));
}
function pruneExecutionIdentityContextsAfterInsert(db, now, limits) {
	const kysely = executionIdentityDb(db);
	const expired = deleteExpiredExecutionIdentityContexts(db, now, limits.pruneBatchRows);
	const expiredCount = Number(expired.numAffectedRows ?? 0n);
	const remainingPruneBudget = Math.max(0, limits.pruneBatchRows - expiredCount);
	if (remainingPruneBudget > 0) {
		const retainedIds = kysely.selectFrom("execution_identity_contexts").select("context_id").orderBy("created_at", "desc").orderBy("context_id", "desc").limit(limits.maxRows);
		const oldestOverflowIds = kysely.selectFrom("execution_identity_contexts").select("context_id").where("context_id", "not in", retainedIds).orderBy("created_at", "asc").orderBy("context_id", "asc").limit(remainingPruneBudget);
		executeSqliteQuerySync(db, kysely.deleteFrom("execution_identity_contexts").where("context_id", "in", oldestOverflowIds));
	}
}
/** Delete one bounded batch during the existing audit startup/hourly maintenance tick. */
function pruneExpiredExecutionIdentityContextsInDatabase(params) {
	const databaseOptions = params.database;
	const database = openOpenClawStateDatabase(databaseOptions);
	if (!tableExists(database.db, "execution_identity_contexts")) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const deleted = deleteExpiredExecutionIdentityContexts(db, params.now ?? Date.now(), EXECUTION_IDENTITY_CONTEXT_PRUNE_BATCH_ROWS);
		return Number(deleted.numAffectedRows ?? 0n);
	}, {
		...databaseOptions,
		database
	}, { operationLabel: "audit.execution-identity.context.maintenance" });
}
/** Worker-owned canonicalization and persistence for one accepted admission envelope. */
function persistExecutionIdentityAdmissionEnvelope(input, options = {}) {
	const envelope = parseExecutionIdentityAdmissionEnvelope(input);
	ensureExecutionIdentityContextSchema(options);
	const executionId = envelope.executionId;
	const plannedContext = buildExecutionIdentityContext(openOpenClawStateDatabase(options).db, envelope, {
		contextId: envelope.contextId,
		createdAt: envelope.createdAt
	});
	const plannedContextJson = JSON.stringify(plannedContext);
	let transactionDatabase;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			transactionDatabase = db;
			const existing = readRowByExecutionId(db, executionId);
			if (existing) {
				const context = parseExecutionIdentityRow(existing);
				if (plannedContextJson !== existing.context_json) throw new Error("execution identity context conflict for execution");
				return context;
			}
			executeSqliteQuerySync(db, executionIdentityDb(db).insertInto("execution_identity_contexts").values({
				context_id: plannedContext.contextId,
				execution_id: plannedContext.executionId,
				run_id: plannedContext.runId,
				created_at: plannedContext.createdAt,
				coverage_state: plannedContext.coverageState,
				context_bytes: Buffer.byteLength(plannedContextJson, "utf8"),
				context_json: plannedContextJson
			}));
			pruneExecutionIdentityContextsAfterInsert(db, options.now ?? Date.now(), options.limits ?? {
				maxRows: EXECUTION_IDENTITY_CONTEXT_MAX_ROWS,
				pruneBatchRows: EXECUTION_IDENTITY_CONTEXT_PRUNE_BATCH_ROWS
			});
			return plannedContext;
		}, options, { operationLabel: "audit.execution-identity.context.record" });
	} catch (error) {
		if (transactionDatabase) clearAuditIdentityKeyCacheForDatabase(transactionDatabase);
		throw error;
	}
}
/** A durable recovery retry may only confirm the originally captured execution. */
function verifyExecutionIdentityAdmissionRetry(token, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	if (!tableExists(db, "execution_identity_contexts")) throw new Error("execution identity recovery evidence unavailable");
	const existing = readRowByExecutionId(db, token.executionId);
	if (!existing) throw new Error("execution identity recovery evidence unavailable");
	const context = parseExecutionIdentityRow(existing);
	if (context.contextId !== token.contextId || context.executionId !== token.executionId || context.runId !== token.runId || context.createdAt !== token.createdAt) throw new Error("execution identity context conflict for execution");
	return context;
}
/** Worker-owned persistence/verification for one accepted bounded queue item. */
function processExecutionIdentityAdmissionWorkInDatabase(input, options) {
	const work = parseExecutionIdentityAdmissionWork(input);
	return work.kind === "capture" ? persistExecutionIdentityAdmissionEnvelope(work.envelope, options) : verifyExecutionIdentityAdmissionRetry(work.token, options);
}
function unavailableResult(params) {
	return {
		schemaVersion: 1,
		run: "executionId" in params.selector ? {
			executionId: params.selector.executionId,
			...params.resolvedRunId ? { runId: params.resolvedRunId } : {},
			status: params.runStatus
		} : {
			runId: params.resolvedRunId ?? params.selector.runId,
			status: params.runStatus
		},
		identity: {
			state: params.state,
			reasonCode: params.reasonCode,
			missingEvidence: params.missingEvidence,
			remediation: params.remediation
		},
		decisions: [],
		decisionDisplays: [],
		coverage: {
			state: params.state,
			missingEvidence: params.missingEvidence
		}
	};
}
function missingInspectionResult(selector) {
	if ("executionId" in selector) return unavailableResult({
		selector,
		runStatus: "unknown",
		state: "unknown",
		reasonCode: "execution_not_found",
		missingEvidence: ["identity.context"],
		remediation: [{
			code: "verify_execution_id",
			text: "Verify the exact execution id; absence of best-effort identity evidence is not proof that no run occurred."
		}]
	});
	const runId = selector.runId;
	return unavailableResult({
		selector: { runId },
		runStatus: "unknown",
		state: "unknown",
		reasonCode: "run_not_found",
		missingEvidence: ["run.record", "identity.context"],
		remediation: [{
			code: "verify_run_id",
			text: "Verify the run id; absence of best-effort audit activity is not proof of no run."
		}]
	});
}
/** Inspect one exact execution or discover bounded executions without host SQLite. */
async function inspectExecutionIdentityRun(params, options = {}) {
	const input = {
		...params,
		now: options.now ?? Date.now()
	};
	if ("executionId" in input) ensureBoundedExecutionIdentityRef(input.executionId, "execution id");
	else ensureBoundedExecutionIdentityRef(input.runId, "run id");
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "audit.run.inspect",
		input
	});
	if (!reply) return missingInspectionResult(input);
	if (!reply.ok || reply.type !== "audit.run.inspect") throw new Error("Unexpected audit run inspection result");
	if (reply.result.status === "invalid-cursor") throw new ExecutionDecisionCursorError(reply.result.message);
	const inspection = reply.result.inspection;
	if (inspection.identity.state === "present") freezeExecutionIdentityContext(inspection.identity.context);
	return inspection;
}
//#endregion
export { isExecutionDecisionCursor as a, AUDIT_EVENT_RETENTION_MS as c, recordAuditEventInDatabase as d, rowToAuditEvent as f, ExecutionDecisionCursorError as i, listAuditEvents as l, processExecutionIdentityAdmissionWorkInDatabase as n, pruneExpiredOutboundMessageProgressInDatabase as o, isOutboundMessageProgressInput as p, pruneExpiredExecutionIdentityContextsInDatabase as r, recordOutboundMessageProgressInDatabase as s, inspectExecutionIdentityRun as t, pruneExpiredAuditEventsInDatabase as u };
