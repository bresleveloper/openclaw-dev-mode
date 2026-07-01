import type { AgentMessage } from "../../agents/runtime/index.js";
import type { SessionManager } from "../../agents/sessions/session-manager.js";
import type { OpenClawConfig } from "../types.openclaw.js";
export type SessionTranscriptAppendResult = {
    ok: true;
    sessionFile: string;
    messageId: string;
} | {
    ok: false;
    reason: string;
    code?: "blocked" | "session-rebound";
};
export type SessionTranscriptUpdateMode = "inline" | "file-only" | "none";
export type SessionTranscriptDeliveryMirror = {
    kind: "channel-final";
    sourceMessageId?: string;
};
export type SessionTranscriptAssistantMessage = Parameters<SessionManager["appendMessage"]>[0] & {
    role: "assistant";
};
type AssistantBeforeMessageWrite = (params: {
    message: AgentMessage;
    agentId?: string;
    sessionKey?: string;
}) => AgentMessage | null;
type AssistantTranscriptText = {
    id?: string;
    text: string;
    timestamp?: number;
};
export type SessionRecentConversationText = {
    id?: string;
    role: "user" | "assistant";
    text: string;
    timestamp?: number;
    sourceChannel?: string;
};
export type ReadRecentSessionConversationTextOptions = {
    beforeTimestampMs?: number;
    limit?: number;
    minTimestampMs?: number;
};
export type ReadRecentSessionConversationTextParams = ReadRecentSessionConversationTextOptions & {
    agentId?: string;
    sessionKey: string;
    storePath?: string;
};
export type LatestAssistantTranscriptText = AssistantTranscriptText;
export type TailAssistantTranscriptText = AssistantTranscriptText;
export { resolveSessionTranscriptFile } from "./transcript-file-resolve.js";
export declare function readRecentUserAssistantTextFromSessionTranscript(sessionFile: string | undefined, options?: ReadRecentSessionConversationTextOptions): Promise<SessionRecentConversationText[]>;
export declare function readRecentUserAssistantTextForSession(params: ReadRecentSessionConversationTextParams): Promise<SessionRecentConversationText[]>;
export declare function readLatestAssistantTextFromSessionTranscript(sessionFile: string | undefined): Promise<LatestAssistantTranscriptText | undefined>;
export declare function readTailAssistantTextFromSessionTranscript(sessionFile: string | undefined): Promise<TailAssistantTranscriptText | undefined>;
export declare function appendAssistantMessageToSessionTranscript(params: {
    agentId?: string;
    sessionKey: string;
    expectedSessionId?: string;
    text?: string;
    mediaUrls?: string[];
    idempotencyKey?: string;
    deliveryMirror?: SessionTranscriptDeliveryMirror;
    /** Optional override for store path (mostly for tests). */
    storePath?: string;
    updateMode?: SessionTranscriptUpdateMode;
    config?: OpenClawConfig;
    beforeMessageWrite?: AssistantBeforeMessageWrite;
}): Promise<SessionTranscriptAppendResult>;
export declare function appendExactAssistantMessageToSessionTranscript(params: {
    agentId?: string;
    sessionKey: string;
    expectedSessionId?: string;
    message: SessionTranscriptAssistantMessage;
    idempotencyKey?: string;
    storePath?: string;
    updateMode?: SessionTranscriptUpdateMode;
    config?: OpenClawConfig;
    beforeMessageWrite?: AssistantBeforeMessageWrite;
}): Promise<SessionTranscriptAppendResult>;
