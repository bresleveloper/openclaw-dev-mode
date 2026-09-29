import { l as listSessionTranscriptCorpusEntriesForAgent } from "./session-files-DSNs2wC3.mjs";
import "./memory-core-host-engine-sessions-Dp8skDK4.mjs";
import { a as SESSION_BACKFILL_REWIND_NAMESPACE, m as deleteMemoryCoreWorkspaceEntry, x as writeMemoryCoreWorkspaceEntry, y as readMemoryCoreWorkspaceEntries } from "./dreaming-state-DJfKblhZ.mjs";
import { t as normalizeSessionBackfillSelection } from "./session-backfill-selection-CjIn4YJO.mjs";
import { d as writeBackfillDiaryEntries, g as withMemoryWorkspaceLock, s as removeBackfillDiaryEntries } from "./dreaming-dreams-file-C-CZ4y6s.mjs";
import { t as previewGroundedRemForFile } from "./rem-evidence-8JlTTS2o.mjs";
import { r as removeGroundedShortTermCandidates } from "./short-term-promotion-i0KUeUoz.mjs";
import { o as hashMemoryContent, r as buildPromotionMarker } from "./short-term-promotion-memory-write-CFZnCVmO.mjs";
import { a as recordMemoryEntryOrigins, r as listMemorySessionTombstones } from "./memory-entry-origins-B0k3pTMh.mjs";
import { a as foreignSessionIngestionSource, c as resolveAdmissionPolicy, d as sessionIngestionSourceFromCorpus, l as scanSessionIngestionSource, m as writeSessionIngestionState, n as SESSION_INGESTION_SCORE, o as mergeTrackedMessageHashes, p as trimTrackedSessionScopes, r as appendSessionCorpusLines, s as readSessionIngestionState, u as sessionExclusionReason } from "./session-ingestion-Cghu7HnA.mjs";
import { n as readShortTermRecallEntries, r as recordGroundedShortTermCandidates } from "./short-term-promotion-record-B9ScgmfO.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region extensions/memory-core/src/session-backfill-lifecycle.ts
const SESSION_BACKFILL_BASELINE_KEY_PREFIX = "complete-baseline:";
async function recordSessionBackfillRewindBatch(params) {
	if (params.candidates.length === 0) return;
	const key = createHash("sha256").update(JSON.stringify(params.candidates)).digest("hex");
	await writeMemoryCoreWorkspaceEntry({
		namespace: SESSION_BACKFILL_REWIND_NAMESPACE,
		workspaceDir: params.workspaceDir,
		key,
		value: {
			version: 1,
			candidates: params.candidates
		}
	});
}
async function markSessionBackfillRewindBaseline(params) {
	await writeMemoryCoreWorkspaceEntry({
		namespace: SESSION_BACKFILL_REWIND_NAMESPACE,
		workspaceDir: params.workspaceDir,
		key: `${SESSION_BACKFILL_BASELINE_KEY_PREFIX}${params.agentId}`,
		value: {
			version: 1,
			complete: true,
			agentId: params.agentId
		}
	});
}
function isSessionBackfillRewindCandidate(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const candidate = value;
	return Number.isInteger(candidate.contentIndex) && candidate.contentIndex >= 0 && typeof candidate.hash === "string" && candidate.hash.length > 0 && typeof candidate.scope === "string" && candidate.scope.length > 0 && typeof candidate.stateKey === "string" && candidate.stateKey.length > 0;
}
function isSessionBackfillRewindBatch(value) {
	return value.version === 1 && "candidates" in value && Array.isArray(value.candidates);
}
async function rewindSessionBackfillIngestionState(params) {
	const entries = await readMemoryCoreWorkspaceEntries({
		namespace: SESSION_BACKFILL_REWIND_NAMESPACE,
		workspaceDir: params.workspaceDir
	});
	const completeCoverage = entries.some((entry) => entry.key === `${SESSION_BACKFILL_BASELINE_KEY_PREFIX}${params.agentId}` && "complete" in entry.value && entry.value.agentId === params.agentId);
	const batchEntries = entries.filter((entry) => isSessionBackfillRewindBatch(entry.value));
	const candidates = batchEntries.flatMap((entry) => isSessionBackfillRewindBatch(entry.value) ? entry.value.candidates.filter(isSessionBackfillRewindCandidate) : []);
	if (candidates.length === 0) {
		await deleteSessionBackfillRewindBatches(params.workspaceDir, batchEntries);
		return {
			completeCoverage,
			rewoundCandidates: 0
		};
	}
	const state = await readSessionIngestionState(params.workspaceDir);
	const removedHashesByScope = /* @__PURE__ */ new Map();
	const rewindLineByStateKey = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const hashes = removedHashesByScope.get(candidate.scope) ?? /* @__PURE__ */ new Set();
		hashes.add(candidate.hash);
		removedHashesByScope.set(candidate.scope, hashes);
		rewindLineByStateKey.set(candidate.stateKey, Math.min(rewindLineByStateKey.get(candidate.stateKey) ?? candidate.contentIndex, candidate.contentIndex));
	}
	const seenMessages = { ...state.seenMessages };
	for (const [scope, removedHashes] of removedHashesByScope) {
		const remaining = (seenMessages[scope] ?? []).filter((hash) => !removedHashes.has(hash));
		if (remaining.length > 0) seenMessages[scope] = remaining;
		else delete seenMessages[scope];
	}
	const files = { ...state.files };
	for (const [stateKey, lastContentLine] of rewindLineByStateKey) {
		const current = files[stateKey];
		if (current) files[stateKey] = {
			...current,
			lastContentLine: Math.min(current.lastContentLine, lastContentLine)
		};
	}
	await writeSessionIngestionState(params.workspaceDir, {
		...state,
		files,
		seenMessages
	});
	await deleteSessionBackfillRewindBatches(params.workspaceDir, batchEntries);
	return {
		completeCoverage,
		rewoundCandidates: candidates.length
	};
}
async function deleteSessionBackfillRewindBatches(workspaceDir, entries) {
	await Promise.all(entries.map((entry) => deleteMemoryCoreWorkspaceEntry({
		namespace: SESSION_BACKFILL_REWIND_NAMESPACE,
		workspaceDir,
		key: entry.key
	})));
}
function belongsToAgentFileState(key, agentId) {
	return key.startsWith(`${agentId}:`);
}
function belongsToAgentSeenState(key, agentId) {
	if (!key.startsWith("archive:")) return key.startsWith(`${agentId}:`);
	const archiveAgentEnd = key.indexOf(":", 8);
	if (archiveAgentEnd === -1) return agentId === "archive";
	return key.slice(8, archiveAgentEnd) === agentId;
}
async function resetSessionBackfillIngestionState(params) {
	const state = await readSessionIngestionState(params.workspaceDir);
	await writeSessionIngestionState(params.workspaceDir, {
		...state,
		files: Object.fromEntries(Object.entries(state.files).filter(([key]) => !belongsToAgentFileState(key, params.agentId))),
		seenMessages: Object.fromEntries(Object.entries(state.seenMessages).filter(([key]) => !belongsToAgentSeenState(key, params.agentId)))
	});
}
async function drainSessionBackfill(params) {
	const batches = [];
	for (let batch = 1; batch <= params.maxBatches; batch += 1) {
		const execution = await params.executeBatch();
		batches.push(execution);
		if (!execution.continuation.hasMore) return aggregateSessionBackfillBatches(batches, params.topCandidateLimit);
		if (!execution.continuation.advanced) throw new Error(`Memory session-backfill stopped after ${batch} batches because the ingestion cursor did not advance.`);
	}
	throw new Error(`Memory session-backfill exceeded the ${params.maxBatches}-batch safety limit.`);
}
function aggregateSessionBackfillBatches(executions, topCandidateLimit) {
	const first = executions[0]?.result;
	if (!first) throw new Error("Memory session-backfill completed without executing a batch.");
	const days = /* @__PURE__ */ new Map();
	for (const execution of executions) for (const day of execution.result.days) {
		const current = days.get(day.day);
		days.set(day.day, {
			day: day.day,
			candidateCount: (current?.candidateCount ?? 0) + day.candidateCount,
			topCandidates: [...current?.topCandidates ?? [], ...day.topCandidates].slice(0, topCandidateLimit)
		});
	}
	return {
		...first,
		days: [...days.values()].toSorted((a, b) => a.day.localeCompare(b.day)),
		candidateCount: executions.reduce((sum, execution) => sum + execution.result.candidateCount, 0),
		stagedEntries: executions.reduce((sum, execution) => sum + execution.result.stagedEntries, 0),
		writtenDiaryEntries: executions.reduce((sum, execution) => sum + execution.result.writtenDiaryEntries, 0),
		replacedDiaryEntries: executions.reduce((sum, execution) => sum + execution.result.replacedDiaryEntries, 0),
		batchCount: executions.length,
		batches: executions.map((execution, index) => ({
			batch: index + 1,
			days: execution.result.days.length,
			candidates: execution.result.candidateCount,
			stagedEntries: execution.result.stagedEntries
		}))
	};
}
//#endregion
//#region extensions/memory-core/src/session-backfill.ts
const SESSION_BACKFILL_QUERY_PREFIX = "__dreaming_session_backfill__";
const TOP_CANDIDATE_LIMIT = 5;
const MAX_SESSION_BACKFILL_APPLY_BATCHES = 1e4;
async function listSessionBackfillSources(params) {
	const corpus = await listSessionTranscriptCorpusEntriesForAgent(params.agentId, { includeRetainedSqlite: true });
	const forgottenSessionIds = new Set(listMemorySessionTombstones({ agentId: params.agentId }).map((entry) => entry.sessionId));
	const sources = corpus.map(sessionIngestionSourceFromCorpus).filter((entry) => entry !== null && !entry.buildOptions.generatedByDreamingNarrative && !entry.buildOptions.generatedByCronRun && !sessionExclusionReason(entry, params.admissionPolicy, forgottenSessionIds));
	const canonicalPaths = new Set(sources.map((entry) => path.resolve(entry.absolutePath)));
	for (const archiveFile of params.archiveFiles) {
		const source = foreignSessionIngestionSource(params.agentId, archiveFile);
		if (!canonicalPaths.has(source.absolutePath)) {
			sources.push(source);
			canonicalPaths.add(source.absolutePath);
		}
	}
	return sources.toSorted((a, b) => a.sessionPath === b.sessionPath ? a.absolutePath.localeCompare(b.absolutePath) : a.sessionPath.localeCompare(b.sessionPath));
}
function compareSessionBackfillCandidates(a, b) {
	if (a.day !== b.day) return a.day.localeCompare(b.day);
	if (a.provenance.observedAt !== b.provenance.observedAt) return a.provenance.observedAt - b.provenance.observedAt;
	if (a.scope !== b.scope) return a.scope.localeCompare(b.scope);
	return a.lineNumber - b.lineNumber;
}
async function collectSessionBackfillCandidates(params) {
	const candidates = [];
	const scans = [];
	const perFileCap = Math.min(80, Math.max(12, Math.ceil(240 / Math.max(1, params.sources.length))));
	for (const source of params.sources) {
		const scan = await scanSessionIngestionSource({
			source,
			previous: params.files[source.stateKey],
			seenMessages: params.seenMessages,
			timezone: params.timezone,
			verifyContent: true,
			classifyDay: (day) => (params.from === void 0 || day >= params.from) && (params.to === void 0 || day <= params.to) ? "include" : "block",
			acceptProvenance: (provenance) => provenance.originClass === "owner" || provenance.originClass === "agent"
		});
		if (scan.status !== "scanned" || !scan.fileState) continue;
		candidates.push(...scan.candidates.toSorted(compareSessionBackfillCandidates).slice(0, perFileCap));
		scans.push({
			candidates: scan.candidates,
			contentHash: scan.fileState.contentHash,
			lineCount: scan.fileState.lineCount,
			mtimeMs: scan.fileState.mtimeMs,
			...scan.progressBlockIndex !== void 0 ? { progressBlockIndex: scan.progressBlockIndex } : {},
			scannedEndIndex: scan.scannedEndIndex,
			size: scan.fileState.size,
			stateKey: source.stateKey
		});
	}
	const selected = candidates.toSorted(compareSessionBackfillCandidates).slice(0, 240);
	const byDay = /* @__PURE__ */ new Map();
	for (const candidate of selected) {
		const bucket = byDay.get(candidate.day) ?? [];
		bucket.push(candidate);
		byDay.set(candidate.day, bucket);
	}
	return {
		byDay,
		scans
	};
}
function mergeSessionBackfillFileProgress(params) {
	const selectedHashes = new Set(params.selectedDays.flatMap((day) => day.candidates.map((candidate) => candidate.hash)));
	const files = { ...params.current };
	for (const scan of params.scans) {
		const firstUnselected = scan.candidates.find((candidate) => !selectedHashes.has(candidate.hash));
		const progressStops = [
			scan.scannedEndIndex,
			...firstUnselected ? [firstUnselected.contentIndex] : [],
			...scan.progressBlockIndex !== void 0 ? [scan.progressBlockIndex] : []
		];
		files[scan.stateKey] = {
			mtimeMs: scan.mtimeMs,
			size: scan.size,
			contentHash: scan.contentHash,
			lineCount: scan.lineCount,
			lastContentLine: Math.min(...progressStops)
		};
	}
	return files;
}
function summarizeDay(day, candidates) {
	return {
		day,
		candidateCount: candidates.length,
		topCandidates: candidates.slice(0, TOP_CANDIDATE_LIMIT).map((entry) => entry.snippet)
	};
}
function buildSessionBackfillDiaryEntries(params) {
	const origins = [];
	const markLine = (day, line, sources) => {
		const entryKey = `memory:session-backfill:${hashMemoryContent(JSON.stringify([day, line]))}`;
		for (const source of sources) {
			const origin = source.sessionOrigin;
			if (origin) origins.push({
				entryKey,
				...origin,
				sessionKey: origin.sessionKey ?? null,
				originClass: source.provenance.originClass,
				observedAt: source.provenance.observedAt
			});
		}
		return `${buildPromotionMarker(entryKey)}\n${line}`;
	};
	const entries = params.days.map(({ day, candidates }) => {
		let bodyLines;
		if (params.rem) {
			const relPath = `memory/${day}.md`;
			const file = previewGroundedRemForFile({
				relPath,
				content: `## Session transcript\n\n${candidates.map((candidate) => candidate.rendered).join("\n")}\n`,
				formatItem: (line, refs) => markLine(day, line, candidates.filter((_, index) => refs.some((ref) => {
					const [start, end = start] = ref.slice(relPath.length + 1).split("-").map(Number);
					return index + 3 >= start && index + 3 <= end;
				})))
			});
			if (file.facts.length || file.reflections.length || file.memoryImplications.length || file.candidates.length) bodyLines = file.renderedMarkdown.replace(/^##\s+/gm, "").split("\n");
		}
		bodyLines ??= [`Session backfill found ${candidates.length} trusted candidate${candidates.length === 1 ? "" : "s"}.`, ...candidates.slice(0, TOP_CANDIDATE_LIMIT).map((candidate) => markLine(day, `- ${candidate.snippet}`, [candidate]))];
		return {
			isoDay: day,
			sourcePath: `memory/.dreams/session-corpus/${day}.txt`,
			bodyLines
		};
	});
	recordMemoryEntryOrigins({
		agentId: params.agentId,
		origins
	});
	return entries;
}
function coalesceBackfillClaims(results) {
	const claims = /* @__PURE__ */ new Map();
	return results.flatMap((result) => {
		const snippet = result.snippet.replace(/^(?:Assistant|User):\s*/i, "").trim();
		const key = snippet.replace(/\s+/g, " ").toLowerCase();
		if (!key) return [];
		const claim = claims.get(key) ?? {
			path: result.path,
			startLine: result.startLine,
			endLine: result.endLine,
			snippet
		};
		claims.set(key, claim);
		return [{
			...result,
			...claim
		}];
	});
}
async function applySessionBackfillDays(params) {
	const before = await readShortTermRecallEntries({
		workspaceDir: params.workspaceDir,
		nowMs: params.nowMs
	});
	for (const day of params.days) {
		const grounded = coalesceBackfillClaims(await appendSessionCorpusLines({
			workspaceDir: params.workspaceDir,
			day: day.day,
			lines: day.candidates
		}));
		if (grounded.length === 0) continue;
		await recordGroundedShortTermCandidates({
			workspaceDir: params.workspaceDir,
			query: `${SESSION_BACKFILL_QUERY_PREFIX}:${day.day}`,
			items: grounded.map((result) => ({
				path: result.path,
				startLine: result.startLine,
				endLine: result.endLine,
				snippet: result.snippet,
				score: SESSION_INGESTION_SCORE,
				dayBucket: day.day,
				provenance: result.provenance,
				sessionOrigin: result.sessionOrigin
			})),
			dedupeByQueryPerDay: true,
			nowMs: params.nowMs,
			...params.timezone !== void 0 ? { timezone: params.timezone } : {}
		});
	}
	const after = await readShortTermRecallEntries({
		workspaceDir: params.workspaceDir,
		nowMs: params.nowMs
	});
	return Math.max(0, after.length - before.length);
}
async function executeSessionBackfillCore(params) {
	const workspaceDir = params.workspaceDir.trim();
	if (!workspaceDir) throw new Error("Memory session-backfill requires a resolvable workspace directory.");
	if (params.rem && params.apply) throw new Error("Memory session-backfill --rem cannot be combined with --apply.");
	const execute = () => executeSessionBackfillBatchCore({
		...params,
		workspaceDir
	});
	return params.apply || params.rem || params.rollback ? withMemoryWorkspaceLock(workspaceDir, execute) : execute();
}
async function executeSessionBackfillBatchCore(params) {
	const workspaceDir = params.workspaceDir;
	const nowMs = Number.isFinite(params.nowMs) ? params.nowMs : Date.now();
	if (params.rollback) {
		const [diary, staged] = await Promise.all([removeBackfillDiaryEntries({ workspaceDir }), removeGroundedShortTermCandidates({ workspaceDir })]);
		if (!(await rewindSessionBackfillIngestionState({
			workspaceDir,
			agentId: params.agentId
		})).completeCoverage && (diary.removed > 0 || staged.removed > 0)) await resetSessionBackfillIngestionState({
			workspaceDir,
			agentId: params.agentId
		});
		await markSessionBackfillRewindBaseline({
			workspaceDir,
			agentId: params.agentId
		});
		return {
			result: {
				agentId: params.agentId,
				workspaceDir,
				applied: false,
				rem: false,
				days: [],
				candidateCount: 0,
				stagedEntries: 0,
				writtenDiaryEntries: 0,
				replacedDiaryEntries: 0,
				rollback: {
					removedDiaryEntries: diary.removed,
					removedStagedEntries: staged.removed
				}
			},
			continuation: {
				advanced: false,
				hasMore: false
			}
		};
	}
	const { from, to, limitDays } = normalizeSessionBackfillSelection(params);
	const state = await readSessionIngestionState(workspaceDir);
	const collected = await collectSessionBackfillCandidates({
		sources: await listSessionBackfillSources({
			agentId: params.agentId,
			archiveFiles: params.archiveFiles ?? [],
			admissionPolicy: resolveAdmissionPolicy(params.pluginConfig)
		}),
		files: state.files,
		seenMessages: state.seenMessages,
		...from !== void 0 ? { from } : {},
		...to !== void 0 ? { to } : {},
		...params.timezone !== void 0 ? { timezone: params.timezone } : {}
	});
	const selectedDays = [...collected.byDay.keys()].toSorted().slice(0, limitDays).map((day) => ({
		day,
		candidates: collected.byDay.get(day) ?? []
	}));
	const days = selectedDays.map((entry) => summarizeDay(entry.day, entry.candidates));
	const candidateCount = days.reduce((sum, day) => sum + day.candidateCount, 0);
	const selectedHashes = new Set(selectedDays.flatMap((day) => day.candidates.map((candidate) => candidate.hash)));
	const continuation = {
		advanced: Boolean(params.apply) && candidateCount > 0,
		hasMore: collected.scans.some((scan) => scan.candidates.some((candidate) => !selectedHashes.has(candidate.hash)))
	};
	let writtenDiaryEntries = 0;
	let replacedDiaryEntries = 0;
	let stagedEntries = 0;
	if (selectedDays.length > 0 && (params.rem || params.apply)) {
		const diaryEntries = buildSessionBackfillDiaryEntries({
			agentId: params.agentId,
			days: selectedDays,
			rem: params.rem
		});
		const diary = await writeBackfillDiaryEntries({
			workspaceDir,
			entries: diaryEntries,
			preserveExisting: true,
			...params.timezone !== void 0 ? { timezone: params.timezone } : {}
		});
		writtenDiaryEntries = diary.written;
		replacedDiaryEntries = diary.replaced;
	}
	if (params.apply) {
		await recordSessionBackfillRewindBatch({
			workspaceDir,
			candidates: selectedDays.flatMap((day) => day.candidates.map((candidate) => ({
				contentIndex: candidate.contentIndex,
				hash: candidate.hash,
				scope: candidate.scope,
				stateKey: candidate.stateKey
			})))
		});
		if (selectedDays.length > 0) stagedEntries = await applySessionBackfillDays({
			workspaceDir,
			days: selectedDays,
			nowMs,
			...params.timezone !== void 0 ? { timezone: params.timezone } : {}
		});
		const nextSeenMessages = { ...state.seenMessages };
		for (const { candidates } of selectedDays) {
			const hashesByScope = /* @__PURE__ */ new Map();
			for (const candidate of candidates) {
				const hashes = hashesByScope.get(candidate.scope) ?? [];
				hashes.push(candidate.hash);
				hashesByScope.set(candidate.scope, hashes);
			}
			for (const [scope, hashes] of hashesByScope) nextSeenMessages[scope] = mergeTrackedMessageHashes(nextSeenMessages[scope] ?? [], hashes);
		}
		await writeSessionIngestionState(workspaceDir, {
			...state,
			files: mergeSessionBackfillFileProgress({
				current: state.files,
				scans: collected.scans,
				selectedDays
			}),
			seenMessages: trimTrackedSessionScopes(nextSeenMessages)
		});
	}
	return {
		result: {
			agentId: params.agentId,
			workspaceDir,
			applied: Boolean(params.apply),
			rem: Boolean(params.rem),
			days,
			candidateCount,
			stagedEntries,
			writtenDiaryEntries,
			replacedDiaryEntries
		},
		continuation
	};
}
async function executeSessionBackfill(params) {
	return (await executeSessionBackfillCore(params)).result;
}
async function runSessionBackfill(params) {
	if (!params.apply || params.rollback) return (await executeSessionBackfillCore(params)).result;
	return await drainSessionBackfill({
		executeBatch: () => executeSessionBackfillCore(params),
		maxBatches: MAX_SESSION_BACKFILL_APPLY_BATCHES,
		topCandidateLimit: TOP_CANDIDATE_LIMIT
	});
}
async function executeSessionBackfillBatch(params) {
	return await executeSessionBackfillCore(params);
}
//#endregion
export { executeSessionBackfillBatch as n, runSessionBackfill as r, executeSessionBackfill as t };
