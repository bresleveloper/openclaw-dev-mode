import { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES, type GatewayClientMode, type GatewayClientName } from "../../packages/gateway-protocol/src/client-info.js";
export { isDeliverableMessageChannel, isGatewayMessageChannel, listDeliverableMessageChannels, normalizeMessageChannel, resolveGatewayMessageChannel, resolveMessageChannel, type DeliverableMessageChannel, type GatewayMessageChannel, } from "./message-channel-normalize.js";
export { INTERNAL_MESSAGE_CHANNEL, isInternalNonDeliveryChannel, NATIVE_APPROVAL_CHANNELS, isNativeApprovalChannel, type InternalMessageChannel, type NativeApprovalChannel, } from "./message-channel-constants.js";
import { INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants.js";
/**
 * Message channel and Gateway client classification helpers.
 *
 * This module keeps channel normalization, client identity checks, and markdown
 * capability lookup in one place for send/render decisions.
 */
export { GATEWAY_CLIENT_NAMES, GATEWAY_CLIENT_MODES };
export type { GatewayClientName, GatewayClientMode };
type GatewayClientInfoLike = {
    mode?: string | null;
    id?: string | null;
};
/** Return whether a Gateway client is the CLI transport. */
export declare function isGatewayCliClient(client?: GatewayClientInfoLike | null): boolean;
/** Return whether a client is one of the operator UI clients. */
export declare function isOperatorUiClient(client?: GatewayClientInfoLike | null): boolean;
/** Return whether a client is the browser Control UI. */
export declare function isBrowserOperatorUiClient(client?: GatewayClientInfoLike | null): boolean;
/** Return whether a raw channel id resolves to OpenClaw's internal channel. */
export declare function isInternalMessageChannel(raw?: string | null): raw is typeof INTERNAL_MESSAGE_CHANNEL;
/** Return whether a Gateway client is the public webchat surface. */
export declare function isWebchatClient(client?: GatewayClientInfoLike | null): boolean;
/** Resolve whether a channel can receive markdown without plain-text downgrade. */
export declare function isMarkdownCapableMessageChannel(raw?: string | null): boolean;
