import { readServiceStatusSummary } from "./status.service-summary.js";
type DaemonStatusSummary = {
    label: string;
    installed: boolean | null;
    loaded: boolean;
    managedByOpenClaw: boolean;
    externallyManaged: boolean;
    loadedText: string;
    runtime: Awaited<ReturnType<typeof readServiceStatusSummary>>["runtime"];
    runtimeShort: string | null;
    layout: Awaited<ReturnType<typeof readServiceStatusSummary>>["layout"];
    wrapperPath: Awaited<ReturnType<typeof readServiceStatusSummary>>["wrapperPath"];
};
/** Returns the gateway daemon status summary. */
export declare function getDaemonStatusSummary(): Promise<DaemonStatusSummary>;
/** Returns the node service status summary. */
export declare function getNodeDaemonStatusSummary(): Promise<DaemonStatusSummary>;
export {};
