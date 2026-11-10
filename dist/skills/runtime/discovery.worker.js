import { k as withPluginCache, s as createPluginCache } from "../../plugin-cache-BbahpD-b.mjs";
import { u as pinConfigDir } from "../../utils-gjJ-tD2q.mjs";
import { n as sha256Hex } from "../../node-crypto-BG4u3UnX.mjs";
import "../../crypto-digest-y6oZN-_F.mjs";
import { r as resolveEffectiveAgentSkillsLimits } from "../../agent-filter-B-HgchuV.mjs";
import { r as resolveSkillKey } from "../../frontmatter-siV6LZij.mjs";
import { a as resolvePluginSkillRootsFromContributions, i as resolvePluginSkillRoots } from "../../plugin-skills-Du3r4DEy.mjs";
import { n as compactPromptSkills } from "../../local-loader-DuDhVnOL.mjs";
import { r as resolveSkillFileHost } from "../../skill-file-host-d_CtoZp0.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-sMsYUF1K.mjs";
import { t as readWorkspaceSkillStatusFacts } from "../../status-files-BYKSZPrI.mjs";
import { n as mergeSkillRecords, t as appendLowerPrecedenceSkillRecords } from "../../skill-precedence-aiuaCdaS.mjs";
import { t as isSkillPromptVisible } from "../../skill-index-C40nKKG1.mjs";
import { n as prepareSkillsForPrompt } from "../../skill-prompt-limits-BAc6uCwo.mjs";
import { t as readWorkspaceSkillSources } from "../../workspace-skill-source-reader-BgbdWH3d.mjs";
import { n as resolveWorkspaceSkillSourcePlan, r as splitSkillSourcePlan } from "../../workspace-skill-sources-BzN5yi4g.mjs";
//#region src/skills/loading/skill-snapshot-projection.ts
/** Render already selected entries without repeating discovery or eligibility checks. */
function buildSkillSnapshotProjection(input) {
	const { eligible, skillFilter } = input;
	const promptEntries = eligible.filter(isSkillPromptVisible);
	const remoteNote = input.eligibility?.remote?.note?.trim();
	const resolvedSkills = promptEntries.map((entry) => entry.skill);
	const limits = input.config?.skills?.limits;
	const agentLimits = resolveEffectiveAgentSkillsLimits(input.config, input.agentId);
	const prepared = prepareSkillsForPrompt({
		skills: compactPromptSkills(resolvedSkills, {
			config: input.config,
			agentId: input.agentId
		}),
		maxSkillsInPrompt: limits?.maxSkillsInPrompt,
		maxSkillsPromptChars: agentLimits?.maxSkillsPromptChars ?? limits?.maxSkillsPromptChars,
		remoteNote,
		preserveOrder: input.preserveEntryOrder
	});
	const byName = new Map(resolvedSkills.map((skill) => [skill.name, skill]));
	return {
		prompt: prepared.prompt,
		skills: eligible.map((entry) => ({
			name: entry.skill.name,
			source: {
				filePath: entry.skill.filePath,
				fileHost: resolveSkillFileHost(entry.skill)
			},
			gatewayFilePath: resolveSkillFileHost(entry.skill) === "gateway" ? entry.skill.filePath : void 0,
			skillKey: resolveSkillKey(entry),
			primaryEnv: entry.metadata?.primaryEnv,
			requiredEnv: entry.metadata?.requires?.env?.slice()
		})),
		...skillFilter === void 0 ? {} : { skillFilter },
		...input.skillOverrides ? { skillOverrides: input.skillOverrides } : {},
		...input.eligibility?.nodeSkills ? { nodeSkillsEligibility: input.eligibility.nodeSkills } : {},
		resolvedSkills: prepared.skills.map((skill) => byName.get(skill.name)),
		discoverySkills: resolvedSkills,
		version: input.snapshotVersion,
		promptFormatVersion: 8
	};
}
//#endregion
//#region src/skills/runtime/discovery.worker.ts
function applyEnvironment(environment) {
	for (const [key, value] of Object.entries(environment)) if (value === void 0) delete process.env[key];
	else process.env[key] = value;
	pinConfigDir();
}
function resolveInputPlan(input, cache = createPluginCache()) {
	return withPluginCache(cache, () => {
		const options = input.options;
		const pluginSkillRoots = options?.workspaceOnly ? [] : input.pluginContributions ? resolvePluginSkillRootsFromContributions({
			contributions: input.pluginContributions,
			pluginSkillsDir: options?.pluginSkillsDir
		}) : resolvePluginSkillRoots({
			workspaceDir: input.workspaceDir,
			config: options?.config,
			pluginSkillsDir: options?.pluginSkillsDir,
			acpRuntimeAvailable: input.acpRuntimeAvailable
		});
		return resolveWorkspaceSkillSourcePlan(input.workspaceDir, {
			...options,
			pluginSkillRoots
		});
	});
}
serveWorkerTasks((input, channel) => {
	const request = input;
	channel?.consumeInput();
	if (request.kind === "plan") {
		applyEnvironment(request.input.environment);
		return {
			kind: "plan",
			plan: resolveInputPlan(request.input)
		};
	}
	if (request.kind === "project") {
		applyEnvironment(request.environment);
		return {
			kind: "project",
			snapshot: buildSkillSnapshotProjection(request.input)
		};
	}
	if (request.kind === "status") {
		applyEnvironment(request.environment);
		return {
			kind: "status",
			facts: readWorkspaceSkillStatusFacts(request.input)
		};
	}
	if (request.path === void 0) delete process.env.PATH;
	else process.env.PATH = request.path;
	const pluginCache = createPluginCache();
	const sourceReads = /* @__PURE__ */ new Map();
	const plans = /* @__PURE__ */ new Map();
	const selectPlan = (sourceInput) => {
		const key = JSON.stringify(sourceInput);
		const plan = plans.get(key) ?? resolveInputPlan(sourceInput, pluginCache);
		plans.set(key, plan);
		return plan;
	};
	return {
		kind: "scan",
		results: request.requests.map(({ key, environment, selection }) => {
			applyEnvironment(environment);
			const resolvedPlan = selection.kind === "planned" ? selectPlan(selection.plan.input) : selection.plan ? selectPlan(selection.plan.input) : selection.request.sourcePlan;
			const sourceRequest = {
				...selection.request,
				sourcePlan: selection.kind === "selected" && selection.plan?.scope === "gateway" ? splitSkillSourcePlan(resolvedPlan).gatewayPlan : resolvedPlan
			};
			const environmentKey = JSON.stringify(environment);
			let batch = sourceReads.get(environmentKey);
			if (!batch) {
				batch = /* @__PURE__ */ new Map();
				sourceReads.set(environmentKey, batch);
			}
			const sources = readWorkspaceSkillSources(sourceRequest, batch);
			const entries = mergeSkillRecords(sources.entries, key, []);
			appendLowerPrecedenceSkillRecords(entries, mergeSkillRecords(sources.executionEntries, key, []), () => {});
			return {
				key,
				sources,
				plan: selection.plan ? resolvedPlan : void 0,
				fingerprint: sha256Hex(JSON.stringify([entries, sources.runtime]))
			};
		})
	};
});
//#endregion
export {};
