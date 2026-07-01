import type { SourceReplyDeliveryMode } from "../auto-reply/get-reply-options.types.js";
import type { InboundEventKind } from "../channels/inbound-event/kind.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type McpLoopbackTool, type McpToolSchemaEntry } from "./mcp-http.schema.js";
type CachedScopedTools = {
    agentId: string | undefined;
    tools: McpLoopbackTool[];
    toolSchema: McpToolSchemaEntry[];
    configRef: OpenClawConfig;
    time: number;
};
type McpLoopbackScopeParams = {
    cfg: OpenClawConfig;
    sessionKey: string;
    sessionId?: string;
    yieldContextCacheKey?: string;
    onYield?: (message: string) => Promise<void> | void;
    messageProvider: string | undefined;
    currentChannelId: string | undefined;
    currentThreadTs: string | undefined;
    currentMessageId: string | number | undefined;
    currentInboundAudio: boolean | undefined;
    accountId: string | undefined;
    inboundEventKind: InboundEventKind | undefined;
    sourceReplyDeliveryMode: SourceReplyDeliveryMode | undefined;
    requireExplicitMessageTarget?: boolean;
    senderIsOwner: boolean | undefined;
};
/** Resolves loopback-visible tools after applying gateway scope and native-tool exclusions. */
export declare function resolveMcpLoopbackScopedTools(params: McpLoopbackScopeParams): {
    agentId: string | undefined;
    tools: McpLoopbackTool[];
};
/** Short-lived cache for loopback tool lists keyed by session/channel context. */
export declare class McpLoopbackToolCache {
    #private;
    resolve(params: McpLoopbackScopeParams): CachedScopedTools;
}
export {};
