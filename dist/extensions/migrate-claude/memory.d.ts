import { l as MigrationItem } from "../../plugin-entry-L7QTXRH5.js";
import { t as ClaudeSource } from "../../source-Czne5iNW.js";
import { t as PlannedMigrationTargets } from "../../migration-runtime-DbAfX870.js";
//#region extensions/migrate-claude/memory.d.ts
declare function buildMemoryItems(params: {
  source: ClaudeSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildMemoryItems };