import type { OpenClawConfig } from "../config/types.js";
import type { RealtimeVoiceProviderPlugin } from "../plugins/types.js";
import { type RealtimeVoiceAgentControlResult } from "../talk/agent-run-control.js";
import { type RealtimeVoiceBrowserAudioContract, type RealtimeVoiceProviderConfig, type RealtimeVoiceTool, type RealtimeVoiceToolResultOptions } from "../talk/provider-types.js";
import type { GatewayRequestContext } from "./server-methods/shared-types.js";
type CreateTalkRealtimeRelaySessionParams = {
    context: GatewayRequestContext;
    connId: string;
    cfg?: OpenClawConfig;
    provider: RealtimeVoiceProviderPlugin;
    providerConfig: RealtimeVoiceProviderConfig;
    instructions: string;
    tools: RealtimeVoiceTool[];
    model?: string;
    sessionKey?: string;
    voice?: string;
    forceAgentConsultOnFinalTranscript?: boolean;
};
type TalkRealtimeRelaySessionResult = {
    provider: string;
    transport: "gateway-relay";
    relaySessionId: string;
    audio: RealtimeVoiceBrowserAudioContract;
    model?: string;
    voice?: string;
    expiresAt: number;
};
/** Creates a realtime voice relay session and returns the browser audio contract. */
export declare function createTalkRealtimeRelaySession(params: CreateTalkRealtimeRelaySessionParams): TalkRealtimeRelaySessionResult;
/** Streams one base64-encoded browser audio frame into the owning relay. */
export declare function sendTalkRealtimeRelayAudio(params: {
    relaySessionId: string;
    connId: string;
    audioBase64: string;
    timestamp?: number;
}): void;
/** Delivers a tool result from the browser/client side back to the provider. */
export declare function submitTalkRealtimeRelayToolResult(params: {
    relaySessionId: string;
    connId: string;
    callId: string;
    result: unknown;
    options?: RealtimeVoiceToolResultOptions;
}): void;
/** Tracks the chat run started for a realtime agent-consult tool call. */
export declare function registerTalkRealtimeRelayAgentRun(params: {
    relaySessionId: string;
    connId: string;
    sessionKey: string;
    runId: string;
    callId?: string;
}): void;
/** Applies realtime voice-control text to the active agent-consult chat run. */
export declare function steerTalkRealtimeRelayAgentRun(params: {
    relaySessionId: string;
    connId: string;
    sessionKey?: string;
    text: string;
    mode?: string;
}): Promise<RealtimeVoiceAgentControlResult>;
/** Cancels the active relay turn, aborts agent work, and clears provider audio. */
export declare function cancelTalkRealtimeRelayTurn(params: {
    relaySessionId: string;
    connId: string;
    reason?: string;
}): void;
/** Closes a realtime relay session owned by the current connection. */
export declare function stopTalkRealtimeRelaySession(params: {
    relaySessionId: string;
    connId: string;
}): void;
/** Clears process-local realtime relays between tests. */
export declare function clearTalkRealtimeRelaySessionsForTest(): void;
export {};
