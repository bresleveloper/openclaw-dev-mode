import { t as normalizeWorkspaceSkillRoots } from "./workspace-skill-roots-CL28VeX5.mjs";
import { i as getSkillsSourceVersion } from "./refresh-state-DoFid57J.mjs";
import { i as resolveSkillRuntimeConfig } from "./env-overrides-BfZsWBmC.mjs";
import { a as prepareSkillLibrarySelection, n as captureSkillLibraryPreparation } from "./selection-B3qUGv_G.mjs";
import { i as resolveSandboxSkillRuntimeInputs, t as mapSandboxSkillEntriesForPrompt } from "./sandbox-skills-DF-8lllB.mjs";
import { i as prepareWorkspaceSkills } from "./workspace-skill-loader-B_yVTg_A.mjs";
import { n as resolveSkillsPrompt } from "./workspace-skill-prompt-BmEdTiat.mjs";
import { n as resolveSkillSnapshotExecutionFileHost } from "./skill-snapshot-provenance-WWSTTtxq.mjs";
//#region src/skills/runtime/embedded-run-entries.ts
async function resolveEmbeddedRunSkillEntries(params) {
	const shouldLoadSkillEntries = !params.skillsSnapshot || Boolean(params.skillsSnapshot.prompt.trim()) && !params.skillsSnapshot.resolvedSkills;
	const config = resolveSkillRuntimeConfig(params.config);
	const persistedRoots = params.skillsSnapshot?.promptFormatVersion === 8 ? params.skillsSnapshot.skillRoots : void 0;
	const skillRoots = normalizeWorkspaceSkillRoots(params.workspaceOnly === true ? { agentWorkspaceDir: params.workspaceDir } : {
		agentWorkspaceDir: persistedRoots?.agentWorkspaceDir ?? params.workspaceDir,
		executionWorkspaceDir: persistedRoots?.executionWorkspaceDir ?? params.executionWorkspaceDir,
		executionWorkspaceFileHost: params.executionWorkspaceFileHost ?? resolveSkillSnapshotExecutionFileHost(params.skillsSnapshot)
	});
	let cachedSkillEntries;
	const loadSkillEntries = async () => {
		if (cachedSkillEntries) return cachedSkillEntries;
		params.assertCurrent?.();
		const preparation = captureSkillLibraryPreparation(params.workspaceOnly === true ? [] : params.skillsSnapshot?.librarySelections ?? [], () => params.assertCurrent?.());
		const options = {
			config,
			agentId: params.agentId,
			executionWorkspaceDir: skillRoots.executionWorkspaceDir,
			executionWorkspaceFileHost: skillRoots.executionWorkspaceFileHost,
			...params.eligibility ? { eligibility: params.eligibility } : {},
			...params.skillsSnapshot?.skillFilter ? { skillFilter: params.skillsSnapshot.skillFilter } : {},
			...params.skillsSnapshot?.skillOverrides ? { skillOverrides: params.skillsSnapshot.skillOverrides } : {},
			...params.workspaceOnly === true ? { workspaceOnly: true } : {}
		};
		for (;;) {
			preparation.assertCurrent();
			const sourceVersion = getSkillsSourceVersion(skillRoots.agentWorkspaceDir, options);
			const workspaceEntries = await prepareWorkspaceSkills(skillRoots.agentWorkspaceDir, options, params.assertCurrent);
			preparation.assertCurrent();
			const libraryEntries = preparation.libraryContext ? await prepareSkillLibrarySelection(preparation.librarySelections, { env: preparation.libraryContext.environment }, preparation.assertCurrent) : void 0;
			preparation.assertCurrent();
			if (cachedSkillEntries) return cachedSkillEntries;
			if (getSkillsSourceVersion(skillRoots.agentWorkspaceDir, options) !== sourceVersion) continue;
			cachedSkillEntries = libraryEntries ? [...workspaceEntries, ...libraryEntries] : workspaceEntries;
			return cachedSkillEntries;
		}
	};
	return {
		shouldLoadSkillEntries,
		skillEntries: shouldLoadSkillEntries ? await loadSkillEntries() : [],
		loadSkillEntries,
		preserveEntryOrder: skillRoots.executionWorkspaceDir !== void 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/skills-prompt.ts
async function prepareRuntimeSkillEntries(params) {
	const inputs = resolveSandboxSkillRuntimeInputs(params);
	const preparedEntries = await resolveEmbeddedRunSkillEntries({
		assertCurrent: params.assertCurrent,
		workspaceDir: inputs.skillsWorkspaceDir,
		...params.sandbox?.enabled === true ? {} : {
			executionWorkspaceDir: params.executionWorkspaceDir,
			executionWorkspaceFileHost: params.executionWorkspaceFileHost
		},
		config: params.config,
		agentId: params.agentId,
		eligibility: inputs.skillsEligibility,
		skillsSnapshot: inputs.skillsSnapshot,
		workspaceOnly: inputs.workspaceOnly
	});
	return {
		...inputs,
		...preparedEntries,
		mapEntries: (entries) => mapSandboxSkillEntriesForPrompt({
			entries,
			skillsWorkspaceDir: inputs.skillsWorkspaceDir,
			skillsPromptWorkspaceDir: inputs.skillsPromptWorkspaceDir
		})
	};
}
async function resolveRuntimeSkillsPrompt(params) {
	const prepared = await prepareRuntimeSkillEntries(params);
	const promptSkillEntries = prepared.mapEntries(prepared.shouldLoadSkillEntries ? prepared.skillEntries : void 0);
	return {
		...params.sandbox ? { usagePaths: prepared.skillUsagePaths } : {},
		prompt: await resolveSkillsPrompt({
			assertCurrent: params.assertCurrent,
			skillsSnapshot: prepared.skillsSnapshot,
			entries: promptSkillEntries,
			...params.sandbox ? {} : { loadEntries: prepared.loadSkillEntries },
			workspaceDir: prepared.skillsPromptWorkspaceDir,
			config: params.config,
			agentId: params.agentId,
			eligibility: prepared.skillsEligibility,
			preserveEntryOrder: prepared.preserveEntryOrder
		})
	};
}
//#endregion
export { resolveRuntimeSkillsPrompt as n, prepareRuntimeSkillEntries as t };
