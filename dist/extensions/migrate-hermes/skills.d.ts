import { l as MigrationItem } from "../../plugin-entry-L7QTXRH5.js";
import { t as PlannedMigrationTargets } from "../../migration-runtime-DbAfX870.js";
import { t as HermesSource } from "../../source-BWpYJbX3.js";
//#region extensions/migrate-hermes/skills.d.ts
declare function buildSkillItems(params: {
  source: HermesSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildSkillItems };