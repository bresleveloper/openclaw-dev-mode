import { r as matchesSkillFilter } from "./agent-filter-z-I3bijt.js";
import { t as stableStringify } from "./stable-stringify-Cd9_EGsU.js";
import { r as getSkillsSnapshotVersion, s as shouldRefreshSnapshotForVersion } from "./refresh-state-DHnXO3IV.js";
import { t as buildWorkspaceSkillSnapshot } from "./workspace-BKXau6p-.js";
import { n as redactConfigObject } from "./redact-snapshot-BBZWgUzP.js";
import { t as ensureSkillsWatcher } from "./refresh-D82wsl2H.js";
import crypto from "node:crypto";
//#region src/skills/runtime/snapshot-hydration.ts
function hydrateResolvedSkills(snapshot, rebuild) {
	if (snapshot.resolvedSkills !== void 0) return snapshot;
	return {
		...snapshot,
		resolvedSkills: rebuild().resolvedSkills
	};
}
//#endregion
//#region src/skills/runtime/session-snapshot.ts
const resolvedSkillsCache = /* @__PURE__ */ new Map();
const RESOLVED_SKILLS_CACHE_MAX = 10;
function resetResolvedSkillsCacheForTests() {
	resolvedSkillsCache.clear();
}
function fingerprintSkillSnapshotConfig(config) {
	return crypto.createHash("sha256").update(stableStringify(redactConfigObject(config))).digest("hex");
}
function cacheResolvedSkills(cacheKey, snapshot) {
	resolvedSkillsCache.set(cacheKey, snapshot.resolvedSkills);
	if (resolvedSkillsCache.size > RESOLVED_SKILLS_CACHE_MAX) {
		const oldest = resolvedSkillsCache.keys().next().value;
		if (oldest !== void 0) resolvedSkillsCache.delete(oldest);
	}
	return snapshot;
}
function resolveReusableWorkspaceSkillSnapshot(params) {
	if (params.watch !== false) ensureSkillsWatcher({
		workspaceDir: params.workspaceDir,
		config: params.config
	});
	const snapshotVersion = params.snapshotVersion ?? getSkillsSnapshotVersion(params.workspaceDir);
	const promptFormatChanged = params.existingSnapshot?.promptFormatVersion !== 1;
	const skillVersionChanged = shouldRefreshSnapshotForVersion(params.existingSnapshot?.version, snapshotVersion);
	const shouldRefresh = promptFormatChanged || skillVersionChanged || !matchesSkillFilter(params.existingSnapshot?.skillFilter, params.skillFilter);
	const buildSnapshot = () => {
		return buildWorkspaceSkillSnapshot(params.workspaceDir, {
			config: params.config,
			agentId: params.agentId,
			skillFilter: params.skillFilter,
			eligibility: params.eligibility,
			snapshotVersion
		});
	};
	const configFingerprint = fingerprintSkillSnapshotConfig(params.config);
	const snapshotCacheKey = JSON.stringify([
		params.workspaceDir,
		snapshotVersion,
		params.skillFilter,
		params.agentId,
		params.eligibility,
		configFingerprint
	]);
	const cachedRebuild = () => {
		if (resolvedSkillsCache.has(snapshotCacheKey)) return { resolvedSkills: resolvedSkillsCache.get(snapshotCacheKey) };
		return cacheResolvedSkills(snapshotCacheKey, buildSnapshot());
	};
	return {
		snapshot: !params.existingSnapshot || shouldRefresh ? cacheResolvedSkills(snapshotCacheKey, buildSnapshot()) : params.hydrateExisting === false ? params.existingSnapshot : hydrateResolvedSkills(params.existingSnapshot, cachedRebuild),
		shouldRefresh,
		snapshotVersion
	};
}
//#endregion
export { resolveReusableWorkspaceSkillSnapshot as n, resetResolvedSkillsCacheForTests as t };
