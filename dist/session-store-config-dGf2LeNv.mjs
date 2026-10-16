import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { i as tryResolvePathCaseInsensitive } from "./path-case-BjTaHmBw.mjs";
import fs from "node:fs";
import path from "node:path";
import { resolvePathPrefixSync, sameFileIdentity } from "@openclaw/fs-safe/advanced";
//#region src/config/sessions/session-store-config.ts
function resolveMissingStorePathIdentity(pathname) {
	try {
		const prefix = resolvePathPrefixSync(path.resolve(pathname));
		return path.resolve(prefix.existingPath, ...prefix.unresolvedSegments);
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
	const sourceCaseInsensitive = tryResolvePathCaseInsensitive(sourceIdentity);
	const targetCaseInsensitive = tryResolvePathCaseInsensitive(targetIdentity);
	return sourceCaseInsensitive !== false && targetCaseInsensitive !== false;
}
//#endregion
export { isSameSessionStoreConfig as i, isSameAuthoredSessionStoreConfig as n, isSameFixedSessionStoreConfig as r, isPerAgentSessionStoreConfig as t };
