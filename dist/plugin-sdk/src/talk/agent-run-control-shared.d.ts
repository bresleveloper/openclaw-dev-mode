import type { RealtimeVoiceTool } from "./provider-types.js";
import type { TalkEvent } from "./talk-events.js";
/** Provider-facing control modes for status, steering, cancellation, and follow-up work. */
export declare const REALTIME_VOICE_AGENT_CONTROL_MODES: readonly ["status", "steer", "cancel", "followup"];
/** Closed set of realtime voice agent-control modes. */
export type RealtimeVoiceAgentControlMode = (typeof REALTIME_VOICE_AGENT_CONTROL_MODES)[number];
/** Provider return shape for control calls that cancel active work immediately. */
export type RealtimeVoiceAgentControlProviderResult = {
    status: "cancelled";
    message: string;
};
/** Stable provider-facing tool name for active-run voice control. */
export declare const REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME = "openclaw_agent_control";
/** Realtime function-tool descriptor projected to voice providers. */
export declare const REALTIME_VOICE_AGENT_CONTROL_TOOL: RealtimeVoiceTool;
/** Classified control intent plus whether automatic tool routing is safe. */
export type RealtimeVoiceAgentControlIntent = {
    mode: RealtimeVoiceAgentControlMode;
    confidence: "high" | "medium" | "low";
    reason: "explicit_mode" | "cancel_safety" | "status_query" | "followup_marker" | "steer_command" | "safe_default";
    shouldAutoControl: boolean;
};
/** Snapshot of active work used when recent Talk events cannot describe status. */
export type RealtimeVoiceAgentRunActivity = {
    activeWorkKind?: "tool_call" | "model_call" | "embedded_run";
    hasActiveEmbeddedRun?: boolean;
    activeToolName?: string;
    activeToolCallId?: string;
    activeToolAgeMs?: number;
    lastProgressAgeMs?: number;
    lastProgressReason?: string;
};
/** Result returned after applying or reporting a voice control request. */
export type RealtimeVoiceAgentControlResult = {
    ok: boolean;
    mode: RealtimeVoiceAgentControlMode;
    sessionKey: string;
    sessionId?: string;
    active: boolean;
    queued?: boolean;
    aborted?: boolean;
    target?: "embedded_run" | "reply_run";
    reason?: string;
    message: string;
    speak: boolean;
    show: boolean;
    suppress: boolean;
    providerResult?: RealtimeVoiceAgentControlProviderResult;
    enqueuedAtMs?: number;
    deliveredAtMs?: number;
};
/** Normalize user/config/provider supplied control modes. */
export declare function normalizeRealtimeVoiceAgentControlMode(value: unknown): RealtimeVoiceAgentControlMode | undefined;
/** Classify raw spoken control text with conservative auto-control gating. */
export declare function resolveRealtimeVoiceAgentControlIntent(params: {
    text: string;
    mode?: unknown;
}): RealtimeVoiceAgentControlIntent;
/** Return the best control mode for a spoken utterance, even if auto-routing is unsafe. */
export declare function classifyRealtimeVoiceAgentControlText(text: string): RealtimeVoiceAgentControlMode;
/** Whether a spoken utterance is safe to route automatically to the control tool. */
export declare function shouldAutoControlRealtimeVoiceAgentText(text: string): boolean;
/** Parse provider-owned control tool args from JSON strings or object payloads. */
export declare function parseRealtimeVoiceAgentControlToolArgs(args: unknown): {
    text: string;
    mode: RealtimeVoiceAgentControlMode;
};
/** Build the system-style instruction that forces exact spoken status output. */
export declare function buildRealtimeVoiceAgentControlSpeechMessage(text: string): string;
/** Provider result payload used when the control tool cancels active work. */
export declare function buildRealtimeVoiceAgentCancelProviderResult(message?: string): RealtimeVoiceAgentControlProviderResult;
/** Wrap follow-up text so an active run treats it as deferred context. */
export declare function buildRealtimeVoiceAgentFollowupSteeringText(text: string): string;
/** User-facing message for queue failures while steering or adding follow-up work. */
export declare function formatRealtimeVoiceAgentQueueRejection(mode: RealtimeVoiceAgentControlMode, reason: string): string;
/** Format a concise spoken status for the active or most recent voice run. */
export declare function formatRealtimeVoiceAgentStatus(params: {
    active: boolean;
    recentEvents?: readonly TalkEvent[];
    activity?: RealtimeVoiceAgentRunActivity;
}): string;
