import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { c as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DAuOtcuZ.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./openclaw-agent-db-resources-x2MmUEok.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath, r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { C as listSqliteTargetCandidatePathsForSessionStorePath, w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { c as prepareOpenClawAgentDatabaseRegistrySnapshotRead, s as listOpenClawRegisteredAgentDatabases, t as AgentDatabaseRegistryChangedError } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import "./openclaw-agent-db-registry-BJf044De.mjs";
import { d as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { lstatSync, readdirSync } from "node:fs";
import path from "node:path";
//#region src/config/sessions/session-store-read-candidates.ts
function measureSessionStoreTargetInventoryInputBytes(request) {
	let bytes = JSON.stringify(request).length * 2;
	for (const [agentId, paths] of request.paths) bytes += 2 * (agentId.length + paths.configured.length + paths.default.length);
	return bytes;
}
function resolveCapturedSessionStorePath(store, agentId, env, paths, kind = "configured") {
	if (!paths) return resolveSessionStorePathCore(kind === "default" ? void 0 : store, {
		agentId,
		env
	});
	const captured = paths.get(agentId);
	if (!captured) throw new Error(`Session store path was not captured for ${agentId}`);
	return captured[kind];
}
/** Families follow their directory; existing file aliases get separate exact captures. */
function captureSessionStoreReadCandidate(pathname, scope) {
	const capturedPath = path.resolve(pathname);
	return {
		path: capturedPath,
		physicalPath: scope ? path.join(resolveIdentityPathViaExistingAncestorSync(path.dirname(capturedPath)), path.basename(capturedPath)) : resolveIdentityPathViaExistingAncestorSync(capturedPath),
		...scope ? { scope } : {}
	};
}
/** Native discovery may use only the captured lexical and physical family together. */
function assertSessionStoreReadCandidate(pathname, candidates) {
	const physicalPath = resolveIdentityPathViaExistingAncestorSync(pathname);
	for (const candidate of candidates) if ((matchesAgentDatabaseReadCandidatePath(candidate, pathname) || !candidate.scope && physicalPath === candidate.physicalPath) && matchesAgentDatabaseReadCandidatePath({
		...candidate,
		path: candidate.physicalPath
	}, physicalPath) && captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath === candidate.physicalPath) return physicalPath;
	throw new Error(`Session database target changed outside captured discovery custody: ${pathname}`);
}
//#endregion
//#region src/config/sessions/session-sqlite-target.ts
var SessionStoreRegistryReadRequired = class extends Error {};
/** Demand registry facts only where target ownership actually consults them. */
function readSessionStoreRegistryRows(registry, env, onReadError) {
	if (registry && "status" in registry) {
		if (registry.status === "deferred") throw new SessionStoreRegistryReadRequired("Session target discovery requires registry rows");
		const error = /* @__PURE__ */ new Error("Session target registry is unavailable");
		onReadError?.(error);
		throw error;
	}
	return registry ?? listOpenClawRegisteredAgentDatabases({ env });
}
/** Resolve physical ownership before the transcript reader acquires database custody. */
async function prepareSqliteTargetFromSessionStorePath(storePath, options = {}, signal) {
	signal?.throwIfAborted();
	const pathname = path.resolve(storePath);
	const unsuffixed = resolveUnsuffixedSqliteTargetFromSessionStorePath(pathname);
	if (unsuffixed.agentId) return unsuffixed;
	const env = captureSessionTranscriptStorageEnvironment(options.env ?? process.env);
	const registryRead = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env });
	const input = {
		storePath: pathname,
		agentId: options.agentId,
		defaultAgentId: options.defaultAgentId,
		env
	};
	const { resolveSessionSqliteTargetInWorker } = await import("./session-transcript-read-worker-runtime-BZjHXMae.mjs");
	let refreshed = false;
	for (;;) {
		signal?.throwIfAborted();
		let registry;
		try {
			registry = await registryRead.read();
			registry.assertCurrent();
		} catch (error) {
			if (!refreshed && error instanceof AgentDatabaseRegistryChangedError) {
				refreshed = true;
				continue;
			}
			throw error;
		}
		const registeredDatabases = readSessionStoreRegistryRows(registry.result.status === "available" ? registry.result.entries : registry.result);
		signal?.throwIfAborted();
		const target = await resolveSessionSqliteTargetInWorker({
			...input,
			registeredDatabases
		}, signal);
		signal?.throwIfAborted();
		try {
			registry.assertCurrent();
		} catch (error) {
			if (!refreshed && error instanceof AgentDatabaseRegistryChangedError) {
				refreshed = true;
				continue;
			}
			throw error;
		}
		return target;
	}
}
function resolvePersistedOwners(pathname, registeredDatabases, isSameDatabasePath, options) {
	const registeredOwners = [...new Set(registeredDatabases.filter((entry) => isSameDatabasePath(entry.path, pathname)).map((entry) => normalizeAgentId(entry.agentId)))];
	let databaseOwner;
	if (registeredOwners.length === 1) hasFilesystemEntry(pathname, options.onReadError);
	else databaseOwner = resolveDatabaseOwner(pathname, options.readCandidates, options.onReadError);
	return {
		registeredOwners,
		databaseOwner
	};
}
function resolveDatabaseOwner(pathname, readCandidates, onReadError) {
	if (!hasFilesystemEntry(pathname, onReadError)) return;
	const physicalPath = readCandidates ? assertSessionStoreReadCandidate(pathname, readCandidates) : pathname;
	const owner = inspectOpenClawAgentDatabaseOwner(physicalPath);
	return owner.status === "owned" ? normalizeAgentId(owner.agentId) : void 0;
}
function hasFilesystemEntry(pathname, onReadError) {
	try {
		lstatSync(pathname);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		onReadError?.(error);
		throw error;
	}
}
function resolveCustomStoreSqlitePath(params) {
	const unsuffixedPath = path.resolve(params.unsuffixedPath);
	const sqliteBaseName = path.basename(unsuffixedPath, ".sqlite");
	const sessionsDir = path.dirname(unsuffixedPath);
	const defaultAgentId = normalizeAgentId(params.options.defaultAgentId ?? "main");
	const agentId = normalizeAgentId(params.options.agentId ?? defaultAgentId);
	const registeredDatabases = readSessionStoreRegistryRows(params.options.registeredDatabases, params.options.env, params.options.onReadError);
	const isSameDatabasePath = params.options.isSameDatabasePath ?? createOpenClawAgentDatabasePathMatcher();
	const resolvePersistedOwner = (candidatePath) => {
		const { registeredOwners, databaseOwner } = resolvePersistedOwners(candidatePath, registeredDatabases, isSameDatabasePath, params.options);
		return {
			effectiveOwner: registeredOwners.length === 1 ? registeredOwners[0] : registeredOwners.length === 0 ? databaseOwner : void 0,
			registeredOwners
		};
	};
	const { registeredOwners: registeredUnsuffixedOwners, effectiveOwner: persistedUnsuffixedOwner } = resolvePersistedOwner(unsuffixedPath);
	const resolveSuffixedTarget = (ownerAgentId) => {
		const prefix = `${sqliteBaseName}.${ownerAgentId}`;
		const parseIndex = (fileName) => {
			if (fileName === `${prefix}.sqlite`) return 1;
			if (!fileName.startsWith(`${prefix}.`) || !fileName.endsWith(".sqlite")) return;
			const rawValue = fileName.slice(prefix.length + 1, -7);
			if (!/^[1-9]\d*$/.test(rawValue)) return;
			const value = Number(rawValue);
			return Number.isSafeInteger(value) && value >= 2 && String(value) === rawValue ? value : void 0;
		};
		const occupiedIndexes = /* @__PURE__ */ new Set();
		for (const registered of registeredDatabases) {
			if (!isSameDatabasePath(path.dirname(registered.path), sessionsDir)) continue;
			const index = parseIndex(path.basename(registered.path));
			if (index !== void 0) occupiedIndexes.add(index);
		}
		try {
			for (const fileName of readdirSync(sessionsDir)) {
				const index = parseIndex(fileName);
				if (index !== void 0) occupiedIndexes.add(index);
			}
		} catch (error) {
			if (error.code !== "ENOENT") {
				params.options.onReadError?.(error);
				throw error;
			}
		}
		const candidatePathAt = (index) => path.join(sessionsDir, index === 1 ? `${prefix}.sqlite` : `${prefix}.${index}.sqlite`);
		const sortedOccupiedIndexes = [...occupiedIndexes].toSorted((left, right) => left - right);
		for (const index of sortedOccupiedIndexes) {
			const candidatePath = candidatePathAt(index);
			if (resolvePersistedOwner(candidatePath).effectiveOwner === ownerAgentId) return {
				owned: true,
				path: candidatePath
			};
		}
		let firstMissingIndex = 1;
		for (const index of sortedOccupiedIndexes) if (index === firstMissingIndex) firstMissingIndex += 1;
		else if (index > firstMissingIndex) break;
		for (let index = firstMissingIndex;; index += 1) {
			const candidatePath = candidatePathAt(index);
			const candidateOwner = resolvePersistedOwner(candidatePath);
			if (candidateOwner.effectiveOwner === ownerAgentId) return {
				owned: true,
				path: candidatePath
			};
			if (candidateOwner.registeredOwners.length === 0 && !hasFilesystemEntry(candidatePath, params.options.onReadError)) return {
				owned: false,
				path: candidatePath
			};
		}
	};
	const defaultSuffixedTarget = resolveSuffixedTarget(defaultAgentId);
	const agentSuffixedTarget = agentId === defaultAgentId ? defaultSuffixedTarget : resolveSuffixedTarget(agentId);
	const defaultOwnsSuffixedPath = defaultSuffixedTarget.owned;
	const agentOwnsSuffixedPath = agentSuffixedTarget.owned;
	const unsuffixedAvailable = registeredUnsuffixedOwners.length === 0 && !hasFilesystemEntry(unsuffixedPath, params.options.onReadError);
	const fallbackUnsuffixedOwner = persistedUnsuffixedOwner || defaultOwnsSuffixedPath || !unsuffixedAvailable ? void 0 : defaultAgentId;
	const unsuffixedOwnerAgentId = persistedUnsuffixedOwner ?? fallbackUnsuffixedOwner;
	const useUnsuffixedPath = agentId === persistedUnsuffixedOwner || !agentOwnsSuffixedPath && agentId === fallbackUnsuffixedOwner;
	const ownerSource = persistedUnsuffixedOwner ? registeredUnsuffixedOwners.length === 1 ? "database-registry" : "database-path" : defaultOwnsSuffixedPath ? "registered-suffixed" : registeredUnsuffixedOwners.length > 1 ? "ambiguous-registry" : !unsuffixedAvailable ? "occupied-unsuffixed" : "configured-default";
	return {
		agentId,
		path: useUnsuffixedPath ? unsuffixedPath : agentSuffixedTarget.path,
		ownerSource,
		...unsuffixedOwnerAgentId ? { unsuffixedOwnerAgentId } : {}
	};
}
/** Resolves the SQLite database target that owns a legacy session store path. */
function resolveSqliteTargetFromSessionStorePath(storePath, options = {}) {
	const unsuffixedTarget = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	const requestedAgentId = options.agentId ? normalizeAgentId(options.agentId) : void 0;
	if (requestedAgentId && isIncognitoOpenClawAgentSqlitePath(unsuffixedTarget.path, {
		agentId: requestedAgentId,
		env: options.env
	})) return {
		agentId: requestedAgentId,
		path: unsuffixedTarget.path
	};
	if (unsuffixedTarget.agentId) return unsuffixedTarget;
	if (unsuffixedTarget.shared) {
		const registeredDatabases = readSessionStoreRegistryRows(options.registeredDatabases, options.env, options.onReadError);
		const { registeredOwners, databaseOwner } = resolvePersistedOwners(unsuffixedTarget.path, registeredDatabases, options.isSameDatabasePath ?? createOpenClawAgentDatabasePathMatcher(), options);
		const configuredDefaultAgentId = normalizeAgentId(options.defaultAgentId ?? "main");
		return {
			agentId: (registeredOwners.length === 1 ? registeredOwners[0] : void 0) ?? databaseOwner ?? configuredDefaultAgentId,
			path: unsuffixedTarget.path,
			shared: true,
			ownerSource: registeredOwners.length === 1 ? "database-registry" : databaseOwner ? "database-path" : registeredOwners.length > 1 ? "ambiguous-registry" : "configured-default"
		};
	}
	return resolveCustomStoreSqlitePath({
		unsuffixedPath: unsuffixedTarget.path,
		options
	});
}
/** Lists durable owners recorded in the fixed store's bounded SQLite sibling family. */
function listDurableSqliteTargetOwnersForSessionStorePath(storePath) {
	const owners = /* @__PURE__ */ new Set();
	for (const candidatePath of listSqliteTargetCandidatePathsForSessionStorePath(storePath)) {
		const owner = resolveDatabaseOwner(candidatePath);
		if (owner) owners.add(owner);
	}
	return [...owners];
}
/** Lists the logical store's unsuffixed target plus durable owned partitions. */
function listDurableSqliteTargetPathsForSessionStorePath(storePath) {
	return listSqliteTargetCandidatePathsForSessionStorePath(storePath).filter((candidatePath, index) => index === 0 || resolveDatabaseOwner(candidatePath) !== void 0);
}
//#endregion
export { readSessionStoreRegistryRows as a, captureSessionStoreReadCandidate as c, prepareSqliteTargetFromSessionStorePath as i, measureSessionStoreTargetInventoryInputBytes as l, listDurableSqliteTargetOwnersForSessionStorePath as n, resolveSqliteTargetFromSessionStorePath as o, listDurableSqliteTargetPathsForSessionStorePath as r, assertSessionStoreReadCandidate as s, SessionStoreRegistryReadRequired as t, resolveCapturedSessionStorePath as u };
