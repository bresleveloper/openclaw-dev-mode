import { o as resolveRequiredHomeDir } from "./home-dir-BjcCg_IW.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { C as parseSessionArchiveTimestamp, a as resolveSessionFilePath, c as resolveSessionTranscriptPathInDir, p as formatSessionArchiveTimestamp, s as resolveSessionTranscriptPath } from "./paths-CHZBIGhF.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-BFG5Kqze.js";
import { t as extractGeneratedTranscriptSessionId } from "./generated-transcript-session-id-C-WpjhM8.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/gateway/session-transcript-files.fs.ts
const MAX_RESET_ARCHIVE_DISCOVERY_CACHE_ENTRIES = 2048;
const MAX_RESET_ARCHIVE_HEADER_MATCH_CACHE_ENTRIES = 4096;
const MAX_RESET_ARCHIVE_CANDIDATES_PER_TRANSCRIPT = 128;
const resetArchiveDiscoveryCache = /* @__PURE__ */ new Map();
const resetArchiveHeaderMatchCache = /* @__PURE__ */ new Map();
function clearSessionTranscriptResetArchiveDiscoveryCache() {
	resetArchiveDiscoveryCache.clear();
	resetArchiveHeaderMatchCache.clear();
}
function deleteResetArchiveHeaderMatchesForArchives(archives) {
	if (archives.length === 0 || resetArchiveHeaderMatchCache.size === 0) return;
	const archivePaths = new Set(archives.map((archive) => archive.archivePath));
	for (const cacheKey of resetArchiveHeaderMatchCache.keys()) {
		const archivePath = cacheKey.slice(cacheKey.indexOf("\0") + 1);
		if (archivePaths.has(archivePath)) resetArchiveHeaderMatchCache.delete(cacheKey);
	}
}
function setResetArchiveDiscoveryCacheEntry(cacheKey, entry) {
	resetArchiveDiscoveryCache.set(cacheKey, entry);
	while (resetArchiveDiscoveryCache.size > MAX_RESET_ARCHIVE_DISCOVERY_CACHE_ENTRIES) {
		const oldestKey = resetArchiveDiscoveryCache.keys().next().value;
		if (typeof oldestKey !== "string") break;
		const oldestEntry = resetArchiveDiscoveryCache.get(oldestKey);
		if (oldestEntry) deleteResetArchiveHeaderMatchesForArchives(oldestEntry.archives);
		resetArchiveDiscoveryCache.delete(oldestKey);
	}
}
function setResetArchiveHeaderMatchCacheEntry(cacheKey, entry) {
	resetArchiveHeaderMatchCache.set(cacheKey, entry);
	while (resetArchiveHeaderMatchCache.size > MAX_RESET_ARCHIVE_HEADER_MATCH_CACHE_ENTRIES) {
		const oldestKey = resetArchiveHeaderMatchCache.keys().next().value;
		if (typeof oldestKey !== "string") break;
		resetArchiveHeaderMatchCache.delete(oldestKey);
	}
}
function classifySessionTranscriptCandidate(sessionId, sessionFile) {
	const transcriptSessionId = extractGeneratedTranscriptSessionId(sessionFile);
	if (!transcriptSessionId) return "custom";
	return transcriptSessionId === sessionId ? "current" : "stale";
}
function canonicalizePathForComparison(filePath) {
	const resolved = path.resolve(filePath);
	try {
		return fs.realpathSync(resolved);
	} catch {
		return resolved;
	}
}
function resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId) {
	const candidates = [];
	const sessionFileState = classifySessionTranscriptCandidate(sessionId, sessionFile);
	const pushCandidate = (resolve) => {
		try {
			candidates.push(resolve());
		} catch {}
	};
	if (storePath) {
		const sessionsDir = path.dirname(storePath);
		if (sessionFile && sessionFileState !== "stale") pushCandidate(() => resolveSessionFilePath(sessionId, { sessionFile }, {
			sessionsDir,
			agentId
		}));
		pushCandidate(() => resolveSessionTranscriptPathInDir(sessionId, sessionsDir));
		if (sessionFile && sessionFileState === "stale") pushCandidate(() => resolveSessionFilePath(sessionId, { sessionFile }, {
			sessionsDir,
			agentId
		}));
	} else if (sessionFile) if (agentId) {
		if (sessionFileState !== "stale") pushCandidate(() => resolveSessionFilePath(sessionId, { sessionFile }, { agentId }));
	} else {
		const trimmed = sessionFile.trim();
		if (trimmed) candidates.push(path.resolve(trimmed));
	}
	if (agentId) {
		pushCandidate(() => resolveSessionTranscriptPath(sessionId, agentId));
		if (sessionFile && sessionFileState === "stale") pushCandidate(() => resolveSessionFilePath(sessionId, { sessionFile }, { agentId }));
	}
	const home = resolveRequiredHomeDir(process.env, os.homedir);
	const legacyDir = path.join(home, ".openclaw", "sessions");
	pushCandidate(() => resolveSessionTranscriptPathInDir(sessionId, legacyDir));
	return uniqueStrings(candidates);
}
async function resetArchiveHeaderMatchesSessionId(sessionId, archivePath) {
	const stat = await fs.promises.stat(archivePath).catch(() => null);
	if (!stat?.isFile()) return false;
	const cacheKey = `${sessionId}\0${archivePath}`;
	const cached = resetArchiveHeaderMatchCache.get(cacheKey);
	if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
		resetArchiveHeaderMatchCache.delete(cacheKey);
		resetArchiveHeaderMatchCache.set(cacheKey, cached);
		return cached.matches;
	}
	let matches = false;
	const handle = await fs.promises.open(archivePath, "r").catch(() => null);
	if (!handle) return false;
	try {
		const buffer = Buffer.alloc(64 * 1024);
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
		const lines = buffer.toString("utf-8", 0, bytesRead).split(/\r?\n/);
		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			const record = JSON.parse(trimmed);
			matches = Boolean(record) && typeof record === "object" && !Array.isArray(record) && record.type === "session" && record.id === sessionId;
			return matches;
		}
		return false;
	} catch {
		return false;
	} finally {
		await handle.close().catch(() => void 0);
		setResetArchiveHeaderMatchCacheEntry(cacheKey, {
			mtimeMs: stat.mtimeMs,
			size: stat.size,
			matches
		});
	}
}
async function listResetArchiveCandidatesForTranscriptAsync(transcriptPath) {
	const base = path.basename(transcriptPath);
	if (!base.endsWith(".jsonl")) return;
	const dir = path.dirname(transcriptPath);
	const dirStat = await fs.promises.stat(dir).catch(() => null);
	if (!dirStat?.isDirectory()) return;
	const cacheKey = `${dir}\0${base}`;
	const cached = resetArchiveDiscoveryCache.get(cacheKey);
	if (cached && cached.dirMtimeMs === dirStat.mtimeMs && cached.dirSize === dirStat.size) {
		resetArchiveDiscoveryCache.delete(cacheKey);
		resetArchiveDiscoveryCache.set(cacheKey, cached);
		return cached.archives;
	}
	const archives = [];
	try {
		for (const entry of await fs.promises.readdir(dir, { withFileTypes: true })) {
			if (!entry.isFile() || !entry.name.startsWith(`${base}.reset.`)) continue;
			const timestamp = parseSessionArchiveTimestamp(entry.name, "reset");
			if (timestamp == null) continue;
			archives.push({
				archivePath: path.join(dir, entry.name),
				name: entry.name,
				timestamp
			});
		}
	} catch {
		return;
	}
	archives.sort((left, right) => right.timestamp - left.timestamp || right.name.localeCompare(left.name));
	const boundedArchives = archives.slice(0, MAX_RESET_ARCHIVE_CANDIDATES_PER_TRANSCRIPT);
	setResetArchiveDiscoveryCacheEntry(cacheKey, {
		dirMtimeMs: dirStat.mtimeMs,
		dirSize: dirStat.size,
		archives: boundedArchives
	});
	return boundedArchives;
}
async function resolveLatestResetArchiveForTranscriptAsync(sessionId, transcriptPath, opts) {
	const archives = await listResetArchiveCandidatesForTranscriptAsync(transcriptPath);
	if (!archives) return;
	if (opts?.requireSessionHeader !== true) return archives[0];
	for (const archive of archives) if (await resetArchiveHeaderMatchesSessionId(sessionId, archive.archivePath)) return archive;
}
function transcriptArchiveIdentity(sessionId, transcriptPath) {
	const generatedSessionId = extractGeneratedTranscriptSessionId(transcriptPath);
	return {
		key: path.basename(transcriptPath),
		requireSessionHeader: !generatedSessionId || generatedSessionId !== sessionId
	};
}
async function resolveSessionTranscriptResetArchiveCandidatesAsync(sessionId, storePath, sessionFile, agentId) {
	const candidatesByIdentity = /* @__PURE__ */ new Map();
	for (const candidate of resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId)) {
		const identity = transcriptArchiveIdentity(sessionId, candidate);
		if (!identity) continue;
		candidatesByIdentity.set(identity.key, [...candidatesByIdentity.get(identity.key) ?? [], {
			path: candidate,
			requireSessionHeader: identity.requireSessionHeader
		}]);
	}
	return uniqueStrings((await Promise.all(Array.from(candidatesByIdentity.values(), (candidates) => Promise.all(candidates.map((candidate) => resolveLatestResetArchiveForTranscriptAsync(sessionId, candidate.path, { requireSessionHeader: candidate.requireSessionHeader })))))).flatMap((identityArchives) => identityArchives.flatMap((archive) => archive ? [archive] : []).toSorted((left, right) => right.timestamp - left.timestamp || right.name.localeCompare(left.name)).slice(0, 1)).map((archive) => archive.archivePath));
}
function archiveFileOnDisk(filePath, reason) {
	const archived = `${filePath}.${reason}.${formatSessionArchiveTimestamp()}`;
	fs.renameSync(filePath, archived);
	clearSessionTranscriptResetArchiveDiscoveryCache();
	emitSessionTranscriptUpdate({ sessionFile: archived });
	return archived;
}
function archiveSessionTranscripts(opts) {
	return archiveSessionTranscriptsDetailed(opts).map((entry) => entry.archivedPath);
}
function archiveSessionTranscriptsDetailed(opts) {
	const archived = [];
	const storeDir = opts.restrictToStoreDir && opts.storePath ? canonicalizePathForComparison(path.dirname(opts.storePath)) : null;
	for (const candidate of resolveSessionTranscriptCandidates(opts.sessionId, opts.storePath, opts.sessionFile, opts.agentId)) {
		const candidatePath = canonicalizePathForComparison(candidate);
		if (storeDir) {
			const relative = path.relative(storeDir, candidatePath);
			if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) continue;
		}
		if (!fs.existsSync(candidatePath)) continue;
		try {
			archived.push({
				sourcePath: candidatePath,
				archivedPath: archiveFileOnDisk(candidatePath, opts.reason)
			});
		} catch (err) {
			opts.onArchiveError?.(err, candidatePath);
		}
	}
	return archived;
}
function resolveStableSessionEndTranscript(params) {
	const archivedTranscripts = params.archivedTranscripts ?? [];
	if (archivedTranscripts.length > 0) {
		const preferredPath = params.sessionFile?.trim() ? canonicalizePathForComparison(params.sessionFile) : void 0;
		const archivedPath = (preferredPath == null ? void 0 : archivedTranscripts.find((entry) => canonicalizePathForComparison(entry.sourcePath) === preferredPath))?.archivedPath ?? archivedTranscripts[0]?.archivedPath;
		if (archivedPath) return {
			sessionFile: archivedPath,
			transcriptArchived: true
		};
	}
	for (const candidate of resolveSessionTranscriptCandidates(params.sessionId, params.storePath, params.sessionFile, params.agentId)) {
		const candidatePath = canonicalizePathForComparison(candidate);
		if (fs.existsSync(candidatePath)) return {
			sessionFile: candidatePath,
			transcriptArchived: false
		};
	}
	return {};
}
async function cleanupArchivedSessionTranscripts(opts) {
	const rules = opts.rules.filter((rule) => Number.isFinite(rule.olderThanMs) && rule.olderThanMs >= 0);
	if (rules.length === 0) return {
		removed: 0,
		scanned: 0
	};
	const now = opts.nowMs ?? Date.now();
	const directories = uniqueStrings(opts.directories.map((dir) => path.resolve(dir)));
	let removed = 0;
	let scanned = 0;
	for (const dir of directories) {
		const entries = await fs.promises.readdir(dir).catch(() => []);
		for (const entry of entries) for (const rule of rules) {
			const timestamp = parseSessionArchiveTimestamp(entry, rule.reason);
			if (timestamp == null) continue;
			scanned += 1;
			if (now - timestamp > rule.olderThanMs) {
				const fullPath = path.join(dir, entry);
				if ((await fs.promises.stat(fullPath).catch(() => null))?.isFile()) {
					await fs.promises.rm(fullPath).catch(() => void 0);
					removed += 1;
				}
			}
			break;
		}
	}
	return {
		removed,
		scanned
	};
}
//#endregion
export { resolveSessionTranscriptResetArchiveCandidatesAsync as a, resolveSessionTranscriptCandidates as i, archiveSessionTranscriptsDetailed as n, resolveStableSessionEndTranscript as o, cleanupArchivedSessionTranscripts as r, archiveSessionTranscripts as t };
