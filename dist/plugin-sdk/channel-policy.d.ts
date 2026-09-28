import { Nt as GroupToolPolicyBySenderConfig, Pt as GroupToolPolicyConfig, r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { g as GroupPolicy } from "../types.base-CA0_JvyZ.js";
import { D as ChannelSecurityDmPolicy } from "../types.core-D1MQo5ra.js";
import { t as ChannelId } from "../channel-id.types-CjcGKHk0.js";
import { D as ChannelSecurityAdapter, L as SecurityAuditFinding } from "../types.adapters-dxHXA2rq.js";
import { a as resolveChannelGroupsConfigPath, i as resolveChannelGroupToolsPolicy, n as resolveChannelGroupPolicy, o as resolveToolsBySender, r as resolveChannelGroupRequireMention, s as resolveChannelGroups, t as ChannelGroupPolicy } from "../group-policy-97-PrELL.js";
import { t as buildAccountScopedDmSecurityPolicy } from "../helpers-_lVA7JdY.js";
import { a as resolveEffectiveAllowFromLists, i as resolveDmGroupAccessWithLists, o as resolveOpenDmAllowlistAccess, r as readStoreAllowFromForDmPolicy, t as DM_GROUP_ACCESS_REASON } from "../dm-policy-shared-BXVdVRPm.js";
//#region src/channels/plugins/group-policy-warnings.d.ts
type GroupPolicyWarningCollector = (groupPolicy: GroupPolicy) => string[];
type AccountGroupPolicyWarningCollector<ResolvedAccount> = (params: {
  account: ResolvedAccount;
  cfg: OpenClawConfig;
}) => string[];
type ConfigGroupPolicyWarningCollector<Params extends {
  cfg: OpenClawConfig;
}> = (params: Params) => string[];
type WarningCollector<Params> = (params: Params) => string[];
export declare function composeWarningCollectors<Params>(...collectors: Array<WarningCollector<Params> | null | undefined>): WarningCollector<Params>;
export declare function projectWarningCollector<Params, Projected>(project: (params: Params) => Projected, collector: WarningCollector<Projected>): WarningCollector<Params>;
export declare function projectConfigWarningCollector<Params extends {
  cfg: OpenClawConfig;
}>(collector: WarningCollector<{
  cfg: OpenClawConfig;
}>): WarningCollector<Params>;
export declare function projectConfigAccountIdWarningCollector<Params extends {
  cfg: OpenClawConfig;
  accountId?: string | null;
}>(collector: WarningCollector<{
  cfg: OpenClawConfig;
  accountId?: string | null;
}>): WarningCollector<Params>;
export declare function projectAccountWarningCollector<ResolvedAccount, Params extends {
  account: ResolvedAccount;
}>(collector: WarningCollector<ResolvedAccount>): WarningCollector<Params>;
export declare function projectAccountConfigWarningCollector<ResolvedAccount, ProjectedCfg, Params extends {
  account: ResolvedAccount;
  cfg: OpenClawConfig;
}>(projectCfg: (cfg: OpenClawConfig) => ProjectedCfg, collector: WarningCollector<{
  account: ResolvedAccount;
  cfg: ProjectedCfg;
}>): WarningCollector<Params>;
declare function createSecurityAuditFindingCollector<Params>(options: {
  collectWarnings: (params: Params) => string[];
  checkId: string;
  severity: SecurityAuditFinding["severity"];
  title: string;
}): (params: Params) => SecurityAuditFinding[];
export declare const createConditionalWarningCollector: (<Params>(...collectors: Array<(params: Params) => string | string[] | null | undefined | false>) => WarningCollector<Params>) & {
  findings: typeof createSecurityAuditFindingCollector;
};
export declare function composeAccountWarningCollectors<ResolvedAccount, Params extends {
  account: ResolvedAccount;
}>(baseCollector: WarningCollector<Params>, ...collectors: Array<(account: ResolvedAccount) => string | string[] | null | undefined | false>): WarningCollector<Params>;
export declare function buildOpenGroupPolicyWarning(params: {
  surface: string;
  openBehavior: string;
  remediation: string;
}): string;
export declare function buildOpenGroupPolicyRestrictSendersWarning(params: {
  surface: string;
  openScope: string;
  groupPolicyPath: string;
  groupAllowFromPath: string;
  mentionGated?: boolean;
}): string;
declare function buildOpenGroupPolicyNoRouteAllowlistWarning(params: {
  surface: string;
  routeAllowlistPath: string;
  routeScope: string;
  groupPolicyPath: string;
  groupAllowFromPath: string;
  mentionGated?: boolean;
}): string;
export declare function buildOpenGroupPolicyConfigureRouteAllowlistWarning(params: {
  surface: string;
  openScope: string;
  groupPolicyPath: string;
  routeAllowlistPath: string;
  mentionGated?: boolean;
}): string;
export declare function collectOpenGroupPolicyRestrictSendersWarnings(params: Parameters<typeof buildOpenGroupPolicyRestrictSendersWarning>[0] & {
  groupPolicy: "open" | "allowlist" | "disabled";
}): string[];
export declare function collectAllowlistProviderRestrictSendersWarnings(params: {
  cfg: OpenClawConfig;
  providerConfigPresent: boolean;
  configuredGroupPolicy?: GroupPolicy | null;
} & Omit<Parameters<typeof collectOpenGroupPolicyRestrictSendersWarnings>[0], "groupPolicy">): string[];
/** Build an account-aware allowlist-provider warning collector for sender-restricted groups. */
export declare function createAllowlistProviderRestrictSendersWarningCollector<ResolvedAccount>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
} & Omit<Parameters<typeof collectAllowlistProviderRestrictSendersWarnings>[0], "cfg" | "providerConfigPresent" | "configuredGroupPolicy">): AccountGroupPolicyWarningCollector<ResolvedAccount>;
/** Build a direct account-aware warning collector when the policy already lives on the account. */
export declare function createOpenGroupPolicyRestrictSendersWarningCollector<ResolvedAccount>(params: {
  resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
  defaultGroupPolicy?: GroupPolicy;
} & Omit<Parameters<typeof collectOpenGroupPolicyRestrictSendersWarnings>[0], "groupPolicy">): (account: ResolvedAccount) => string[];
export declare function collectAllowlistProviderGroupPolicyWarnings(params: {
  cfg: OpenClawConfig;
  providerConfigPresent: boolean;
  configuredGroupPolicy?: GroupPolicy | null;
  collect: GroupPolicyWarningCollector;
}): string[];
/** Build a config-aware allowlist-provider warning collector from an arbitrary policy resolver. */
export declare function createAllowlistProviderGroupPolicyWarningCollector<Params extends {
  cfg: OpenClawConfig;
}>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (params: Params) => GroupPolicy | null | undefined;
  collect: (params: Params & {
    groupPolicy: GroupPolicy;
  }) => string[];
}): ConfigGroupPolicyWarningCollector<Params>;
export declare function collectOpenProviderGroupPolicyWarnings(params: {
  cfg: OpenClawConfig;
  providerConfigPresent: boolean;
  configuredGroupPolicy?: GroupPolicy | null;
  collect: GroupPolicyWarningCollector;
}): string[];
/** Build a config-aware open-provider warning collector from an arbitrary policy resolver. */
export declare function createOpenProviderGroupPolicyWarningCollector<Params extends {
  cfg: OpenClawConfig;
}>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (params: Params) => GroupPolicy | null | undefined;
  collect: (params: Params & {
    groupPolicy: GroupPolicy;
  }) => string[];
}): ConfigGroupPolicyWarningCollector<Params>;
/** Build an account-aware allowlist-provider warning collector for simple open-policy warnings. */
export declare function createAllowlistProviderOpenWarningCollector<ResolvedAccount>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
  buildOpenWarning: Parameters<typeof buildOpenGroupPolicyWarning>[0];
}): AccountGroupPolicyWarningCollector<ResolvedAccount>;
export declare function collectOpenGroupPolicyRouteAllowlistWarnings(params: {
  groupPolicy: "open" | "allowlist" | "disabled";
  routeAllowlistConfigured: boolean;
  restrictSenders: Parameters<typeof buildOpenGroupPolicyRestrictSendersWarning>[0];
  noRouteAllowlist: Parameters<typeof buildOpenGroupPolicyNoRouteAllowlistWarning>[0];
}): string[];
/** Build an account-aware allowlist-provider warning collector for route-allowlisted groups. */
export declare function createAllowlistProviderRouteAllowlistWarningCollector<ResolvedAccount>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
  resolveRouteAllowlistConfigured: (account: ResolvedAccount) => boolean;
  restrictSenders: Parameters<typeof buildOpenGroupPolicyRestrictSendersWarning>[0];
  noRouteAllowlist: Parameters<typeof buildOpenGroupPolicyNoRouteAllowlistWarning>[0];
}): AccountGroupPolicyWarningCollector<ResolvedAccount>;
export declare function collectOpenGroupPolicyConfiguredRouteWarnings(params: {
  groupPolicy: "open" | "allowlist" | "disabled";
  routeAllowlistConfigured: boolean;
  configureRouteAllowlist: Parameters<typeof buildOpenGroupPolicyConfigureRouteAllowlistWarning>[0];
  missingRouteAllowlist: Parameters<typeof buildOpenGroupPolicyWarning>[0];
}): string[];
/** Build an account-aware open-provider warning collector for configured-route channels. */
export declare function createOpenProviderConfiguredRouteWarningCollector<ResolvedAccount>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
  resolveRouteAllowlistConfigured: (account: ResolvedAccount) => boolean;
  configureRouteAllowlist: Parameters<typeof buildOpenGroupPolicyConfigureRouteAllowlistWarning>[0];
  missingRouteAllowlist: Parameters<typeof buildOpenGroupPolicyWarning>[0];
}): AccountGroupPolicyWarningCollector<ResolvedAccount>;
//#endregion
//#region src/config/group-scope-tree.d.ts
type ScopeNode = {
  requireMention?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  introHint?: string;
};
type ScopeTree = {
  defaults?: ScopeNode;
  scopes: Record<string, ScopeNode>;
};
type ScopePath = string[];
export declare const encodeScopeSegment: (value: string) => string;
export declare function scopeKey(...segments: Array<readonly [prefix: string, value: string]>): string;
type ScopeToolPolicySender = Omit<Parameters<typeof resolveToolsBySender>[0], "toolsBySender">;
export declare function buildChannelGroupsScopeTree(cfg: OpenClawConfig, channel: ChannelId, accountId?: string | null): ScopeTree;
export declare function resolveScopeKeyCaseInsensitive(tree: ScopeTree, key: string | null | undefined): string | undefined;
export declare function resolveScopeRequireMention(params: {
  tree: ScopeTree;
  path: ScopePath;
  requireMentionOverride?: boolean;
  overrideOrder?: "before-config" | "after-config";
  configuredScopeDefaultsToNoMention?: boolean;
}): boolean;
export declare function resolveScopeToolsPolicy(params: {
  tree: ScopeTree;
  path: ScopePath;
} & ScopeToolPolicySender): GroupToolPolicyConfig | undefined;
export declare function resolveScopeIntroHint(params: {
  tree: ScopeTree;
  path: ScopePath;
}): string | undefined;
//#endregion
//#region src/plugin-sdk/channel-policy.d.ts
type GroupRouteAccessDecision = {
  allowed: boolean;
  groupPolicy: GroupPolicy;
  reason: "allowed" | "disabled" | "empty_allowlist" | "route_not_allowlisted" | "route_disabled";
};
type SenderGroupAccessDecision = {
  allowed: boolean;
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
  reason: "allowed" | "disabled" | "empty_allowlist" | "sender_not_allowlisted";
};
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export declare function resolveSenderScopedGroupPolicy(params: {
  groupPolicy: GroupPolicy;
  groupAllowFrom: string[];
}): GroupPolicy;
/** @deprecated Use route descriptors with `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export declare function evaluateGroupRouteAccessForPolicy(params: {
  groupPolicy: GroupPolicy;
  routeAllowlistConfigured: boolean;
  routeMatched: boolean;
  routeEnabled?: boolean;
}): GroupRouteAccessDecision;
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export declare function evaluateSenderGroupAccessForPolicy(params: {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied?: boolean;
  groupAllowFrom: string[];
  senderId: string;
  isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
}): SenderGroupAccessDecision;
/** Normalizes allowFrom entries into trimmed unique string identifiers. */
export declare function normalizeAllowFromList(list: Array<string | number> | undefined | null): string[];
/** Coerces native feature settings to the supported boolean/auto shape. */
export declare function coerceNativeSetting(value: unknown): boolean | "auto" | undefined;
/**
 * Candidate allowlist inspected for dangerous name/email/nick matching warnings.
 * `pathLabel` is emitted in doctor output, so callers should pass the exact config path.
 */
