import type { OpenClawConfig } from "./config.js";
type DangerousNameMatchingConfig = {
    dangerouslyAllowNameMatching?: boolean;
};
type ProviderDangerousNameMatchingScope = {
    prefix: string;
    account: Record<string, unknown>;
    dangerousNameMatchingEnabled: boolean;
    dangerousFlagPath: string;
};
type DangerousNameMatchingResolverInput = {
    providerConfig?: DangerousNameMatchingConfig | null | undefined;
    accountConfig?: DangerousNameMatchingConfig | null | undefined;
};
/** Returns true only for the explicit dangerous name-matching opt-in flag. */
export declare function isDangerousNameMatchingEnabled(config: DangerousNameMatchingConfig | null | undefined): boolean;
/** Resolves account-level dangerous name matching, inheriting the provider flag when unset. */
export declare function resolveDangerousNameMatchingEnabled(input: DangerousNameMatchingResolverInput): boolean;
/** Collects provider/account scopes that policy and doctor surfaces can audit. */
export declare function collectProviderDangerousNameMatchingScopes(cfg: OpenClawConfig, provider: string): ProviderDangerousNameMatchingScope[];
export {};
