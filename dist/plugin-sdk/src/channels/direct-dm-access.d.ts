/**
 * Legacy direct-DM access resolver.
 *
 * Bridges old DM allowlist/pairing behavior to channel ingress access decisions.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type AccessGroupMembershipResolver } from "../plugin-sdk/access-groups.js";
import { type DmGroupAccessReasonCode } from "../plugin-sdk/channel-access-compat.js";
import type { ChannelId } from "./plugins/types.public.js";
export type { AccessGroupMembershipResolver } from "../plugin-sdk/access-groups.js";
/** Runtime hooks needed by the legacy direct-DM access resolver. */
export type DirectDmCommandAuthorizationRuntime = {
    shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean;
    /** @deprecated Command authorization is resolved by channel ingress. Kept for runtime injection compatibility. */
    resolveCommandAuthorizedFromAuthorizers?: (params: {
        useAccessGroups: boolean;
        authorizers: Array<{
            configured: boolean;
            allowed: boolean;
        }>;
        modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
    }) => boolean;
};
/**
 * Legacy direct-DM ingress decision with command-authorization compatibility fields.
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export type ResolvedInboundDirectDmAccess = {
    access: {
        decision: "allow" | "block" | "pairing";
        reasonCode: DmGroupAccessReasonCode;
        reason: string;
        effectiveAllowFrom: string[];
    };
    shouldComputeAuth: boolean;
    senderAllowedForCommands: boolean;
    commandAuthorized: boolean | undefined;
};
/**
 * Resolves legacy direct-DM access lists, pairing-store entries, and command authorization.
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export declare function resolveInboundDirectDmAccessWithRuntime(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    accountId: string;
    dmPolicy?: string | null;
    allowFrom?: Array<string | number> | null;
    senderId: string;
    rawBody: string;
    isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
    resolveAccessGroupMembership?: AccessGroupMembershipResolver;
    runtime: DirectDmCommandAuthorizationRuntime;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
    readStoreAllowFrom?: (provider: ChannelId, accountId: string) => Promise<string[]>;
}): Promise<ResolvedInboundDirectDmAccess>;
/**
 * Creates a pre-crypto authorizer that can issue pairing challenges before payload decryption.
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export declare function createPreCryptoDirectDmAuthorizer(params: {
    resolveAccess: (senderId: string) => Promise<Pick<ResolvedInboundDirectDmAccess, "access"> | ResolvedInboundDirectDmAccess>;
    issuePairingChallenge?: (params: {
        senderId: string;
        reply: (text: string) => Promise<void>;
    }) => Promise<void>;
    onBlocked?: (params: {
        senderId: string;
        reason: string;
        reasonCode: DmGroupAccessReasonCode;
    }) => void;
}): (input: {
    senderId: string;
    reply: (text: string) => Promise<void>;
}) => Promise<"allow" | "block" | "pairing">;
