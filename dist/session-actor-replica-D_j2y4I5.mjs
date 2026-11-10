import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { D as readSqliteDatabaseScopedWriteTokenForPath, G as sqliteSessionIdWriteScope, O as readSqliteDatabaseScopedWriteTokensForPath, j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { a as sessionChanges, i as sessionChangeScopeAffectsStoredRows, n as isSessionStoreTopologyChange } from "./session-row-changes-vFaNnKNM.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { d as readPreparedSessionSharingChange, l as readPreparedSessionEntryChange, u as readPreparedSessionEntryPublicationSource } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-D61jhi_i.mjs";
import { a as transcriptEventContextEligibility } from "./session-transcript-projection-append-DGPoJ8qL.mjs";
import { t as readSessionActorBoundedHistory } from "./session-actor-bounded-history-BC9AvmFD.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-CfqWjwl5.mjs";
import { i as runWithSessionTranscriptReadFence, r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { t as sameTranscriptEntryAnchor } from "./transcript-entry-anchor-CzuOcGtx.mjs";
import { o as readPreparedSessionTranscriptChange } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import path from "node:path";
//#region src/sessions/session-row-facts.ts
/** Locators cover absence; selected-source admission supplies physical identity before row reads. */
function prepareSessionRowPublicationScope(paths, identity) {
	const storePaths = new Set(paths.flatMap((pathname) => [path.resolve(pathname), resolveUnsuffixedSqliteTargetFromSessionStorePath(pathname).path]));
	const databaseIdentities = new Set(identity === void 0 ? [] : [identity]);
	return {
		storePaths,
		databaseIdentities,
		prepareSource(database, source) {
			storePaths.add(database.path);
			storePaths.add(source.canonicalPath);
			if (source.key.startsWith("file:")) databaseIdentities.add(source.key.slice(5));
		}
	};
}
/** Stored rows have their own publication fence; display/runtime and auth refreshes do not replace them. */
function sessionChangeAffectsStoredRow(change, target) {
	if (!sessionChangeScopeAffectsStoredRows(change)) return false;
	const source = readPreparedSessionEntryPublicationSource(change);
	const matchesStore = (storePath) => source.identity !== void 0 && target.databaseIdentities.size > 0 ? target.databaseIdentities.has(source.identity) : target.storePaths.has(path.resolve(storePath)) || source.canonicalPath !== void 0 && target.storePaths.has(source.canonicalPath);
	if ("all" in change) {
		if (target.ignoreStoreTopology && isSessionStoreTopologyChange(change)) return false;
		if (typeof change.scope === "string") return true;
		return change.scope.storePath ? matchesStore(change.scope.storePath) : !change.scope.agentId || change.scope.agentId === target.agentId;
	}
	return change.storePath !== void 0 && matchesStore(change.storePath) && target.sessionKeys.includes(change.sessionKey);
}
//#endregion
//#region src/config/sessions/session-actor-replica-receipts.ts
function writeScopes(target, sessionIds) {
	return [...collectSessionEntryLookupKeys(target.sessionKey), ...sessionIds.map(sqliteSessionIdWriteScope)];
}
function scopedWriteToken(target, sessionIds) {
	return readSqliteDatabaseScopedWriteTokenForPath(target.database.nativeLocation, writeScopes(target, sessionIds));
}
function scopedWriteTokens(database, entries) {
	return readSqliteDatabaseScopedWriteTokensForPath(database.nativeLocation, entries.map(({ target, dependencySessionIds }) => writeScopes(target, dependencySessionIds)));
}
function readSessionActorParticipantPostimage(target, snapshot, change) {
	if ("all" in change || change.sessionKey !== target.sessionKey || change.factsInvalidated || change.facts?.kind !== "participants" || change.facts.projectionChanged !== false || !change.facts.records || !change.facts.actorVersion || !snapshot || readPreparedSessionEntryPublicationSource(change).identity !== target.database.physicalIdentity) return;
	const writeToken = scopedWriteToken(target, snapshot.dependencySessionIds);
	return writeToken ? {
		...snapshot,
		participants: [...change.facts.records],
		version: change.facts.actorVersion,
		writeToken
	} : void 0;
}
/** The receiving worker checks this receipt against its admitted database once. */
function readSessionActorProjectionReceiptFromCells(cells, touch, params) {
	for (const cell of cells) {
		const { database, sessionKey } = cell.target;
		const snapshot = cell.snapshot;
		if (database.kind !== "file" || database.nativeLocation !== params.path || params.sessionKey !== void 0 && sessionKey !== params.sessionKey || snapshot?.entry?.sessionId !== params.sessionId || !snapshot.transcript.projection && !snapshot.transcript.contextStats) continue;
		touch(cell);
		return {
			path: database.nativeLocation,
			sessionId: params.sessionId,
			entrySessionKey: sessionKey,
			writeToken: snapshot.writeToken,
			writeScopes: [...collectSessionEntryLookupKeys(sessionKey), ...snapshot.dependencySessionIds.map(sqliteSessionIdWriteScope)],
			facts: snapshot.transcript.projection,
			contextStats: snapshot.transcript.contextStats,
			contextStatsVersion: snapshot.transcript.version
		};
	}
}
//#endregion
//#region src/config/sessions/session-actor-transcript-anchors.ts
/** Project only facts held by the current actor; unsupported history selections stay with its reader. */
function readSessionActorTranscriptAnchors(hot, scope, selection, tail) {
	if (hot.transcript.anchorsState !== "resident" || selection.includeHeader || selection.includeMetadata || selection.activePathEntryId !== void 0) return;
	const current = hot.entry;
	const watermark = hot.transcript.watermark;
	const contextAuthority = selection.contextAuthority ? {
		entry: current && {
			sessionId: current.sessionId,
			updatedAt: current.updatedAt,
			lifecycleRevision: current.lifecycleRevision,
			activeWriterRunId: current.activeWriterRunId,
			cliHistoryBoundary: current.cliHistoryBoundary,
			permissionMode: current.permissionMode
		},
		watermark
	} : void 0;
	if (selection.contextAuthority && (!current || current.sessionId !== scope.sessionId || selection.contextAuthority !== true && current.permissionMode !== selection.contextAuthority.permissionMode)) return {
		anchors: [],
		contextAuthority
	};
	const replay = selection.replayValidation;
	if (replay) {
		if (!current && replay.allowInitial) return;
		if (!current || current.sessionId !== scope.sessionId || replay.expectedLifecycleRevision !== void 0 && current.lifecycleRevision !== replay.expectedLifecycleRevision || replay.expectedWriterRunId !== void 0 && current.activeWriterRunId !== replay.expectedWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
	}
	if (current?.sessionId !== scope.sessionId) return;
	const resolveFence = (admission) => runWithSessionTranscriptReadFence(admission, () => resolveSqliteSessionTranscriptReadFence({
		database: { path: scope.path },
		...scope,
		sessionKey: hot.target.sessionKey
	}));
	const fence = replay ? resolveFence(replay.admission) : void 0;
	const context = selection.contextValidation;
	if (context?.admission && !resolveFence(context.admission)) throw new SessionTranscriptReadFenceError("Current-turn transcript admission is no longer readable");
	if (context?.through) {
		const through = context.through;
		if (through.agentId !== scope.agentId || through.storePath !== scope.path || through.sessionId !== scope.sessionId || through.sessionKey !== hot.target.sessionKey) throw new SessionTranscriptReadFenceError("Completed-turn anchor belongs to another transcript");
		const expected = context.expectedAuthority;
		if (expected && (!current || current.sessionId !== scope.sessionId || current.permissionMode !== expected.permissionMode || (current.lifecycleRevision ?? null) !== (expected.lifecycleRevision ?? null))) throw new SessionTranscriptReadFenceError("Session transcript source was deleted, replaced, or changed lifecycle or permissions.");
		if (!sameTranscriptEntryAnchor(through, hot.transcript.anchors.find((anchor) => anchor.entryId === through.entryId))) throw new SessionTranscriptReadFenceError("Completed-turn transcript anchor changed");
	} else if (context && !context.admission) {
		const version = hot.transcript.version;
		if (version.generation !== context.version?.generation || version.rawSeq !== context.version?.rawSeq || version.updatedAt !== context.version?.updatedAt) {
			if (!replay) return;
			throw new SessionTranscriptReadFenceError("Session transcript changed during context read");
		}
	}
	const messagePresence = tail?.events.some(({ event }) => asOptionalRecord(event)?.type === "message");
	if (selection.includeMessagePresence && !messagePresence && tail?.coveredAfterSeq !== -1) return;
	const available = new Map(hot.transcript.anchors.filter((anchor) => !fence || anchor.rawSeq < fence.beforeRawSeq).map((anchor) => [anchor.entryId, anchor]));
	const selected = selection.entryIds.flatMap((entryId) => available.get(entryId) ?? []);
	const facts = {
		anchors: selected,
		...contextAuthority ? { contextAuthority } : {},
		...context ? { contextValidated: true } : {},
		...replay ? { replayValidated: "current" } : {},
		...selection.includeSession ? { session: current && {
			sessionId: current.sessionId,
			lifecycleRevision: current.lifecycleRevision
		} } : {},
		...selection.includeWatermark ? { watermark } : {},
		...selection.includeMessagePresence ? { messagePresence: messagePresence ?? false } : {}
	};
	if (selection.afterSeq === void 0) return facts;
	if (!tail || selection.afterSeq < tail.coveredAfterSeq) return;
	const rows = tail.events.filter((row) => row.rawSeq > selection.afterSeq);
	if (selection.includeMessagesForRunId !== void 0 && rows.some(({ event }) => asOptionalRecord(event)?.type === "reset")) return;
	const requested = new Map(selection.entryIds.map((entryId) => [entryId, available.get(entryId)]));
	const entries = [];
	for (const { event } of rows) {
		const row = asOptionalRecord(event);
		const message = asOptionalRecord(row?.message);
		if (typeof row?.id !== "string" || message?.role !== "user" && message?.role !== "assistant") continue;
		const runId = readSessionTranscriptRunId(message);
		const includeMessage = selection.includeMessagesForRunId !== void 0 && message.role === "assistant" && runId === selection.includeMessagesForRunId;
		const anchor = message.role === "user" || includeMessage ? available.get(row.id) : requested.get(row.id);
		if (message.role === "user" || includeMessage) requested.set(row.id, anchor);
		entries.push({
			entryId: row.id,
			role: message.role,
			...runId ? { runId } : {},
			...anchor ? { anchor } : {},
			...includeMessage && anchor ? { message } : {}
		});
	}
	return {
		...facts,
		anchors: selection.includeMessagesForRunId ? [...requested.values()].flatMap((anchor) => anchor ?? []) : selected,
		tail: {
			lastSeq: rows.at(-1)?.rawSeq,
			entries
		}
	};
}
//#endregion
//#region src/config/sessions/session-actor-transcript-replica.ts
function sameSessionActorTranscriptVersion(left, right) {
	return left.generation === right.generation && left.rawSeq === right.rawSeq && left.updatedAt === right.updatedAt;
}
function simplePath(rows) {
	let parent = null;
	for (const { event } of rows) {
		if (!isRecord(event)) return;
		if (event.type === "session") continue;
		if (!isCanonicalSessionTranscriptEntry(event) || [
			"reset",
			"compaction",
			"branch_summary"
		].includes(event.type) || event.appendMode === "side" || typeof event.id !== "string" || event.parentId !== parent || transcriptEventContextEligibility(event) === 0) return;
		parent = event.id;
	}
	return { activeLeafEntryId: parent };
}
function fits(rows, limits) {
	return rows.filter((row) => !isRecord(row.event) || row.event.type !== "session").length <= limits.maxEvents && rows.reduce((bytes, row) => bytes + row.serializedBytes, 0) <= limits.maxBytes;
}
function boundedTail(events, coveredAfterSeq) {
	let bytes = events.reduce((sum, row) => sum + row.serializedBytes, 0);
	let afterSeq = coveredAfterSeq;
	while (events.length > 128 || bytes > 524288) {
		const removed = events.shift();
		bytes -= removed.serializedBytes;
		afterSeq = removed.rawSeq;
	}
	return {
		events,
		coveredAfterSeq: afterSeq
	};
}
function rewriteSessionActorTranscriptReplica(previous, rewrite) {
	const { postimage } = rewrite;
	if (!previous || previous.sessionId !== postimage.entry?.sessionId || !sameSessionActorTranscriptVersion(previous.version, rewrite.before)) return;
	const rewritten = new Map(rewrite.rows.map((row) => [row.rawSeq, row]));
	const patch = (rows) => rows.map((row) => rewritten.get(row.rawSeq) ?? row);
	const next = {
		version: postimage.transcript.version,
		sessionId: previous.sessionId,
		tail: boundedTail(patch(previous.tail.events), previous.tail.coveredAfterSeq)
	};
	if (previous.context?.rows) {
		const rows = patch(previous.context.rows);
		const path = simplePath(rows);
		if (path && fits(rows, previous.context.limits)) next.context = {
			...previous.context,
			rows,
			...path
		};
	}
	return next;
}
function seedSessionActorTranscriptContext(retained, hot, prepared, limits, admission) {
	if (!sameSessionActorTranscriptVersion(hot.transcript.version, prepared.snapshot.version)) return retained;
	const current = retained && sameSessionActorTranscriptVersion(retained.version, hot.transcript.version) ? retained : {
		version: hot.transcript.version,
		sessionId: hot.entry?.sessionId,
		tail: {
			events: [],
			coveredAfterSeq: hot.transcript.version.rawSeq ?? -1
		}
	};
	if (!prepared.residentRows && current.context) return current;
	const snapshot = structuredClone(prepared.snapshot);
	const rows = prepared.residentRows?.map((row, index) => ({
		...row,
		event: snapshot.events[index]
	}));
	let complete;
	if (rows && !prepared.snapshot.truncated && prepared.snapshot.boundaryCount === 0) {
		const known = new Map(rows.map((row) => [row.rawSeq, row]));
		for (const row of current.tail.events) if (row.rawSeq > (rows.at(-1)?.rawSeq ?? -1)) known.set(row.rawSeq, row);
		const candidates = [...known.values()].toSorted((a, b) => a.rawSeq - b.rawSeq);
		if (candidates.filter((row) => isRecord(row.event) && row.event.type !== "session").length === prepared.snapshot.totalEvents && simplePath(candidates) && fits(candidates, limits)) complete = candidates;
	}
	return {
		...current,
		context: complete ? {
			limits: { ...limits },
			rows: complete,
			activeLeafEntryId: prepared.snapshot.activeLeafEntryId
		} : {
			limits: { ...limits },
			exact: {
				kind: "bounded",
				snapshot
			},
			admission: admission && { ...admission }
		}
	};
}
function advanceSessionActorTranscriptReplica(previous, outcome) {
	const { transcript, postimage } = outcome.receipt;
	const unchanged = sameSessionActorTranscriptVersion(transcript.before, transcript.after);
	const retained = previous && previous.sessionId === postimage.entry?.sessionId && sameSessionActorTranscriptVersion(previous.version, transcript.before) ? previous : void 0;
	if (unchanged && retained) return retained;
	const appended = transcript.appendedEvents;
	const contiguous = retained && appended && !transcript.projectionNeedsReconcile && transcript.before.generation === transcript.after.generation;
	const events = [...contiguous ? retained.tail.events : [], ...appended ?? []];
	const coveredAfterSeq = contiguous ? retained.tail.coveredAfterSeq : transcript.before.rawSeq ?? -1;
	const next = {
		version: transcript.after,
		sessionId: postimage.entry?.sessionId,
		tail: boundedTail(events, appended ? coveredAfterSeq : transcript.after.rawSeq ?? -1)
	};
	if (contiguous && retained.context?.rows) {
		const rows = [...retained.context.rows, ...appended];
		const path = simplePath(rows);
		if (path && fits(rows, retained.context.limits)) next.context = {
			limits: retained.context.limits,
			rows,
			...path
		};
	}
	return next;
}
function readSessionActorTranscriptContext(retained, hot, limits, admission) {
	const context = retained?.context;
	if (!retained || !context || retained.sessionId !== hot.entry?.sessionId || !sameSessionActorTranscriptVersion(retained.version, hot.transcript.version) || context.limits.maxBytes !== limits.maxBytes || context.limits.maxEvents !== limits.maxEvents) return;
	if (!context.rows) {
		if (JSON.stringify(context.admission) !== JSON.stringify(admission)) return;
		return structuredClone(context.exact);
	}
	const events = admission ? context.rows.filter((row) => row.rawSeq < admission.rawSeq) : context.rows;
	const result = readSessionActorBoundedHistory({
		hot,
		events
	}, limits);
	result.snapshot.totalEvents = context.rows.filter((row) => isRecord(row.event) && row.event.type !== "session").length;
	if (admission) {
		result.snapshot.activeLeafEntryId = admission.effectiveParentId;
		delete result.snapshot.completeActivePath;
	}
	return result;
}
//#endregion
//#region src/config/sessions/session-actor-replica.ts
const MAX_SNAPSHOTS = 128;
const MAX_BYTES = 8388608;
function estimateReplicaBytes(value) {
	if (typeof value === "string") return 16 + value.length * 2;
	if (!value || typeof value !== "object") return 8;
	if (Array.isArray(value)) return value.reduce((bytes, child) => bytes + 16 + estimateReplicaBytes(child), 32);
	let bytes = 32;
	for (const key in value) bytes += 16 + key.length * 2 + estimateReplicaBytes(Reflect.get(value, key));
	return bytes;
}
const pool = resolveGlobalSingleton(Symbol.for("openclaw.sessionActorReplicas"), () => ({
	cells: /* @__PURE__ */ new Map(),
	snapshots: 0,
	bytes: 0
}), (owner) => {
	owner.unsubscribe?.();
	owner.unsubscribe = void 0;
	for (const cell of owner.cells.values()) discard(cell);
	owner.cells.clear();
	owner.snapshots = 0;
	owner.bytes = 0;
});
function ensureReplicaSubscription() {
	if (pool.unsubscribe) return;
	pool.unsubscribe = sessionChanges.subscribeFacts((change) => {
		const cellsBeforePublication = [...pool.cells.values()];
		const publishedKey = !("all" in change) && !change.factsInvalidated ? change.sessionKey : void 0;
		const created = publishedKey ? readPreparedSessionEntryChange(change, publishedKey) : void 0;
		if (publishedKey && created?.fullEntry && typeof created.source.identity === "string") {
			const target = {
				sessionKey: publishedKey,
				database: {
					kind: "file",
					physicalIdentity: created.source.identity,
					birthtime: created.source.birthtime,
					nativeLocation: created.source.canonicalPath ?? created.source.filename
				}
			};
			if (!pool.cells.has(targetKey(target)) && created.source.writeToken === readSqliteDatabaseWriteTokenForPath(target.database.nativeLocation)) retainSessionActorEntryFacts(target.database, [{
				sessionKey: target.sessionKey,
				facts: {
					entry: created.fullEntry,
					snapshots: "full",
					projection: created.projection
				}
			}], created.source.incarnation);
		}
		for (const cell of cellsBeforePublication) {
			const { database, sessionKey } = cell.target;
			if (database.kind !== "file" || !sessionChangeAffectsStoredRow(change, {
				sessionKeys: collectSessionEntryLookupKeys(sessionKey),
				storePaths: /* @__PURE__ */ new Set([database.nativeLocation]),
				databaseIdentities: /* @__PURE__ */ new Set([database.physicalIdentity])
			})) continue;
			const prepared = !("all" in change) && !change.factsInvalidated && change.sessionKey === sessionKey ? readPreparedSessionEntryChange(change, sessionKey) : void 0;
			const source = readPreparedSessionEntryPublicationSource(change);
			const unchangedMarker = !prepared && !("all" in change) && !change.factsInvalidated && (!change.facts || change.facts.kind === "unchanged");
			const unchangedEntry = unchangedMarker && cell.entry ? {
				...cell.entry,
				projection: void 0
			} : void 0;
			const previousTranscript = cell.transcript;
			const participantPostimage = readSessionActorParticipantPostimage({
				database,
				sessionKey
			}, cell.snapshot, change);
			const previous = cell.snapshot ?? cell.entry;
			const previousProjection = cell.snapshot ? { hasBoard: cell.snapshot.hasBoard } : cell.entry?.projection;
			discard(cell);
			if (participantPostimage) {
				retainSnapshot(cell, participantPostimage, cell.generation);
				if (previousTranscript) retainTranscript(cell, previousTranscript);
				continue;
			}
			const transcript = readPreparedSessionTranscriptChange(change);
			const rewrite = publishedKey === sessionKey && transcript?.kind === "postimage" ? transcript.value.actorRewrite : void 0;
			if (rewrite && source.identity === database.physicalIdentity && rewrite.postimage.writeToken === scopedWriteToken({
				database,
				sessionKey
			}, rewrite.postimage.dependencySessionIds)) {
				retainSnapshot(cell, rewrite.postimage, cell.generation);
				const retained = rewriteSessionActorTranscriptReplica(previousTranscript, rewrite);
				if (retained) retainTranscript(cell, retained);
				continue;
			}
			if (!("all" in change) && !change.factsInvalidated && change.facts?.kind === "participants" && previousTranscript) retainTranscript(cell, previousTranscript);
			if (unchangedEntry) retainEntry(cell, unchangedEntry);
			if (prepared && source.identity === database.physicalIdentity && prepared.source.writeToken === readSqliteDatabaseWriteTokenForPath(database.nativeLocation)) {
				if (prepared.actorPostimage) {
					retainSnapshot(cell, prepared.actorPostimage, prepared.source.incarnation);
					if (previousTranscript && previousTranscript.sessionId === prepared.actorPostimage.entry?.sessionId && sameSessionActorTranscriptVersion(previousTranscript.version, prepared.actorPostimage.transcript.version)) retainTranscript(cell, previousTranscript);
					continue;
				}
				if (!prepared.fullEntry) {
					forgetUnused(cell);
					continue;
				}
				const dependencySessionIds = [prepared.fullEntry.sessionId];
				const writeToken = scopedWriteToken({
					database,
					sessionKey
				}, dependencySessionIds);
				if (writeToken) {
					const projection = prepared.projection ?? (previous?.entry?.sessionId === prepared.fullEntry.sessionId && previous.entry.lifecycleRevision === prepared.fullEntry.lifecycleRevision && previousProjection ? { hasBoard: previousProjection.hasBoard } : void 0);
					const sharingUnchanged = readPreparedSessionSharingChange(change) === "unchanged";
					retainEntry(cell, {
						target: cell.target,
						entry: structuredClone(prepared.fullEntry),
						dependencySessionIds,
						writeToken,
						snapshots: "full",
						projection,
						members: sharingUnchanged ? previous?.members : void 0,
						participants: sharingUnchanged ? previous?.participants : void 0
					});
				}
			}
			if (!change.factsInvalidated && !unchangedMarker) forgetUnused(cell);
		}
	});
}
function targetKey(target) {
	const { database, sessionKey } = target;
	return JSON.stringify(database.kind === "file" ? [
		database.kind,
		database.physicalIdentity,
		database.birthtime,
		sessionKey
	] : [
		database.kind,
		database.handle,
		database.incarnation,
		sessionKey
	]);
}
function discard(cell) {
	if (cell.snapshot || cell.entry || cell.transcript) pool.snapshots -= 1;
	pool.bytes -= cell.bytes;
	cell.transcript = void 0;
	cell.snapshot = void 0;
	cell.entry = void 0;
	cell.bytes = 0;
}
function retainEntry(cell, entry) {
	discard(cell);
	cell.entry = entry;
	cell.bytes = estimateReplicaBytes(entry);
	pool.snapshots += 1;
	pool.bytes += cell.bytes;
	touch(cell);
}
function retainSnapshot(cell, state, generation) {
	if (cell.snapshot === state && cell.generation === generation) return touch(cell);
	const previousTranscript = cell.transcript;
	discard(cell);
	cell.snapshot = state;
	cell.generation = generation;
	cell.bytes = estimateReplicaBytes(state);
	pool.snapshots += 1;
	pool.bytes += cell.bytes;
	if (previousTranscript && previousTranscript.sessionId === state.entry?.sessionId && sameSessionActorTranscriptVersion(previousTranscript.version, state.transcript.version)) retainTranscript(cell, previousTranscript);
	touch(cell);
}
function retainTranscript(cell, transcript) {
	if (!cell.snapshot && !cell.entry && !cell.transcript) pool.snapshots += 1;
	const previousBytes = cell.transcript ? estimateReplicaBytes(cell.transcript) : 0;
	const bytes = estimateReplicaBytes(transcript);
	cell.transcript = transcript;
	cell.bytes += bytes - previousBytes;
	pool.bytes += bytes - previousBytes;
	touch(cell);
}
/** The caller already borrowed this immutable postimage under its live actor authority. */
function readSessionActorTranscriptReplica(state) {
	const cell = pool.cells.get(targetKey(state.target));
	return cell?.snapshot?.writeToken === state.writeToken ? cell.transcript : void 0;
}
function retainSessionActorTranscriptReplica(state, transcript) {
	const cell = pool.cells.get(targetKey(state.target));
	if (cell?.snapshot?.writeToken === state.writeToken) retainTranscript(cell, transcript);
}
function forgetUnused(cell) {
	const key = targetKey(cell.target);
	const empty = !cell.snapshot && !cell.entry && !cell.transcript;
	if (!cell.handles && empty && pool.cells.get(key) === cell) pool.cells.delete(key);
}
function touch(cell) {
	const key = targetKey(cell.target);
	const replaced = pool.cells.get(key);
	if (replaced && replaced !== cell) discard(replaced);
	pool.cells.delete(key);
	pool.cells.set(key, cell);
	for (const candidate of pool.cells.values()) {
		if (!candidate.snapshot && !candidate.entry && !candidate.transcript) {
			forgetUnused(candidate);
			continue;
		}
		if (pool.cells.size <= MAX_SNAPSHOTS && pool.snapshots <= MAX_SNAPSHOTS && (pool.bytes <= MAX_BYTES || pool.snapshots === 1)) break;
		discard(candidate);
		forgetUnused(candidate);
	}
}
function readSessionActorProjectionReceipt(params) {
	return readSessionActorProjectionReceiptFromCells(pool.cells.values(), touch, params);
}
function readCurrentEntryCell(target, admitted) {
	ensureReplicaSubscription();
	const cell = pool.cells.get(targetKey(target));
	const state = cell?.snapshot ?? cell?.entry;
	if (!cell || !state || cell.generation === void 0) return;
	const token = scopedWriteToken(target, state.dependencySessionIds);
	if (admitted && (admitted.key !== `file:${target.database.physicalIdentity}` || admitted.birthtime !== target.database.birthtime) || token && token !== state.writeToken) {
		discard(cell);
		forgetUnused(cell);
		return;
	}
	if (token) touch(cell);
	return token ? {
		cell,
		state,
		incarnation: cell.generation
	} : void 0;
}
/** Entry projections share actor residency; they never certify live authority. */
function readSessionActorEntryFacts(target, snapshotFields = "full") {
	const current = readCurrentEntryCell(target);
	if (!current) return;
	const { cell, state, incarnation } = current;
	const snapshots = cell.snapshot ? "full" : cell.entry?.snapshots ?? "full";
	return structuredClone({
		target,
		entry: state.entry && snapshotFields !== "full" ? attachSessionEntrySnapshots({ ...state.entry }, {}, snapshotFields) : state.entry,
		members: state.members,
		participants: state.participants,
		coldArchiveAbsent: cell.snapshot?.transcript.modelContext.kind === "resident" || cell.snapshot?.transcript.modelContext.reason === "projection",
		snapshots: snapshotFields === "full" ? snapshots : snapshotFields.filter((field) => snapshots === "full" || snapshots.includes(field)),
		projection: cell.snapshot ? {
			hasBoard: cell.snapshot.hasBoard,
			activitySummaryWatermark: cell.snapshot.transcript.watermark
		} : cell.entry?.projection,
		dependencySessionIds: state.dependencySessionIds,
		writeToken: state.writeToken,
		incarnation
	});
}
function readCurrentEntryCellForPath(params, admitted) {
	ensureReplicaSubscription();
	for (const { target } of pool.cells.values()) {
		const { database, sessionKey } = target;
		if (database.kind === "file" && database.nativeLocation === params.path && sessionKey === params.sessionKey) return readCurrentEntryCell({
			database,
			sessionKey
		}, admitted);
	}
}
/** Only the complete actor postimage covers pending-input absence for its current window. */
function hasSessionActorEmptyPendingInputHistory(admitted, sessionKey, sessionId) {
	const snapshot = readCurrentEntryCellForPath({
		path: admitted.canonicalPath,
		sessionKey
	}, admitted)?.cell.snapshot;
	return snapshot?.entry?.sessionId === sessionId && snapshot.pendingInputs.every((row) => row.consumed_event_id !== null);
}
/** Complete transcript bodies share the actor's receipt token and bounded residency. */
function readSessionActorCompleteTranscriptFromReplica(params) {
	const current = readCurrentEntryCellForPath(params);
	const snapshot = current?.cell.snapshot;
	const context = current?.cell.transcript?.context;
	return snapshot?.entry?.sessionId === params.sessionId && context?.rows ? {
		snapshot,
		rows: context.rows,
		activeLeafEntryId: context.activeLeafEntryId
	} : void 0;
}
/** Recorded transcript facts survive actor release; delivery authority stays with the caller. */
function readSessionActorTranscriptAnchorsFromReplica(params, selection) {
	const current = readCurrentEntryCellForPath(params);
	const snapshot = current?.cell.snapshot;
	return snapshot && snapshot.entry?.sessionId === params.sessionId ? readSessionActorTranscriptAnchors(snapshot, params, selection, current?.cell.transcript?.tail) : void 0;
}
/** Reuse complete actor facts before requesting the same row from the history worker. */
function readSessionActorRowFacts(params) {
	const current = readCurrentEntryCellForPath(params);
	const state = current?.state;
	const projection = current?.cell.snapshot ? {
		hasBoard: current.cell.snapshot.hasBoard,
		activitySummaryWatermark: current.cell.snapshot.transcript.watermark
	} : current?.cell.entry?.projection;
	if (!state?.entry || !projection) return;
	const summary = readSessionActivitySummary(state.entry);
	if (summary && !projection.activitySummaryWatermark) return;
	return structuredClone({
		sessionKey: params.sessionKey,
		entry: attachSessionEntrySnapshots({ ...state.entry }, {}, "list"),
		hasBoard: projection.hasBoard,
		...summary ? { activitySummaryWatermark: projection.activitySummaryWatermark } : {}
	});
}
/** A single cold entry batch and actor commands publish into the same bounded MAIN owner. */
function retainSessionActorEntryFacts(database, entries, incarnation) {
	ensureReplicaSubscription();
	const prepared = entries.map(({ sessionKey, facts }) => ({
		target: {
			database,
			sessionKey
		},
		facts,
		dependencySessionIds: facts.entry ? [facts.entry.sessionId] : []
	}));
	const tokens = scopedWriteTokens(database, prepared);
	if (!tokens) return;
	for (const [index, { target, facts, dependencySessionIds }] of prepared.entries()) {
		const writeToken = tokens[index];
		const key = targetKey(target);
		let cell = pool.cells.get(key);
		if (!cell) {
			cell = {
				target,
				handles: 0,
				bytes: 0
			};
			pool.cells.set(key, cell);
		}
		if (cell.snapshot) {
			if (scopedWriteToken(target, cell.snapshot.dependencySessionIds) === cell.snapshot.writeToken) {
				touch(cell);
				continue;
			}
		}
		cell.generation = incarnation;
		retainEntry(cell, structuredClone({
			...facts,
			target,
			dependencySessionIds,
			writeToken
		}));
	}
}
/** Handles retain their own authority; complete physical postimages survive handle release. */
function createSessionActorReplica(params) {
	ensureReplicaSubscription();
	const target = structuredClone(params.target);
	const key = targetKey(target);
	let cell = pool.cells.get(key);
	if (!cell) {
		cell = {
			target,
			handles: 0,
			bytes: 0
		};
		pool.cells.set(key, cell);
	}
	const owned = cell;
	owned.handles += 1;
	let closed = false;
	const invalidate = () => {
		discard(owned);
		forgetUnused(owned);
	};
	const generation = () => {
		try {
			return params.currentGeneration();
		} catch {
			return;
		}
	};
	const currentToken = (state) => {
		const { database, sessionKey } = target;
		return scopedWriteToken({
			database,
			sessionKey
		}, state.dependencySessionIds);
	};
	const accepts = (state, expectedGeneration, writeToken = currentToken(state)) => expectedGeneration !== void 0 && expectedGeneration === generation() && targetKey(state.target) === key && state.writeToken === writeToken;
	const install = (state, expectedGeneration) => {
		if (!accepts(state, expectedGeneration)) return false;
		retainSnapshot(owned, state, expectedGeneration);
		return owned.snapshot !== void 0;
	};
	const begin = () => {
		params.lifetime.assertCurrent();
		if (closed) throw new Error("Session actor replica is closed");
		return generation();
	};
	return {
		/** Borrow the immutable revision only after validating its current physical generation. */
		read() {
			params.lifetime.assertReadable();
			if (closed || !owned.snapshot) return;
			const token = currentToken(owned.snapshot);
			if (token === void 0) return;
			if (!accepts(owned.snapshot, owned.generation, token)) {
				discard(owned);
				forgetUnused(owned);
				return;
			}
			touch(owned);
			return owned.snapshot;
		},
		beginRead() {
			const expectedGeneration = begin();
			return (state) => install(state, expectedGeneration);
		},
		beginCommand() {
			const previous = owned.snapshot;
			const previousTranscript = owned.transcript;
			const previousGeneration = owned.generation;
			const expectedGeneration = begin();
			return { settle(outcome) {
				if (outcome.kind === "rolled-back") {
					const restored = previous !== void 0 && install(previous, previousGeneration);
					if (restored && previousTranscript) retainTranscript(owned, previousTranscript);
					return restored;
				}
				if (outcome.kind === "unknown") {
					discard(owned);
					return false;
				}
				if (outcome.kind === "stale-version") return install(outcome.postimage, expectedGeneration);
				const installed = install(outcome.receipt.postimage, expectedGeneration);
				if (installed) retainTranscript(owned, advanceSessionActorTranscriptReplica(previousTranscript, outcome));
				return installed;
			} };
		},
		invalidate,
		close() {
			if (closed) return;
			closed = true;
			owned.handles -= 1;
			forgetUnused(owned);
		}
	};
}
//#endregion
export { readSessionActorEntryFacts as a, readSessionActorTranscriptAnchorsFromReplica as c, retainSessionActorTranscriptReplica as d, readSessionActorTranscriptContext as f, sessionChangeAffectsStoredRow as g, prepareSessionRowPublicationScope as h, readSessionActorCompleteTranscriptFromReplica as i, readSessionActorTranscriptReplica as l, readSessionActorTranscriptAnchors as m, ensureReplicaSubscription as n, readSessionActorProjectionReceipt as o, seedSessionActorTranscriptContext as p, hasSessionActorEmptyPendingInputHistory as r, readSessionActorRowFacts as s, createSessionActorReplica as t, retainSessionActorEntryFacts as u };
