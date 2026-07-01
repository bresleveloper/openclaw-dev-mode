/** Supported secret reference backing stores. */
export type SecretRefSource = "env" | "file" | "exec";
/** Canonical secret reference shape used after gateway resolution. */
export type SecretRef = {
    source: SecretRefSource;
    provider: string;
    id: string;
};
/** Return true when a secret input has either a literal value or resolvable reference shape. */
export declare function hasConfiguredSecretInput(value: unknown): boolean;
/** Return a canonical SecretRef when the input is a supported reference shape. */
export declare function resolveSecretInputRef(value: unknown): SecretRef | null;
/** Normalize literal secrets, or throw for refs that still require gateway resolution. */
export declare function normalizeResolvedSecretInputString(params: {
    value: unknown;
    path: string;
}): string | undefined;
/** Normalize env-provided secret values before use. */
export declare function normalizeEnvSecretInputString(value: unknown): string | undefined;
