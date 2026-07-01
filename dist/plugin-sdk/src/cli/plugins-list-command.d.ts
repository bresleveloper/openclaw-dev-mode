import { type RuntimeEnv } from "../runtime.js";
/** Options accepted by the plugin list command. */
export type PluginsListOptions = {
    json?: boolean;
    enabled?: boolean;
    verbose?: boolean;
};
/** Render installed plugin discovery state as JSON, compact table, or verbose text. */
export declare function runPluginsListCommand(opts: PluginsListOptions, runtime?: RuntimeEnv): Promise<void>;
