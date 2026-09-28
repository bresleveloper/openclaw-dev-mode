import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { i as matchesAgentDatabaseReadCandidatePath } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { u as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { a as prepareOpenClawAgentDatabaseRegistrySnapshotRead, i as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { t as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-CqmhHNa_.mjs";
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
	for (const candidate of candidates) if (matchesAgentDatabaseReadCandidatePath(candidate, pathname) && matchesAgentDatabaseReadCandidatePath({
		...candidate,
		path: candidate.physicalPath
	}, physicalPath) && captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath === candidate.physicalPath) return physicalPath;
	throw new Error(`Session database target changed outside captured discovery custody: ${pathname}`);
}
//#endregion
//#region src/config/sessions/session-sqlite-target.ts
var SessionStoreRegistryReadRequired = class extends Error {};
/** Demand registry facts only where target ownership actually consults them. */
function readSessionStoreRegistryRows(registry, env) {
	if (registry && "status" in registry) {
		if (registry.status === "deferred") throw new SessionStoreRegistryReadRequired("Session target discovery requires registry rows");
		throw new Error("Session target registry is unavailable");
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
	signal?.throwIfAborted();
	const registry = await registryRead.read();
	try {
		registry.assertCurrent();
		signal?.throwIfAborted();
		const registeredDatabases = readSessionStoreRegistryRows(registry.result.status === "available" ? registry.result.entries : registry.result);
		const { resolveSessionSqliteTargetInWorker } = await import("./session-transcript-read-worker-runtime-C8zzVDRA.mjs");
		registry.assertCurrent();
		signal?.throwIfAborted();
		return await resolveSessionSqliteTargetInWorker({
			...input,
			registeredDatabases
		}, signal);
	} finally {
		registry.assertCurrent();
		signal?.throwIfAborted();
	}
}
function resolveRegisteredOwners(pathname, registeredDatabases, isSameDatabasePath) {
	return [...new Set(registeredDatabases.filter((entry) => isSameDatabasePath(entry.path, pathname)).map((entry) => normalizeAgentId(entry.agentId)))];
}
function resolveDatabaseOwner(pathname, readCandidates) {
	if (!hasFilesystemEntry(pathname)) return;
	const physicalPath = readCandidates ? assertSessionStoreReadCandidate(pathname, readCandidates) : pathname;
	const owner = inspectOpenClawAgentDatabaseOwner(physicalPath);
	return owner.status === "owned" ? normalizeAgentId(owner.agentId) : void 0;
}
function hasFilesystemEntry(pathname) {
	try {
		lstatSync(pathname);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
function resolveCustomStoreSqlitePath(params) {
	const unsuffixedPath = path.resolve(params.unsuffixedPath);
	const sqliteBaseName = path.basename(unsuffixedPath, ".sqlite");
	const sessionsDir = path.dirname(unsuffixedPath);
	const defaultAgentId = normalizeAgentId(params.options.defaultAgentId ?? "main");
	const agentId = normalizeAgentId(params.options.agentId ?? defaultAgentId);
	const registeredDatabases = readSessionStoreRegistryRows(params.options.registeredDatabases, params.options.env);
	const isSameDatabasePath = params.options.isSameDatabasePath ?? createOpenClawAgentDatabasePathMatcher();
	const resolvePersistedOwner = (candidatePath) => {
		const registeredOwners = resolveRegisteredOwners(candidatePath, registeredDatabases, isSameDatabasePath);
		let databaseOwner;
		if (registeredOwners.length === 1) hasFilesystemEntry(candidatePath);
		else databaseOwner = resolveDatabaseOwner(candidatePath, params.options.readCandidates);
		return {
			effectiveOwner: registeredOwners.length === 1 ? registeredOwners[0] : registeredOwners.length === 0 ? databaseOwner : void 0,
			registeredOwners
		};
	};
	const { registeredOwners: registeredUnsuffixedOwners, effectiveOwner: persistedUnsuffixedOwner } = resolvePersistedOwner(unsuffixedPath);
	const suffixedPathFor = (ownerAgentId) => path.join(sessionsDir, `${sqliteBaseName}.${ownerAgentId}.sqlite`);
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
			if (error.code !== "ENOENT") throw error;
		}
		const candidatePathAt = (index) => index === 1 ? suffixedPathFor(ownerAgentId) : path.join(sessionsDir, `${prefix}.${index}.sqlite`);
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
			if (candidateOwner.registeredOwners.length === 0 && !hasFilesystemEntry(candidatePath)) return {
				owned: false,
				path: candidatePath
			};
		}
	};
	const defaultSuffixedTarget = resolveSuffixedTarget(defaultAgentId);
	const agentSuffixedTarget = agentId === defaultAgentId ? defaultSuffixedTarget : resolveSuffixedTarget(agentId);
	const defaultOwnsSuffixedPath = defaultSuffixedTarget.owned;
	const agentOwnsSuffixedPath = agentSuffixedTarget.owned;
	const unsuffixedAvailable = registeredUnsuffixedOwners.length === 0 && !hasFilesystemEntry(unsuffixedPath);
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
/** Resolves only the legacy unsuffixed target, without reading ownership state. */
function resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath) {
	const resolved = path.resolve(storePath);
	if (path.basename(resolved) === "openclaw-agent.sqlite" || resolved.endsWith(".sqlite")) {
		const agentId = resolveAgentIdFromSqliteDatabasePath(resolved);
		return {
			path: resolved,
			...agentId ? { agentId } : {}
		};
	}
	const sessionsDir = path.dirname(resolved);
	if (path.basename(resolved) !== "sessions.json") {
		const sqliteBaseName = path.basename(resolved, path.extname(resolved)) || "openclaw-agent";
		return { path: path.join(sessionsDir, `${sqliteBaseName}.sqlite`) };
	}
	if (path.basename(sessionsDir) !== "sessions") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	const agentDir = path.dirname(sessionsDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	return {
		agentId: normalizeAgentId(path.basename(agentDir)),
		path: path.join(agentDir, "agent", "openclaw-agent.sqlite")
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
	if (path.resolve(storePath).endsWith(".sqlite")) {
		const registeredDatabases = readSessionStoreRegistryRows(options.registeredDatabases, options.env);
		const registeredOwners = resolveRegisteredOwners(unsuffixedTarget.path, registeredDatabases, options.isSameDatabasePath ?? createOpenClawAgentDatabasePathMatcher());
		let databaseOwner;
		if (registeredOwners.length === 1) hasFilesystemEntry(unsuffixedTarget.path);
		else databaseOwner = resolveDatabaseOwner(unsuffixedTarget.path, options.readCandidates);
		const configuredDefaultAgentId = normalizeAgentId(options.defaultAgentId ?? "main");
		const ownerAgentId = (registeredOwners.length === 1 ? registeredOwners[0] : void 0) ?? databaseOwner ?? configuredDefaultAgentId;
		return {
			...ownerAgentId ? { agentId: ownerAgentId } : {},
			path: unsuffixedTarget.path,
			shared: true,
			...registeredOwners.length === 1 ? { ownerSource: "database-registry" } : databaseOwner ? { ownerSource: "database-path" } : registeredOwners.length > 1 ? { ownerSource: "ambiguous-registry" } : { ownerSource: "configured-default" }
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
/** List inspection candidates without opening stores or assigning writable ownership. */
function listSqliteTargetCandidatePathsForSessionStorePath(storePath) {
	const unsuffixedTarget = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	if (unsuffixedTarget.agentId || path.resolve(storePath).endsWith(".sqlite")) return [unsuffixedTarget.path];
	const directory = path.dirname(unsuffixedTarget.path);
	const baseName = path.basename(unsuffixedTarget.path, ".sqlite");
	const candidateNames = /* @__PURE__ */ new Set([path.basename(unsuffixedTarget.path)]);
	try {
		for (const fileName of readdirSync(directory)) {
			const databaseName = fileName.replace(/-(?:wal|shm|journal)$/u, "");
			if (databaseName.startsWith(`${baseName}.`) && databaseName.endsWith(".sqlite")) candidateNames.add(databaseName);
		}
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	return [...candidateNames].map((fileName) => path.join(directory, fileName));
}
/** Lists the logical store's unsuffixed target plus durable owned partitions. */
function listDurableSqliteTargetPathsForSessionStorePath(storePath) {
	return listSqliteTargetCandidatePathsForSessionStorePath(storePath).filter((candidatePath, index) => index === 0 || resolveDatabaseOwner(candidatePath) !== void 0);
}
/** Extracts the agent id from the canonical per-agent SQLite database path. */
function resolveAgentIdFromSqliteDatabasePath(databasePath) {
	if (path.basename(databasePath) !== "openclaw-agent.sqlite") return;
	const agentDbDir = path.dirname(databasePath);
	if (path.basename(agentDbDir) !== "agent") return;
	const agentDir = path.dirname(agentDbDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return;
	return normalizeAgentId(path.basename(agentDir));
}
//#endregion
export { prepareSqliteTargetFromSessionStorePath as a, resolveUnsuffixedSqliteTargetFromSessionStorePath as c, measureSessionStoreTargetInventoryInputBytes as d, resolveCapturedSessionStorePath as f, listSqliteTargetCandidatePathsForSessionStorePath as i, assertSessionStoreReadCandidate as l, listDurableSqliteTargetOwnersForSessionStorePath as n, readSessionStoreRegistryRows as o, listDurableSqliteTargetPathsForSessionStorePath as r, resolveSqliteTargetFromSessionStorePath as s, SessionStoreRegistryReadRequired as t, captureSessionStoreReadCandidate as u };
