import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
//#region src/infra/database-engine/types.d.ts
type DatabaseEngineInput = {
  connection: string;
  schemaPrefix: string;
} | undefined;
type DatabaseEngineId = "sqlite" | "postgres";
//#endregion
//#region src/infra/database-engine/config.d.ts
/** Resolve on the host; the existing broker input transport keeps credentials out of config/logs. */
declare function resolveDatabaseEngineInput(config: OpenClawConfig): Promise<DatabaseEngineInput>;
//#endregion
export { DatabaseEngineId as n, DatabaseEngineInput as r, resolveDatabaseEngineInput as t };