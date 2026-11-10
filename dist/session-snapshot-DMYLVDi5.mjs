import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as normalizeWorkspaceSkillRoots } from "./workspace-skill-roots-CL28VeX5.mjs";
import { i as getSkillsSourceVersion, l as shouldRefreshSnapshotForVersion, r as getSkillsSnapshotVersion } from "./refresh-state-DoFid57J.mjs";
import { i as matchesSkillFilter } from "./agent-filter-B-HgchuV.mjs";
import { n as prepareRemoteSkillConnections } from "./remote-skills-oCdwUx69.mjs";
import { n as compactPromptSkills } from "./local-loader-DuDhVnOL.mjs";
import { n as resolveSkillReadPath, t as isWorkspaceSkillReadPath } from "./workspace-skill-read-path-Jvbv8xxW.mjs";
import { t as parseSkillsPromptCatalog } from "./skill-prompt-catalog-DEexSe76.mjs";
import { r as ensureSkillsWatcher } from "./refresh-CFj73Q4x.mjs";
import { t as fingerprintSkillSnapshotConfig } from "./snapshot-config-fingerprint-YDKQvmyT.mjs";
import { t as buildSkillSnapshot } from "./workspace-skill-prompt-BmEdTiat.mjs";
import { t as recordSkillRootsExecutionFileHost } from "./skill-snapshot-provenance-WWSTTtxq.mjs";
import { isDeepStrictEqual } from "node:util";
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
	if (params.watch !== false) await ensureSkillsWatcher({
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
	const nodeSkillsEligibilityChanged = !isDeepStrictEqual(params.existingSnapshot?.nodeSkillsEligibility, eligibility?.nodeSkills);
	const skillOverridesChanged = !isDeepStrictEqual(params.existingSnapshot?.skillOverrides, params.skillOverrides);
	const skillRootsChanged = !isDeepStrictEqual(params.existingSnapshot?.skillRoots, skillRoots);
	const librarySelections = params.librarySelections ?? params.existingSnapshot?.librarySelections;
	const shouldRefresh = !isDeepStrictEqual(librarySelections, params.existingSnapshot?.librarySelections) || promptFormatChanged || skillVersionChanged || nodeSkillsEligibilityChanged || skillRootsChanged || !matchesSkillFilter(params.existingSnapshot?.skillFilter, params.skillFilter) || skillOverridesChanged;
	if (params.existingSnapshot && !shouldRefresh && (params.hydrateExisting === false || params.existingSnapshot.resolvedSkills !== void 0)) return {
		snapshot: params.existingSnapshot,
		shouldRefresh,
		snapshotVersion
	};
	const sourceScope = {
		executionWorkspaceDir: normalizedRoots.executionWorkspaceDir,
		executionWorkspaceFileHost: normalizedRoots.executionWorkspaceFileHost
	};
	const retainedSnapshot = shouldRefresh ? void 0 : params.existingSnapshot;
	const catalog = parseSkillsPromptCatalog(retainedSnapshot?.prompt ?? "");
	const matchesSnapshotSkill = (skill) => !retainedSnapshot || retainedSnapshot.skills.some((saved) => {
		if (saved.name !== skill.name) return false;
		const source = saved.source ?? (saved.gatewayFilePath ? {
			filePath: saved.gatewayFilePath,
			fileHost: "gateway"
		} : void 0);
		if (source) return source.filePath === skill.filePath && source.fileHost === skill.fileHost;
		const location = resolveSkillReadPath(compactPromptSkills([skill], params)[0]);
		return skill.fileHost === void 0 && !isWorkspaceSkillReadPath(location) && catalog.some((entry) => entry.name === saved.name && entry.location === location);
	});
	const sourceVersion = getSkillsSourceVersion(watcherWorkspaceDir, sourceScope);
	const effectiveVersion = getSkillsSnapshotVersion(watcherWorkspaceDir);
	const canExec = eligibility?.nodeSkills?.canExec;
	const node = eligibility?.nodeSkills?.node;
	const platforms = eligibility?.remote?.platforms.slice();
	const note = eligibility?.remote?.note;
	const projectionIsCurrent = () => {
		if (getSkillsSourceVersion(watcherWorkspaceDir, sourceScope) !== sourceVersion || getSkillsSnapshotVersion(watcherWorkspaceDir) !== effectiveVersion) return false;
		const current = params.resolveEligibility?.() ?? params.eligibility;
		return current?.nodeSkills?.canExec === canExec && current?.nodeSkills?.node === node && current?.remote?.note === note && isDeepStrictEqual(current?.remote?.platforms, platforms);
	};
	const buildSnapshot = async (assertCurrent) => {
		return {
			...await buildSkillSnapshot(normalizedRoots.agentWorkspaceDir, {
				executionWorkspaceDir: normalizedRoots.executionWorkspaceDir,
				executionWorkspaceFileHost: normalizedRoots.executionWorkspaceFileHost,
				librarySelections,
				config: params.config,
				watch: params.watch,
				preserveEntryOrder: Boolean(skillRoots),
				agentId: params.agentId,
				skillFilter: params.skillFilter,
				skillOverrides: params.skillOverrides,
				eligibility,
				assertCurrent,
				pluginMetadataSnapshot: params.pluginMetadataSnapshot,
				snapshotVersion,
				matchesSnapshotSkill: retainedSnapshot ? matchesSnapshotSkill : void 0
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
			fingerprintSkillSnapshotConfig(params.config),
			retainedSnapshot?.skills,
			catalog
		]);
		const cachedSnapshot = skillSnapshotCache.get(snapshotCacheKey);
		if (cachedSnapshot && retainedSnapshot) return cachedSnapshot;
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
	let snapshot = rebuilt;
	if (rebuilt && retainedSnapshot) {
		const discoverySkills = (rebuilt.discoverySkills ?? rebuilt.resolvedSkills ?? []).filter(matchesSnapshotSkill);
		snapshot = {
			...retainedSnapshot,
			resolvedSkills: catalog.flatMap(({ name }) => discoverySkills.filter((skill) => skill.name === name)),
			discoverySkills
		};
	}
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
