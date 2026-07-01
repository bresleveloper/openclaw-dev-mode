import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RealtimeVoiceProviderPlugin } from "../plugins/types.js";
import type { RealtimeVoiceBridge, RealtimeVoiceAudioFormat, RealtimeVoiceBargeInOptions, RealtimeVoiceCloseReason, RealtimeVoiceBridgeEvent, RealtimeVoiceProviderConfig, RealtimeVoiceRole, RealtimeVoiceTool, RealtimeVoiceToolCallEvent, RealtimeVoiceToolResultOptions } from "./provider-types.js";
/**
 * Transport-facing audio target used by realtime voice bridge sessions.
 */
export type RealtimeVoiceAudioSink = {
    isOpen?: () => boolean;
    sendAudio: (audio: Buffer) => void;
    clearAudio?: () => void;
    sendMark?: (markName: string) => void;
};
/**
 * Controls how provider playback marks are bridged to transports that may or may not ack marks.
 */
export type RealtimeVoiceMarkStrategy = "transport" | "ack-immediately" | "ignore";
/**
 * Stable session facade handed to gateway code and provider tool callbacks.
 */
export type RealtimeVoiceBridgeSession = {
    bridge: RealtimeVoiceBridge;
    acknowledgeMark(): void;
    close(): void;
    connect(): Promise<void>;
    sendAudio(audio: Buffer): void;
    sendUserMessage(text: string): void;
    handleBargeIn(options?: RealtimeVoiceBargeInOptions): void;
    setMediaTimestamp(ts: number): void;
    submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void;
    triggerGreeting(instructions?: string): void;
};
/**
 * Provider bridge inputs plus transport callbacks for one realtime voice session.
 */
export type RealtimeVoiceBridgeSessionParams = {
    provider: RealtimeVoiceProviderPlugin;
    cfg?: OpenClawConfig;
    providerConfig: RealtimeVoiceProviderConfig;
    audioFormat?: RealtimeVoiceAudioFormat;
    audioSink: RealtimeVoiceAudioSink;
    instructions?: string;
    initialGreetingInstructions?: string;
    autoRespondToAudio?: boolean;
    interruptResponseOnInputAudio?: boolean;
    markStrategy?: RealtimeVoiceMarkStrategy;
    triggerGreetingOnReady?: boolean;
    tools?: RealtimeVoiceTool[];
    onTranscript?: (role: RealtimeVoiceRole, text: string, isFinal: boolean) => void;
    onEvent?: (event: RealtimeVoiceBridgeEvent) => void;
    onToolCall?: (event: RealtimeVoiceToolCallEvent, session: RealtimeVoiceBridgeSession) => void;
    onReady?: (session: RealtimeVoiceBridgeSession) => void;
    onError?: (error: Error) => void;
    onClose?: (reason: RealtimeVoiceCloseReason) => void;
};
/**
 * Creates a realtime voice bridge session and wires provider events to the configured audio sink.
 */
export declare function createRealtimeVoiceBridgeSession(params: RealtimeVoiceBridgeSessionParams): RealtimeVoiceBridgeSession;
