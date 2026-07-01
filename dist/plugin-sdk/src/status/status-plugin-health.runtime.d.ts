import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { StatusPluginHealthSnapshot } from "./status-plugin-health.js";
export declare function collectRuntimePluginHealthSnapshot(): StatusPluginHealthSnapshot;
export declare function collectInstalledPluginHealthSnapshot(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
}): Promise<StatusPluginHealthSnapshot>;
