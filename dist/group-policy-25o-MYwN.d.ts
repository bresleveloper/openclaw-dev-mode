import { mt as GroupToolPolicyConfig, n as OpenClawConfig, pt as GroupToolPolicyBySenderConfig } from "./types.openclaw-BGrO5JfP.js";
//#region src/channels/ids.d.ts
/**
 * Canonical chat channel id used by core routing, plugin config, and channel catalogs.
 */
type ChatChannelId = string;
//#endregion
//#region src/channels/plugins/channel-id.types.d.ts
/**
 * Channel id accepted by plugin helpers, covering built-in chat ids and external plugin ids.
 */
type ChannelId = ChatChannelId | (string & {});
//#endregion
//#region src/config/channel-groups.d.ts
type ChannelGroupConfig = {
  requireMention?: boolean;
  ingest?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
};
//#endregion
//#region src/config/group-policy.d.ts
type GroupPolicyChannel = ChannelId;
type ChannelGroupPolicy = {
  allowlistEnabled: boolean;
  allowed: boolean;
  groupConfig?: ChannelGroupConfig;
  defaultConfig?: ChannelGroupConfig;
};
declare function resolveChannelGroupPolicy(params: {
  cfg: OpenClawConfig;
  channel: GroupPolicyChannel;
  groupId?: string | null;
  accountId?: string | null;
  groupIdCaseInsensitive?: boolean;
  /** When true, sender-level filtering (groupAllowFrom) is configured upstream. */
  hasGroupAllowFrom?: boolean;
}): ChannelGroupPolicy;
declare function resolveChannelGroupRequireMention(params: {
  cfg: OpenClawConfig;
  channel: GroupPolicyChannel;
  groupId?: string | null;
  accountId?: string | null;
  groupIdCaseInsensitive?: boolean;
  requireMentionOverride?: boolean;
  configuredGroupDefaultsToNoMention?: boolean;
  overrideOrder?: "before-config" | "after-config";
}): boolean;
//#endregion
export { ChatChannelId as i, resolveChannelGroupRequireMention as n, ChannelId as r, resolveChannelGroupPolicy as t };