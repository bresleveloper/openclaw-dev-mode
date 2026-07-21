import { t as listAuditEvents } from "./audit-event-store-2NJ7FlT1.js";
import { _ as validateAuditListParams, t as formatValidationErrors } from "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
//#region src/gateway/server-methods/audit.ts
const DEFAULT_AUDIT_LIST_LIMIT = 100;
const MAX_AUDIT_LIST_LIMIT = 500;
function parseAuditCursor(cursor) {
	if (cursor === void 0) return;
	if (!/^\d+$/.test(cursor)) return null;
	const parsed = Number(cursor);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}
function mapAuditEvent(event) {
	return {
		eventId: event.eventId,
		sequence: event.sequence,
		sourceSequence: event.sourceSequence,
		occurredAt: event.occurredAt,
		kind: event.kind,
		action: event.action,
		status: event.status,
		...event.errorCode ? { errorCode: event.errorCode } : {},
		actor: {
			type: event.actorType,
			id: event.actorId
		},
		agentId: event.agentId,
		...event.sessionKey ? { sessionKey: event.sessionKey } : {},
		...event.sessionId ? { sessionId: event.sessionId } : {},
		runId: event.runId,
		...event.toolCallId ? { toolCallId: event.toolCallId } : {},
		...event.toolName ? { toolName: event.toolName } : {},
		redaction: "metadata_only"
	};
}
const auditHandlers = { "audit.list": ({ params, respond }) => {
	if (!validateAuditListParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid audit.list params: ${formatValidationErrors(validateAuditListParams.errors)}`));
		return;
	}
	const cursor = parseAuditCursor(params.cursor);
	if (cursor === null || params.after !== void 0 && params.before !== void 0 && params.after > params.before) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.list range or cursor"));
		return;
	}
	const page = listAuditEvents({
		limit: Math.min(params.limit ?? DEFAULT_AUDIT_LIST_LIMIT, MAX_AUDIT_LIST_LIMIT),
		...cursor !== void 0 ? { cursor } : {},
		filters: {
			...params.agentId ? { agentId: params.agentId } : {},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.runId ? { runId: params.runId } : {},
			...params.kind ? { kind: params.kind } : {},
			...params.status ? { status: params.status } : {},
			...params.after !== void 0 ? { after: params.after } : {},
			...params.before !== void 0 ? { before: params.before } : {}
		}
	});
	respond(true, {
		events: page.events.map(mapAuditEvent),
		...page.nextCursor !== void 0 ? { nextCursor: String(page.nextCursor) } : {}
	});
} };
const testApi = {
	mapAuditEvent,
	parseAuditCursor
};
//#endregion
export { auditHandlers, testApi };
