import { d as MigrationProviderContext, l as MigrationItem } from "../../plugin-entry-DpILbQ7M.js";

//#region extensions/migrate-hermes/model.d.ts
declare function resolveHermesModelRef(config: Record<string, unknown>): string | undefined;
declare function resolveCurrentModelRef(ctx: MigrationProviderContext): string | undefined;
declare function applyModelItem(ctx: MigrationProviderContext, item: MigrationItem): Promise<MigrationItem>;
//#endregion
export { applyModelItem, resolveCurrentModelRef, resolveHermesModelRef };