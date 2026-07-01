import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { N as timestampMsToIsoFileStamp } from "./number-coercion-CJQ8TR--.js";
import { o as resolveRequiredHomeDir, t as expandHomePrefix } from "./home-dir-BjcCg_IW.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { t as DEFAULT_AGENT_ID, u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/config/sessions/artifacts.ts
const ARCHIVE_TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}(?:\.\d{3})?Z$/;
const LEGACY_STORE_BACKUP_RE = /^sessions\.json\.bak\.\d+$/;
const COMPACTION_CHECKPOINT_TRANSCRIPT_RE = /^(.+)\.checkpoint\.([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.jsonl$/i;
function hasArchiveSuffix(fileName, reason) {
	const marker = `.${reason}.`;
	const index = fileName.lastIndexOf(marker);
	if (index < 0) return false;
	const raw = fileName.slice(index + marker.length);
	return ARCHIVE_TIMESTAMP_RE.test(raw);
}
/** Returns true for archived session artifacts and legacy store backup names. */
function isSessionArchiveArtifactName(fileName) {
	if (LEGACY_STORE_BACKUP_RE.test(fileName)) return true;
	return hasArchiveSuffix(fileName, "deleted") || hasArchiveSuffix(fileName, "reset") || hasArchiveSuffix(fileName, "bak");
}
const SESSION_STORE_TEMP_RE_CACHE = /* @__PURE__ */ new Map();
function sessionStoreTempPattern(storeBasename) {
	let pattern = SESSION_STORE_TEMP_RE_CACHE.get(storeBasename);
	if (!pattern) {
		pattern = new RegExp(`^${escapeRegExp(storeBasename)}\\.(?:\\d+\\.)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.tmp$`, "i");
		SESSION_STORE_TEMP_RE_CACHE.set(storeBasename, pattern);
	}
	return pattern;
}
function isSessionStoreTempArtifactName(fileName, storeBasename) {
	if (!storeBasename) return false;
	return sessionStoreTempPattern(storeBasename).test(fileName);
}
/** Parses a compaction checkpoint transcript filename into session/checkpoint ids. */
function parseCompactionCheckpointTranscriptFileName(fileName) {
	const match = COMPACTION_CHECKPOINT_TRANSCRIPT_RE.exec(fileName);
	const sessionId = match?.[1];
	const checkpointId = match?.[2];
	return sessionId && checkpointId ? {
		sessionId,
		checkpointId
	} : null;
}
/** Returns true when a filename is a compaction checkpoint transcript. */
function isCompactionCheckpointTranscriptFileName(fileName) {
	return parseCompactionCheckpointTranscriptFileName(fileName) !== null;
}
/** Returns true for trajectory runtime jsonl artifacts. */
function isTrajectoryRuntimeArtifactName(fileName) {
	return fileName.endsWith(".trajectory.jsonl");
}
/** Returns true for trajectory pointer artifacts. */
function isTrajectoryPointerArtifactName(fileName) {
	return fileName.endsWith(".trajectory-path.json");
}
/** Returns true for any trajectory-related session artifact. */
function isTrajectorySessionArtifactName(fileName) {
	return isTrajectoryRuntimeArtifactName(fileName) || isTrajectoryPointerArtifactName(fileName);
}
/** Returns true for primary session transcript files that represent live session history. */
function isPrimarySessionTranscriptFileName(fileName) {
	if (fileName === "sessions.json") return false;
	if (!fileName.endsWith(".jsonl")) return false;
	if (isTrajectoryRuntimeArtifactName(fileName)) return false;
	if (isCompactionCheckpointTranscriptFileName(fileName)) return false;
	return !isSessionArchiveArtifactName(fileName);
}
/** Returns true for transcript files counted in usage, including reset/deleted archives. */
function isUsageCountedSessionTranscriptFileName(fileName) {
	if (isPrimarySessionTranscriptFileName(fileName)) return true;
	return hasArchiveSuffix(fileName, "reset") || hasArchiveSuffix(fileName, "deleted");
}
/** Extracts the session id from a usage-counted transcript filename. */
function parseUsageCountedSessionIdFromFileName(fileName) {
	if (isPrimarySessionTranscriptFileName(fileName)) return fileName.slice(0, -6);
	for (const reason of ["reset", "deleted"]) {
		const marker = `.jsonl.${reason}.`;
		const index = fileName.lastIndexOf(marker);
		if (index > 0 && hasArchiveSuffix(fileName, reason)) return fileName.slice(0, index);
	}
	return null;
}
/** Formats an archive timestamp that is safe for filenames. */
function formatSessionArchiveTimestamp(nowMs = Date.now()) {
	return timestampMsToIsoFileStamp(nowMs);
}
function restoreSessionArchiveTimestamp(raw) {
	const [datePart, timePart] = raw.split("T");
	if (!datePart || !timePart) return raw;
	return `${datePart}T${timePart.replace(/-/g, ":")}`;
}
function parseSessionArchiveTimestamp(fileName, reason) {
	const marker = `.${reason}.`;
	const index = fileName.lastIndexOf(marker);
	if (index < 0) return null;
	const raw = fileName.slice(index + marker.length);
	if (!raw) return null;
	if (!ARCHIVE_TIMESTAMP_RE.test(raw)) return null;
	const timestamp = Date.parse(restoreSessionArchiveTimestamp(raw));
	return Number.isNaN(timestamp) ? null : timestamp;
}
//#endregion
//#region src/config/sessions/paths.ts
function resolveAgentSessionsDir(agentId, env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	const root = resolveStateDir(env, homedir);
	const id = normalizeAgentId(agentId ?? "main");
	return path.join(root, "agents", id, "sessions");
}
function resolveSessionTranscriptsDir(env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	return resolveAgentSessionsDir(DEFAULT_AGENT_ID, env, homedir);
}
function resolveSessionTranscriptsDirForAgent(agentId, env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	return resolveAgentSessionsDir(agentId, env, homedir);
}
function resolveDefaultSessionStorePath(agentId) {
	return path.join(resolveAgentSessionsDir(agentId), "sessions.json");
}
const MULTI_STORE_PATH_SENTINEL = "(multiple)";
function resolveSessionFilePathOptions(params) {
	const agentId = params.agentId?.trim();
	const storePath = params.storePath?.trim();
	if (storePath && storePath !== MULTI_STORE_PATH_SENTINEL) {
		const sessionsDir = path.dirname(path.resolve(storePath));
		return agentId ? {
			sessionsDir,
			agentId
		} : { sessionsDir };
	}
	if (agentId) return { agentId };
}
const SAFE_SESSION_ID_RE = /^[a-z0-9][a-z0-9._-]{0,127}$/i;
function validateSessionId(sessionId) {
	const trimmed = sessionId.trim();
	if (!SAFE_SESSION_ID_RE.test(trimmed) || isCompactionCheckpointTranscriptFileName(`${trimmed}.jsonl`)) throw new Error(`Invalid session ID: ${sessionId}`);
	return trimmed;
}
function resolveSessionsDir(opts) {
	const sessionsDir = opts?.sessionsDir?.trim();
	if (sessionsDir) return path.resolve(sessionsDir);
	return resolveAgentSessionsDir(opts?.agentId);
}
function resolvePathFromAgentSessionsDir(agentSessionsDir, candidateAbsPath) {
	const agentBase = safeRealpathSync(path.resolve(agentSessionsDir)) ?? path.resolve(agentSessionsDir);
	const realCandidate = safeRealpathSync(candidateAbsPath) ?? candidateAbsPath;
	const relative = path.relative(agentBase, realCandidate);
	if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return;
	return path.resolve(agentBase, relative);
}
function resolveSiblingAgentSessionsDir(baseSessionsDir, agentId) {
	const resolvedBase = path.resolve(baseSessionsDir);
	if (path.basename(resolvedBase) !== "sessions") return;
	const baseAgentDir = path.dirname(resolvedBase);
	const baseAgentsDir = path.dirname(baseAgentDir);
	if (path.basename(baseAgentsDir) !== "agents") return;
	const rootDir = path.dirname(baseAgentsDir);
	return path.join(rootDir, "agents", normalizeAgentId(agentId), "sessions");
}
function resolveAgentSessionsPathParts(candidateAbsPath) {
	const parts = path.normalize(path.resolve(candidateAbsPath)).split(path.sep).filter(Boolean);
	const sessionsIndex = parts.lastIndexOf("sessions");
	if (sessionsIndex < 2 || parts[sessionsIndex - 2] !== "agents") return null;
	return {
		parts,
		sessionsIndex
	};
}
function extractAgentIdFromAbsoluteSessionPath(candidateAbsPath) {
	const parsed = resolveAgentSessionsPathParts(candidateAbsPath);
	if (!parsed) return;
	const { parts, sessionsIndex } = parsed;
	return parts[sessionsIndex - 1] || void 0;
}
function resolveStructuralSessionFallbackPath(candidateAbsPath, expectedAgentId) {
	const parsed = resolveAgentSessionsPathParts(candidateAbsPath);
	if (!parsed) return;
	const { parts, sessionsIndex } = parsed;
	const agentIdPart = parts[sessionsIndex - 1];
	if (!agentIdPart) return;
	const normalizedAgentId = normalizeAgentId(agentIdPart);
	if (normalizedAgentId !== normalizeLowercaseStringOrEmpty(agentIdPart)) return;
	if (normalizedAgentId !== normalizeAgentId(expectedAgentId)) return;
	const relativeSegments = parts.slice(sessionsIndex + 1);
	if (relativeSegments.length !== 1) return;
	const fileName = relativeSegments[0];
	if (!fileName || fileName === "." || fileName === "..") return;
	return path.normalize(path.resolve(candidateAbsPath));
}
function safeRealpathSync(filePath) {
	try {
		return fs.realpathSync(filePath);
	} catch {
		return;
	}
}
function resolvePathWithinSessionsDir(sessionsDir, candidate, opts) {
	const trimmed = candidate.trim();
	if (!trimmed) throw new Error("Session file path must not be empty");
	const resolvedBase = path.resolve(sessionsDir);
	const realBase = safeRealpathSync(resolvedBase) ?? resolvedBase;
	const realTrimmed = path.isAbsolute(trimmed) ? safeRealpathSync(trimmed) ?? trimmed : trimmed;
	const normalized = path.isAbsolute(realTrimmed) ? path.relative(realBase, realTrimmed) : realTrimmed;
	if (normalized.startsWith("..") && path.isAbsolute(realTrimmed)) {
		const tryAgentFallback = (agentId) => {
			const normalizedAgentId = normalizeAgentId(agentId);
			const siblingSessionsDir = resolveSiblingAgentSessionsDir(realBase, normalizedAgentId);
			if (siblingSessionsDir) {
				const siblingResolved = resolvePathFromAgentSessionsDir(siblingSessionsDir, realTrimmed);
				if (siblingResolved) return siblingResolved;
			}
			return resolvePathFromAgentSessionsDir(resolveAgentSessionsDir(normalizedAgentId), realTrimmed);
		};
		const explicitAgentId = opts?.agentId?.trim();
		if (explicitAgentId) {
			const resolvedFromAgent = tryAgentFallback(explicitAgentId);
			if (resolvedFromAgent) return resolvedFromAgent;
		}
		const extractedAgentId = extractAgentIdFromAbsoluteSessionPath(realTrimmed);
		if (extractedAgentId) {
			const resolvedFromPath = tryAgentFallback(extractedAgentId);
			if (resolvedFromPath) return resolvedFromPath;
			const structuralFallback = resolveStructuralSessionFallbackPath(realTrimmed, extractedAgentId);
			if (structuralFallback) return structuralFallback;
		}
	}
	if (!normalized || normalized.startsWith("..") || path.isAbsolute(normalized)) throw new Error("Session file path must be within sessions directory");
	return path.resolve(realBase, normalized);
}
function resolveSessionTranscriptPathInDir(sessionId, sessionsDir, topicId) {
	const safeSessionId = validateSessionId(sessionId);
	const safeTopicId = typeof topicId === "string" ? encodeURIComponent(topicId) : typeof topicId === "number" ? String(topicId) : void 0;
	return resolvePathWithinSessionsDir(sessionsDir, safeTopicId !== void 0 ? `${safeSessionId}-topic-${safeTopicId}.jsonl` : `${safeSessionId}.jsonl`);
}
function resolveSessionTranscriptPath(sessionId, agentId, topicId) {
	return resolveSessionTranscriptPathInDir(sessionId, resolveAgentSessionsDir(agentId), topicId);
}
function resolveExplicitSessionFilePath(sessionFile, opts) {
	return resolvePathWithinSessionsDir(resolveSessionsDir(opts), sessionFile, { agentId: opts?.agentId });
}
function resolveSessionFilePath(sessionId, entry, opts) {
	const sessionsDir = resolveSessionsDir(opts);
	const candidate = entry?.sessionFile?.trim();
	if (candidate) try {
		return resolvePathWithinSessionsDir(sessionsDir, candidate, { agentId: opts?.agentId });
	} catch {}
	return resolveSessionTranscriptPathInDir(sessionId, sessionsDir);
}
function resolveStorePath(store, opts) {
	const agentId = normalizeAgentId(opts?.agentId ?? "main");
	const env = opts?.env ?? process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	if (!store) return path.join(resolveAgentSessionsDir(agentId, env, homedir), "sessions.json");
	if (store.includes("{agentId}")) {
		const expanded = store.replaceAll("{agentId}", agentId);
		if (expanded.startsWith("~")) return path.resolve(expandHomePrefix(expanded, {
			home: resolveRequiredHomeDir(env, homedir),
			env,
			homedir
		}));
		return path.resolve(expanded);
	}
	if (store.startsWith("~")) return path.resolve(expandHomePrefix(store, {
		home: resolveRequiredHomeDir(env, homedir),
		env,
		homedir
	}));
	return path.resolve(store);
}
function resolveAgentsDirFromSessionStorePath(storePath) {
	const candidateAbsPath = path.resolve(storePath);
	if (path.basename(candidateAbsPath) !== "sessions.json") return;
	const sessionsDir = path.dirname(candidateAbsPath);
	if (path.basename(sessionsDir) !== "sessions") return;
	const agentDir = path.dirname(sessionsDir);
	const agentsDir = path.dirname(agentDir);
	if (path.basename(agentsDir) !== "agents") return;
	return agentsDir;
}
//#endregion
export { parseSessionArchiveTimestamp as C, parseCompactionCheckpointTranscriptFileName as S, isSessionStoreTempArtifactName as _, resolveSessionFilePath as a, isTrajectorySessionArtifactName as b, resolveSessionTranscriptPathInDir as c, resolveStorePath as d, validateSessionId as f, isSessionArchiveArtifactName as g, isPrimarySessionTranscriptFileName as h, resolveExplicitSessionFilePath as i, resolveSessionTranscriptsDir as l, isCompactionCheckpointTranscriptFileName as m, resolveAgentsDirFromSessionStorePath as n, resolveSessionFilePathOptions as o, formatSessionArchiveTimestamp as p, resolveDefaultSessionStorePath as r, resolveSessionTranscriptPath as s, SAFE_SESSION_ID_RE as t, resolveSessionTranscriptsDirForAgent as u, isTrajectoryPointerArtifactName as v, parseUsageCountedSessionIdFromFileName as w, isUsageCountedSessionTranscriptFileName as x, isTrajectoryRuntimeArtifactName as y };
