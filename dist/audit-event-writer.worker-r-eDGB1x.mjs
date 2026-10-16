import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { s as isOpenClawStateWriteContentionError } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { u as runWithOpenClawStateBusyTimeout } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as recordExecutionDecisionFactInDatabase, t as pruneExpiredExecutionDecisionFactsInDatabase } from "./execution-decision-facts-BO5WYpxs.mjs";
import { r as processExecutionDecisionWorkInDatabase } from "./execution-decision-work-CnVx5C7h.mjs";
import { c as AUDIT_EVENT_RETENTION_MS, d as recordAuditEventInDatabase, f as rowToAuditEvent, n as processExecutionIdentityAdmissionWorkInDatabase, o as pruneExpiredOutboundMessageProgressInDatabase, p as isOutboundMessageProgressInput, r as pruneExpiredExecutionIdentityContextsInDatabase, s as recordOutboundMessageProgressInDatabase, u as pruneExpiredAuditEventsInDatabase } from "./execution-identity-context-BMnD7IG8.mjs";
import { n as formatAuditWriterRequestError, t as formatAuditWriterError } from "./audit-event-writer.errors-B2PwjE03.mjs";
//#region src/audit/audit-event-read.kernel.ts
/** Connection-bound query kernel; production list reads execute only in the state worker. */
function listAuditEventsInDatabase(db, params) {
	const filters = params.filters ?? {};
	const retainedAfter = params.now - AUDIT_EVENT_RETENTION_MS;
	let query = getNodeSqliteKysely(db).selectFrom("audit_events").selectAll().where("occurred_at", ">=", retainedAfter).where("action", "not in", ["message.outbound.queued", "message.outbound.platform-started"]);
	if (params.cursor !== void 0) query = query.where("sequence", "<", params.cursor);
	if (filters.agentId) query = query.where("agent_id", "=", filters.agentId);
	if (filters.sessionKey) query = query.where("session_key", "=", filters.sessionKey);
	if (filters.runId) query = query.where("run_id", "=", filters.runId);
	if (filters.kind) query = query.where("kind", "=", filters.kind);
	else if (filters.includeMessages !== true) query = query.where("kind", "!=", "message");
	if (filters.status) query = query.where("status", "=", filters.status);
	if (filters.direction) query = query.where("direction", "=", filters.direction);
	if (filters.channel) query = query.where("channel", "=", filters.channel);
	if (filters.after !== void 0) query = query.where("occurred_at", ">=", filters.after);
	if (filters.before !== void 0) query = query.where("occurred_at", "<=", filters.before);
	const rows = executeSqliteQuerySync(db, query.orderBy("sequence", "desc").limit(params.limit + 1)).rows;
	const hasMore = rows.length > params.limit;
	const events = (hasMore ? rows.slice(0, params.limit) : rows).map(rowToAuditEvent);
	return {
		events,
		...hasMore && events.length > 0 ? { nextCursor: events[events.length - 1]?.sequence } : {}
	};
}
//#endregion
//#region src/audit/audit-event-writer.worker.ts
function executeAuditAttempt({ stateOptions, open }, execute, formatError) {
	const options = stateOptions();
	try {
		return runWithOpenClawStateBusyTimeout(() => execute({
			...options,
			database: open()
		}), options, 0);
	} catch (error) {
		if (isOpenClawStateWriteContentionError(error)) return { status: "retry" };
		return {
			status: "settled",
			error: formatError(error)
		};
	}
}
const auditOperations = {
	"audit.events.list": (input, { open }) => listAuditEventsInDatabase(open().db, input),
	"audit.writer.prune": (input, context) => executeAuditAttempt(context, (database) => {
		const maintenance = {
			events: pruneExpiredAuditEventsInDatabase,
			identity: pruneExpiredExecutionIdentityContextsInDatabase,
			decisions: pruneExpiredExecutionDecisionFactsInDatabase,
			progress: pruneExpiredOutboundMessageProgressInDatabase
		}[input];
		return {
			status: "settled",
			deleted: maintenance({ database })
		};
	}, formatAuditWriterError),
	"audit.writer.process": (request, context) => executeAuditAttempt(context, (database) => {
		if (request.type === "record-event") {
			if (isOutboundMessageProgressInput(request.input)) recordOutboundMessageProgressInDatabase(request.input, database);
			else recordAuditEventInDatabase(request.input, database);
		} else if (request.type === "record-execution-identity") processExecutionIdentityAdmissionWorkInDatabase(request.work, database);
		else if (request.type === "record-execution-decision-work") processExecutionDecisionWorkInDatabase(request.work, database);
		else recordExecutionDecisionFactInDatabase(request.receipt, database);
		return { status: "settled" };
	}, (error) => formatAuditWriterRequestError(request, error))
};
//#endregion
export { auditOperations };
