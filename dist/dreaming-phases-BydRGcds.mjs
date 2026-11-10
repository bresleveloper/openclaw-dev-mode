import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { E as resolveMemoryRemDreamingConfig, T as resolveMemoryLightDreamingConfig, _ as formatMemoryDreamingDay } from "./dreaming-D2xE6WEV.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { c as readWorkspaceText, i as listWorkspaceDirectory, r as inspectWorkspaceFile } from "./memory-workspace-files-_Z-dpV0O.mjs";
import { n as listMemoryArtifactProvenance } from "./memory-artifact-provenance-CLGkndXF.mjs";
import "./memory-core-host-engine-foundation-Cj49LzJw.mjs";
import { n as listSessionTranscriptCorpusEntriesForAgent } from "./memory-core-host-engine-sessions-D3l0Zm6q.mjs";
import "./memory-core-host-status-EFn_AMM-.mjs";
import "./memory-core-host-runtime-core-CNLFAky0.mjs";
import "./dreaming-shared-BPGHiecZ.mjs";
import { t as appendFailedDreamingEvent } from "./dreaming-events-CoJljHlb.mjs";
import { D as compareStoreTimestampDesc, M as isGenericDailyHeading, Y as normalizeConceptToken, et as withMemoryWorkspaceLock, o as readRecentDreamDiaryEntries } from "./dreaming-dreams-file-BFl4u8HC.mjs";
import { d as recordRemConsideredPhaseSignals, f as isPromotionOriginBlocked, l as readLightStagedKeys, s as filterFreshLightDreamingEntries, u as recordDreamingPhaseSignals } from "./short-term-promotion-NZ4nGzEz.mjs";
import { S as writeSessionIngestionState, _ as normalizeMemoryDay, b as readSessionIngestionState, c as resolveSessionAgentsForWorkspace, d as sessionExclusionReasons, f as sessionIngestionSourceFromCorpus, g as compareDailyMemoryFilesByNewestDay, h as DAILY_MEMORY_FILENAME_RE, l as resolveSessionIngestionFileCap, m as trimTrackedSessionScopes, o as mergeTrackedMessageHashes, p as sessionIngestionStateKeyFromCorpus, r as appendSessionCorpusLines, s as resolveAdmissionPolicy, u as scanSessionIngestionSource, v as parseDailyMemoryFileName, x as writeDailyIngestionState, y as readDailyIngestionState } from "./session-ingestion-w1VvcFpR.mjs";
import { n as writeDailyDreamingPhaseBlock } from "./dreaming-markdown-CYuB5DCY.mjs";
import { t as findForgottenMemorySessionIds } from "./memory-entry-origins-CgmXP4fy.mjs";
import { n as textSimilarity } from "./tokenize-BrhRR-qj.mjs";
import { n as readShortTermRecallEntries, r as recordShortTermRecalls, t as filterLiveShortTermRecallEntries } from "./short-term-promotion-record-yyoZVODo.mjs";
import { createHash } from "node:crypto";
import path from "node:path";
//#region extensions/memory-core/src/dreaming-phases.ts
const DAILY_INGESTION_SCORE = .62;
const DAILY_INGESTION_MAX_SNIPPET_CHARS = 280;
const DAILY_INGESTION_MIN_SNIPPET_CHARS = 8;
const DAILY_INGESTION_MAX_CHUNK_LINES = 4;
const LIGHT_DIARY_HISTORY_LIMIT = 4;
const LIGHT_DIARY_SNIPPET_SIMILARITY_THRESHOLD = .35;
const MANAGED_DAILY_DREAMING_BLOCKS = [{
	heading: "## Light Sleep",
	startMarker: "<!-- openclaw:dreaming:light:start -->",
	endMarker: "<!-- openclaw:dreaming:light:end -->"
}, {
	heading: "## REM Sleep",
	startMarker: "<!-- openclaw:dreaming:rem:start -->",
	endMarker: "<!-- openclaw:dreaming:rem:end -->"
}];
function calculateLookbackCutoffMs(nowMs, lookbackDays) {
	return nowMs - Math.max(0, lookbackDays) * 24 * 60 * 60 * 1e3;
}
function isDayWithinLookback(day, cutoffMs) {
	const dayMs = Date.parse(`${day}T23:59:59.999Z`);
	return Number.isFinite(dayMs) && dayMs >= cutoffMs;
}
function normalizeDailyListMarker(line) {
	return line.replace(/^\d+\.\s+/, "").replace(/^[-*+]\s+/, "").trim();
}
function normalizeDailyHeading(line) {
	const match = line.trim().match(/^#{1,6}\s+(.+)$/);
	if (!match) return null;
	const heading = match[1] ? normalizeDailyListMarker(match[1]) : "";
	if (!heading || DAILY_MEMORY_FILENAME_RE.test(heading) || isGenericDailyHeading(heading)) return null;
	return truncateUtf16Safe(heading, DAILY_INGESTION_MAX_SNIPPET_CHARS).replace(/\s+/g, " ");
}
function normalizeDailySnippet(line) {
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("<!--")) return null;
	const withoutListMarker = normalizeDailyListMarker(trimmed);
	if (withoutListMarker.length < DAILY_INGESTION_MIN_SNIPPET_CHARS) return null;
	return truncateUtf16Safe(withoutListMarker, DAILY_INGESTION_MAX_SNIPPET_CHARS).replace(/\s+/g, " ");
}
function buildDailyChunkSnippet(heading, chunkLines) {
	const body = chunkLines.join(" ").trim();
	const prefixed = heading ? `${heading}: ${body}` : body;
	return truncateUtf16Safe(prefixed, DAILY_INGESTION_MAX_SNIPPET_CHARS).replace(/\s+/g, " ").trim();
}
function buildDailyListSnippet(heading, ancestors, snippet) {
	return buildDailyChunkSnippet(heading, [[...ancestors, snippet].join(" > ").replaceAll(": > ", ": ")]);
}
function buildDailySnippetChunks(lines, limit) {
	const chunks = [];
	let activeHeading = null;
	let chunkLines = [];
	let chunkStartLine = 0;
	let listAncestors = [];
	const flushChunk = () => {
		if (chunkLines.length === 0) return;
		const snippet = buildDailyChunkSnippet(activeHeading, chunkLines);
		if (snippet.length >= DAILY_INGESTION_MIN_SNIPPET_CHARS) chunks.push({
			startLine: chunkStartLine,
			endLine: chunkStartLine + chunkLines.length - 1,
			snippet
		});
		chunkLines = [];
	};
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		const heading = normalizeDailyHeading(line);
		if (heading) {
			flushChunk();
			activeHeading = heading;
			listAncestors = [];
			continue;
		}
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("<!--")) {
			flushChunk();
			listAncestors = [];
			continue;
		}
		const listMatch = line.match(/^(\s*)(?:[-*+]|\d+\.)\s+(.+)$/);
		if (listMatch) {
			flushChunk();
			const indent = listMatch[1]?.length ?? 0;
			const listText = truncateUtf16Safe(normalizeDailyListMarker(trimmed), DAILY_INGESTION_MAX_SNIPPET_CHARS).replace(/\s+/g, " ");
			if (!listText) {
				listAncestors = [];
				continue;
			}
			while ((listAncestors.at(-1)?.indent ?? -1) >= indent) listAncestors.pop();
			const continuationLines = [];
			let endIndex = index;
			let hasNestedChild = false;
			let nestedChildIndex;
			for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
				const nextLine = lines[cursor];
				const nextTrimmed = nextLine.trim();
				if (!nextTrimmed) {
					let nextContentIndex = cursor + 1;
					while (nextContentIndex < lines.length && !lines[nextContentIndex]?.trim()) nextContentIndex += 1;
					const looseChildMatch = lines[nextContentIndex]?.match(/^(\s*)(?:[-*+]|\d+\.)\s+(.+)$/);
					if (looseChildMatch && (looseChildMatch[1]?.length ?? 0) > indent) {
						hasNestedChild = true;
						nestedChildIndex = nextContentIndex;
					}
					break;
				}
				if (nextTrimmed.startsWith("#") || nextTrimmed.startsWith("<!--")) break;
				const nextListMatch = nextLine.match(/^(\s*)(?:[-*+]|\d+\.)\s+(.+)$/);
				if (nextListMatch) {
					hasNestedChild = (nextListMatch[1]?.length ?? 0) > indent;
					break;
				}
				continuationLines.push(nextTrimmed.replace(/\s+/g, " "));
				endIndex = cursor;
			}
			const claimBody = [listText, ...continuationLines].join(" ");
			const contextualSnippet = buildDailyListSnippet(activeHeading, listAncestors.map((ancestor) => ancestor.text), claimBody);
			if (!(hasNestedChild && continuationLines.length === 0 && listText.endsWith(":")) && contextualSnippet.length >= DAILY_INGESTION_MIN_SNIPPET_CHARS) chunks.push({
				startLine: index + 1,
				endLine: endIndex + 1,
				snippet: contextualSnippet,
				identitySnippet: contextualSnippet
			});
			listAncestors.push({
				indent,
				text: claimBody
			});
			index = nestedChildIndex === void 0 ? endIndex : nestedChildIndex - 1;
			if (chunks.length >= limit) break;
			continue;
		}
		listAncestors = [];
		const snippet = normalizeDailySnippet(line);
		if (!snippet) {
			flushChunk();
			continue;
		}
		if (chunkLines.length >= DAILY_INGESTION_MAX_CHUNK_LINES) flushChunk();
		if (chunkLines.length === 0) chunkStartLine = index + 1;
		chunkLines.push(snippet);
		if (chunks.length >= limit) break;
	}
	flushChunk();
	return chunks.slice(0, limit);
}
function resolveDailyFileProvenance(params) {
	if (params.recorded?.originClass === "untrusted") return {
		originClass: "untrusted",
		observedAt: params.recorded.observedAt
	};
	if (params.recorded?.fileHash === params.currentHash) return {
		originClass: params.recorded.originClass,
		observedAt: params.recorded.observedAt
	};
	return {
		originClass: "agent",
		observedAt: params.defaultObservedAt
	};
}
async function readDailyFileProvenance(workspaceDir) {
	return new Map((await listMemoryArtifactProvenance({ workspaceDir })).map((entry) => [entry.relativePath, entry.provenance]));
}
function findManagedDailyDreamingHeadingIndex(lines, startIndex, heading) {
	for (let index = startIndex - 1; index >= 0; index -= 1) {
		const trimmed = lines[index]?.trim() ?? "";
		if (!trimmed) continue;
		return trimmed === heading ? index : null;
	}
	return null;
}
function isManagedDailyDreamingBoundary(line, headingLevel, blockByStartMarker) {
	const trimmed = line.trim();
	const heading = /^#{1,6}(?=\s)/.exec(trimmed);
	return heading !== null && heading[0].length <= headingLevel || blockByStartMarker.has(trimmed);
}
function stripManagedDailyDreamingLines(lines) {
	const blockByStartMarker = new Map(MANAGED_DAILY_DREAMING_BLOCKS.map((block) => [block.startMarker, block]));
	const sanitized = [...lines];
	for (let index = 0; index < sanitized.length; index += 1) {
		const block = blockByStartMarker.get(sanitized[index]?.trim() ?? "");
		if (!block) continue;
		let stripUntilIndex = -1;
		for (let cursor = index + 1; cursor < sanitized.length; cursor += 1) {
			const line = sanitized[cursor];
			if ((line?.trim() ?? "") === block.endMarker) {
				stripUntilIndex = cursor;
				break;
			}
			if (line && isManagedDailyDreamingBoundary(line, block.heading.indexOf(" "), blockByStartMarker)) {
				stripUntilIndex = cursor - 1;
				break;
			}
		}
		if (stripUntilIndex < index) continue;
		const startIndex = findManagedDailyDreamingHeadingIndex(lines, index, block.heading) ?? index;
		for (let cursor = startIndex; cursor <= stripUntilIndex; cursor += 1) sanitized[cursor] = "";
		index = stripUntilIndex;
	}
	return sanitized;
}
function buildDailyIngestionResults(params) {
	const provenance = resolveDailyFileProvenance({
		currentHash: createHash("sha256").update(params.raw).digest("hex"),
		defaultObservedAt: params.defaultObservedAt,
		...params.recorded ? { recorded: params.recorded } : {}
	});
	return buildDailySnippetChunks(stripManagedDailyDreamingLines(params.raw.split(/\r?\n/)), params.limit).map((chunk) => Object.assign({
		path: params.path,
		startLine: chunk.startLine,
		endLine: chunk.endLine,
		score: DAILY_INGESTION_SCORE,
		snippet: chunk.snippet,
		source: "memory",
		provenance: {
			...provenance,
			sessionKind: "unknown"
		}
	}, chunk.identitySnippet ? { identitySnippet: chunk.identitySnippet } : {}));
}
function entryWithinLookback(entry, cutoffMs) {
	if ((entry.recallDays ?? []).some((day) => isDayWithinLookback(day, cutoffMs))) return true;
	if (Math.max(0, Math.floor(entry.dailyCount ?? 0)) > 0 && Math.max(0, Math.floor(entry.recallCount ?? 0)) === 0 && Math.max(0, Math.floor(entry.groundedCount ?? 0)) === 0) return false;
	const lastRecalledAtMs = Date.parse(entry.lastRecalledAt);
	return Number.isFinite(lastRecalledAtMs) && lastRecalledAtMs >= cutoffMs;
}
function filterRecallEntriesWithinLookback(params) {
	const cutoffMs = calculateLookbackCutoffMs(params.nowMs, params.lookbackDays);
	return params.entries.filter((entry) => entryWithinLookback(entry, cutoffMs));
}
function resolveWorkspaceMemoryRelativePath(workspaceDir, filePath) {
	const relativePath = path.relative(workspaceDir, filePath).replace(/\\/g, "/");
	if (relativePath && relativePath !== ".." && !relativePath.startsWith("../")) return relativePath;
	return `memory/${path.basename(filePath)}`;
}
async function collectSessionIngestionBatches(params) {
	if (!params.cfg) {
		const nextState = {
			version: 3,
			files: {},
			seenMessages: {}
		};
		return {
			batches: [],
			nextState,
			changed: JSON.stringify(nextState) !== JSON.stringify(params.state)
		};
	}
	const agentIds = resolveSessionAgentsForWorkspace({
		cfg: params.cfg,
		workspaceDir: params.workspaceDir
	});
	const cutoffMs = calculateLookbackCutoffMs(params.nowMs, params.lookbackDays);
	const batchByDay = /* @__PURE__ */ new Map();
	const nextFiles = { ...params.state.files };
	const nextSeenMessages = { ...params.state.seenMessages };
	const sources = [];
	for (const agentId of agentIds) {
		const knownStateKeys = /* @__PURE__ */ new Set();
		const corpus = await listSessionTranscriptCorpusEntriesForAgent(agentId, {
			config: params.cfg,
			includeRetainedSqlite: true
		});
		const forgottenSessionIds = await findForgottenMemorySessionIds({
			agentId,
			sessionIds: corpus.map((entry) => entry.sessionId)
		});
		const selectedSources = [];
		for (const entry of corpus) {
			knownStateKeys.add(sessionIngestionStateKeyFromCorpus(entry));
			const source = sessionIngestionSourceFromCorpus(entry, "dreaming");
			if (source) selectedSources.push(source);
		}
		const excludedReasons = await sessionExclusionReasons(selectedSources, params.admissionPolicy, forgottenSessionIds);
		for (const source of selectedSources) {
			const excludedReason = excludedReasons.get(source);
			if (excludedReason) {
				nextFiles[source.stateKey] = {
					mtimeMs: source.buildOptions.updatedAtMs ?? 0,
					size: 0,
					contentHash: "",
					lineCount: 0,
					lastContentLine: 0,
					excludedReason
				};
				continue;
			}
			sources.push(source);
		}
		for (const stateKey of Object.keys(nextFiles)) if (stateKey.startsWith(`${agentId}:`) && !knownStateKeys.has(stateKey)) delete nextFiles[stateKey];
	}
	const sortedSources = sources.toSorted((a, b) => {
		if (a.agentId !== b.agentId) return a.agentId.localeCompare(b.agentId);
		return a.sessionPath.localeCompare(b.sessionPath);
	});
	let remaining = 240;
	const perFileCap = resolveSessionIngestionFileCap(sortedSources.length);
	for (const source of sortedSources) {
		if (remaining <= 0) break;
		const fileCap = Math.max(1, Math.min(perFileCap, remaining));
		const scan = await scanSessionIngestionSource({
			source,
			previous: params.state.files[source.stateKey],
			seenMessages: nextSeenMessages,
			timezone: params.timezone,
			maxCandidates: fileCap,
			classifyDay: (day) => isDayWithinLookback(day, cutoffMs) ? "include" : "skip"
		});
		if (scan.status === "absent") {
			delete nextFiles[source.stateKey];
			continue;
		}
		if (scan.fileState) nextFiles[source.stateKey] = scan.fileState;
		if (scan.status !== "scanned") continue;
		for (const candidate of scan.candidates) {
			const bucket = batchByDay.get(candidate.day) ?? [];
			bucket.push(candidate);
			batchByDay.set(candidate.day, bucket);
		}
		if (scan.candidates.length > 0) {
			const previousSeen = nextSeenMessages[source.scope] ?? [];
			nextSeenMessages[source.scope] = mergeTrackedMessageHashes(previousSeen, scan.candidates.map((candidate) => candidate.hash));
			remaining -= scan.candidates.length;
		}
	}
	const trimmedSeenMessages = trimTrackedSessionScopes(nextSeenMessages);
	const batches = [];
	for (const day of [...batchByDay.keys()].toSorted()) {
		const lines = batchByDay.get(day) ?? [];
		if (lines.length === 0) continue;
		const results = await appendSessionCorpusLines({
			workspaceDir: params.workspaceDir,
			day,
			lines
		});
		if (results.length > 0) batches.push({
			day,
			results
		});
	}
	const nextState = {
		version: 3,
		files: nextFiles,
		seenMessages: trimmedSeenMessages
	};
	return {
		batches,
		nextState,
		changed: JSON.stringify(nextState) !== JSON.stringify(params.state)
	};
}
const DEFAULT_DAILY_INGESTION_LOOKBACK_DAYS = 14;
function dailyIngestionLookbackDays(phaseLookbackDays) {
	return Math.max(DEFAULT_DAILY_INGESTION_LOOKBACK_DAYS, phaseLookbackDays);
}
async function collectDailyIngestionBatches(params) {
	const provenanceByPath = await readDailyFileProvenance(params.workspaceDir);
	const memoryDir = path.join(params.workspaceDir, "memory");
	const cutoffMs = calculateLookbackCutoffMs(params.nowMs, params.lookbackDays);
	const files = (await listWorkspaceDirectory(params.workspaceDir, memoryDir).catch((err) => {
		if (extractErrorCode(err) === "ENOENT") return [];
		throw err;
	})).flatMap((entry) => {
		const file = entry.isFile() ? parseDailyMemoryFileName(entry.name) : null;
		return file && isDayWithinLookback(file.day, cutoffMs) ? [file] : [];
	}).toSorted(compareDailyMemoryFilesByNewestDay);
	const batches = [];
	const currentPaths = new Set(files.map((file) => `memory/${file.fileName}`));
	const nextFiles = Object.fromEntries(Object.entries(params.state.files).filter(([relativePath]) => currentPaths.has(relativePath)));
	let changed = false;
	const totalCap = Math.max(20, params.limit * 4);
	const perFileCap = Math.max(6, Math.ceil(totalCap / Math.max(1, files.length)));
	let total = 0;
	for (const file of files) {
		const relativePath = `memory/${file.fileName}`;
		const filePath = path.join(memoryDir, file.fileName);
		const stat = await inspectWorkspaceFile(params.workspaceDir, filePath).catch((err) => {
			if (extractErrorCode(err) === "ENOENT") return null;
			throw err;
		});
		if (!stat) {
			delete nextFiles[relativePath];
			continue;
		}
		const fingerprint = {
			mtimeMs: Math.floor(Math.max(0, stat.mtimeMs)),
			size: Math.floor(Math.max(0, stat.size))
		};
		nextFiles[relativePath] = fingerprint;
		const previous = params.state.files[relativePath];
		const unchanged = previous !== void 0 && previous.mtimeMs === fingerprint.mtimeMs && previous.size === fingerprint.size;
		const previousDreamingDay = normalizeMemoryDay(previous?.lastDreamingDayIngested);
		if (unchanged && previousDreamingDay === params.ingestionDreamingDay) {
			fingerprint.lastDreamingDayIngested = previousDreamingDay;
			continue;
		}
		changed = true;
		const raw = await readWorkspaceText(params.workspaceDir, filePath).catch((err) => {
			if (extractErrorCode(err) === "ENOENT") return "";
			throw err;
		});
		if (!raw) continue;
		const recordedProvenance = provenanceByPath.get(relativePath);
		const results = buildDailyIngestionResults({
			raw,
			path: relativePath,
			limit: Math.min(perFileCap, totalCap - total),
			defaultObservedAt: fingerprint.mtimeMs,
			...recordedProvenance ? { recorded: recordedProvenance } : {}
		});
		if (results.length === 0) continue;
		batches.push({
			day: file.day,
			results
		});
		total += results.length;
		fingerprint.lastDreamingDayIngested = params.ingestionDreamingDay;
		if (total >= totalCap) break;
	}
	if (!changed) {
		const previousKeys = Object.keys(params.state.files);
		const nextKeys = Object.keys(nextFiles);
		if (previousKeys.length !== nextKeys.length || previousKeys.some((key) => !Object.hasOwn(nextFiles, key))) changed = true;
	}
	return {
		batches,
		nextState: {
			version: 1,
			files: nextFiles
		},
		changed
	};
}
async function seedHistoricalDailyMemorySignals(params) {
	const normalizedPaths = uniqueStrings(normalizeStringEntries(params.filePaths));
	if (normalizedPaths.length === 0) return {
		importedFileCount: 0,
		importedSignalCount: 0,
		skippedPaths: []
	};
	return await withMemoryWorkspaceLock(params.workspaceDir, async () => {
		const provenanceByPath = await readDailyFileProvenance(params.workspaceDir);
		const resolved = normalizedPaths.map((filePath) => ({
			filePath,
			file: parseDailyMemoryFileName(path.basename(filePath))
		})).toSorted((a, b) => {
			if (a.file && b.file) return compareDailyMemoryFilesByNewestDay(a.file, b.file);
			if (a.file) return -1;
			if (b.file) return 1;
			return a.filePath.localeCompare(b.filePath);
		});
		const valid = resolved.flatMap((entry) => entry.file ? [{
			filePath: entry.filePath,
			file: entry.file
		}] : []);
		const skippedPaths = resolved.filter((entry) => !entry.file).map((entry) => entry.filePath);
		const totalCap = Math.max(20, params.limit * 4);
		const perFileCap = Math.max(6, Math.ceil(totalCap / Math.max(1, valid.length)));
		let importedSignalCount = 0;
		let importedFileCount = 0;
		for (const entry of valid) {
			if (importedSignalCount >= totalCap) break;
			const raw = await readWorkspaceText(params.workspaceDir, entry.filePath).catch((err) => {
				if (extractErrorCode(err) === "ENOENT") {
					skippedPaths.push(entry.filePath);
					return "";
				}
				throw err;
			});
			if (!raw) continue;
			const relativePath = resolveWorkspaceMemoryRelativePath(params.workspaceDir, entry.filePath);
			const recordedProvenance = provenanceByPath.get(relativePath);
			const results = buildDailyIngestionResults({
				raw,
				path: relativePath,
				limit: Math.min(perFileCap, totalCap - importedSignalCount),
				defaultObservedAt: params.nowMs,
				...recordedProvenance ? { recorded: recordedProvenance } : {}
			});
			if (results.length === 0) continue;
			await recordShortTermRecalls({
				workspaceDir: params.workspaceDir,
				query: `__dreaming_daily__:${entry.file.day}`,
				results,
				signalType: "daily",
				dedupeByQueryPerDay: true,
				dayBucket: formatMemoryDreamingDay(params.nowMs, params.timezone),
				nowMs: params.nowMs,
				timezone: params.timezone
			});
			importedSignalCount += results.length;
			importedFileCount += 1;
		}
		return {
			importedFileCount,
			importedSignalCount,
			skippedPaths
		};
	});
}
function entryAverageScore(entry) {
	const signalCount = Math.max(0, Math.floor(entry.recallCount ?? 0) + Math.floor(entry.dailyCount ?? 0) + Math.floor(entry.groundedCount ?? 0));
	return signalCount > 0 ? Math.max(0, Math.min(1, entry.totalScore / signalCount)) : 0;
}
function dedupeEntries(entries, threshold) {
	const deduped = [];
	for (const entry of entries) {
		const duplicate = deduped.find((candidate) => candidate.path === entry.path && textSimilarity(candidate.snippet, entry.snippet) >= threshold);
		if (duplicate) {
			duplicate.sourceEntryKeys.push(entry.key);
			if (entry.recallCount > duplicate.recallCount) duplicate.recallCount = entry.recallCount;
			duplicate.totalScore = Math.max(duplicate.totalScore, entry.totalScore);
			duplicate.maxScore = Math.max(duplicate.maxScore, entry.maxScore);
			duplicate.queryHashes = uniqueStrings([...duplicate.queryHashes, ...entry.queryHashes]);
			duplicate.userQueryHashes = uniqueStrings([...duplicate.userQueryHashes ?? [], ...entry.userQueryHashes ?? []]);
			duplicate.recallDays = [.../* @__PURE__ */ new Set([...duplicate.recallDays, ...entry.recallDays])].toSorted();
			duplicate.conceptTags = uniqueStrings([...duplicate.conceptTags, ...entry.conceptTags]);
			duplicate.lastRecalledAt = compareStoreTimestampDesc(entry.lastRecalledAt, duplicate.lastRecalledAt) < 0 ? entry.lastRecalledAt : duplicate.lastRecalledAt;
			continue;
		}
		deduped.push({
			...entry,
			sourceEntryKeys: [entry.key]
		});
	}
	return deduped;
}
function normalizeDiaryCoverageText(text) {
	return text.toLowerCase().replace(/\s+/g, " ").trim();
}
function isEntryCoveredByRecentDiary(entry, recentDiaryEntries) {
	const snippet = normalizeDiaryCoverageText(entry.snippet);
	if (!snippet) return false;
	return recentDiaryEntries.some((diaryEntry) => {
		return normalizeDiaryCoverageText(diaryEntry).includes(snippet) || textSimilarity(entry.snippet, diaryEntry) >= LIGHT_DIARY_SNIPPET_SIMILARITY_THRESHOLD;
	});
}
function prioritizeLightEntriesByDiaryCoverage(entries, recentDiaryEntries) {
	if (recentDiaryEntries.length === 0) return entries;
	const fresh = [];
	const covered = [];
	for (const entry of entries) if (isEntryCoveredByRecentDiary(entry, recentDiaryEntries)) covered.push(entry);
	else fresh.push(entry);
	return [...fresh, ...covered];
}
function buildLightDreamingBody(entries) {
	if (entries.length === 0) return ["- No notable updates."];
	return entries.flatMap((entry) => [
		`- Candidate: ${entry.snippet || "(no snippet captured)"}`,
		`  - confidence: ${entryAverageScore(entry).toFixed(2)}`,
		`  - evidence: ${entry.path}:${entry.startLine}-${entry.endLine}`,
		`  - recalls: ${entry.recallCount}`,
		`  - status: staged`
	]);
}
function calculateCandidateTruthConfidence(entry) {
	const recallStrength = Math.min(1, Math.log1p(entry.recallCount) / Math.log1p(6));
	const averageScore = entryAverageScore(entry);
	const consolidation = Math.min(1, (entry.recallDays?.length ?? 0) / 3);
	const conceptual = Math.min(1, (entry.conceptTags?.length ?? 0) / 6);
	return Math.max(0, Math.min(1, averageScore * .45 + recallStrength * .25 + consolidation * .2 + conceptual * .1));
}
function selectRemCandidateTruths(entries, limit) {
	if (limit <= 0) return [];
	return dedupeEntries(entries.filter((entry) => !entry.promotedAt), .88).map((entry) => ({
		key: entry.key,
		snippet: entry.snippet || "(no snippet captured)",
		confidence: calculateCandidateTruthConfidence(entry),
		evidence: `${entry.path}:${entry.startLine}-${entry.endLine}`
	})).filter((entry) => entry.confidence >= .45).toSorted((a, b) => b.confidence - a.confidence || a.snippet.localeCompare(b.snippet)).slice(0, limit);
}
function buildRemReflections(entries, limit, minPatternStrength) {
	const tagStats = /* @__PURE__ */ new Map();
	for (const entry of entries) for (const tag of new Set(entry.conceptTags.map(normalizeConceptToken))) {
		if (!tag) continue;
		const stat = tagStats.get(tag) ?? {
			count: 0,
			evidence: /* @__PURE__ */ new Set()
		};
		stat.count += 1;
		stat.evidence.add(`${entry.path}:${entry.startLine}-${entry.endLine}`);
		tagStats.set(tag, stat);
	}
	const ranked = [...tagStats.entries()].map(([tag, stat]) => {
		return {
			tag,
			strength: Math.min(1, stat.count / Math.max(1, entries.length) * 2),
			stat
		};
	}).filter((entry) => entry.strength >= minPatternStrength).toSorted((a, b) => b.strength - a.strength || b.stat.count - a.stat.count || a.tag.localeCompare(b.tag)).slice(0, limit);
	if (ranked.length === 0) return ["- No strong patterns surfaced."];
	return ranked.flatMap((entry) => [
		`- Theme: \`${entry.tag}\` kept surfacing across ${entry.stat.count} memories.`,
		`  - confidence: ${entry.strength.toFixed(2)}`,
		`  - evidence: ${[...entry.stat.evidence].slice(0, 3).join(", ")}`,
		`  - note: reflection`
	]);
}
function previewRemDreaming(params) {
	const reflections = buildRemReflections(params.entries, params.limit, params.minPatternStrength);
	const candidateSelections = selectRemCandidateTruths(params.entries, Math.max(1, Math.min(3, params.limit)));
	const candidateTruths = candidateSelections.map((entry) => ({
		snippet: entry.snippet,
		confidence: entry.confidence,
		evidence: entry.evidence
	}));
	const candidateKeys = uniqueStrings(candidateSelections.map((entry) => entry.key));
	const bodyLines = [
		"### Reflections",
		...reflections,
		"",
		"### Possible Lasting Truths",
		...candidateTruths.length > 0 ? candidateTruths.map((entry) => `- ${entry.snippet} [confidence=${entry.confidence.toFixed(2)} evidence=${entry.evidence}]`) : ["- No strong candidate truths surfaced."]
	];
	return {
		sourceEntryCount: params.entries.length,
		reflections,
		candidateTruths,
		candidateKeys,
		bodyLines
	};
}
async function ingestDreamingPhaseSignals(params) {
	const { workspaceDir, nowMs } = params;
	const ingestionParams = {
		workspaceDir,
		nowMs,
		timezone: params.config.timezone
	};
	const recordBatches = async (batches, source, ingestionDayBucket) => {
		for (const batch of batches) await recordShortTermRecalls({
			...ingestionParams,
			query: `__dreaming_${source}__:${batch.day}`,
			results: batch.results,
			signalType: "daily",
			dedupeByQueryPerDay: source === "sessions",
			dayBucket: ingestionDayBucket ?? batch.day
		});
	};
	await withMemoryWorkspaceLock(workspaceDir, async () => {
		const state = await readDailyIngestionState(workspaceDir);
		const ingestionDreamingDay = formatMemoryDreamingDay(nowMs, ingestionParams.timezone);
		const collected = await collectDailyIngestionBatches({
			...ingestionParams,
			lookbackDays: dailyIngestionLookbackDays(params.config.lookbackDays),
			limit: params.config.limit,
			ingestionDreamingDay,
			state
		});
		await recordBatches(collected.batches, "daily");
		if (collected.changed) await writeDailyIngestionState(workspaceDir, collected.nextState);
	});
	await withMemoryWorkspaceLock(workspaceDir, async () => {
		const state = await readSessionIngestionState(workspaceDir);
		const collected = await collectSessionIngestionBatches({
			...ingestionParams,
			cfg: params.cfg,
			lookbackDays: params.config.lookbackDays,
			admissionPolicy: params.admissionPolicy,
			state
		});
		const ingestionDayBucket = formatMemoryDreamingDay(nowMs, ingestionParams.timezone);
		await recordBatches(collected.batches, "sessions", ingestionDayBucket);
		if (collected.changed) await writeSessionIngestionState(workspaceDir, collected.nextState);
	});
}
async function readDreamingPhaseEntries(params, phase) {
	const { workspaceDir, nowMs } = params;
	let entries = filterRecallEntriesWithinLookback({
		entries: await readShortTermRecallEntries({
			workspaceDir,
			nowMs
		}),
		nowMs,
		lookbackDays: params.config.lookbackDays
	});
	if (phase === "light") entries = await filterFreshLightDreamingEntries({
		workspaceDir,
		nowMs,
		entries
	});
	return (await filterLiveShortTermRecallEntries({
		workspaceDir,
		entries
	})).filter((entry) => !isPromotionOriginBlocked(entry));
}
async function prepareLightDreaming(params) {
	const { nowMs } = params;
	const rankedEntries = dedupeEntries((await readDreamingPhaseEntries(params, "light")).toSorted((a, b) => {
		const byTime = compareStoreTimestampDesc(a.lastRecalledAt, b.lastRecalledAt);
		if (byTime !== 0) return byTime;
		return b.recallCount - a.recallCount;
	}), params.config.dedupeSimilarity);
	const recentDiaryEntries = await readRecentDreamDiaryEntries({
		workspaceDir: params.workspaceDir,
		limit: LIGHT_DIARY_HISTORY_LIMIT
	});
	const entries = prioritizeLightEntriesByDiaryCoverage(rankedEntries, recentDiaryEntries);
	const capped = entries.slice(0, params.config.limit);
	let data;
	if (capped.length > 0) {
		const themes = uniqueStrings(capped.flatMap((e) => e.conceptTags).filter(Boolean));
		data = {
			phase: "light",
			snippets: capped.map((e) => e.snippet).filter(Boolean),
			sourceEntryKeys: capped.flatMap((entry) => entry.sourceEntryKeys),
			currentDate: formatMemoryDreamingDay(nowMs, params.config.timezone),
			...themes.length > 0 ? { themes } : {},
			...recentDiaryEntries.length > 0 ? { recentDiaryEntries } : {}
		};
	}
	return {
		bodyLines: buildLightDreamingBody(capped),
		keys: capped.map((entry) => entry.key),
		logMessage: `memory-core: light dreaming staged ${Math.min(entries.length, params.config.limit)} candidate(s) [workspace=${params.workspaceDir}].`,
		data
	};
}
async function prepareRemDreaming(params) {
	const { nowMs } = params;
	const allEntries = await readDreamingPhaseEntries(params, "rem");
	const lightKeys = await readLightStagedKeys({
		workspaceDir: params.workspaceDir,
		nowMs
	});
	const stagedEntries = lightKeys.size > 0 ? allEntries.filter((entry) => lightKeys.has(entry.key)) : [];
	const entries = stagedEntries.length > 0 ? stagedEntries : allEntries;
	const preview = previewRemDreaming({
		entries,
		limit: params.config.limit,
		minPatternStrength: params.config.minPatternStrength
	});
	let data;
	if (entries.length > 0) {
		const snippets = preview.candidateTruths.map((t) => t.snippet).filter(Boolean);
		const themes = preview.reflections.filter((r) => !r.startsWith("- No strong") && !r.startsWith("  -"));
		data = {
			phase: "rem",
			sourceEntryKeys: entries.map((entry) => entry.key),
			snippets: snippets.length > 0 ? snippets : entries.slice(0, 8).map((e) => e.snippet).filter(Boolean),
			...themes.length > 0 ? { themes } : {}
		};
	}
	return {
		bodyLines: preview.bodyLines,
		keys: preview.candidateKeys,
		consideredKeys: stagedEntries.map((entry) => entry.key),
		logMessage: `memory-core: REM dreaming wrote reflections from ${entries.length} recent memory trace(s) [workspace=${params.workspaceDir}].`,
		data
	};
}
async function runDreamingSweepPhases(params) {
	const sweepNowMs = typeof params.nowMs === "number" && Number.isFinite(params.nowMs) ? params.nowMs : Date.now();
	const admissionPolicy = resolveAdmissionPolicy(params.pluginConfig);
	const narratives = [];
	let failed = false;
	async function runPhase(phase, config, prepare) {
		if (!config.enabled || config.limit <= 0) return;
		try {
			const phaseParams = {
				...params,
				config,
				nowMs: sweepNowMs,
				admissionPolicy
			};
			await ingestDreamingPhaseSignals(phaseParams);
			const data = await withMemoryWorkspaceLock(params.workspaceDir, async () => {
				const prepared = await prepare(phaseParams);
				const publication = {
					workspaceDir: params.workspaceDir,
					phase,
					nowMs: sweepNowMs
				};
				await writeDailyDreamingPhaseBlock({
					...publication,
					bodyLines: prepared.bodyLines,
					hasContent: prepared.data !== void 0,
					timezone: config.timezone,
					storage: config.storage
				});
				if (prepared.consideredKeys?.length) await recordRemConsideredPhaseSignals({
					...publication,
					keys: prepared.consideredKeys
				});
				await recordDreamingPhaseSignals({
					...publication,
					keys: prepared.keys
				});
				if (prepared.data && config.storage.mode !== "separate") params.logger.info(prepared.logMessage);
				return prepared.data;
			});
			if (data) narratives.push({
				data,
				timezone: config.timezone,
				model: config.execution?.model
			});
		} catch (err) {
			await appendFailedDreamingEvent({
				workspaceDir: params.workspaceDir,
				phase,
				error: formatErrorMessage(err),
				storageMode: config.storage.mode,
				nowMs: sweepNowMs,
				logger: params.logger
			});
			params.logger.error(`memory-core: ${phase} dreaming failed: ${formatErrorMessage(err)}`);
			failed = true;
		}
	}
	await runPhase("light", resolveMemoryLightDreamingConfig(params), prepareLightDreaming);
	if (!failed) await runPhase("rem", resolveMemoryRemDreamingConfig(params), prepareRemDreaming);
	return {
		narratives,
		failed
	};
}
//#endregion
export { seedHistoricalDailyMemorySignals as i, previewRemDreaming as n, runDreamingSweepPhases as r, filterRecallEntriesWithinLookback as t };
