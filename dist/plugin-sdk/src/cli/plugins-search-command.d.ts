import { type RuntimeEnv } from "../runtime.js";
/** Options accepted by `openclaw plugins search`. */
export type PluginsSearchOptions = {
    json?: boolean;
    limit?: number;
};
/** Search ClawHub for installable plugins and write JSON or terminal output. */
export declare function runPluginsSearchCommand(queryParts: string[] | string, opts?: PluginsSearchOptions, runtime?: RuntimeEnv): Promise<void>;
