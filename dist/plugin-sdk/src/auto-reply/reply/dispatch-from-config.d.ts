import type { PluginHookReplyDispatchEvent } from "../../plugins/hook-types.js";
import type { DispatchFromConfigParams, DispatchFromConfigResult } from "./dispatch-from-config.types.js";
import type { DispatcherOutcomeCountsView } from "./reply-dispatcher.types.js";
declare function createReplyDispatchEvent(params: Omit<PluginHookReplyDispatchEvent, "shouldSendToolSummaries"> & {
    shouldSendToolSummaries: () => boolean;
}): PluginHookReplyDispatchEvent;
/** Test-only hooks for overriding selected dispatch dependencies. */
export declare const testing: {
    createReplyDispatchEvent: typeof createReplyDispatchEvent;
};
/** Reads final outcome counters from dispatchers that expose them. */
export declare function getDispatcherFinalOutcomeCounts(dispatcher: DispatcherOutcomeCountsView): {
    cancelled: number;
    failed: number;
};
export type { DispatchFromConfigParams, DispatchFromConfigResult, } from "./dispatch-from-config.types.js";
/** Dispatches a reply from config, context, command handling, agent run, and delivery policy. */
export declare function dispatchReplyFromConfig(params: DispatchFromConfigParams): Promise<DispatchFromConfigResult>;
