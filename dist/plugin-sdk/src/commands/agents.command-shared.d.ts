import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
/** Wrap a runtime so helper setup work stays silent in JSON output paths. */
export declare function createQuietRuntime(runtime: RuntimeEnv): RuntimeEnv;
/** Load a config file snapshot and surface validation errors through the runtime. */
export declare function requireValidConfigFileSnapshot(runtime: RuntimeEnv): Promise<import("../config/types.openclaw.js").ConfigFileSnapshot | null>;
/** Load the current runtime config and return null after reporting validation failures. */
export declare function requireValidConfig(runtime: RuntimeEnv): Promise<OpenClawConfig | null>;
