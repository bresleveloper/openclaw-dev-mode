import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { o as parseUsageCountedSessionIdFromFileName } from "./transcript-file-names-BZ8jA63H.mjs";
import { a as isSessionArchiveArtifactName, c as isUsageCountedSessionTranscriptFileName } from "./artifacts-C6u8F4sP.mjs";
import { c as resolveSessionStorePathCore, d as resolveSessionTranscriptsDirForAgent } from "./paths-YgcBNLgG.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import "./config-utils-DvW0vXFD.mjs";
import { bt as classifySessionEntry, xt as collectCronGeneratedSessionKeys } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-CHYPkxYr.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { n as listSessionTranscriptArchivesReadOnly } from "./session-accessor.sqlite-history-DHJfVW84.mjs";
import { t as listSessionTranscriptInstances } from "./session-history-BKt1cI8X.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-BLpjjUTc.mjs";
import { r as normalizeComparablePath, t as isFileMissingError } from "./fs-utils-CGe1-9Am.mjs";
import { c as readSessionTranscriptCorpusInWorker, l as readTranscriptContentRevisionSync, r as extractAgentIdFromSessionsDir } from "./openclaw-runtime-session-Du3RWOJ8.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region packages/memory-host-sdk/src/host/session-transcript-corpus.ts
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
async function normalizeRealComparablePathAsync(pathname) {
	try {
		return normalizeComparablePath(await fs.realpath(pathname));
	} catch {
		try {
			return normalizeComparablePath(path.join(await fs.realpath(path.dirname(pathname)), path.basename(pathname)));
		} catch {
			return normalizeComparablePath(pathname);
		}
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
function resolveSessionTranscriptCorpusScope(agentId, cfg) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const env = cloneEnvWithPlatformSemantics(process.env);
	const configuredStore = cfg.session?.store;
	const storePath = resolveSessionStorePathCore(configuredStore, {
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
			storePath: databasePath,
			readOnly: options.readOnly === true
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
async function readSessionTranscriptCorpusArtifacts(scope, options) {
	const artifactDirs = /* @__PURE__ */ new Map();
	for (const dir of scope.artifactDirs) artifactDirs.set(await normalizeRealComparablePathAsync(dir), dir);
	const artifacts = [];
	const seen = /* @__PURE__ */ new Set();
	for (const dir of artifactDirs.values()) {
		let entries;
		try {
			entries = await fs.readdir(dir, { withFileTypes: true });
		} catch (error) {
			if (isFileMissingError(error) && error.code === "ENOENT") continue;
			throw error;
		}
		for (const artifactPath of sessionTranscriptArtifactPaths(dir, entries)) {
			const comparablePath = await normalizeRealComparablePathAsync(artifactPath);
			if (seen.has(comparablePath)) continue;
			seen.add(comparablePath);
			let contentRevision;
			if (options.includeContentRevision !== false) try {
				contentRevision = fileContentRevisionFromStat(await fs.stat(artifactPath, { bigint: true }));
			} catch {
				contentRevision = void 0;
			}
			artifacts.push({
				path: artifactPath,
				contentRevision
			});
		}
	}
	return artifacts;
}
/**
* Lists transcript corpus entries for memory indexing.
*
* Active sessions come from the session accessor seam; retained reset/delete
* transcript artifacts remain explicit file artifacts until core owns archive
* artifact enumeration.
*/
async function listSessionTranscriptCorpusEntriesForAgent(agentId, options = {}) {
	const { config, ...capturedOptions } = options;
	const scope = resolveSessionTranscriptCorpusScope(agentId, config ?? readRuntimeConfig());
	const prepareArtifacts = () => readSessionTranscriptCorpusArtifacts(scope, capturedOptions);
	return readSessionTranscriptCorpusInWorker(scope, capturedOptions, prepareArtifacts);
}
/** Project inventory in the admitted reader; only corpus metadata crosses the worker boundary. */
function readSessionTranscriptCorpusInventory(scope, options, artifacts, databasePath, continuation) {
	const readOnlyOptions = {
		...options,
		readOnly: true
	};
	return projectSessionTranscriptCorpusEntries(scope, readOnlyOptions, artifacts, readCorpusSessionEntries({
		...scope,
		storePath: databasePath
	}, readOnlyOptions, continuation), databasePath, continuation);
}
//#endregion
export { readSessionTranscriptCorpusInventory as n, listSessionTranscriptCorpusEntriesForAgent as t };
