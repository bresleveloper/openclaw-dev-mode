import { kt as inspectDatabasePathIdentitySync } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { W as resolveIdentityPathViaExistingAncestorSync } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { dt as isIncognitoOpenClawAgentSqlitePath, ut as createOpenClawAgentDatabasePathMatcher } from "./openclaw-state-read-sqlite-snapshot-staging-owner-DeVv_bRV.mjs";
import { S as matchesAgentDatabaseReadCandidatePath } from "./openclaw-state-read-worker-task-pool-CsV_Xz7_.mjs";
import "./openclaw-state-read-openclaw-state-db-cache-CpHXuPkl.mjs";
import "./openclaw-state-read-openclaw-agent-db-DfYCfWYI.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
import { c as inspectOpenClawAgentDatabaseOwner } from "./openclaw-state-read-openclaw-agent-write-admission-D5Qp4bnz.mjs";
import { A as resolveUnsuffixedSqliteTargetFromSessionStorePath, D as resolveSessionStorePathCore, I as tryResolveLegacyDataOwnerAgentId, k as parseSqliteTargetSuffixIndex } from "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "./openclaw-state-read-session-key-CJdIm256.mjs";
import { m as listOpenClawRegisteredAgentDatabases } from "./openclaw-state-read-agent-deletion-journal-kOb8UH8S.mjs";
import fs, { lstatSync, readdirSync } from "node:fs";
import path from "node:path";
//#region src/config/legacy.default-agent-owner.ts
function resolveSessionStoreCompatibilityAgentId(config) {
	const persistedAgentId = config.agents?.defaults?.sessionStore?.agentId?.trim();
	return persistedAgentId ? normalizeAgentId(persistedAgentId) : tryResolveLegacyDataOwnerAgentId(config) ?? "main";
}
//#endregion
//#region src/config/sessions/session-store-read-candidates.ts
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
export { resolveSessionStoreCompatibilityAgentId as i, resolveSqliteTargetFromSessionStorePath as n, resolveCapturedSessionStorePath as r, readSessionStoreRegistryRows as t };
