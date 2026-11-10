import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { f as readDatabasePathIdentitySync, o as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import fs from "node:fs";
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
/** Capture exact candidates before discovery yields; sibling families have no file identity. */
function captureSessionStoreCandidateIdentities(candidates) {
	return new Map(candidates.filter((candidate) => !candidate.scope).map((candidate) => {
		const identity = readDatabasePathIdentitySync(candidate.path);
		return [identity.canonicalPath, identity];
	}));
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
/** Unlisted siblings inherit absence only from a complete inventory of the original physical family. */
function qualifyAbsentSessionStoreReadCandidate(pathname, captured) {
	const physicalPath = assertSessionStoreReadCandidate(pathname, captured.candidates);
	const family = captured.candidates.find((candidate) => candidate.scope === "sibling-family" && matchesAgentDatabaseReadCandidatePath(candidate, pathname) && matchesAgentDatabaseReadCandidatePath({
		...candidate,
		path: candidate.physicalPath
	}, physicalPath));
	if (captured.candidates.some((candidate) => !candidate.scope && (matchesAgentDatabaseReadCandidatePath(candidate, pathname) || matchesAgentDatabaseReadCandidatePath({
		...candidate,
		path: candidate.physicalPath
	}, physicalPath))) || !captured.familyListingComplete || !family || !isSessionStoreReadCandidateCurrent(family)) throw new Error("Session database absence was not captured before discovery");
	const identity = readDatabasePathIdentitySync(pathname);
	if (identity.key.startsWith("file:") || identity.canonicalPath !== physicalPath) throw new Error("Session database appeared after its initial inventory");
	return identity;
}
//#endregion
export { measureSessionStoreTargetInventoryInputBytes as a, isSessionStoreReadCandidateCurrent as i, captureSessionStoreCandidateIdentities as n, qualifyAbsentSessionStoreReadCandidate as o, captureSessionStoreReadCandidate as r, resolveCapturedSessionStorePath as s, assertSessionStoreReadCandidate as t };