export type ChannelMutableAllowlistCandidate = {
  pathLabel: string;
  list: unknown;
};
type StandardAllowlistScope = {
  prefix: string;
  account: Record<string, unknown>;
};
/** Collect the common account, nested-DM, and group/room allowlist paths for doctor warnings. */
export declare function collectStandardAllowlistLists(scope: StandardAllowlistScope, options?: {
  includeAllowFrom?: boolean;
  includeGroupAllowFrom?: boolean;
  includeDm?: boolean;
  includeGroups?: boolean;
  groupsKey?: string;
  groupField?: string;
}): ChannelMutableAllowlistCandidate[];
/** Build a mutable-name detector by stripping channel prefixes and recognizing stable IDs. */
export declare function buildMutableAllowEntryDetector(params: {
  prefixes?: readonly string[];
  stableIdPattern: RegExp;
}): (entry: string) => boolean;
/**
 * Create a warning collector for mutable name/email/nick allowlists while stable-id matching is required.
 * Channel plugins provide a detector for entries that depend on dangerous name matching.
 */
export declare function createDangerousNameMatchingMutableAllowlistWarningCollector(params: {
  channel: string;
  detector: (entry: string) => boolean;
  collectLists: (scope: {
    prefix: string;
    account: Record<string, unknown>;
    dangerousFlagPath: string;
  }) => ChannelMutableAllowlistCandidate[];
}): ({ cfg }: {
  cfg: OpenClawConfig;
}) => string[];
/**
 * Compose the common account-scoped DM policy resolver with restrict-senders group warnings.
 * This is the shared adapter shape for channels whose DM security and group policy live together.
 */
