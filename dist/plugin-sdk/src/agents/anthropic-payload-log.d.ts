import { type QueuedFileWriter } from "./queued-file-writer.js";
import type { AgentMessage, StreamFn } from "./runtime/index.js";
type PayloadLogWriter = QueuedFileWriter;
type AnthropicPayloadLogger = {
    enabled: true;
    wrapStreamFn: (streamFn: StreamFn) => StreamFn;
    recordUsage: (messages: AgentMessage[], error?: unknown) => void;
};
/** Create an Anthropic payload/usage logger when the env flag is enabled. */
export declare function createAnthropicPayloadLogger(params: {
    env?: NodeJS.ProcessEnv;
    runId?: string;
    sessionId?: string;
    sessionKey?: string;
    provider?: string;
    modelId?: string;
    modelApi?: string | null;
    workspaceDir?: string;
    writer?: PayloadLogWriter;
}): AnthropicPayloadLogger | null;
export {};
