/**
 * Describes the resolved value shape a secret target accepts after provider resolution.
 */
export type SecretExpectedResolvedValue = "string" | "string-or-object";
/**
 * Returns whether a resolved provider value satisfies the target's accepted runtime shape.
 */
export declare function isExpectedResolvedSecretValue(value: unknown, expected: SecretExpectedResolvedValue): boolean;
/**
 * Returns whether an inline configured value should be treated as plaintext secret material.
 */
export declare function hasConfiguredPlaintextSecretValue(value: unknown, expected: SecretExpectedResolvedValue): boolean;
/**
 * Throws a caller-provided error when a resolved secret value does not match its target shape.
 */
export declare function assertExpectedResolvedSecretValue(params: {
    value: unknown;
    expected: SecretExpectedResolvedValue;
    errorMessage: string;
}): void;
