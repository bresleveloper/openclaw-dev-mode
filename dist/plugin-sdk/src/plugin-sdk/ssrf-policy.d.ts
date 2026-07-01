import { isPrivateIpAddress, mergeSsrFPolicies, type LookupFn, type SsrFPolicy } from "../infra/net/ssrf.js";
import type { ChannelDoctorConfigMutation, ChannelDoctorLegacyConfigRule } from "./channel-contract.js";
import type { OpenClawConfig } from "./config-runtime.js";
export { isPrivateIpAddress, mergeSsrFPolicies };
export type { SsrFPolicy };
/** Accepted channel config shapes that opt into private-network HTTP targets. */
export type PrivateNetworkOptInInput = boolean | null | undefined | Pick<SsrFPolicy, "allowPrivateNetwork" | "dangerouslyAllowPrivateNetwork"> | {
    /** Canonical explicit opt-in for private/internal network targets. */
    dangerouslyAllowPrivateNetwork?: boolean | null;
    /** @deprecated Compatibility alias; prefer dangerouslyAllowPrivateNetwork. */
    allowPrivateNetwork?: boolean | null;
    /** Nested channel config shape used by current plugin network settings. */
    network?: Pick<SsrFPolicy, "allowPrivateNetwork" | "dangerouslyAllowPrivateNetwork"> | null | undefined;
};
/** Reads current and legacy private-network opt-in shapes from channel config. */
export declare function isPrivateNetworkOptInEnabled(input: PrivateNetworkOptInInput): boolean;
/** Converts channel private-network opt-in config into the shared SSRF policy shape. */
export declare function ssrfPolicyFromPrivateNetworkOptIn(input: PrivateNetworkOptInInput): SsrFPolicy | undefined;
/** Compatibility wrapper for callers that already use the canonical dangerous flag name. */
export declare function ssrfPolicyFromDangerouslyAllowPrivateNetwork(dangerouslyAllowPrivateNetwork: boolean | null | undefined): SsrFPolicy | undefined;
/** Detects the retired flat `allowPrivateNetwork` key before doctor migration. */
export declare function hasLegacyFlatAllowPrivateNetworkAlias(value: unknown): boolean;
/** Moves flat private-network config into `network.dangerouslyAllowPrivateNetwork`. */
export declare function migrateLegacyFlatAllowPrivateNetworkAlias(params: {
    entry: Record<string, unknown>;
    pathPrefix: string;
    changes: string[];
}): {
    entry: Record<string, unknown>;
    changed: boolean;
};
/** Build doctor rules that migrate legacy private-network aliases for one channel config. */
export declare function createLegacyPrivateNetworkDoctorContract(params: {
    channelKey: string;
}): {
    legacyConfigRules: ChannelDoctorLegacyConfigRule[];
    normalizeCompatibilityConfig: (params: {
        cfg: OpenClawConfig;
    }) => ChannelDoctorConfigMutation;
};
/** @deprecated Use `ssrfPolicyFromDangerouslyAllowPrivateNetwork`. */
export declare function ssrfPolicyFromAllowPrivateNetwork(allowPrivateNetwork: boolean | null | undefined): SsrFPolicy | undefined;
/** Allows cleartext HTTP only when the target is loopback/private or DNS-pins to private IPs. */
export declare function assertHttpUrlTargetsPrivateNetwork(url: string, params?: {
    dangerouslyAllowPrivateNetwork?: boolean | null;
    allowPrivateNetwork?: boolean | null;
    lookupFn?: LookupFn;
    errorMessage?: string;
}): Promise<void>;
/** Normalize suffix-style host allowlists into lowercase canonical entries with wildcard collapse. */
export declare function normalizeHostnameSuffixAllowlist(input?: readonly string[], defaults?: readonly string[]): string[];
/** Check whether a URL is HTTPS and its hostname matches the normalized suffix allowlist. */
export declare function isHttpsUrlAllowedByHostnameSuffixAllowlist(url: string, allowlist: readonly string[]): boolean;
/**
 * Converts suffix-style host allowlists (for example "example.com") into SSRF
 * hostname allowlist patterns used by the shared fetch guard.
 *
 * Suffix semantics:
 * - "example.com" allows "example.com" and "*.example.com"
 * - "*" disables hostname allowlist restrictions
 */
export declare function buildHostnameAllowlistPolicyFromSuffixAllowlist(allowHosts?: readonly string[]): SsrFPolicy | undefined;
