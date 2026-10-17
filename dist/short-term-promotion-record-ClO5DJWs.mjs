import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { y as formatMemoryDreamingDay } from "./dreaming-D1wokp9N.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as inspectWorkspaceFile } from "./memory-workspace-files-docED8m2.mjs";
import "./memory-core-host-status-Dr95_6D1.mjs";
import { t as appendMemoryHostEvent } from "./memory-host-events-gTbbZe8r.mjs";
import { n as resolveMemoryCoreTimestamp, t as resolveMemoryCoreNowMs } from "./time-BhFVUM0b.mjs";
import { A as hashQuery, C as buildDailyClaimEntryKey, E as clampScore, F as mergeProjectKeyLists, I as mergeRecentDistinct, J as truncateShortTermSnippet, L as normalizeIsoDay, N as isShortTermMemoryPath, P as isShortTermSessionCorpusPath, R as normalizeMemoryPath, S as buildClaimHash, V as normalizeSnippet, Y as deriveConceptTags, b as writeStore, g as readStore, j as isContaminatedDreamingSnippet, tt as withMemoryWorkspaceLock, w as buildEntryKey } from "./dreaming-dreams-file-V27TxMsY.mjs";
import { i as recordMemoryEntryOrigins, n as listMemorySessionTombstones } from "./memory-entry-origins-BBbywTCs.mjs";
import path from "node:path";
import pLimit from "p-limit";
//#region extensions/memory-core/src/short-term-promotion-record.ts
const SHORT_TERM_SOURCE_FILE_CHECK_CONCURRENCY = 32;
function mergeRecallProvenance(existing, incoming) {
	if (!existing) return incoming;
	return {
		originClass: [
			"owner",
			"agent",
			"system",
			"untrusted"
		].findLast((origin) => origin === existing.originClass || origin === incoming.originClass) ?? "untrusted",
		sessionKind: existing.sessionKind === incoming.sessionKind ? incoming.sessionKind : "unknown",
		observedAt: Math.max(existing.observedAt, incoming.observedAt),
		...existing.supersedesKey && existing.supersedesKey === incoming.supersedesKey ? { supersedesKey: existing.supersedesKey } : {}
	};
}
async function shortTermRecallSourceIsFile(workspaceDir, sourcePath) {
	try {
		return (await inspectWorkspaceFile(workspaceDir, sourcePath)).isFile();
	} catch (err) {
		if (err.code === "ENOENT") return false;
		throw err;
	}
}
async function filterLiveShortTermRecallEntries(params) {
	const workspaceDir = params.workspaceDir.trim();
	if (!workspaceDir) return [];
	const sourceFileChecks = /* @__PURE__ */ new Map();
	const sourceFileLimit = pLimit(SHORT_TERM_SOURCE_FILE_CHECK_CONCURRENCY);
	const checkSourceFile = (sourcePath) => {
		const existing = sourceFileChecks.get(sourcePath);
		if (existing) return existing;
		const check = sourceFileLimit(() => shortTermRecallSourceIsFile(workspaceDir, sourcePath));
		sourceFileChecks.set(sourcePath, check);
		return check;
	};
	return (await Promise.all(params.entries.map(async (entry) => {
		let exists = false;
		for (const sourcePath of resolveShortTermSourcePathCandidates(workspaceDir, entry.path)) if (await checkSourceFile(sourcePath)) {
			exists = true;
			break;
		}
		return {
			entry,
			exists
		};
	}))).filter((result) => result.exists).map((result) => result.entry);
}
function recallEventResult(result) {
	return {
		path: normalizeMemoryPath(result.path),
		startLine: Math.max(1, Math.floor(result.startLine)),
		endLine: Math.max(1, Math.floor(result.endLine)),
		score: clampScore(result.score)
	};
}
async function recordShortTermRecalls(params) {
	const workspaceDir = params.workspaceDir?.trim();
	if (!workspaceDir) return;
	const query = params.query.trim();
	if (!query) return;
	const signalType = params.signalType ?? "recall";
	const memoryResults = params.results.filter((result) => result.source === "memory");
	const relevant = memoryResults.filter((result) => isShortTermMemoryPath(result.path));
	const skipped = memoryResults.filter((result) => !isShortTermMemoryPath(result.path));
	if (relevant.length === 0 && (skipped.length === 0 || signalType === "grounded")) return;
	const nowMs = resolveMemoryCoreNowMs(params.nowMs);
	const nowIso = resolveMemoryCoreTimestamp(nowMs);
	const appendSkippedEvent = (eligibleResultCount) => appendMemoryHostEvent(workspaceDir, {
		type: "memory.recall.skipped",
		timestamp: nowIso,
		query,
		reason: "non-short-term-memory-path",
		eligibleResultCount,
		skippedResultCount: skipped.length,
		results: skipped.map((result) => ({
			...recallEventResult(result),
			reason: "non-short-term-memory-path"
		}))
	});
	if (relevant.length === 0) {
		await appendSkippedEvent(0);
		return;
	}
	const sourceSessions = /* @__PURE__ */ new Map();
	for (const { sessionOrigin } of relevant) if (sessionOrigin) {
		const sessions = sourceSessions.get(sessionOrigin.agentId) ?? /* @__PURE__ */ new Set();
		sessions.add(sessionOrigin.sessionId);
		sourceSessions.set(sessionOrigin.agentId, sessions);
	}
	const todayBucket = formatMemoryDreamingDay(nowMs, params.timezone);
	await withMemoryWorkspaceLock(workspaceDir, async () => {
		const store = await readStore(workspaceDir, nowIso);
		const forgottenByAgent = /* @__PURE__ */ new Map();
		for (const [agentId, sessionIds] of sourceSessions) forgottenByAgent.set(agentId, new Set((await listMemorySessionTombstones({
			agentId,
			sessionIds: [...sessionIds]
		})).map((entry) => entry.sessionId)));
		const admitted = relevant.filter(({ sessionOrigin }) => !sessionOrigin || !forgottenByAgent.get(sessionOrigin.agentId)?.has(sessionOrigin.sessionId));
		if (admitted.length === 0) return;
		const origins = [];
		for (const result of admitted) {
			const normalizedPath = normalizeMemoryPath(result.path);
			const rawSnippet = normalizeSnippet(result.snippet);
			const snippet = truncateShortTermSnippet(rawSnippet);
			if (!rawSnippet || signalType === "grounded" && (!Number.isFinite(result.startLine) || !Number.isFinite(result.endLine)) || isContaminatedDreamingSnippet(rawSnippet, { allowTranscriptTurnSnippet: signalType !== "grounded" && isShortTermSessionCorpusPath(normalizedPath) })) continue;
			const identitySnippet = signalType === "daily" ? normalizeSnippet(result.identitySnippet ?? rawSnippet) : rawSnippet;
			const claimHash = buildClaimHash(identitySnippet);
			const nonDailyEntry = signalType === "daily" ? Object.values(store.entries).find((entry) => !entry.key.startsWith("memory:claim:") && Math.max(0, Math.floor(entry.recallCount ?? 0)) + Math.max(0, Math.floor(entry.groundedCount ?? 0)) > 0 && entry.claimHash === claimHash) : void 0;
			const claimKey = signalType === "daily" ? buildDailyClaimEntryKey(claimHash) : buildEntryKey({
				path: normalizedPath,
				startLine: Math.max(1, Math.floor(result.startLine)),
				endLine: Math.max(1, Math.floor(result.endLine)),
				source: "memory",
				claimHash
			});
			const dailyClaimEntry = signalType === "daily" ? void 0 : store.entries[buildDailyClaimEntryKey(claimHash)];
			const key = nonDailyEntry?.key ?? dailyClaimEntry?.key ?? (signalType !== "recall" || store.entries[claimKey] ? claimKey : buildEntryKey(result));
			const existing = store.entries[key];
			const score = clampScore(result.score);
			const effectiveQuery = signalType === "grounded" ? normalizeSnippet(result.query ?? query) || query : query;
			const queryHash = hashQuery(effectiveQuery);
			const dayBucket = normalizeIsoDay((signalType === "grounded" ? result.dayBucket : void 0) ?? params.dayBucket ?? "") ?? todayBucket;
			const signalCount = signalType === "grounded" ? Math.max(1, Math.floor(result.signalCount ?? 1)) : 1;
			const recallDaysBase = existing?.recallDays ?? [];
			const queryHashesBase = existing?.queryHashes ?? [];
			const dedupeSignal = Boolean(params.dedupeByQueryPerDay) && queryHashesBase.includes(queryHash) && recallDaysBase.includes(dayBucket);
			const addedSignals = dedupeSignal ? 0 : signalCount;
			const recallCount = Math.max(0, Math.floor(existing?.recallCount ?? 0) + (signalType === "recall" ? addedSignals : 0));
			const dailyCount = Math.max(0, Math.floor(existing?.dailyCount ?? 0) + (signalType === "daily" ? addedSignals : 0));
			const groundedCount = Math.max(0, Math.floor(existing?.groundedCount ?? 0) + (signalType === "grounded" ? addedSignals : 0));
			const totalScore = Math.max(0, (existing?.totalScore ?? 0) + score * addedSignals);
			const maxScore = Math.max(existing?.maxScore ?? 0, dedupeSignal ? 0 : score);
			const queryHashes = mergeRecentDistinct(queryHashesBase, queryHash, 32);
			const userQueryHashes = signalType === "recall" ? mergeRecentDistinct(existing?.userQueryHashes ?? [], queryHash, 32) : existing?.userQueryHashes;
			const recallDays = mergeRecentDistinct(recallDaysBase, dayBucket, 16);
			const conceptTags = deriveConceptTags({
				path: normalizedPath,
				snippet
			});
			const sourceProvenance = result.provenance ?? {
				originClass: "agent",
				sessionKind: "unknown",
				observedAt: nowMs
			};
			const provenance = mergeRecallProvenance(existing?.provenance, sourceProvenance);
			const projectKey = mergeProjectKeyLists(existing?.projectKey, result.projectKey);
			const lastRecalledAt = (Boolean(params.dedupeByQueryPerDay) || signalType === "daily") && queryHashesBase.includes(queryHash) && existing?.snippet === snippet ? existing?.lastRecalledAt ?? nowIso : nowIso;
			const preserveFirstDailySource = existing !== void 0 && (signalType === "daily" || dailyClaimEntry !== void 0);
			store.entries[key] = {
				key,
				path: preserveFirstDailySource ? existing.path : normalizedPath,
				startLine: preserveFirstDailySource ? existing.startLine : Math.max(1, Math.floor(result.startLine)),
				endLine: preserveFirstDailySource ? existing.endLine : Math.max(1, Math.floor(result.endLine)),
				source: "memory",
				snippet: snippet || existing?.snippet || "",
				recallCount,
				dailyCount,
				groundedCount,
				totalScore,
				maxScore,
				firstRecalledAt: existing?.firstRecalledAt ?? nowIso,
				lastRecalledAt,
				queryHashes,
				...userQueryHashes ? { userQueryHashes } : {},
				recallDays,
				conceptTags: conceptTags.length > 0 ? conceptTags : existing?.conceptTags ?? [],
				provenance,
				claimHash,
				...projectKey ? { projectKey } : {},
				...existing?.promotedAt ? { promotedAt: existing.promotedAt } : {}
			};
			if (result.sessionOrigin) origins.push({
				entryKey: key,
				agentId: result.sessionOrigin.agentId,
				sessionId: result.sessionOrigin.sessionId,
				sessionKey: result.sessionOrigin.sessionKey ?? null,
				originClass: sourceProvenance.originClass,
				observedAt: sourceProvenance.observedAt
			});
		}
		for (const agentId of sourceSessions.keys()) await recordMemoryEntryOrigins({
			agentId,
			origins: origins.filter((origin) => origin.agentId === agentId)
		});
		store.updatedAt = nowIso;
		await writeStore(workspaceDir, store);
		if (signalType === "grounded") return;
		await appendMemoryHostEvent(workspaceDir, {
			type: "memory.recall.recorded",
			timestamp: nowIso,
			query,
			resultCount: admitted.length,
			results: admitted.map(recallEventResult)
		});
		if (skipped.length > 0) await appendSkippedEvent(admitted.length);
	});
}
async function recordGroundedShortTermCandidates(params) {
	const { items, ...options } = params;
	await recordShortTermRecalls({
		...options,
		signalType: "grounded",
		results: items.map((item) => Object.assign({}, item, { source: "memory" }))
	});
}
async function readShortTermRecallEntries(params) {
	const workspaceDir = params.workspaceDir.trim();
	if (!workspaceDir) return [];
	const nowMs = resolveMemoryCoreNowMs(params.nowMs);
	const nowIso = resolveMemoryCoreTimestamp(nowMs);
	const store = await readStore(workspaceDir, nowIso);
	return Object.values(store.entries).filter((entry) => isShortTermMemoryPath(entry.path));
}
function resolveShortTermSourcePathCandidates(workspaceDir, candidatePath) {
	const normalizedPath = normalizeMemoryPath(candidatePath);
	const basenames = [normalizedPath];
	if (!normalizedPath.startsWith("memory/")) basenames.push(path.posix.join("memory", path.posix.basename(normalizedPath)));
	return uniqueStrings(basenames.map((relativePath) => path.resolve(workspaceDir, relativePath)));
}
//#endregion
export { resolveShortTermSourcePathCandidates as a, recordShortTermRecalls as i, readShortTermRecallEntries as n, recordGroundedShortTermCandidates as r, filterLiveShortTermRecallEntries as t };
