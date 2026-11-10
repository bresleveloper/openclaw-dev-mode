import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { n as resolveTimestamp } from "./lifecycle-timestamps-DuPaTaAj.mjs";
import { a as normalizeStoreSessionKey, t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as readSessionActorEntryFacts, u as retainSessionActorEntryFacts } from "./session-actor-replica-D_j2y4I5.mjs";
import { i as withTranscriptLockSettlement, n as runLockedSessionTranscriptRead } from "./session-transcript-execution-read-Cv-mpCgi.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-entry-read-facts.ts
const writerReads = resolveGlobalSingleton(Symbol.for("openclaw.sessionEntryWriterReads"), () => new AsyncLocalStorage());
/** The writer lends its execution and settles accepted reads before releasing its FIFO turn. */
async function withSessionEntryWriterReads(database, reads, run) {
	return withTranscriptLockSettlement(async (queue) => {
		const context = {
			database,
			reads,
			queue,
			active: true,
			parent: writerReads.getStore()
		};
		try {
			return await writerReads.run(context, run);
		} finally {
			context.active = false;
		}
	});
}
function readFromSessionWriter(database, read) {
	let context = writerReads.getStore();
	while (context) {
		if (context.active && context.database.agentId === database.agentId && context.database.path === database.path) {
			const reads = context.reads;
			return runLockedSessionTranscriptRead(database, () => read(reads)) ?? context.queue(() => read(reads));
		}
		context = context.parent;
	}
}
function eligible(request) {
	return !request.selection && request.sessionKeys !== void 0 && request.sessionKeys.length + (request.replyInitializationSessionKey ? 1 : 0) <= 64 && request.sessionKeys.every((key) => {
		const candidates = collectSessionEntryLookupKeys(key);
		return candidates.length === 1 && candidates[0] === key;
	}) && (request.projection === void 0 || request.projection === "full" || request.projection === "sharing" || request.projection === "exact") && !request.manualCompact && !request.transcript && !request.includeAuthProfileSource && (request.projection !== "sharing" || !request.lifecycleSessionKey && !request.runtimeTarget);
}
function captureTarget(database, sessionKey) {
	const identity = readDatabasePathIdentitySync(database.path);
	if (!identity.key.startsWith("file:")) return;
	return {
		sessionKey: toUSVString(sessionKey),
		database: {
			kind: "file",
			physicalIdentity: identity.key.slice(5),
			nativeLocation: identity.canonicalPath,
			birthtime: identity.birthtime
		}
	};
}
/** The actor owner admits committed facts; callers keep their own live assertions. */
function readRetainedSessionEntryFacts(database, request, nativeOwner) {
	if (!eligible(request)) return;
	if (!readSqliteDatabaseWriteTokenForPath(database.path)) return;
	nativeOwner?.assertCurrent();
	const projection = request.projection === "sharing" ? [] : request.snapshotFields ?? "full";
	const entries = [];
	const members = {};
	const sharingMembers = [];
	const participantRecords = {};
	let source;
	let databaseIdentity;
	const sessionKeys = [...request.sessionKeys];
	for (const key of sessionKeys) {
		const target = captureTarget(database, key);
		if (!target || request.expectedIdentity && (request.expectedIdentity.key !== `file:${target.database.physicalIdentity}` || request.expectedIdentity.birthtime !== void 0 && request.expectedIdentity.birthtime !== target.database.birthtime) || nativeOwner && nativeOwner.identity !== target.database.physicalIdentity) return;
		const facts = readSessionActorEntryFacts(target, projection);
		if (!facts || request.projection === "sharing" && (!facts.entry || facts.members === void 0) || facts.snapshots !== "full" && (projection === "full" || projection.some((field) => !facts.snapshots.includes(field))) || request.includeMembers && facts.members === void 0 || request.includeParticipantRecords && facts.participants === void 0 || request.includeColdMetadata && facts.entry && !facts.coldArchiveAbsent) return;
		const incarnation = nativeOwner?.incarnation ?? facts.incarnation;
		if (request.expected && incarnation !== request.expected.incarnation) return;
		source = {
			agentId: database.agentId,
			path: database.path,
			databaseIdentity: target.database.physicalIdentity,
			databaseBirthtime: target.database.birthtime
		};
		databaseIdentity = {
			identity: target.database.physicalIdentity,
			incarnation,
			filename: database.path,
			canonicalPath: target.database.nativeLocation,
			birthtime: target.database.birthtime
		};
		if (facts.entry) {
			if (key === request.replyInitializationSessionKey && facts.entry.parentSessionKey) {
				const parentKey = normalizeStoreSessionKey(facts.entry.parentSessionKey);
				if (parentKey && !sessionKeys.includes(parentKey)) {
					const candidates = collectSessionEntryLookupKeys(parentKey);
					if (candidates.length !== 1 || candidates[0] !== parentKey) return;
					sessionKeys.push(parentKey);
				}
			}
			entries.push({
				sessionKey: key,
				entry: facts.entry
			});
			if (facts.members) {
				members[key] = facts.members;
				if (request.projection === "sharing") sharingMembers.push({
					sessionKey: key,
					identityIds: facts.members.map(({ identityId }) => identityId)
				});
			}
			if (facts.participants?.length) participantRecords[key] = facts.participants;
		}
	}
	let lifecycleTimestamps = {};
	if (request.lifecycleSessionKey) {
		const entry = entries.find(({ sessionKey }) => sessionKey === request.lifecycleSessionKey)?.entry;
		const sessionStartedAt = resolveTimestamp(entry?.sessionStartedAt);
		if (sessionStartedAt === void 0) return;
		lifecycleTimestamps = {
			sessionStartedAt,
			lastInteractionAt: resolveTimestamp(entry?.lastInteractionAt)
		};
	}
	const runtimeTarget = request.runtimeTarget;
	if (runtimeTarget && !entries.some(({ sessionKey, entry }) => sessionKey === runtimeTarget.sessionKey && entry.sessionId === runtimeTarget.sessionId)) return;
	for (const expected of request.expected?.sessions ?? []) {
		const entry = entries.find(({ sessionKey }) => sessionKey === expected.sessionKey)?.entry;
		if (!entry || entry.sessionId !== expected.sessionId || entry.lifecycleRevision !== expected.lifecycleRevision) return;
	}
	if (!source || !databaseIdentity) return;
	return {
		kind: "session-exact-entries",
		entries,
		members,
		participantRecords,
		lifecycleTimestamps,
		...request.includeColdMetadata ? { coldArchives: [] } : {},
		...runtimeTarget ? { runtimeTarget: {
			...runtimeTarget,
			storePath: database.path
		} } : {},
		source,
		databaseIdentity,
		...request.projection === "sharing" ? { sharing: {
			source: {
				agentId: database.agentId,
				path: database.path
			},
			databaseIdentity: `file:${databaseIdentity.identity}`,
			members: sharingMembers,
			placeholders: []
		} } : {}
	};
}
/** A cold batched read seeds the same owner that receives committed actor postimages. */
function retainSessionEntryReadFacts(database, request, result, before) {
	if (!eligible(request) || !before || before !== readSqliteDatabaseWriteTokenForPath(database.path) || !result.source || !result.databaseIdentity) return;
	const byKey = new Map(result.entries.map(({ sessionKey, entry }) => [toUSVString(sessionKey), entry]));
	const sessionKeys = [...request.sessionKeys];
	const parent = request.replyInitializationSessionKey ? byKey.get(request.replyInitializationSessionKey)?.parentSessionKey : void 0;
	const parentKey = parent ? normalizeStoreSessionKey(parent) : void 0;
	if (parentKey && !sessionKeys.includes(parentKey)) {
		const candidates = collectSessionEntryLookupKeys(parentKey);
		if (candidates.length === 1 && candidates[0] === parentKey) sessionKeys.push(parentKey);
	}
	if (sessionKeys.length === 0) return;
	const target = captureTarget(database, sessionKeys[0]);
	if (!target || target.database.physicalIdentity !== result.source.databaseIdentity || target.database.birthtime !== result.source.databaseBirthtime) return;
	const entries = sessionKeys.map((key) => {
		const previous = readSessionActorEntryFacts({
			...target,
			sessionKey: toUSVString(key)
		});
		const entry = byKey.get(toUSVString(key));
		const fields = request.projection === "sharing" ? [] : request.snapshotFields ?? "full";
		return {
			sessionKey: toUSVString(key),
			facts: {
				entry: previous?.entry && entry ? {
					...previous.entry,
					...entry
				} : entry,
				snapshots: previous?.snapshots === "full" || fields === "full" ? "full" : [.../* @__PURE__ */ new Set([...previous?.snapshots ?? [], ...fields])],
				members: result.members ? result.members[key] ?? [] : previous?.members,
				participants: result.participantRecords ? result.participantRecords[key] ?? [] : previous?.participants,
				projection: previous?.projection
			}
		};
	});
	retainSessionActorEntryFacts(target.database, entries, result.databaseIdentity.incarnation);
}
/**
* Standalone reads stay off the writer FIFO, like the plain reader they replace. Retained facts
* are keyed by the committed write token, so a hit or an install never outlives a commit.
*/
async function readSessionEntriesWithRetainedFacts(database, request, read) {
	if (!eligible(request)) return await read();
	const borrowed = readFromSessionWriter(database, (reads) => reads.entries(request));
	if (borrowed) return await borrowed;
	const cached = readRetainedSessionEntryFacts(database, request);
	if (cached) return cached;
	const before = readSqliteDatabaseWriteTokenForPath(database.path);
	const result = await read();
	retainSessionEntryReadFacts(database, request, result, before);
	return result;
}
/** Preserve the plain reader's error codec while reusing the complete MAIN entry projection. */
async function readSessionEntryWithRetainedFacts(database, scope, read) {
	const borrowed = readFromSessionWriter(database, (reads) => reads.entry(scope));
	if (borrowed) return await borrowed;
	const request = {
		sessionKeys: [resolveSqliteSessionKey(scope.sessionKey, scope.agentId)],
		projection: "full",
		snapshotFields: scope.projection === "list" ? [] : scope.projection === "full" ? void 0 : scope.projection
	};
	const cached = readRetainedSessionEntryFacts(database, request);
	if (cached) return {
		...ok(cached.entries[0]?.entry),
		source: cached.source
	};
	const before = readSqliteDatabaseWriteTokenForPath(database.path);
	const result = await read();
	if (result.ok && result.facts) retainSessionEntryReadFacts(database, request, result.facts, before);
	return result;
}
//#endregion
export { withSessionEntryWriterReads as a, retainSessionEntryReadFacts as i, readSessionEntriesWithRetainedFacts as n, readSessionEntryWithRetainedFacts as r, readRetainedSessionEntryFacts as t };
