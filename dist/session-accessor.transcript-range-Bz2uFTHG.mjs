import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { n as assertSqliteJsonlReadBudget, t as SqliteJsonlReadBudgetExceededError } from "./sqlite-jsonl-budget-xL35jxX5.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.transcript-range.ts
function anchorsShareTarget(boundary) {
	const { admission, terminal } = boundary;
	return admission.agentId === terminal.agentId && admission.sessionId === terminal.sessionId && admission.sessionKey === terminal.sessionKey && admission.storePath === terminal.storePath && admission.generation === terminal.generation;
}
function validateAnchorRow(anchor, row) {
	return Boolean(row && row.generation === anchor.generation && row.seq === anchor.rawSeq && row.parent_id === anchor.effectiveParentId && row.message_position === anchor.activeMessagePosition);
}
function validateTerminalAncestry(params) {
	if (params.terminalEntryId === params.admissionEntryId) return "descendant";
	if (!(params.maxDepth > 0)) return "too-large";
	if (params.terminalParentId === params.admissionEntryId) return "descendant";
	if (params.terminalParentId === null || params.terminalParentId === params.terminalEntryId) return "non-descendant";
	const db = getSessionKysely(params.database);
	const depthLimit = Math.ceil(params.maxDepth);
	const admissionIsSqlText = toUSVString(params.admissionEntryId) === params.admissionEntryId;
	const terminalIsSqlText = toUSVString(params.terminalEntryId) === params.terminalEntryId;
	const ancestry = executeSqliteQueryTakeFirstSync(params.database, db.withRecursive("turn_ancestors", (query) => query.selectFrom("transcript_event_identities").select(["event_id", "parent_id"]).where("session_id", "=", params.sessionId).where("event_id", "=", params.terminalParentId).union(query.selectFrom("transcript_event_identities as identity").innerJoin("turn_ancestors as previous", "identity.event_id", "previous.parent_id").select(["identity.event_id", "identity.parent_id"]).where("identity.session_id", "=", params.sessionId).$if(admissionIsSqlText, (ancestors) => ancestors.where("previous.parent_id", "!=", params.admissionEntryId)).$if(terminalIsSqlText, (ancestors) => ancestors.where("identity.event_id", "!=", params.terminalEntryId))).limit(Number.isSafeInteger(depthLimit) ? depthLimit : -1)).selectFrom("turn_ancestors").select((eb) => [eb.fn.countAll().as("depth"), eb.fn.max(eb.case().when(eb.and([eb.val(admissionIsSqlText ? 1 : 0), eb("parent_id", "=", params.admissionEntryId)])).then(1).else(0).end()).as("found")]));
	if (ancestry.depth >= depthLimit) return "too-large";
	return ancestry.found === 1 ? "descendant" : "non-descendant";
}
/** Reads a closed turn through the caller's connection, such as an agent database worker's. */
function readClosedTranscriptTurnInDatabase(connection, params) {
	if (!anchorsShareTarget(params.boundary)) return { kind: "session-rebound" };
	const target = params.boundary.admission;
	return runSqliteDeferredTransactionSync(connection, () => {
		const db = getSessionKysely(connection);
		if (!executeSqliteQueryTakeFirstSync(connection, db.selectFrom("session_windows").select(["session_id"]).where("session_id", "=", target.sessionId).where("session_key", "=", target.sessionKey).limit(1))) return { kind: "session-rebound" };
		const frontier = executeSqliteQueryTakeFirstSync(connection, db.selectFrom("transcript_events").select("seq").where("session_id", "=", target.sessionId).orderBy("seq", "desc").limit(1))?.seq;
		const projection = executeSqliteQueryTakeFirstSync(connection, db.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", target.sessionId));
		if (frontier === void 0 || !projection || projection.needs_rebuild !== 0 || projection.indexed_seq !== frontier) return { kind: "projection-unavailable" };
		const readAnchor = (anchor) => executeSqliteQueryTakeFirstSync(connection, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
			"identity.seq",
			"identity.parent_id",
			"active.message_position",
			"rewrite.generation",
			transcriptEventNavigationSql("event").as("event_json")
		]).where("identity.session_id", "=", target.sessionId).where("identity.event_id", "=", anchor.entryId).limit(1));
		const admissionRow = readAnchor(params.boundary.admission);
		const terminalRow = readAnchor(params.boundary.terminal);
		if (!validateAnchorRow(params.boundary.admission, admissionRow) || !validateAnchorRow(params.boundary.terminal, terminalRow)) return { kind: "stale" };
		const admissionEvent = JSON.parse(admissionRow.event_json);
		if (admissionEvent.type !== "message" || admissionEvent.message?.role !== "user") return { kind: "stale" };
		const ancestry = validateTerminalAncestry({
			database: connection,
			sessionId: target.sessionId,
			admissionEntryId: params.boundary.admission.entryId,
			terminalEntryId: params.boundary.terminal.entryId,
			terminalParentId: terminalRow.parent_id,
			maxDepth: params.maxEvents
		});
		if (ancestry !== "descendant") return { kind: ancestry };
		const selected = db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).where("active.session_id", "=", target.sessionId).where("active.message_position", "is not", null).where("active.message_position", ">=", params.boundary.admission.activeMessagePosition).where("active.message_position", "<=", params.boundary.terminal.activeMessagePosition).orderBy("active.message_position", "asc");
		try {
			assertSqliteJsonlReadBudget(connection, selected.clearOrderBy().select(["event.event_json", "event.event_utf8_bytes"]).as("events"), params.maxBytes, "Closed transcript turn", {
				hasExactUtf8Bytes: true,
				separatorBytes: 0,
				maxRows: params.maxEvents
			});
		} catch (error) {
			if (error instanceof SqliteJsonlReadBudgetExceededError) return { kind: "too-large" };
			throw error;
		}
		return {
			kind: "ok",
			messages: executeSqliteQuerySync(connection, selected.select(transcriptEventJsonSql(connection, "event").as("event_json"))).rows.flatMap((row) => {
				const event = JSON.parse(row.event_json);
				return event.type === "message" && event.message ? [event.message] : [];
			})
		};
	}, {
		databaseLabel: target.storePath,
		operationLabel: "session transcript accepted turn read"
	});
}
//#endregion
export { readClosedTranscriptTurnInDatabase as t };
