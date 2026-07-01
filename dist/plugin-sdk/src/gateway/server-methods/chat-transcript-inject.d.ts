import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Metadata persisted on gateway-injected assistant messages that mark a stopped run. */
export type GatewayInjectedAbortMeta = {
    aborted: true;
    origin: "rpc" | "stop-command";
    runId: string;
};
/** Result shape returned after appending an assistant row to a session transcript. */
export type GatewayInjectedTranscriptAppendResult = {
    ok: boolean;
    messageId?: string;
    message?: Record<string, unknown>;
    error?: string;
};
/** Hash marker used to dedupe companion TTS text/audio supplements. */
export type GatewayInjectedTtsSupplementMarker = {
    textSha256: string;
};
/** Append a gateway-authored assistant message while preserving transcript parent links. */
export declare function appendInjectedAssistantMessageToTranscript(params: {
    transcriptPath: string;
    sessionKey?: string;
    agentId?: string;
    message: string;
    label?: string;
    /** When set, used as the assistant `content` array (e.g. text + embedded audio blocks). */
    content?: Array<Record<string, unknown>>;
    idempotencyKey?: string;
    abortMeta?: GatewayInjectedAbortMeta;
    ttsSupplement?: GatewayInjectedTtsSupplementMarker;
    now?: number;
    config?: OpenClawConfig;
}): Promise<GatewayInjectedTranscriptAppendResult>;
