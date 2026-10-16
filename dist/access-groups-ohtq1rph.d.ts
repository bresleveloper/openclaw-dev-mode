import { $ as AccessGroupConfig, r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { t as ChannelId } from "./channel-id.types-CM2F8b5e.js";
import "./types.public-DpLTXZT0.js";
//#region src/plugin-sdk/access-groups.d.ts
/** Resolves membership for an access group using the full OpenClaw config. */
type AccessGroupMembershipResolver = (params: {
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
/** Returns the matched `accessGroup:<name>` allowlist entries for a sender. */
declare function resolveAccessGroupAllowFromMatches(params: {
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
declare function expandAllowFromWithAccessGroups(params: Parameters<typeof resolveAccessGroupAllowFromMatches>[0] & {
  /** Concrete allowlist entry appended after a group match; defaults to `senderId`. */
  senderAllowEntry?: string;
}): Promise<string[]>;
//#endregion
export { expandAllowFromWithAccessGroups as n, AccessGroupMembershipResolver as t };