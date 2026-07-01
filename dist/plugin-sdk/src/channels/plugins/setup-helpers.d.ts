/**
 * Channel setup config mutation helpers.
 *
 * Applies account names and validates setup results for channel onboarding adapters.
 */
import { type ZodType } from "zod";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ChannelSetupAdapter } from "./types.adapters.js";
import type { ChannelSetupInput } from "./types.core.js";
export declare function applyAccountNameToChannelSection(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    accountId: string;
    name?: string;
    alwaysUseAccounts?: boolean;
}): OpenClawConfig;
/** Moves a root-level channel name into `accounts.default` before adding named accounts. */
export declare function migrateBaseNameToDefaultAccount(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    alwaysUseAccounts?: boolean;
}): OpenClawConfig;
/** Applies setup-time account naming and optional root-name migration in one step. */
export declare function prepareScopedSetupConfig(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    accountId: string;
    name?: string;
    alwaysUseAccounts?: boolean;
    migrateBaseName?: boolean;
}): OpenClawConfig;
/** Applies a setup patch using account-scoped config semantics. */
export declare function applySetupAccountConfigPatch(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    accountId: string;
    patch: Record<string, unknown>;
}): OpenClawConfig;
/** Creates a setup adapter that turns validated setup input into an account config patch. */
export declare function createPatchedAccountSetupAdapter(params: {
    channelKey: string;
    alwaysUseAccounts?: boolean;
    ensureChannelEnabled?: boolean;
    ensureAccountEnabled?: boolean;
    validateInput?: ChannelSetupAdapter["validateInput"];
    buildPatch: (input: ChannelSetupInput) => Record<string, unknown>;
}): ChannelSetupAdapter;
/** Creates a Zod-backed setup input validator with an optional typed semantic check. */
export declare function createZodSetupInputValidator<T extends ChannelSetupInput>(params: {
    schema: ZodType<T>;
    validate?: (params: {
        cfg: OpenClawConfig;
        accountId: string;
        input: T;
    }) => string | null;
}): NonNullable<ChannelSetupAdapter["validateInput"]>;
type SetupInputPresenceRequirement = {
    someOf: string[];
    message: string;
};
export declare function createSetupInputPresenceValidator(params: {
    defaultAccountOnlyEnvError?: string;
    whenNotUseEnv?: SetupInputPresenceRequirement[];
    validate?: (params: {
        cfg: OpenClawConfig;
        accountId: string;
        input: ChannelSetupInput;
    }) => string | null;
}): NonNullable<ChannelSetupAdapter["validateInput"]>;
/** Creates a setup adapter that supports env-backed default account auth and patched credentials. */
export declare function createEnvPatchedAccountSetupAdapter(params: {
    channelKey: string;
    alwaysUseAccounts?: boolean;
    ensureChannelEnabled?: boolean;
    ensureAccountEnabled?: boolean;
    defaultAccountOnlyEnvError: string;
    missingCredentialError: string;
    hasCredentials: (input: ChannelSetupInput) => boolean;
    validateInput?: ChannelSetupAdapter["validateInput"];
    buildPatch: (input: ChannelSetupInput) => Record<string, unknown>;
}): ChannelSetupAdapter;
/** Patches channel config at root for default accounts or under `accounts.<id>` for named accounts. */
export declare function patchScopedAccountConfig(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    accountId: string;
    patch: Record<string, unknown>;
    accountPatch?: Record<string, unknown>;
    ensureChannelEnabled?: boolean;
    ensureAccountEnabled?: boolean;
    scopeDefaultToAccounts?: boolean;
}): OpenClawConfig;
/**
 * Promotes legacy single-account channel fields into the account map for multi-account setup.
 */
export declare function moveSingleAccountChannelSectionToDefaultAccount(params: {
    cfg: OpenClawConfig;
    channelKey: string;
}): OpenClawConfig;
export {};
