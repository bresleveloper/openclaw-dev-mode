import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { b as findSessionTranscriptHeader, h as projectSessionTranscriptReportFacts, m as decodeSessionTranscriptReportFacts, s as transcriptEventJsonSql, v as assertCurrentSessionTranscriptHeader } from "./transcript-payload-Yc_w8Yx5.mjs";
import { c as resolveTerminalAssistantTranscriptRunId, o as readSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { o as isOpenClawMessageToolMirrorAssistantMessage, s as isTranscriptOnlyOpenClawAssistantMessage } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { t as ensureTranscriptHeader } from "./session-accessor.sqlite-transcript-header-DXW9UGub.mjs";
import { t as SessionEntryNavigation } from "./session-entry-navigation-DTnKkJNk.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-DoBG3JQd.mjs";
import { n as projectAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-transcript-reports.kernel.ts
var TranscriptReportNavigation = class extends SessionEntryNavigation {
	constructor(rows) {
		super();
		for (const { seq, facts } of rows) switch (facts.kind) {
			case "canonical":
				this.appendCanonicalNavigationEntry({
					...facts.entry,
					parentId: facts.entry.parentId ?? null,
					seq
				}, facts.hasParentId);
				break;
			case "leaf":
				this.appendOpaqueNavigationRecord({
					...facts.entry,
					type: "leaf"
				});
				break;
			case "link": this.appendOpaqueNavigationRecord(facts);
		}
		this.finishNavigation();
	}
	facts() {
		return {
			appendParentId: this.appendParentId,
			path: this.getBranch()
		};
	}
};
function readReportBranch(database, sessionId) {
	function rows() {
		return iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select((eb) => [
			"seq",
			"event_json",
			eb.fn("json_extract", [eb.ref("navigation_json"), eb.val("$.report")]).as("report_json")
		]).where("session_id", "=", sessionId).orderBy("seq", "asc"));
	}
	function compressedFacts(reportJson) {
		const facts = reportJson === null ? void 0 : decodeSessionTranscriptReportFacts(JSON.parse(reportJson));
		if (!facts) throw new Error("Invalid compressed transcript report facts");
		return facts;
	}
	let hasRows = false;
	const header = findSessionTranscriptHeader((function* () {
		for (const row of rows()) {
			hasRows = true;
			if (row.event_json !== null) yield JSON.parse(row.event_json);
			else compressedFacts(row.report_json);
		}
	})());
	if (hasRows) assertCurrentSessionTranscriptHeader(header);
	return new TranscriptReportNavigation((function* () {
		for (const row of rows()) yield {
			seq: row.seq,
			facts: row.event_json === null ? compressedFacts(row.report_json) : projectSessionTranscriptReportFacts(JSON.parse(row.event_json))
		};
	})()).facts();
}
function latestCustomReport(database, sessionId, branch, customTypes) {
	for (const entry of branch.path.toReversed()) {
		if (entry.type !== "custom_message" || entry.customType === void 0 || !customTypes.includes(entry.customType)) continue;
		const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).where("seq", "=", entry.seq));
		const record = row ? JSON.parse(row.event_json) : void 0;
		if (isRecord(record)) return {
			customType: entry.customType,
			content: record.content,
			details: record.details
		};
	}
}
function prepareTranscriptReportSelection(database, resolved, selection) {
	const branch = readReportBranch(database, resolved.sessionId);
	const suppressed = selection.kind === "assistant" ? branch.path.some((entry) => entry.assistantResponseId === selection.responseId) : selection.suppressWhenAssistantRun !== void 0 && branch.path.some((entry) => entry.assistantRunId === selection.suppressWhenAssistantRun);
	return {
		appendParentId: branch.appendParentId,
		suppressed,
		latest: selection.kind === "custom" && !suppressed ? latestCustomReport(database, resolved.sessionId, branch, selection.customTypes) : void 0
	};
}
/** The producer has settled; only its committed answer may replace the buffered fallback. */
function appendAbortedSessionTranscriptPartialInTransaction(database, resolved, partial, preparedMessage, projection) {
	assertSessionTranscriptHot(database.db, resolved.sessionId);
	const entry = readSessionEntryRow(database, resolved.sessionKey)?.entry;
	if (!entry || entry.sessionId !== resolved.sessionId || partial.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== (partial.expectedLifecycleRevision ?? void 0)) throw new SessionTranscriptWriterClaimReboundError();
	const branch = readReportBranch(database, resolved.sessionId);
	for (const candidate of branch.path.toReversed()) {
		if (candidate.assistantRunId !== partial.runId) continue;
		const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", resolved.sessionId).where("seq", "=", candidate.seq));
		const event = row ? JSON.parse(row.event_json) : void 0;
		const message = isRecord(event) ? event.message : void 0;
		if (!isRecord(message) || readSessionTranscriptRunId(message) !== partial.runId || resolveTerminalAssistantTranscriptRunId(message, partial.runId) === void 0 || isOpenClawMessageToolMirrorAssistantMessage(message) || isTranscriptOnlyOpenClawAssistantMessage(message)) continue;
		const metadata = asOptionalRecord(message["__openclaw"]);
		if (metadata?.mirrorOrigin !== void 0 && metadata.runTerminal !== true) continue;
		if (extractAssistantPhaseText(projectAssistantDisplayContent(message))?.trim()) return { skipped: true };
	}
	if (entry.activeWriterRunId !== void 0 && entry.activeWriterRunId !== partial.runId) throw new SessionTranscriptWriterClaimReboundError();
	const append = appendTranscriptMessageInTransaction(database, resolved, {
		message: preparedMessage.persistedMessage,
		parentId: branch.appendParentId,
		idempotencyLookup: "scan-assistant",
		now: partial.now,
		useRawWhenLinear: true
	}, preparedMessage, projection);
	if (!append) throw new Error("Aborted assistant partial was not appended");
	if (append.appended) {
		const current = readSessionEntryRow(database, resolved.sessionKey)?.entry;
		if (!current || current.sessionId !== resolved.sessionId) throw new SessionTranscriptWriterClaimReboundError();
		writeSessionEntry(database, resolved.sessionKey, {
			...current,
			updatedAt: Math.max(current.updatedAt ?? 0, Date.now())
		}, { canonicalPreviousEntry: current });
	}
	return {
		skipped: false,
		append,
		lifecycleRevision: entry.lifecycleRevision,
		...append.anchor ? { messageSeq: append.anchor.activeMessagePosition + 1 } : {}
	};
}
/** Serialize the final envelope here so user-owned toJSON methods run once before transfer. */
function prepareCustomTranscriptReport(selected, appendParentId) {
	const eventJson = JSON.stringify({
		type: "custom_message",
		...selected,
		id: randomUUID(),
		parentId: appendParentId,
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (eventJson === void 0) throw new Error("Session transcript report serialization did not produce an event");
	return {
		kind: "custom",
		eventJson
	};
}
function appendSelectedTranscriptReportInTransaction(database, resolved, appendParentId, report, projection, preparedMessage) {
	if (report.kind === "assistant") {
		appendTranscriptMessageInTransaction(database, resolved, {
			message: preparedMessage?.persistedMessage ?? applyAssistantDeliveryDirectives(report.message),
			parentId: appendParentId
		}, preparedMessage, projection);
		return;
	}
	ensureTranscriptHeader(database, resolved, void 0, projection);
	const event = JSON.parse(report.eventJson);
	if (!appendTranscriptEventInTransaction(database, resolved, event, {
		...projection,
		eventJson: report.eventJson
	})) throw new Error("Session transcript report was not appended");
}
//#endregion
export { prepareTranscriptReportSelection as i, appendSelectedTranscriptReportInTransaction as n, prepareCustomTranscriptReport as r, appendAbortedSessionTranscriptPartialInTransaction as t };
