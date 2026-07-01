import type { RealtimeVoiceTool } from "./provider-types.js";
/** Stable provider-facing tool name for realtime voice agent delegation. */
export declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME = "openclaw_agent_consult";
/** Closed policy set controlling whether the consult tool is exposed. */
export declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES: readonly ["safe-read-only", "owner", "none"];
/** Tool exposure policy for the shared realtime voice consult tool. */
export type RealtimeVoiceAgentConsultToolPolicy = (typeof REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES)[number];
/** Normalized tool-call arguments accepted from realtime providers. */
export type RealtimeVoiceAgentConsultArgs = {
    question: string;
    context?: string;
    responseStyle?: string;
};
/** Compact transcript entry included in delegated agent prompts. */
export type RealtimeVoiceAgentConsultTranscriptEntry = {
    role: "user" | "assistant";
    text: string;
};
/** Shared realtime voice function-tool descriptor projected to providers. */
export declare const REALTIME_VOICE_AGENT_CONSULT_TOOL: RealtimeVoiceTool;
/** Build the interim spoken instruction while the delegated agent turn runs. */
export declare function buildRealtimeVoiceAgentConsultWorkingResponse(audienceLabel?: string): Record<string, unknown>;
/** Type guard for user/config supplied consult tool policies. */
export declare function isRealtimeVoiceAgentConsultToolPolicy(value: unknown): value is RealtimeVoiceAgentConsultToolPolicy;
/** Normalize a configured consult tool policy with a caller-owned fallback. */
export declare function resolveRealtimeVoiceAgentConsultToolPolicy(value: unknown, fallback: RealtimeVoiceAgentConsultToolPolicy): RealtimeVoiceAgentConsultToolPolicy;
/** Merge the shared consult tool with provider/plugin custom realtime tools. */
export declare function resolveRealtimeVoiceAgentConsultTools(policy: RealtimeVoiceAgentConsultToolPolicy, customTools?: RealtimeVoiceTool[]): RealtimeVoiceTool[];
/** Resolve the OpenClaw tool allowlist paired with the consult exposure policy. */
export declare function resolveRealtimeVoiceAgentConsultToolsAllow(policy: RealtimeVoiceAgentConsultToolPolicy): string[] | undefined;
/** Build model instructions for when the voice agent should call the consult tool. */
export declare function buildRealtimeVoiceAgentConsultPolicyInstructions(config: {
    toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
    consultPolicy?: "auto" | "substantive" | "always";
}): string | undefined;
/** Parse provider-owned consult tool arguments into the normalized contract. */
export declare function parseRealtimeVoiceAgentConsultArgs(args: unknown): RealtimeVoiceAgentConsultArgs;
/** Build the plain chat message used by browser/chat forwarding paths. */
export declare function buildRealtimeVoiceAgentConsultChatMessage(args: unknown): string;
/** Build the delegated OpenClaw agent prompt for a live voice consult. */
export declare function buildRealtimeVoiceAgentConsultPrompt(params: {
    args: unknown;
    transcript: RealtimeVoiceAgentConsultTranscriptEntry[];
    surface: string;
    userLabel: string;
    assistantLabel?: string;
    questionSourceLabel?: string;
}): string;
/** Collect only visible answer text from streamed delegated-agent payloads. */
export declare function collectRealtimeVoiceAgentConsultVisibleText(payloads: Array<{
    text?: unknown;
    isError?: boolean;
    isReasoning?: boolean;
}>): string | null;
