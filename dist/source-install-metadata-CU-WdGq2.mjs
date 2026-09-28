import { h as writeJson } from "./json-files-C0HSMh2Z.mjs";
import { g as untrackClawHubSkill } from "./clawhub-store-CLSS382v.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/lifecycle/source-install-metadata.ts
/** Source tracking lives beside the installed skill, including ClawHub replacement cleanup. */
async function recordSkillSourceInstall(params) {
	await Promise.all([fs.rm(path.join(params.targetDir, ".clawhub"), {
		recursive: true,
		force: true
	}), fs.rm(path.join(params.targetDir, ".clawdhub"), {
		recursive: true,
		force: true
	})]);
	await writeJson(path.join(params.targetDir, ".openclaw", "source-origin.json"), params.origin, { trailingNewline: true });
	await untrackClawHubSkill(params.workspaceDir, params.origin.slug);
}
//#endregion
export { recordSkillSourceInstall as t };
