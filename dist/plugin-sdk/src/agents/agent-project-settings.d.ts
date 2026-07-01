/** Prepares embedded-agent SettingsManager instances from project and plugin settings. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.js";
import { SettingsManager } from "./sessions/index.js";
/** Creates the runtime SettingsManager with project/plugin settings and compaction overrides. */
export declare function createPreparedEmbeddedAgentSettingsManager(params: {
    cwd: string;
    agentDir: string;
    cfg?: OpenClawConfig;
    pluginMetadataSnapshot?: PluginMetadataSnapshot;
    /** Resolved context window budget so reserve-token floor can be capped for small models. */
    contextTokenBudget?: number;
}): SettingsManager;
