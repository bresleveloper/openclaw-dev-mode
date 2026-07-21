import { l as MigrationItem } from "../../plugin-entry-L7QTXRH5.js";
import { t as ClaudeSource } from "../../source-Czne5iNW.js";
import { t as PlannedMigrationTargets } from "../../migration-runtime-DbAfX870.js";
//#region extensions/migrate-claude/skills.d.ts
declare function buildSkillItems(params: {
  source: ClaudeSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
declare function applyGeneratedSkillItem(item: MigrationItem, opts?: {
  overwrite?: boolean;
}): Promise<MigrationItem>;
//#endregion
export { applyGeneratedSkillItem, buildSkillItems };