export declare function createRestrictSendersChannelSecurity<ResolvedAccount extends {
  accountId?: string | null;
}>(params: {
  /** Channel config key used for default account lookup and warning collection. */
  channelKey: string;
  /** Reads the account-level DM policy value before shared defaults are applied. */
  resolveDmPolicy: (account: ResolvedAccount) => string | null | undefined;
  /** Reads account-level sender allowlist entries for DM policy resolution. */
  resolveDmAllowFrom: (account: ResolvedAccount) => Array<string | number> | null | undefined;
  /** Reads the group policy value used by restrict-senders warnings. */
  resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
  /** Operator-facing surface name in warning text. */
  surface: string;
  /** Operator-facing description of who can trigger when group policy is open. */
  openScope: string;
  /** Config path shown for the group policy field that should be restricted. */
  groupPolicyPath: string;
  /** Config path shown for the group sender allowlist field. */
  groupAllowFromPath: string;
  /** Whether group replies require mentions, reducing open-policy warning severity. */
  mentionGated?: boolean;
  /** Existing channel label used by the audit and Doctor finding renderer. */
  findingTitle?: string;
  /** Override for channels whose provider presence is not the channel config key itself. */
  providerConfigPresent?: (cfg: OpenClawConfig) => boolean;
  /** Fallback account id used when scoped config inherits from another account. */
  resolveFallbackAccountId?: (account: ResolvedAccount) => string | null | undefined;
  /** Default DM policy when the account and shared defaults omit one. */
  defaultDmPolicy?: string;
  /** Account-scoped allowlist path suffix for warning/proof output. */
  allowFromPathSuffix?: string;
  /** Account-scoped policy path suffix for warning/proof output. */
  policyPathSuffix?: string;
  /** Channel id used when formatting pairing approval hints. */
  approveChannelId?: string;
  /** Explicit pairing approval hint, when the default channel hint is not correct. */
  approveHint?: string;
  /** Normalizes configured DM allowlist entries before sender matching. */
  normalizeDmEntry?: (raw: string) => string;
  classifyEntryAuthentication?: ChannelSecurityDmPolicy["classifyEntryAuthentication"];
  /** Allows non-default accounts to inherit shared defaults from the default account. */
  inheritSharedDefaultsFromDefaultAccount?: boolean;
  dmRouting?: ChannelSecurityAdapter<ResolvedAccount>["dmRouting"];
}): ChannelSecurityAdapter<ResolvedAccount>;
//#endregion
export { type ChannelGroupPolicy, DM_GROUP_ACCESS_REASON, type GroupToolPolicyBySenderConfig, type GroupToolPolicyConfig, type ScopeNode, type ScopePath, type ScopeTree, buildAccountScopedDmSecurityPolicy, readStoreAllowFromForDmPolicy, resolveChannelGroupPolicy, resolveChannelGroupRequireMention, resolveChannelGroupToolsPolicy, resolveChannelGroups, resolveChannelGroupsConfigPath, resolveDmGroupAccessWithLists, resolveEffectiveAllowFromLists, resolveOpenDmAllowlistAccess, resolveToolsBySender };