/**
 * Channel config mutation helpers.
 *
 * Updates account enabled state and detects configured secret-like values.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/**
 * Updates an account enabled flag in a channel config section.
 */
export declare function setAccountEnabledInConfigSection(params: {
    cfg: OpenClawConfig;
    sectionKey: string;
    accountId: string;
    enabled: boolean;
    allowTopLevel?: boolean;
}): OpenClawConfig;
/**
 * Deletes one account from a channel config section, pruning empty channel/accounts objects.
 */
export declare function deleteAccountFromConfigSection(params: {
    cfg: OpenClawConfig;
    sectionKey: string;
    accountId: string;
    clearBaseFields?: string[];
}): OpenClawConfig;
/**
 * Clears selected fields from one account entry and reports whether configured data was removed.
 */
export declare function clearAccountEntryFields<TAccountEntry extends object>(params: {
    accounts?: Record<string, TAccountEntry>;
    accountId: string;
    fields: string[];
    isValueSet?: (value: unknown) => boolean;
    markClearedOnFieldPresence?: boolean;
}): {
    nextAccounts?: Record<string, TAccountEntry>;
    changed: boolean;
    cleared: boolean;
};
