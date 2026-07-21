import { d as MigrationProviderContext, s as MigrationApplyResult, u as MigrationPlan } from "../../plugin-entry-L7QTXRH5.js";

//#region extensions/migrate-hermes/apply.d.ts
declare function applyHermesPlan(params: {
  ctx: MigrationProviderContext;
  plan?: MigrationPlan;
  runtime?: MigrationProviderContext["runtime"];
}): Promise<MigrationApplyResult>;
//#endregion
export { applyHermesPlan };