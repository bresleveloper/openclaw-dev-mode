/** Query helpers for discovering secret target registry entries. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DiscoveredConfigSecretTarget, ResolvedPlanTarget, SecretTargetRegistryEntry } from "./target-registry-types.js";
/**
 * Lists the full secrets target registry in public, serializable form.
 */
/** Lists all configured secret target registry entries. */
export declare function listSecretTargetRegistryEntries(): SecretTargetRegistryEntry[];
/**
 * Narrows unknown input to a target id currently present in the compiled registry.
 */
export declare function isKnownSecretTargetId(value: unknown): value is string;
/**
 * Resolves a secrets apply-plan target against registered target type and path patterns.
 */
export declare function resolvePlanTargetAgainstRegistry(candidate: {
    type: string;
    pathSegments: string[];
    providerId?: string;
    accountId?: string;
}): ResolvedPlanTarget | null;
/**
 * Resolves an openclaw.json config path to the matching plan-capable secrets target.
 */
export declare function resolveConfigSecretTargetByPath(pathSegments: string[]): ResolvedPlanTarget | null;
/**
 * Discovers configured secret-bearing values in openclaw.json using the full registry.
 */
export declare function discoverConfigSecretTargets(config: OpenClawConfig): DiscoveredConfigSecretTarget[];
/**
 * Discovers configured openclaw.json targets, optionally limited to selected registry ids.
 */
export declare function discoverConfigSecretTargetsByIds(config: OpenClawConfig, targetIds?: Iterable<string>): DiscoveredConfigSecretTarget[];
/**
 * Discovers secret-bearing values in auth-profiles.json store objects.
 */
export declare function discoverAuthProfileSecretTargets(store: unknown, targetIds?: Iterable<string>): DiscoveredConfigSecretTarget[];
/**
 * Lists auth-profile target entries that participate in plaintext/unresolved-ref audit.
 */
export declare function listAuthProfileSecretTargetEntries(): SecretTargetRegistryEntry[];
export type { AuthProfileType, DiscoveredConfigSecretTarget, ResolvedPlanTarget, SecretTargetConfigFile, SecretTargetExpected, SecretTargetRegistryEntry, SecretTargetShape, } from "./target-registry-types.js";
