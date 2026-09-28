import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { a as iterateSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { i as withScopedOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-scope-BIEwBWBt.mjs";
import { u as transcriptEventNavigationSql } from "./transcript-payload-qsg5dB6v.mjs";
import { c as readSessionEntryRow, o as readExactSessionEntryRow, s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { u as readWithCanonicalSessionAdmission } from "./session-canonical-key-BBylVEaq.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { i as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { i as readCurrentProjectionSnapshot, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-CEJGTMGy.mjs";
import { v as resolveVisibleMessagePositions } from "./session-accessor.sqlite-visible-cursor-BfibSXF5.mjs";
import { t as readAcpSessionMetaForEntry } from "./session-meta-readonly-CY2eWmkz.mjs";
import { n as isSubagentSessionFromEntry } from "./subagent-depth-policy-DzGhB4EH.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-BY4PdwgQ.mjs";
import { n as resolveGatewaySessionStoreReadResults } from "./session-utils-store-selection-ffLf8R4b.mjs";
import { c as resolveHistoryMessageSequence, d as resolveVisibleHistoryRange, s as readTranscriptDisplayDeltaFromProjection, u as resolveVisibleHistoryProjection } from "./session-accessor.sqlite-history-query-Be6-ei7a.mjs";
import { t as createSessionTranscriptReader } from "./session-transcript-read-kernel-AGigGycL.mjs";
import { s as isSubagentCoordinationHistoryInput } from "./chat-display-projection.history-C3UZzKPr.mjs";
//#region src/config/sessions/session-accessor.sqlite-history-input-visibility.ts
const inputMessageJson = sql`json_object('role', json_extract(${transcriptEventNavigationSql("event")}, '$.message.role'),
    'idempotencyKey', json_extract(${transcriptEventNavigationSql("event")}, '$.message.idempotencyKey'),
    'provenance', json_extract(${transcriptEventNavigationSql("event")}, '$.message.provenance'),
    '__openclaw', json_object(
      'runId', json_extract(${transcriptEventNavigationSql("event")}, '$.message.__openclaw.runId'),
      'steerTargetRunId', json_extract(${transcriptEventNavigationSql("event")}, '$.message.__openclaw.steerTargetRunId')))`;
/** Resolve a run's hidden input and the first visible steer on its active transcript branch. */
function readSessionTranscriptRunInputVisibilityFromProjection(projection, params) {
	const db = getActiveTranscriptKysely(projection.database);
	resolveSqliteSessionTranscriptReadFence({
		database: projection.database,
		...projection.resolved
	});
	const visible = resolveVisibleMessagePositions(projection);
	const history = resolveVisibleHistoryProjection(projection);
	const { messageEnd } = resolveVisibleHistoryRange(history, params.messageSeq - 1, params.messageSeq);
	const scannedThroughMessagePosition = messageEnd <= visible.kept.length ? visible.kept[messageEnd - 1] ?? -1 : visible.postStart + messageEnd - visible.kept.length - 1;
	const hidden = {
		hidden: true,
		scannedThroughMessageSeq: params.messageSeq,
		scannedThroughMessagePosition
	};
	const keptPositions = sql`(SELECT value FROM json_each(${JSON.stringify(visible.kept)}))`;
	const userInputs = db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", inputMessageJson.as("message_json")]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "<", projection.state.activeMessageCount).where((eb) => visible.kept.length > 0 ? eb.or([eb("active.message_position", ">=", visible.postStart), eb("active.message_position", "in", keptPositions)]) : eb("active.message_position", ">=", visible.postStart)).where(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.role')`, "=", "user").$narrowType();
	let readAfter = params.previous?.scannedThroughMessagePosition;
	if (readAfter === void 0) {
		const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, userInputs.innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).where("identity.message_idempotency_key", "=", params.idempotencyKey).where(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.__openclaw.steerTargetRunId')`, "is", null).limit(1));
		if (!anchor || !params.isHiddenInput(JSON.parse(anchor.message_json))) return { hidden: false };
		readAfter = anchor.message_position;
	}
	const laterInputs = userInputs.where("active.message_position", ">", readAfter).where("active.message_position", "<=", scannedThroughMessagePosition).where((eb) => eb.or([eb(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.__openclaw.steerTargetRunId')`, "=", params.runId), eb(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.__openclaw.runId')`, "=", params.runId)])).orderBy("active.message_position", "asc");
	for (const row of iterateSqliteQuerySync(projection.database.db, laterInputs)) if (!params.isHiddenInput(JSON.parse(row.message_json))) {
		const firstVisibleMessageSeq = resolveHistoryMessageSequence(visible, history, row.message_position);
		return firstVisibleMessageSeq === void 0 ? { hidden: false } : {
			...hidden,
			firstVisibleMessageSeq
		};
	}
	return hidden;
}
//#endregion
//#region src/gateway/session-utils-store-readonly.ts
/** Auxiliary metadata never chooses one of several matching canonical source rows. */
function readGatewaySessionEntryFromSources(sessionKey, sources, current) {
	if (sources.length === 0) return;
	const selected = resolveGatewaySessionStoreReadResults({
		canonicalKey: sessionKey,
		scanTargets: [sessionKey],
		deferCanonicalValidation: true,
		reads: sources.map((source) => ({
			storePath: source.path,
			readSource: source
		})),
		readStore: ({ readSource }) => {
			if (current && readSource.path === current.source.path && readSource.agentId === current.source.agentId) return current.entry ? { [sessionKey]: current.entry } : {};
			try {
				const result = withScopedOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => readExactSessionEntryRowValidated(database, sessionKey, "list")?.entry), readSource);
				return result.found && result.value ? { [sessionKey]: result.value } : {};
			} catch {
				return {};
			}
		}
	});
	return selected.canonicalValidationError ? void 0 : selected.match?.entry;
}
//#endregion
//#region src/gateway/session-history-readonly-reader.ts
/** Source and run facts live only for one history operation, on its admitted database. */
function createBoundSessionHistorySubagentProjection(readSnapshot, stateDatabase, readSourceDatabases) {
	const sources = /* @__PURE__ */ new Map();
	const runs = /* @__PURE__ */ new Map();
	const readSource = (projection, sessionKey) => {
		const cached = sources.get(sessionKey);
		if (cached !== void 0) return cached;
		if (isSubagentSessionFromEntry(sessionKey, void 0)) {
			sources.set(sessionKey, true);
			return true;
		}
		const sourceAgentId = parseAgentSessionKey(sessionKey)?.agentId;
		const sourceDatabases = readSourceDatabases();
		const ownSource = {
			agentId: projection.database.agentId,
			path: projection.database.path
		};
		const hasPreparedSource = Boolean(sourceAgentId && sourceDatabases && Object.hasOwn(sourceDatabases, sourceAgentId));
		const candidates = sourceAgentId && sourceDatabases && hasPreparedSource ? [...sourceDatabases[sourceAgentId] ?? []] : [];
		if (!sourceAgentId || sourceAgentId === projection.resolved.agentId || !hasPreparedSource) {
			if (!candidates.some((source) => source.agentId === ownSource.agentId && source.path === ownSource.path)) candidates.unshift(ownSource);
		}
		const ownCandidate = candidates.find((source) => source.agentId === ownSource.agentId && source.path === ownSource.path);
		const ownEntry = ownCandidate ? readExactSessionEntryRow(projection.database, sessionKey, "list")?.entry : void 0;
		const entry = readGatewaySessionEntryFromSources(sessionKey, candidates, {
			source: ownCandidate ?? ownSource,
			entry: ownEntry
		});
		let child = isSubagentSessionFromEntry(sessionKey, entry);
		if (!child && entry && (entry.parentSessionKey || entry.spawnedBy) && stateDatabase) {
			const acp = withStateDatabaseCoordinatorRuntimeDirectory(stateDatabase.coordinatorRuntime, () => readAcpSessionMetaForEntry({
				sessionKey,
				agentId: parseAgentSessionKey(sessionKey)?.agentId,
				entry,
				databasePath: stateDatabase.path,
				env: stateDatabase.environment
			}));
			child = isSubagentSessionFromEntry(sessionKey, entry, acp);
		}
		sources.set(sessionKey, child);
		return child;
	};
	return {
		isSubagentSession(sessionKey) {
			return sources.get(sessionKey) ?? readSnapshot((projection) => readSource(projection, sessionKey));
		},
		isSubagentRunMessage(runId, messageSeq) {
			if (messageSeq === void 0) return false;
			let visibility = runs.get(runId);
			if (!visibility || visibility.hidden && visibility.firstVisibleMessageSeq === void 0 && visibility.scannedThroughMessageSeq < messageSeq) {
				visibility = readSnapshot((projection) => readSessionTranscriptRunInputVisibilityFromProjection(projection, {
					idempotencyKey: buildRunUserTurnIdempotencyKey(runId),
					runId,
					messageSeq,
					previous: visibility?.hidden ? visibility : void 0,
					isHiddenInput: (message) => {
						const record = asOptionalRecord(message);
						return Boolean(record && isSubagentCoordinationHistoryInput(record, (key) => readSource(projection, key)));
					}
				}));
				runs.set(runId, visibility);
			}
			return visibility.hidden && (visibility.firstVisibleMessageSeq === void 0 || messageSeq < visibility.firstVisibleMessageSeq);
		}
	};
}
function createReadonlySessionHistoryReader(target) {
	const sourceDatabases = target.sourceDatabases;
	const readSnapshot = (read) => {
		const result = withScopedOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => {
			const entryValidationKey = target.entryValidationKey;
			if (entryValidationKey !== void 0) readSessionEntryRow(database, entryValidationKey);
			return readCurrentProjectionSnapshot(database, {
				agentId: target.transcript.agentId,
				sessionId: target.transcript.sessionId,
				sessionKey: target.transcript.sessionKey,
				databaseAgentId: target.database.agentId,
				path: target.database.path
			}, read);
		}), target.database);
		if (!result.found) throw new Error("Session transcript storage is unavailable; open the source gateway and retry.");
		if (result.value.kind === "unavailable") throw new SessionTranscriptProjectionUnavailableError(target.transcript.sessionId);
		return result.value.value;
	};
	return {
		readTranscriptDisplayDelta: (limits) => readSnapshot((projection) => readTranscriptDisplayDeltaFromProjection(projection, limits)),
		...createSessionTranscriptReader({
			resolveTarget: async () => target.transcript,
			readSnapshot: async (_transcript, read) => readSnapshot(read)
		}),
		subagentCoordination: createBoundSessionHistorySubagentProjection(readSnapshot, target.stateDatabase, () => sourceDatabases)
	};
}
//#endregion
export { createReadonlySessionHistoryReader as n, createBoundSessionHistorySubagentProjection as t };
