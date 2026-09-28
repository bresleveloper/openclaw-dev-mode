import { a as probePathCaseInsensitiveSync, d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import "./path-case-CAaiJQol.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/session-store-config.ts
const MAX_SYMLINK_HOPS = 64;
function splitPathSegments(value) {
	return value.split(path.sep).filter(Boolean);
}
function resolveMissingStorePathIdentity(pathname) {
	const absolutePath = path.resolve(pathname);
	let resolvedPath = path.parse(absolutePath).root;
	const remaining = splitPathSegments(absolutePath.slice(resolvedPath.length));
	const visitedLinks = /* @__PURE__ */ new Set();
	let symlinkHops = 0;
	while (remaining.length > 0) {
		const segment = remaining.shift();
		if (!segment || segment === ".") continue;
		if (segment === "..") {
			resolvedPath = path.dirname(resolvedPath);
			continue;
		}
		const candidate = path.join(resolvedPath, segment);
		let stat;
		try {
			stat = fs.lstatSync(candidate);
		} catch (error) {
			if (error.code !== "ENOENT") return;
			try {
				const canonicalAncestor = fs.realpathSync.native(resolvedPath);
				return path.resolve(canonicalAncestor, segment, ...remaining);
			} catch {
				return;
			}
		}
		if (!stat.isSymbolicLink()) {
			resolvedPath = candidate;
			continue;
		}
		const resolutionState = `${candidate}\0${remaining.join(path.sep)}`;
		if (symlinkHops >= MAX_SYMLINK_HOPS || visitedLinks.has(resolutionState)) return;
		visitedLinks.add(resolutionState);
		symlinkHops += 1;
		let target;
		try {
			target = fs.readlinkSync(candidate);
		} catch {
			return;
		}
		if (path.isAbsolute(target)) {
			resolvedPath = path.parse(target).root;
			remaining.unshift(...splitPathSegments(target.slice(resolvedPath.length)));
		} else remaining.unshift(...splitPathSegments(target));
	}
	try {
		return fs.realpathSync.native(resolvedPath);
	} catch {
		return;
	}
}
function isPerAgentSessionStoreConfig(storeConfig) {
	return !storeConfig?.trim() || storeConfig.includes("{agentId}");
}
function isSameAuthoredSessionStoreConfig(source, target) {
	return !source?.trim() && !target?.trim() || source === target;
}
function isSameSessionStoreConfig(source, target, env) {
	if (isPerAgentSessionStoreConfig(source) || isPerAgentSessionStoreConfig(target)) return isSameAuthoredSessionStoreConfig(source, target);
	return isSameFixedSessionStoreConfig(source, target, env);
}
function isSameFixedSessionStoreConfig(source, target, env) {
	if (isPerAgentSessionStoreConfig(source) || isPerAgentSessionStoreConfig(target)) return false;
	const sourcePath = path.resolve(resolveSessionStorePathCore(source, { env }));
	const targetPath = path.resolve(resolveSessionStorePathCore(target, { env }));
	if (sourcePath === targetPath) return true;
	try {
		return sameFileIdentity(fs.statSync(sourcePath, { bigint: true }), fs.statSync(targetPath, { bigint: true }));
	} catch (error) {
		const code = error.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return true;
	}
	const sourceIdentity = resolveMissingStorePathIdentity(sourcePath);
	const targetIdentity = resolveMissingStorePathIdentity(targetPath);
	if (!sourceIdentity || !targetIdentity) return true;
	if (sourceIdentity === targetIdentity) return true;
	if (sourceIdentity.toLowerCase() !== targetIdentity.toLowerCase()) return false;
	const sourceCaseInsensitive = probePathCaseInsensitiveSync(sourceIdentity);
	const targetCaseInsensitive = probePathCaseInsensitiveSync(targetIdentity);
	if (sourceCaseInsensitive === false || targetCaseInsensitive === false) return false;
	return true;
}
//#endregion
export { isSameSessionStoreConfig as i, isSameAuthoredSessionStoreConfig as n, isSameFixedSessionStoreConfig as r, isPerAgentSessionStoreConfig as t };
