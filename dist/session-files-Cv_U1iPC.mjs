import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { C as isDreamingNarrativeSessionStoreKey, x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { o as parseUsageCountedSessionIdFromFileName, r as isCompactionCheckpointTranscriptFileName } from "./transcript-file-names-BZ8jA63H.mjs";
import { a as isSessionArchiveArtifactName, c as isUsageCountedSessionTranscriptFileName } from "./artifacts-C6u8F4sP.mjs";
import { d as resolveSessionTranscriptsDirForAgent } from "./paths-YgcBNLgG.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./openclaw-runtime-paths-BEYXs6HA.mjs";
import { i as projectSessionEntryRecord, n as hashSessionEntrySnapshot } from "./session-entry-projection-E2uWbpaJ.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { f as readTranscriptStatsAsync } from "./session-accessor-Czw4l8kI.mjs";
import { n as materializeSessionArchiveForRead } from "./archive-compression-wxOTBVKt.mjs";
import { t as readRestoredSessionTranscript } from "./session-cold-storage-read-DxurMT4l.mjs";
import { S as readTranscriptExportSnapshotReadOnlySync, T as readTranscriptStatsSync } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { i as readRegularFile, o as statRegularFile, r as normalizeComparablePath } from "./fs-utils-CGe1-9Am.mjs";
import { t as hashText } from "./hash-BOTtT1fO.mjs";
import { t as retryTransientMemoryRead } from "./openclaw-runtime-io-Vhn7I2o9.mjs";
import { n as assertBoundIncognitoMemorySyncAccess } from "./session-transcript-stats-read-yuA27vDM.mjs";
import { a as prepareSessionEntryInWorker, i as prepareSessionEntriesInWorker, n as extractAgentIdFromSessionPath, o as readSessionEntrySnapshotInWorker, r as extractAgentIdFromSessionsDir, t as captureIncognitoMemoryReader } from "./openclaw-runtime-session-Du3RWOJ8.mjs";
import { a as renderSessionEntrySnapshot, i as renderSessionEntry, n as isUsageCountedSessionArchiveTranscriptPath, r as readSessionEntryResetRecallCutoff, s as sqliteSessionFileState, t as attachSessionEntryResetRecallCutoff } from "./session-entry-render-BZbrykV0.mjs";
import { t as listSessionTranscriptCorpusEntriesForAgent } from "./session-transcript-corpus-DI-xp5hv.mjs";
import fs from "node:fs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { safeStatSync } from "@openclaw/fs-safe/path";
//#region packages/memory-host-sdk/src/host/session-entry-source.ts
function resolveBuildSessionSqliteIdentity(absPath, opts) {
	if (opts.agentId && opts.sessionId && opts.storePath) return {
		agentId: opts.agentId,
		sessionId: opts.sessionId,
		...opts.sessionKey ? { sessionKey: opts.sessionKey } : {},
		storePath: opts.storePath
	};
	const marker = parseSqliteSessionFileMarker(absPath);
	return marker && opts.sessionKey ? {
		...marker,
		sessionKey: opts.sessionKey
	} : marker;
}
//#endregion
//#region packages/memory-host-sdk/src/host/session-files.ts
function matchesSessionEntryPrefixHash(entry, lineCount, expectedHash) {
	const lines = entry.content ? entry.content.split("\n") : [];
	if (!Number.isInteger(lineCount) || lineCount < 0 || lineCount > lines.length) return false;
	const resetRecallCutoff = readSessionEntryResetRecallCutoff(entry);
	const prefix = {
		content: lines.slice(0, lineCount).join("\n"),
		lineMap: entry.lineMap.slice(0, lineCount),
		messageTimestampsMs: entry.messageTimestampsMs.slice(0, lineCount),
		lineProvenance: entry.lineProvenance.slice(0, lineCount)
	};
	return hashSessionEntrySnapshot({
		...prefix,
		resetRecallCutoff
	}) === expectedHash;
}
function shouldSkipTranscriptFileForDreaming(absPath) {
	const fileName = path.basename(absPath);
	if (isCompactionCheckpointTranscriptFileName(fileName)) return true;
	if (isSessionArchiveArtifactName(fileName) && !isUsageCountedSessionTranscriptFileName(fileName)) return true;
	return false;
}
function resolveSessionStoreTranscriptResolvedPath(sessionsDir, entry) {
	if (typeof entry?.sessionFile === "string" && entry.sessionFile.trim().length > 0) {
		const sessionFile = entry.sessionFile.trim();
		return path.isAbsolute(sessionFile) ? sessionFile : path.resolve(sessionsDir, sessionFile);
	}
	if (typeof entry?.sessionId === "string" && entry.sessionId.trim().length > 0) return path.join(sessionsDir, `${entry.sessionId.trim()}.jsonl`);
	return null;
}
function isCanonicalSessionsDirForAgent(sessionsDir, agentId) {
	return normalizeComparablePath(sessionsDir) === normalizeComparablePath(resolveSessionTranscriptsDirForAgent(agentId));
}
async function loadSessionTranscriptClassificationForSessionsDir(sessionsDir) {
	const agentId = extractAgentIdFromSessionsDir(sessionsDir);
	if (agentId && isCanonicalSessionsDirForAgent(sessionsDir, agentId)) return classifySessionTranscriptCorpusEntries(await listSessionTranscriptCorpusEntriesForAgent(agentId, { includeContentRevision: false }));
	const store = readSessionTranscriptClassificationStore(path.join(sessionsDir, "sessions.json"));
	const dreamingTranscriptPaths = /* @__PURE__ */ new Set();
	const cronRunTranscriptPaths = /* @__PURE__ */ new Set();
	for (const [sessionKey, entry] of Object.entries(store)) {
		const resolved = resolveSessionStoreTranscriptResolvedPath(sessionsDir, entry);
		if (!resolved) continue;
		const transcriptPath = normalizeComparablePath(resolved);
		if (isDreamingNarrativeSessionStoreKey(sessionKey)) dreamingTranscriptPaths.add(transcriptPath);
		if (isCronRunSessionKey(sessionKey)) cronRunTranscriptPaths.add(transcriptPath);
	}
	return {
		dreamingNarrativeTranscriptPaths: dreamingTranscriptPaths,
		cronRunTranscriptPaths
	};
}
function readSessionTranscriptClassificationStore(storePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(storePath, "utf-8"));
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
		return parsed;
	} catch {
		return {};
	}
}
function classifySessionTranscriptCorpusEntries(corpusEntries) {
	const dreamingTranscriptPaths = /* @__PURE__ */ new Set();
	const cronRunTranscriptPaths = /* @__PURE__ */ new Set();
	for (const entry of corpusEntries) {
		if (entry.transcriptSource === "sqlite") continue;
		const normalizedPath = normalizeComparablePath(entry.sessionFile);
		if (entry.generatedByDreamingNarrative) dreamingTranscriptPaths.add(normalizedPath);
		if (entry.generatedByCronRun) cronRunTranscriptPaths.add(normalizedPath);
	}
	return {
		dreamingNarrativeTranscriptPaths: dreamingTranscriptPaths,
		cronRunTranscriptPaths
	};
}
async function classifySessionTranscriptFromSessionStore(absPath) {
	const sessionsDir = path.dirname(absPath);
	const normalizedAbsPath = normalizeComparablePath(absPath);
	const primarySessionId = parseUsageCountedSessionIdFromFileName(path.basename(absPath));
	const normalizedPrimaryPath = primarySessionId && isSessionArchiveArtifactName(path.basename(absPath)) ? normalizeComparablePath(path.join(sessionsDir, `${primarySessionId}.jsonl`)) : null;
	const classification = await loadSessionTranscriptClassificationForSessionsDir(sessionsDir);
	const hasClassifiedPath = (paths) => paths.has(normalizedAbsPath) || normalizedPrimaryPath !== null && paths.has(normalizedPrimaryPath);
	return {
		generatedByDreamingNarrative: hasClassifiedPath(classification.dreamingNarrativeTranscriptPaths),
		generatedByCronRun: hasClassifiedPath(classification.cronRunTranscriptPaths)
	};
}
function sessionPathForFile(absPath) {
	const agentId = extractAgentIdFromSessionPath(absPath);
	return path.join("sessions", ...agentId ? [agentId] : [], path.basename(absPath)).replace(/\\/g, "/");
}
/** @deprecated Await statSessionEntry. Final compatibility day: 2026-12-31; prepared statistics do not read SQLite. */
function statSessionEntrySync(absPath, opts = {}, transcriptStats) {
	const sqliteIdentity = resolveBuildSessionSqliteIdentity(absPath, opts);
	if (sqliteIdentity) {
		if (!transcriptStats) {
			if (isMainThread) warnPluginSdkDeprecation({
				family: "session-store",
				method: "statSessionEntrySync",
				replacement: "statSessionEntry"
			});
			assertBoundIncognitoMemorySyncAccess(sqliteIdentity, "statSessionEntrySync", "statSessionEntry");
		}
		const stats = transcriptStats ?? readTranscriptStatsSync(sqliteIdentity);
		return sqliteSessionFileState(absPath, sqliteIdentity, stats, opts.updatedAtMs);
	}
	const stat = safeStatSync(absPath);
	return stat?.isFile() ? {
		absPath,
		path: sessionPathForFile(absPath),
		mtimeMs: stat.mtimeMs,
		size: stat.size
	} : null;
}
/** Read transcript metadata through its worker without loading transcript bodies. */
async function statSessionEntry(absPath, opts = {}, transcriptStats) {
	const identity = resolveBuildSessionSqliteIdentity(absPath, opts);
	if (!identity) return statSessionEntrySync(absPath, opts);
	const stats = transcriptStats ?? await readTranscriptStatsAsync(identity);
	return sqliteSessionFileState(absPath, identity, stats, opts.updatedAtMs);
}
async function buildSessionEntry(absPath, opts = {}) {
	const identity = resolveBuildSessionSqliteIdentity(absPath, opts);
	const incognito = identity && captureIncognitoMemoryReader(identity);
	if (incognito) return incognito.memoryEntry(absPath, opts);
	const prepare = async () => {
		if (identity) {
			const { onTranscriptMessage, parseYieldEveryLines, ...options } = {
				...opts,
				...identity
			};
			if (onTranscriptMessage || parseYieldEveryLines !== void 0) {
				const snapshot = await readSessionEntrySnapshotInWorker(absPath, options, Boolean(onTranscriptMessage));
				return snapshot ? buildSessionEntryFromSource(absPath, opts, snapshot) : null;
			}
			const prepared = await prepareSessionEntryInWorker(absPath, options);
			return prepared.entry ? attachSessionEntryResetRecallCutoff(prepared.entry, prepared.resetRecallCutoff) : null;
		}
		return buildSessionEntryFromSource(absPath, opts);
	};
	try {
		return await prepare();
	} catch (error) {
		if (!(error instanceof SessionTranscriptColdError) || identity?.sessionId !== error.sessionId) throw error;
		return readRestoredSessionTranscript(identity, prepare);
	}
}
/** Prepare a bounded indexing group in one background transcript-worker request. */
async function buildSessionEntries(inputs) {
	const results = inputs.map(() => null);
	const workerInputs = [];
	const workerIndexes = [];
	const otherEntries = [];
	for (const [index, input] of inputs.entries()) {
		const options = input.options ?? {};
		const identity = resolveBuildSessionSqliteIdentity(input.absPath, options);
		const incognito = identity && captureIncognitoMemoryReader(identity);
		if (identity && !incognito && !options.onTranscriptMessage && options.parseYieldEveryLines === void 0) {
			workerInputs.push({
				absPath: input.absPath,
				options: {
					...options,
					...identity
				}
			});
			workerIndexes.push(index);
		} else otherEntries.push((incognito ? incognito.memoryEntry(input.absPath, options) : buildSessionEntry(input.absPath, options)).then((entry) => {
			results[index] = entry;
		}));
	}
	const prepareWorkerEntries = async () => {
		if (workerInputs.length === 0) return;
		const prepared = await prepareSessionEntriesInWorker(workerInputs);
		const restored = [];
		for (const [offset, result] of prepared.entries()) {
			const index = workerIndexes[offset];
			if ("cold" in result) {
				const input = inputs[index];
				restored.push(buildSessionEntry(input.absPath, input.options).then((entry) => {
					results[index] = entry;
				}));
			} else results[index] = result.entry ? attachSessionEntryResetRecallCutoff(result.entry, result.resetRecallCutoff) : null;
		}
		await Promise.all(restored);
	};
	await Promise.all([...otherEntries, prepareWorkerEntries()]);
	return results;
}
/** Project an actor-owned snapshot without reopening its physical store on the caller. */
async function buildSessionEntryFromSnapshot(absPath, opts, snapshot, assertCurrent) {
	const { onTranscriptMessage, ...options } = opts;
	const result = await buildSessionEntryFromSource(absPath, {
		...structuredClone(options),
		...onTranscriptMessage ? { onTranscriptMessage(message, observedAt) {
			assertCurrent();
			onTranscriptMessage(message, observedAt);
		} } : {}
	}, snapshot);
	assertCurrent();
	return result;
}
async function buildSessionEntryFromSource(absPath, opts, preparedSnapshot) {
	const sqliteIdentity = resolveBuildSessionSqliteIdentity(absPath, opts);
	try {
		if (sqliteIdentity) {
			const snapshot = preparedSnapshot ?? readTranscriptExportSnapshotReadOnlySync(sqliteIdentity, { projectEvent: opts.onTranscriptMessage ? void 0 : projectSessionEntryRecord });
			return snapshot ? await renderSessionEntrySnapshot(absPath, {
				...opts,
				...sqliteIdentity
			}, snapshot) : null;
		}
		const regularFile = await statRegularFile(absPath);
		if (regularFile.missing) return null;
		const stat = regularFile.stat;
		if (shouldSkipTranscriptFileForDreaming(absPath)) return {
			path: sessionPathForFile(absPath),
			absPath,
			mtimeMs: stat.mtimeMs,
			size: stat.size,
			hash: hashText("\n\n"),
			content: "",
			lineMap: [],
			messageTimestampsMs: [],
			lineProvenance: [],
			sessionKind: opts.sessionKind ?? "unknown"
		};
		const raw = (await retryTransientMemoryRead(async () => readRegularFile({ filePath: isUsageCountedSessionArchiveTranscriptPath(absPath) ? await materializeSessionArchiveForRead(absPath) : absPath }), `read session transcript ${absPath}`)).buffer.toString("utf-8");
		const classification = opts.generatedByDreamingNarrative === void 0 || opts.generatedByCronRun === void 0 ? await classifySessionTranscriptFromSessionStore(absPath) : null;
		return await renderSessionEntry(absPath, opts, {
			kind: "file",
			raw,
			classification,
			absPath,
			path: sessionPathForFile(absPath),
			mtimeMs: stat.mtimeMs,
			size: stat.size
		});
	} catch (err) {
		if (sqliteIdentity) throw err;
		createSubsystemLogger("memory").debug(`Failed reading session file ${absPath}: ${String(err)}`);
		return null;
	}
}
//#endregion
export { sessionPathForFile as a, matchesSessionEntryPrefixHash as i, buildSessionEntry as n, statSessionEntry as o, buildSessionEntryFromSnapshot as r, statSessionEntrySync as s, buildSessionEntries as t };
