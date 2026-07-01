import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Options for collecting configured agent harness runtimes. */
export type ConfiguredAgentHarnessRuntimeOptions = {
    includeImplicitRuntimePreferences?: boolean;
};
/** Lists configured plugin harness runtime ids referenced by agent/model config. */
export declare function collectConfiguredAgentHarnessRuntimes(config: OpenClawConfig, options?: ConfiguredAgentHarnessRuntimeOptions): string[];
