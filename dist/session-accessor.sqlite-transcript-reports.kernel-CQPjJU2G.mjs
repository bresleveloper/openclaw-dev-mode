import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { r as findSessionTranscriptHeader, t as assertCurrentSessionTranscriptHeader } from "./session-entry-codec-DSMJ1XFN.mjs";
import { n as projectSessionTranscriptReportFacts, t as decodeSessionTranscriptReportFacts } from "./session-transcript-report-facts-CJXa6teM.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { $ as projectSessionUsageSnapshot, f as TranscriptReportNavigation, m as selectTranscriptReport, p as hasSettledTranscriptAssistant } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CWFSrppd.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { a as writeSessionEntry } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as ensureTranscriptHeader } from "./session-accessor.sqlite-transcript-header-DxLFa_Iq.mjs";
import "./transcript-write-context-C02sC3zd.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-transcript-reports.kernel.ts
function readReportBranch(database, sessionId) {
	const rows = iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select((eb) => [
		"seq",
		"event_json",
		eb.fn("json_extract", [eb.ref("navigation_json"), eb.val("$.report")]).as("report_json")
	]).where("session_id", "=", sessionId).orderBy("seq", "asc"));
	function compressedFacts(reportJson) {
		const facts = reportJson === null ? void 0 : decodeSessionTranscriptReportFacts(JSON.parse(reportJson));
		if (!facts) throw new Error("Invalid compressed transcript report facts");
		return facts;
	}
	let hasRows = false;
	let header;
	const navigation = new TranscriptReportNavigation((function* () {
		for (const row of rows) {
			hasRows = true;
			if (row.event_json === null) {
				yield {
					seq: row.seq,
					facts: compressedFacts(row.report_json)
				};
				continue;
			}
			const event = JSON.parse(row.event_json);
			if (!header) {
				header = findSessionTranscriptHeader([event]);
				if (header) assertCurrentSessionTranscriptHeader(header);
			}
			yield {
				seq: row.seq,
				facts: projectSessionTranscriptReportFacts(event)
			};
		}
	})());
	if (hasRows) assertCurrentSessionTranscriptHeader(header);
	return navigation.facts();
}
function readReportEvent(database, sessionId, seq) {
	const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).where("seq", "=", seq));
	const event = row ? JSON.parse(row.event_json) : void 0;
	return asOptionalRecord(event);
}
function prepareTranscriptReportSelection(database, resolved, selection) {
	return selectTranscriptReport(readReportBranch(database, resolved.sessionId), (seq) => readReportEvent(database, resolved.sessionId, seq), selection);
}
/** The producer has settled; only its committed answer may replace the buffered fallback. */
function appendAbortedSessionTranscriptPartialInTransaction(database, resolved, partial, preparedMessage, projection) {
	assertSessionTranscriptHot(database.db, resolved.sessionId);
	const entry = readSessionEntryRow(database, resolved.sessionKey)?.entry;
	if (!entry || entry.sessionId !== resolved.sessionId || partial.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== (partial.expectedLifecycleRevision ?? void 0)) throw new SessionTranscriptWriterClaimReboundError();
	const branch = readReportBranch(database, resolved.sessionId);
	if (hasSettledTranscriptAssistant(branch, (seq) => readReportEvent(database, resolved.sessionId, seq), partial.runId)) return { skipped: true };
	if (entry.activeWriterRunId !== void 0 && entry.activeWriterRunId !== partial.runId) throw new SessionTranscriptWriterClaimReboundError();
	const append = appendTranscriptMessageInTransaction(database, resolved, {
		message: preparedMessage.persistedMessage,
		parentId: branch.appendParentId,
		idempotencyLookup: "scan-assistant",
		now: partial.now,
		useRawWhenLinear: true
	}, preparedMessage, projection)?.result;
	if (!append) throw new Error("Aborted assistant partial was not appended");
	if (append.appended) {
		const current = readSessionEntryRow(database, resolved.sessionKey)?.entry;
		if (!current || current.sessionId !== resolved.sessionId) throw new SessionTranscriptWriterClaimReboundError();
		writeSessionEntry(database, resolved.sessionKey, {
			...current,
			...projectSessionUsageSnapshot(normalizeUsage(asOptionalRecord(preparedMessage.persistedMessage.usage)), void 0),
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
