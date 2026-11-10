import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as readOpenClawAgentDatabaseIdentity, i as isOpenClawAgentDatabasePathCurrent, t as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as resolveSessionLifecycleTimestampsWithHeader } from "./lifecycle-timestamps-DuPaTaAj.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { f as readWithCanonicalSessionReaderContinuation, h as canonicalSessionKeyMigrationRequiredError, n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-B7chVWi3.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-CfqWjwl5.mjs";
import { i as readSessionColdTranscript } from "./session-cold-storage-state-CWFSrppd.mjs";
import { n as captureSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as participantRecordsBySessionKey } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { a as readExactSessionEntryCandidatesInDatabase } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { i as prepareExactSessionEntryRowReads, l as readSessionChildEntriesInDatabase, o as readExactSessionEntryRow, u as readSessionEntryByIdInDatabase } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { n as listSqliteSessionEntriesFromDatabase, r as readSelectedSessionEntriesInDatabase } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { i as readStoredSessionRowTranscriptProjection } from "./session-row-transcript-preview-D_omQ8Ci.mjs";
import { n as readSessionTranscriptWatermarkInDatabase } from "./session-accessor.sqlite-transcript-watermark-CfdOKFaq.mjs";
import { i as readTranscriptHeaderFromDatabase } from "./session-accessor.sqlite-transcript-metadata-read-BOm6XprL.mjs";
import { n as hasPendingSessionTranscriptArchives } from "./session-accessor.sqlite-archive-store-kernel-D7Zd_1OC.mjs";
import { i as readSessionEntryReplacementState, n as readSessionCreationSnapshotInDatabase } from "./session-accessor.sqlite-creation-read-Dt1Glefh.mjs";
import { n as listSessionMembersInDatabase } from "./session-sharing-store.kernel-DHH7VvHM.mjs";
import { t as readExactSessionEntryFactsInDatabase } from "./session-accessor.sqlite-entry-facts.worker-D7R198Xs.mjs";
import { n as readSessionEntryTranscriptFacts } from "./session-transcript-anchor-read.kernel-DgzcqfdR.mjs";
import { t as createSessionEntryReadScope } from "./session-entry-cohort.worker-JqxX8IrB.mjs";
import { t as readSessionSourceChecks } from "./session-source-predicate.worker-CY9FAsb_.mjs";
import { n as prepareSessionColdSourceGuard } from "./session-cold-storage-source-guard.worker-CKWg0m5n.mjs";
//#region src/config/sessions/session-accessor.sqlite-worktree-owner.ts
function readWorktree(value) {
	const worktree = JSON.parse(value);
	if (!isRecord(worktree) || typeof worktree.id !== "string" || typeof worktree.branch !== "string" || typeof worktree.repoRoot !== "string" || worktree.canonicalWorkspaceDir !== void 0 && typeof worktree.canonicalWorkspaceDir !== "string") throw new Error("Session worktree metadata requires repair");
	return {
		...worktree,
		id: worktree.id,
		branch: worktree.branch,
		repoRoot: worktree.repoRoot,
		...worktree.canonicalWorkspaceDir === void 0 ? {} : { canonicalWorkspaceDir: worktree.canonicalWorkspaceDir }
	};
}
/** Certified node columns own GC activity; only the small cleanup identity remains in JSON. */
function readSessionWorktreeOwnerFactsInDatabase(database, sessionKeys) {
	if (sessionKeys.length === 0) return [];
	return executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes as node").leftJoin("session_windows as window", (join) => join.onRef("window.session_id", "=", "node.current_session_id").onRef("window.session_key", "=", "node.session_key")).leftJoin("session_canonical_validation_pending as pending", "pending.session_key", "node.session_key").select([
		"node.session_key",
		"node.current_session_id",
		"node.updated_at",
		"node.archived_at",
		"node.last_interaction_at",
		"node.entry_valid",
		"window.session_id as retained_session_id",
		"pending.session_key as pending_key"
	]).select((eb) => {
		const jsonType = (field) => eb.fn("json_type", [eb.ref("node.entry_json"), eb.val(`$.${field}`)]);
		return [
			eb("node.entry_json", "=", "{}").as("placeholder"),
			sql`${eb.ref("node.entry_json")} -> '$.lifecycleRevision'`.as("lifecycle_revision_json"),
			eb.fn("json_extract", [eb.ref("node.entry_json"), eb.val("$.worktree")]).as("worktree_json"),
			eb.or([
				eb.exists(eb.selectFrom(sql`json_each(${eb.ref("node.entry_json")})`.as("field")).select("field.key").where("field.key", "in", [
					"updatedAt",
					"archivedAt",
					"lastInteractionAt",
					"lifecycleRevision",
					"worktree"
				]).groupBy("field.key").having((fields) => fields.fn.countAll(), ">", 1)),
				eb(jsonType("lifecycleRevision"), "!=", "text"),
				eb(jsonType("worktree"), "!=", "object"),
				eb(jsonType("archivedAt"), "not in", ["integer", "real"]),
				eb(jsonType("lastInteractionAt"), "not in", ["integer", "real"]),
				eb(eb.fn("json_extract", [eb.ref("node.entry_json"), eb.val("$.updatedAt")]), "is not", eb.ref("node.updated_at")),
				eb(eb.fn("json_extract", [eb.ref("node.entry_json"), eb.val("$.archivedAt")]), "is not", eb.ref("node.archived_at")),
				eb(eb.fn("json_extract", [eb.ref("node.entry_json"), eb.val("$.lastInteractionAt")]), "is not", eb.ref("node.last_interaction_at"))
			]).as("invalid_metadata")
		];
	}).where("node.session_key", "in", sqliteStringSet(sessionKeys))).rows.flatMap((row) => {
		assertCanonicalSessionKeyWrite(row.session_key);
		if (row.entry_valid === -1 && row.placeholder && row.retained_session_id === row.current_session_id) return [];
		if (row.entry_valid !== 1 || row.pending_key !== null || row.invalid_metadata) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
		const lifecycleRevision = row.lifecycle_revision_json === null ? void 0 : JSON.parse(row.lifecycle_revision_json);
		if (lifecycleRevision !== void 0 && typeof lifecycleRevision !== "string") throw new Error("Session lifecycle revision metadata requires repair");
		return [{
			sessionKey: row.session_key,
			entry: {
				sessionId: row.current_session_id,
				updatedAt: row.updated_at,
				...row.archived_at === null ? {} : { archivedAt: row.archived_at },
				...row.last_interaction_at === null ? {} : { lastInteractionAt: row.last_interaction_at },
				...lifecycleRevision === void 0 ? {} : { lifecycleRevision },
				...row.worktree_json === null ? {} : { worktree: readWorktree(row.worktree_json) }
			}
		}];
	});
}
//#endregion
//#region src/config/sessions/session-entry-read.worker.ts
/** Hydrate a newly admitted resident store using the projection lane's native reader. */
function readSessionStoreProjection(request) {
	const env = cloneEnvWithPlatformSemantics(request.env);
	const scope = {
		agentId: request.database.agentId,
		databaseAgentId: request.database.agentId,
		storePath: request.database.path,
		projection: "list",
		clone: false,
		env
	};
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		assertOpenClawAgentDatabaseIdentity(database, request.expectedIdentity);
		const source = readOpenClawAgentDatabaseIdentity(database);
		if (typeof source.identity !== "string") throw new Error("Resident session projection requires a durable store");
		return {
			entries: listSqliteSessionEntriesFromDatabase(database, resolveSqliteScope({
				...scope,
				sessionKey: ""
			}), scope, { deferParticipants: true }),
			source: {
				identity: source.identity,
				birthtime: source.birthtime,
				filename: source.filename
			}
		};
	}, {
		...request.database,
		env
	});
	return {
		kind: "session-store-projection",
		...result.found ? result.value : { entries: [] }
	};
}
function selectsChildEntries(request) {
	return request.selection?.kind === "children";
}
/** Exact facts are one statement; richer selections retain their shared snapshot. */
function readExactSessionEntriesWithLifecycle(request, capturedDatabase) {
	if (request.sourceChecks) return readSessionSourceChecks(request, capturedDatabase);
	const { readDatabase, snapshot, assertCanonicalRead } = createSessionEntryReadScope(capturedDatabase);
	if (selectsChildEntries(request)) {
		const { parentSessionKeys } = request.selection;
		const result = readDatabase((database) => {
			assertCanonicalRead(database, request.expectedIdentity);
			return {
				kind: "session-exact-entries",
				entries: readSessionChildEntriesInDatabase(database, parentSessionKeys, request.snapshotFields ?? request.projection),
				lifecycleTimestamps: {}
			};
		}, {
			...request.database,
			env: request.env
		});
		if (!result.found && result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
		return result.found ? result.value : {
			kind: "session-exact-entries",
			entries: [],
			lifecycleTimestamps: {}
		};
	}
	if (!request.selection && (request.projection === void 0 || request.projection === "full" || request.projection === "exact") && !request.manualCompact && !request.replyInitializationSessionKey && !request.transcript && request.sessionKeys.length <= 64) {
		const result = readDatabase((database) => {
			const read = () => {
				const source = captureSessionEntryReadSource(database, request.expectedIdentity);
				const identity = readOpenClawAgentDatabaseIdentity(database);
				const facts = readExactSessionEntryFactsInDatabase(database, request.sessionKeys, request.snapshotFields ?? "full");
				return {
					kind: "session-exact-entries",
					...facts,
					source,
					databaseIdentity: {
						...identity,
						identity: source.databaseIdentity
					},
					lifecycleTimestamps: resolveSessionLifecycleTimestampsWithHeader({
						entry: facts.entries.find(({ sessionKey }) => sessionKey === request.lifecycleSessionKey)?.entry,
						agentId: database.agentId,
						sessionKey: request.lifecycleSessionKey,
						readHeader: ({ sessionId }) => readTranscriptHeaderFromDatabase(database, sessionId)
					})
				};
			};
			return read();
		}, {
			...request.database,
			env: request.env
		});
		if (result.found) return result.value;
		if (result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
		if (request.expectedIdentity?.key.startsWith("file:")) throw new Error("Session entry read lost its captured physical owner");
		return {
			kind: "session-exact-entries",
			entries: [],
			lifecycleTimestamps: {}
		};
	}
	if ((request.projection === "exact" || request.projection === "worktree") && !request.transcript) {
		let source;
		const read = readDatabase((database) => {
			try {
				var _usingCtx$1 = _usingCtx();
				source = captureSessionEntryReadSource(database, request.expectedIdentity);
				if (request.projection === "worktree" && !request.manualCompact) return { entries: readSessionWorktreeOwnerFactsInDatabase(database, request.sessionKeys) };
				const sourceGuard = _usingCtx$1.u(prepareSessionColdSourceGuard({
					...request.database,
					env: request.env
				}, request.manualCompact?.sources));
				return snapshot(database, () => {
					const entries = request.projection === "worktree" ? readSessionWorktreeOwnerFactsInDatabase(database, request.sessionKeys) : request.sessionKeys.flatMap((sessionKey) => {
						const entry = readExactSessionEntryRow(database, sessionKey, request.snapshotFields ?? "full", "canonical")?.entry;
						return entry ? [{
							sessionKey,
							entry
						}] : [];
					});
					return {
						entries,
						...request.manualCompact ? { manualCompact: {
							archive: readSessionColdTranscript(database.db, request.manualCompact.sessionId),
							refusedSource: sourceGuard.read(database, new Map(request.sessionKeys.map((key) => [key, entries.find((row) => row.sessionKey === key)?.entry]))).refusedSource
						} } : {}
					};
				});
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		}, {
			...request.database,
			env: request.env
		});
		if (!read.found && read.reason !== "database-missing") throw new SessionMetadataUnavailableError(read.reason);
		if (!read.found && request.expectedIdentity?.key.startsWith("file:")) throw new Error("Session entry read lost its captured physical owner");
		return {
			kind: "session-exact-entries",
			source,
			...read.found ? read.value : { entries: [] },
			lifecycleTimestamps: {}
		};
	}
	const result = readDatabase((database) => request.projection === "list" ? {
		kind: "session-exact-entries",
		...request.expectedIdentity ? { source: captureSessionEntryReadSource(database, request.expectedIdentity) } : {},
		entries: readSelectedSessionEntriesInDatabase(database, request.sessionKeys ?? [], {
			continuation: request.continuation,
			...request.selection?.kind === "label" ? { label: request.selection.label } : {},
			...request.selection?.kind === "session-id-or-key" ? { sessionIdOrKey: request.selection.sessionIdOrKey } : {},
			...request.selection?.kind === "transcript-aliases" ? {
				transcriptSessionIds: request.selection.sessionIds,
				transcriptSessionFiles: request.selection.sessionFiles
			} : {}
		}),
		lifecycleTimestamps: {}
	} : withSqlitePostCommitPublications(sqlPublicationAnchor(database.db), () => snapshot(database, () => {
		assertCanonicalRead(database, request.expectedIdentity);
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
		const selectedById = request.selection?.kind === "session-id" ? readSessionEntryByIdInDatabase(database, {
			sessionId: request.selection.sessionId,
			orderBy: request.selection.orderBy,
			projection: request.projection === "sharing" ? "list" : "full"
		}) : void 0;
		const selected = request.selection ? ok(selectedById ? [selectedById] : []) : expectDefined(readExactSessionEntryCandidatesInDatabase(database, [request.sessionKeys], request.projection === "sharing" ? "list" : request.snapshotFields ?? "full", { validation: capturedDatabase ? "canonical" : void 0 })[0], "exact session read result");
		if (!selected.ok) throw selected.error;
		if (request.replyInitializationSessionKey) {
			const parent = selected.value.find(({ sessionKey }) => sessionKey === request.replyInitializationSessionKey)?.entry.parentSessionKey;
			const parentKey = parent ? normalizeStoreSessionKey(parent) : void 0;
			if (parentKey && !selected.value.some(({ sessionKey }) => sessionKey === parentKey)) {
				const related = expectDefined(readExactSessionEntryCandidatesInDatabase(database, [[parentKey]], request.snapshotFields ?? "full", { validation: capturedDatabase ? "canonical" : void 0 })[0], "reply initialization parent read result");
				if (!related.ok) throw related.error;
				selected.value.push(...related.value);
			}
		}
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
			...request.includeParticipantRecords ? { participantRecords: Object.fromEntries(participantRecordsBySessionKey(database.db, request.sessionKeys ?? selected.value.map(({ sessionKey }) => sessionKey))) } : {},
			kind: "session-exact-entries",
			entries: selected.value,
			...readSessionEntryTranscriptFacts(database, request, selected.value),
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
	if (request.expectedIdentity?.key.startsWith("file:")) throw new Error("Session entry read lost its captured physical owner");
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
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => {
		const read = () => {
			const readRow = prepareExactSessionEntryRowReads(database, request.sessionKeys, "list", "canonical", {
				includeBoardPresence: true,
				includeRowTranscriptProjection: true
			});
			return {
				kind: "session-row-facts",
				rows: request.sessionKeys.flatMap((sessionKey) => {
					const selected = readRow(sessionKey);
					if (!selected) return [];
					const { entry } = selected;
					const storedTranscript = selected.row.row_transcript_window_id === null ? {
						lastMessagePreview: null,
						terminalModel: null
					} : readStoredSessionRowTranscriptProjection({
						json: selected.row.row_transcript_json,
						updatedAt: selected.row.row_transcript_updated_at,
						transcriptUpdatedAt: selected.row.row_transcript_source_updated_at,
						indexedSeq: selected.row.row_transcript_indexed_seq
					});
					const facts = {
						sessionKey,
						entry,
						hasBoard: selected.row.session_key === sessionKey && selected.row.board_present === 1,
						transcriptPreview: storedTranscript?.lastMessagePreview,
						transcriptTerminalModel: storedTranscript?.terminalModel
					};
					if (readSessionActivitySummary(entry)) facts.activitySummaryWatermark = readSessionTranscriptWatermarkInDatabase(database, entry.sessionId);
					return facts;
				})
			};
		};
		return withSqlitePostCommitPublications(sqlPublicationAnchor(database.db), () => database.db.isTransaction ? read() : runSqliteDeferredTransactionSync(database.db, read));
	}), {
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
export { readExactSessionEntriesWithLifecycle, readSessionRowDatabaseFacts, readSessionStoreProjection };
