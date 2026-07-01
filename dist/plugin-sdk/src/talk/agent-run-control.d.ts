/**
 * Runtime adapter for realtime voice control of active OpenClaw agent runs.
 *
 * The shared module owns classification and message contracts; this adapter
 * binds those contracts to embedded-run abort, status, and steering primitives.
 */
import type { EmbeddedAgentQueueMessageOutcome } from "../agents/embedded-agent-runner/runs.js";
import { type RealtimeVoiceAgentControlResult, type RealtimeVoiceAgentRunActivity } from "./agent-run-control-shared.js";
import type { TalkEvent } from "./talk-events.js";
export { buildRealtimeVoiceAgentCancelProviderResult, buildRealtimeVoiceAgentControlSpeechMessage, classifyRealtimeVoiceAgentControlText, normalizeRealtimeVoiceAgentControlMode, parseRealtimeVoiceAgentControlToolArgs, REALTIME_VOICE_AGENT_CONTROL_MODES, REALTIME_VOICE_AGENT_CONTROL_TOOL, REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME, resolveRealtimeVoiceAgentControlIntent, shouldAutoControlRealtimeVoiceAgentText, type RealtimeVoiceAgentControlMode, type RealtimeVoiceAgentControlIntent, type RealtimeVoiceAgentControlProviderResult, type RealtimeVoiceAgentControlResult, type RealtimeVoiceAgentRunActivity, } from "./agent-run-control-shared.js";
type RealtimeVoiceAgentControlDeps = {
    abortEmbeddedAgentRun: (sessionId: string) => boolean;
    queueEmbeddedAgentMessageWithOutcomeAsync: (sessionId: string, text: string, options?: {
        steeringMode?: "all";
        debounceMs?: number;
    }) => Promise<EmbeddedAgentQueueMessageOutcome>;
    getDiagnosticSessionActivitySnapshot: (params: {
        sessionId?: string;
        sessionKey?: string;
    }) => RealtimeVoiceAgentRunActivity;
    resolveActiveEmbeddedRunSessionId: (sessionKey: string) => string | undefined;
};
/** Apply a spoken status, cancel, steer, or follow-up request to an active run. */
export declare function controlRealtimeVoiceAgentRun(params: {
    sessionKey: string;
    text: string;
    mode?: unknown;
    recentEvents?: readonly TalkEvent[];
}, deps?: RealtimeVoiceAgentControlDeps): Promise<RealtimeVoiceAgentControlResult>;
