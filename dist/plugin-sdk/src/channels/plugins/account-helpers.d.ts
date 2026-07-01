import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ChannelAccountSnapshot } from "./types.core.js";
/**
 * Creates reusable account id listing and default-account resolution helpers for a channel.
 */
export declare function createAccountListHelpers(channelKey: string, options?: {
    normalizeAccountId?: (id: string) => string;
    allowUnlistedDefaultAccount?: boolean;
    implicitDefaultAccount?: {
        channelKeys?: readonly string[];
        envVars?: readonly string[];
    };
    hasImplicitDefaultAccount?: (cfg: OpenClawConfig) => boolean;
}): {
    listConfiguredAccountIds: (cfg: OpenClawConfig) => string[];
    listAccountIds: (cfg: OpenClawConfig) => string[];
    resolveDefaultAccountId: (cfg: OpenClawConfig) => string;
};
/**
 * Checks whether a config/env value should count as an account being configured.
 */
export declare function hasConfiguredAccountValue(value: unknown): boolean;
/**
 * Combines configured, additional, implicit, and fallback account ids into stable order.
 */
export declare function listCombinedAccountIds(params: {
    configuredAccountIds: Iterable<string>;
    additionalAccountIds?: Iterable<string>;
    implicitAccountId?: string | undefined;
    fallbackAccountIdWhenEmpty?: string | undefined;
}): string[];
/**
 * Resolves the default account id from a listed account set and optional configured preference.
 */
export declare function resolveListedDefaultAccountId(params: {
    accountIds: readonly string[];
    configuredDefaultAccountId?: string | undefined;
    allowUnlistedDefaultAccount?: boolean;
    ambiguousFallbackAccountId?: string | undefined;
    normalizeListedAccountId?: ((accountId: string) => string) | undefined;
}): string;
/**
 * Merges channel-level config with account-level overrides.
 */
export declare function mergeAccountConfig<TConfig extends Record<string, unknown>>(params: {
    channelConfig: TConfig | undefined;
    accountConfig: Partial<TConfig> | undefined;
    omitKeys?: string[];
    nestedObjectKeys?: string[];
}): TConfig;
/**
 * Resolves an account config by id, then merges it over channel-level defaults.
 */
export declare function resolveMergedAccountConfig<TConfig extends Record<string, unknown>>(params: {
    channelConfig: TConfig | undefined;
    accounts: Record<string, Partial<TConfig>> | undefined;
    accountId: string;
    omitKeys?: string[];
    normalizeAccountId?: (accountId: string) => string;
    nestedObjectKeys?: string[];
}): TConfig;
type AccountSnapshotInput = {
    accountId?: string | null;
    enabled?: boolean | null;
    name?: string | null | undefined;
};
/**
 * Builds a safe account snapshot for status/setup surfaces.
 */
export declare function describeAccountSnapshot(params: {
    account: AccountSnapshotInput;
    configured?: boolean | undefined;
    extra?: Record<string, unknown> | undefined;
}): ChannelAccountSnapshot;
/**
 * Builds a webhook-mode account snapshot with the standard mode field.
 */
export declare function describeWebhookAccountSnapshot(params: {
    account: AccountSnapshotInput;
    configured?: boolean | undefined;
    mode?: string | undefined;
    extra?: Record<string, unknown> | undefined;
}): ChannelAccountSnapshot;
export {};
