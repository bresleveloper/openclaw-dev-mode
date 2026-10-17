import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { c as prepareSqliteQuerySync, o as iterateSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { i as withFreshOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { l as scanSessionTranscriptTree, m as selectSessionTranscriptTreeTipNodes } from "./transcript-tree-CaYJo8Xs.mjs";
import { t as projectTranscriptNavigationFields } from "./transcript-navigation-fields-BLtx25WG.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { t as readHotSessionTranscriptSnapshot } from "./session-cold-storage-read-CfuaO6_K.mjs";
import { t as readSessionTranscriptHotWatermark } from "./session-accessor.sqlite-transcript-watermark-read-CRApP3Oa.mjs";
//#region src/config/sessions/session-message-cut-content.ts
const BRANCH_HEADLINE_MAX_CHARS = 120;
function projectSessionBranchEntry(event, seq) {
	const record = asOptionalRecord(event);
	if (!record) return;
	const role = asOptionalRecord(record.message)?.role;
	const entry = {
		seq,
		headlineCandidate: record.type === "message" && (role === "user" || role === "assistant"),
		...projectTranscriptNavigationFields(record)
	};
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
function readSessionBranchSummaries(database, sessionId, previous) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "events", () => {
		const db = getSessionKysely(database.db);
		const navigationQuery = db.selectFrom("transcript_events").select(["seq", transcriptEventNavigationSql().as("event_json")]).select((eb) => eb.selectFrom("transcript_event_identities").select("event_id").where("session_id", "=", sessionId).whereRef("seq", "=", "transcript_events.seq").limit(1).as("identity_id")).where("session_id", "=", sessionId).orderBy("seq", "asc");
		const readCandidate = prepareSqliteQuerySync(database.db, (parameter) => db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).where("seq", "=", parameter((seq) => seq)).limit(1));
		const readHeadline = (seq) => {
			const row = readCandidate(seq).rows[0];
			if (!row) throw new Error("Branch headline row is missing from the transcript snapshot");
			return extractSessionBranchHeadline(JSON.parse(row.event_json));
		};
		const active = previous?.branches.find((branch) => branch.active);
		if (previous?.appendSafe && previous.maxSeq !== null && active) {
			let tail = { ...active };
			let appendSafe = true;
			for (const row of iterateSqliteQuerySync(database.db, navigationQuery.where("seq", ">", previous.maxSeq))) {
				const entry = projectSessionBranchEntry(JSON.parse(row.event_json), row.seq);
				if (!entry || entry.type !== "message" || entry.appendMode === "side" || entry.id !== row.identity_id || typeof entry.id !== "string" || entry.id.trim() !== entry.id || entry.parentId !== tail.leafEntryId) {
					appendSafe = false;
					break;
				}
				tail = {
					leafEntryId: entry.id,
					headline: (entry.headlineCandidate ? readHeadline(row.seq) : void 0) ?? tail.headline,
					messageCount: tail.messageCount + 1,
					...typeof entry.timestamp === "string" ? { updatedAt: entry.timestamp } : {},
					active: true
				};
			}
			if (appendSafe) return {
				branches: [tail, ...previous.branches.filter((branch) => !branch.active)],
				appendSafe
			};
		}
		let appendSafe = true;
		function* navigationEntries() {
			for (const row of iterateSqliteQuerySync(database.db, navigationQuery)) {
				const entry = projectSessionBranchEntry(JSON.parse(row.event_json), row.seq);
				appendSafe &&= typeof entry?.id === "string" && entry.id === row.identity_id && entry.id.trim() === entry.id;
				yield entry;
			}
		}
		const tree = scanSessionTranscriptTree(navigationEntries());
		appendSafe &&= !tree.hasInvalidLeafControl && tree.nodes.length === tree.byId.size && tree.nodes.every((node) => node.parentId === null || (tree.byId.get(node.parentId)?.index ?? Infinity) < node.index);
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
		return {
			branches,
			appendSafe
		};
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
function sessionBranchCacheKey(databasePath, sessionId) {
	return `${databasePath}\0${sessionId}`;
}
function cloneSessionBranchSummaries(branches) {
	return branches.map((branch) => ({ ...branch }));
}
function readCachedSessionBranchSummaries(database, sessionId, watermark, allowAppend = false) {
	const cacheKey = sessionBranchCacheKey(database.path, sessionId);
	const cached = sessionBranchCache.get(cacheKey);
	if (!cached || cached.identity !== readOpenClawAgentDatabaseIdentity(database).identity || cached.generation !== watermark.generation || cached.maxSeq !== watermark.maxSeq && !(allowAppend && cached.maxSeq !== null && watermark.maxSeq !== null && cached.maxSeq < watermark.maxSeq)) return;
	sessionBranchCache.delete(cacheKey);
	sessionBranchCache.set(cacheKey, cached);
	return cached;
}
function cacheSessionBranchSummaries(database, sessionId, snapshot) {
	const cacheKey = sessionBranchCacheKey(database.path, sessionId);
	sessionBranchCache.delete(cacheKey);
	sessionBranchCache.set(cacheKey, {
		branches: snapshot.branches,
		appendSafe: snapshot.appendSafe,
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
		const cached = readCachedSessionBranchSummaries(database, expected.sessionId, watermark, true);
		const summaries = cached?.maxSeq === watermark.maxSeq ? cached : readSessionBranchSummaries(database, expected.sessionId, cached);
		if (summaries !== cached) cacheSessionBranchSummaries(database, expected.sessionId, {
			...watermark,
			...summaries
		});
		return {
			status: "ok",
			...watermark,
			branches: cloneSessionBranchSummaries(summaries.branches)
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
//#endregion
export { readSessionBranchSnapshot as a, readCachedSessionBranchSummaries as i, cloneSessionBranchSummaries as n, readSessionBranchSummariesInWorker as o, invalidateSessionBranchCache as r, extractEditorText as s, cacheSessionBranchSummaries as t };
