import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as resolveRequiredHomeDir, o as resolveUserPath, t as expandHomePrefix } from "./home-dir-Dc6nN6HB.mjs";
import { o as safeRealpathSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { r as isCompactionCheckpointTranscriptFileName } from "./artifacts-BvSTVPj-.mjs";
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
function resolveSessionTranscriptsDirForAgent(agentId, env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	if (!agentId?.trim()) throw new Error("Session storage path requires an explicit agent id.");
	const root = resolveStateDir(env, homedir);
	const id = normalizeAgentId(agentId);
	return path.join(root, "agents", id, "sessions");
}
function resolveDefaultSessionStorePath(agentId) {
	return path.join(resolveSessionTranscriptsDirForAgent(agentId), "sessions.json");
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
	return resolveSessionTranscriptsDirForAgent(opts?.agentId ?? "");
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
	const agentsDir = resolveAgentsDirFromSessionStorePath(path.join(baseSessionsDir, "sessions.json"));
	return agentsDir ? path.join(agentsDir, normalizeAgentId(agentId), "sessions") : void 0;
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
			return resolvePathFromAgentSessionsDir(resolveSessionTranscriptsDirForAgent(normalizedAgentId), realTrimmed);
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
	return resolveSessionTranscriptPathInDir(sessionId, resolveSessionTranscriptsDirForAgent(agentId), topicId);
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
	return resolveSessionStorePathWithContext(store, opts, { cwd: resolveUserPath(".") });
}
/** Internal async readers capture their relative-path base before yielding. */
function resolveSessionStorePathWithContext(store, opts, context) {
	const env = opts?.env ?? process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	if (!store) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
		return path.join(resolveSessionTranscriptsDirForAgent(agentId, env, homedir), "sessions.json");
	}
	let expandedStore = store;
	if (expandedStore.includes("{agentId}")) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
		expandedStore = expandedStore.replaceAll("{agentId}", agentId);
	}
	if (expandedStore.startsWith("~")) return path.resolve(context.cwd, expandHomePrefix(expandedStore, {
		home: resolveRequiredHomeDir(env, homedir),
		env,
		homedir
	}));
	return path.resolve(context.cwd, expandedStore);
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
export { resolveExplicitSessionStorePathForScope as a, resolveSessionFilePathOptions as c, resolveSessionTranscriptPath as d, resolveSessionTranscriptPathInDir as f, resolveDefaultSessionStorePath as i, resolveSessionStorePathCore as l, validateSessionId as m, resolveAgentsDirFromSessionStorePath as n, resolveSessionArtifactDirectory as o, resolveSessionTranscriptsDirForAgent as p, resolveConcreteSessionStorePath as r, resolveSessionFilePathCore as s, SessionStoreAgentIdRequiredError as t, resolveSessionStorePathWithContext as u };
