import { note } from "../../packages/terminal-core/src/note.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { findStaleOpenClawUpdateLaunchdJobs } from "../daemon/launchd.js";
import { type GatewayService } from "../daemon/service.js";
/** Returns the macOS marker warning when LaunchAgent writes are locally disabled. */
export declare function collectMacLaunchAgentOverrideWarning(deps?: {
    platform?: NodeJS.Platform;
    homeDir?: string;
    exists?: (candidate: string) => boolean;
}): string | null;
/** Emits the macOS LaunchAgent override warning when present. */
export declare function noteMacLaunchAgentOverrides(): Promise<void>;
/** Returns a warning for stale OpenClaw updater launchd jobs left after interrupted updates. */
export declare function collectMacStaleOpenClawUpdateLaunchdJobsWarning(deps?: {
    platform?: NodeJS.Platform;
    findJobs?: typeof findStaleOpenClawUpdateLaunchdJobs;
    env?: NodeJS.ProcessEnv;
}): Promise<string | null>;
/** Emits stale updater launchd job notes using the gateway service environment when available. */
export declare function noteMacStaleOpenClawUpdateLaunchdJobs(deps?: {
    platform?: NodeJS.Platform;
    findJobs?: typeof findStaleOpenClawUpdateLaunchdJobs;
    env?: NodeJS.ProcessEnv;
    service?: Pick<GatewayService, "readCommand">;
    noteFn?: typeof note;
}): Promise<void>;
/** Returns a warning for host-wide launchctl gateway auth env overrides. */
export declare function collectMacLaunchctlGatewayEnvOverrideWarning(cfg: OpenClawConfig, deps?: {
    platform?: NodeJS.Platform;
    getenv?: (name: string) => Promise<string | undefined>;
}): Promise<string | null>;
/** Emits macOS launchctl gateway auth override warnings. */
export declare function noteMacLaunchctlGatewayEnvOverrides(cfg: OpenClawConfig, deps?: {
    platform?: NodeJS.Platform;
    getenv?: (name: string) => Promise<string | undefined>;
    noteFn?: typeof note;
}): Promise<void>;
/** Collects all macOS gateway platform warnings without emitting notes. */
export declare function collectMacGatewayPlatformWarnings(cfg: OpenClawConfig, deps?: {
    platform?: NodeJS.Platform;
    env?: NodeJS.ProcessEnv;
    service?: Pick<GatewayService, "readCommand">;
    findJobs?: typeof findStaleOpenClawUpdateLaunchdJobs;
}): Promise<readonly string[]>;
/** Emits startup tuning hints for low-power Linux hosts when env settings are suboptimal. */
export declare function noteStartupOptimizationHints(env?: NodeJS.ProcessEnv, deps?: {
    platform?: NodeJS.Platform;
    arch?: string;
    totalMemBytes?: number;
    noteFn?: typeof note;
}): void;
