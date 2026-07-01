import type { ClearSessionQueueResult } from "../auto-reply/reply/queue.js";
import { patchSessionEntry } from "../config/sessions/session-accessor.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { callGateway } from "../gateway/call.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
/** Recent-run default window used by subagent control UI/tools. */
export declare const DEFAULT_RECENT_MINUTES = 30;
/** Maximum recent-run window accepted by subagent control UI/tools. */
export declare const MAX_RECENT_MINUTES: number;
type GatewayCaller = typeof callGateway;
type PatchSessionEntry = typeof patchSessionEntry;
type AbortEmbeddedAgentRun = (sessionId: string) => boolean;
type ClearSessionQueues = (keys: Array<string | undefined>) => ClearSessionQueueResult;
/** Controller identity and capability scope resolved from the caller session. */
export type ResolvedSubagentController = {
    controllerSessionKey: string;
    callerSessionKey: string;
    callerIsSubagent: boolean;
    controlScope: "children" | "none";
};
/** Resolves which subagent runs the caller is allowed to control. */
export declare function resolveSubagentController(params: {
    cfg: OpenClawConfig;
    agentSessionKey?: string;
}): ResolvedSubagentController;
/** Lists latest child runs controlled by a session key. */
export declare function listControlledSubagentRuns(controllerSessionKey: string): SubagentRunRecord[];
/** Kills every currently controlled child run and its descendants. */
export declare function killAllControlledSubagentRuns(params: {
    cfg: OpenClawConfig;
    controller: ResolvedSubagentController;
    runs: SubagentRunRecord[];
}): Promise<{
    status: "forbidden";
    error: string;
    killed: number;
    labels: never[];
} | {
    error?: undefined;
    status: "ok";
    killed: number;
    labels: string[];
}>;
/** Kills one controlled subagent run and any active descendants. */
export declare function killControlledSubagentRun(params: {
    cfg: OpenClawConfig;
    controller: ResolvedSubagentController;
    entry: SubagentRunRecord;
}): Promise<{
    text?: undefined;
    label?: undefined;
    status: "forbidden";
    runId: string;
    sessionKey: string;
    error: string;
    cascadeKilled?: undefined;
    cascadeLabels?: undefined;
} | {
    error?: undefined;
    status: "done";
    runId: string;
    sessionKey: string;
    label: string;
    text: string;
    cascadeKilled?: undefined;
    cascadeLabels?: undefined;
} | {
    error?: undefined;
    status: "ok";
    runId: string;
    sessionKey: string;
    label: string;
    cascadeKilled: number;
    cascadeLabels: string[] | undefined;
    text: string;
}>;
/** Admin kill path for a subagent session key, bypassing caller ownership checks. */
export declare function killSubagentRunAdmin(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
}): Promise<{
    sessionKey?: undefined;
    cascadeKilled?: undefined;
    cascadeLabels?: undefined;
    found: false;
    killed: boolean;
    runId?: undefined;
} | {
    found: true;
    killed: boolean;
    runId: string;
    sessionKey: string;
    cascadeKilled: number;
    cascadeLabels: string[] | undefined;
}>;
/** Restarts a controlled subagent run with a new steering message. */
export declare function steerControlledSubagentRun(params: {
    cfg: OpenClawConfig;
    controller: ResolvedSubagentController;
    entry: SubagentRunRecord;
    message: string;
}): Promise<{
    status: "forbidden" | "done" | "rate_limited" | "error";
    runId?: string;
    sessionKey: string;
    sessionId?: string;
    error?: string;
    text?: string;
} | {
    status: "accepted";
    runId: string;
    sessionKey: string;
    sessionId?: string;
    mode: "restart";
    label: string;
    text: string;
}>;
/** Sends a follow-up message to a controlled subagent and waits for a reply. */
export declare function sendControlledSubagentMessage(params: {
    cfg: OpenClawConfig;
    controller: ResolvedSubagentController;
    entry: SubagentRunRecord;
    message: string;
}): Promise<{
    text?: undefined;
    runId?: undefined;
    status: "forbidden";
    error: string;
    replyText?: undefined;
} | {
    error?: undefined;
    status: "done";
    runId: string;
    text: string;
    replyText?: undefined;
} | {
    text?: undefined;
    error?: undefined;
    status: "timeout";
    runId: string;
    replyText?: undefined;
} | {
    text?: undefined;
    status: "error";
    runId: string;
    error: string;
    replyText?: undefined;
} | {
    text?: undefined;
    error?: undefined;
    status: "ok";
    runId: string;
    replyText: string | undefined;
}>;
export declare const testing: {
    setDepsForTest(overrides?: Partial<{
        callGateway: GatewayCaller;
        patchSessionEntry: PatchSessionEntry;
        abortEmbeddedAgentRun: AbortEmbeddedAgentRun;
        clearSessionQueues: ClearSessionQueues;
    }>): void;
};
export { testing as __testing };
