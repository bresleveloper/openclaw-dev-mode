import { d as MigrationProviderContext, l as MigrationItem } from "../../plugin-entry-DpILbQ7M.js";
import { t as HermesSource } from "../../source-BWpYJbX3.js";
import { t as PlannedTargets } from "../../targets-CCm4KAmY.js";

//#region extensions/migrate-hermes/secrets.d.ts
declare function buildSecretItems(params: {
  ctx: MigrationProviderContext;
  source: HermesSource;
  targets: PlannedTargets;
}): Promise<MigrationItem[]>;
declare function applySecretItem(ctx: MigrationProviderContext, item: MigrationItem, targets: PlannedTargets): Promise<MigrationItem>;
//#endregion
export { applySecretItem, buildSecretItems };