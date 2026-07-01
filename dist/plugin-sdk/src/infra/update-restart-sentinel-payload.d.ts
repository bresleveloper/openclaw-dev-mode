import { type RestartSentinelPayload } from "./restart-sentinel.js";
import type { UpdateRunResult } from "./update-runner.js";
/** Metadata needed to route update restart continuation messages. */
export type UpdateRestartSentinelMeta = {
    sessionKey?: string;
    deliveryContext?: {
        channel?: string;
        to?: string;
        accountId?: string;
    };
    threadId?: string;
    handoffId?: string;
    note?: string | null;
    continuationMessage?: string | null;
};
/** Build the restart sentinel payload written after update runs. */
export declare function buildUpdateRestartSentinelPayload(params: {
    result: UpdateRunResult;
    meta: UpdateRestartSentinelMeta;
    nowMs?: number;
}): RestartSentinelPayload;
