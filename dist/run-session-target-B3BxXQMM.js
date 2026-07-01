import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { p as resolveAgentIdFromSessionKey } from "./session-key-pTKRJb0m.js";
import "./hook-runner-global-D4fQSLSV.js";
import { m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks-BGR46Oie.js";
import { _ as updateSessionStore } from "./store-DJ7wx5_V.js";
import { d as resolveStorePath, m as isCompactionCheckpointTranscriptFileName } from "./paths-CHZBIGhF.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-BFG5Kqze.js";
import "./version-Bsehiavt.js";
import { V as readFileRangeAsync, j as resolveSessionTranscriptRuntimeTarget, z as streamSessionTranscriptLines } from "./session-accessor-Dx6KDG0K.js";
import { s as scanSessionTranscriptTree } from "./transcript-tree-3cM1TqAJ.js";
import { s as migrateSessionEntries } from "./session-manager-D5YeJxMM.js";
import "./sessions-gBZPP61K.js";
import { g as resolveGatewaySessionStoreTarget } from "./session-utils-CWlrm3MP.js";
import { t as log$1 } from "./logger-DibNup0x.js";
import { r as getActiveMemorySearchManager } from "./memory-runtime-C--Ao28B.js";
import { t as resolveMemorySearchConfig } from "./memory-search-QpW93KPi.js";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/gateway/session-compaction-checkpoints.ts
const log = createSubsystemLogger("gateway/session-compaction-checkpoints");
const MAX_COMPACTION_CHECKPOINT_LEAF_SCAN_BYTES = 64 * 1024 * 1024;
function resolveCompactionCheckpointTranscriptPosition(params) {
	const leafId = params.preferredLeafId ?? params.transcriptState?.leafId ?? void 0;
	const entryId = params.transcriptState?.entryId ?? leafId;
	return {
		...leafId ? { leafId } : {},
		...entryId ? { entryId } : {}
	};
}
function checkpointSnapshotPath(checkpoint) {
	return checkpoint.preCompaction.sessionFile?.trim() || void 0;
}
function checkpointSnapshotBytes(checkpoint, snapshotBytesByPath) {
	const sessionFile = checkpointSnapshotPath(checkpoint);
	if (!sessionFile) return 0;
	const bytes = snapshotBytesByPath.get(sessionFile);
	return typeof bytes === "number" && Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
}
function trimSessionCheckpoints(checkpoints, snapshotBytesByPath = /* @__PURE__ */ new Map()) {
	if (!Array.isArray(checkpoints) || checkpoints.length === 0) return {
		kept: void 0,
		removed: []
	};
	const countTrimmed = checkpoints.slice(-25);
	const countRemoved = checkpoints.slice(0, Math.max(0, checkpoints.length - countTrimmed.length));
	const keptNewestFirst = [];
	const byteRemovedNewestFirst = [];
	let retainedBytes = 0;
	for (let index = countTrimmed.length - 1; index >= 0; index -= 1) {
		const checkpoint = countTrimmed[index];
		if (!checkpoint) continue;
		const checkpointBytes = checkpointSnapshotBytes(checkpoint, snapshotBytesByPath);
		if (keptNewestFirst.length === 0 || retainedBytes + checkpointBytes <= 134217728) {
			keptNewestFirst.push(checkpoint);
			retainedBytes += checkpointBytes;
		} else byteRemovedNewestFirst.push(checkpoint);
	}
	const kept = keptNewestFirst.toReversed();
	return {
		kept: kept.length > 0 ? kept : void 0,
		removed: [...countRemoved, ...byteRemovedNewestFirst.toReversed()]
	};
}
function sessionStoreCheckpoints(entry) {
	return Array.isArray(entry?.compactionCheckpoints) ? [...entry.compactionCheckpoints] : [];
}
async function statCheckpointSnapshotBytes(checkpoints) {
	const bytesByPath = /* @__PURE__ */ new Map();
	await Promise.all(checkpoints.map(async (checkpoint) => {
		const sessionFile = checkpointSnapshotPath(checkpoint);
		if (!sessionFile || bytesByPath.has(sessionFile)) return;
		try {
			const stat = await fs.stat(sessionFile);
			bytesByPath.set(sessionFile, stat.isFile() ? stat.size : 0);
		} catch {
			bytesByPath.set(sessionFile, 0);
		}
	}));
	return bytesByPath;
}
/** Resolve the stored checkpoint reason from compaction trigger state. */
function resolveSessionCompactionCheckpointReason(params) {
	if (params.trigger === "manual") return "manual";
	if (params.timedOut) return "timeout-retry";
	if (params.trigger === "overflow") return "overflow-retry";
	return "auto-threshold";
}
const SESSION_HEADER_READ_MAX_BYTES = 64 * 1024;
const SESSION_TAIL_READ_INITIAL_BYTES = 64 * 1024;
async function readSessionHeaderFromTranscriptAsync(sessionFile) {
	let fileHandle;
	try {
		fileHandle = await fs.open(sessionFile, "r");
		const buffer = await readFileRangeAsync(fileHandle, 0, SESSION_HEADER_READ_MAX_BYTES);
		if (buffer.length <= 0) return null;
		const firstLine = buffer.toString("utf-8").split(/\r?\n/).map((line) => line.trim()).find((line) => line.length > 0);
		if (!firstLine) return null;
		const parsed = JSON.parse(firstLine);
		if (parsed.type !== "session" || typeof parsed.id !== "string" || !parsed.id.trim()) return null;
		return {
			id: parsed.id.trim(),
			...typeof parsed.cwd === "string" && parsed.cwd.trim() ? { cwd: parsed.cwd } : {}
		};
	} catch {
		return null;
	} finally {
		if (fileHandle) await fileHandle.close().catch(() => void 0);
	}
}
async function readSessionIdFromTranscriptHeaderAsync(sessionFile) {
	return (await readSessionHeaderFromTranscriptAsync(sessionFile))?.id ?? null;
}
function parseTranscriptLine(line) {
	try {
		const parsed = JSON.parse(line);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
		return parsed;
	} catch {
		return null;
	}
}
async function readTranscriptEntriesForForkAsync(params) {
	const entries = [];
	const stopAfterEntryId = params.stopAfterEntryId?.trim();
	let foundStopEntry = false;
	try {
		for await (const line of streamSessionTranscriptLines(params.sessionFile)) try {
			const parsed = JSON.parse(line);
			if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;
			entries.push(parsed);
			if (stopAfterEntryId && parsed.type !== "session" && parsed.id === stopAfterEntryId) {
				foundStopEntry = true;
				break;
			}
		} catch {}
	} catch {
		return null;
	}
	const firstEntry = entries[0];
	if (firstEntry?.type !== "session" || typeof firstEntry.id !== "string") return null;
	if (stopAfterEntryId && !foundStopEntry) return null;
	return entries;
}
function trimTranscriptEntriesThroughLeaf(entries, leafId) {
	const normalizedLeafId = leafId?.trim();
	if (!normalizedLeafId) return entries;
	const leafIndex = entries.findIndex((entry, index) => index > 0 && entry.id === normalizedLeafId);
	if (leafIndex < 1) return null;
	return entries.slice(0, leafIndex + 1);
}
async function readSessionLeafStateFromTranscriptAsync(sessionFile, maxBytes = MAX_COMPACTION_CHECKPOINT_LEAF_SCAN_BYTES) {
	let fileHandle;
	try {
		fileHandle = await fs.open(sessionFile, "r");
		const stat = await fileHandle.stat();
		if (!stat.isFile() || stat.size <= 0) return null;
		const requestedMaxBytes = Number.isFinite(maxBytes) ? Math.max(1024, Math.floor(maxBytes)) : MAX_COMPACTION_CHECKPOINT_LEAF_SCAN_BYTES;
		const maxReadableBytes = Math.min(stat.size, requestedMaxBytes);
		let readLength = Math.min(maxReadableBytes, SESSION_TAIL_READ_INITIAL_BYTES);
		while (readLength > 0) {
			const readStart = Math.max(0, stat.size - readLength);
			const lines = (await readFileRangeAsync(fileHandle, readStart, readLength)).toString("utf-8").split(/\r?\n/);
			const candidateLines = readStart > 0 ? lines.slice(1) : lines;
			const records = [];
			let latestEntryId;
			for (const candidateLine of candidateLines) {
				const line = candidateLine.trim();
				if (!line) continue;
				const parsed = parseTranscriptLine(line);
				if (!parsed) continue;
				records.push(parsed);
				if (parsed.type === "session") continue;
				const entryId = typeof parsed.id === "string" ? parsed.id.trim() : "";
				if (entryId) latestEntryId = entryId;
			}
			const tree = scanSessionTranscriptTree(records);
			if (latestEntryId && tree.hasLeafUpdate && (!tree.hasInvalidLeafControl || readStart === 0)) return {
				entryId: latestEntryId,
				leafId: tree.leafId
			};
			if (readStart === 0) return null;
			const nextReadLength = Math.min(maxReadableBytes, readLength * 2);
			if (nextReadLength === readLength) return latestEntryId ? {
				entryId: latestEntryId,
				leafId: latestEntryId
			} : null;
			readLength = nextReadLength;
		}
	} catch {
		return null;
	} finally {
		if (fileHandle) await fileHandle.close().catch(() => void 0);
	}
	return null;
}
async function forkCompactionCheckpointTranscriptAsync(params) {
	const sourceFile = params.sourceFile.trim();
	if (!sourceFile) return null;
	const sourceHeader = await readSessionHeaderFromTranscriptAsync(sourceFile);
	if (!sourceHeader) return null;
	const entries = await readTranscriptEntriesForForkAsync({
		sessionFile: sourceFile,
		stopAfterEntryId: params.sourceLeafId
	});
	if (!entries) return null;
	migrateSessionEntries(entries);
	const forkEntries = trimTranscriptEntriesThroughLeaf(entries, params.sourceLeafId);
	if (!forkEntries) return null;
	const targetCwd = params.targetCwd ?? sourceHeader.cwd ?? process.cwd();
	const sessionDir = params.sessionDir ?? path.dirname(sourceFile);
	const sessionId = randomUUID();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	const fileTimestamp = timestamp.replace(/[:.]/g, "-");
	const sessionFile = path.join(sessionDir, `${fileTimestamp}_${sessionId}.jsonl`);
	const header = {
		type: "session",
		version: 3,
		id: sessionId,
		timestamp,
		cwd: targetCwd,
		parentSession: sourceFile
	};
	try {
		await fs.mkdir(sessionDir, { recursive: true });
		const lines = [JSON.stringify(header)];
		for (const entry of forkEntries) if (entry.type !== "session") lines.push(JSON.stringify(entry));
		await fs.writeFile(sessionFile, `${lines.join("\n")}\n`, {
			encoding: "utf-8",
			flag: "wx"
		});
		return {
			sessionId,
			sessionFile
		};
	} catch {
		try {
			await fs.unlink(sessionFile);
		} catch {}
		return null;
	}
}
function resolveCheckpointTranscriptForkSource(checkpoint) {
	const preCompactionFile = checkpoint.preCompaction.sessionFile?.trim();
	if (preCompactionFile) return {
		sourceFile: preCompactionFile,
		sourceLeafId: checkpoint.preCompaction.entryId ?? checkpoint.preCompaction.leafId,
		totalTokens: checkpoint.tokensBefore
	};
	const postCompactionFile = checkpoint.postCompaction.sessionFile?.trim();
	if (!postCompactionFile) return null;
	const postCompactionLeafId = checkpoint.postCompaction.entryId ?? checkpoint.postCompaction.leafId;
	if (!postCompactionLeafId) return null;
	return {
		sourceFile: postCompactionFile,
		sourceLeafId: postCompactionLeafId,
		totalTokens: checkpoint.tokensAfter
	};
}
async function forkCheckpointTranscriptFromStoredBoundary(params) {
	const forkSource = resolveCheckpointTranscriptForkSource(params.checkpoint);
	if (!forkSource) return { status: "missing-boundary" };
	const forked = await forkCompactionCheckpointTranscriptAsync({
		sourceFile: forkSource.sourceFile,
		sourceLeafId: forkSource.sourceLeafId,
		sessionDir: params.sessionDir ?? path.dirname(forkSource.sourceFile),
		...params.targetCwd ? { targetCwd: params.targetCwd } : {}
	});
	if (!forked) return { status: "failed" };
	return {
		status: "created",
		transcript: {
			...forked,
			...typeof forkSource.totalTokens === "number" ? { totalTokens: forkSource.totalTokens } : {}
		}
	};
}
function cloneCheckpointSessionEntry(params) {
	return {
		...params.currentEntry,
		sessionId: params.nextSessionId,
		sessionFile: params.nextSessionFile,
		updatedAt: Date.now(),
		systemSent: false,
		abortedLastRun: false,
		startedAt: void 0,
		endedAt: void 0,
		runtimeMs: void 0,
		status: void 0,
		inputTokens: void 0,
		outputTokens: void 0,
		cacheRead: void 0,
		cacheWrite: void 0,
		estimatedCostUsd: void 0,
		totalTokens: typeof params.totalTokens === "number" && Number.isFinite(params.totalTokens) ? params.totalTokens : void 0,
		totalTokensFresh: typeof params.totalTokens === "number" && Number.isFinite(params.totalTokens) ? true : void 0,
		label: params.label ?? params.currentEntry.label,
		parentSessionKey: params.parentSessionKey ?? params.currentEntry.parentSessionKey,
		compactionCheckpoints: params.preserveCompactionCheckpoints ? params.currentEntry.compactionCheckpoints : void 0
	};
}
async function branchCheckpointSessionFromStoredBoundary(params) {
	return await updateSessionStore(params.storePath, async (store) => {
		const currentEntry = store[params.sourceStoreKey ?? params.sourceKey];
		if (!currentEntry?.sessionId) return { status: "missing-session" };
		const checkpoint = getSessionCompactionCheckpoint({
			entry: currentEntry,
			checkpointId: params.checkpointId
		});
		if (!checkpoint) return { status: "missing-checkpoint" };
		const forkedSession = await forkCheckpointTranscriptFromStoredBoundary({ checkpoint });
		if (forkedSession.status !== "created") return forkedSession;
		const forkedTranscript = forkedSession.transcript;
		const label = currentEntry.label?.trim() ? `${currentEntry.label.trim()} (checkpoint)` : "Checkpoint branch";
		const nextEntry = cloneCheckpointSessionEntry({
			currentEntry,
			nextSessionId: forkedTranscript.sessionId,
			nextSessionFile: forkedTranscript.sessionFile,
			label,
			parentSessionKey: params.sourceKey,
			totalTokens: forkedTranscript.totalTokens
		});
		store[params.nextKey] = nextEntry;
		return {
			status: "created",
			key: params.nextKey,
			checkpoint,
			entry: nextEntry
		};
	}, { skipSaveWhenResult: (result) => result.status !== "created" });
}
async function restoreCheckpointSessionFromStoredBoundary(params) {
	return await updateSessionStore(params.storePath, async (store) => {
		const currentEntry = store[params.sessionStoreKey ?? params.sessionKey];
		if (!currentEntry?.sessionId) return { status: "missing-session" };
		const checkpoint = getSessionCompactionCheckpoint({
			entry: currentEntry,
			checkpointId: params.checkpointId
		});
		if (!checkpoint) return { status: "missing-checkpoint" };
		const restoredSession = await forkCheckpointTranscriptFromStoredBoundary({ checkpoint });
		if (restoredSession.status !== "created") return restoredSession;
		const restoredTranscript = restoredSession.transcript;
		const nextEntry = cloneCheckpointSessionEntry({
			currentEntry,
			nextSessionId: restoredTranscript.sessionId,
			nextSessionFile: restoredTranscript.sessionFile,
			totalTokens: restoredTranscript.totalTokens,
			preserveCompactionCheckpoints: true
		});
		store[params.sessionKey] = nextEntry;
		return {
			status: "created",
			key: params.sessionKey,
			checkpoint,
			entry: nextEntry
		};
	}, { skipSaveWhenResult: (result) => result.status !== "created" });
}
/**
* Creates the current file-backed compaction checkpoint domain store.
*
* The branch/restore operations own the transcript fork plus session entry
* update so a SQLite implementation can copy transcript rows and update
* `session_entries.entry_json` inside one write transaction.
*/
function createFileBackedCompactionCheckpointStore() {
	return {
		captureSnapshot: captureCompactionCheckpointSnapshotAsync,
		persistCheckpoint: persistSessionCompactionCheckpoint,
		cleanupSnapshot: cleanupCompactionCheckpointSnapshot,
		branchCheckpointSession: branchCheckpointSessionFromStoredBoundary,
		restoreCheckpointSession: restoreCheckpointSessionFromStoredBoundary
	};
}
/**
* Capture the stable pre-compaction identity without duplicating the transcript.
* Branch/restore uses the compacted successor transcript, while legacy
* checkpoints that already have a snapshot file keep working.
*/
async function captureCompactionCheckpointSnapshotAsync(params) {
	const getLeafId = params.sessionManager && typeof params.sessionManager.getLeafId === "function" ? params.sessionManager.getLeafId.bind(params.sessionManager) : null;
	const sessionFile = params.sessionFile.trim();
	if (!sessionFile || params.sessionManager && !getLeafId) return null;
	const liveLeafId = getLeafId ? getLeafId() : void 0;
	if (getLeafId && !liveLeafId) return null;
	const maxBytes = params.maxBytes ?? 67108864;
	const sessionId = await readSessionIdFromTranscriptHeaderAsync(sessionFile);
	const position = resolveCompactionCheckpointTranscriptPosition({
		preferredLeafId: liveLeafId,
		transcriptState: await readSessionLeafStateFromTranscriptAsync(sessionFile, maxBytes)
	});
	const leafId = position.leafId;
	if (!sessionId || !leafId) return null;
	return {
		sessionId,
		leafId,
		...position.entryId ? { entryId: position.entryId } : {}
	};
}
async function cleanupCompactionCheckpointSnapshot(snapshot) {
	if (!snapshot?.sessionFile) return;
	try {
		await fs.unlink(snapshot.sessionFile);
	} catch {}
}
async function cleanupTrimmedCompactionCheckpointFiles(params) {
	if (params.removed.length === 0 || !params.artifactDir) return;
	const artifactDir = path.resolve(params.artifactDir);
	const retainedPaths = new Set((params.retained ?? []).map((checkpoint) => checkpoint.preCompaction.sessionFile?.trim()).filter((filePath) => Boolean(filePath)));
	for (const checkpoint of params.removed) {
		const sessionFile = checkpoint.preCompaction.sessionFile?.trim();
		if (!sessionFile || retainedPaths.has(sessionFile)) continue;
		const resolvedSessionFile = path.resolve(sessionFile);
		if (path.dirname(resolvedSessionFile) !== artifactDir || !isCompactionCheckpointTranscriptFileName(path.basename(resolvedSessionFile))) continue;
		try {
			await fs.unlink(resolvedSessionFile);
		} catch {}
	}
}
async function persistSessionCompactionCheckpoint(params) {
	const snapshotSessionFile = params.snapshot.sessionFile?.trim();
	const postSessionFile = params.postSessionFile?.trim();
	const postSourceLeafId = params.postEntryId?.trim() || params.postLeafId?.trim();
	if (!snapshotSessionFile && (!postSessionFile || !postSourceLeafId)) {
		log.warn("skipping compaction checkpoint persist: missing stable fork source", { sessionKey: params.sessionKey });
		return null;
	}
	const target = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.sessionKey
	});
	const createdAt = params.createdAt ?? Date.now();
	const checkpoint = {
		checkpointId: randomUUID(),
		sessionKey: target.canonicalKey,
		sessionId: params.sessionId,
		createdAt,
		reason: params.reason,
		...typeof params.tokensBefore === "number" ? { tokensBefore: params.tokensBefore } : {},
		...typeof params.tokensAfter === "number" ? { tokensAfter: params.tokensAfter } : {},
		...params.summary?.trim() ? { summary: params.summary.trim() } : {},
		...params.firstKeptEntryId?.trim() ? { firstKeptEntryId: params.firstKeptEntryId.trim() } : {},
		preCompaction: {
			sessionId: params.snapshot.sessionId,
			...params.snapshot.sessionFile?.trim() ? { sessionFile: params.snapshot.sessionFile.trim() } : {},
			leafId: params.snapshot.leafId,
			...params.snapshot.entryId?.trim() ? { entryId: params.snapshot.entryId.trim() } : {}
		},
		postCompaction: {
			sessionId: params.sessionId,
			...postSessionFile ? { sessionFile: postSessionFile } : {},
			...params.postLeafId?.trim() ? { leafId: params.postLeafId.trim() } : {},
			...params.postEntryId?.trim() ? { entryId: params.postEntryId.trim() } : {}
		}
	};
	let stored = false;
	let trimmedCheckpoints;
	await updateSessionStore(target.storePath, async (store) => {
		const existing = store[target.canonicalKey];
		if (!existing?.sessionId) return;
		const checkpoints = sessionStoreCheckpoints(existing);
		checkpoints.push(checkpoint);
		trimmedCheckpoints = trimSessionCheckpoints(checkpoints, await statCheckpointSnapshotBytes(checkpoints));
		store[target.canonicalKey] = {
			...existing,
			updatedAt: Math.max(existing.updatedAt ?? 0, createdAt),
			compactionCheckpoints: trimmedCheckpoints.kept
		};
		stored = true;
	});
	if (!stored) {
		log.warn("skipping compaction checkpoint persist: session not found", { sessionKey: params.sessionKey });
		return null;
	}
	const checkpointArtifactFile = snapshotSessionFile || postSessionFile || "";
	await cleanupTrimmedCompactionCheckpointFiles({
		removed: trimmedCheckpoints?.removed ?? [],
		retained: trimmedCheckpoints?.kept,
		...checkpointArtifactFile ? { artifactDir: path.dirname(checkpointArtifactFile) } : {}
	});
	return checkpoint;
}
function listSessionCompactionCheckpoints(entry) {
	return sessionStoreCheckpoints(entry).toSorted((a, b) => b.createdAt - a.createdAt);
}
function getSessionCompactionCheckpoint(params) {
	const checkpointId = params.checkpointId.trim();
	if (!checkpointId) return;
	return listSessionCompactionCheckpoints(params.entry).find((checkpoint) => checkpoint.checkpointId === checkpointId);
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-hooks.ts
function resolvePostCompactionIndexSyncMode(config) {
	const mode = config?.agents?.defaults?.compaction?.postIndexSync;
	if (mode === "off" || mode === "async" || mode === "await") return mode;
	return "async";
}
async function runPostCompactionSessionMemorySync(params) {
	if (!params.config) return;
	try {
		const sessionFile = params.sessionFile.trim();
		if (!sessionFile) return;
		const agentId = resolveSessionAgentId({
			sessionKey: params.sessionKey,
			config: params.config,
			agentId: params.agentId
		});
		const resolvedMemory = resolveMemorySearchConfig(params.config, agentId);
		if (!resolvedMemory || !resolvedMemory.sources.includes("sessions")) return;
		if (!resolvedMemory.sync.sessions.postCompactionForce) return;
		const { manager } = await getActiveMemorySearchManager({
			cfg: params.config,
			agentId
		});
		if (!manager?.sync) return;
		await manager.sync({
			reason: "post-compaction",
			sessionFiles: [sessionFile]
		});
	} catch (err) {
		log$1.warn(`memory sync skipped (post-compaction): ${formatErrorMessage(err)}`);
	}
}
function syncPostCompactionSessionMemory(params) {
	if (params.mode === "off" || !params.config) return Promise.resolve();
	const syncTask = runPostCompactionSessionMemorySync({
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		sessionFile: params.sessionFile
	});
	if (params.mode === "await") return syncTask;
	return Promise.resolve();
}
/** Emits post-compaction transcript and memory-index side effects for a compacted session file. */
async function runPostCompactionSideEffects(params) {
	const sessionFile = params.sessionFile.trim();
	if (!sessionFile) return;
	emitSessionTranscriptUpdate({
		sessionFile,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	await syncPostCompactionSessionMemory({
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		sessionFile,
		mode: resolvePostCompactionIndexSyncMode(params.config)
	});
}
/** Converts the global hook runner into the compaction-specific hook shape. */
function asCompactionHookRunner(hookRunner) {
	if (!hookRunner) return null;
	return {
		hasHooks: (hookName) => hookRunner.hasHooks?.(hookName) ?? false,
		runBeforeCompaction: hookRunner.runBeforeCompaction?.bind(hookRunner),
		runAfterCompaction: hookRunner.runAfterCompaction?.bind(hookRunner)
	};
}
function estimateTokenCountSafe(messages, estimateTokensFn) {
	try {
		let total = 0;
		for (const message of messages) total += estimateTokensFn(message);
		return total;
	} catch {
		return;
	}
}
/** Builds before-hook metrics while tolerating providers that cannot estimate all messages. */
function buildBeforeCompactionHookMetrics(params) {
	return {
		messageCountOriginal: params.originalMessages.length,
		tokenCountOriginal: estimateTokenCountSafe(params.originalMessages, params.estimateTokensFn),
		messageCountBefore: params.currentMessages.length,
		tokenCountBefore: params.observedTokenCount ?? estimateTokenCountSafe(params.currentMessages, params.estimateTokensFn)
	};
}
/** Runs internal and plugin before-compaction hooks, forwarding hook-produced messages. */
async function runBeforeCompactionHooks(params) {
	const missingSessionKey = !params.sessionKey || !params.sessionKey.trim();
	const hookSessionKey = params.sessionKey?.trim() || params.sessionId;
	try {
		const hookEvent = createInternalHookEvent("session", "compact:before", hookSessionKey, {
			sessionId: params.sessionId,
			missingSessionKey,
			messageCount: params.metrics.messageCountBefore,
			tokenCount: params.metrics.tokenCountBefore,
			messageCountOriginal: params.metrics.messageCountOriginal,
			tokenCountOriginal: params.metrics.tokenCountOriginal
		});
		await triggerInternalHook(hookEvent);
		if (hookEvent.messages.length > 0) await params.onHookMessages?.({
			phase: "before",
			messages: hookEvent.messages.slice(),
			sessionId: params.sessionId,
			sessionKey: hookSessionKey
		});
	} catch (err) {
		log$1.warn("session:compact:before hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	if (params.hookRunner?.hasHooks?.("before_compaction")) try {
		await params.hookRunner.runBeforeCompaction?.({
			messageCount: params.metrics.messageCountBefore,
			tokenCount: params.metrics.tokenCountBefore
		}, {
			sessionId: params.sessionId,
			agentId: params.sessionAgentId,
			sessionKey: hookSessionKey,
			workspaceDir: params.workspaceDir,
			messageProvider: params.messageProvider
		});
	} catch (err) {
		log$1.warn("before_compaction hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	return {
		hookSessionKey,
		missingSessionKey
	};
}
/** Estimates compacted-session token count and rejects impossible growth from stale estimates. */
function estimateTokensAfterCompaction(params) {
	const tokensAfter = estimateTokenCountSafe(params.messagesAfter, params.estimateTokensFn);
	if (tokensAfter === void 0) return;
	const sanityCheckBaseline = params.observedTokenCount ?? params.fullSessionTokensBefore;
	if (sanityCheckBaseline > 0 && tokensAfter > (params.observedTokenCount !== void 0 ? sanityCheckBaseline : sanityCheckBaseline * 1.1)) return;
	return tokensAfter;
}
/** Runs internal and plugin after-compaction hooks with the final compacted metrics. */
async function runAfterCompactionHooks(params) {
	try {
		const hookEvent = createInternalHookEvent("session", "compact:after", params.hookSessionKey, {
			sessionId: params.sessionId,
			missingSessionKey: params.missingSessionKey,
			messageCount: params.messageCountAfter,
			tokenCount: params.tokensAfter,
			compactedCount: params.compactedCount,
			summaryLength: params.summaryLength,
			tokensBefore: params.tokensBefore,
			tokensAfter: params.tokensAfter,
			firstKeptEntryId: params.firstKeptEntryId
		});
		await triggerInternalHook(hookEvent);
		if (hookEvent.messages.length > 0) await params.onHookMessages?.({
			phase: "after",
			messages: hookEvent.messages.slice(),
			sessionId: params.sessionId,
			sessionKey: params.hookSessionKey
		});
	} catch (err) {
		log$1.warn("session:compact:after hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	if (params.hookRunner?.hasHooks?.("after_compaction")) try {
		await params.hookRunner.runAfterCompaction?.({
			messageCount: params.messageCountAfter,
			tokenCount: params.tokensAfter,
			compactedCount: params.compactedCount,
			sessionFile: params.sessionFile
		}, {
			sessionId: params.sessionId,
			agentId: params.sessionAgentId,
			sessionKey: params.hookSessionKey,
			workspaceDir: params.workspaceDir,
			messageProvider: params.messageProvider
		});
	} catch (err) {
		log$1.warn("after_compaction hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/model-context-tokens.ts
/** Returns finite context-token metadata when a model discovery source provided it. */
/** Prefer contextTokens, then contextWindow, when present on model metadata. */
function readAgentModelContextTokens(model) {
	const value = model?.contextTokens;
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
//#endregion
//#region src/agents/run-session-target.ts
/** Resolves the active file-backed target used by current run/session internals. */
async function resolveAgentRunSessionTarget(params) {
	const sessionTarget = params.sessionTarget;
	const agentId = normalizeOptionalString(sessionTarget?.agentId) ?? params.agentId;
	const sessionId = normalizeOptionalString(sessionTarget?.sessionId) ?? params.sessionId;
	const sessionKey = normalizeOptionalString(sessionTarget?.sessionKey) ?? params.sessionKey;
	const effectiveAgentId = agentId ?? resolveAgentIdFromSessionKey(sessionKey);
	const sessionFile = normalizeOptionalString(params.sessionFile);
	if (sessionFile) return {
		agentId: effectiveAgentId ?? "",
		sessionFile,
		sessionId,
		sessionKey: sessionKey ?? ""
	};
	if (!sessionKey) throw new Error(`Cannot resolve run session target without a session key: ${sessionId}`);
	const storePath = normalizeOptionalString(sessionTarget?.storePath) ?? resolveStorePath(params.config?.session?.store, { agentId: effectiveAgentId });
	return await resolveSessionTranscriptRuntimeTarget({
		...effectiveAgentId ? { agentId: effectiveAgentId } : {},
		sessionId,
		sessionKey,
		storePath,
		...sessionTarget?.threadId !== void 0 ? { threadId: sessionTarget.threadId } : {}
	});
}
/** Applies identity fields from the explicit target before legacy backfills run. */
function applyAgentRunSessionTargetIdentity(params) {
	const target = params.sessionTarget;
	if (!target) return params;
	return {
		...params,
		agentId: normalizeOptionalString(target.agentId) ?? params.agentId,
		sessionId: normalizeOptionalString(target.sessionId) ?? params.sessionId,
		sessionKey: normalizeOptionalString(target.sessionKey) ?? params.sessionKey
	};
}
//#endregion
export { buildBeforeCompactionHookMetrics as a, runBeforeCompactionHooks as c, getSessionCompactionCheckpoint as d, listSessionCompactionCheckpoints as f, resolveSessionCompactionCheckpointReason as h, asCompactionHookRunner as i, runPostCompactionSideEffects as l, resolveCompactionCheckpointTranscriptPosition as m, resolveAgentRunSessionTarget as n, estimateTokensAfterCompaction as o, readSessionLeafStateFromTranscriptAsync as p, readAgentModelContextTokens as r, runAfterCompactionHooks as s, applyAgentRunSessionTargetIdentity as t, createFileBackedCompactionCheckpointStore as u };
