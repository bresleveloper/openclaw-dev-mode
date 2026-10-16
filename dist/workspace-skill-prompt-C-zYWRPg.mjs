import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as resolveEffectiveAgentSkillsLimits } from "./agent-filter-KIvrTe_y.mjs";
import { i as resolveSkillFileHost } from "./skill-file-host-CJXc2mOP.mjs";
import { r as resolveSkillKey } from "./frontmatter-CrckYGsg.mjs";
import { r as escapeSkillXml, t as compactSkillsPromptForContext } from "./skill-contract-BNrmgBMG.mjs";
import { t as isSkillPromptVisible } from "./skill-index-fJ6kPuHX.mjs";
import { a as isSkillSecretOwnerUnavailable, t as hasUnavailableSkillSecretOwners } from "./config-EAfnzCK1.mjs";
import { o as resolveWorkspaceSkillPromptEntries } from "./workspace-skill-loader-CjoWF6nl.mjs";
import { t as compactPromptSkills } from "./skill-paths-BxFt63--.mjs";
import { n as prepareSkillsForPrompt } from "./skill-prompt-limits-DaXIzKaL.mjs";
//#region src/skills/loading/workspace-skill-prompt.ts
const skillsLogger = createSubsystemLogger("skills");
async function buildSkillSnapshot(workspaceDir, opts) {
	const { eligible, skillFilter } = await resolveWorkspaceSkillPromptEntries(workspaceDir, opts);
	const promptEntries = eligible.filter(isSkillPromptVisible);
	const remoteNote = opts?.eligibility?.remote?.note?.trim();
	const resolvedSkills = promptEntries.map((entry) => entry.skill);
	const limits = opts?.config?.skills?.limits;
	const agentLimits = resolveEffectiveAgentSkillsLimits(opts?.config, opts?.agentId);
	const prepared = prepareSkillsForPrompt({
		skills: compactPromptSkills(resolvedSkills, {
			config: opts?.config,
			agentId: opts?.agentId
		}),
		maxSkillsInPrompt: limits?.maxSkillsInPrompt,
		maxSkillsPromptChars: agentLimits?.maxSkillsPromptChars ?? limits?.maxSkillsPromptChars,
		remoteNote,
		preserveOrder: opts?.preserveEntryOrder
	});
	const byName = new Map(resolvedSkills.map((skill) => [skill.name, skill]));
	return {
		prompt: prepared.prompt,
		skills: eligible.map((entry) => ({
			name: entry.skill.name,
			gatewayFilePath: resolveSkillFileHost(entry.skill) === "gateway" ? entry.skill.filePath : void 0,
			skillKey: resolveSkillKey(entry.skill, entry),
			primaryEnv: entry.metadata?.primaryEnv,
			requiredEnv: entry.metadata?.requires?.env?.slice()
		})),
		...skillFilter === void 0 ? {} : { skillFilter },
		...opts?.skillOverrides ? { skillOverrides: opts.skillOverrides } : {},
		...opts?.eligibility?.nodeSkills ? { nodeSkillsEligibility: opts.eligibility.nodeSkills } : {},
		resolvedSkills: prepared.skills.map((skill) => byName.get(skill.name)),
		discoverySkills: resolvedSkills,
		version: opts?.snapshotVersion,
		promptFormatVersion: 8
	};
}
async function buildSkillsPromptFromEntries(params, entries) {
	if (!entries || entries.length === 0) return "";
	const { prompt } = await buildSkillSnapshot(params.workspaceDir, {
		entries,
		config: params.config,
		agentId: params.agentId,
		eligibility: params.eligibility,
		preserveEntryOrder: params.preserveEntryOrder,
		assertCurrent: params.assertCurrent
	});
	return prompt.trim() ? prompt : "";
}
async function rebuildAfterUnsafeSnapshot(params, reason) {
	skillsLogger.warn("Cached skills prompt could not be safely filtered; rebuilding from current skill entries.", { reason });
	const entries = (params.entries ?? await params.loadEntries?.())?.filter((entry) => !isSkillSecretOwnerUnavailable(resolveSkillKey(entry.skill, entry)));
	return buildSkillsPromptFromEntries(params, entries);
}
async function resolveSkillsPromptCatalog(params) {
	const snapshotPrompt = params.skillsSnapshot?.prompt?.trim();
	if (params.skillsSnapshot && !snapshotPrompt) return "";
	const snapshotHasLegacySkillIdentity = params.skillsSnapshot?.skills.some((skill) => !skill.skillKey);
	if (snapshotPrompt) {
		if ((params.skillsSnapshot?.skills.some((skill) => isSkillSecretOwnerUnavailable(skill.skillKey ?? skill.name)) || snapshotHasLegacySkillIdentity && hasUnavailableSkillSecretOwners()) && params.skillsSnapshot?.promptFormatVersion !== 8) return rebuildAfterUnsafeSnapshot(params, "unsupported-prompt-format");
		if (snapshotHasLegacySkillIdentity && hasUnavailableSkillSecretOwners()) return rebuildAfterUnsafeSnapshot(params, "legacy-skill-identity");
		const unavailableNames = new Set(params.skillsSnapshot?.skills.filter((skill) => skill.skillKey !== void 0 && isSkillSecretOwnerUnavailable(skill.skillKey)).map((skill) => escapeSkillXml(skill.name)));
		if (unavailableNames.size === 0) return snapshotPrompt;
		const catalogOpen = "<available_skills>";
		const catalogClose = "</available_skills>";
		const catalogStart = snapshotPrompt.indexOf(catalogOpen);
		const catalogEnd = snapshotPrompt.indexOf(catalogClose, catalogStart + 18);
		if (catalogStart < 0 || catalogEnd < 0 || snapshotPrompt.includes(catalogOpen, catalogStart + 18) || snapshotPrompt.includes(catalogClose, catalogEnd + 19)) return rebuildAfterUnsafeSnapshot(params, "invalid-catalog-structure");
		const bodyStart = catalogStart + 18;
		const catalogBody = snapshotPrompt.slice(bodyStart, catalogEnd);
		const blockPattern = /\n[ ]{2}<skill>\n[\s\S]*?\n[ ]{2}<\/skill>/g;
		let cursor = 0;
		let filteredBody = "";
		for (const match of catalogBody.matchAll(blockPattern)) {
			const gap = catalogBody.slice(cursor, match.index);
			const block = match[0];
			const name = /^[ ]{4}<name>(.*)<\/name>$/m.exec(block)?.[1];
			if (gap.trim() || !name) return rebuildAfterUnsafeSnapshot(params, "invalid-catalog-structure");
			filteredBody += gap;
			if (!unavailableNames.has(name)) filteredBody += block;
			cursor = (match.index ?? 0) + block.length;
		}
		const tail = catalogBody.slice(cursor);
		if (tail.trim()) return rebuildAfterUnsafeSnapshot(params, "invalid-catalog-structure");
		return `${snapshotPrompt.slice(0, bodyStart)}${filteredBody}${tail}${snapshotPrompt.slice(catalogEnd)}`.trim();
	}
	return buildSkillsPromptFromEntries(params, params.entries);
}
async function resolveSkillsPrompt(params) {
	return compactSkillsPromptForContext(await resolveSkillsPromptCatalog(params), params.contextTokenBudget);
}
//#endregion
export { resolveSkillsPrompt as n, buildSkillSnapshot as t };
