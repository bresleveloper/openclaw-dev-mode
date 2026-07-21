import { DatabaseSync } from "node:sqlite";

//#region src/state/openclaw-state-db.d.ts
/** Options for resolving or overriding the shared state database path. */
type OpenClawStateDatabaseOptions = {
  env?: NodeJS.ProcessEnv;
  path?: string;
};
//#endregion
export { OpenClawStateDatabaseOptions as t };