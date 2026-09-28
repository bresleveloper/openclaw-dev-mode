import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as resolveRequiredHomeDir, t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { o as safeRealpathSync } from "./boundary-path-BzetEUdq.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { r as isCompactionCheckpointTranscriptFileName } from "./artifacts-C9weQ_MG.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/config/sessions/paths.ts
/** Incognito key identity takes precedence over an explicit durable store path. */
function resolveExplicitSessionStorePathForScope(scope) {
	if (isIncognitoSessionKey(scope.sessionKey)) return resolveIncognitoOpenClawAgentSqlitePath({
		agentId: resolveAgentIdFromSessionKey(scope.sessionKey),
		env: scope.env
	});
	return scope.storePath || void 0;
}
function resolveConcreteSessionStorePath(storePath) {
	const trimmed = storePath?.trim();
	if (!trimmed || trimmed === MULTI_STORE_PATH_SENTINEL || trimmed.includes("{agentId}")) return;
	return trimmed;
}
function resolveAgentSessionsDir(agentId, env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	if (!agentId?.trim()) throw new Error("Session storage path requires an explicit agent id.");
	const root = resolveStateDir(env, homedir);
	const id = normalizeAgentId(agentId);
	return path.join(root, "agents", id, "sessions");
}
function resolveSessionTranscriptsDirForAgent(agentId, env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	return resolveAgentSessionsDir(agentId, env, homedir);
}
function resolveDefaultSessionStorePath(agentId) {
	return path.join(resolveAgentSessionsDir(agentId), "sessions.json");
}
/** Store selectors and explicit databases share the owning agent's session artifact directory. */
function resolveSessionArtifactDirectory(storePath) {
	const storeDir = path.dirname(storePath);
	return path.basename(storeDir) === "agent" ? path.join(path.dirname(storeDir), "sessions") : storeDir;
}
const MULTI_STORE_PATH_SENTINEL = "(multiple)";
const SQLITE_TRANSCRIPT_TARGET_PREFIX = "sqlite:";
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
const SAFE_SESSION_ID_RE = /^[\p{L}\p{N}][\p{L}\p{N}\p{M}._-]{0,127}$/u;
function validateSessionId(sessionId) {
	const trimmed = sessionId.trim();
	if (trimmed !== trimmed.normalize("NFC") || !SAFE_SESSION_ID_RE.test(trimmed) || Buffer.byteLength(`${trimmed}.jsonl`, "utf8") > 255 || isCompactionCheckpointTranscriptFileName(`${trimmed}.jsonl`)) throw new Error(`Invalid session ID: ${sessionId}`);
	return trimmed;
}
function resolveSessionsDir(opts) {
	const sessionsDir = opts?.sessionsDir?.trim();
	if (sessionsDir) return path.resolve(sessionsDir);
	if (!opts?.agentId?.trim()) throw new Error("Session storage path requires an explicit agent id.");
	return resolveAgentSessionsDir(opts.agentId);
}
function resolvePathFromAgentSessionsDir(agentSessionsDir, candidateAbsPath) {
	const agentBase = safeRealpathSync(path.resolve(agentSessionsDir)) ?? path.resolve(agentSessionsDir);
	const realCandidate = safeRealpathSync(candidateAbsPath) ?? candidateAbsPath;
	const relative = path.relative(agentBase, realCandidate);
	if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return resolveRerootedSessionPath(agentBase, candidateAbsPath);
	return path.resolve(agentBase, relative);
}
function resolveRerootedSessionPath(agentSessionsDir, candidateAbsPath) {
	const parsed = resolveAgentSessionsPathParts(candidateAbsPath);
	if (!parsed) return;
	const relativeSegments = parsed.parts.slice(parsed.sessionsIndex + 1);
	if (relativeSegments.length === 0) return;
	const rerooted = path.resolve(agentSessionsDir, ...relativeSegments);
	const contained = path.relative(agentSessionsDir, rerooted);
	if (!contained || contained.startsWith("..") || path.isAbsolute(contained)) return;
	return fs.existsSync(rerooted) ? rerooted : void 0;
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
	const fileName = safeTopicId !== void 0 ? `${safeSessionId}-topic-${safeTopicId}.jsonl` : `${safeSessionId}.jsonl`;
	if (Buffer.byteLength(fileName, "utf8") > 255) throw new Error(`Invalid session transcript filename: ${fileName}`);
	return resolvePathWithinSessionsDir(sessionsDir, fileName);
}
function resolveSessionTranscriptPath(sessionId, agentId, topicId) {
	return resolveSessionTranscriptPathInDir(sessionId, resolveAgentSessionsDir(agentId), topicId);
}
function resolveSessionFilePathCore(sessionId, entry, opts) {
	const sessionsDir = resolveSessionsDir(opts);
	const candidate = entry && "sessionFile" in entry && typeof entry.sessionFile === "string" ? entry.sessionFile.trim() : void 0;
	if (candidate) {
		if (candidate.startsWith(SQLITE_TRANSCRIPT_TARGET_PREFIX)) return candidate;
		try {
			return resolvePathWithinSessionsDir(sessionsDir, candidate, { agentId: opts?.agentId });
		} catch {}
	}
	return resolveSessionTranscriptPathInDir(sessionId, sessionsDir);
}
var SessionStoreAgentIdRequiredError = class extends Error {
	constructor() {
		super("Session store path requires an explicit agent id.");
		this.name = "SessionStoreAgentIdRequiredError";
	}
};
/** Resolves fixed literal paths without an owner; derived or templated paths require agentId. */
function resolveSessionStorePathCore(store, opts) {
	const env = opts?.env ?? process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	if (!store) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
		return path.join(resolveAgentSessionsDir(agentId, env, homedir), "sessions.json");
	}
	if (store.includes("{agentId}")) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
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
export { resolveExplicitSessionStorePathForScope as a, resolveSessionFilePathOptions as c, resolveSessionTranscriptPathInDir as d, resolveSessionTranscriptsDirForAgent as f, resolveDefaultSessionStorePath as i, resolveSessionStorePathCore as l, resolveAgentsDirFromSessionStorePath as n, resolveSessionArtifactDirectory as o, validateSessionId as p, resolveConcreteSessionStorePath as r, resolveSessionFilePathCore as s, SessionStoreAgentIdRequiredError as t, resolveSessionTranscriptPath as u };
