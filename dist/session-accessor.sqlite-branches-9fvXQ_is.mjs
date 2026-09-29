import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { a as iterateSqliteQuerySync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { i as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { i as withFreshOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-_lavN1YB.mjs";
import { s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-qsg5dB6v.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, o as normalizeSqliteSessionKey, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { l as scanSessionTranscriptTree, p as selectSessionTranscriptTreeTipNodes } from "./transcript-tree-3xvvNd9-.mjs";
import { c as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { n as assertSessionTranscriptHot, t as SessionTranscriptColdError } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { n as readRestoredSessionTranscript, t as readHotSessionTranscriptSnapshot } from "./session-cold-storage-read-BK-Qc6S7.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-D14VlZZc.mjs";
import { t as readSessionTranscriptHotWatermark } from "./session-accessor.sqlite-transcript-watermark-read-CUQyYPNl.mjs";
//#region src/config/sessions/session-message-cut-content.ts
const BRANCH_HEADLINE_MAX_CHARS = 120;
function projectSessionBranchEntry(event, seq) {
	const record = asOptionalRecord(event);
	if (!record) return;
	const role = asOptionalRecord(record.message)?.role;
	const entry = {
		seq,
		headlineCandidate: record.type === "message" && (role === "user" || role === "assistant")
	};
	for (const key of [
		"type",
		"id",
		"parentId",
		"targetId",
		"appendParentId",
		"appendMode"
	]) if (Object.hasOwn(record, key)) entry[key] = record[key];
	if (typeof record.timestamp === "string" && record.timestamp.trim()) entry.timestamp = record.timestamp;
	return entry;
}
function extractSessionBranchHeadline(event) {
	const record = asOptionalRecord(event);
	const headline = record?.type === "message" ? extractHeadlineText(record.message) : void 0;
	return headline === void 0 ? void 0 : truncateBranchHeadline(headline);
}
function extractHeadlineText(messageValue) {
	const message = asOptionalRecord(messageValue);
	if (message?.role !== "user" && message?.role !== "assistant") return;
	return (message.role === "assistant" ? extractAssistantPhaseText(message) : extractEditorText(message.content ?? message.text))?.replace(/\s+/g, " ").trim() || void 0;
}
function truncateBranchHeadline(value) {
	const prefix = truncateCodePoints(value, BRANCH_HEADLINE_MAX_CHARS);
	return prefix.length === value.length ? prefix : `${truncateCodePoints(prefix, 119)}…`;
}
function extractEditorText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	return content.flatMap((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "text" && typeof record.text === "string" ? [record.text] : [];
	}).join("") || void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-branch-summaries.ts
/** Retain navigation, then read only the headline candidates needed by the final graph. */
function readSessionBranchSummaries(database, sessionId) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "events", () => {
		const db = getSessionKysely(database.db);
		const rows = iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(["seq", transcriptEventNavigationSql().as("event_json")]).where("session_id", "=", sessionId).orderBy("seq", "asc"));
		function* navigationEntries() {
			for (const row of rows) yield projectSessionBranchEntry(JSON.parse(row.event_json), row.seq);
		}
		const tree = scanSessionTranscriptTree(navigationEntries());
		const readCandidate = prepareSqliteQuerySync(database.db, (parameter) => db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).where("seq", "=", parameter((seq) => seq)).limit(1));
		const readHeadline = (seq) => {
			const row = readCandidate(seq).rows[0];
			if (!row) throw new Error("Branch headline row is missing from the transcript snapshot");
			return extractSessionBranchHeadline(JSON.parse(row.event_json));
		};
		const paths = /* @__PURE__ */ new Map();
		const headlines = /* @__PURE__ */ new Map();
		const branches = [];
		for (const node of selectSessionTranscriptTreeTipNodes(tree).toSorted((left, right) => Number(right.id === tree.leafId) - Number(left.id === tree.leafId) || right.index - left.index)) {
			const leaf = tree.byId.get(node.id);
			const summary = summarizeBranchPath(tree, leaf, paths);
			const timestamp = leaf.entry?.timestamp;
			branches.push({
				leafEntryId: leaf.id,
				headline: resolveBranchHeadline(summary?.candidate, headlines, readHeadline),
				messageCount: summary?.messageCount ?? 0,
				...typeof timestamp === "string" && timestamp.trim() ? { updatedAt: timestamp } : {},
				active: tree.leafId === leaf.id
			});
		}
		return branches;
	});
}
function summarizeBranchPath(tree, leaf, summaries) {
	const uncachedPath = [];
	const seen = /* @__PURE__ */ new Set();
	let current = leaf;
	while (!summaries.has(current.id)) {
		if (seen.has(current.id)) {
			uncachedPath.length = 0;
			break;
		}
		seen.add(current.id);
		uncachedPath.push(current);
		const parent = current.parentId === null ? void 0 : tree.byId.get(current.parentId);
		if (!parent) break;
		current = parent;
	}
	let summary = summaries.get(current.id);
	for (const node of uncachedPath.toReversed()) {
		const entry = node.entry;
		summary = {
			messageCount: (summary?.messageCount ?? 0) + (entry?.type === "message" ? 1 : 0),
			candidate: entry?.headlineCandidate ? {
				seq: entry.seq,
				previous: summary?.candidate
			} : summary?.candidate
		};
		summaries.set(node.id, summary);
	}
	return summary;
}
function resolveBranchHeadline(candidate, headlines, read) {
	const unresolved = [];
	let headline;
	let current = candidate;
	while (current) {
		if (headlines.has(current)) {
			headline = headlines.get(current);
			break;
		}
		unresolved.push(current);
		headline = read(current.seq);
		if (headline !== void 0) break;
		current = current.previous;
	}
	for (const entry of unresolved) headlines.set(entry, headline);
	return headline ?? "";
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-branches.ts
const SESSION_BRANCH_CACHE_MAX_ENTRIES = 64;
const sessionBranchCache = /* @__PURE__ */ new Map();
const pendingBranchReads = /* @__PURE__ */ new Map();
function sessionBranchCacheKey(databasePath, sessionId) {
	return `${databasePath}\0${sessionId}`;
}
function cloneSessionBranchSummaries(branches) {
	return branches.map((branch) => ({ ...branch }));
}
function readCachedSessionBranchSummaries(database, sessionId, watermark) {
	const cacheKey = sessionBranchCacheKey(database.path, sessionId);
	const cached = sessionBranchCache.get(cacheKey);
	if (!cached || cached.identity !== readOpenClawAgentDatabaseIdentity(database).identity || cached.generation !== watermark.generation || cached.maxSeq !== watermark.maxSeq) return;
	sessionBranchCache.delete(cacheKey);
	sessionBranchCache.set(cacheKey, cached);
	return cached.branches;
}
function cacheSessionBranchSummaries(database, sessionId, snapshot) {
	const cacheKey = sessionBranchCacheKey(database.path, sessionId);
	sessionBranchCache.delete(cacheKey);
	sessionBranchCache.set(cacheKey, {
		branches: snapshot.branches,
		generation: snapshot.generation,
		maxSeq: snapshot.maxSeq,
		identity: readOpenClawAgentDatabaseIdentity(database).identity
	});
	pruneMapToMaxSize(sessionBranchCache, SESSION_BRANCH_CACHE_MAX_ENTRIES);
}
function readSessionBranchSnapshot(database, expected) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		if (expected.databaseIdentity !== void 0 && readOpenClawAgentDatabaseIdentity(database).identity !== expected.databaseIdentity) return { status: "failed" };
		const entry = readSessionEntryRow(database, expected.sessionKey)?.entry;
		if (!entry?.sessionId) return { status: "missing-session" };
		if (entry.sessionId !== expected.sessionId || entry.lifecycleRevision !== expected.lifecycleRevision) return { status: "failed" };
		assertSessionTranscriptHot(database.db, expected.sessionId);
		const watermark = readSessionTranscriptHotWatermark(database, expected.sessionId);
		const cached = readCachedSessionBranchSummaries(database, expected.sessionId, watermark);
		const branches = cached ?? readSessionBranchSummaries(database, expected.sessionId);
		if (!cached) cacheSessionBranchSummaries(database, expected.sessionId, {
			...watermark,
			branches
		});
		return {
			status: "ok",
			...watermark,
			branches: cloneSessionBranchSummaries(branches)
		};
	}, { operationLabel: "session branch summaries read" });
}
/** The transcript worker opens and closes its own read-only handle; only summaries leave it. */
function readSessionBranchSummariesInWorker(request) {
	const result = withFreshOpenClawAgentDatabaseReadOnly((database) => readSessionBranchSnapshot(database, request), request.database);
	return result.found ? result.value : { status: "missing-session" };
}
function invalidateSessionBranchCache(databasePath, sessionIds) {
	for (const sessionId of uniqueStrings(sessionIds)) sessionBranchCache.delete(sessionBranchCacheKey(databasePath, sessionId));
}
async function listSessionBranches(params) {
	const sourceKey = normalizeSqliteSessionKey(params.sessionStoreKey ?? params.sessionKey);
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		...params.env ? { env: params.env } : {},
		sessionKey: sourceKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	try {
		const retained = retainOpenClawAgentDatabaseReadOnly(toDatabaseOptions(resolved));
		if (!retained.found) return { status: "missing-session" };
		const { database, claim } = retained;
		const completion = createDeferredCore();
		const controller = new AbortController();
		let unregister = () => {};
		try {
			const selected = readSessionEntryRow(database, sourceKey)?.entry;
			if (!selected?.sessionId) return { status: "missing-session" };
			const expected = {
				sessionKey: sourceKey,
				sessionId: selected.sessionId,
				lifecycleRevision: selected.lifecycleRevision
			};
			const assertCurrent = () => {
				controller.signal.throwIfAborted();
				claim.assertCurrent();
			};
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				agentId: database.agentId,
				path: database.path,
				revoke: () => controller.abort(/* @__PURE__ */ new Error("Session branch read was revoked")),
				close: () => completion.promise
			});
			const watermark = readSessionTranscriptHotWatermark(database, selected.sessionId);
			const cached = readCachedSessionBranchSummaries(database, selected.sessionId, watermark);
			let snapshot;
			if (cached) snapshot = {
				status: "ok",
				...watermark,
				branches: cached
			};
			else if (typeof claim.identity === "symbol") snapshot = readSessionBranchSnapshot(database, expected);
			else {
				const request = {
					database: {
						agentId: database.agentId,
						path: database.path
					},
					databaseIdentity: claim.identity,
					...expected
				};
				const key = JSON.stringify([
					request,
					claim.incarnation,
					watermark
				]);
				let pending = pendingBranchReads.get(key);
				if (!pending) {
					pending = (async () => {
						const { runSessionBranchSummaryWorkerRequest } = await import("./session-transcript-read-worker-runtime-C8zzVDRA.mjs");
						const read = () => {
							assertCurrent();
							return runSessionBranchSummaryWorkerRequest(request, controller.signal);
						};
						try {
							return await read();
						} catch (error) {
							if (!(error instanceof SessionTranscriptColdError)) throw error;
							return readRestoredSessionTranscript({
								...params,
								agentId: resolved.agentId,
								sessionId: selected.sessionId
							}, read, { assertCurrent });
						}
					})().finally(() => pendingBranchReads.delete(key));
					pendingBranchReads.set(key, pending);
				}
				snapshot = await pending;
			}
			assertCurrent();
			const current = readSessionEntryRow(database, sourceKey)?.entry;
			if (current?.sessionId !== expected.sessionId || current.lifecycleRevision !== expected.lifecycleRevision) return { status: "failed" };
			if (snapshot.status !== "ok") return snapshot;
			cacheSessionBranchSummaries(database, selected.sessionId, snapshot);
			return {
				status: "ok",
				branches: cloneSessionBranchSummaries(snapshot.branches)
			};
		} finally {
			try {
				claim.release();
			} finally {
				completion.resolve();
				unregister();
			}
		}
	} catch {
		return { status: "failed" };
	}
}
//#endregion
export { extractEditorText as i, listSessionBranches as n, readSessionBranchSummariesInWorker as r, invalidateSessionBranchCache as t };
