import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { b as validateAuditListParams, x as validateAuditRunInspectParams, y as validateAuditActivityListParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { f as findAuditActivityFilterConflict } from "./audit-activity-YfkV8ffO.mjs";
import { t as parsePositiveAuditCursor } from "./audit-cursor-x-Oiyo9y.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { a as isExecutionDecisionCursor, i as ExecutionDecisionCursorError, l as listAuditEvents, t as inspectExecutionIdentityRun } from "./execution-identity-context-DECY7Bc9.mjs";
//#region src/gateway/server-methods/audit.ts
const DEFAULT_AUDIT_LIST_LIMIT = 100;
const MAX_AUDIT_LIST_LIMIT = 500;
function serializeAuditRunInspectResult(inspected) {
	const result = {
		schemaVersion: inspected.schemaVersion,
		run: inspected.run,
		identity: inspected.identity,
		decisionDisplays: inspected.decisionDisplays,
		coverage: inspected.coverage
	};
	if (inspected.nextDecisionCursor !== void 0) result.nextDecisionCursor = inspected.nextDecisionCursor;
	if (inspected.nextExecutionCursor !== void 0) result.nextExecutionCursor = inspected.nextExecutionCursor;
	return result;
}
function isOwnerDecisionCursor(value) {
	return parsePositiveAuditCursor(value) === null && isExecutionDecisionCursor(value);
}
/** Preserve the shipped audit.list result shape for run/tool-only clients. */
function mapLegacyAuditEvent(event) {
	const { schemaVersion: _schemaVersion, actorType, actorId, ...legacyEvent } = event;
	return {
		...legacyEvent,
		actor: {
			type: actorType,
			id: actorId
		}
	};
}
function mapAuditActivityEvent(event) {
	if (event.kind === "agent_run") {
		const { actorType, actorId, ...activity } = event;
		return {
			...activity,
			eventType: "agent_run",
			actor: {
				type: actorType,
				id: actorId
			}
		};
	}
	if (event.kind === "tool_action") {
		const { actorType, actorId, ...activity } = event;
		return {
			...activity,
			eventType: "tool_action",
			actor: {
				type: actorType,
				id: actorId
			}
		};
	}
	if (event.direction === "inbound") {
		const { actorType, actorId, ...activity } = event;
		const actor = actorType === "channel_sender" ? {
			type: "channel_sender",
			id: actorId
		} : {
			type: "system",
			id: actorId
		};
		return {
			...activity,
			eventType: "inbound_message",
			actor
		};
	}
	if (event.action !== "message.outbound.finished") throw new Error("nonterminal outbound messages are not audit activity records");
	const { actorType, actorId, ...activity } = event;
	return {
		...activity,
		eventType: "outbound_message",
		actor: {
			type: actorType,
			id: actorId
		}
	};
}
function invalidRangeOrCursor(params) {
	const cursor = parsePositiveAuditCursor(params.cursor);
	return {
		...cursor !== void 0 && cursor !== null ? { cursor } : {},
		invalid: cursor === null || params.after !== void 0 && params.before !== void 0 && params.after > params.before
	};
}
const auditHandlers = {
	"audit.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validateAuditListParams, "audit.list", respond)) return;
		const parsed = invalidRangeOrCursor(params);
		if (parsed.invalid) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.list range or cursor"));
			return;
		}
		const agentId = normalizeOptionalString(params.agentId);
		const sessionKey = normalizeOptionalString(params.sessionKey);
		const runId = normalizeOptionalString(params.runId);
		const page = await listAuditEvents({
			limit: Math.min(params.limit ?? DEFAULT_AUDIT_LIST_LIMIT, MAX_AUDIT_LIST_LIMIT),
			...parsed.cursor !== void 0 ? { cursor: parsed.cursor } : {},
			filters: {
				...agentId ? { agentId } : {},
				...sessionKey ? { sessionKey } : {},
				...runId ? { runId } : {},
				...params.kind ? { kind: params.kind } : {},
				...params.status ? { status: params.status } : {},
				...params.after !== void 0 ? { after: params.after } : {},
				...params.before !== void 0 ? { before: params.before } : {}
			}
		});
		respond(true, {
			events: page.events.map((event) => {
				if (event.kind === "message") throw new Error("legacy audit.list cannot project message records");
				return mapLegacyAuditEvent(event);
			}),
			...page.nextCursor !== void 0 ? { nextCursor: String(page.nextCursor) } : {}
		});
	},
	"audit.activity.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validateAuditActivityListParams, "audit.activity.list", respond)) return;
		const filterConflict = findAuditActivityFilterConflict(params);
		if (filterConflict) {
			const detail = filterConflict.type === "kind" ? `${filterConflict.field} only applies to kind ${filterConflict.supportedKinds.join(" or ")}` : `${filterConflict.field} cannot be combined with ${filterConflict.conflictingField}`;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid audit.activity.list filters: ${detail}`));
			return;
		}
		const parsed = invalidRangeOrCursor(params);
		if (parsed.invalid) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.activity.list range or cursor"));
			return;
		}
		const agentId = normalizeOptionalString(params.agentId);
		const sessionKey = normalizeOptionalString(params.sessionKey);
		const runId = normalizeOptionalString(params.runId);
		const page = await listAuditEvents({
			limit: Math.min(params.limit ?? DEFAULT_AUDIT_LIST_LIMIT, MAX_AUDIT_LIST_LIMIT),
			...parsed.cursor !== void 0 ? { cursor: parsed.cursor } : {},
			filters: {
				includeMessages: true,
				...agentId ? { agentId } : {},
				...sessionKey ? { sessionKey } : {},
				...runId ? { runId } : {},
				...params.kind ? { kind: params.kind } : {},
				...params.status ? { status: params.status } : {},
				...params.direction ? { direction: params.direction } : {},
				...params.channel ? { channel: params.channel } : {},
				...params.after !== void 0 ? { after: params.after } : {},
				...params.before !== void 0 ? { before: params.before } : {}
			}
		});
		respond(true, {
			events: page.events.map(mapAuditActivityEvent),
			...page.nextCursor !== void 0 ? { nextCursor: String(page.nextCursor) } : {}
		});
	},
	"audit.run.inspect": async ({ params, respond }) => {
		if (!assertValidParams(params, validateAuditRunInspectParams, "audit.run.inspect", respond)) return;
		const decisionCursor = params.decisionCursor;
		const executionOffset = typeof params.runId !== "string" || params.executionCursor === decisionCursor && decisionCursor !== void 0 && isOwnerDecisionCursor(decisionCursor) ? void 0 : parsePositiveAuditCursor(params.executionCursor);
		if (decisionCursor !== void 0 && !isExecutionDecisionCursor(decisionCursor) || executionOffset === null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.run.inspect cursor"));
			return;
		}
		try {
			respond(true, serializeAuditRunInspectResult(await inspectExecutionIdentityRun({
				...typeof params.runId === "string" ? {
					runId: params.runId,
					...executionOffset !== void 0 ? { executionOffset } : {},
					executionLimit: params.executionLimit ?? 50
				} : { executionId: params.executionId },
				...decisionCursor !== void 0 ? { decisionCursor } : {},
				decisionLimit: params.decisionLimit ?? 50
			})));
		} catch (error) {
			if (error instanceof ExecutionDecisionCursorError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			throw error;
		}
	}
};
//#endregion
export { auditHandlers };
