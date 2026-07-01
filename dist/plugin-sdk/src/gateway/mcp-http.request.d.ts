import type { IncomingMessage, ServerResponse } from "node:http";
import type { SourceReplyDeliveryMode } from "../auto-reply/get-reply-options.types.js";
import type { InboundEventKind } from "../channels/inbound-event/kind.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type McpRequestContext = {
    sessionKey: string;
    sessionId: string | undefined;
    messageProvider: string | undefined;
    currentChannelId: string | undefined;
    currentThreadTs: string | undefined;
    currentMessageId: string | undefined;
    currentInboundAudio: boolean | undefined;
    accountId: string | undefined;
    inboundEventKind: InboundEventKind | undefined;
    sourceReplyDeliveryMode: SourceReplyDeliveryMode | undefined;
    requireExplicitMessageTarget: boolean | undefined;
    senderIsOwner: boolean | undefined;
};
export declare function validateMcpLoopbackRequest(params: {
    req: IncomingMessage;
    res: ServerResponse;
    ownerToken: string;
    nonOwnerToken: string;
    onSseResponse?: (res: ServerResponse) => void;
}): {
    senderIsOwner: boolean;
} | null;
export declare function readMcpHttpBody(req: IncomingMessage, options?: {
    maxBytes?: number;
    timeoutMs?: number;
}): Promise<string>;
export declare function isMcpHttpBodyTooLargeError(error: unknown): error is Error & {
    code: string;
};
export declare function isMcpHttpBodyTimeoutError(error: unknown): error is Error & {
    code: string;
};
export declare function resolveMcpHttpBodyTimeoutMs(): number;
export declare function resolveMcpCliCaptureKey(req: IncomingMessage): string | undefined;
export declare function resolveMcpRequestContext(req: IncomingMessage, cfg: OpenClawConfig, auth: {
    senderIsOwner: boolean;
}): McpRequestContext;
export {};
