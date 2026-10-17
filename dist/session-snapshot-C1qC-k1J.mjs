import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { i as matchesSkillFilter } from "./agent-filter-KIvrTe_y.mjs";
import { t as normalizeWorkspaceSkillRoots } from "./workspace-skill-roots-CL28VeX5.mjs";
import { d as shouldRefreshSnapshotForVersion, i as getSkillsSourceVersion, r as getSkillsSnapshotVersion } from "./refresh-state-CRa-OKC_.mjs";
import { c as fingerprintSkillSnapshotConfig } from "./workspace-skill-loader-CWlRhYtz.mjs";
import { n as prepareRemoteSkillConnections } from "./remote-skills-CVJsA9ab.mjs";
import { t as buildSkillSnapshot } from "./workspace-skill-prompt-CuoxtIGZ.mjs";
import { n as recordSkillRootsExecutionFileHost } from "./skill-snapshot-provenance-B47tYPIJ.mjs";
import { n as ensureSkillsWatcher } from "./refresh-BVT-jB_T.mjs";
//#region src/skills/runtime/session-snapshot.ts
const skillSnapshotCache = /* @__PURE__ */ new Map();
const pendingSkillSnapshots = /* @__PURE__ */ new Map();
const SKILL_SNAPSHOT_CACHE_MAX = 10;
async function resolveReusableWorkspaceSkillSnapshot(params) {
	params.assertCurrent?.();
	const normalizedRoots = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: params.workspaceDir,
		executionWorkspaceDir: params.executionWorkspaceDir,
		executionWorkspaceFileHost: params.executionWorkspaceFileHost
	});
	const skillRoots = normalizedRoots.executionWorkspaceDir ? recordSkillRootsExecutionFileHost({
		agentWorkspaceDir: normalizedRoots.agentWorkspaceDir,
		executionWorkspaceDir: normalizedRoots.executionWorkspaceDir
	}, normalizedRoots.executionWorkspaceFileHost) : void 0;
	const watcherWorkspaceDir = skillRoots?.agentWorkspaceDir ?? params.workspaceDir;
	const versionBeforePreparation = getSkillsSnapshotVersion(watcherWorkspaceDir);
	await prepareRemoteSkillConnections();
	params.assertCurrent?.();
	const requestedSnapshotVersion = getSkillsSnapshotVersion(watcherWorkspaceDir) === versionBeforePreparation ? params.snapshotVersion : void 0;
	const eligibility = params.resolveEligibility?.() ?? params.eligibility;
	if (params.watch !== false) ensureSkillsWatcher({
		workspaceDir: watcherWorkspaceDir,
		...skillRoots ? {
			executionWorkspaceDir: skillRoots.executionWorkspaceDir,
			executionWorkspaceFileHost: normalizedRoots.executionWorkspaceFileHost
		} : {},
		config: params.config,
		agentId: params.agentId,
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {}
	});
	const snapshotVersion = requestedSnapshotVersion ?? getSkillsSnapshotVersion(watcherWorkspaceDir);
	const promptFormatChanged = params.existingSnapshot?.promptFormatVersion !== 8;
	const skillVersionChanged = shouldRefreshSnapshotForVersion(params.existingSnapshot?.version, snapshotVersion);
	const nodeSkillsEligibilityChanged = stableStringify(params.existingSnapshot?.nodeSkillsEligibility) !== stableStringify(eligibility?.nodeSkills);
	const skillOverridesChanged = stableStringify(params.existingSnapshot?.skillOverrides) !== stableStringify(params.skillOverrides);
	const skillRootsChanged = stableStringify(params.existingSnapshot?.skillRoots) !== stableStringify(skillRoots);
	const librarySelections = params.librarySelections ?? params.existingSnapshot?.librarySelections;
	const shouldRefresh = stableStringify(librarySelections) !== stableStringify(params.existingSnapshot?.librarySelections) || promptFormatChanged || skillVersionChanged || nodeSkillsEligibilityChanged || skillRootsChanged || !matchesSkillFilter(params.existingSnapshot?.skillFilter, params.skillFilter) || skillOverridesChanged;
	if (params.existingSnapshot && !shouldRefresh && (params.hydrateExisting === false || params.existingSnapshot.resolvedSkills !== void 0)) return {
		snapshot: params.existingSnapshot,
		shouldRefresh,
		snapshotVersion
	};
	const sourceScope = {
		executionWorkspaceDir: normalizedRoots.executionWorkspaceDir,
		executionWorkspaceFileHost: normalizedRoots.executionWorkspaceFileHost
	};
	const sourceVersion = getSkillsSourceVersion(watcherWorkspaceDir, sourceScope);
	const effectiveVersion = getSkillsSnapshotVersion(watcherWorkspaceDir);
	const eligibilityKey = stableStringify(eligibility);
	const projectionIsCurrent = () => getSkillsSourceVersion(watcherWorkspaceDir, sourceScope) === sourceVersion && getSkillsSnapshotVersion(watcherWorkspaceDir) === effectiveVersion && stableStringify(params.resolveEligibility?.() ?? params.eligibility) === eligibilityKey;
	const buildSnapshot = async (assertCurrent) => {
		return {
			...await buildSkillSnapshot(normalizedRoots.agentWorkspaceDir, {
				executionWorkspaceDir: normalizedRoots.executionWorkspaceDir,
				executionWorkspaceFileHost: normalizedRoots.executionWorkspaceFileHost,
				librarySelections,
				config: params.config,
				preserveEntryOrder: Boolean(skillRoots),
				agentId: params.agentId,
				skillFilter: params.skillFilter,
				skillOverrides: params.skillOverrides,
				eligibility,
				assertCurrent,
				pluginMetadataSnapshot: params.pluginMetadataSnapshot,
				snapshotVersion
			}),
			...skillRoots ? { skillRoots } : {},
			...librarySelections ? { librarySelections } : {}
		};
	};
	const cachedRebuild = async () => {
		const snapshotCacheKey = JSON.stringify([
			params.workspaceDir,
			librarySelections,
			skillRoots,
			snapshotVersion,
			params.skillFilter,
			params.skillOverrides,
			params.agentId,
			eligibility,
			fingerprintSkillSnapshotConfig(params.config)
		]);
		const cachedSnapshot = skillSnapshotCache.get(snapshotCacheKey);
		if (cachedSnapshot) return cachedSnapshot;
		const assertCurrent = () => params.assertCurrent?.();
		let pending = pendingSkillSnapshots.get(snapshotCacheKey);
		if (!pending) {
			const waiters = /* @__PURE__ */ new Set([assertCurrent]);
			const assertLiveWaiter = () => {
				let failure;
				for (const waiter of waiters) try {
					waiter();
				} catch (error) {
					waiters.delete(waiter);
					failure = error;
				}
				if (waiters.size === 0) throw failure;
			};
			pending = {
				promise: buildSnapshot(assertLiveWaiter).then((snapshot) => {
					assertLiveWaiter();
					if (!projectionIsCurrent()) return;
					skillSnapshotCache.set(snapshotCacheKey, snapshot);
					pruneMapToMaxSize(skillSnapshotCache, SKILL_SNAPSHOT_CACHE_MAX);
					return snapshot;
				}),
				waiters
			};
			pendingSkillSnapshots.set(snapshotCacheKey, pending);
		} else if (pending.waiters.size > 0) pending.waiters.add(assertCurrent);
		try {
			const snapshot = await pending.promise;
			assertCurrent();
			return snapshot;
		} catch (error) {
			assertCurrent();
			if (pending.waiters.size === 0) return;
			throw error;
		} finally {
			pending.waiters.delete(assertCurrent);
			if (pendingSkillSnapshots.get(snapshotCacheKey) === pending) pendingSkillSnapshots.delete(snapshotCacheKey);
		}
	};
	const rebuilt = await cachedRebuild();
	const snapshot = rebuilt && params.existingSnapshot && !shouldRefresh ? {
		...params.existingSnapshot,
		resolvedSkills: rebuilt.resolvedSkills,
		discoverySkills: rebuilt.discoverySkills
	} : rebuilt;
	if (!snapshot || !projectionIsCurrent()) {
		const currentVersion = getSkillsSnapshotVersion(watcherWorkspaceDir);
		return resolveReusableWorkspaceSkillSnapshot({
			...params,
			watch: false,
			snapshotVersion: currentVersion
		});
	}
	params.assertCurrent?.();
	return {
		snapshot,
		shouldRefresh,
		snapshotVersion
	};
}
//#endregion
export { resolveReusableWorkspaceSkillSnapshot as t };
