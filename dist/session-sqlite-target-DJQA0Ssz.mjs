import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as createOpenClawAgentDatabasePathMatcher, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath, n as listSqliteTargetCandidatePathsForSessionStorePath, r as parseSqliteTargetSuffixIndex } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { s as listOpenClawRegisteredAgentDatabases, u as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { d as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import "./openclaw-agent-db-registry-DuEPPF6m.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { lstatSync, readdirSync } from "node:fs";
import path from "node:path";
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
	const unsuffixed = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	if (unsuffixed.agentId) return unsuffixed;
	const env = captureSessionTranscriptStorageEnvironment(options.env ?? process.env);
	const registryRead = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env });
	const input = {
		storePath: path.resolve(storePath.trim()),
		agentId: options.agentId,
		defaultAgentId: options.defaultAgentId,
		env
	};
	const { resolveSessionSqliteTargetInWorker } = await import("./session-transcript-read-worker-runtime-T0jRoZss.mjs");
	const registry = await registryRead.read(signal);
	const registeredDatabases = readSessionStoreRegistryRows(registry.result.status === "available" ? registry.result.entries : registry.result);
	signal?.throwIfAborted();
	return resolveSessionSqliteTargetInWorker({
		...input,
		registeredDatabases
	}, signal);
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
		const occupiedIndexes = /* @__PURE__ */ new Set();
		for (const registered of registeredDatabases) {
			if (!isSameDatabasePath(path.dirname(registered.path), sessionsDir)) continue;
			const index = parseSqliteTargetSuffixIndex(path.basename(registered.path), prefix);
			if (index !== void 0) occupiedIndexes.add(index);
		}
		try {
			for (const fileName of readdirSync(sessionsDir)) {
				const index = parseSqliteTargetSuffixIndex(fileName, prefix);
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
export { readSessionStoreRegistryRows as a, prepareSqliteTargetFromSessionStorePath as i, listDurableSqliteTargetOwnersForSessionStorePath as n, resolveSqliteTargetFromSessionStorePath as o, listDurableSqliteTargetPathsForSessionStorePath as r, SessionStoreRegistryReadRequired as t };
