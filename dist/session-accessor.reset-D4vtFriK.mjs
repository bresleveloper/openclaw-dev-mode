import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { n as SqliteSessionMutationConflictError, t as SessionEntryLifecycleUpsertConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { o as measureDiagnosticsTimelineSpan } from "./diagnostics-timeline-BgymzmGj.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { a as normalizeStoreSessionKey, c as resolveSessionStoreEntryCore } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { d as withSessionEntryCreationPublication } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import { s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { n as captureLifecycleDatabaseScope, o as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as assertSessionEntryCohortScope } from "./session-entry-cohort-scope-BWJvT1Qn.mjs";
import { s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { y as kickSessionEntryMaintenanceAfterWrite } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./session-accessor.entry-BLpjjUTc.mjs";
import { _ as applySessionEntryLifecycleMutation, n as createReplySessionInitializationRevision, o as mergeConcurrentReplySessionMetadata, t as cloneSessionEntries } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
//#region src/config/sessions/session-reset-entry.ts
/** The typed reply descriptor serves today's builder and the later compound projection kernel. */
function resolveReplySessionInitializationUpserts(descriptor, currentEntry) {
	if (createReplySessionInitializationRevision(currentEntry) !== descriptor.expectedRevision) return {
		kind: "stale",
		currentEntry
	};
	return {
		kind: "ready",
		entry: currentEntry ? mergeConcurrentReplySessionMetadata({
			currentEntry,
			preparedEntry: descriptor.entry,
			snapshotEntry: descriptor.snapshotEntry
		}) : descriptor.entry,
		retiredEntry: descriptor.retiredEntry
	};
}
//#endregion
//#region src/config/sessions/session-accessor.reset.ts
var SessionInitializationAgentScopeMismatchError = class extends Error {
	constructor(agentId, sessionKeyAgentId) {
		super(`Session initialization agent scope mismatch: explicit agent "${agentId}" does not match session key agent "${sessionKeyAgentId}".`);
		this.agentId = agentId;
		this.sessionKeyAgentId = sessionKeyAgentId;
		this.code = "SESSION_INITIALIZATION_AGENT_SCOPE_MISMATCH";
		this.name = "SessionInitializationAgentScopeMismatchError";
	}
};
function assertSessionInitializationAgentScope(agentId, sessionKey) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const sessionKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	if (sessionKeyAgentId && normalizeAgentId(sessionKeyAgentId) !== normalizedAgentId) throw new SessionInitializationAgentScopeMismatchError(normalizedAgentId, sessionKeyAgentId);
}
function loadReplySessionInitializationEntriesForMaintenance(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const result = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const entries = {};
		const currentKey = normalizeStoreSessionKey(params.sessionKey);
		const keys = /* @__PURE__ */ new Set([currentKey, ...params.relatedSessionKeys ?? []]);
		for (const key of keys) {
			const sessionKey = normalizeStoreSessionKey(key);
			if (!sessionKey || entries[sessionKey]) continue;
			const entry = readExactSessionEntryRow(database, sessionKey)?.entry;
			if (entry) {
				entries[sessionKey] = entry;
				if (sessionKey === currentKey && entry.parentSessionKey) keys.add(entry.parentSessionKey);
			}
		}
		return entries;
	}), toDatabaseOptions(resolveSqliteScope(params)));
	return result.found ? result.value : {};
}
async function loadReplySessionInitializationEntriesAsync(params, database, source) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const memory = captureMemoryExactSessionReader(params);
	if (memory) {
		const entries = {};
		const currentKey = normalizeStoreSessionKey(params.sessionKey);
		const keys = /* @__PURE__ */ new Set([currentKey, ...params.relatedSessionKeys ?? []]);
		for (const key of keys) {
			const sessionKey = normalizeStoreSessionKey(key);
			const entry = memory.read(sessionKey);
			if (entry) {
				entries[sessionKey] = entry;
				if (sessionKey === currentKey && entry.parentSessionKey) keys.add(entry.parentSessionKey);
			}
		}
		return entries;
	}
	if (!supportsOpenClawAgentDatabaseExecution(database)) return loadReplySessionInitializationEntriesForMaintenance(params);
	return withSessionHistoryWorkerDatabase(database, async (reader) => {
		const currentKey = normalizeStoreSessionKey(params.sessionKey);
		const snapshot = await reader.readExactEntries({
			projection: "full",
			includeAuthorization: true,
			sessionKeys: [.../* @__PURE__ */ new Set([currentKey, ...(params.relatedSessionKeys ?? []).map(normalizeStoreSessionKey)])],
			replyInitializationSessionKey: currentKey,
			env: { ...database.env ?? process.env }
		});
		reader.assertCurrent();
		if (source && (snapshot.databaseIdentity ? `file:${snapshot.databaseIdentity.identity}` !== source.key || snapshot.databaseIdentity.birthtime !== source.birthtime : source.key.startsWith("file:"))) throw new Error("Reply initialization database changed after its snapshot");
		return Object.fromEntries(snapshot.entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
	});
}
function captureReplySessionInitializationSource(params) {
	const captured = captureLifecycleDatabaseScope(resolveSqliteScope(params));
	const source = params.databaseSource ?? (supportsOpenClawAgentDatabaseExecution(toDatabaseOptions(captured)) ? readDatabasePathIdentitySync(captured.path) : void 0);
	const database = {
		...toDatabaseOptions(captured),
		path: source?.canonicalPath ?? captured.path
	};
	const assertSourceCurrent = (creating = false) => {
		if (!source) return;
		const current = readDatabasePathIdentitySync(captured.path);
		if (current.canonicalPath !== source.canonicalPath || (!creating || source.key.startsWith("file:")) && (current.key !== source.key || current.birthtime !== source.birthtime)) throw new Error("Reply initialization database changed after its snapshot");
	};
	return {
		captured,
		database,
		source,
		assertSourceCurrent
	};
}
/** Prepares data for initialization; the commit owner still rereads and checks its revision. */
async function loadReplySessionInitializationSnapshot(params, options = {}) {
	const { reader, includeLifecycle = false, assertCurrent = () => {} } = options;
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	assertCurrent();
	const storePath = resolveSessionStorePathForScope(params);
	let store;
	let databaseSource;
	let lifecycleTimestamps;
	let coldArchives;
	if (reader) {
		const sessionKey = assertSessionEntryCohortScope(reader, {
			...params,
			storePath
		});
		const prepared = await reader.withRead({
			sessionKeys: [.../* @__PURE__ */ new Set([sessionKey, ...(params.relatedSessionKeys ?? []).map(normalizeStoreSessionKey)])],
			replyInitializationSessionKey: sessionKey,
			...options.includeColdMetadata ? { includeColdMetadata: true } : {},
			...includeLifecycle ? { lifecycleSessionKey: sessionKey } : {}
		}, assertCurrent, (read) => ({
			store: Object.fromEntries(read.entries.map(({ sessionKey: key, entry }) => [key, entry])),
			lifecycleTimestamps: includeLifecycle ? read.lifecycleTimestamps : void 0,
			coldArchives: read.coldArchives
		}));
		store = prepared.store;
		lifecycleTimestamps = prepared.lifecycleTimestamps;
		coldArchives = prepared.coldArchives;
	} else {
		const { database, source } = captureReplySessionInitializationSource({
			...params,
			storePath
		});
		databaseSource = source;
		store = await loadReplySessionInitializationEntriesAsync({
			...params,
			storePath
		}, database, source);
	}
	assertCurrent();
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	return {
		...currentEntry ? { currentEntry } : {},
		readEntry: (sessionKey) => {
			const entry = resolveSessionStoreEntryCore({
				store,
				sessionKey
			}).existing;
			return entry ? { ...entry } : void 0;
		},
		revision: createReplySessionInitializationRevision(currentEntry),
		...databaseSource ? { databaseSource } : {},
		...lifecycleTimestamps ? { lifecycleTimestamps } : {},
		...coldArchives ? { coldArchives } : {}
	};
}
function createStaleReplySessionInitializationResult(currentEntry) {
	return {
		ok: false,
		...currentEntry ? { currentEntry } : {},
		reason: "stale-snapshot",
		revision: createReplySessionInitializationRevision(currentEntry)
	};
}
/** Persists one reply-session initialization result with its in-place reset boundary. */
async function commitReplySessionInitialization(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const storePath = resolveSessionStorePathForScope({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const { captured, database, source, assertSourceCurrent } = captureReplySessionInitializationSource({
		...params,
		storePath
	});
	const sessionKey = normalizeStoreSessionKey(params.sessionKey);
	const needsPreparationSnapshot = Boolean(params.prepareSessionEntry || params.bindCreation);
	let store = {};
	let currentEntry;
	let sessionEntry = params.sessionEntry;
	if (needsPreparationSnapshot) {
		store = await measureDiagnosticsTimelineSpan("reply.session.commit.fresh_read", () => loadReplySessionInitializationEntriesAsync({
			...params,
			storePath
		}, database, source));
		currentEntry = store[sessionKey] ? { ...store[sessionKey] } : void 0;
		if (createReplySessionInitializationRevision(currentEntry) !== params.expectedRevision) return createStaleReplySessionInitializationResult(currentEntry);
		if (params.prepareSessionEntry) sessionEntry = await params.prepareSessionEntry({
			...currentEntry ? { currentEntry } : {},
			readEntry: (key) => {
				const entry = resolveSessionStoreEntryCore({
					store,
					sessionKey: key
				}).existing;
				return entry ? { ...entry } : void 0;
			},
			sessionEntry
		});
	}
	let staleCommit;
	let usedMemoryBackend = false;
	let committedSessionEntry = sessionEntry;
	let beforeEntryMutationDone = false;
	const descriptor = {
		kind: "reply-initialization",
		expectedRevision: params.expectedRevision,
		entry: sessionEntry,
		snapshotEntry: params.snapshotEntry ?? params.previousEntry,
		retiredEntry: params.retiredEntry
	};
	let preparedUpserts;
	const buildEntry = async (commitEntry, readEntry) => {
		if (!needsPreparationSnapshot) for (const key of [
			sessionKey,
			...params.relatedSessionKeys ?? [],
			commitEntry?.parentSessionKey
		]) {
			if (!key) continue;
			const entry = readEntry(key);
			if (entry) store[normalizeStoreSessionKey(key)] = entry;
		}
		preparedUpserts = resolveReplySessionInitializationUpserts(descriptor, commitEntry);
		if (preparedUpserts.kind === "stale") {
			staleCommit = preparedUpserts.currentEntry ? { ...preparedUpserts.currentEntry } : null;
			return null;
		}
		committedSessionEntry = preparedUpserts.entry;
		if (!beforeEntryMutationDone) {
			await params.beforeEntryMutation?.({
				...commitEntry ? { currentEntry: { ...commitEntry } } : {},
				sessionEntry: committedSessionEntry
			});
			beforeEntryMutationDone = true;
		}
		return committedSessionEntry;
	};
	const upserts = [{
		sessionKey,
		...!needsPreparationSnapshot ? { relatedSessionKeys: params.relatedSessionKeys ?? [] } : {},
		...params.routeContext !== void 0 ? { routeContext: params.routeContext } : {},
		...params.resetBoundary ? { resetBoundary: params.resetBoundary } : {},
		buildEntry: ({ currentEntry: commitEntry, readEntry }) => buildEntry(commitEntry, readEntry)
	}];
	if (params.retiredEntry) {
		const retiredEntry = params.retiredEntry;
		upserts.push({
			sessionKey: retiredEntry.key,
			buildEntry: () => preparedUpserts?.kind === "ready" ? preparedUpserts.retiredEntry?.entry ?? null : null
		});
	}
	try {
		const mutation = {
			activeSessionKey: params.activeSessionKey,
			agentId: params.agentId,
			skipMaintenance: true,
			storePath,
			upserts,
			commitGuard: () => {
				assertSourceCurrent(true);
				params.commitGuard?.();
			}
		};
		const mutate = async () => {
			const bindCreation = params.bindCreation;
			const assertCurrent = () => params.commitGuard?.();
			if (await withSessionActorStorage({
				...params,
				storePath
			}, {
				authority: {
					assertCurrent,
					authorize: assertCurrent
				},
				lifetime: {
					assertCurrent,
					assertReadable: assertCurrent
				},
				create: true
			}, async (memory) => {
				const readEntry = (key) => memory.actor.storage.readCurrent({
					type: "session.entry.read",
					input: { sessionKey: normalizeStoreSessionKey(key) }
				}, memory.authority);
				if (!needsPreparationSnapshot) currentEntry = readEntry(sessionKey);
				const nextEntry = await buildEntry(currentEntry, (key) => normalizeStoreSessionKey(key) === sessionKey ? currentEntry : readEntry(key));
				if (!nextEntry) return true;
				const commit = async (assertCreationCurrent) => {
					committedSessionEntry = readSessionActorStorageResult(await memory.actor.storage.mutate({
						type: "session.lifecycle.reset",
						input: {
							expected: currentEntry,
							nextEntry,
							routeContext: params.routeContext,
							resetBoundary: params.resetBoundary,
							...params.retiredEntry ? { relatedReplacements: [{
								sessionKey: params.retiredEntry.key,
								expected: store[params.retiredEntry.key],
								entry: params.retiredEntry.entry
							}] } : {}
						}
					}, {
						...memory.authority,
						assertCurrent() {
							memory.authority.assertCurrent();
							assertCreationCurrent?.();
						}
					})).nextEntry;
				};
				if (bindCreation) await withSessionEntryCreationPublication({
					agentId: memory.agentId,
					sessionKey,
					file: {
						kind: "actor",
						path: memory.path,
						agentId: memory.agentId,
						databaseIdentity: memory.actor.target.database.incarnation,
						assertCurrent: () => memory.actor.assertCurrent()
					}
				}, (operation) => commit(bindCreation(operation)));
				else await commit();
				return true;
			})) {
				usedMemoryBackend = true;
				return;
			}
			if (bindCreation) {
				if (currentEntry || !source?.key.startsWith("file:")) throw new Error("The original absent session no longer has its prepared creation source");
				await withSessionEntryCreationPublication({
					agentId: params.agentId,
					sessionKey,
					file: {
						path: database.path,
						agentId: captured.agentId,
						databaseIdentity: source.key.slice(5),
						assertCurrent: assertSourceCurrent
					}
				}, async (operation) => {
					const assertCreationCurrent = bindCreation(operation);
					await applySessionEntryLifecycleMutation({
						...mutation,
						commitGuard: () => {
							mutation.commitGuard();
							assertCreationCurrent();
						}
					}, {
						...captured,
						path: database.path
					});
					if (staleCommit === void 0) params.onCreated?.({
						agentId: params.agentId,
						sessionKey,
						storePath,
						sessionId: committedSessionEntry.sessionId,
						lifecycleRevision: committedSessionEntry.lifecycleRevision,
						readSource: {
							agentId: captured.agentId,
							path: database.path,
							databaseIdentity: source.key.slice(5),
							databaseBirthtime: source.birthtime
						},
						entry: committedSessionEntry
					});
				});
			} else await applySessionEntryLifecycleMutation(mutation, {
				...captured,
				path: database.path
			});
		};
		await measureDiagnosticsTimelineSpan("reply.session.commit.mutation", mutate);
	} catch (error) {
		if (!(error instanceof SqliteSessionMutationConflictError && error.operationLabel === "session.lifecycle.reset") && (!(error instanceof SessionEntryLifecycleUpsertConflictError) || error.sessionKey !== sessionKey)) throw error;
		return createStaleReplySessionInitializationResult((await loadReplySessionInitializationEntriesAsync({
			agentId: params.agentId,
			sessionKey,
			storePath
		}, database, source?.key.startsWith("file:") ? source : void 0))[sessionKey]);
	}
	if (staleCommit !== void 0) return createStaleReplySessionInitializationResult(staleCommit ?? void 0);
	if (!usedMemoryBackend) kickSessionEntryMaintenanceAfterWrite({
		activeSessionKey: params.activeSessionKey,
		archiveDirectory: resolveSqliteTranscriptArchiveDirectory(captured),
		maintenanceConfig: params.maintenanceConfig,
		scope: {
			...captured,
			path: database.path
		},
		storePath
	});
	store[sessionKey] = committedSessionEntry;
	if (params.retiredEntry) store[params.retiredEntry.key] = params.retiredEntry.entry;
	return {
		ok: true,
		sessionEntry: { ...committedSessionEntry },
		sessionStoreView: cloneSessionEntries(store)
	};
}
//#endregion
export { commitReplySessionInitialization as n, loadReplySessionInitializationSnapshot as r, SessionInitializationAgentScopeMismatchError as t };
