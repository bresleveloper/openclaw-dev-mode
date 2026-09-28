import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import path from "node:path";
//#region src/skills/workshop/skills-root.ts
function resolveWorkshopSkillsDir(config, agentId, env = process.env) {
	return path.join(resolveAgentDir(config, agentId, env), "workshop-skills");
}
function resolveWorkshopWatchRoots(config, agentId) {
	return config && agentId ? [{
		path: resolveWorkshopSkillsDir(config, agentId),
		source: "openclaw-workshop"
	}] : [];
}
//#endregion
export { resolveWorkshopWatchRoots as n, resolveWorkshopSkillsDir as t };
