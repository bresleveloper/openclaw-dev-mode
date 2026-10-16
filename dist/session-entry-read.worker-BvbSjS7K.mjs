import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { a as withSqlitePostCommitPublications } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { r as participantRecordsBySessionKey } from "./internal-session-key-CPayZwJR.mjs";
import { i as readSessionEntriesByStatus, t as hasSessionEntriesByStatus } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { o as readExactSessionEntryCandidatesInDatabase } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { a as assertCanonicalSqliteSessionRowsCurrent, d as readWithCanonicalSessionReaderContinuation, g as canonicalSessionKeyMigrationRequiredError, n as assertCanonicalSessionKeyWrite, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D1TSJMmX.mjs";
import { c as readSessionEntryByIdInDatabase, l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { r as listSessionMembersInDatabase } from "./session-sharing-store.kernel-BCRJJ2WM.mjs";
import { a as runWithSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { o as readBoardSessionKeys } from "./sqlite-board-store.kernel-4NufZP3t.mjs";
import { r as readSelectedSessionEntriesInDatabase, t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { n as readSessionEntryCurrentFactsInDatabase, t as assertSessionEntryCurrentNativeSource } from "./session-entry-current-admission.worker-DStXV6pd.mjs";
import { n as hasPendingSessionTranscriptArchives } from "./session-accessor.sqlite-archive-store-kernel-GFHc9mfV.mjs";
import { n as readTranscriptHeaderFromDatabase, t as readLatestAssistantTextFromDatabase } from "./session-accessor.sqlite-transcript-metadata-read-DEqb-60D.mjs";
import { n as readSessionTranscriptWatermarkInDatabase } from "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
import { a as matchesPluginHostCleanupSession } from "./plugin-host-cleanup-tR73X5Oy.mjs";
import { n as readSessionEntryReplacementState } from "./session-accessor.sqlite-replacement-read-Bqri3ahV.mjs";
import { n as readSessionCreationSnapshotInDatabase } from "./session-accessor.sqlite-creation-read-DO8QFtG0.mjs";
import { t as boundSessionDiagnosticText } from "./session-diagnostic-text-RSPQUBVJ.mjs";
import { t as resolveSessionLifecycleTimestampsWithHeader } from "./lifecycle-timestamps-CS1MBHAi.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-CfqWjwl5.mjs";
//#region src/config/sessions/session-entry-read.worker.ts
/** Private entry and transcript-target reads share the same admitted reader and error codec. */
async function readSessionEntryWorkerRequest(request) {
	if (request.kind === "session-runtime-target") {
		const { readSessionTranscriptRuntimeTarget } = await import("./session-accessor.transcript-target-CbDQvdMA.mjs");
		const readTarget = () => readSessionTranscriptRuntimeTarget(request.scope, {
			keyFormat: request.keyFormat,
			databaseAgentId: request.database.agentId,
			continuation: request.continuation
		});
		const read = withOpenClawAgentDatabaseReadOnly((database) => {
			const target = readTarget();
			const identity = readOpenClawAgentDatabaseIdentity(database);
			if (typeof identity.identity !== "string" || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Session runtime target requires its current durable owner");
			return {
				target,
				source: {
					agentId: database.agentId,
					path: database.path,
					databaseIdentity: identity.identity,
					databaseBirthtime: identity.birthtime
				}
			};
		}, {
			...request.database,
			env: request.scope.env
		});
		return {
			kind: "session-runtime-target",
			...read.found ? read.value : { target: {
				agentId: request.scope.agentId,
				sessionId: request.scope.sessionId,
				sessionKey: resolveSqliteSessionKey(request.scope.sessionKey, request.scope.agentId),
				storePath: request.scope.storePath,
				...request.keyFormat ? {
					selectedSessionId: null,
					selectedLifecycleRevision: null
				} : {}
			} }
		};
	}
	const [{ loadSessionEntryReadOnlyResultInScope }, { encodeSessionTranscriptWorkerError }] = await Promise.all([import("./session-accessor.sqlite-exact-read-CUiGYS00.mjs"), import("./session-history-worker-errors-Dbw53h6_.mjs")]);
	let source;
	const read = loadSessionEntryReadOnlyResultInScope({
		...request.scope,
		env: cloneEnvWithPlatformSemantics(request.scope.env ?? process.env)
	}, request.continuation, (readSource) => {
		if (typeof readSource.databaseIdentity !== "string") throw new Error("Private session entry requires its process-held owner");
		source = {
			...readSource,
			databaseIdentity: readSource.databaseIdentity
		};
	});
	if (!read.ok) {
		const readError = encodeSessionTranscriptWorkerError(read.error);
		if (!readError || readError.kind === "fence") throw read.error;
		return {
			kind: "session-entry-read",
			entry: void 0,
			source,
			readError
		};
	}
	return {
		kind: "session-entry-read",
		entry: read.value,
		source
	};
}
/** Cleanup selects identity columns before materializing metadata in the same worker snapshot. */
function readSessionEntryList(request) {
	const scope = {
		...request.scope,
		env: cloneEnvWithPlatformSemantics(request.scope.env ?? process.env)
	};
	if (scope.cleanupSession === void 0) return listSessionEntriesReadOnly(scope, { continuation: request.continuation });
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
		const keys = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select(["session_key as sessionKey", "current_session_id as sessionId"]).orderBy("session_key")).rows.filter((row) => matchesPluginHostCleanupSession(row.sessionKey, row, scope.cleanupSession)).map((row) => row.sessionKey);
		const entries = new Map(readSelectedSessionEntriesInDatabase(database, keys).map((entry) => [entry.sessionKey, entry]));
		return keys.flatMap((key) => {
			const entry = entries.get(key);
			return entry ? [entry] : [];
		});
	}))), {
		...request.database,
		env: scope.env
	});
	return result.found ? result.value : [];
}
/** Canonical entry currency reuses parsed facts only at the same native connection revision. */
function readSessionEntryCurrentFacts(request) {
	const sessionKey = request.scope.sessionKey;
	assertCanonicalSessionKeyWrite(sessionKey, request.scope.agentId);
	if (request.source) {
		if (request.source.path !== request.database.path || request.source.agentId !== request.database.agentId || request.source.sessionKey !== sessionKey) throw new Error("Session currency request differs from its captured source");
		assertSessionEntryCurrentNativeSource(request.source);
	}
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => {
		const identity = readOpenClawAgentDatabaseIdentity(database);
		if (typeof identity.identity !== "string" || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Session currency read requires its current durable owner");
		if (request.source) assertSessionEntryCurrentNativeSource(request.source, database);
		return {
			entry: readSessionEntryCurrentFactsInDatabase(database, sessionKey),
			source: {
				agentId: database.agentId,
				path: database.path,
				databaseIdentity: identity.identity,
				databaseBirthtime: identity.birthtime
			}
		};
	}), {
		...request.database,
		env: request.scope.env
	});
	if (!result.found && result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
	return {
		kind: "session-entry-current",
		...result.found ? result.value : { entry: void 0 }
	};
}
/** Current identity and assistant bytes come from one existing-only read snapshot. */
function readSessionDiagnosticText(request) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => runSqliteDeferredTransactionSync(database.db, () => {
		const identity = readOpenClawAgentDatabaseIdentity(database);
		if (typeof identity.identity !== "string" || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Session diagnostic read requires its current durable owner");
		const source = {
			agentId: database.agentId,
			path: database.path,
			databaseIdentity: identity.identity,
			databaseBirthtime: identity.birthtime
		};
		const scope = {
			agentId: request.scope.agentId,
			sessionKey: resolveSqliteSessionKey(request.scope.sessionKey, request.scope.agentId),
			sessionId: request.scope.sessionId
		};
		const entry = readSessionEntryRow(database, scope.sessionKey, "list")?.entry;
		if (entry?.sessionId !== scope.sessionId || entry.incognito === true) return {
			text: void 0,
			source
		};
		const latest = runWithSessionTranscriptReadFence(request.admission, () => readLatestAssistantTextFromDatabase(database, scope));
		return {
			text: latest ? boundSessionDiagnosticText(latest.text) : void 0,
			source
		};
	})), {
		...request.database,
		env: request.scope.env
	});
	if (!result.found && result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
	return {
		kind: "session-diagnostic-text",
		...result.found ? result.value : { text: void 0 }
	};
}
/** Full rows share a snapshot with lifecycle fallback; list reads retain listing admission. */
function readExactSessionEntriesWithLifecycle(request) {
	if (request.statusSelection) {
		const { statuses, presenceOnly } = request.statusSelection;
		const read = withOpenClawAgentDatabaseReadOnly((database) => ({
			entries: presenceOnly ? [] : readSessionEntriesByStatus(database, statuses),
			statusFound: presenceOnly ? hasSessionEntriesByStatus(database, statuses) : false
		}), {
			...request.database,
			env: request.env
		});
		if (!read.found && !presenceOnly && read.reason !== "database-missing") throw new SessionMetadataUnavailableError(read.reason);
		return {
			kind: "session-exact-entries",
			lifecycleTimestamps: {},
			...read.found ? read.value : {
				entries: [],
				statusFound: read.reason !== "database-missing"
			}
		};
	}
	const result = withOpenClawAgentDatabaseReadOnly((database) => request.projection === "list" ? {
		kind: "session-exact-entries",
		entries: readSelectedSessionEntriesInDatabase(database, request.sessionKeys, { continuation: request.continuation }),
		lifecycleTimestamps: {}
	} : withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		if (request.projection === "creation") {
			const { identity, canonicalPath } = readOpenClawAgentDatabaseIdentity(database);
			const sessionKey = request.sessionKeys[0];
			if (typeof identity !== "string" || !sessionKey || request.sessionKeys.length !== 1) throw new Error("Session creation snapshot requires its durable owner and target");
			return {
				kind: "session-exact-entries",
				entries: [],
				lifecycleTimestamps: {},
				creation: {
					...readSessionCreationSnapshotInDatabase(database, sessionKey, request.creationLabel),
					databaseIdentity: identity,
					databasePath: canonicalPath
				}
			};
		}
		if (request.projection === "replacement") {
			const identity = readOpenClawAgentDatabaseIdentity(database).identity;
			if (typeof identity !== "string" || !request.replacementSelection) throw new Error("Session replacement snapshot requires its durable owner and selection");
			const replacement = readSessionEntryReplacementState(database, request.replacementSelection);
			return {
				kind: "session-exact-entries",
				entries: replacement.entries,
				lifecycleTimestamps: {},
				replacement: {
					...replacement,
					databaseIdentity: identity
				}
			};
		}
		const selectedById = request.selection ? readSessionEntryByIdInDatabase(database, {
			sessionId: request.selection.sessionId,
			projection: "list"
		}) : void 0;
		const selected = request.selection ? ok(selectedById ? [selectedById] : []) : expectDefined(readExactSessionEntryCandidatesInDatabase(database, [request.sessionKeys], request.projection === "sharing" ? "list" : "full")[0], "exact session read result");
		if (!selected.ok) throw selected.error;
		if (request.projection === "sharing") {
			const source = readOpenClawAgentDatabaseIdentity(database);
			const { identity } = source;
			if (typeof identity !== "string" || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Private session facts require their process-held owner");
			const presentKeys = new Set(selected.value.map(({ sessionKey }) => sessionKey));
			const missingKeys = (request.sessionKeys ?? []).filter((key) => !presentKeys.has(key));
			const placeholders = missingKeys.length ? executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes as node").leftJoin("session_windows as window", (join) => join.onRef("window.session_id", "=", "node.current_session_id").onRef("window.session_key", "=", "node.session_key")).select([
				"node.session_key",
				"node.current_session_id",
				"node.entry_json",
				"node.entry_valid",
				"window.session_id as retained_session_id"
			]).where("node.session_key", "in", sqliteStringSet(missingKeys))).rows.map((row) => {
				if (row.entry_json !== "{}" || row.entry_valid !== -1 || row.retained_session_id !== row.current_session_id) throw canonicalSessionKeyMigrationRequiredError(`invalid retained session row requires repair for ${row.session_key}`);
				return {
					sessionKey: row.session_key,
					sessionId: row.current_session_id
				};
			}) : [];
			return {
				kind: "session-exact-entries",
				...request.includeAuthorization ? { databaseIdentity: {
					...source,
					identity
				} } : {},
				entries: selected.value,
				lifecycleTimestamps: {},
				sharing: {
					source: {
						agentId: database.agentId,
						path: database.path
					},
					databaseIdentity: `file:${identity}`,
					placeholders,
					members: selected.value.map(({ sessionKey }) => ({
						sessionKey,
						identityIds: listSessionMembersInDatabase(database, sessionKey).map((member) => member.identityId)
					}))
				}
			};
		}
		const entry = selected.value.find(({ sessionKey }) => sessionKey === request.lifecycleSessionKey)?.entry;
		const identity = request.includeAuthorization ? readOpenClawAgentDatabaseIdentity(database) : void 0;
		if (identity && (typeof identity.identity !== "string" || !isOpenClawAgentDatabasePathCurrent(database))) throw new Error("Session database physical identity changed");
		return {
			...identity && typeof identity.identity === "string" ? { databaseIdentity: {
				...identity,
				identity: identity.identity
			} } : {},
			...request.includeMembers ? { members: Object.fromEntries(selected.value.map(({ sessionKey }) => [sessionKey, listSessionMembersInDatabase(database, sessionKey)])) } : {},
			...request.includeParticipantRecords ? { participantRecords: Object.fromEntries(participantRecordsBySessionKey(database.db, request.sessionKeys)) } : {},
			kind: "session-exact-entries",
			entries: selected.value,
			...request.projection === "lifecycle" ? { pendingArchives: hasPendingSessionTranscriptArchives(database) } : {},
			lifecycleTimestamps: resolveSessionLifecycleTimestampsWithHeader({
				entry,
				agentId: database.agentId,
				sessionKey: request.lifecycleSessionKey,
				readHeader: ({ sessionId }) => readTranscriptHeaderFromDatabase(database, sessionId)
			})
		};
	})), {
		...request.database,
		env: request.env
	});
	if (result.found) return result.value;
	if (result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
	return {
		kind: "session-exact-entries",
		entries: [],
		lifecycleTimestamps: {},
		...request.projection === "lifecycle" ? { pendingArchives: false } : {}
	};
}
/** Entry, board presence, and summary validity describe one committed snapshot. */
function readSessionRowDatabaseFacts(request) {
	if (request.sessionKeys.length > 64) throw new Error(`Session row facts support at most 64 keys`);
	if (request.sessionKeys.length === 0) return {
		kind: "session-row-facts",
		rows: []
	};
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
		assertCanonicalSqliteSessionRowsCurrent(database, request.sessionKeys);
		const selected = expectDefined(readExactSessionEntryCandidatesInDatabase(database, [request.sessionKeys], "list")[0], "session row facts read result");
		if (!selected.ok) throw selected.error;
		const boardKeys = readBoardSessionKeys(database, request.sessionKeys);
		return {
			kind: "session-row-facts",
			rows: selected.value.map(({ sessionKey, entry }) => {
				const facts = {
					sessionKey,
					entry,
					hasBoard: boardKeys.has(sessionKey)
				};
				if (readSessionActivitySummary(entry)) facts.activitySummaryWatermark = readSessionTranscriptWatermarkInDatabase(database, entry.sessionId);
				return facts;
			})
		};
	}))), {
		...request.database,
		env: request.env
	});
	if (result.found) return result.value;
	if (result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
	return {
		kind: "session-row-facts",
		rows: []
	};
}
//#endregion
export { readExactSessionEntriesWithLifecycle, readSessionDiagnosticText, readSessionEntryCurrentFacts, readSessionEntryList, readSessionEntryWorkerRequest, readSessionRowDatabaseFacts };
