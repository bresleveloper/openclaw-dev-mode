import { l as MigrationItem } from "../../plugin-entry-DpILbQ7M.js";
import { t as ClaudeSource } from "../../source-Czne5iNW.js";
import { t as PlannedTargets } from "../../targets-CYhPxCld.js";

//#region extensions/migrate-claude/memory.d.ts
declare function buildMemoryItems(params: {
  source: ClaudeSource;
  targets: PlannedTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildMemoryItems };