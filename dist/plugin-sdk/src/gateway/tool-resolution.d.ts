import type { AnyAgentTool } from "../agents/tools/common.js";
import type { SourceReplyDeliveryMode } from "../auto-reply/get-reply-options.types.js";
import type { InboundEventKind } from "../channels/inbound-event/kind.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type GatewayScopedToolSurface = "http" | "loopback";
/** Resolve the tools visible to a gateway caller after agent, channel, and surface policy. */
export declare function resolveGatewayScopedTools(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    sessionId?: string;
    onYield?: (message: string) => Promise<void> | void;
    messageProvider?: string;
    currentChannelId?: string;
    currentThreadTs?: string;
    currentMessageId?: string | number;
    currentInboundAudio?: boolean;
    accountId?: string;
    inboundEventKind?: InboundEventKind;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    requireExplicitMessageTarget?: boolean;
    agentTo?: string;
    agentThreadId?: string;
    senderIsOwner?: boolean;
    allowGatewaySubagentBinding?: boolean;
    allowMediaInvokeCommands?: boolean;
    surface?: GatewayScopedToolSurface;
    excludeToolNames?: Iterable<string>;
    disablePluginTools?: boolean;
    gatewayRequestedTools?: string[];
}): {
    agentId: string | undefined;
    tools: AnyAgentTool[];
};
export {};
