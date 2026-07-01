/**
 * Returns canonical config/auth-profile path patterns that do not support SecretRef values.
 */
export declare function getUnsupportedSecretRefSurfacePatterns(): string[];
/**
 * Concrete unsupported config value discovered from an openclaw.json-like object.
 */
export type UnsupportedSecretRefConfigCandidate = {
    path: string;
    value: unknown;
};
/**
 * Finds configured openclaw.json values whose surfaces currently reject SecretRef objects.
 */
export declare function collectUnsupportedSecretRefConfigCandidates(raw: unknown): UnsupportedSecretRefConfigCandidate[];
