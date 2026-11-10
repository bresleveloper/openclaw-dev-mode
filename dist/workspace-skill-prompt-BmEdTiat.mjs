import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as resolveSkillKey } from "./frontmatter-siV6LZij.mjs";
import { r as escapeSkillXml, t as compactSkillsPromptForContext } from "./skill-contract-CjUSek63.mjs";
import { o as isSkillSecretOwnerUnavailable, t as hasUnavailableSkillSecretOwners } from "./config-D7Jc5w1r.mjs";
import { s as projectSkillSnapshot } from "./refresh-CFj73Q4x.mjs";
import { a as resolveWorkspaceSkillPromptEntries } from "./workspace-skill-loader-B_yVTg_A.mjs";
//#region src/skills/loading/workspace-skill-prompt.ts
const skillsLogger = createSubsystemLogger("skills");
async function buildSkillSnapshot(workspaceDir, opts) {
	const { eligible, skillFilter } = await resolveWorkspaceSkillPromptEntries(workspaceDir, opts);
	const snapshot = await projectSkillSnapshot({
		workspaceDir,
		eligible,
		skillFilter,
		config: opts?.config,
		agentId: opts?.agentId,
		skillOverrides: opts?.skillOverrides,
		eligibility: opts?.eligibility ? {
			nodeSkills: opts.eligibility.nodeSkills,
			remote: opts.eligibility.remote ? { note: opts.eligibility.remote.note } : void 0
		} : void 0,
		preserveEntryOrder: opts?.preserveEntryOrder,
		snapshotVersion: opts?.snapshotVersion
	});
	opts?.assertCurrent?.();
	return snapshot;
}
async function buildSkillsPromptFromEntries(params, entries) {
	if (!entries || entries.length === 0) return "";
	const { prompt } = await buildSkillSnapshot(params.workspaceDir, {
		...params,
		entries
	});
	return prompt.trim() ? prompt : "";
}
async function rebuildAfterUnsafeSnapshot(params, reason) {
	skillsLogger.warn("Cached skills prompt could not be safely filtered; rebuilding from current skill entries.", { reason });
	const entries = (params.entries ?? await params.loadEntries?.())?.filter((entry) => !isSkillSecretOwnerUnavailable(resolveSkillKey(entry)));
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
