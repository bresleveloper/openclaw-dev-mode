import { createAllowlistProviderRestrictSendersWarningCollector } from "../channels/plugins/group-policy-warnings.js";
import type { ChannelSecurityAdapter } from "../channels/plugins/types.adapters.js";
import type { GroupPolicy } from "../config/types.base.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Shared policy warnings and DM/group policy helpers for channel plugins. */
export type { GroupToolPolicyBySenderConfig, GroupToolPolicyConfig, } from "../config/types.tools.js";
export { composeAccountWarningCollectors, buildOpenGroupPolicyConfigureRouteAllowlistWarning, composeWarningCollectors, createAllowlistProviderGroupPolicyWarningCollector, createConditionalWarningCollector, createAllowlistProviderOpenWarningCollector, createAllowlistProviderRouteAllowlistWarningCollector, createOpenGroupPolicyRestrictSendersWarningCollector, createOpenProviderGroupPolicyWarningCollector, createOpenProviderConfiguredRouteWarningCollector, buildOpenGroupPolicyRestrictSendersWarning, buildOpenGroupPolicyWarning, collectAllowlistProviderGroupPolicyWarnings, collectAllowlistProviderRestrictSendersWarnings, collectOpenGroupPolicyConfiguredRouteWarnings, collectOpenGroupPolicyRestrictSendersWarnings, collectOpenGroupPolicyRouteAllowlistWarnings, collectOpenProviderGroupPolicyWarnings, projectAccountConfigWarningCollector, projectAccountWarningCollector, projectConfigAccountIdWarningCollector, projectConfigWarningCollector, projectWarningCollector, } from "../channels/plugins/group-policy-warnings.js";
export { buildAccountScopedDmSecurityPolicy } from "../channels/plugins/helpers.js";
export { resolveChannelGroupPolicy, resolveChannelGroupRequireMention, resolveChannelGroupToolsPolicy, resolveToolsBySender, type ChannelGroupPolicy, } from "../config/group-policy.js";
export { DM_GROUP_ACCESS_REASON, readStoreAllowFromForDmPolicy, resolveDmGroupAccessWithCommandGate, resolveDmGroupAccessWithLists, resolveEffectiveAllowFromLists, resolveOpenDmAllowlistAccess, } from "./channel-access-compat.js";
export { evaluateGroupRouteAccessForPolicy, evaluateSenderGroupAccessForPolicy, resolveSenderScopedGroupPolicy, } from "./group-access.js";
export { createAllowlistProviderRestrictSendersWarningCollector };
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
    /** Allows non-default accounts to inherit shared defaults from the default account. */
    inheritSharedDefaultsFromDefaultAccount?: boolean;
}): ChannelSecurityAdapter<ResolvedAccount>;
