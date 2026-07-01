import { collectAllowedToolNames } from "../tool-name-allowlist.js";
/** Tool-search control tools that may be auto-added when tool search is enabled. */
export declare const TOOL_SEARCH_CONTROL_ALLOWLIST_NAMES: string[];
type CollectAllowedToolNamesParams = Parameters<typeof collectAllowedToolNames>[0];
/** Derived tool allowlists used for visible prompt tools, replay tools, and empty-allowlist checks. */
type ToolSearchRunPlan = {
    visibleAllowedToolNames: Set<string>;
    replayAllowedToolNames: Set<string>;
    liveAllowedToolNames: Set<string>;
    capabilityToolNames: Set<string>;
    emptyAllowlistCallableNames: string[];
};
/**
 * Builds the complete tool-search allowlist plan for one run. Visible tools use
 * compacted prompt state, replay tools use uncompacted state, and catalog-backed
 * client tools are represented through synthetic tool-search callable names.
 */
export declare function buildToolSearchRunPlan(params: {
    visibleTools: CollectAllowedToolNamesParams["tools"];
    uncompactedTools: CollectAllowedToolNamesParams["tools"];
    clientTools?: CollectAllowedToolNamesParams["clientTools"];
    clientToolsCataloged: boolean;
    catalogToolCount: number;
    controlsEnabled: boolean;
    deferredToolsCallable?: boolean;
    controlNames?: readonly string[];
    explicitAllowlistSources: Array<{
        entries: string[];
    }>;
}): ToolSearchRunPlan;
export {};
