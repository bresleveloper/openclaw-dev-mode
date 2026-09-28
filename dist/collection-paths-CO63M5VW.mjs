import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import path from "node:path";
//#region src/skills/workshop/collection-paths.ts
const BACKUP_REL_DIR = path.join("skill-workshop", "collection-backups");
function resolveSkillCollectionBackupRoot(config, agentId, env) {
	return path.join(resolveAgentDir(config, agentId, env), BACKUP_REL_DIR);
}
//#endregion
export { resolveSkillCollectionBackupRoot as t };
