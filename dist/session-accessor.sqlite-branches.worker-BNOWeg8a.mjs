import { l as prepareSqliteQuerySync, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as withFreshOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { c as transcriptEventJsonSql, d as transcriptEventNavigationSql } from "./transcript-payload-Cu49oQKq.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as scanSessionTranscriptTree, m as selectSessionTranscriptTreeTipNodes, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-D61jhi_i.mjs";
import { n as extractSessionBranchHeadline, r as projectSessionBranchEntry } from "./session-message-cut-content-NrNoi7ep.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { n as cloneSessionBranchSummaries } from "./session-accessor.sqlite-branches-BnZyeeO5.mjs";
import { t as readSessionTranscriptHotWatermark } from "./session-accessor.sqlite-transcript-watermark-read-LkTRNCnP.mjs";
//#region src/config/sessions/session-accessor.sqlite-branch-summaries.ts
/** Read navigation and selected headlines inside the branch snapshot owner's transaction. */
function readSessionBranchSummaries(database, sessionId, previous) {
	const db = getSessionKysely(database.db);
	const navigationQuery = db.selectFrom("transcript_events").select(["seq", transcriptEventNavigationSql(database.db).as("event_json")]).select((eb) => eb.selectFrom("transcript_event_identities").select("event_id").where("session_id", "=", sessionId).whereRef("seq", "=", "transcript_events.seq").limit(1).as("identity_id")).where("session_id", "=", sessionId).orderBy("seq", "asc");
	const readCandidate = prepareSqliteQuerySync(database.db, (parameter) => db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).where("seq", "=", parameter((seq) => seq)).limit(1));
	const readHeadline = (seq) => {
		const row = readCandidate(seq).rows[0];
		if (!row) throw new Error("Branch headline row is missing from the transcript snapshot");
		return extractSessionBranchHeadline(JSON.parse(row.event_json));
	};
	const active = previous?.branches.find((branch) => branch.active);
	if (previous?.appendSafe && previous.maxSeq !== null && active) {
		let tail = { ...active };
		let candidate;
		let appendSafe = true;
		for (const row of iterateSqliteQuerySync(database.db, navigationQuery.where("seq", ">", previous.maxSeq))) {
			const entry = projectSessionBranchEntry(JSON.parse(row.event_json), row.seq);
			if (!isCanonicalSessionTranscriptEntry(entry) || entry.appendMode === "side" || entry.id !== row.identity_id || typeof entry.id !== "string" || entry.id.trim() !== entry.id || entry.parentId !== tail.leafEntryId) {
				appendSafe = false;
				break;
			}
			if (entry.headlineCandidate) candidate = {
				seq: row.seq,
				previous: candidate
			};
			tail = {
				leafEntryId: entry.id,
				headline: tail.headline,
				messageCount: tail.messageCount + Number(entry.type === "message"),
				...typeof entry.timestamp === "string" ? { updatedAt: entry.timestamp } : {},
				active: true
			};
		}
		if (appendSafe) {
			tail.headline = resolveBranchHeadline(candidate, /* @__PURE__ */ new Map(), readHeadline) || tail.headline;
			return {
				branches: [tail, ...previous.branches.filter((branch) => !branch.active)],
				appendSafe
			};
		}
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
//#region src/config/sessions/session-accessor.sqlite-branches.worker.ts
function readSessionBranchSnapshot(database, request) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const databaseIdentity = readOpenClawAgentDatabaseIdentity(database).identity;
		const entry = readSessionEntryRow(database, request.sessionKey, "list")?.entry;
		if (!entry?.sessionId) return { status: "missing-session" };
		const watermark = readSessionTranscriptHotWatermark(database, entry.sessionId, { requireHot: true });
		const previous = request.previous;
		const cached = previous?.source?.sessionId === entry.sessionId && previous.source.databaseIdentity === databaseIdentity && previous.generation === watermark.generation && previous.maxSeq !== null && watermark.maxSeq !== null && previous.maxSeq <= watermark.maxSeq ? previous : void 0;
		const summaries = cached?.maxSeq === watermark.maxSeq ? cached : readSessionBranchSummaries(database, entry.sessionId, cached);
		return {
			status: "ok",
			source: typeof databaseIdentity === "string" ? {
				sessionId: entry.sessionId,
				databaseIdentity
			} : void 0,
			...watermark,
			appendSafe: summaries.appendSafe,
			branches: cloneSessionBranchSummaries(summaries.branches)
		};
	}, { operationLabel: "session branch summaries read" });
}
/** The transcript worker opens and closes its own read-only handle; only summaries leave it. */
function readSessionBranchSummariesInWorker(request) {
	const result = withFreshOpenClawAgentDatabaseReadOnly((database) => readSessionBranchSnapshot(database, request), request.database);
	return result.found ? result.value : { status: "missing-session" };
}
//#endregion
export { readSessionBranchSnapshot, readSessionBranchSummariesInWorker };
