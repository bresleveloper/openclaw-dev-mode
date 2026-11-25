import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import "./types-ACDCRjU-.js";
import { r as DatabaseEngineInput } from "./types-C6Nim0qi.js";
/** External stores follow the default engine, independent of built-in family overrides. */
declare function resolveDatabaseEngineInput(config: OpenClawConfig, env?: NodeJS.ProcessEnv): Promise<DatabaseEngineInput>;
export { resolveDatabaseEngineInput as t };