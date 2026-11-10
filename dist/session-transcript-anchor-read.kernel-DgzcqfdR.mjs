import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { i as runWithSessionTranscriptReadFence, r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { o as readExactSessionEntryRow, p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { n as readSessionTranscriptWatermarkInDatabase } from "./session-accessor.sqlite-transcript-watermark-CfdOKFaq.mjs";
import { t as loadTranscriptEventRowsAfterSeqInDatabase } from "./session-accessor.sqlite-transcript-incremental-read-D4tO2nxt.mjs";
import { i as readTranscriptHeaderFromDatabase, n as hasSessionTranscriptMessageInDatabase } from "./session-accessor.sqlite-transcript-metadata-read-BOm6XprL.mjs";
import { a as readActiveTranscriptEntryAnchorFromProjection, o as readActiveTranscriptEntryAnchorInTransaction, r as readActivePathEntryRelationFromProjection } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { i as validateSessionTranscriptContextInDatabase } from "./session-accessor.sqlite-model-context-BymThP-K.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { n as readSessionTranscriptMetadataInDatabase } from "./session-accessor.sqlite-metadata-read-DgoOP6m6.mjs";
//#region src/config/sessions/session-transcript-anchor-read.kernel.ts
function readSessionEntryTranscriptFacts(database, request, entries) {
	const selection = request.transcript;
	if (!selection) return {};
	const entry = entries.find((row) => row.sessionKey === selection.sessionKey)?.entry;
	if (!entry) return { transcript: {
		anchors: [],
		...selection.activePathEntryId !== void 0 ? { activePathRelation: selection.activePathEntryId === null ? "exact" : "off-path" } : {}
	} };
	return { transcript: readSessionTranscriptAnchorFactsInDatabase(database, {
		agentId: selection.agentId ?? database.agentId,
		sessionId: entry.sessionId,
		sessionKey: selection.sessionKey,
		path: database.path,
		env: request.env
	}, selection, void 0, void 0, entry) };
}
/** Load display policy before entering the synchronous anchor snapshot. */
async function prepareSessionTranscriptAnchorMessageReader(selection) {
	if (selection.includeMessagesForRunId === void 0) return;
	const { readSessionTranscriptHistoryEventByIdFromProjection } = await import("./session-accessor.sqlite-history-query-cr451K3p.mjs");
	return (projection, entryId) => asOptionalRecord(readSessionTranscriptHistoryEventByIdFromProjection(projection, entryId, {
		currentOnly: true,
		maxBytes: Number.MAX_SAFE_INTEGER
	})?.event)?.message;
}
/** The cohort's entry and optional reply-tail facts belong to the same snapshot. */
function readSessionTranscriptAnchorFactsInDatabase(database, resolved, selection, readMessage, projection, preparedEntry, messagePresence) {
	if (projection && (!database.db.isTransaction || projection.database.db !== database.db || projection.database.path !== database.path || projection.database.agentId !== database.agentId || projection.resolved.agentId !== resolved.agentId || projection.resolved.sessionId !== resolved.sessionId || projection.resolved.sessionKey !== resolved.sessionKey)) throw new Error("Transcript anchor projection differs from its selected session snapshot");
	if (selection.includeMessagesForRunId !== void 0 && !readMessage) throw new Error("Transcript anchor message selection requires prepared display policy");
	const read = () => {
		const readWatermark = (currentProjection = projection) => currentProjection ? {
			generation: currentProjection.version.generation,
			maxSeq: currentProjection.version.rawSeq
		} : readSessionTranscriptWatermarkInDatabase(database, resolved.sessionId);
		const contextEntry = selection.contextAuthority ? preparedEntry ?? readSessionEntryRow(database, resolved.sessionKey)?.entry : void 0;
		const contextAuthority = selection.contextAuthority ? {
			entry: contextEntry && {
				sessionId: contextEntry.sessionId,
				updatedAt: contextEntry.updatedAt,
				lifecycleRevision: contextEntry.lifecycleRevision,
				activeWriterRunId: contextEntry.activeWriterRunId,
				cliHistoryBoundary: contextEntry.cliHistoryBoundary,
				permissionMode: contextEntry.permissionMode
			},
			watermark: readWatermark()
		} : void 0;
		if (selection.contextAuthority && (!contextEntry || contextEntry.sessionId !== resolved.sessionId || selection.contextAuthority !== true && contextEntry.permissionMode !== selection.contextAuthority.permissionMode)) return {
			anchors: [],
			contextAuthority
		};
		let replayValidated;
		const replay = selection.replayValidation;
		if (replay) {
			const entry = preparedEntry ?? readSessionEntryRow(database, resolved.sessionKey)?.entry;
			if (!entry && replay.allowInitial && readTranscriptHeaderFromDatabase(database, resolved.sessionId) === void 0) replayValidated = "initial";
			else if (!entry || entry.sessionId !== resolved.sessionId || replay.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== replay.expectedLifecycleRevision || replay.expectedWriterRunId !== void 0 && entry.activeWriterRunId !== replay.expectedWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
			else replayValidated = "current";
		}
		const fence = replay ? runWithSessionTranscriptReadFence(replay.admission, () => resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		})) : void 0;
		const context = selection.contextValidation;
		if (context) validateSessionTranscriptContextInDatabase(database, resolved, context, replay ? "exact" : "prefix");
		const validated = {
			...selection.includeMetadata ? { metadata: readSessionTranscriptMetadataInDatabase(database, resolved.sessionId) } : {},
			...selection.includeMessagePresence ? { messagePresence: messagePresence ?? hasSessionTranscriptMessageInDatabase(database, resolved.sessionId) } : {},
			...contextAuthority ? { contextAuthority } : {},
			...context ? { contextValidated: true } : {},
			...replayValidated ? { replayValidated } : {}
		};
		const entry = selection.includeSession ? preparedEntry ?? readExactSessionEntryRow(database, resolved.sessionKey, "list", "canonical")?.entry : void 0;
		const session = entry ? {
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision
		} : void 0;
		const sessionFacts = selection.includeSession ? { session } : {};
		const header = {};
		if (selection.includeHeader) try {
			header.header = readTranscriptHeaderFromDatabase(database, resolved.sessionId);
		} catch {}
		const readAnchors = (currentProjection) => {
			const watermark = selection.includeWatermark ? { watermark: contextAuthority?.watermark ?? readWatermark(currentProjection) } : {};
			const anchors = /* @__PURE__ */ new Map();
			const readAnchor = (entryId) => {
				if (!anchors.has(entryId)) {
					const anchor = currentProjection ? readActiveTranscriptEntryAnchorFromProjection(currentProjection, entryId) : readActiveTranscriptEntryAnchorInTransaction({
						database,
						resolved,
						entryId
					});
					anchors.set(entryId, fence && anchor && anchor.rawSeq >= fence.beforeRawSeq ? void 0 : anchor);
				}
				return anchors.get(entryId);
			};
			const selected = selection.entryIds.flatMap((entryId) => readAnchor(entryId) ?? []);
			const activePath = selection.activePathEntryId !== void 0 && currentProjection ? { activePathRelation: readActivePathEntryRelationFromProjection(currentProjection, selection.activePathEntryId) } : {};
			if (selection.afterSeq === void 0) return {
				anchors: selected,
				...activePath,
				...validated,
				...watermark,
				...sessionFacts,
				...header
			};
			const rows = loadTranscriptEventRowsAfterSeqInDatabase(database, resolved.sessionId, selection.afterSeq);
			const entries = [];
			for (const { event } of rows) {
				const row = asOptionalRecord(event);
				const message = asOptionalRecord(row?.message);
				if (typeof row?.id !== "string" || message?.role !== "user" && message?.role !== "assistant") continue;
				const runId = readSessionTranscriptRunId(message);
				const includeMessage = currentProjection !== void 0 && selection.includeMessagesForRunId !== void 0 && message.role === "assistant" && runId === selection.includeMessagesForRunId;
				const anchor = message.role === "user" || includeMessage ? readAnchor(row.id) : anchors.get(row.id);
				const displayed = includeMessage && anchor ? readMessage?.(currentProjection, row.id) : void 0;
				entries.push({
					entryId: row.id,
					role: message.role,
					...runId ? { runId } : {},
					...anchor ? { anchor } : {},
					...displayed ? { message: displayed } : {}
				});
			}
			return {
				anchors: selection.includeMessagesForRunId ? [...anchors.values()].flatMap((anchor) => anchor ?? []) : selected,
				...validated,
				...watermark,
				...sessionFacts,
				...header,
				tail: {
					lastSeq: rows.at(-1)?.seq,
					entries
				}
			};
		};
		if (projection) return readAnchors(projection);
		if (selection.activePathEntryId !== void 0 || selection.replayValidation && selection.entryIds.length > 0 || selection.includeMessagesForRunId !== void 0) {
			const result = readCurrentProjectionSnapshot(database, resolved, readAnchors);
			if (result.kind !== "value") throw new SessionTranscriptProjectionUnavailableError(resolved.sessionId);
			return result.value;
		}
		return readAnchors();
	};
	return database.db.isTransaction ? read() : runSqliteDeferredTransactionSync(database.db, read, {
		databaseLabel: database.path,
		operationLabel: "session transcript anchors read"
	});
}
//#endregion
export { readSessionEntryTranscriptFacts as n, readSessionTranscriptAnchorFactsInDatabase as r, prepareSessionTranscriptAnchorMessageReader as t };
