import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { C as isDreamingNarrativeSessionStoreKey, x as isCronRunSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { f as parseUsageCountedSessionIdFromFileName, s as isSessionArchiveArtifactName, u as isUsageCountedSessionTranscriptFileName } from "./artifacts-BvSTVPj-.mjs";
import { p as resolveSessionTranscriptsDirForAgent } from "./paths-dpReqUI8.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import "./config-utils-DnfHy8-v.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-00MgEWj5.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { i as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { n as listSessionTranscriptArchivesReadOnly } from "./session-accessor.sqlite-history-QWpdLpwt.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-Di4jQk7u.mjs";
import { r as normalizeComparablePath, t as isFileMissingError } from "./fs-utils-CK0xaytO.mjs";
import { f as resolveStorePath } from "./session-store-runtime-BS2ijndm.mjs";
import { a as readSessionTranscriptCorpusInWorker, n as extractAgentIdFromSessionsDir, o as readTranscriptContentRevisionSync } from "./openclaw-runtime-session-CtDUsooQ.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
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
function normalizeRealComparablePath(pathname) {
	try {
		return normalizeComparablePath(fs.realpathSync(pathname));
	} catch {
		try {
			return normalizeComparablePath(path.join(fs.realpathSync(path.dirname(pathname)), path.basename(pathname)));
		} catch {
			return normalizeComparablePath(pathname);
		}
	}
}
async function normalizeRealComparablePathAsync(pathname) {
	try {
		return normalizeComparablePath(await fs$1.realpath(pathname));
	} catch {
		try {
			return normalizeComparablePath(path.join(await fs$1.realpath(path.dirname(pathname)), path.basename(pathname)));
		} catch {
			return normalizeComparablePath(pathname);
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
function projectSessionTranscriptCorpusEntries(scope, options, artifacts, sessionEntries, databasePath = scope.storePath, continuation) {
	const { cfg, env, normalizedAgentId, storePath, isSharedFixedStore } = scope;
	const includeContentRevision = options.includeContentRevision !== false;
	const activeEntriesBySessionId = /* @__PURE__ */ new Map();
	const entryOwnersBySessionId = /* @__PURE__ */ new Map();
	const retainedInstances = options.includeRetainedSqlite ? listSessionTranscriptInstances({
		agentId: normalizedAgentId,
		env,
		hydrateSkillPromptRefs: false,
		projection: "list",
		readConsistency: "latest",
		storePath: databasePath
	}, {}, continuation) : [];
	const archivedIdentitiesByName = new Map(listSessionTranscriptArchivesReadOnly({
		agentId: normalizedAgentId,
		env,
		archiveNames: artifacts.map((artifact) => path.basename(artifact.path)),
		storePath: databasePath
	}).map((archive) => [archive.archiveName, archive]));
	const cronGeneratedSessionKeys = collectCronGeneratedSessionKeys([...retainedInstances.map(({ entry, sessionKey }) => ({
		entry,
		sessionKey
	})), ...sessionEntries]);
	const toSqliteEntry = (agentId, sessionId, sessionKey, entry, artifactKind, updatedAtMs) => {
		const classification = classifySessionEntry(sessionKey, entry, cronGeneratedSessionKeys);
		const transcriptKey = artifactKind === "active-session" ? sessionKey.trim() : sessionKey;
		const contentRevision = includeContentRevision ? sqliteContentRevision({
			agentId,
			env,
			sessionId,
			...transcriptKey ? { sessionKey: transcriptKey } : {},
			storePath: databasePath
		}) : void 0;
		return {
			agentId,
			artifactKind,
			sessionFile: transcriptKey,
			sessionId,
			...contentRevision ? { contentRevision } : {},
			transcriptSource: "sqlite",
			storePath,
			...updatedAtMs !== void 0 ? { updatedAtMs } : {},
			...transcriptKey ? { sessionKey: transcriptKey } : {},
			...classification.generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {},
			...classification.generatedByCronRun ? { generatedByCronRun: true } : {},
			sessionKind: classification.sessionKind
		};
	};
	const resolveSessionOwnership = (key) => {
		const sessionKey = isSharedFixedStore ? key : canonicalizeMainSessionAlias({
			cfg,
			agentId: normalizedAgentId,
			sessionKey: key
		});
		return {
			sessionKey,
			ownerAgentId: resolveSessionAgentId({
				config: cfg,
				sessionKey,
				...isSharedFixedStore ? {} : { fallbackAgentId: normalizedAgentId }
			})
		};
	};
	for (const summary of sessionEntries) {
		const { ownerAgentId } = resolveSessionOwnership(summary.sessionKey);
		const sessionId = summary.entry.sessionId?.trim();
		if (!sessionId) continue;
		const entry = toSqliteEntry(ownerAgentId, sessionId, summary.sessionKey, summary.entry, "active-session", Number.isFinite(summary.entry.updatedAt) ? summary.entry.updatedAt : void 0);
		entryOwnersBySessionId.set(entry.sessionId, ownerAgentId);
		if (ownerAgentId === normalizedAgentId) activeEntriesBySessionId.set(entry.sessionId, entry);
	}
	const includeUnownedArtifacts = !isSharedFixedStore;
	const corpusEntries = [...activeEntriesBySessionId.values()];
	if (options.includeRetainedSqlite) for (const instance of retainedInstances) {
		if (activeEntriesBySessionId.has(instance.sessionId)) continue;
		const { sessionKey, ownerAgentId } = resolveSessionOwnership(instance.sessionKey);
		if (ownerAgentId !== normalizedAgentId || !instance.provenanceKnown || instance.acpOwned || instance.entry.pluginOwnerId || instance.entry.hookExternalContentSource) continue;
		corpusEntries.push(toSqliteEntry(ownerAgentId, instance.sessionId, sessionKey, instance.entry, "retained-session", instance.updatedAtMs));
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
	return projectSessionTranscriptCorpusEntries(scope, options, artifacts, readCorpusSessionEntries(scope, options));
}
function readCorpusSessionEntries(scope, options, continuation) {
	const input = {
		agentId: scope.normalizedAgentId,
		env: scope.env,
		hydrateSkillPromptRefs: false,
		projection: "list",
		storePath: scope.storePath
	};
	return options.readOnly === true ? listSessionEntriesReadOnly(input, { continuation }) : listSessionEntriesCore(input);
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
	if (isIncognitoOpenClawAgentSqlitePath(scope.storePath, {
		agentId: scope.normalizedAgentId,
		env: scope.env
	})) return projectSessionTranscriptCorpusEntries(scope, capturedOptions, artifacts, readCorpusSessionEntries(scope, capturedOptions));
	return readSessionTranscriptCorpusInWorker(scope, capturedOptions, artifacts);
}
/** Project inventory in the admitted reader; only corpus metadata crosses the worker boundary. */
function readSessionTranscriptCorpusInventory(scope, options, artifacts, databasePath, continuation) {
	return projectSessionTranscriptCorpusEntries(scope, options, artifacts, readCorpusSessionEntries({
		...scope,
		storePath: databasePath
	}, {
		...options,
		readOnly: true
	}, continuation), databasePath, continuation);
}
//#endregion
export { listSessionTranscriptCorpusEntriesForAgentSync as n, readSessionTranscriptCorpusInventory as r, listSessionTranscriptCorpusEntriesForAgent as t };
