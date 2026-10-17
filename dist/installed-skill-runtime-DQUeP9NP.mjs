import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-DjFUgH7e.mjs";
import { i as resolveSkillFileHost } from "./skill-file-host-CJXc2mOP.mjs";
import { n as resolveSkillReadPath } from "./workspace-skill-read-path-Ct1QXBcj.mjs";
import { c as resolveCodeModeSkills, s as MAX_SKILL_INSTRUCTION_BYTES } from "./openclaw-tools-D_lVJ00z.mjs";
import { a as isSkillSecretOwnerUnavailable, t as hasUnavailableSkillSecretOwners } from "./config-EAfnzCK1.mjs";
//#region src/agents/installed-skill-runtime.ts
/** Bind already-admitted identities to the filesystem owner for this attempt. */
function prepareInstalledSkillCatalog(params) {
	const { snapshot, sandbox } = params;
	if (!snapshot) return [];
	const candidates = snapshot.discoverySkills ?? snapshot.resolvedSkills ?? [];
	const promptListed = new Set(resolveCodeModeSkills({
		skillsPrompt: snapshot.prompt,
		candidates
	}).map((skill) => skill.name));
	const fallback = snapshot.discoverySkills ? void 0 : promptListed;
	const keys = new Map(snapshot.skills.map((skill) => [skill.name, skill.skillKey]));
	const unavailableOwners = hasUnavailableSkillSecretOwners();
	const workspace = !sandbox?.enabled ? getAgentWorkspaceAccess(params.workspaceDir, "loadSkills") : void 0;
	return candidates.filter((skill) => !skill.disableModelInvocation && (!fallback || fallback.has(skill.name)) && (!unavailableOwners || keys.get(skill.name) !== void 0) && !isSkillSecretOwnerUnavailable(keys.get(skill.name) ?? skill.name)).map((skill) => {
		let reader;
		let readSearchContent;
		if (sandbox?.enabled) {
			const readInstructions = async (maxBytes, signal) => {
				params.assertCurrent?.();
				if (!sandbox.fsBridge) throw new Error("Sandbox filesystem bridge is unavailable for skill reads.");
				const content = await sandbox.fsBridge.readFile({
					filePath: skill.filePath,
					cwd: sandbox.containerWorkdir,
					signal,
					maxBytes
				});
				params.assertCurrent?.();
				return content.toString("utf8");
			};
			reader = ({ signal }) => readInstructions(promptListed.has(skill.name) ? void 0 : MAX_SKILL_INSTRUCTION_BYTES, signal);
			readSearchContent = readInstructions;
		} else if (workspace?.loadSkills && (resolveSkillFileHost(skill) === "workspace" || resolveSkillFileHost(skill) !== "gateway" && !snapshot.librarySelections?.some((selection) => selection.name === skill.name))) reader = async ({ signal }) => {
			params.assertCurrent?.();
			if (!workspace.skillResources) throw new WorkspaceAccessUnavailableError("Remote workspace skill reads are unavailable");
			const content = await workspace.skillResources.readInstructions(skill.filePath, { signal });
			params.assertCurrent?.();
			return content;
		};
		return {
			name: skill.name,
			promptListed: promptListed.has(skill.name),
			description: [skill.description, skill.locationNote].filter(Boolean).join("\n"),
			location: resolveSkillReadPath(skill),
			source: {
				filePath: skill.filePath,
				readContent: sandbox?.enabled ? void 0 : skill.readContent
			},
			reader,
			assertCurrent: params.assertCurrent,
			readSearchContent
		};
	});
}
//#endregion
export { prepareInstalledSkillCatalog as t };
