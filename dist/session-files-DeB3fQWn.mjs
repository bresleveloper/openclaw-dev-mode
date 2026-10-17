import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as redactSensitiveText, t as captureSensitiveTextRedactionSnapshot } from "./redact-DJ8j6ADa.mjs";
import { r as getSecretRedactionRegistryRevision } from "./secret-redaction-registry-DorVHn0l.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { C as isDreamingNarrativeSessionStoreKey, x as isCronRunSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { f as parseUsageCountedSessionIdFromFileName, r as isCompactionCheckpointTranscriptFileName, s as isSessionArchiveArtifactName, u as isUsageCountedSessionTranscriptFileName, v as materializeSessionArchiveForRead } from "./artifacts-BvSTVPj-.mjs";
import { p as resolveSessionTranscriptsDirForAgent } from "./paths-dpReqUI8.mjs";
import "./config-utils-DnfHy8-v.mjs";
import { g as stripInternalRuntimeContext } from "./internal-runtime-context-CAWYwg4i.mjs";
import { a as isSilentReplyPayloadText } from "./tokens-D4ghQG_g.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { n as HEARTBEAT_PROMPT } from "./heartbeat-BjLIgeQc.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-BWIgBUDF.mjs";
import { c as hasInterSessionUserProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-CfuaO6_K.mjs";
import { C as readTranscriptStatsSync, y as readTranscriptExportSnapshotReadOnlySync } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { i as readRegularFile, o as statRegularFile, r as normalizeComparablePath } from "./fs-utils-CK0xaytO.mjs";
import { t as hashText } from "./hash-BOTtT1fO.mjs";
import { n as retryTransientMemoryRead } from "./read-retry-Qn2FTJ6v.mjs";
import "./openclaw-runtime-io-9QewR8KI.mjs";
import { r as isHeartbeatUserMessage } from "./heartbeat-filter-CNihh_E4.mjs";
import { o as isExecCompletionEvent } from "./heartbeat-events-filter-DMpc12GN.mjs";
import { n as extractAgentIdFromSessionsDir, r as prepareSessionEntryInWorker, t as extractAgentIdFromSessionPath } from "./openclaw-runtime-session-Daq6skjB.mjs";
import { n as projectSessionEntryRecord, r as renderSessionExportLines, t as collectRawSessionText } from "./session-entry-projection-C83NYmov.mjs";
import { t as classifySessionMessageOrigin } from "./session-provenance-2cpkCo2r.mjs";
import { t as resolveSessionResetRecallCutoff } from "./session-reset-recall-ZlAM1yc3.mjs";
import { n as listSessionTranscriptCorpusEntriesForAgentSync } from "./session-transcript-corpus-CJJovP8h.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { safeStatSync } from "@openclaw/fs-safe/path";
//#region packages/memory-host-sdk/src/host/session-files.ts
const SESSION_ENTRY_PARSE_YIELD_LINES = 250;
const MAX_DATE_TIMESTAMP_MS = 864e13;
const DIRECT_CRON_PROMPT_RE = /^\[cron:[^\]]+\]\s*/;
const SESSION_RESET_RECALL_CUTOFF = Symbol.for("openclaw.memory.sessionResetRecallCutoff");
function hashSessionEntrySnapshot(params) {
	return createHash("sha256").update(params.content).update("\n").update(params.lineMap.join(",")).update("\n").update(params.messageTimestampsMs.join(",")).update("\n").update(JSON.stringify(params.lineProvenance)).update("\n").update(JSON.stringify(params.resetRecallCutoff)).digest("hex");
}
function readSessionEntryResetRecallCutoff(entry) {
	const value = Object.getOwnPropertyDescriptor(entry, SESSION_RESET_RECALL_CUTOFF)?.value;
	if (!value || typeof value !== "object" || !("state" in value)) return { state: "invalid" };
	if (value.state === "absent" || value.state === "invalid") return { state: value.state };
	if (value.state === "valid" && "cutoffLine" in value && typeof value.cutoffLine === "number") return {
		state: "valid",
		cutoffLine: value.cutoffLine
	};
	return { state: "invalid" };
}
function attachSessionEntryResetRecallCutoff(entry, cutoff) {
	Object.defineProperty(entry, SESSION_RESET_RECALL_CUTOFF, {
		configurable: false,
		enumerable: false,
		value: cutoff,
		writable: false
	});
	return entry;
}
function matchesSessionEntryPrefixHash(entry, lineCount, expectedHash) {
	const lines = entry.content ? entry.content.split("\n") : [];
	if (!Number.isInteger(lineCount) || lineCount < 0 || lineCount > lines.length) return false;
	const resetRecallCutoff = readSessionEntryResetRecallCutoff(entry);
	return hashSessionEntrySnapshot({
		content: lines.slice(0, lineCount).join("\n"),
		lineMap: entry.lineMap.slice(0, lineCount),
		messageTimestampsMs: entry.messageTimestampsMs.slice(0, lineCount),
		lineProvenance: entry.lineProvenance.slice(0, lineCount),
		resetRecallCutoff
	}) === expectedHash;
}
function shouldSkipTranscriptFileForDreaming(absPath) {
	const fileName = path.basename(absPath);
	if (isCompactionCheckpointTranscriptFileName(fileName)) return true;
	if (isSessionArchiveArtifactName(fileName) && !isUsageCountedSessionTranscriptFileName(fileName)) return true;
	return false;
}
function isUsageCountedSessionArchiveTranscriptPath(absPath) {
	const fileName = path.basename(absPath);
	return isUsageCountedSessionTranscriptFileName(fileName) && isSessionArchiveArtifactName(fileName) && parseUsageCountedSessionIdFromFileName(fileName) !== null;
}
function hasDreamingNarrativeIdentity(value) {
	return typeof value === "string" && isDreamingNarrativeSessionStoreKey(value);
}
function isDreamingNarrativeGeneratedRecord(record) {
	const candidate = asOptionalRecord(record);
	if (!candidate) return false;
	const data = asOptionalRecord(candidate.data);
	if (candidate.type === "custom" && candidate.customType === "openclaw:bootstrap-context:full" && typeof data?.runId === "string" && data.runId.startsWith("dreaming-narrative-")) return true;
	const message = candidate.type === "message" ? asOptionalRecord(candidate.message) : void 0;
	const metadata = asOptionalRecord(message?.["__openclaw"]);
	return hasDreamingNarrativeIdentity(candidate.runId) || hasDreamingNarrativeIdentity(candidate.sessionKey) || hasDreamingNarrativeIdentity(data?.runId) || hasDreamingNarrativeIdentity(data?.sessionKey) || (message?.role === "assistant" || message?.role === "toolResult") && hasDreamingNarrativeIdentity(metadata?.runId);
}
function hasCronRunSessionKey(value) {
	return typeof value === "string" && isCronRunSessionKey(value);
}
function isCronRunGeneratedRecord(record) {
	const candidate = asOptionalRecord(record);
	return hasCronRunSessionKey(candidate?.sessionKey) || hasCronRunSessionKey(asOptionalRecord(candidate?.data)?.sessionKey);
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
function loadSessionTranscriptClassificationForSessionsDir(sessionsDir) {
	const agentId = extractAgentIdFromSessionsDir(sessionsDir);
	if (agentId && isCanonicalSessionsDirForAgent(sessionsDir, agentId)) return classifySessionTranscriptCorpusEntries(listSessionTranscriptCorpusEntriesForAgentSync(agentId, { includeContentRevision: false }));
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
function classifySessionTranscriptFromSessionStore(absPath) {
	const sessionsDir = path.dirname(absPath);
	const normalizedAbsPath = normalizeComparablePath(absPath);
	const primarySessionId = parseUsageCountedSessionIdFromFileName(path.basename(absPath));
	const normalizedPrimaryPath = primarySessionId && isSessionArchiveArtifactName(path.basename(absPath)) ? normalizeComparablePath(path.join(sessionsDir, `${primarySessionId}.jsonl`)) : null;
	const classification = loadSessionTranscriptClassificationForSessionsDir(sessionsDir);
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
/** Returns the logical memory path for a live SQLite-backed session transcript. */
function sessionPathForSessionIdentity(agentId, sessionId) {
	return path.join("sessions", normalizeAgentId(agentId), `${sessionId}.jsonl`).replace(/\\/g, "/");
}
/**
* Parses a deprecated path-shaped memory sync hint only when it points at an
* OpenClaw-owned usage-counted transcript in the canonical agent sessions dir.
*/
function parseCanonicalSessionSyncTargetFromPath(sessionFile) {
	const trimmed = sessionFile.trim();
	if (!trimmed) return null;
	const resolved = path.resolve(trimmed);
	const fileName = path.basename(resolved);
	const sessionId = parseUsageCountedSessionIdFromFileName(fileName);
	if (!sessionId || !isUsageCountedSessionTranscriptFileName(fileName)) return null;
	const agentId = extractAgentIdFromSessionPath(resolved);
	if (!agentId) return null;
	const canonicalSessionsDir = normalizeComparablePath(resolveSessionTranscriptsDirForAgent(agentId));
	if (normalizeComparablePath(path.dirname(resolved)) !== canonicalSessionsDir) return null;
	return {
		agentId,
		sessionId
	};
}
function normalizeSessionText(value) {
	return value.replace(/\s+/g, " ").trim();
}
const GENERATED_SYSTEM_MESSAGE_RE = /^System(?: \(untrusted\))?: \[[^\]]+\]\s*/;
function sanitizeSessionText(text, role) {
	const strippedInbound = role === "user" ? stripInboundMetadata(text) : text;
	const normalized = normalizeSessionText(stripInternalRuntimeContext(strippedInbound));
	if (!normalized) return null;
	if (role === "user" && (GENERATED_SYSTEM_MESSAGE_RE.test(normalized) || DIRECT_CRON_PROMPT_RE.test(normalized) || isHeartbeatUserMessage({
		role,
		content: normalized
	}, HEARTBEAT_PROMPT))) return null;
	if (isSilentReplyPayloadText(normalized)) return null;
	if (role === "assistant" && normalized === "HEARTBEAT_OK") return null;
	const withoutSystemEnvelope = normalized.replace(GENERATED_SYSTEM_MESSAGE_RE, "").trim();
	if (isExecCompletionEvent(withoutSystemEnvelope)) return null;
	return normalized;
}
function isRecalledMemoryMessage(message) {
	const provenance = message.provenance;
	return provenance?.kind === "internal_system" && (provenance.sourceTool === "memory_search" || provenance.sourceTool === "memory_get");
}
function parseSessionTimestampMs(record, message) {
	const candidates = [message.timestamp, record.timestamp];
	for (const value of candidates) {
		if (typeof value === "number" && Number.isFinite(value)) {
			const ms = value > 0 && value < 1e11 ? value * 1e3 : value;
			if (Number.isFinite(ms) && ms > 0 && ms <= MAX_DATE_TIMESTAMP_MS) return Math.floor(ms);
		}
		if (typeof value === "string") {
			const parsed = Date.parse(value);
			if (Number.isFinite(parsed) && parsed > 0) return parsed;
		}
	}
	return 0;
}
function resolveSessionEntryParseYieldLines(opts) {
	const configured = opts.parseYieldEveryLines;
	if (typeof configured === "number" && Number.isFinite(configured)) return Math.max(1, Math.floor(configured));
	return SESSION_ENTRY_PARSE_YIELD_LINES;
}
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
function sqliteSessionFileState(absPath, identity, stats, updatedAtMs) {
	return {
		absPath,
		path: sessionPathForSessionIdentity(identity.agentId, identity.sessionId),
		mtimeMs: updatedAtMs ?? stats.maxSeq,
		revisionMs: stats.lastMutationAtMs ?? stats.maxSeq,
		size: stats.sizeBytes
	};
}
function statSessionEntrySync(absPath, opts = {}, transcriptStats) {
	const sqliteIdentity = resolveBuildSessionSqliteIdentity(absPath, opts);
	if (sqliteIdentity) return sqliteSessionFileState(absPath, sqliteIdentity, transcriptStats ?? readTranscriptStatsSync(sqliteIdentity), opts.updatedAtMs);
	const stat = safeStatSync(absPath);
	return stat?.isFile() ? {
		absPath,
		path: sessionPathForFile(absPath),
		mtimeMs: stat.mtimeMs,
		size: stat.size
	} : null;
}
async function yieldSessionEntryParseIfNeeded(lineIndex, everyLines) {
	if (lineIndex > 0 && lineIndex % everyLines === 0) await new Promise((resolve) => {
		setImmediate(resolve);
	});
}
async function buildSessionEntry(absPath, opts = {}) {
	const identity = resolveBuildSessionSqliteIdentity(absPath, opts);
	const prepare = async () => {
		if (identity && !opts.onTranscriptMessage && opts.parseYieldEveryLines === void 0 && !isIncognitoSessionKey(opts.sessionKey) && !isIncognitoOpenClawAgentSqlitePath(identity.storePath, { agentId: identity.agentId })) {
			const options = {
				...opts,
				...identity
			};
			for (let attempt = 0; attempt < 2; attempt++) {
				const redaction = captureSensitiveTextRedactionSnapshot();
				const prepared = await prepareSessionEntryInWorker(absPath, options, redaction);
				if (redaction.registryRevision === getSecretRedactionRegistryRevision()) return prepared.entry ? attachSessionEntryResetRecallCutoff(prepared.entry, prepared.resetRecallCutoff) : null;
			}
			throw new Error("Session transcript redaction changed during preparation; retry the operation.");
		}
		return buildSessionEntryInProcess(absPath, opts);
	};
	try {
		return await prepare();
	} catch (error) {
		if (!(error instanceof SessionTranscriptColdError) || identity?.sessionId !== error.sessionId) throw error;
		return readRestoredSessionTranscript(identity, prepare);
	}
}
/** The shared transcript worker runs the same projection with task-local redaction. */
async function buildSessionEntryInProcess(absPath, opts = {}, redactText = (text) => redactSensitiveText(text, { mode: "tools" })) {
	return buildSessionEntryFromSource(absPath, opts, redactText);
}
/** Project an actor-owned snapshot without reopening its physical store on the caller. */
async function buildSessionEntryFromSnapshot(absPath, opts, snapshot, assertCurrent) {
	assertCurrent();
	const result = await buildSessionEntryFromSource(absPath, structuredClone(opts), (text) => redactSensitiveText(text, { mode: "tools" }), snapshot);
	assertCurrent();
	return result;
}
async function buildSessionEntryFromSource(absPath, opts, redactText, preparedSnapshot) {
	const sqliteIdentity = resolveBuildSessionSqliteIdentity(absPath, opts);
	try {
		const snapshot = preparedSnapshot ?? (sqliteIdentity ? readTranscriptExportSnapshotReadOnlySync(sqliteIdentity, { projectEvent: opts.onTranscriptMessage ? void 0 : projectSessionEntryRecord }) : null);
		const sqliteSource = snapshot && sqliteIdentity ? {
			...sqliteSessionFileState(absPath, sqliteIdentity, snapshot.stats, opts.updatedAtMs),
			records: snapshot.events,
			resetRecallCutoff: resolveSessionResetRecallCutoff(snapshot.events),
			sessionKey: snapshot.sessionKey
		} : null;
		if (sqliteIdentity && !sqliteSource) return null;
		let raw = "";
		let mtimeMs;
		let size;
		let memoryPath;
		if (sqliteSource) {
			mtimeMs = sqliteSource.mtimeMs;
			size = sqliteSource.size;
			memoryPath = sqliteSource.path;
		} else {
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
			raw = (await retryTransientMemoryRead(() => readRegularFile({ filePath: isUsageCountedSessionArchiveTranscriptPath(absPath) ? materializeSessionArchiveForRead(absPath) : absPath }), `read session transcript ${absPath}`)).buffer.toString("utf-8");
			mtimeMs = stat.mtimeMs;
			size = stat.size;
			memoryPath = sessionPathForFile(absPath);
		}
		const collected = [];
		const lineMap = [];
		const messageTimestampsMs = [];
		const lineProvenance = [];
		const parseYieldEveryLines = resolveSessionEntryParseYieldLines(opts);
		const sqliteSessionKey = !opts.sessionKey ? sqliteSource?.sessionKey : void 0;
		const sessionStoreClassification = !sqliteIdentity && (opts.generatedByDreamingNarrative === void 0 || opts.generatedByCronRun === void 0) ? classifySessionTranscriptFromSessionStore(absPath) : null;
		let generatedByDreamingNarrative = opts.generatedByDreamingNarrative ?? (sqliteSessionKey ? isDreamingNarrativeSessionStoreKey(sqliteSessionKey) : void 0) ?? sessionStoreClassification?.generatedByDreamingNarrative ?? false;
		let generatedByCronRun = opts.generatedByCronRun ?? (sqliteSessionKey ? isCronRunSessionKey(sqliteSessionKey) : void 0) ?? sessionStoreClassification?.generatedByCronRun ?? false;
		const sessionKind = opts.sessionKind ?? "unknown";
		const allowArchiveRecordCronClassification = isUsageCountedSessionArchiveTranscriptPath(absPath);
		let insideHeartbeatTurn = false;
		let insideRecalledMemoryTurn = false;
		let turnOrigin = "untrusted";
		for (let jsonlIdx = 0, lineStart = 0; sqliteSource ? jsonlIdx < sqliteSource.records.length : lineStart <= raw.length; jsonlIdx++) {
			await yieldSessionEntryParseIfNeeded(jsonlIdx, parseYieldEveryLines);
			let record;
			if (sqliteSource) record = sqliteSource.records[jsonlIdx];
			else {
				const newlineIndex = raw.indexOf("\n", lineStart);
				const lineEnd = newlineIndex === -1 ? raw.length : newlineIndex;
				const line = raw.slice(lineStart, lineEnd);
				lineStart = newlineIndex === -1 ? raw.length + 1 : newlineIndex + 1;
				if (!line.trim()) continue;
				try {
					record = JSON.parse(line);
				} catch {
					continue;
				}
			}
			const identifiesDreamingNarrative = !generatedByDreamingNarrative && isDreamingNarrativeGeneratedRecord(record);
			const identifiesCronRun = !generatedByCronRun && allowArchiveRecordCronClassification && isCronRunGeneratedRecord(record);
			if (identifiesDreamingNarrative || identifiesCronRun) {
				generatedByDreamingNarrative ||= identifiesDreamingNarrative;
				generatedByCronRun ||= identifiesCronRun;
				collected.length = 0;
				lineMap.length = 0;
				messageTimestampsMs.length = 0;
				lineProvenance.length = 0;
			}
			if (!record || typeof record !== "object" || record.type !== "message") continue;
			const message = record.message;
			if (!message || typeof message.role !== "string") continue;
			if (message.role !== "user" && message.role !== "assistant") continue;
			const timestampMs = parseSessionTimestampMs(record, message);
			opts.onTranscriptMessage?.(message, Math.max(0, Math.floor(timestampMs || mtimeMs)));
			const inputProvenance = message.provenance;
			const isHeartbeatUser = message.role === "user" && inputProvenance?.kind === "internal_system" && inputProvenance.sourceTool === "heartbeat";
			if (message.role === "user") {
				insideHeartbeatTurn = isHeartbeatUser;
				insideRecalledMemoryTurn = isRecalledMemoryMessage(message);
				turnOrigin = classifySessionMessageOrigin(message, turnOrigin);
			}
			if (message.role === "user" && hasInterSessionUserProvenance(message)) continue;
			if (insideHeartbeatTurn || insideRecalledMemoryTurn || generatedByDreamingNarrative || generatedByCronRun) continue;
			const rawText = collectRawSessionText(message.content);
			if (rawText === null) continue;
			const text = sanitizeSessionText(rawText, message.role);
			if (!text) continue;
			const safe = redactText(text);
			const label = message.role === "user" ? "User" : "Assistant";
			const renderedLines = renderSessionExportLines(label, safe);
			const memoryProvenance = {
				originClass: classifySessionMessageOrigin(message, turnOrigin),
				sessionKind,
				observedAt: Math.max(0, Math.floor(timestampMs || mtimeMs))
			};
			collected.push(...renderedLines);
			lineMap.push(...renderedLines.map(() => jsonlIdx + 1));
			messageTimestampsMs.push(...renderedLines.map(() => timestampMs));
			lineProvenance.push(...renderedLines.map(() => memoryProvenance));
		}
		const content = collected.join("\n");
		return attachSessionEntryResetRecallCutoff({
			path: memoryPath,
			absPath,
			mtimeMs,
			...sqliteSource ? { revisionMs: sqliteSource.revisionMs } : {},
			size,
			hash: hashSessionEntrySnapshot({
				content,
				lineMap,
				messageTimestampsMs,
				lineProvenance,
				resetRecallCutoff: sqliteSource?.resetRecallCutoff ?? { state: "absent" }
			}),
			content,
			lineMap,
			messageTimestampsMs,
			lineProvenance,
			sessionKind,
			...generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {},
			...generatedByCronRun ? { generatedByCronRun: true } : {}
		}, sqliteSource?.resetRecallCutoff ?? { state: "absent" });
	} catch (err) {
		if (sqliteIdentity) throw err;
		createSubsystemLogger("memory").debug(`Failed reading session file ${absPath}: ${String(err)}`);
		return null;
	}
}
//#endregion
export { parseCanonicalSessionSyncTargetFromPath as a, sessionPathForSessionIdentity as c, matchesSessionEntryPrefixHash as i, statSessionEntrySync as l, buildSessionEntryFromSnapshot as n, readSessionEntryResetRecallCutoff as o, buildSessionEntryInProcess as r, sessionPathForFile as s, buildSessionEntry as t };
