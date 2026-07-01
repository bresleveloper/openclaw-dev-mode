import type { PluginHookReplyUsageState } from "../../plugins/hook-types.js";
export declare function recordReplyUsageState(runId: string | undefined, snapshot: PluginHookReplyUsageState): void;
export declare function consumeReplyUsageState(runId?: string): PluginHookReplyUsageState | undefined;
export declare function clearReplyUsageStateForTest(): void;
