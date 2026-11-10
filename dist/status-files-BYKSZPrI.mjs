import { r as resolveSkillKey } from "./frontmatter-siV6LZij.mjs";
import { t as resolveSkillSource } from "./source-DbWOnpPI.mjs";
import { m as readClawHubSkillsLockfileStatusSync } from "./clawhub-store-DrAcibyA.mjs";
import { a as resolveLocalSkillCardStatusSync, n as readLocalSkillCardContentSync, r as resolveClawHubSkillStatusLinkSync } from "./clawhub-status-DjGpJ2Qf.mjs";
import path from "node:path";
//#region src/skills/discovery/status-files.ts
/** Read beside the skill files; Gateway configuration still determines eligibility. */
function readWorkspaceSkillStatusFacts(params) {
	const workspaceLock = readClawHubSkillsLockfileStatusSync(params.workspaceDir);
	const managedParent = path.dirname(path.resolve(params.managedSkillsDir));
	const managedLock = managedParent === path.resolve(params.workspaceDir) ? workspaceLock : readClawHubSkillsLockfileStatusSync(managedParent);
	return {
		workspaceDir: params.workspaceDir,
		managedSkillsDir: params.managedSkillsDir,
		files: params.entries.map((entry) => {
			const source = resolveSkillSource(entry.skill);
			const bundled = source === "openclaw-bundled" || source === "openclaw-custodian";
			const managed = source === "openclaw-managed";
			const skillKey = resolveSkillKey(entry);
			const clawhub = params.workspaceDir && !bundled ? resolveClawHubSkillStatusLinkSync({
				workspaceDir: managed ? managedParent : params.workspaceDir,
				skillDir: entry.skill.baseDir,
				skillKey,
				lockRead: managed ? managedLock : workspaceLock,
				lockfileScope: managed ? "managed" : "workspace"
			}) : void 0;
			const card = resolveLocalSkillCardStatusSync(entry.skill.baseDir);
			const content = card && params.skillCardKey === skillKey ? readLocalSkillCardContentSync(entry.skill.baseDir) : void 0;
			return {
				name: entry.skill.name,
				filePath: entry.skill.filePath,
				...clawhub ? { clawhub } : {},
				...card ? { skillCard: {
					...card,
					...content !== void 0 ? { content } : {}
				} } : {}
			};
		})
	};
}
//#endregion
export { readWorkspaceSkillStatusFacts as t };
