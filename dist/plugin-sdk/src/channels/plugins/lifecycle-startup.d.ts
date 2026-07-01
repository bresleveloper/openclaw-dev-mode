/**
 * Channel plugin startup maintenance runner.
 *
 * Invokes optional plugin lifecycle hooks without blocking unrelated channels.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
type ChannelStartupLogger = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
};
/**
 * Runs startup maintenance hooks for all loaded channel plugins.
 */
export declare function runChannelPluginStartupMaintenance(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    log: ChannelStartupLogger;
    trigger?: string;
    logPrefix?: string;
}): Promise<void>;
export {};
