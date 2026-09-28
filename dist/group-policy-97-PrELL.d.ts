import { Nt as GroupToolPolicyBySenderConfig, Pt as GroupToolPolicyConfig, r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
//#region src/config/channel-groups.d.ts
type ChannelGroupConfig = {
  requireMention?: boolean;
  ingest?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
};
type ChannelGroups = Record<string, ChannelGroupConfig>;
declare function resolveChannelGroups(cfg: OpenClawConfig, channel: ChannelId, accountId?: string | null): ChannelGroups | undefined;
//#endregion
//#region src/config/tools-by-sender.d.ts
type GroupToolPolicySender = {
  /** Skip sender-specific overlays for trusted non-ingress executions. */
  senderPolicyMode?: "always" | "never";
  messageProvider?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
};
declare function resolveToolsBySender(params: {
  toolsBySender?: GroupToolPolicyBySenderConfig;
} & GroupToolPolicySender): GroupToolPolicyConfig | undefined;
//#endregion
//#region src/config/group-policy.d.ts
type GroupPolicyChannel = ChannelId;
type ChannelGroupPolicy = {
  allowlistEnabled: boolean;
  allowed: boolean;
  groupConfig?: ChannelGroupConfig;
  defaultConfig?: ChannelGroupConfig;
};
/** Locate the authored map selected by the channel owner without changing its inheritance rules. */
declare function resolveChannelGroupsConfigPath(params: {
  cfg: OpenClawConfig;
  channel: GroupPolicyChannel;
  accountId?: string | null;
  groups: Readonly<Record<string, unknown>> | undefined;
}): string;
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
declare function resolveChannelGroupToolsPolicy(params: {
  cfg: OpenClawConfig;
  channel: GroupPolicyChannel;
  groupId?: string | null;
  groupIdCandidates?: Array<string | null | undefined>;
  accountId?: string | null;
  groupIdCaseInsensitive?: boolean;
} & GroupToolPolicySender): GroupToolPolicyConfig | undefined;
//#endregion
export { resolveChannelGroupsConfigPath as a, resolveChannelGroupToolsPolicy as i, resolveChannelGroupPolicy as n, resolveToolsBySender as o, resolveChannelGroupRequireMention as r, resolveChannelGroups as s, ChannelGroupPolicy as t };