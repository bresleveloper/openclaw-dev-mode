import { ACCESS_GROUP_ALLOW_FROM_PREFIX, parseAccessGroupAllowFromEntry } from "../channels/allow-from.js";
import type { ChannelId } from "../channels/plugins/types.public.js";
import type { AccessGroupConfig } from "../config/types.access-groups.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
export { ACCESS_GROUP_ALLOW_FROM_PREFIX, parseAccessGroupAllowFromEntry };
/** Resolves membership for an access group using the full OpenClaw config. */
export type AccessGroupMembershipResolver = (params: {
    /** Full config, available when membership needs cross-channel or provider state. */
    cfg: OpenClawConfig;
    /** Access group name referenced by `accessGroup:<name>`. */
    name: string;
    /** Access group config selected by name. */
    group: AccessGroupConfig;
    /** Channel where the inbound sender is being checked. */
    channel: ChannelId;
    /** Channel account id for account-scoped membership checks. */
    accountId: string;
    /** Inbound sender id or handle being authorized. */
    senderId: string;
}) => boolean | Promise<boolean>;
/** Resolves membership for one access group when the caller already selected the config group. */
export type AccessGroupMembershipLookup = (params: {
    /** Access group name referenced by `accessGroup:<name>`. */
    name: string;
    /** Access group config selected by name. */
    group: AccessGroupConfig;
    /** Channel where the inbound sender is being checked. */
    channel: ChannelId;
    /** Channel account id for account-scoped membership checks. */
    accountId: string;
    /** Inbound sender id or handle being authorized. */
    senderId: string;
}) => boolean | Promise<boolean>;
/** Reports how access-group allowlist entries resolved for a channel sender. */
export type ResolvedAccessGroupAllowFromState = {
    /** Unique access group names referenced by the allowlist. */
    referenced: string[];
    /** Referenced groups that authorized the sender. */
    matched: string[];
    /** Referenced groups absent from config. */
    missing: string[];
    /** Referenced groups whose type cannot be evaluated without a resolver. */
    unsupported: string[];
    /** Referenced groups whose resolver threw. */
    failed: string[];
    /** Matched allowlist entries in `accessGroup:<name>` form. */
    matchedAllowFromEntries: string[];
    /** Whether the input allowlist referenced at least one access group. */
    hasReferences: boolean;
    /** Whether at least one referenced group authorized the sender. */
    hasMatch: boolean;
};
/** Resolves `accessGroup:<name>` allowlist entries without changing the original allowlist. */
export declare function resolveAccessGroupAllowFromState(params: {
    /** Configured access groups keyed by name. */
    accessGroups?: Record<string, AccessGroupConfig>;
    /** Raw allowlist entries that may include `accessGroup:<name>` references. */
    allowFrom: Array<string | number> | null | undefined;
    /** Channel where the inbound sender is being checked. */
    channel: ChannelId;
    /** Channel account id for account-scoped membership checks. */
    accountId: string;
    /** Inbound sender id or handle being authorized. */
    senderId: string;
    /** Static sender matcher used for `message.senders` groups. */
    isSenderAllowed?: (senderId: string, allowFrom: string[]) => boolean;
    /** Optional resolver for non-static or integration-backed group types. */
    resolveMembership?: AccessGroupMembershipLookup;
}): Promise<ResolvedAccessGroupAllowFromState>;
/** Returns the matched `accessGroup:<name>` allowlist entries for a sender. */
export declare function resolveAccessGroupAllowFromMatches(params: {
    /** Full config containing `accessGroups`. */
    cfg?: OpenClawConfig;
    /** Raw allowlist entries that may include `accessGroup:<name>` references. */
    allowFrom: Array<string | number> | null | undefined;
    /** Channel where the inbound sender is being checked. */
    channel: ChannelId;
    /** Channel account id for account-scoped membership checks. */
    accountId: string;
    /** Inbound sender id or handle being authorized. */
    senderId: string;
    /** Static sender matcher used for `message.senders` groups. */
    isSenderAllowed?: (senderId: string, allowFrom: string[]) => boolean;
    /** Optional resolver for non-static or integration-backed group types. */
    resolveMembership?: AccessGroupMembershipResolver;
}): Promise<string[]>;
/** Expands a matching access-group allowlist with the concrete sender entry. */
export declare function expandAllowFromWithAccessGroups(params: {
    /** Full config containing `accessGroups`. */
    cfg?: OpenClawConfig;
    /** Raw allowlist entries that may include `accessGroup:<name>` references. */
    allowFrom: Array<string | number> | null | undefined;
    /** Channel where the inbound sender is being checked. */
    channel: ChannelId;
    /** Channel account id for account-scoped membership checks. */
    accountId: string;
    /** Inbound sender id or handle being authorized. */
    senderId: string;
    /** Concrete allowlist entry appended after a group match; defaults to `senderId`. */
    senderAllowEntry?: string;
    /** Static sender matcher used for `message.senders` groups. */
    isSenderAllowed?: (senderId: string, allowFrom: string[]) => boolean;
    /** Optional resolver for non-static or integration-backed group types. */
    resolveMembership?: AccessGroupMembershipResolver;
}): Promise<string[]>;
