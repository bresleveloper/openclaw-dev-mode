import { randomUUID } from "node:crypto";
import type { RunEmbeddedAgentParams } from "../agents/embedded-agent-runner/run/params.js";
import { forkSessionEntryFromParent } from "../auto-reply/reply/session-fork.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeLogger, PluginRuntimeCore } from "../plugins/runtime/types-core.js";
import { type RealtimeVoiceAgentConsultTranscriptEntry } from "./agent-consult-tool.js";
/**
 * Agent runtime surface used by realtime voice consults.
 */
export type RealtimeVoiceAgentConsultRuntime = PluginRuntimeCore["agent"];
/**
 * Speakable text returned to the realtime voice bridge after an agent consult.
 */
export type RealtimeVoiceAgentConsultResult = {
    text: string;
};
/**
 * Controls whether voice consults run in a fresh session or fork context from the requester.
 */
export type RealtimeVoiceAgentConsultContextMode = "isolated" | "fork";
export { resolveRealtimeVoiceAgentConsultTools, resolveRealtimeVoiceAgentConsultToolsAllow, } from "./agent-consult-tool.js";
type RealtimeVoiceAgentConsultDeps = {
    randomUUID: typeof randomUUID;
    forkSessionEntryFromParent: typeof forkSessionEntryFromParent;
};
/**
 * Overrides consult runtime dependencies for deterministic tests.
 */
export declare function setRealtimeVoiceAgentConsultDepsForTest(deps: Partial<RealtimeVoiceAgentConsultDeps> | null): void;
/**
 * Runs an embedded agent consult and returns concise speakable text for realtime voice playback.
 */
export declare function consultRealtimeVoiceAgent(params: {
    cfg: OpenClawConfig;
    agentRuntime: RealtimeVoiceAgentConsultRuntime;
    logger: Pick<RuntimeLogger, "warn">;
    sessionKey: string;
    messageProvider: string;
    lane: string;
    runIdPrefix: string;
    args: unknown;
    transcript: RealtimeVoiceAgentConsultTranscriptEntry[];
    surface: string;
    userLabel: string;
    assistantLabel?: string;
    questionSourceLabel?: string;
    agentId?: string;
    spawnedBy?: string | null;
    contextMode?: RealtimeVoiceAgentConsultContextMode;
    provider?: RunEmbeddedAgentParams["provider"];
    model?: RunEmbeddedAgentParams["model"];
    thinkLevel?: RunEmbeddedAgentParams["thinkLevel"];
    fastMode?: RunEmbeddedAgentParams["fastMode"];
    timeoutMs?: number;
    toolsAllow?: string[];
    extraSystemPrompt?: string;
    fallbackText?: string;
}): Promise<RealtimeVoiceAgentConsultResult>;
