import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import path from "node:path";
//#region src/skills/workshop/skills-root.ts
function resolveWorkshopSkillsDir(config, agentId, env = process.env) {
	return path.join(resolveAgentDir(config, agentId, env), "workshop-skills");
}
//#endregion
export { resolveWorkshopSkillsDir as t };
