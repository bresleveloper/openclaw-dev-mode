import { L as resolveIdentityPathViaExistingAncestorSync } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { J as isIncognitoOpenClawAgentSqlitePath, et as normalizeAgentId, q as createOpenClawAgentDatabasePathMatcher } from "./sqlite-readonly-sqlite-snapshot-staging-owner-DzwQ_rDP.mjs";
import { G as listOpenClawRegisteredAgentDatabases, _t as parseSqliteTargetSuffixIndex, bt as tryResolveLegacyDataOwnerAgentId, gt as listSqliteTargetCandidatePathsForSessionStorePath, ht as resolveSessionStorePathCore, ot as readRegisteredAgentDatabaseRows, u as inspectOpenClawAgentDatabaseOwner, vt as resolveUnsuffixedSqliteTargetFromSessionStorePath, xt as listAgentIds } from "./sqlite-readonly-openclaw-agent-db-DnbjFHbu.mjs";
import { E as matchesAgentDatabaseReadCandidatePath } from "./sqlite-readonly-worker-task-pool-CUbFmrb9.mjs";
import { dn as inspectDatabasePathIdentitySync, gn as readDatabasePathIdentitySync } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import "./sqlite-readonly-openclaw-state-db-cache-CRy98JJU.mjs";
import path from "node:path";
import fs, { lstatSync, readdirSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/legacy.default-agent-owner.ts
function resolveSessionStoreCompatibilityAgentId(config) {
	const persistedAgentId = config.agents?.defaults?.sessionStore?.agentId?.trim();
	return persistedAgentId ? normalizeAgentId(persistedAgentId) : tryResolveLegacyDataOwnerAgentId(config) ?? "main";
}
//#endregion
//#region src/config/sessions/session-store-read-candidates.ts
/** Families follow their directory; existing file aliases get separate exact captures. */
function captureSessionStoreReadCandidate(pathname, scope) {
	const capturedPath = path.resolve(pathname);
	return {
		path: capturedPath,
		physicalPath: scope ? path.join(resolveIdentityPathViaExistingAncestorSync(path.dirname(capturedPath)), path.basename(capturedPath)) : resolveIdentityPathViaExistingAncestorSync(capturedPath),
		...scope ? { scope } : {}
	};
}
/** Re-resolve both sides so aliases that converge after file creation remain in custody. */
function isSessionStoreReadCandidateCurrent(candidate) {
	const currentPhysicalPath = captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath;
	const capturedPhysicalPath = resolveCapturedSessionStoreReadCandidatePhysicalPath(candidate);
	if (currentPhysicalPath === capturedPhysicalPath) return true;
	if (candidate.scope || !isSymlinkFreeWindowsShortPath(candidate.path) && !isSymlinkFreeWindowsShortPath(candidate.physicalPath)) return false;
	return matchesWindowsFileAlias(currentPhysicalPath, capturedPhysicalPath);
}
function resolveCapturedSessionStoreReadCandidatePhysicalPath(candidate) {
	if (candidate.scope || !isSymlinkFreeWindowsShortPath(candidate.physicalPath)) return candidate.physicalPath;
	return resolveIdentityPathViaExistingAncestorSync(candidate.physicalPath);
}
function isSymlinkFreeWindowsShortPath(pathname) {
	if (process.platform !== "win32" || !/(?:^|[\\/])[^\\/]*~\d+(?=[\\/]|$)/iu.test(pathname)) return false;
	return isSymlinkFreePath(pathname);
}
function isSymlinkFreePath(pathname) {
	const resolved = path.resolve(pathname);
	const parsed = path.parse(resolved);
	let cursor = parsed.root;
	for (const segment of resolved.slice(parsed.root.length).split(path.sep)) {
		cursor = path.join(cursor, segment);
		const stat = fs.lstatSync(cursor, { throwIfNoEntry: false });
		if (!stat || stat.isSymbolicLink()) return false;
	}
	return true;
}
function matchesWindowsFileAlias(capturedPath, selectedPath) {
	const shortPath = isSymlinkFreeWindowsShortPath(capturedPath) ? capturedPath : isSymlinkFreeWindowsShortPath(selectedPath) ? selectedPath : void 0;
	if (process.platform !== "win32" || !shortPath || !isSymlinkFreePath(capturedPath) || !isSymlinkFreePath(selectedPath)) return false;
	const capturedParent = fs.statSync(path.dirname(capturedPath), { bigint: true });
	const selectedParent = fs.statSync(path.dirname(selectedPath), { bigint: true });
	if (capturedParent.dev !== selectedParent.dev || capturedParent.ino !== selectedParent.ino) return false;
	const capturedIdentity = inspectDatabasePathIdentitySync(capturedPath);
	const selectedIdentity = inspectDatabasePathIdentitySync(selectedPath);
	return capturedIdentity?.key.startsWith("file:") === true && capturedIdentity.key === selectedIdentity?.key && capturedIdentity.birthtime === selectedIdentity.birthtime;
}
/** Native discovery may use only the captured lexical and physical family together. */
function assertSessionStoreReadCandidate(pathname, candidates) {
	const physicalPath = resolveIdentityPathViaExistingAncestorSync(pathname);
	for (const candidate of candidates) {
		const matchesCapturedPhysicalPath = !candidate.scope && physicalPath === resolveCapturedSessionStoreReadCandidatePhysicalPath(candidate);
		if ((matchesAgentDatabaseReadCandidatePath(candidate, pathname) || matchesCapturedPhysicalPath || !candidate.scope && matchesWindowsFileAlias(candidate.path, pathname)) && (!candidate.scope || matchesAgentDatabaseReadCandidatePath({
			...candidate,
			path: resolveCapturedSessionStoreReadCandidatePhysicalPath(candidate)
		}, physicalPath)) && isSessionStoreReadCandidateCurrent(candidate)) return physicalPath;
	}
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
//#endregion
//#region src/agents/agent-delete-session-store-safety.targets.ts
function captureCandidates(stores) {
	return [...new Set(stores.flatMap((store) => listSqliteTargetCandidatePathsForSessionStorePath(store)))].toSorted().map((pathname) => ({
		path: pathname,
		identity: readDatabasePathIdentitySync(pathname)
	}));
}
function assertAgentSessionStoreDeletionTargetsCurrent(targets) {
	if (!isDeepStrictEqual(captureCandidates(targets.stores), targets.candidates)) throw new Error("Agent session database changed during deletion planning.");
}
//#endregion
//#region src/agents/agent-delete-session-store-safety.kernel.ts
/** The caller owns the current shared-state read or write transaction. */
function findAgentSessionStoreDeletionBlocker(database, cfg, agentId, env, targets) {
	if (!cfg.session?.store?.trim()) return;
	const id = normalizeAgentId(agentId);
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	if (targets) assertAgentSessionStoreDeletionTargetsCurrent(targets);
	const registeredDatabases = database ? readRegisteredAgentDatabaseRows(database.db, database.path, false) : [];
	for (const survivorId of listAgentIds(cfg)) {
		if (normalizeAgentId(survivorId) === id) continue;
		const target = resolveSqliteTargetFromSessionStorePath(resolveSessionStorePathCore(cfg.session.store, {
			agentId: survivorId,
			env
		}), {
			agentId: survivorId,
			defaultAgentId,
			env,
			registeredDatabases
		});
		const owner = inspectOpenClawAgentDatabaseOwner(target.path);
		if (owner.status === "owned" && owner.agentId === id) {
			if (targets) assertAgentSessionStoreDeletionTargetsCurrent(targets);
			return survivorId;
		}
	}
	if (targets) assertAgentSessionStoreDeletionTargetsCurrent(targets);
}
const agentDeletionSessionStoreAbsentReadOperations = { "agentRetirement.sessionStoreBlocker": (input) => ({ blocker: findAgentSessionStoreDeletionBlocker(void 0, input.config, input.agentId, input.env, input.targets) }) };
//#endregion
export { agentDeletionSessionStoreAbsentReadOperations };
