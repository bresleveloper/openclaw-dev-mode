import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RealtimeVoiceAgentConsultResult } from "./agent-consult-runtime.js";
type Logger = {
    debug?: (message: string) => void;
};
/** Fast-context lookup policy for realtime voice consult shortcuts. */
export type RealtimeVoiceFastContextConfig = {
    enabled: boolean;
    /** Maximum memory/session hits to include in the spoken-context prompt. */
    maxResults: number;
    /** Search backends allowed for the quick lookup. */
    sources: Array<"memory" | "sessions">;
    /** Deadline before the quick lookup gives up. */
    timeoutMs: number;
    /** Whether miss/unavailable/timeout should fall back to a full consult. */
    fallbackToConsult: boolean;
};
/** Human labels used in generated fast-context responses. */
export type RealtimeVoiceFastContextLabels = {
    audienceLabel: string;
    contextName: string;
};
export type RealtimeVoiceFastContextConsultResult = {
    handled: false;
} | {
    handled: true;
    result: RealtimeVoiceAgentConsultResult;
};
/** Try to answer a realtime consult from fast memory/session context. */
export declare function resolveRealtimeVoiceFastContextConsult(params: {
    cfg: OpenClawConfig;
    agentId: string;
    sessionKey: string;
    config: RealtimeVoiceFastContextConfig;
    args: unknown;
    logger: Logger;
    labels?: Partial<RealtimeVoiceFastContextLabels>;
}): Promise<RealtimeVoiceFastContextConsultResult>;
export {};
