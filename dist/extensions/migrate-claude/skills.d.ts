import { l as MigrationItem } from "../../plugin-entry-DpILbQ7M.js";
import { t as ClaudeSource } from "../../source-Czne5iNW.js";
import { t as PlannedTargets } from "../../targets-CYhPxCld.js";

//#region extensions/migrate-claude/skills.d.ts
declare function buildSkillItems(params: {
  source: ClaudeSource;
  targets: PlannedTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
declare function applyGeneratedSkillItem(item: MigrationItem, opts?: {
  overwrite?: boolean;
}): Promise<MigrationItem>;
//#endregion
export { applyGeneratedSkillItem, buildSkillItems };