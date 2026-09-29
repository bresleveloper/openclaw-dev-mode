import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { b as isCronRunSessionKey } from "./session-key-CBvmC8zz.mjs";
import { _ as redactSensitiveText, t as captureSensitiveTextRedactionSnapshot } from "./redact-B5EGyLvV.mjs";
import { r as getSecretRedactionRegistryRevision } from "./secret-redaction-registry-CKxLTepq.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { p as stripInternalRuntimeContext } from "./internal-runtime-context-BH-o1oq1.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-Cqak81y4.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-BTKQYTUd.mjs";
import "./legacy-2ovrASa7.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { f as parseUsageCountedSessionIdFromFileName, r as isCompactionCheckpointTranscriptFileName, s as isSessionArchiveArtifactName, u as isUsageCountedSessionTranscriptFileName, v as materializeSessionArchiveForRead } from "./artifacts-C9weQ_MG.mjs";
import { f as resolveSessionTranscriptsDirForAgent } from "./paths-CcMbq5NY.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { n as HEARTBEAT_PROMPT } from "./heartbeat-vWflpIwS.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { E as readTranscriptStatsSync, x as readTranscriptExportSnapshotReadOnlySync } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-BK-Qc6S7.mjs";
import { a as readRegularFile, n as isFileMissingError, s as statRegularFile } from "./fs-utils-BVDi6fm8.mjs";
import { t as hashText } from "./hash-Di28TYtu.mjs";
import { n as retryTransientMemoryRead } from "./read-retry-B-bw--uT.mjs";
import { k as listSessionTranscriptArchivesReadOnly, o as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-CwzWysXO.mjs";
import { c as hasInterSessionUserProvenance } from "./input-provenance-C4tQegGN.mjs";
import { r as isHeartbeatUserMessage } from "./heartbeat-filter-DxPIMf2l.mjs";
import { h as resolveStorePath } from "./session-store-runtime-DhcFNaWV.mjs";
import { a as isExecCompletionEvent } from "./heartbeat-events-filter-C-cThfm2.mjs";
import { t as classifySessionMessageOrigin } from "./session-provenance-B08Yj9Ll.mjs";
import { a as prepareSessionEntryInWorker, i as isDreamingNarrativeSessionStoreKey, n as extractAgentIdFromSessionPath, o as readTranscriptContentRevisionSync, r as extractAgentIdFromSessionsDir } from "./openclaw-runtime-session-GPvdaN8D.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region packages/memory-host-sdk/src/host/session-reset-recall.ts
function eventId(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const id = event.id;
	return typeof id === "string" && id.trim() ? id : void 0;
}
/** Resolves the first raw transcript line owned by the current reset generation. */
function resolveSessionResetRecallCutoff(events) {
	const resetIndex = events.findLastIndex((event) => event !== null && typeof event === "object" && !Array.isArray(event) && event.type === "reset");
	if (resetIndex < 0) return { state: "absent" };
	const reset = events[resetIndex];
	if (reset.firstKeptEntryId === void 0) return {
		state: "valid",
		cutoffLine: resetIndex + 1
	};
	if (typeof reset.firstKeptEntryId !== "string" || !reset.firstKeptEntryId.trim()) return { state: "invalid" };
	const keptIndex = events.findIndex((event, index) => index < resetIndex && eventId(event) === reset.firstKeptEntryId);
	return keptIndex < 0 ? { state: "invalid" } : {
		state: "valid",
		cutoffLine: keptIndex + 1
	};
}
//#endregion
//#region packages/memory-host-sdk/src/host/session-transcript-corpus.ts
function fileContentRevision(filePath) {
	try {
		return fileContentRevisionFromStat(fs.statSync(filePath, { bigint: true }));
	} catch {
		return;
	}
}
function fileContentRevisionFromStat(stat) {
	return stat.isFile() ? `file:${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}` : void 0;
}
function sqliteContentRevision(params) {
	try {
		return readTranscriptContentRevisionSync(params);
	} catch {
		return;
	}
}
function isDreamingNarrativeSessionKeyLike(value) {
	return typeof value === "string" && isDreamingNarrativeSessionStoreKey(value);
}
function normalizeComparablePath$1(pathname) {
	const resolved = path.resolve(pathname);
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function normalizeRealComparablePath(pathname) {
	try {
		return normalizeComparablePath$1(fs.realpathSync(pathname));
	} catch {
		try {
			return normalizeComparablePath$1(path.join(fs.realpathSync(path.dirname(pathname)), path.basename(pathname)));
		} catch {
			return normalizeComparablePath$1(pathname);
		}
	}
}
async function normalizeRealComparablePathAsync(pathname) {
	try {
		return normalizeComparablePath$1(await fs$1.realpath(pathname));
	} catch {
		try {
			return normalizeComparablePath$1(path.join(await fs$1.realpath(path.dirname(pathname)), path.basename(pathname)));
		} catch {
			return normalizeComparablePath$1(pathname);
		}
	}
}
function classifySessionEntry(sessionKey, entry, cronGeneratedSessionKeys) {
	const generatedByDreamingNarrative = isDreamingNarrativeSessionStoreKey(sessionKey) || isDreamingNarrativeSessionKeyLike(entry.spawnedBy);
	const generatedByCronRun = cronGeneratedSessionKeys.has(sessionKey);
	return {
		generatedByDreamingNarrative,
		generatedByCronRun,
		sessionKind: generatedByCronRun ? "cron" : typeof entry.heartbeatIsolatedBaseSessionKey === "string" && entry.heartbeatIsolatedBaseSessionKey.trim() ? "heartbeat" : generatedByDreamingNarrative || Boolean(entry.spawnedBy) ? "subagent" : sessionKey.includes(":subagent:") ? "subagent" : "interactive"
	};
}
function readParentSessionKeys(entry) {
	const keys = /* @__PURE__ */ new Set();
	for (const value of [entry?.parentSessionKey, entry?.spawnedBy]) {
		if (typeof value !== "string") continue;
		const trimmed = value.trim();
		if (trimmed) keys.add(trimmed);
	}
	return [...keys];
}
function collectCronGeneratedSessionKeys(summaries) {
	const entriesByKey = new Map(summaries.map((summary) => [summary.sessionKey, summary.entry]));
	const cronGeneratedKeys = /* @__PURE__ */ new Set();
	const cache = /* @__PURE__ */ new Map();
	const resolving = /* @__PURE__ */ new Set();
	const isCronGenerated = (sessionKey, entry) => {
		if (isCronRunSessionKey(sessionKey)) {
			cache.set(sessionKey, true);
			cronGeneratedKeys.add(sessionKey);
			return true;
		}
		const cached = cache.get(sessionKey);
		if (cached !== void 0) return cached;
		if (resolving.has(sessionKey)) return false;
		resolving.add(sessionKey);
		const generated = readParentSessionKeys(entry).some((parentKey) => isCronRunSessionKey(parentKey) || isCronGenerated(parentKey, entriesByKey.get(parentKey)));
		resolving.delete(sessionKey);
		cache.set(sessionKey, generated);
		if (generated) cronGeneratedKeys.add(sessionKey);
		return generated;
	};
	for (const summary of summaries) isCronGenerated(summary.sessionKey, summary.entry);
	return cronGeneratedKeys;
}
function toSessionStoreCorpusEntry(agentId, storePath, summary, cronGeneratedSessionKeys, includeContentRevision, env) {
	const sessionId = summary.entry.sessionId?.trim();
	if (!sessionId) return null;
	const sessionKey = summary.sessionKey.trim();
	const classification = classifySessionEntry(summary.sessionKey, summary.entry, cronGeneratedSessionKeys);
	const contentRevision = includeContentRevision ? sqliteContentRevision({
		agentId,
		env,
		sessionId,
		...sessionKey ? { sessionKey } : {},
		storePath
	}) : void 0;
	return {
		agentId,
		artifactKind: "active-session",
		sessionFile: sessionKey,
		sessionId,
		...contentRevision ? { contentRevision } : {},
		transcriptSource: "sqlite",
		storePath,
		...Number.isFinite(summary.entry.updatedAt) ? { updatedAtMs: summary.entry.updatedAt } : {},
		...sessionKey ? { sessionKey } : {},
		...classification.generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {},
		...classification.generatedByCronRun ? { generatedByCronRun: true } : {},
		sessionKind: classification.sessionKind
	};
}
function toRetainedSessionCorpusEntry(agentId, instance, sessionKey, storePath, cronGeneratedSessionKeys, includeContentRevision, env) {
	if (!instance.provenanceKnown || instance.acpOwned || instance.entry.pluginOwnerId || instance.entry.hookExternalContentSource) return null;
	const classification = classifySessionEntry(sessionKey, instance.entry, cronGeneratedSessionKeys);
	const contentRevision = includeContentRevision ? sqliteContentRevision({
		agentId,
		env,
		sessionId: instance.sessionId,
		...sessionKey ? { sessionKey } : {},
		storePath
	}) : void 0;
	return {
		agentId,
		artifactKind: "retained-session",
		sessionFile: sessionKey,
		sessionId: instance.sessionId,
		...contentRevision ? { contentRevision } : {},
		storePath,
		transcriptSource: "sqlite",
		updatedAtMs: instance.updatedAtMs,
		...sessionKey ? { sessionKey } : {},
		...classification.generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {},
		...classification.generatedByCronRun ? { generatedByCronRun: true } : {},
		sessionKind: classification.sessionKind
	};
}
function listSessionTranscriptArtifactFiles(sessionsDir) {
	try {
		return sessionTranscriptArtifactPaths(sessionsDir, fs.readdirSync(sessionsDir, { withFileTypes: true }));
	} catch (err) {
		if (isFileMissingError(err) && err.code === "ENOENT") return [];
		throw err;
	}
}
function sessionTranscriptArtifactPaths(sessionsDir, entries) {
	return entries.filter((entry) => entry.isFile()).map((entry) => entry.name).filter((name) => isUsageCountedSessionTranscriptFileName(name)).filter((name) => isSessionArchiveArtifactName(name)).map((name) => path.join(sessionsDir, name));
}
function toArtifactCorpusEntry(agentId, artifactPath, sessionId, primaryEntry, contentRevision) {
	return {
		agentId,
		artifactKind: "archive-artifact",
		sessionFile: artifactPath,
		sessionId,
		...contentRevision ? { contentRevision } : {},
		...primaryEntry?.generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {},
		...primaryEntry?.generatedByCronRun ? { generatedByCronRun: true } : {},
		sessionKind: primaryEntry?.sessionKind ?? "unknown"
	};
}
function resolveSessionTranscriptCorpusScope(agentId) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const cfg = getRuntimeConfig();
	const env = cloneEnvWithPlatformSemantics(process.env);
	const configuredStore = cfg.session?.store;
	const storePath = resolveStorePath(configuredStore, {
		agentId: normalizedAgentId,
		env
	});
	const sessionsDir = path.dirname(storePath);
	const fixedStoreOwnerAgentId = extractAgentIdFromSessionsDir(sessionsDir);
	const isAgentOwnedFixedStore = fixedStoreOwnerAgentId !== null && normalizeAgentId(fixedStoreOwnerAgentId) === normalizedAgentId;
	return {
		cfg,
		env,
		normalizedAgentId,
		storePath,
		isSharedFixedStore: typeof configuredStore === "string" && configuredStore.trim().length > 0 && !configuredStore.includes("{agentId}") && !isAgentOwnedFixedStore,
		artifactDirs: [sessionsDir, resolveSessionTranscriptsDirForAgent(normalizedAgentId, env)]
	};
}
function projectSessionTranscriptCorpusEntries(scope, options, artifacts) {
	const { cfg, env, normalizedAgentId, storePath, isSharedFixedStore } = scope;
	const includeContentRevision = options.includeContentRevision !== false;
	const activeEntriesBySessionId = /* @__PURE__ */ new Map();
	const entryOwnersBySessionId = /* @__PURE__ */ new Map();
	const sessionEntries = (options.readOnly === true ? listSessionEntriesReadOnly : listSessionEntriesCore)({
		agentId: normalizedAgentId,
		env,
		hydrateSkillPromptRefs: false,
		projection: "list",
		storePath
	});
	const retainedInstances = options.includeRetainedSqlite ? listSessionTranscriptInstances({
		agentId: normalizedAgentId,
		env,
		hydrateSkillPromptRefs: false,
		projection: "list",
		readConsistency: "latest",
		storePath
	}) : [];
	const archivedIdentitiesByName = new Map(listSessionTranscriptArchivesReadOnly({
		agentId: normalizedAgentId,
		env,
		archiveNames: artifacts.map((artifact) => path.basename(artifact.path)),
		storePath
	}).map((archive) => [archive.archiveName, archive]));
	const cronGeneratedSessionKeys = collectCronGeneratedSessionKeys([...retainedInstances.map(({ entry, sessionKey }) => ({
		entry,
		sessionKey
	})), ...sessionEntries]);
	for (const summary of sessionEntries) {
		const sessionKey = isSharedFixedStore ? summary.sessionKey : canonicalizeMainSessionAlias({
			cfg,
			agentId: normalizedAgentId,
			sessionKey: summary.sessionKey
		});
		const ownerAgentId = resolveSessionAgentId({
			config: cfg,
			sessionKey,
			...isSharedFixedStore ? {} : { fallbackAgentId: normalizedAgentId }
		});
		const entry = toSessionStoreCorpusEntry(ownerAgentId, storePath, summary, cronGeneratedSessionKeys, includeContentRevision, env);
		if (!entry) continue;
		entryOwnersBySessionId.set(entry.sessionId, ownerAgentId);
		if (ownerAgentId === normalizedAgentId) activeEntriesBySessionId.set(entry.sessionId, entry);
	}
	const includeUnownedArtifacts = !isSharedFixedStore;
	const corpusEntries = [...activeEntriesBySessionId.values()];
	if (options.includeRetainedSqlite) for (const instance of retainedInstances) {
		if (activeEntriesBySessionId.has(instance.sessionId)) continue;
		const sessionKey = isSharedFixedStore ? instance.sessionKey : canonicalizeMainSessionAlias({
			cfg,
			agentId: normalizedAgentId,
			sessionKey: instance.sessionKey
		});
		const ownerAgentId = resolveSessionAgentId({
			config: cfg,
			sessionKey,
			...isSharedFixedStore ? {} : { fallbackAgentId: normalizedAgentId }
		});
		if (ownerAgentId !== normalizedAgentId) continue;
		const entry = toRetainedSessionCorpusEntry(ownerAgentId, instance, sessionKey, storePath, cronGeneratedSessionKeys, includeContentRevision, env);
		if (entry?.transcriptSource === "sqlite") corpusEntries.push(entry);
	}
	for (const { path: artifactPath, contentRevision } of artifacts) {
		const artifactName = path.basename(artifactPath);
		const archivedIdentity = archivedIdentitiesByName.get(artifactName);
		const primarySessionId = archivedIdentity?.sessionId ?? parseUsageCountedSessionIdFromFileName(artifactName);
		if (!primarySessionId) continue;
		const primaryEntry = activeEntriesBySessionId.get(primarySessionId);
		const primaryOwner = entryOwnersBySessionId.get(primarySessionId);
		if (primaryOwner && primaryOwner !== normalizedAgentId) continue;
		if (!primaryOwner && !archivedIdentity && !includeUnownedArtifacts) continue;
		corpusEntries.push({
			...toArtifactCorpusEntry(normalizedAgentId, artifactPath, primarySessionId, primaryEntry, contentRevision),
			...archivedIdentity?.sessionKey ? { sessionKey: archivedIdentity.sessionKey } : {},
			...archivedIdentity ? { storePath } : {}
		});
	}
	return corpusEntries;
}
function listSessionTranscriptCorpusEntriesForAgentSync(agentId, options = {}) {
	const scope = resolveSessionTranscriptCorpusScope(agentId);
	const artifactDirs = /* @__PURE__ */ new Map();
	for (const dir of scope.artifactDirs) artifactDirs.set(normalizeRealComparablePath(dir), dir);
	const artifacts = [];
	const seen = /* @__PURE__ */ new Set();
	for (const dir of artifactDirs.values()) for (const artifactPath of listSessionTranscriptArtifactFiles(dir)) {
		const comparablePath = normalizeRealComparablePath(artifactPath);
		if (!seen.has(comparablePath)) {
			seen.add(comparablePath);
			artifacts.push({
				path: artifactPath,
				contentRevision: options.includeContentRevision !== false ? fileContentRevision(artifactPath) : void 0
			});
		}
	}
	return projectSessionTranscriptCorpusEntries(scope, options, artifacts);
}
/**
* Lists transcript corpus entries for memory indexing.
*
* Active sessions come from the session accessor seam; retained reset/delete
* transcript artifacts remain explicit file artifacts until core owns archive
* artifact enumeration.
*/
async function listSessionTranscriptCorpusEntriesForAgent(agentId, options = {}) {
	const scope = resolveSessionTranscriptCorpusScope(agentId);
	const capturedOptions = { ...options };
	const artifactDirs = /* @__PURE__ */ new Map();
	for (const dir of scope.artifactDirs) artifactDirs.set(await normalizeRealComparablePathAsync(dir), dir);
	const artifacts = [];
	const seen = /* @__PURE__ */ new Set();
	for (const dir of artifactDirs.values()) {
		let entries;
		try {
			entries = await fs$1.readdir(dir, { withFileTypes: true });
		} catch (error) {
			if (isFileMissingError(error) && error.code === "ENOENT") continue;
			throw error;
		}
		for (const artifactPath of sessionTranscriptArtifactPaths(dir, entries)) {
			const comparablePath = await normalizeRealComparablePathAsync(artifactPath);
			if (seen.has(comparablePath)) continue;
			seen.add(comparablePath);
			let contentRevision;
			if (capturedOptions.includeContentRevision !== false) try {
				contentRevision = fileContentRevisionFromStat(await fs$1.stat(artifactPath, { bigint: true }));
			} catch {
				contentRevision = void 0;
			}
			artifacts.push({
				path: artifactPath,
				contentRevision
			});
		}
	}
	return projectSessionTranscriptCorpusEntries(scope, capturedOptions, artifacts);
}
//#endregion
//#region packages/memory-host-sdk/src/host/session-files.ts
const SESSION_EXPORT_CONTENT_WRAP_CHARS = 800;
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
function normalizeComparablePath(pathname) {
	const resolved = path.resolve(pathname);
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function resolveSessionStoreTranscriptPath(sessionsDir, entry) {
	const resolved = resolveSessionStoreTranscriptResolvedPath(sessionsDir, entry);
	return resolved ? normalizeComparablePath(resolved) : null;
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
		const transcriptPath = resolveSessionStoreTranscriptPath(sessionsDir, entry);
		if (!transcriptPath) continue;
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
	return value.replace(/\s*\n+\s*/g, " ").replace(/\s+/g, " ").trim();
}
function collectRawSessionText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return null;
	const parts = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		if (record.type === "text" && typeof record.text === "string") parts.push(record.text);
	}
	return parts.length > 0 ? parts.join("\n") : null;
}
function isHighSurrogate(code) {
	return code >= 55296 && code <= 56319;
}
function isLowSurrogate(code) {
	return code >= 56320 && code <= 57343;
}
function splitLongSessionLine(text, maxChars = SESSION_EXPORT_CONTENT_WRAP_CHARS) {
	const normalized = text.trim();
	if (!normalized) return [];
	if (normalized.length <= maxChars) return [normalized];
	const segments = [];
	let cursor = 0;
	while (cursor < normalized.length) {
		if (normalized.length - cursor <= maxChars) {
			segments.push(normalized.slice(cursor).trim());
			break;
		}
		const limit = cursor + maxChars;
		let splitAt = limit;
		for (let index = limit; index > cursor; index -= 1) if (normalized[index] === " ") {
			splitAt = index;
			break;
		}
		if (splitAt < normalized.length && splitAt > cursor && isHighSurrogate(normalized.charCodeAt(splitAt - 1)) && isLowSurrogate(normalized.charCodeAt(splitAt))) splitAt -= 1;
		segments.push(normalized.slice(cursor, splitAt).trim());
		cursor = splitAt;
		while (cursor < normalized.length && normalized[cursor] === " ") cursor += 1;
	}
	return segments.filter(Boolean);
}
function renderSessionExportLines(label, text) {
	return splitLongSessionLine(text).map((segment) => `${label}: ${segment}`);
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
	try {
		const stat = fs.statSync(absPath);
		return stat.isFile() ? {
			absPath,
			path: sessionPathForFile(absPath),
			mtimeMs: stat.mtimeMs,
			size: stat.size
		} : null;
	} catch {
		return null;
	}
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
	const sqliteIdentity = resolveBuildSessionSqliteIdentity(absPath, opts);
	try {
		const snapshot = sqliteIdentity ? readTranscriptExportSnapshotReadOnlySync(sqliteIdentity) : null;
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
			const renderedLines = renderSessionExportLines(message.role === "user" ? "User" : "Assistant", safe);
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
export { readSessionEntryResetRecallCutoff as a, statSessionEntrySync as c, parseCanonicalSessionSyncTargetFromPath as i, listSessionTranscriptCorpusEntriesForAgent as l, buildSessionEntryInProcess as n, sessionPathForFile as o, matchesSessionEntryPrefixHash as r, sessionPathForSessionIdentity as s, buildSessionEntry as t };
